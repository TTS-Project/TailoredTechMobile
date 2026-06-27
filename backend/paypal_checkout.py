"""PayPal Orders v2 integration — LIVE mode.

Why direct REST and not the deprecated `paypal-checkout-serversdk`?
PayPal officially marked that SDK as legacy in 2023+ and points integrators to
the REST API. We use httpx for OAuth token + create/capture order calls.

Security model:
- The frontend NEVER sends the price/amount. It sends the list of {id, qty} from the cart.
- The backend re-derives the catalog price from the bundled SERVICES list (single source of truth),
  applies the $49.95 consultation fee, computes the 50% deposit, and that is the only amount we send to PayPal.
- Capture verifies the captured amount matches what we computed, otherwise we mark the order suspicious.
"""
from __future__ import annotations

import os
import json
import uuid
import httpx
import logging
from datetime import datetime, timezone
from typing import Optional
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, ConfigDict

logger = logging.getLogger("paypal")

# ---- Catalog mirror (price authority) --------------------------------
# We mirror just {id: starting_price} from frontend/src/data/services.js — the
# numbers MUST stay in sync. If we ever add a catalog admin UI, this becomes a DB read.
CATALOG_PRICES = {
    # AI Solutions
    "ai-automation": 1495, "ai-chatbot": 895, "ai-voice": 2495, "ai-sales": 1895,
    "ai-support": 1295, "ai-internal": 1495, "ai-marketing-auto": 1195,
    # Custom Software
    "crm-custom": 9995.95, "customer-portal": 4995, "employee-dashboard": 3495,
    "business-mgmt": 7995, "inventory": 3995, "scheduling": 2495,
    # Website Development
    "web-landing": 895, "web-business": 2495, "web-enterprise": 7995,
    "web-ecommerce": 4995, "web-redesign": 1995, "web-maintenance": 295,
    # Engineering
    "eng-calculations": 495, "eng-design": 1995, "eng-consult": 199.95,
    "eng-report": 895, "eng-cdr": 695,
    # Marketing
    "mk-content": 1495, "mk-smm": 1295, "mk-ai": 895, "mk-seo": 795,
    "mk-gbp": 295, "mk-brand": 2495,
    # Business Intelligence
    "bi-powerbi": 1995, "bi-exec": 1495, "bi-kpi": 1295, "bi-analytics": 1495,
    "bi-dbi": 1995, "bi-consult": 495,
    # Products
    "prod-promptlib": 79, "prod-templates": 99, "prod-websitepack": 149,
    "prod-agentpack": 249, "prod-cad": 129, "prod-course": 199,
    "prod-marketingkit": 89,
}
CONSULTATION_FEE = 49.95
DEPOSIT_RATIO = 0.5
CURRENCY = "USD"

# ---- PayPal API config ----------------------------------------------
def _paypal_base() -> str:
    return os.environ.get("PAYPAL_API_BASE", "https://api-m.paypal.com")


def _paypal_creds() -> tuple[str, str]:
    cid = os.environ.get("PAYPAL_CLIENT_ID")
    secret = os.environ.get("PAYPAL_CLIENT_SECRET")
    if not (cid and secret):
        raise HTTPException(status_code=500, detail="PayPal is not configured on the server.")
    return cid, secret


async def _get_access_token(client: httpx.AsyncClient) -> str:
    cid, secret = _paypal_creds()
    r = await client.post(
        f"{_paypal_base()}/v1/oauth2/token",
        auth=(cid, secret),
        data={"grant_type": "client_credentials"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=15.0,
    )
    if r.status_code != 200:
        logger.error("PayPal oauth failed: %s %s", r.status_code, r.text)
        raise HTTPException(status_code=502, detail="Could not authenticate with PayPal.")
    return r.json()["access_token"]


# ---- Pricing helpers ------------------------------------------------
class CartLine(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str = Field(min_length=1, max_length=80)
    qty: int = Field(ge=1, le=99)


class CreateOrderPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")
    items: list[CartLine] = Field(min_length=1, max_length=50)


def _round2(x: float) -> float:
    return float(f"{x:.2f}")


def _compute_amounts(items: list[CartLine]) -> dict:
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty.")
    subtotal = 0.0
    resolved = []
    for line in items:
        price = CATALOG_PRICES.get(line.id)
        if price is None:
            raise HTTPException(status_code=400, detail=f"Unknown service '{line.id}'.")
        line_total = price * line.qty
        subtotal += line_total
        resolved.append({"id": line.id, "qty": line.qty, "unit_price": price, "line_total": _round2(line_total)})
    total = subtotal + CONSULTATION_FEE
    deposit = total * DEPOSIT_RATIO
    return {
        "items": resolved,
        "subtotal": _round2(subtotal),
        "consultation_fee": CONSULTATION_FEE,
        "total": _round2(total),
        "deposit": _round2(deposit),
        "balance": _round2(total - deposit),
    }


# ---- Routes ---------------------------------------------------------
def build_paypal_router(db, get_current_user) -> APIRouter:
    router = APIRouter(prefix="/checkout", tags=["checkout"])

    @router.post("/create-order")
    async def create_order(payload: CreateOrderPayload, user: dict = Depends(get_current_user)):
        amounts = _compute_amounts(payload.items)
        internal_id = str(uuid.uuid4())

        async with httpx.AsyncClient() as client:
            token = await _get_access_token(client)
            body = {
                "intent": "CAPTURE",
                "purchase_units": [{
                    "reference_id": internal_id,
                    "description": "Tailored Tech Solutions — 50% project deposit",
                    "custom_id": user["id"],
                    "amount": {
                        "currency_code": CURRENCY,
                        "value": f"{amounts['deposit']:.2f}",
                    },
                }],
                "application_context": {
                    "brand_name": "Tailored Tech Solutions",
                    "user_action": "PAY_NOW",
                    "shipping_preference": "NO_SHIPPING",
                },
            }
            r = await client.post(
                f"{_paypal_base()}/v2/checkout/orders",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                    "PayPal-Request-Id": internal_id,
                },
                json=body,
                timeout=20.0,
            )
            if r.status_code not in (200, 201):
                logger.error("PayPal create-order failed: %s %s", r.status_code, r.text)
                raise HTTPException(status_code=502, detail="Could not create PayPal order.")
            pp = r.json()

        # Persist pending order for later reconciliation
        await db.orders.insert_one({
            "id": internal_id,
            "user_id": user["id"],
            "user_email": user["email"],
            "items": amounts["items"],
            "subtotal": amounts["subtotal"],
            "consultation_fee": amounts["consultation_fee"],
            "total": amounts["total"],
            "deposit": amounts["deposit"],
            "balance": amounts["balance"],
            "currency": CURRENCY,
            "paypal_order_id": pp["id"],
            "paypal_capture_id": None,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        return {"orderID": pp["id"], "order_id": internal_id, "amounts": amounts}

    @router.post("/capture-order/{paypal_order_id}")
    async def capture_order(paypal_order_id: str, user: dict = Depends(get_current_user)):
        order = await db.orders.find_one({"paypal_order_id": paypal_order_id, "user_id": user["id"]})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found.")
        if order.get("status") == "paid":
            return {"order_id": order["id"], "status": "paid", "alreadyCaptured": True}

        async with httpx.AsyncClient() as client:
            token = await _get_access_token(client)
            r = await client.post(
                f"{_paypal_base()}/v2/checkout/orders/{paypal_order_id}/capture",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                    "PayPal-Request-Id": f"capture-{order['id']}",
                },
                timeout=25.0,
            )
            if r.status_code not in (200, 201):
                logger.error("PayPal capture failed: %s %s", r.status_code, r.text)
                raise HTTPException(status_code=502, detail="Could not capture PayPal payment.")
            data = r.json()

        # Verify captured amount matches our deposit
        try:
            capture = data["purchase_units"][0]["payments"]["captures"][0]
            captured_value = float(capture["amount"]["value"])
            captured_currency = capture["amount"]["currency_code"]
            paypal_capture_id = capture["id"]
        except (KeyError, IndexError, ValueError) as e:
            logger.error("PayPal capture response malformed: %s — %s", e, data)
            raise HTTPException(status_code=502, detail="Malformed PayPal capture response.")

        expected = float(order["deposit"])
        amount_matches = abs(captured_value - expected) < 0.01 and captured_currency == order["currency"]
        new_status = "paid" if amount_matches else "amount_mismatch"

        await db.orders.update_one(
            {"id": order["id"]},
            {"$set": {
                "status": new_status,
                "paypal_capture_id": paypal_capture_id,
                "paid_amount": _round2(captured_value),
                "paid_at": datetime.now(timezone.utc).isoformat(),
                "paypal_capture_raw": data,
            }},
        )

        if new_status != "paid":
            logger.error("Capture amount mismatch on order %s: expected %s, got %s",
                         order["id"], expected, captured_value)
            raise HTTPException(status_code=409, detail="Captured amount did not match the deposit.")

        return {
            "order_id": order["id"],
            "status": "paid",
            "amount": _round2(captured_value),
            "paypal_capture_id": paypal_capture_id,
        }

    @router.get("/orders/{order_id}")
    async def get_order(order_id: str, user: dict = Depends(get_current_user)):
        order = await db.orders.find_one(
            {"id": order_id, "user_id": user["id"]},
            {"_id": 0, "paypal_capture_raw": 0},
        )
        if not order:
            raise HTTPException(status_code=404, detail="Order not found.")
        return {"order": order}

    @router.get("/orders")
    async def list_orders(user: dict = Depends(get_current_user)):
        cursor = db.orders.find(
            {"user_id": user["id"]},
            {"_id": 0, "paypal_capture_raw": 0},
        ).sort("created_at", -1).limit(50)
        orders = await cursor.to_list(length=50)
        return {"orders": orders}

    return router


async def setup_paypal(db) -> None:
    await db.orders.create_index("id", unique=True)
    await db.orders.create_index("user_id")
    await db.orders.create_index("paypal_order_id", unique=True)

"""Backend tests for PayPal Orders v2 integration (sandbox).

Covers:
  - POST /api/checkout/create-order: auth, math, persistence, price authority
  - POST /api/checkout/create-order: 400 unknown id, 422 empty items
  - POST /api/checkout/create-order: multi-item deposit math
  - GET  /api/checkout/orders: list orders for current user, newest first
  - GET  /api/checkout/orders/{id}: 404 for non-owner / unknown
  - POST /api/checkout/capture-order/{paypal_order_id}: 502 on un-approved order
  - Regression: /api/auth/login, /api/auth/me, /api/intake, /api/intake/count
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://custom-ai-build-7.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "gwaltney@tailoredtechsolutions.org"
ADMIN_PASSWORD = "TailoredAdmin2026!"


def _rand_email(prefix="test_pp"):
    return f"{prefix}_{uuid.uuid4().hex[:10]}@example.com"


def _register(prefix="test_pp"):
    """Register a fresh user. Returns (session, email, token)."""
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    email = _rand_email(prefix)
    r = s.post(f"{API}/auth/register",
               json={"email": email, "password": "Password123!", "name": "PP Test"})
    assert r.status_code == 201, f"register failed: {r.status_code} {r.text}"
    token = r.json()["access_token"]
    s.headers.update({"Authorization": f"Bearer {token}"})
    return s, email, token


@pytest.fixture
def authed():
    s, email, token = _register()
    return {"session": s, "email": email, "token": token}


# ---------- create-order ----------
class TestCreateOrder:
    def test_unauth_returns_401(self):
        r = requests.post(f"{API}/checkout/create-order",
                          json={"items": [{"id": "ai-chatbot", "qty": 1}]})
        assert r.status_code == 401, r.text

    def test_unknown_item_returns_400(self, authed):
        s = authed["session"]
        r = s.post(f"{API}/checkout/create-order",
                   json={"items": [{"id": "does-not-exist", "qty": 1}]})
        assert r.status_code == 400, r.text
        assert "unknown service" in r.json().get("detail", "").lower()

    def test_empty_items_returns_422(self, authed):
        s = authed["session"]
        r = s.post(f"{API}/checkout/create-order", json={"items": []})
        assert r.status_code == 422, r.text

    def test_single_item_math_and_persistence(self, authed):
        s = authed["session"]
        r = s.post(f"{API}/checkout/create-order",
                   json={"items": [{"id": "ai-chatbot", "qty": 1}]})
        assert r.status_code == 200, r.text
        body = r.json()
        # Returned structure
        assert "orderID" in body and "order_id" in body and "amounts" in body
        amounts = body["amounts"]
        # subtotal=895, total=944.95, deposit=472.48 (rounded)
        assert amounts["subtotal"] == 895.0
        assert amounts["consultation_fee"] == 49.95
        assert amounts["total"] == 944.95
        assert abs(amounts["deposit"] - 472.48) < 0.01
        assert abs(amounts["balance"] - 472.47) < 0.01
        assert body["orderID"]  # PayPal id present
        # Verify persistence via GET /orders/{id}
        oid = body["order_id"]
        r2 = s.get(f"{API}/checkout/orders/{oid}")
        assert r2.status_code == 200, r2.text
        order = r2.json()["order"]
        assert order["status"] == "pending"
        assert order["paypal_order_id"] == body["orderID"]
        assert abs(order["deposit"] - 472.48) < 0.01
        assert order["items"][0]["id"] == "ai-chatbot"
        assert order["items"][0]["unit_price"] == 895
        # No mongo _id leaking
        assert "_id" not in order

    def test_multi_item_deposit_math(self, authed):
        s = authed["session"]
        r = s.post(f"{API}/checkout/create-order",
                   json={"items": [{"id": "ai-chatbot", "qty": 1}, {"id": "web-landing", "qty": 1}]})
        assert r.status_code == 200, r.text
        a = r.json()["amounts"]
        # subtotal = 895 + 895 = 1790; total = 1839.95; deposit = 919.975 -> 919.98
        assert a["subtotal"] == 1790.0
        assert a["total"] == 1839.95
        assert abs(a["deposit"] - 919.98) < 0.01

    def test_price_authority_ignores_client_price(self, authed):
        """Client-supplied price MUST be ignored — backend uses catalog only."""
        s = authed["session"]
        # Send a bogus 'price' field; CartLine ignores extra fields by default in pydantic v2 (model_config not strict).
        r = s.post(f"{API}/checkout/create-order",
                   json={"items": [{"id": "ai-chatbot", "qty": 1, "price": 0.01}]})
        assert r.status_code == 200, r.text
        oid = r.json()["order_id"]
        r2 = s.get(f"{API}/checkout/orders/{oid}")
        assert r2.status_code == 200
        order = r2.json()["order"]
        # Catalog price 895 must be persisted, NOT 0.01
        assert order["items"][0]["unit_price"] == 895
        assert order["items"][0]["line_total"] == 895.0
        assert order["subtotal"] == 895.0


# ---------- list / get ----------
class TestOrdersListAndGet:
    def test_list_orders_newest_first(self, authed):
        s = authed["session"]
        # Create 2 orders
        s.post(f"{API}/checkout/create-order",
               json={"items": [{"id": "web-landing", "qty": 1}]})
        r2 = s.post(f"{API}/checkout/create-order",
                    json={"items": [{"id": "ai-chatbot", "qty": 2}]})
        second_id = r2.json()["order_id"]
        r = s.get(f"{API}/checkout/orders")
        assert r.status_code == 200, r.text
        orders = r.json()["orders"]
        assert len(orders) >= 2
        # Newest first => the order we just created should be at index 0
        assert orders[0]["id"] == second_id

    def test_get_order_404_when_not_owner(self, authed):
        s = authed["session"]
        r = s.post(f"{API}/checkout/create-order",
                   json={"items": [{"id": "ai-chatbot", "qty": 1}]})
        oid = r.json()["order_id"]
        # New user must not see it
        other_s, _, _ = _register("test_pp_other")
        r2 = other_s.get(f"{API}/checkout/orders/{oid}")
        assert r2.status_code == 404, r2.text

    def test_get_unknown_order_404(self, authed):
        s = authed["session"]
        r = s.get(f"{API}/checkout/orders/{uuid.uuid4()}")
        assert r.status_code == 404


# ---------- capture (un-approved) ----------
class TestCaptureUnapproved:
    def test_capture_unapproved_order_returns_502(self, authed):
        s = authed["session"]
        r = s.post(f"{API}/checkout/create-order",
                   json={"items": [{"id": "ai-chatbot", "qty": 1}]})
        paypal_id = r.json()["orderID"]
        # Try to capture without buyer approval — PayPal will reject => 502
        r2 = s.post(f"{API}/checkout/capture-order/{paypal_id}")
        assert r2.status_code == 502, f"Expected 502 on unapproved capture, got {r2.status_code}: {r2.text}"


# ---------- Regression ----------
class TestRegression:
    def test_login_still_works(self):
        r = requests.post(f"{API}/auth/login",
                          json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        assert r.json()["user"]["role"] == "admin"

    def test_me_still_works(self, authed):
        s = authed["session"]
        r = s.get(f"{API}/auth/me")
        assert r.status_code == 200
        assert r.json()["user"]["email"] == authed["email"]

    def test_intake_and_count(self):
        s = requests.Session()
        s.headers.update({"Content-Type": "application/json"})
        before = s.get(f"{API}/intake/count").json()["count"]
        payload = {
            "contact": {"name": "TEST PP Intake", "email": _rand_email("test_pp_intake"), "company": "PPCo"},
            "answers": {"q1": "Test"},
            "meta": {"submittedAt": "2026-01-01T00:00:00Z"},
        }
        r = s.post(f"{API}/intake", json=payload)
        assert r.status_code == 200
        assert r.json()["ok"] is True
        after = s.get(f"{API}/intake/count").json()["count"]
        assert after == before + 1

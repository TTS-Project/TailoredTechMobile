"""JWT-based email/password auth for Tailored Tech Solutions.

Follows the integration_playbook_expert_v2 playbook:
- bcrypt password hashing
- JWT access (15m) + refresh (7d) tokens in httpOnly cookies (+ Authorization Bearer fallback)
- Brute-force protection via `login_attempts` collection (5 fails => 15min lockout)
- Open sign-up (anyone can register); first admin is seeded from env on startup.
"""
from __future__ import annotations

import os
import re
import bcrypt
import jwt
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, EmailStr, Field, field_validator

JWT_ALGORITHM = "HS256"
ACCESS_TTL_MIN = 15
REFRESH_TTL_DAYS = 7
COOKIE_ACCESS = "access_token"
COOKIE_REFRESH = "refresh_token"
MAX_LOGIN_FAILS = 5
LOCKOUT_MINUTES = 15

EMAIL_RX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# ---------- Password helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        return False


# ---------- JWT helpers ----------
def _secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TTL_MIN),
    }
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TTL_DAYS),
    }
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)


def _set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    # In preview/prod served over HTTPS we keep secure=True+samesite=None so the cookie
    # crosses the kubernetes ingress preview origin properly.
    secure = True
    same_site = "none"
    response.set_cookie(COOKIE_ACCESS, access, httponly=True, secure=secure, samesite=same_site,
                        max_age=ACCESS_TTL_MIN * 60, path="/")
    response.set_cookie(COOKIE_REFRESH, refresh, httponly=True, secure=secure, samesite=same_site,
                        max_age=REFRESH_TTL_DAYS * 86400, path="/")


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(COOKIE_ACCESS, path="/")
    response.delete_cookie(COOKIE_REFRESH, path="/")


# ---------- Pydantic schemas ----------
class RegisterPayload(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=80)

    @field_validator("name")
    @classmethod
    def _strip_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name is required")
        return v


class LoginPayload(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class PublicUser(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str = "user"
    created_at: str


def _public(user: dict) -> dict:
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "user"),
        "created_at": user.get("created_at", ""),
    }


# ---------- Auth dependency ----------
def make_get_current_user(db):
    async def get_current_user(request: Request) -> dict:
        token = request.cookies.get(COOKIE_ACCESS)
        if not token:
            ah = request.headers.get("Authorization", "")
            if ah.startswith("Bearer "):
                token = ah[7:]
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
        try:
            payload = jwt.decode(token, _secret(), algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    return get_current_user


# ---------- Brute force tracker ----------
async def _record_failed_login(db, identifier: str) -> None:
    await db.login_attempts.update_one(
        {"identifier": identifier},
        {"$inc": {"count": 1}, "$set": {"last_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )


async def _check_locked_out(db, identifier: str) -> Optional[int]:
    """Return seconds remaining if locked, else None."""
    doc = await db.login_attempts.find_one({"identifier": identifier})
    if not doc or doc.get("count", 0) < MAX_LOGIN_FAILS:
        return None
    last_at = doc.get("last_at")
    if not last_at:
        return None
    try:
        last = datetime.fromisoformat(last_at)
    except ValueError:
        return None
    unlock_at = last + timedelta(minutes=LOCKOUT_MINUTES)
    now = datetime.now(timezone.utc)
    if now >= unlock_at:
        await db.login_attempts.delete_one({"identifier": identifier})
        return None
    return int((unlock_at - now).total_seconds())


async def _clear_failed_logins(db, identifier: str) -> None:
    await db.login_attempts.delete_one({"identifier": identifier})


# ---------- Routes ----------
def build_auth_router(db) -> APIRouter:
    router = APIRouter(prefix="/auth", tags=["auth"])
    get_current_user = make_get_current_user(db)

    @router.post("/register", status_code=201)
    async def register(payload: RegisterPayload, response: Response):
        email = payload.email.lower().strip()
        existing = await db.users.find_one({"email": email})
        if existing:
            raise HTTPException(status_code=409, detail="An account with that email already exists.")
        now = datetime.now(timezone.utc).isoformat()
        user_doc = {
            "id": str(uuid.uuid4()),
            "email": email,
            "name": payload.name.strip(),
            "password_hash": hash_password(payload.password),
            "role": "user",
            "created_at": now,
        }
        await db.users.insert_one(user_doc)
        access = create_access_token(user_doc["id"], email)
        refresh = create_refresh_token(user_doc["id"])
        _set_auth_cookies(response, access, refresh)
        return {"user": _public(user_doc), "access_token": access}

    @router.post("/login")
    async def login(payload: LoginPayload, request: Request, response: Response):
        email = payload.email.lower().strip()
        # Key lockout on email alone — `request.client.host` returns the ingress pod IP
        # in K8s (multiple pods rotate), splitting the counter and defeating the lockout.
        identifier = f"email:{email}"
        _ = request  # kept for future per-IP enhancements

        remaining = await _check_locked_out(db, identifier)
        if remaining is not None:
            raise HTTPException(status_code=429, detail=f"Too many failed attempts. Try again in {remaining // 60 + 1} minutes.")

        user = await db.users.find_one({"email": email})
        if not user or not verify_password(payload.password, user.get("password_hash", "")):
            await _record_failed_login(db, identifier)
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        await _clear_failed_logins(db, identifier)
        access = create_access_token(user["id"], email)
        refresh = create_refresh_token(user["id"])
        _set_auth_cookies(response, access, refresh)
        return {"user": _public(user), "access_token": access}

    @router.post("/logout")
    async def logout(response: Response, user: dict = Depends(get_current_user)):
        _clear_auth_cookies(response)
        return {"ok": True}

    @router.get("/me")
    async def me(user: dict = Depends(get_current_user)):
        return {"user": _public(user)}

    @router.post("/refresh")
    async def refresh(request: Request, response: Response):
        token = request.cookies.get(COOKIE_REFRESH)
        if not token:
            raise HTTPException(status_code=401, detail="No refresh token")
        try:
            payload = jwt.decode(token, _secret(), algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Refresh token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token(user["id"], user["email"])
        new_refresh = create_refresh_token(user["id"])
        _set_auth_cookies(response, access, new_refresh)
        return {"user": _public(user), "access_token": access}

    return router


# ---------- Startup: indexes + admin seed ----------
async def setup_auth(db) -> None:
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.login_attempts.create_index("identifier")

    admin_email = os.environ.get("ADMIN_EMAIL")
    admin_password = os.environ.get("ADMIN_PASSWORD")
    if not (admin_email and admin_password):
        return
    admin_email = admin_email.lower().strip()
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "name": "Tailored Tech Admin",
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )

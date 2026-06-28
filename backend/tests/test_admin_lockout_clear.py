"""Targeted regression: admin lockout MUST be cleared on backend startup.

Bug context: cross-device login attempts (tablet + desktop) accumulated failed-login
counts against the admin email, semi-permanently locking the admin out. Fix wipes
admin's login_attempts row on every backend startup. This file verifies:

  1. Admin gets locked out after 5 failed attempts within a single deploy cycle (429).
  2. After backend restart (supervisorctl) the admin can immediately log in (200).
  3. Non-admin lockout SURVIVES the restart (only the admin counter is cleared).
  4. Admin login response has user+access_token AND sets access_token+refresh_token
     cookies with HttpOnly + Secure + SameSite=None.
  5. /api/auth/me works with Authorization: Bearer (no cookies)  — cross-device fallback.
  6. /api/auth/me works with only the cookie (primary path).
"""
import os
import subprocess
import time
import uuid

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://custom-ai-build-7.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "gwaltney@tailoredtechsolutions.org"
ADMIN_PASSWORD = "0neSpeed!"


def _rand_email(prefix="test_lock"):
    return f"{prefix}_{uuid.uuid4().hex[:10]}@example.com"


def _restart_backend_and_wait():
    """Restart backend via supervisor, then poll /api/auth/me (401) until live."""
    subprocess.run(["sudo", "supervisorctl", "restart", "backend"], check=True,
                   capture_output=True, timeout=30)
    # Poll for readiness: /api/auth/me with no auth should return 401 once up.
    deadline = time.time() + 30
    while time.time() < deadline:
        try:
            r = requests.get(f"{API}/auth/me", timeout=3)
            if r.status_code == 401:
                return
        except requests.RequestException:
            pass
        time.sleep(0.5)
    raise RuntimeError("Backend did not come back online within 30s after restart.")


@pytest.fixture
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- 1. Admin login baseline + cookie/auth-token shape ----
class TestAdminLoginShape:
    def test_admin_login_returns_token_and_cookies(self):
        s = requests.Session()
        r = s.post(f"{API}/auth/login",
                   json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
        body = r.json()
        assert "user" in body and "access_token" in body
        assert body["user"]["email"] == ADMIN_EMAIL
        assert body["user"]["role"] == "admin"
        # Cookie shape — both names present.
        cookies_by_name = {c.name: c for c in r.cookies}
        assert "access_token" in cookies_by_name
        assert "refresh_token" in cookies_by_name
        # Header-level check: Secure + HttpOnly + SameSite=None must be present in Set-Cookie strings.
        raw_set_cookie = "\n".join(r.headers.get_list("set-cookie")) if hasattr(r.headers, "get_list") else r.headers.get("set-cookie", "")
        assert "access_token=" in raw_set_cookie
        assert "HttpOnly" in raw_set_cookie
        assert "Secure" in raw_set_cookie
        assert "SameSite=None" in raw_set_cookie or "samesite=none" in raw_set_cookie.lower()

    def test_me_with_bearer_token_only(self):
        # Cross-device fallback path: no cookies, just Authorization header.
        login = requests.post(f"{API}/auth/login",
                              json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert login.status_code == 200
        token = login.json()["access_token"]
        r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200, r.text
        assert r.json()["user"]["email"] == ADMIN_EMAIL

    def test_me_with_cookie_only(self):
        s = requests.Session()
        login = s.post(f"{API}/auth/login",
                       json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert login.status_code == 200
        # Strip Authorization usage entirely — only cookie carried by Session.
        r = s.get(f"{API}/auth/me")
        assert r.status_code == 200, r.text
        assert r.json()["user"]["email"] == ADMIN_EMAIL


# ---- 2. Lockout still fires for admin within one deploy cycle ----
class TestAdminLockoutBeforeRestart:
    def test_admin_locked_out_after_5_failures(self):
        # Five wrong-password attempts then a 6th — should yield 429 with documented detail.
        statuses = []
        for _ in range(5):
            r = requests.post(f"{API}/auth/login",
                              json={"email": ADMIN_EMAIL, "password": "DefinitelyWrong!"})
            statuses.append(r.status_code)
        assert all(s == 401 for s in statuses), f"Expected first 5 to be 401, got {statuses}"
        r6 = requests.post(f"{API}/auth/login",
                           json={"email": ADMIN_EMAIL, "password": "DefinitelyWrong!"})
        assert r6.status_code == 429, f"Expected 429, got {r6.status_code}: {r6.text}"
        assert r6.json().get("detail", "").startswith("Too many failed attempts")

        # And even the CORRECT password is rejected while locked.
        r_correct = requests.post(f"{API}/auth/login",
                                  json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r_correct.status_code == 429, (
            f"Correct password should also be rejected while locked, got {r_correct.status_code}: {r_correct.text}"
        )


# ---- 3. The bug fix: restart clears admin lockout ----
class TestRestartClearsAdminLockout:
    def test_restart_unlocks_admin_but_not_other_users(self, session):
        # Step A: lock out a NON-admin user (must remain locked after restart).
        other_email = _rand_email("test_other")
        reg = session.post(f"{API}/auth/register",
                           json={"email": other_email, "password": "Password123!", "name": "Other"})
        assert reg.status_code == 201
        # 5 wrong attempts to lock out the non-admin
        for _ in range(5):
            requests.post(f"{API}/auth/login",
                          json={"email": other_email, "password": "wrong-pw"})
        # 6th should be 429
        r6_other = requests.post(f"{API}/auth/login",
                                 json={"email": other_email, "password": "wrong-pw"})
        assert r6_other.status_code == 429, f"Non-admin should be locked, got {r6_other.status_code}"

        # Step B: lock out the admin too within this cycle
        for _ in range(6):
            requests.post(f"{API}/auth/login",
                          json={"email": ADMIN_EMAIL, "password": "DefinitelyWrong!"})
        r_admin_locked = requests.post(f"{API}/auth/login",
                                       json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r_admin_locked.status_code == 429, (
            f"Pre-restart sanity: admin should be locked, got {r_admin_locked.status_code}"
        )

        # Step C: restart backend (simulates a deploy).
        _restart_backend_and_wait()

        # Step D: admin can immediately log in with the correct password.
        r_admin_after = requests.post(f"{API}/auth/login",
                                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r_admin_after.status_code == 200, (
            f"Admin should be unlocked after restart, got {r_admin_after.status_code}: {r_admin_after.text}"
        )
        assert r_admin_after.json()["user"]["email"] == ADMIN_EMAIL

        # Step E: the non-admin is STILL locked (only admin gets the wipe).
        r_other_after = requests.post(f"{API}/auth/login",
                                      json={"email": other_email, "password": "Password123!"})
        assert r_other_after.status_code == 429, (
            f"Non-admin must remain locked after restart, got {r_other_after.status_code}: {r_other_after.text}"
        )

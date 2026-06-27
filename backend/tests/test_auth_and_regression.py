"""Backend tests for JWT auth + intake/status regression.

Covers:
  - register (201, 409 duplicate, 422 invalid)
  - login (200 + cookies, 401 wrong pw)
  - /auth/me with cookie AND bearer; 401 unauth
  - logout clears cookies
  - brute-force lockout after 5 failed logins -> 429
  - seeded admin can log in
  - regression: /api/status (GET/POST), /api/intake, /api/intake/count
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://custom-ai-build-7.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "gwaltney@tailoredtechsolutions.org"
ADMIN_PASSWORD = "TailoredAdmin2026!"


def _rand_email(prefix="test_user"):
    # Backend lowercases emails on store; keep tests lowercase for clean equality.
    return f"{prefix}_{uuid.uuid4().hex[:10]}@example.com"


@pytest.fixture
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Register ----------
class TestRegister:
    def test_register_success(self, session):
        email = _rand_email()
        r = session.post(f"{API}/auth/register",
                         json={"email": email, "password": "Password123!", "name": "Test User"})
        assert r.status_code == 201, r.text
        body = r.json()
        assert "user" in body and "access_token" in body
        assert body["user"]["email"] == email
        assert body["user"]["name"] == "Test User"
        assert body["user"]["role"] == "user"
        assert "password_hash" not in body["user"]
        # Cookies set
        cookies = {c.name: c for c in r.cookies}
        assert "access_token" in cookies
        assert "refresh_token" in cookies

    def test_register_duplicate_email_409(self, session):
        email = _rand_email("test_dup")
        r1 = session.post(f"{API}/auth/register",
                          json={"email": email, "password": "Password123!", "name": "Dup"})
        assert r1.status_code == 201
        r2 = session.post(f"{API}/auth/register",
                          json={"email": email, "password": "Password123!", "name": "Dup2"})
        assert r2.status_code == 409
        assert "already exists" in r2.json().get("detail", "").lower()

    def test_register_invalid_email_422(self, session):
        r = session.post(f"{API}/auth/register",
                         json={"email": "not-an-email", "password": "Password123!", "name": "X"})
        assert r.status_code == 422

    def test_register_short_password_422(self, session):
        r = session.post(f"{API}/auth/register",
                         json={"email": _rand_email(), "password": "abc", "name": "X"})
        assert r.status_code == 422


# ---------- Login ----------
class TestLogin:
    def test_login_success_and_cookies(self, session):
        email = _rand_email("test_login")
        session.post(f"{API}/auth/register",
                     json={"email": email, "password": "Password123!", "name": "Login User"})
        # Fresh session to validate cookies
        s2 = requests.Session()
        r = s2.post(f"{API}/auth/login", json={"email": email, "password": "Password123!"})
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["user"]["email"] == email
        assert "access_token" in body
        assert "access_token" in s2.cookies
        assert "refresh_token" in s2.cookies

    def test_login_wrong_password_401(self, session):
        email = _rand_email("test_wrongpw")
        session.post(f"{API}/auth/register",
                     json={"email": email, "password": "Password123!", "name": "WP"})
        r = session.post(f"{API}/auth/login", json={"email": email, "password": "WrongPassword!"})
        assert r.status_code == 401

    def test_login_seeded_admin(self):
        r = requests.post(f"{API}/auth/login",
                          json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
        body = r.json()
        assert body["user"]["email"] == ADMIN_EMAIL
        assert body["user"]["role"] == "admin"


# ---------- /me + logout ----------
class TestMeAndLogout:
    def test_me_requires_auth(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_bearer_token(self, session):
        email = _rand_email("test_bearer")
        reg = session.post(f"{API}/auth/register",
                           json={"email": email, "password": "Password123!", "name": "Bearer U"})
        token = reg.json()["access_token"]
        r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200
        body = r.json()
        assert body["user"]["email"] == email
        assert "password_hash" not in body["user"]

    def test_me_with_cookie(self):
        email = _rand_email("test_cookie")
        s = requests.Session()
        s.post(f"{API}/auth/register",
               json={"email": email, "password": "Password123!", "name": "Cookie U"})
        r = s.get(f"{API}/auth/me")
        assert r.status_code == 200
        assert r.json()["user"]["email"] == email

    def test_logout_clears_cookies(self):
        email = _rand_email("test_logout")
        s = requests.Session()
        s.post(f"{API}/auth/register",
               json={"email": email, "password": "Password123!", "name": "Out U"})
        # Confirm authed
        assert s.get(f"{API}/auth/me").status_code == 200
        r = s.post(f"{API}/auth/logout")
        assert r.status_code == 200
        assert r.json().get("ok") is True
        # New session with no cookies must be 401
        s.cookies.clear()
        assert s.get(f"{API}/auth/me").status_code == 401


# ---------- Brute force ----------
class TestBruteForce:
    def test_lockout_after_5_failures(self, session):
        email = _rand_email("test_brute")
        session.post(f"{API}/auth/register",
                     json={"email": email, "password": "Password123!", "name": "Brute"})
        # First 5 wrong-password attempts should return 401.
        statuses = []
        for i in range(5):
            r = session.post(f"{API}/auth/login",
                             json={"email": email, "password": "wrongpass"})
            statuses.append(r.status_code)
        assert all(s == 401 for s in statuses), f"Expected first 5 to be 401, got {statuses}"
        # 6th attempt MUST be 429 with the documented detail prefix.
        r6 = session.post(f"{API}/auth/login",
                          json={"email": email, "password": "wrongpass"})
        assert r6.status_code == 429, f"Expected 429 on 6th attempt, got {r6.status_code}: {r6.text}"
        detail = r6.json().get("detail", "")
        assert detail.startswith("Too many failed attempts"), f"Unexpected detail: {detail}"

    def test_successful_login_clears_counter(self, session):
        """A successful login before 5 fails must reset the counter so subsequent fails don't lock out immediately."""
        email = _rand_email("test_brute_clear")
        session.post(f"{API}/auth/register",
                     json={"email": email, "password": "Password123!", "name": "Brute Clear"})
        # 3 wrong attempts
        for _ in range(3):
            r = session.post(f"{API}/auth/login",
                             json={"email": email, "password": "wrongpass"})
            assert r.status_code == 401
        # Correct login clears counter
        ok = session.post(f"{API}/auth/login",
                          json={"email": email, "password": "Password123!"})
        assert ok.status_code == 200
        # Now 3 more wrong attempts should still be 401 (not 429) because counter was cleared
        for _ in range(3):
            r = session.post(f"{API}/auth/login",
                             json={"email": email, "password": "wrongpass"})
            assert r.status_code == 401, f"Counter not cleared after successful login: {r.status_code}"


# ---------- Regression: existing endpoints still work ----------
class TestRegression:
    def test_status_post_and_get(self, session):
        name = f"TEST_status_{uuid.uuid4().hex[:8]}"
        r = session.post(f"{API}/status", json={"client_name": name})
        assert r.status_code == 200, r.text
        assert r.json()["client_name"] == name
        r2 = session.get(f"{API}/status")
        assert r2.status_code == 200
        assert any(item["client_name"] == name for item in r2.json())

    def test_intake_submit_and_count(self, session):
        before = session.get(f"{API}/intake/count").json()["count"]
        payload = {
            "contact": {
                "name": "TEST Intake",
                "email": _rand_email("test_intake"),
                "company": "TestCo",
            },
            "answers": {"q1": "Test", "q5": 7},
            "meta": {"submittedAt": "2026-01-01T00:00:00Z"},
        }
        r = session.post(f"{API}/intake", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["ok"] is True and body["stored"] is True
        after = session.get(f"{API}/intake/count").json()["count"]
        assert after == before + 1

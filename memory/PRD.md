# Tailored Tech Solutions — PRD

## Original Problem Statement
Pixel-perfect "Tailored Tech Solutions" website with extensive mobile UX, Interactive Projects Dashboard, 7-role Terra Farming dashboard, AI Readiness Intake Form, Service Catalog + Cart + Checkout, Apple-quality Auth Gate, and real PayPal payments (50% deposit).

## Stack
- React + React Router + Tailwind + shadcn/ui + lucide-react + @paypal/react-paypal-js
- FastAPI + Motor + MongoDB + PyJWT + bcrypt + httpx (for PayPal REST v2)
- localStorage for cart persistence; httpOnly cookies + Bearer fallback for auth

## Completed (Feb 2026)
- ✅ SnapScrollHero (7-section)
- ✅ Mobile responsiveness overhaul
- ✅ Interactive Projects Dashboard
- ✅ Terra Farming 7-role dashboard
- ✅ Logo (header + footer)
- ✅ AI Readiness Diagnostic Intake Form (POST /api/intake → Mongo)
- ✅ Service Catalog + Cart + Checkout (40+ emoji services, 7 categories)
- ✅ Apple-quality Auth Gate (JWT, bcrypt, brute-force lockout, avatar dropdown) — 15/15 backend tests
- ✅ **Real PayPal integration (Feb 2026)** — `/api/checkout/create-order` + `/api/checkout/capture-order/{id}` + order list/detail. Backend is the price authority (CATALOG_PRICES dict; clients only send {id, qty}; extra fields rejected via Pydantic `extra=forbid`). Frontend uses `@paypal/react-paypal-js` Smart Buttons. On success → redirect to `/intake?paid=true&order={id}` with a green "Payment Received" banner. **Currently in SANDBOX mode** (user's keys are sandbox credentials). 13/13 backend PayPal tests pass + 15/15 auth regression. Frontend iframe + flow verified.

## Routes
- `/` Home (Hero public; everything below behind AuthGate)
- `/projects` Projects index
- `/intake` AI Readiness diagnostic (renders success banner if `?paid=true&order=...`)
- `/checkout` Cart + PayPal Smart Buttons

## DB Schema
- `users { id, email, name, password_hash, role, created_at }` — unique on email, id
- `login_attempts { identifier='email:{email}', count, last_at }`
- `orders { id, user_id, user_email, items[], subtotal, consultation_fee, total, deposit, balance, currency, paypal_order_id, paypal_capture_id, paid_amount, status, created_at, paid_at, paypal_capture_raw }`
- `status_checks`, `intake_submissions`

## API Endpoints
- `POST /api/auth/register|login|logout|refresh` · `GET /api/auth/me`
- `POST /api/checkout/create-order` (auth) — re-prices from server-side catalog, creates PayPal order
- `POST /api/checkout/capture-order/{paypal_order_id}` (auth) — captures, verifies amount, persists
- `GET  /api/checkout/orders` (auth) — list user's orders
- `GET  /api/checkout/orders/{order_id}` (auth) — single order
- `POST /api/intake` · `GET /api/`

## P0 Backlog
- 🔴 **Switch PayPal to LIVE mode** — current credentials are SANDBOX (verified). To go live: user generates LIVE REST API keys at https://developer.paypal.com → Apps & Credentials → Live → New App, then we swap PAYPAL_API_BASE to `https://api-m.paypal.com` and replace PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET in `/app/backend/.env` and the same client id in `/app/frontend/.env`.
- 🔴 **SMTP email delivery** for intake leads — blocked on valid 16-char Google App Password.

## P1 Backlog
- Money math → Decimal (currently float arithmetic — safe today but hardening before live).
- CI check that asserts `paypal_checkout.CATALOG_PRICES` matches `frontend/src/data/services.js` (prices can drift silently today).
- Refactor `create-order` to insert a `creating` doc BEFORE calling PayPal (avoids leaked PayPal orders if our DB write fails after PayPal 201).
- `/account` page — "My Orders" history (the orders collection already supports this).
- AI Reality Lab (Ask AI, Estimator, Contract Analyzer, Brand Kit).
- Password reset + email verification.
- Refresh-token denylist on rotation.
- COOKIE_SECURE env toggle for local HTTP dev.

## Known Mocks / Placeholders
- 🟡 **PayPal in SANDBOX mode** — no real money moves yet. Test buyer accounts at sandbox.paypal.com work for end-to-end pay testing.
- 🔴 **SMTP email** — pending valid credentials.

## Test IDs
**Catalog/Cart**: `service-cat-{id}`, `service-card-{id}`, `service-modal-add-to-cart`, `service-modal-close`, `nav-cart-button[-mobile]`, `nav-cart-count`, `cart-item-{id}`, `checkout-back-home`, `checkout-deposit-amount`, `checkout-paypal-container`, `checkout-signin-prompt`, `checkout-error`.
**Auth**: `auth-gate-wrapper|overlay|locked-content`, `auth-toggle-register|login`, `auth-name|email|password|submit|error`, `user-menu-{trigger|panel|signout}-{desktop|mobile}`.
**Intake**: `intake-payment-success`.

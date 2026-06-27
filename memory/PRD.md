# Tailored Tech Solutions — PRD

## Original Problem Statement
Pixel-perfect clone of the "Tailored Tech Solutions" website with extensive mobile UI/UX optimization, plus an Interactive Projects Dashboard, an interactive 7-role "Terra Farming" dashboard, an AI Readiness Diagnostic Intake Form, a comprehensive Service Catalog with Shopping Cart & Checkout, an Apple-quality Authentication Gate, and future enhancements (AI Reality Lab).

## Stack
- React + React Router + Tailwind + shadcn/ui + lucide-react
- FastAPI + Motor + MongoDB + PyJWT + bcrypt
- localStorage for cart persistence; httpOnly cookies + Bearer fallback for auth

## Completed (as of Feb 2026)
- ✅ SnapScrollHero (7-section) with complex CSS animations
- ✅ Full mobile responsiveness overhaul
- ✅ Interactive Projects Dashboard
- ✅ "Terra Farming" 7-role interactive dashboard
- ✅ Transparent logo with CSS circuit aura (header + footer)
- ✅ AI Readiness Diagnostic Intake Form (POST /api/intake → Mongo)
- ✅ Footer cleanup
- ✅ **Service Catalog + Cart + Checkout (Feb 2026)** — 40+ emoji-prefixed services across 7 categories; ServiceModal; CartContext persisted to localStorage; $49.95 AI Consultation auto-included; 50% deposit math; Nav cart badge; PayPal placeholder. 10/10 e2e tests passed.
- ✅ **Apple-quality Authentication Gate (Feb 2026)** — JWT-based custom auth (POST /api/auth/register|login|logout|refresh|me), bcrypt password hashing, httpOnly access (15m) + refresh (7d) cookies, Bearer fallback, brute-force lockout (5 fails → 15min, keyed on email to survive K8s ingress pod rotation), admin auto-seeded from env. Frontend: AuthContext + AuthGate (frosted glass capped at one viewport so user can't scroll past) + UserMenu avatar dropdown (desktop & mobile variants). 15/15 backend + 100% frontend tests passed.

## Routes
- `/` Home (Hero public; everything below behind AuthGate)
- `/projects` Projects index
- `/intake` AI Readiness diagnostic
- `/checkout` Cart + checkout

## DB Schema
- `users { id, email, name, password_hash, role, created_at }` — unique index on `email`, `id`
- `login_attempts { identifier='email:{email}', count, last_at }`
- `status_checks { id, client_name, timestamp }`
- `intake_submissions { id, answers, contact, timestamp }`

## API Endpoints
- `POST /api/auth/register` — open sign-up
- `POST /api/auth/login` — returns user + sets cookies
- `POST /api/auth/logout` — clears cookies (auth required)
- `POST /api/auth/refresh` — rotate tokens
- `GET  /api/auth/me` — return current user
- `POST /api/intake` — saves AI Readiness form data
- `GET  /api/` — health check

## P0 Backlog (next)
- **Real PayPal integration** at /checkout (currently visual placeholder). Requires PayPal business client ID/secret.
- **SMTP email delivery** for intake form leads — blocked on user supplying valid 16-char Google App Password for `gwaltney@tailoredtechsolutions.org`.

## P1 Backlog
- AI Reality Lab — interactive demos (Ask AI, Construction Estimator, Contract Analyzer, Brand Kit) using Emergent LLM Key.
- Password reset / forgot password flow (currently no recovery path).
- Refresh token denylist (rotated tokens still valid until natural expiry).
- Email verification on sign-up.
- Refactor Nav.jsx / Projects.jsx into smaller components.
- COOKIE_SECURE env toggle so local HTTP dev works without samesite=none/secure=true.

## Known Mocks / Placeholders
- 🟡 **PayPal checkout button** — visual placeholder, no real payment flow yet.
- 🔴 **SMTP email** — pending valid credentials from user.

## Test IDs
**Catalog/Cart**: `service-cat-{id}`, `service-card-{id}`, `service-modal-add-to-cart`, `service-modal-close`, `nav-cart-button`, `nav-cart-button-mobile`, `nav-cart-count`, `cart-item-{id}`, `checkout-paypal-button`, `checkout-back-home`.
**Auth**: `auth-gate-wrapper`, `auth-gate-overlay`, `auth-gate-locked-content`, `auth-toggle-register`, `auth-toggle-login`, `auth-name`, `auth-email`, `auth-password`, `auth-submit`, `auth-error`, `user-menu-trigger-desktop`, `user-menu-panel-desktop`, `user-menu-signout-desktop`, `user-menu-trigger-mobile`, `user-menu-panel-mobile`, `user-menu-signout-mobile`.

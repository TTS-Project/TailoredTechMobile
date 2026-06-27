# Tailored Tech Solutions — PRD

## Original Problem Statement
Pixel-perfect clone of the "Tailored Tech Solutions" website with extensive mobile UI/UX optimization, plus an Interactive Projects Dashboard, an interactive 7-role "Terra Farming" dashboard, an AI Readiness Diagnostic Intake Form, a comprehensive Service Catalog with Shopping Cart & Checkout, and future enhancements (Apple-quality Auth Gate, AI Reality Lab).

## Stack
- React + React Router + Tailwind + shadcn/ui + lucide-react
- FastAPI + Motor + MongoDB
- localStorage for cart persistence

## Completed (as of Feb 2026)
- ✅ SnapScrollHero (7-section) with complex CSS animations
- ✅ Full mobile responsiveness overhaul
- ✅ Interactive Projects Dashboard
- ✅ "Terra Farming" 7-role interactive dashboard (mobile optimized)
- ✅ Transparent logo with CSS circuit aura (header + footer)
- ✅ AI Readiness Diagnostic Intake Form — frontend UI + Mongo save (POST /api/intake)
- ✅ Footer cleanup (removed unused links, swapped GitHub/LinkedIn for emails)
- ✅ Code quality fixes (React keys, deps arrays, Python lint)
- ✅ **Service Catalog + Cart + Checkout (Feb 2026)** — 40+ emoji-prefixed services across 7 categories (AI Solutions, Custom Software, Website Development, Engineering, Marketing, BI, Digital Products). ServiceModal with includes/benefits/deliverables/industries/FAQs/pricing breakdown. CartContext persisted to localStorage (`tts:cart:v1`). $49.95 AI Project Consultation auto-included. 50% deposit math. Nav cart icon with badge count. /checkout page with line items + Order Summary + PayPal visual placeholder. All 10 frontend e2e tests passed.

## Routes
- `/` Home
- `/projects` Projects index
- `/intake` AI Readiness diagnostic
- `/checkout` Cart + checkout

## Key DB Schema
- `status_checks { id, client_name, timestamp }`
- `intake_submissions { id, answers (dict), contact (dict), timestamp }`

## API Endpoints
- `POST /api/intake` — saves AI Readiness form data
- `GET /api/` — health check

## P0 Backlog (next)
- Apple-quality glassmorphism **Authentication Gate** locking content below the Hero until login (Block A from previous prompt) — user explicitly deferred until catalog was finished. Now unblocked.
- Wire up **real PayPal integration** (currently a visual placeholder). Requires user-provided PayPal business client ID/secret.
- **SMTP email delivery** for intake form leads — blocked on user supplying valid 16-char Google App Password for `gwaltney@tailoredtechsolutions.org`.

## P1 Backlog
- AI Reality Lab — Ask AI Anything, Construction Estimator, Contract Analyzer, Business Owner Brand Kit (interactive live demos using Emergent LLM Key).
- Refactor Nav.jsx and Projects.jsx (large/complex) into smaller components without breaking existing functionality.

## Known Mocks / Placeholders
- 🟡 **PayPal checkout button** — visual placeholder, no real payment flow yet.
- 🔴 **SMTP email** — pending valid credentials from user.

## Test IDs (Service Catalog flow)
`service-cat-{id}`, `service-card-{id}`, `service-modal-add-to-cart`, `service-modal-close`, `nav-cart-button`, `nav-cart-button-mobile`, `nav-cart-count`, `cart-item-{id}`, `checkout-paypal-button`, `checkout-back-home`.

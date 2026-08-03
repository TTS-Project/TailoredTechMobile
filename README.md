# Tailored Tech Solutions — Client App

Mobile app for tailoredtechsolutions.org. Two areas:

1. **Services Catalog** — public, browsable, no login required. Mirrors the 27 items sold via Square Checkout on the website (AI & Automation / Web & Platform Development / Brand & Growth).
2. **Client Portal** — gated. A client gets access automatically after a successful Square payment. Contains: project status, invoice/payment history, direct messages to TTS admin.

## Stack
- React + Vite + TypeScript + Capacitor (no Expo — hard rule)
- Uses npm; see [docs/bun-installation.md](docs/bun-installation.md) if you want Bun available locally
- Supabase (auth + Postgres + storage)
- Square API (shared catalog/checkout logic with the website)
- Bundle ID: `org.tailoredtechsolutions.app`

## Auth flow
1. Client pays via Square Checkout (website).
2. Square webhook (`supabase/functions/square-webhook`) fires on `payment.updated` with status `COMPLETED`.
3. Edge function creates a `clients` row and a Supabase Auth user, sends an invite email (Supabase's built-in invite link).
4. Client sets a password via the emailed link, logs into the app from then on with email/password.

## Setup checklist (not yet done — do before first real deploy)
- [ ] Provision Supabase project for this app (separate from Terra Farming's project — do not share)
- [ ] Run `supabase/migrations/0001_init_client_portal.sql` against it
- [ ] Set environment variables (Supabase URL/anon key, Square webhook signature key) in the Supabase Edge Function secrets — never commit these
- [ ] Register Square webhook subscription pointing at the deployed edge function URL
- [ ] Confirm `org.tailoredtechsolutions.app` App ID is registered in Apple Developer + matching Android package name in Play Console

## Not yet built
- Push notifications for new messages/status changes
- Deliverable file downloads (not requested yet — add if needed)
- iOS/Android native project folders (`npx cap add ios` / `npx cap add android` — run locally once Capacitor deps are installed; not committed here since this is scaffolded via GitHub API, no local CLI run yet)

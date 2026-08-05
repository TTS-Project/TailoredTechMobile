# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Mobile client app for tailoredtechsolutions.org, built with React + Vite + TypeScript + Capacitor. It has two areas:

1. **Services Catalog** (`/`) — public, no login. Mirrors the services sold via Square Checkout on the website.
2. **Client Portal** (`/portal/*`) — gated behind Supabase auth. A client gets access automatically after a successful Square payment (see Auth flow below). Contains project status, invoice/payment history, and direct messaging with TTS admin.

The codebase is an early-stage scaffold: screens are functional but intentionally unstyled, the Square webhook signature is unverified, and native iOS/Android projects haven't been generated yet. Treat TODOs and "not yet built" notes in the code and README as accurate status, not stale comments.

## Commands

```bash
npm run dev        # start Vite dev server
npm run build       # tsc type-check, then vite build
npm run preview     # preview the production build
npm run cap:sync    # sync web build into native Capacitor projects
```

There is no test suite and no lint script configured — `tsc` (via `npm run build`) is the only automated check. Run it after any change to verify types.

Local dev requires a `.env` (gitignored) with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — `src/lib/supabase.ts` throws at startup if either is missing.

iOS/Android native projects are not committed. Generate them locally with `npx cap add ios` / `npx cap add android` before running `cap:sync`.

## Architecture

**Two Supabase-backed surfaces gated by one auth check.** `src/App.tsx` defines all routing. Portal routes (`/portal`, `/portal/invoices`, `/portal/messages`) are wrapped in a local `RequireAuth` component that checks `supabase.auth.getSession()` and subscribes to `onAuthStateChange`, redirecting to `/login` if there's no session. There's a single shared Supabase client (`src/lib/supabase.ts`) — don't instantiate additional clients.

**Auth flow is payment-driven, not self-serve signup.** Clients never register directly:
1. Client pays via Square Checkout on the website.
2. Square fires a `payment.updated` webhook at the `square-webhook` Supabase Edge Function (`supabase/functions/square-webhook/index.ts`) once status is `COMPLETED`.
3. The edge function finds-or-creates a `clients` row keyed on email, and for new clients calls `supabaseAdmin.auth.admin.inviteUserByEmail` to create the Auth user and send an invite email.
4. The client sets a password via the emailed link and from then on logs in with email/password (`src/screens/Login.tsx`).

The edge function uses the `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS for account creation — **Square signature verification is not yet implemented** (see the TODO in `index.ts`); do not treat this function as production-ready until that's added.

**Data model and RLS (`supabase/migrations/0001_init_client_portal.sql`):**
- `clients` — one row per client, linked 1:1 to `auth.users` via `auth_user_id` once they accept their invite.
- `services_purchased` — one row per purchased service; `current_stage` (discovery/build/review/delivered) and `status` drive the Dashboard's project-status view. Created by the webhook, but the webhook does not yet insert these rows (see TODO — item/price data doesn't yet flow from checkout through to the webhook payload).
- `payments` — mirrors Square payment records so the portal doesn't call Square's API on read.
- `messages` — client↔admin messaging; `sender_role` distinguishes sides. Admin replies currently have no UI and must be inserted manually (Supabase dashboard or a future admin panel).

All four tables have RLS enabled, scoped via `client_id in (select id from clients where auth_user_id = auth.uid())` (or directly on `clients.auth_user_id`). Any new client-facing table needs the same pattern. The service-role key used by the webhook bypasses RLS by default.

**Screens map directly to routes/tables**, each screen owns its own `useEffect` data fetch against Supabase — there's no shared data layer or state management library. `Messages.tsx` additionally subscribes to a Postgres Changes realtime channel (`messages-live`) on `INSERT` to get live admin replies.

## Conventions specific to this project

- **No Expo — hard rule.** This project uses Capacitor directly; do not introduce Expo tooling.
- **App/bundle ID is `org.tailoredtechsolutions.app`.** This is a separate product from "Terra Farming" (`io.terrafarming.app`) — never reuse App IDs or share a Supabase project between them. Each product gets its own Apple Developer / Google Play registration.
- **Services catalog is a fixed, curated list** (target: 27 items across AI & Automation / Web & Platform Development / Brand & Growth). Structural Engineering items are excluded per standing instruction — don't add them back without being told to.
- **Design system is applied later.** Screens like `Login.tsx` are deliberately unstyled scaffolds; when a design pass happens, the intended system is a Gold & Black / Midnight Blue → Violet gradient look (noted in-file where relevant).
- Supabase project for this app must be **separate from Terra Farming's** — never point this app's env vars at that project.

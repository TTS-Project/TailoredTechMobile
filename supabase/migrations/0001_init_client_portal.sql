-- Tailored Tech Solutions — Client Portal schema
-- Run against a dedicated Supabase project for this app (NOT Terra Farming's project)

create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- CLIENTS
-- One row per client company/contact. Linked 1:1 to a Supabase Auth user
-- once they accept their portal invite.
-- ─────────────────────────────────────────────
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete set null,
  email text not null unique,
  full_name text,
  company_name text,
  square_customer_id text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- SERVICES PURCHASED
-- One row per purchased service/product. Created by the Square webhook
-- on successful payment. status/current_stage drive the portal's
-- project-status view.
-- ─────────────────────────────────────────────
create type project_stage as enum ('discovery', 'build', 'review', 'delivered');
create type purchase_status as enum ('active', 'completed', 'cancelled');

create table if not exists services_purchased (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references clients(id) on delete cascade,
  service_name text not null,
  price_cents integer not null,
  is_recurring boolean not null default false,
  square_payment_link_id text,
  square_order_id text,
  status purchase_status not null default 'active',
  current_stage project_stage not null default 'discovery',
  stage_notes text,
  purchased_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- PAYMENTS
-- Mirrors Square payment records so the portal can show invoice/payment
-- history without calling Square's API on every page load.
-- ─────────────────────────────────────────────
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references clients(id) on delete cascade,
  service_purchased_id uuid references services_purchased(id) on delete set null,
  square_payment_id text not null unique,
  amount_cents integer not null,
  currency text not null default 'USD',
  status text not null, -- Square's raw status string (COMPLETED, FAILED, REFUNDED, etc.)
  receipt_url text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- MESSAGES
-- Direct messaging between a client and TTS admin. sender_role distinguishes
-- which side sent it; admin replies are sent by whichever TTS user is
-- logged into an (as-yet-unbuilt) admin view — for now, admin replies can
-- be inserted directly via the Supabase dashboard or a future admin panel.
-- ─────────────────────────────────────────────
create type sender_role as enum ('client', 'admin');

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references clients(id) on delete cascade,
  sender_role sender_role not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Clients can only ever see their own data. No cross-client visibility.
-- ─────────────────────────────────────────────
alter table clients enable row level security;
alter table services_purchased enable row level security;
alter table payments enable row level security;
alter table messages enable row level security;

create policy "clients read own row"
  on clients for select
  using (auth.uid() = auth_user_id);

create policy "clients read own services"
  on services_purchased for select
  using (client_id in (select id from clients where auth_user_id = auth.uid()));

create policy "clients read own payments"
  on payments for select
  using (client_id in (select id from clients where auth_user_id = auth.uid()));

create policy "clients read own messages"
  on messages for select
  using (client_id in (select id from clients where auth_user_id = auth.uid()));

create policy "clients insert own messages"
  on messages for insert
  with check (
    client_id in (select id from clients where auth_user_id = auth.uid())
    and sender_role = 'client'
  );

-- Service role (used by the webhook edge function) bypasses RLS by default
-- via the service_role key — no additional policy needed for writes from
-- that context.

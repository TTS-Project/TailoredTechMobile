// Supabase Edge Function — receives Square webhook events.
// Deploy with: supabase functions deploy square-webhook
// Register this function's URL as a webhook subscription in the Square
// Developer Dashboard, subscribed to the `payment.updated` event.
//
// Required secrets (set via `supabase secrets set`, never committed):
//   SQUARE_WEBHOOK_SIGNATURE_KEY — from Square Developer Dashboard → Webhooks
//   SUPABASE_SERVICE_ROLE_KEY    — used to bypass RLS for account creation

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  // TODO: verify the Square-Signature header against
  // SQUARE_WEBHOOK_SIGNATURE_KEY before trusting this payload.
  // See: https://developer.squareup.com/docs/webhooks/step3validate
  // Left unimplemented here deliberately — do not deploy to production
  // until signature verification is added.

  const event = await req.json();

  if (event.type !== 'payment.updated') {
    return new Response('ignored', { status: 200 });
  }

  const payment = event.data?.object?.payment;
  if (!payment || payment.status !== 'COMPLETED') {
    return new Response('not completed', { status: 200 });
  }

  const buyerEmail = payment.buyer_email_address;
  if (!buyerEmail) {
    return new Response('no buyer email on payment', { status: 200 });
  }

  // Find or create the client record
  let { data: client } = await supabaseAdmin
    .from('clients')
    .select('id')
    .eq('email', buyerEmail)
    .single();

  if (!client) {
    const { data: inviteData, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(buyerEmail);

    if (inviteError) {
      console.error('Failed to invite user:', inviteError.message);
      return new Response('invite failed', { status: 500 });
    }

    const { data: newClient, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert({
        email: buyerEmail,
        auth_user_id: inviteData.user?.id,
        square_customer_id: payment.customer_id ?? null,
      })
      .select('id')
      .single();

    if (clientError) {
      console.error('Failed to create client row:', clientError.message);
      return new Response('client creation failed', { status: 500 });
    }
    client = newClient;
  }

  // Record the payment
  await supabaseAdmin.from('payments').insert({
    client_id: client.id,
    square_payment_id: payment.id,
    amount_cents: payment.amount_money?.amount ?? 0,
    currency: payment.amount_money?.currency ?? 'USD',
    status: payment.status,
    receipt_url: payment.receipt_url ?? null,
    paid_at: payment.updated_at ?? new Date().toISOString(),
  });

  // TODO: also insert a services_purchased row once the checkout flow
  // passes through which specific item/price was bought (the item name
  // needs to travel from the website's checkout call through to Square's
  // order data, or be looked up via payment.order_id).

  return new Response('ok', { status: 200 });
});

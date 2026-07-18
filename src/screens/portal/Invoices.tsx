import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Payment {
  id: string;
  amount_cents: number;
  currency: string;
  status: string;
  receipt_url: string | null;
  paid_at: string | null;
}

function formatCents(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

export default function Invoices() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('id, amount_cents, currency, status, receipt_url, paid_at')
        .order('paid_at', { ascending: false });

      if (error) {
        console.error('Failed to load payments:', error.message);
      } else {
        setPayments(data as Payment[]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>Loading payment history…</p>;

  return (
    <div>
      <h1>Invoices &amp; Payments</h1>
      {payments.length === 0 && <p>No payment history yet.</p>}
      {payments.map((p) => (
        <div key={p.id} style={{ marginBottom: '1rem' }}>
          <p>{formatCents(p.amount_cents, p.currency)} — {p.status}</p>
          <p>{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : 'Pending'}</p>
          {p.receipt_url && (
            <a href={p.receipt_url} target="_blank" rel="noreferrer">
              View Receipt
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

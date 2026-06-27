import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus, ShieldCheck, Info } from 'lucide-react';
import { Nav } from '../components/tts/Nav';
import { Footer } from '../components/tts/Footer';
import { useCart } from '../contexts/CartContext';
import { CONSULTATION, formatPrice } from '../data/services';

export default function CheckoutPage() {
  const { items, removeItem, updateQty, subtotal, consultationFee, total, deposit, balance } = useCart();
  useEffect(() => { window.scrollTo({top:0}); }, []);

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="relative pt-32 sm:pt-36 pb-20 bg-void">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-12">
          <Link to="/" className="inline-flex items-center gap-2 text-chrome-mid hover:text-gold mb-6" data-testid="checkout-back-home"><ArrowLeft size={14} /> Back to home</Link>
          <div className="eyebrow">Checkout</div>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-chrome">Review your <span className="gold-text-gradient">order.</span></h1>

          {items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8 items-start">
              <div className="space-y-4">
                {items.map((it) => (
                  <div key={it.id} data-testid={`cart-item-${it.id}`} className="flex items-center gap-4 bg-card-soft rounded-2xl p-4 sm:p-5" style={{border:'1px solid var(--border-subtle)'}}>
                    <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-3xl sm:text-4xl" style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.18), rgba(13,13,26,0.7))', border: '1px solid var(--border-subtle)' }} aria-hidden="true">
                      {it.emoji || '✨'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-gold-dim">{it.kind}</div>
                      <div className="font-display text-base sm:text-lg text-chrome font-semibold leading-tight truncate">{it.name}</div>
                      <div className="text-sm text-gold mt-0.5">{formatPrice(it.price)}</div>
                    </div>
                    <div className="flex items-center gap-1.5" style={{border:'1px solid var(--border-subtle)', borderRadius:8}}>
                      <button onClick={() => updateQty(it.id, it.qty - 1)} className="w-9 h-9 flex items-center justify-center text-chrome-mid hover:text-gold" aria-label="Decrease quantity"><Minus size={14} /></button>
                      <span className="w-7 text-center text-sm font-mono text-chrome">{it.qty}</span>
                      <button onClick={() => updateQty(it.id, it.qty + 1)} className="w-9 h-9 flex items-center justify-center text-chrome-mid hover:text-gold" aria-label="Increase quantity"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(it.id)} className="shrink-0 w-10 h-10 flex items-center justify-center rounded-md text-chrome-mid hover:text-red-400 transition-colors" style={{border:'1px solid var(--border-subtle)'}} aria-label="Remove"><Trash2 size={14} /></button>
                  </div>
                ))}
                <div className="rounded-2xl p-4 sm:p-5 flex items-start gap-3" style={{border:'1px solid rgba(212,168,67,0.40)', background:'rgba(212,168,67,0.06)'}}>
                  <ShieldCheck size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <div className="font-display text-sm font-semibold text-chrome">{CONSULTATION.name} — Automatically Included</div>
                    <div className="text-xs text-chrome-mid mt-1">{CONSULTATION.includes.join(' · ')}</div>
                  </div>
                  <div className="text-sm font-semibold text-gold whitespace-nowrap ml-auto">{formatPrice(CONSULTATION.price)}</div>
                </div>
              </div>

              <aside className="sticky top-[100px] bg-card-soft rounded-2xl p-5 sm:p-6" style={{border:'1px solid var(--gold-dim)'}}>
                <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-4">Order Summary</div>
                <dl className="space-y-3 text-sm">
                  <Row label="Subtotal" value={formatPrice(subtotal)} />
                  <Row label="AI Consultation" value={formatPrice(consultationFee)} />
                  <div className="h-px" style={{background:'var(--border-subtle)'}} />
                  <Row label={<span className="text-chrome font-semibold">Total Project Value</span>} value={<span className="text-chrome font-bold text-lg">{formatPrice(total)}</span>} />
                  <div className="h-px" style={{background:'var(--border-subtle)'}} />
                  <Row label={<span className="text-gold">Required Deposit (50%)</span>} value={<span className="text-gold font-bold text-xl">{formatPrice(deposit)}</span>} />
                  <Row label="Remaining Balance" value={formatPrice(balance)} />
                </dl>
                <div className="mt-5 rounded-xl p-3 flex items-start gap-2 text-[11px] text-chrome-mid" style={{background:'rgba(255,255,255,0.02)', border:'1px solid var(--border-subtle)'}}>
                  <Info size={12} className="text-gold-dim shrink-0 mt-0.5" />
                  <span>A 50% down payment is required before work begins. The remaining balance is due upon completion and prior to final delivery.</span>
                </div>
                <button type="button" data-testid="checkout-paypal-button" className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[52px] rounded-xl font-semibold transition-all active:scale-[0.98] hover:opacity-90" style={{background:'#003087', color:'#fff'}}>
                  Proceed to PayPal
                </button>
                <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-chrome-mid text-center">PayPal integration coming soon</p>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-chrome-mid">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 sm:mt-16 text-center max-w-md mx-auto">
      <div className="mx-auto w-20 h-20 rounded-full inline-flex items-center justify-center" style={{border:'2px solid var(--gold-dim)', background:'var(--gold-glow)'}}>
        <ShoppingBag size={28} className="text-gold" />
      </div>
      <h2 className="mt-6 font-display text-2xl sm:text-3xl font-bold text-chrome">Your Cart is Empty</h2>
      <p className="mt-3 text-sm sm:text-base text-chrome-mid leading-relaxed">Browse our AI services and solutions to build your custom project.</p>
      <Link to="/#services" className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[52px] rounded-xl font-semibold" style={{background:'var(--gold-bright)', color:'#09090f'}}>
        Explore Services
      </Link>
    </div>
  );
}

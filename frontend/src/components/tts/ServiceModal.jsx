import React, { useEffect, useState } from 'react';
import { X, Check, ArrowRight, Clock, Sparkles, Tag, Building2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { CONSULTATION, formatPrice } from '../../data/services';

export function ServiceModal({ service, onClose }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  if (!service) return null;
  const handleAdd = () => { addItem(service); setAdded(true); setTimeout(() => setAdded(false), 1800); };
  const accent = '#d4a843';

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-md" style={{background:'rgba(5,5,10,0.78)'}} />
      <div className="relative w-full sm:max-w-2xl max-h-[94vh] sm:max-h-[90vh] bg-card-soft rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col tts-modal-pop"
        style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)'}}
        onClick={(e) => e.stopPropagation()}>
        <div className="relative shrink-0 px-6 sm:px-8 py-5 sm:py-6" style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.10), rgba(13,13,26,0.6))', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-3xl sm:text-4xl" style={{background:'rgba(212,168,67,0.10)', border:'1px solid var(--gold-dim)'}} aria-hidden="true">
                {service.emoji}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-widest text-gold-dim">{service.kind === 'product' ? 'Product' : 'Service'}</div>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-chrome leading-tight">{service.name}</h2>
                <p className="mt-1 text-sm text-chrome-mid">{service.tagline}</p>
              </div>
            </div>
            <button onClick={onClose} data-testid="service-modal-close" className="shrink-0 w-10 h-10 rounded-md flex items-center justify-center backdrop-blur-md" style={{background:'rgba(9,9,15,0.65)', border:'1px solid rgba(255,255,255,0.1)'}} aria-label="Close">
              <X size={16} className="text-chrome" />
            </button>
          </div>
        </div>

        <div className="px-6 sm:px-8 py-5 sm:py-6 overflow-y-auto flex-1 space-y-6">
          <p className="text-secondary-soft leading-relaxed">{service.summary}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Meta Icon={Clock} label="Turnaround" value={service.eta} />
            <Meta Icon={Sparkles} label="Starting at" value={formatPrice(service.starting)} valueColor={accent} />
            <Meta Icon={Tag} label="Category" value={service.category.toUpperCase()} />
          </div>

          <Section title="What's included">
            <ul className="grid sm:grid-cols-2 gap-2.5">
              {service.includes.map((x) => (
                <li key={x} className="flex items-start gap-2 text-sm text-chrome-mid">
                  <Check size={14} className="shrink-0 mt-0.5" style={{color: accent}} /> {x}
                </li>
              ))}
            </ul>
          </Section>

          {service.benefits?.length > 0 && (
            <Section title="Business benefits">
              <ul className="grid sm:grid-cols-2 gap-2.5">
                {service.benefits.map((x) => (
                  <li key={x} className="flex items-start gap-2 text-sm text-chrome-mid">
                    <ArrowRight size={14} className="shrink-0 mt-0.5" style={{color: accent}} /> {x}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {service.deliverables?.length > 0 && (
            <Section title="Deliverables">
              <div className="flex flex-wrap gap-2">
                {service.deliverables.map((d) => (
                  <span key={d} className="text-xs font-mono px-2.5 py-1 rounded text-chrome" style={{border:'1px solid var(--border-subtle)', background:'rgba(255,255,255,0.02)'}}>{d}</span>
                ))}
              </div>
            </Section>
          )}

          {service.industries?.length > 0 && (
            <Section title="Recommended industries">
              <div className="flex flex-wrap gap-2">
                {service.industries.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded" style={{color:accent, border:`1px solid ${accent}55`, background:'rgba(212,168,67,0.06)'}}>
                    <Building2 size={11} /> {d}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {service.faqs?.length > 0 && (
            <Section title="FAQ">
              <div className="space-y-3">
                {service.faqs.map((f) => (
                  <details key={f.q} className="rounded-xl p-4" style={{border:'1px solid var(--border-subtle)', background:'rgba(255,255,255,0.02)'}}>
                    <summary className="cursor-pointer text-sm font-medium text-chrome">{f.q}</summary>
                    <p className="mt-2 text-sm text-secondary-soft leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </Section>
          )}

          {/* Pricing card */}
          <div className="rounded-2xl p-5 sm:p-6" style={{border:`1px solid ${accent}66`, background:'linear-gradient(180deg, rgba(212,168,67,0.10), rgba(13,13,26,0.55))'}}>
            <div className="text-[10px] font-mono uppercase tracking-widest text-gold-dim">Project Cost</div>
            <div className="mt-2 font-display text-3xl sm:text-4xl font-bold" style={{color:accent}}>{formatPrice(service.starting)}</div>
            <p className="mt-1 text-xs text-chrome-mid">{CONSULTATION.name} ({formatPrice(CONSULTATION.price)}) is automatically added at checkout.</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg p-3" style={{border:'1px solid var(--border-subtle)', background:'rgba(255,255,255,0.03)'}}>
                <div className="text-[10px] font-mono uppercase tracking-widest text-gold-dim">50% Down Payment</div>
                <div className="mt-1 text-chrome font-medium">Required before work begins</div>
              </div>
              <div className="rounded-lg p-3" style={{border:'1px solid var(--border-subtle)', background:'rgba(255,255,255,0.03)'}}>
                <div className="text-[10px] font-mono uppercase tracking-widest text-gold-dim">Remaining 50%</div>
                <div className="mt-1 text-chrome font-medium">Due upon project completion</div>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-chrome-mid leading-relaxed">Work will not begin until the initial 50% deposit has been received and confirmed.</p>
          </div>
        </div>

        <div className="shrink-0 px-6 sm:px-8 py-4 flex flex-col sm:flex-row gap-3" style={{borderTop:'1px solid var(--border-subtle)', background:'rgba(9,9,15,0.6)'}}>
          <button onClick={handleAdd} data-testid="service-modal-add-to-cart" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[52px] rounded-xl font-semibold transition-all active:scale-[0.98]" style={{background: added ? '#7ac462' : 'var(--gold-bright)', color:'#09090f'}}>
            {added ? (<><Check size={16} strokeWidth={3} /> Added to Cart</>) : (<>Add to Cart — {formatPrice(service.starting)}</>)}
          </button>
          <button onClick={onClose} className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[52px] rounded-xl text-gold font-semibold transition-all active:scale-[0.98]" style={{border:'1px solid var(--gold-dim)'}}>Continue Browsing</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-3">{title}</div>
      {children}
    </div>
  );
}
function Meta({ Icon, label, value, valueColor }) {
  return (
    <div className="rounded-xl p-3" style={{border:'1px solid var(--border-subtle)', background:'rgba(255,255,255,0.02)'}}>
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-gold-dim"><Icon size={11} /> {label}</div>
      <div className="mt-1.5 text-sm font-semibold" style={{color: valueColor || 'var(--chrome-light)'}}>{value}</div>
    </div>
  );
}

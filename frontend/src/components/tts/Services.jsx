import React, { useMemo, useState } from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { CATEGORIES, SERVICES, formatPrice } from '../../data/services';
import { ServiceModal } from './ServiceModal';

export function Services() {
  const [activeCat, setActiveCat] = useState('ai');
  const [openService, setOpenService] = useState(null);

  const filtered = useMemo(() => SERVICES.filter((s) => s.category === activeCat), [activeCat]);

  return (
    <section id="services" className="relative py-20 sm:py-24 md:py-32 bg-void">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
        <Reveal>
          <div className="eyebrow">What we build</div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-chrome max-w-3xl">
            A complete catalog. <span className="gold-text-gradient">Custom by default.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-secondary-soft max-w-2xl leading-relaxed">Every engagement begins with a $49.95 AI Project Consultation — automatically added to checkout. 50% deposit secures the build.</p>
        </Reveal>

        {/* Category tabs */}
        <div className="mt-8 sm:mt-10 flex items-center gap-2 overflow-x-auto scrollbar-hidden -mx-1 px-1 pb-1">
          {CATEGORIES.map((c) => {
            const isActive = c.id === activeCat;
            return (
              <button key={c.id} onClick={() => setActiveCat(c.id)} aria-pressed={isActive}
                className="shrink-0 px-4 py-2.5 min-h-[44px] rounded-full text-[12px] font-mono uppercase tracking-widest transition-all active:scale-[0.98]"
                style={{
                  background: isActive ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)',
                  color: isActive ? c.accent : 'var(--chrome-mid)',
                  border: `1px solid ${isActive ? c.accent + '88' : 'var(--border-subtle)'}`,
                }}
                data-testid={`service-cat-${c.id}`}>
                <span className="mr-1.5" aria-hidden="true">{c.emoji}</span>{c.label}
              </button>
            );
          })}
        </div>

        {/* Service cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((s, i) => (
            <Reveal key={s.id} delay={i * 40}>
              <button type="button" onClick={() => setOpenService(s)}
                data-testid={`service-card-${s.id}`}
                className="group relative w-full h-full text-left bg-card-soft rounded-2xl overflow-hidden gold-diffuse transition-all"
                style={{border:'1px solid var(--border-subtle)'}}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold-bright)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                {s.image ? (
                  <div className="h-44 sm:h-48 relative overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(9,9,15,0) 50%, rgba(9,9,15,0.55) 100%)' }} />
                    <span className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded backdrop-blur-md" style={{ color: 'var(--gold-bright)', background: 'rgba(9,9,15,0.55)', border: '1px solid var(--gold-dim)' }}>{s.kind === 'product' ? 'Product' : 'Service'}</span>
                  </div>
                ) : (
                  <div className="h-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.18), rgba(13,13,26,0.7))' }}>
                    <div className="absolute inset-0 circuit-grid opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl sm:text-6xl drop-shadow-[0_4px_24px_rgba(212,168,67,0.35)] transition-transform duration-500 group-hover:scale-110" aria-hidden="true">{s.emoji}</div>
                    </div>
                    <span className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded backdrop-blur-md" style={{ color: 'var(--gold-bright)', background: 'rgba(9,9,15,0.55)', border: '1px solid var(--gold-dim)' }}>{s.kind === 'product' ? 'Product' : 'Service'}</span>
                  </div>
                )}
                <div className="p-5 sm:p-6 flex flex-col gap-3">
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-chrome leading-tight">
                      <span className="mr-2" aria-hidden="true">{s.emoji}</span>{s.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-chrome-mid leading-relaxed">{s.tagline}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 mt-auto pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-gold-dim">Starting at</div>
                      <div className="font-display text-lg font-bold text-gold mt-0.5">{formatPrice(s.starting)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-gold-dim inline-flex items-center gap-1"><Clock size={10}/> ETA</div>
                      <div className="text-xs font-mono text-chrome mt-0.5">{s.eta}</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-gold mt-1">Expand <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {openService && <ServiceModal service={openService} onClose={() => setOpenService(null)} />}
    </section>
  );
}

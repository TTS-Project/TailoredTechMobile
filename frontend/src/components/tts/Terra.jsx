import React from 'react';
import { Users, Truck, Network, RefreshCw, ArrowRight, Github } from 'lucide-react';
import { Reveal } from './Reveal';

const FEATURES = [
  { Icon: Users, t: 'Multi-role dashboards', s: 'Farmer · Buyer · Driver · Admin · HQ' },
  { Icon: Truck, t: 'Real-time logistics', s: 'Live tracking across every delivery' },
  { Icon: Network, t: 'Direct market connections', s: 'No intermediaries, no friction' },
  { Icon: RefreshCw, t: 'Supabase-powered sync', s: 'Instant updates across all roles' },
];

export function Terra() {
  return (
    <section id="terra" className="relative py-20 sm:py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grad-accent" />
      <div className="absolute inset-0 circuit-grid opacity-[0.5]" />
      <div className="absolute -top-40 right-0 w-[520px] h-[520px] rounded-full" style={{background:'radial-gradient(circle, rgba(212,168,67,0.18), transparent 60%)', filter:'blur(40px)'}} />

      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 grid md:grid-cols-2 gap-14 items-center">
        <Reveal>
          <div className="eyebrow">Flagship Product</div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl font-extrabold tracking-tighter">
            <span className="gold-text-gradient">Terra Farming</span>
          </h2>
          <p className="mt-6 text-lg text-chrome-mid max-w-xl">
            The agriculture intelligence platform connecting farmers, buyers, drivers, and HQ — in one unified system.
          </p>
          <p className="mt-4 text-secondary-soft max-w-xl leading-relaxed">
            A multi-role mobile and web application built for the modern agricultural supply chain. Real-time logistics, inventory management, and direct market connections — all running on a dark, precision-engineered dashboard interface.
          </p>
          <ul className="mt-10 space-y-4">
            {FEATURES.map((f) => (
              <li key={f.t} className="flex items-start gap-4">
                <span className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)', background:'var(--gold-glow)'}}>
                  <f.Icon size={16} className="text-gold" />
                </span>
                <div>
                  <div className="text-chrome font-medium">{f.t}</div>
                  <div className="text-sm text-muted-soft">{f.s}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[52px] rounded-xl font-semibold transition-all active:scale-[0.98] hover:opacity-90" style={{background:'var(--gold-bright)', color:'#09090f'}}>
              View Case Study <ArrowRight size={16} />
            </a>
            <a href="#" className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[52px] rounded-xl text-gold font-semibold transition-all active:scale-[0.98]" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)'}}>
              <Github size={16} /> View on GitHub
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative" style={{ perspective: '1200px' }}>
            <div className="relative mx-auto w-[280px] h-[560px] rounded-[44px] p-3 shadow-[0_40px_80px_-20px_rgba(101,67,33,0.55)]"
              style={{ transform: 'rotateY(-14deg) rotateX(6deg)', borderWidth:'2px', borderStyle:'solid', borderColor:'#8b5a2b' }}>
              <div className="absolute inset-0 rounded-[44px]" style={{ background: 'linear-gradient(160deg,#3b2410 0%,#1a0f06 60%,#0a0805 100%)' }} />
              <div className="absolute left-1/2 -translate-x-1/2 top-3 w-24 h-5 rounded-full bg-black/70 z-10" />
              <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-gradient-to-b from-[#2a1a0c] via-[#1a1208] to-[#0a0805] p-5">
                <div className="flex justify-center mb-3">
                  <img src="/logos/terra-logo.png" alt="Terra Farming logo" className="h-20 w-20 rounded-2xl object-contain drop-shadow-[0_4px_18px_rgba(122,196,98,0.35)]" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono" style={{ color: '#c9a47a' }}>TERRA · HQ</div>
                  <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#7ac462' }} />
                </div>
                <div className="mt-6">
                  <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#c9a47a' }}>Today's Yield</div>
                  <div className="font-display text-3xl mt-1" style={{ color: '#f4e9d2' }}>47.3 t</div>
                  <div className="text-[10px] mt-1" style={{ color: '#7ac462' }}>▲ 12.4% vs last week</div>
                </div>
                <div className="mt-6 space-y-2">
                  {[
                    { l: 'Farmer · Nakamura', v: '12.1 t' },
                    { l: 'Driver · Route 4B', v: 'On route' },
                    { l: 'Buyer · LogiChain', v: '$24.8k' },
                    { l: 'HQ · Inventory', v: '84% full' },
                  ].map((r) => (
                    <div key={r.l} className="flex items-center justify-between rounded-md px-3 py-2" style={{ borderColor: 'rgba(139,90,43,0.35)', background: 'rgba(139,90,43,0.10)', borderWidth: 1, borderStyle: 'solid' }}>
                      <span className="text-[11px]" style={{ color: '#d8c9ad' }}>{r.l}</span>
                      <span className="text-[11px] font-mono" style={{ color: '#7ac462' }}>{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[40, 70, 55].map((h, i) => (
                    <div key={i} className="rounded flex items-end h-16" style={{ background: 'rgba(139,90,43,0.12)', border: '1px solid rgba(139,90,43,0.30)' }}>
                      <div className="w-full rounded-b" style={{ height: `${h}%`, background: 'linear-gradient(to top,#7ac462,#4a8c3a)' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -left-6 top-12 w-[220px] h-[440px] rounded-[36px] hidden md:block opacity-70"
              style={{ background: '#1a1208', border: '1px solid rgba(139,90,43,0.35)', transform: 'rotateY(-22deg) rotateX(8deg) translateZ(-60px)' }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

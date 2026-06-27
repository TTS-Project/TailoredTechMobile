import React from 'react';
import { ArrowRight, Users, Truck, Network, RefreshCw, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';

const TERRA_FEATURES = [
  { Icon: Users,    t: 'Multi-role dashboards',     s: 'Farmer · Buyer · Driver · Admin · HQ' },
  { Icon: Truck,    t: 'Real-time logistics',       s: 'Live tracking across every delivery' },
  { Icon: Network,  t: 'Direct market connections', s: 'No intermediaries, no friction' },
  { Icon: RefreshCw, t: 'Supabase-powered sync',    s: 'Instant updates across all roles' },
];

function TerraPhoneMockup() {
  return (
    <div className="relative" style={{ perspective: '1200px' }}>
      <div className="relative mx-auto w-[240px] sm:w-[280px] h-[480px] sm:h-[560px] rounded-[40px] sm:rounded-[44px] p-3 shadow-[0_40px_80px_-20px_rgba(101,67,33,0.55)]"
        style={{ transform: 'rotateY(-14deg) rotateX(6deg)', borderWidth:'2px', borderStyle:'solid', borderColor:'#8b5a2b' }}>
        <div className="absolute inset-0 rounded-[40px] sm:rounded-[44px]" style={{ background: 'linear-gradient(160deg,#3b2410 0%,#1a0f06 60%,#0a0805 100%)' }} />
        <div className="absolute left-1/2 -translate-x-1/2 top-3 w-24 h-5 rounded-full bg-black/70 z-10" />
        <div className="relative w-full h-full rounded-[30px] sm:rounded-[34px] overflow-hidden bg-gradient-to-b from-[#2a1a0c] via-[#1a1208] to-[#0a0805] p-4 sm:p-5">
          <div className="flex justify-center mb-3">
            <img src="/logos/terra-logo.png" alt="Terra Farming logo" className="h-16 sm:h-20 w-16 sm:w-20 rounded-2xl object-contain drop-shadow-[0_4px_18px_rgba(122,196,98,0.35)]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono" style={{ color: '#c9a47a' }}>TERRA · HQ</div>
            <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#7ac462' }} />
          </div>
          <div className="mt-5">
            <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#c9a47a' }}>Today's Yield</div>
            <div className="font-display text-2xl sm:text-3xl mt-1" style={{ color: '#f4e9d2' }}>47.3 t</div>
            <div className="text-[10px] mt-1" style={{ color: '#7ac462' }}>▲ 12.4% vs last week</div>
          </div>
          <div className="mt-5 space-y-2">
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
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[40, 70, 55].map((h, i) => (
              <div key={i} className="rounded flex items-end h-14 sm:h-16" style={{ background: 'rgba(139,90,43,0.12)', border: '1px solid rgba(139,90,43,0.30)' }}>
                <div className="w-full rounded-b" style={{ height: `${h}%`, background: 'linear-gradient(to top,#7ac462,#4a8c3a)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -left-6 top-12 w-[220px] h-[440px] rounded-[36px] hidden md:block opacity-70"
        style={{ background: '#1a1208', border: '1px solid rgba(139,90,43,0.35)', transform: 'rotateY(-22deg) rotateX(8deg) translateZ(-60px)' }} />
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative py-20 sm:py-24 md:py-32 bg-void overflow-hidden">
      <div className="absolute -top-40 right-0 w-[520px] h-[520px] rounded-full pointer-events-none" style={{background:'radial-gradient(circle, rgba(212,168,67,0.10), transparent 60%)', filter:'blur(40px)'}} />

      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="eyebrow">Selected Work</div>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-chrome">
                Projects we've <span className="gold-text-gradient">shipped.</span>
              </h2>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-xl text-sm font-semibold text-gold transition-all active:scale-[0.98] hover:bg-[var(--gold-glow)]" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)'}}>
              View all projects <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>

        {/* Flagship: Terra Farming — full feature spotlight inside the Projects section */}
        <Reveal delay={80}>
          <article id="terra" className="mt-12 sm:mt-14 relative rounded-2xl sm:rounded-3xl overflow-hidden gold-diffuse"
            style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)', background:'linear-gradient(180deg, rgba(20,12,8,0.92) 0%, rgba(13,13,26,0.88) 100%)'}}
          >
            <div className="absolute inset-0 circuit-grid opacity-[0.4] pointer-events-none" />
            <div className="grid md:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center p-6 sm:p-10 md:p-14">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded" style={{color:'#7ac462', background:'rgba(122,196,98,0.10)', border:'1px solid rgba(122,196,98,0.40)'}}>Flagship Product</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded" style={{color:'#7ac462', background:'rgba(122,196,98,0.06)', border:'1px solid rgba(122,196,98,0.30)'}}>Agriculture Intelligence</span>
                </div>
                <h3 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter">
                  <span className="gold-text-gradient">Terra Farming</span>
                </h3>
                <p className="mt-5 text-base sm:text-lg text-chrome-mid max-w-xl leading-relaxed">
                  The agriculture intelligence platform connecting farmers, buyers, drivers, and HQ — in one unified system.
                </p>
                <p className="mt-3 text-sm sm:text-base text-secondary-soft max-w-xl leading-relaxed">
                  A multi-role mobile and web application built for the modern agricultural supply chain. Real-time logistics, inventory management, and direct market connections — all running on a dark, precision-engineered dashboard interface.
                </p>

                <ul className="mt-8 grid sm:grid-cols-2 gap-4">
                  {TERRA_FEATURES.map((f) => (
                    <li key={f.t} className="flex items-start gap-3">
                      <span className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)', background:'var(--gold-glow)'}}>
                        <f.Icon size={16} className="text-gold" />
                      </span>
                      <div>
                        <div className="text-chrome font-medium leading-tight">{f.t}</div>
                        <div className="text-xs sm:text-sm text-muted-soft mt-0.5">{f.s}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                  <a href="#contact" className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[52px] rounded-xl font-semibold transition-all active:scale-[0.98] hover:opacity-90" style={{background:'var(--gold-bright)', color:'#09090f'}}>
                    View Case Study <ArrowRight size={16} />
                  </a>
                  <a href="#" className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[52px] rounded-xl text-gold font-semibold transition-all active:scale-[0.98]" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)'}}>
                    <Github size={16} /> View on GitHub
                  </a>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <TerraPhoneMockup />
              </div>
            </div>
          </article>
        </Reveal>

        {/* Big League Swings — secondary feature card */}
        <Reveal delay={140}>
          <Link to="/projects" className="block mt-6 sm:mt-8">
            <article className="group relative overflow-hidden rounded-2xl bg-card-soft transition-all"
              style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-bright)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div className="grid md:grid-cols-[1fr_1.1fr]">
                <div className="relative flex items-center justify-center h-56 md:h-auto md:min-h-[280px] overflow-hidden" style={{ background: 'linear-gradient(140deg,#0a1b4d 0%,#0d1f5e 50%,#08113a 100%)' }}>
                  <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(220,38,38,0.45), transparent 60%)' }} />
                  <img src="/logos/big-league-swings-logo.png" alt="Big League Swings logo" className="relative h-40 sm:h-48 max-w-[80%] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                  <div className="text-[11px] font-mono uppercase tracking-widest" style={{ color: '#3b82f6' }}>A Mobile Hit Trax Experience</div>
                  <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-chrome">Big League Swings</h3>
                  <p className="mt-3 text-sm sm:text-base text-secondary-soft leading-relaxed">
                    Mobile batting-cage experience platform powered by Hit Trax — bringing pro-grade swing analytics on the road.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {['React Native', 'Node.js', 'PostgreSQL', 'Hit Trax SDK'].map(t => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded text-chrome-mid" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}>{t}</span>
                    ))}
                  </div>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold group-hover:text-[var(--gold-mid)]">
                    View project <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

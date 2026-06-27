import React from 'react';
import { ArrowRight, Users, Truck, Network, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { TerraDashboard } from './TerraDashboard';

const TERRA_FEATURES = [
  { Icon: Users,    t: 'Multi-role dashboards',     s: 'Farmer · Buyer · Driver · Admin · HQ' },
  { Icon: Truck,    t: 'Real-time logistics',       s: 'Live tracking across every delivery' },
  { Icon: Network,  t: 'Direct market connections', s: 'No intermediaries, no friction' },
  { Icon: RefreshCw, t: 'Supabase-powered sync',    s: 'Instant updates across all roles' },
];

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

        {/* Flagship: Terra Farming — interactive 7-role dashboard */}
        <Reveal delay={80}>
          <article id="terra" className="mt-12 sm:mt-14 relative rounded-2xl sm:rounded-3xl overflow-hidden gold-diffuse"
            style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)', background:'linear-gradient(180deg, rgba(20,12,8,0.92) 0%, rgba(13,13,26,0.88) 100%)'}}
          >
            <div className="absolute inset-0 circuit-grid opacity-[0.4] pointer-events-none" />
            <div className="grid md:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center p-6 sm:p-10 md:p-14">
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
                  <a href="https://terrafarming.io" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[52px] rounded-xl font-semibold transition-all active:scale-[0.98] hover:opacity-90"
                    style={{background:'var(--gold-bright)', color:'#09090f'}}
                  >
                    Visit terrafarming.io <ArrowRight size={16} />
                  </a>
                  <a href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[52px] rounded-xl text-gold font-semibold transition-all active:scale-[0.98]"
                    style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)'}}
                  >
                    Discuss a similar build
                  </a>
                </div>

                <p className="mt-4 text-[11px] font-mono uppercase tracking-widest text-gold-dim">
                  Tap a role on the right to explore the live dashboard.
                </p>
              </div>

              {/* Interactive 7-role dashboard */}
              <div className="md:pl-2">
                <TerraDashboard />
              </div>
            </div>
          </article>
        </Reveal>

        {/* Big League Swings — with intro video */}
        <Reveal delay={140}>
          <article className="mt-6 sm:mt-8 relative overflow-hidden rounded-2xl bg-card-soft transition-all"
            style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
          >
            <div className="grid md:grid-cols-[1.2fr_1fr]">
              {/* Intro video */}
              <div className="relative overflow-hidden bg-[#020615] md:min-h-[360px]">
                <video
                  className="w-full h-full object-cover aspect-video md:aspect-auto"
                  src="/videos/bls-intro.mov"
                  poster="/logos/big-league-swings-logo.png"
                  controls
                  playsInline
                  preload="metadata"
                >
                  Your browser does not support embedded video.
                </video>
                <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded backdrop-blur-md"
                  style={{color:'#3b82f6', background:'rgba(9,9,15,0.55)', border:'1px solid rgba(59,130,246,0.45)'}}>
                  Project Intro · Video
                </span>
              </div>
              <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                <div className="text-[11px] font-mono uppercase tracking-widest" style={{ color: '#3b82f6' }}>A Mobile Hit Trax Experience</div>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-chrome">Big League Swings</h3>
                <p className="mt-3 text-sm sm:text-base text-secondary-soft leading-relaxed">
                  Mobile batting-cage experience platform powered by Hit Trax — bringing pro-grade swing analytics on the road. Watch the project intro to see the dashboard in action.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['React Native', 'Node.js', 'PostgreSQL', 'Hit Trax SDK'].map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded text-chrome-mid" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}>{t}</span>
                  ))}
                </div>
                <Link to="/projects" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-[var(--gold-mid)]">
                  View project <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

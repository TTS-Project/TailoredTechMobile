import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';

const PROJECTS = [
  {
    name: 'Terra Farming',
    tag: 'Agriculture Intelligence',
    blurb: 'Multi-role farm-to-table marketplace with real-time logistics, compliance, and commission engine.',
    logo: '/logos/terra-logo.png',
    splash: {
      background: 'linear-gradient(140deg,#3b2410 0%,#241608 60%,#0e0805 100%)',
      ring: 'rgba(122,196,98,0.35)',
      accent: '#7ac462',
    },
  },
  {
    name: 'Big League Swings',
    tag: 'A Mobile Hit Trax Experience',
    blurb: 'Mobile batting-cage experience platform powered by Hit Trax — bringing pro-grade swing analytics on the road.',
    logo: '/logos/big-league-swings-logo.png',
    splash: {
      background: 'linear-gradient(140deg,#0a1b4d 0%,#0d1f5e 50%,#08113a 100%)',
      ring: 'rgba(220,38,38,0.45)',
      accent: '#3b82f6',
    },
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative py-20 sm:py-24 md:py-32 bg-void">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
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
        <div className="mt-12 sm:mt-14 grid md:grid-cols-2 gap-6">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 120}>
              <Link to="/projects" className="block h-full">
              <article className="group relative h-full overflow-hidden rounded-2xl bg-card-soft transition-all"
                style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-bright)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div className="relative flex h-56 items-center justify-center overflow-hidden" style={{ background: p.splash.background }}>
                  <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at 50% 50%, ${p.splash.ring}, transparent 60%)` }} />
                  <img src={p.logo} alt={`${p.name} logo`} className="relative h-40 max-w-[80%] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-7">
                  <div className="text-[11px] font-mono uppercase tracking-widest" style={{ color: p.splash.accent }}>{p.tag}</div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-chrome">{p.name}</h3>
                  <p className="mt-3 text-sm text-secondary-soft leading-relaxed">{p.blurb}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold group-hover:text-[var(--gold-mid)]">
                    View project <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

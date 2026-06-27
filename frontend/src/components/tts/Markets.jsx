import React from 'react';
import { Reveal } from './Reveal';

const CONTINENTS = [
  [150, 170, 70, 55],[210, 320, 35, 60],[395, 175, 45, 50],
  [430, 290, 55, 80],[560, 200, 90, 70],[650, 360, 30, 25],
];

function continentDots() {
  const dots = [];
  let seed = 1;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (const [cx, cy, rx, ry] of CONTINENTS) {
    const count = Math.round((rx * ry) / 28);
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0;
      for (let t = 0; t < 8; t++) {
        const u = rand() * 2 - 1, v = rand() * 2 - 1;
        if (u * u + v * v <= 1) { x = cx + u * rx; y = cy + v * ry; break; }
      }
      dots.push({ x, y, o: 0.18 + rand() * 0.32 });
    }
  }
  return dots;
}
const DOTS = continentDots();
const PINS = {
  usa:  { x: 150, y: 175, color: '#d4a843', label: 'USA',  sub: 'HQ' },
  emea: { x: 410, y: 185, color: '#00ffcc', label: 'EMEA', sub: 'Strategic' },
  apac: { x: 600, y: 230, color: '#00ffcc', label: 'APAC', sub: 'Active' },
};

function WorldMap() {
  return (
    <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="arcGoldCyan" x1="0" x2="1">
          <stop offset="0%" stopColor="#d4a843" />
          <stop offset="100%" stopColor="#00ffcc" />
        </linearGradient>
        <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g>{DOTS.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="1.6" fill="rgba(212,168,67,0.55)" opacity={d.o * 1.6} />)}</g>
      <path d={`M ${PINS.usa.x} ${PINS.usa.y} Q ${(PINS.usa.x + PINS.emea.x) / 2} ${Math.min(PINS.usa.y, PINS.emea.y) - 80} ${PINS.emea.x} ${PINS.emea.y}`} fill="none" stroke="url(#arcGoldCyan)" strokeWidth="1.2" className="dash-flow" />
      <path d={`M ${PINS.usa.x} ${PINS.usa.y} Q ${(PINS.usa.x + PINS.apac.x) / 2} ${Math.min(PINS.usa.y, PINS.apac.y) - 130} ${PINS.apac.x} ${PINS.apac.y}`} fill="none" stroke="url(#arcGoldCyan)" strokeWidth="1.2" className="dash-flow" />
      {Object.values(PINS).map((p) => (
        <g key={p.label} style={{ color: p.color }}>
          <circle cx={p.x} cy={p.y} r="28" fill="url(#pinGlow)" />
          <circle cx={p.x} cy={p.y} r="14" fill="none" stroke={p.color} strokeWidth="1" opacity="0.6" className="pulse-dot" />
          <circle cx={p.x} cy={p.y} r="5.5" fill={p.color} />
          <text x={p.x} y={p.y - 22} textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="700" letterSpacing="2" fill={p.color}>{p.label}</text>
          <text x={p.x} y={p.y + 24} textAnchor="middle" fontFamily="monospace" fontSize="9" letterSpacing="1.5" fill="rgba(220,220,230,0.55)">{p.sub.toUpperCase()}</text>
        </g>
      ))}
    </svg>
  );
}

export function Markets() {
  return (
    <section className="py-20 sm:py-24 md:py-32 bg-deep">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div className="eyebrow">Global Footprint</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-chrome">
            Where we <span className="gold-text-gradient">operate.</span>
          </h2>
          <div className="mt-10 space-y-8">
            <div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full pulse-dot" style={{background:'var(--gold-bright)'}} />
                <div className="text-xs font-mono uppercase tracking-widest text-gold">USA · Primary</div>
              </div>
              <p className="mt-3 text-secondary-soft max-w-md">Headquartered in California. Serving clients across North America with full-stack AI and software engagements.</p>
              <a href="mailto:athie@tailoredtechsolutions.org" className="mt-2 inline-block text-sm font-mono text-chrome hover:text-gold">athie@tailoredtechsolutions.org</a>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full pulse-dot" style={{background:'var(--neon-cyan)'}} />
                <div className="text-xs font-mono uppercase tracking-widest" style={{color:'var(--neon-cyan)'}}>Asia-Pacific · Active</div>
              </div>
              <p className="mt-3 text-secondary-soft max-w-md">Regional focus across Southeast and East Asia — mobile-first markets with high demand for custom platform engineering.</p>
              <a href="mailto:gwaltney@tailoredtechsolutions.org" className="mt-2 inline-block text-sm font-mono text-chrome hover:text-gold">gwaltney@tailoredtechsolutions.org</a>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full pulse-dot" style={{background:'var(--neon-cyan)'}} />
                <div className="text-xs font-mono uppercase tracking-widest" style={{color:'var(--neon-cyan)'}}>EMEA · Strategic</div>
              </div>
              <p className="mt-3 text-secondary-soft max-w-md">Partnerships across the Middle East and Europe — led by co-founder Ameer Al Saati.</p>
              <a href="mailto:alsaati@tailoredtechsolutions.org" className="mt-2 inline-block text-sm font-mono text-chrome hover:text-gold">alsaati@tailoredtechsolutions.org</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative aspect-[4/3] rounded-2xl bg-card-soft overflow-hidden" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}>
            <div className="absolute inset-0 circuit-grid opacity-[0.6]" />
            <WorldMap />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

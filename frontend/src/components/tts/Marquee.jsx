import React from 'react';

const ITEMS = [
  'AI Integration', 'Mobile Applications', 'Web Platforms',
  'Embedded Systems', 'UI/UX Engineering', 'Cloud Infrastructure',
  'Technology Consulting', 'Custom AI Models',
];

export function Marquee() {
  const all = [...ITEMS, ...ITEMS];
  return (
    <section className="bg-card-soft py-6 overflow-hidden" style={{borderTop:'1px solid var(--border-subtle)', borderBottom:'1px solid var(--border-subtle)'}}>
      <div className="marquee-track flex gap-12 whitespace-nowrap will-change-transform">
        {all.map((t, i) => (
          <span key={`${t}-${i}`} className={`flex items-center gap-12 font-display text-2xl md:text-3xl tracking-tight ${i % 2 === 0 ? 'text-gold' : 'text-chrome-mid'}`}>
            {t}
            <span className="text-gold-dim">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}

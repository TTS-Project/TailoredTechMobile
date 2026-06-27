import React from 'react';
import { Reveal } from './Reveal';

const T = [
  { q: 'TTS rebuilt our entire data pipeline and integrated an AI forecasting layer in six weeks. The quality of their TypeScript architecture alone saved us months of technical debt.', a: 'R. Matsuda', r: 'VP Engineering · AgriData Systems' },
  { q: "Andrew's structural engineering background shows in his software work — everything is load-bearing. No fluff, no shortcuts.", a: 'D. Okonkwo', r: 'Operations Director · LogiChain Co.' },
  { q: 'We handed them a requirements doc and got back a production app. The Terra Farming case study should be in every product school curriculum.', a: 'C. Reza', r: 'Founding Partner · Meridian Ventures' },
  { q: "Their engineering instincts are sharp. Edge cases we hadn't even articulated showed up handled in the first review.", a: 'M. Halvorsen', r: 'Head of Product · Northwind Robotics' },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24 md:py-32 bg-void">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 mb-12 md:mb-16">
        <Reveal>
          <div className="eyebrow">Field Reports</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-chrome">
            What clients <span className="gold-text-gradient">say.</span>
          </h2>
        </Reveal>
      </div>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
        <div className="grid gap-6 md:gap-7 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {T.map((t, i) => (
            <Reveal key={t.a} delay={i * 80}>
              <figure className="h-full glass rounded-2xl p-6 md:p-7 flex flex-col">
                <div className="text-gold font-display text-4xl leading-none">“</div>
                <blockquote className="mt-2 text-chrome leading-relaxed text-[15px] flex-1">{t.q}</blockquote>
                <figcaption className="mt-6 pt-4" style={{borderTop:'1px solid var(--border-subtle)'}}>
                  <div className="text-sm font-semibold text-chrome">{t.a}</div>
                  <div className="text-xs font-mono text-gold-dim uppercase tracking-widest mt-1">{t.r}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

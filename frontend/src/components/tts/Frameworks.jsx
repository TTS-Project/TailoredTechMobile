import React from 'react';
import { Reveal } from './Reveal';

const F = [
  { k: 'APNL', n: 'Adaptive Prompt Negotiation Loop', d: 'How humans iteratively converge on intent through multi-turn AI dialogue.' },
  { k: 'CFUX', n: 'Cognitive Flow User Experience', d: 'UX principles derived from Flow State theory, applied to AI-augmented workflows.' },
  { k: 'ECA',  n: 'Embodied Cognitive Architecture', d: 'Designing AI systems that account for human embodied cognition patterns.' },
  { k: 'HACP-1', n: 'Human–AI Collaboration Protocol v1', d: 'Structured methodology for pairing human expertise with model capabilities in professional contexts.' },
  { k: 'Somatic UX', n: 'Somatic User Experience', d: "Interface design informed by the body's physical responses — haptics, posture, and spatial computing." },
  { k: 'Nothing UX', n: 'The Design of Intentional Absence', d: "Using what an interface doesn't do as a primary design decision." },
];

export function Frameworks() {
  return (
    <section className="relative py-20 sm:py-24 md:py-32 bg-void overflow-hidden">
      <div className="absolute inset-0 circuit-grid opacity-[0.5]" />
      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
        <Reveal>
          <div className="eyebrow">Thought Leadership</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-chrome max-w-3xl">
            Original Frameworks. <span className="gold-text-gradient">Built in public.</span>
          </h2>
          <p className="mt-5 text-secondary-soft max-w-2xl">
            Andrew's original research into human–AI interaction design — frameworks that challenge how we think about intelligent interfaces.
          </p>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 gap-5">
          {F.map((x, i) => (
            <Reveal key={x.k} delay={i * 60}>
              <div className="group relative h-full bg-card-soft rounded-2xl p-7 overflow-hidden transition-colors"
                style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-bright)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{background:'radial-gradient(circle, rgba(212,168,67,0.12), transparent 70%)'}} />
                <div className="relative">
                  <div className="font-mono text-2xl md:text-3xl text-gold font-medium">{x.k}</div>
                  <div className="mt-2 font-display text-lg font-semibold text-chrome">{x.n}</div>
                  <p className="mt-3 text-secondary-soft leading-relaxed">{x.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

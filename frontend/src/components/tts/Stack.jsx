import React from 'react';
import { Reveal } from './Reveal';

const TECH = [
  'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui',
  'Supabase', 'PostgreSQL', 'React Native', 'Capacitor', 'Netlify',
  'Three.js', 'Node.js', 'Python', 'FastAPI', 'TensorFlow',
  'OpenAI API', 'Anthropic API', 'GitHub Actions', 'AWS', 'Cloudflare',
];

export function Stack() {
  return (
    <section className="py-24 md:py-32 bg-void">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-10">
        <Reveal className="md:col-span-4">
          <div className="eyebrow">The Toolkit</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-chrome leading-tight">
            The Stack. <span className="gold-text-gradient">Every time.</span>
          </h2>
          <p className="mt-6 text-secondary-soft max-w-md">
            We're opinionated about tooling. Every project ships on a stack we've battle-tested in production, so engineering time goes to your product, not to evaluating dependencies.
          </p>
        </Reveal>
        <Reveal delay={120} className="md:col-span-8">
          <div className="flex flex-wrap gap-2.5">
            {TECH.map((t, i) => (
              <span key={t} className="rounded-full bg-card-soft px-4 py-2 text-sm font-mono text-chrome-mid transition-colors"
                style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)', transitionDelay:`${i*20}ms`}}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold-bright)'; e.currentTarget.style.color='var(--gold-bright)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.color='var(--chrome-mid)'; }}
              >{t}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

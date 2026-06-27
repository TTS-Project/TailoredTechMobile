import React from 'react';
import { Mail } from 'lucide-react';
import { Reveal } from './Reveal';

const FOUNDERS = [
  {
    photo: '/logos/founder-andrew.jpg',
    photoPosition: '50% 30%',
    name: 'Andrew K. Gwaltney',
    role: 'Co-Founder & CEO · PE',
    bio: "Andrew brings a rare combination of rigorous analytical engineering — honed through years of structural design — and full-stack software product development. He leads TTS's technical strategy, client relationships, and AI integration practice.",
    tags: ['AI Architecture', 'React / TypeScript', 'Supabase', 'Structural Engineering (PE)'],
    email: 'gwaltney@tailoredtechsolutions.org',
  },
  {
    photo: '/logos/founder-ameer.jpg',
    photoPosition: '50% 35%',
    name: 'Ameer Al Saati',
    role: 'Co-Founder & CTO',
    bio: 'Ameer drives the engineering depth at TTS — from embedded systems and firmware to scalable cloud architectures. His background spans multiple technology domains with a focus on building systems that perform under real-world conditions.',
    tags: ['Embedded Systems', 'Cloud Infrastructure', 'Mobile Development', 'Systems Architecture'],
    email: 'alsaati@tailoredtechsolutions.org',
  },
];

export function Founders() {
  return (
    <section id="about" className="relative py-20 sm:py-24 md:py-32 bg-deep">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
        <Reveal>
          <div className="eyebrow">The Builders</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-chrome">
            Two founders. <span className="gold-text-gradient">One standard.</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {FOUNDERS.map((f, i) => (
            <Reveal key={f.name} delay={i * 100}>
              <article className="h-full bg-card-soft rounded-2xl p-8 md:p-10 gold-diffuse transition-all"
                style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-bright)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div className="flex items-center gap-5">
                  <img src={f.photo} alt={f.name} className="w-16 h-16 rounded-full object-cover shrink-0" style={{ borderWidth:'2px', borderStyle:'solid', borderColor:'var(--gold-dim)', objectPosition: f.photoPosition }} />
                  <div>
                    <h3 className="font-display text-2xl font-bold text-chrome leading-tight">{f.name}</h3>
                    <div className="text-xs font-mono uppercase tracking-widest text-gold-dim mt-1">{f.role}</div>
                  </div>
                </div>
                <p className="mt-6 text-secondary-soft leading-relaxed">{f.bio}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {f.tags.map((t) => (
                    <span key={t} className="text-[11px] font-mono px-2.5 py-1 rounded text-chrome-mid" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}>{t}</span>
                  ))}
                </div>
                <a href={`mailto:${f.email}`} className="mt-6 inline-flex items-center gap-2 text-sm text-gold hover:text-[var(--gold-mid)]">
                  <Mail size={14} /> {f.email}
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono uppercase tracking-widest text-chrome-mid">
            <span>Digital Cartel Global LLC</span>
            <span className="text-gold-dim">·</span>
            <span>Wyoming</span>
            <span className="text-gold-dim">·</span>
            <span>EIN 42-2500306</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

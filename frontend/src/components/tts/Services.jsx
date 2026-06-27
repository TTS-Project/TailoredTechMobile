import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';
import {
  AnalyticsScene, CyberScene, SalesAgentScene, AutomationScene,
  MobileScene, WebScene, SocialScene, ContentScene, ChatBotScene,
  VoiceAgentScene, VirtualAssistantScene, MarketingTeamScene, CallCenterScene,
} from './ServiceScenes';

const SERVICES = [
  { Scene: AnalyticsScene, name: 'Custom CRM & Analytics Platforms', body: 'Bespoke CRMs and dashboards engineered to your pipeline — live charts, KPI surfaces, and revenue intelligence wired directly into your data.' },
  { Scene: CyberScene, name: 'Cybersecurity Engineering', body: 'Threat modeling, zero-trust architecture, hardened auth, and continuous monitoring. We build the locks before someone tests the door.' },
  { Scene: SalesAgentScene, name: 'AI Sales & Lead Generation Agents', body: 'Inbound and outbound voice agents, appointment setters, survey bots, and lead-gen workflows that work the phones 24/7 — never sick, never off-script.' },
  { Scene: AutomationScene, name: 'AI Integration & Automation', body: 'Production-grade AI infrastructure. Models, pipelines, and APIs stitched into your existing workflows so the busywork disappears.' },
  { Scene: MobileScene, name: 'Mobile Application Development', body: 'Cross-platform iOS and Android apps built with React Native and Capacitor. App Store–ready, scalable from day one.' },
  { Scene: WebScene, name: 'Web Platform Engineering', body: "Full-stack web apps from architecture to deployment. React, TypeScript, Supabase — modern stacks that don't rot." },
  { Scene: SocialScene, name: 'Social Media Management', body: 'End-to-end social ops — scheduling, community engagement, analytics, and growth playbooks across every major platform.' },
  { Scene: ContentScene, name: 'Content Creation Studio', body: 'Short-form video, branded graphics, copy, and campaign assets produced at studio quality and shipped on cadence.' },
  { Scene: ChatBotScene, name: 'Personalized Chat Bots', body: 'Custom-trained bots that speak in your brand voice — onboarding, support, qualification, and retention without the script feel.' },
  { Scene: VoiceAgentScene, name: 'Custom Super Agents', body: 'Voice-first agents with state-of-the-art turn-taking, interruption handling, and natural cadence. Smoother flow than anything else on the market.' },
  { Scene: VirtualAssistantScene, name: 'AI Virtual Assistants', body: 'Always-on assistants that book your calendar, triage email, manage CRMs, run errands across your tools — your second brain on shift.' },
  { Scene: MarketingTeamScene, name: 'Fully Automated Marketing Teams', body: 'An entire growth org as a service — strategists, copywriters, designers, and analysts orchestrated by AI to run campaigns end-to-end.' },
  { Scene: CallCenterScene, name: 'Automated Call Centers', body: 'Hundreds of concurrent AI agents handling inbound and outbound calls — qualification, support, surveys, scheduling — at a fraction of the cost.' },
];

export function Services() {
  return (
    <section id="services" className="relative py-20 sm:py-24 md:py-32 bg-void">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
        <Reveal>
          <div className="eyebrow">What we build</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-chrome max-w-3xl">
            Every engagement is custom. Zero templates.
          </h2>
        </Reveal>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((s, i) => (
            <Reveal key={s.name} delay={i * 60}>
              <a href="#contact" className="group relative block bg-card-soft rounded-2xl overflow-hidden gold-diffuse transition-all h-full"
                style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-dim)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div className="relative h-56 md:h-64 overflow-hidden" style={{borderBottom:'1px solid var(--border-subtle)', background:'var(--bg-deep)'}}>
                  <s.Scene />
                  <span className="absolute top-4 right-4 text-[10px] font-mono text-gold-dim tracking-widest">0{i + 1}</span>
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-chrome leading-tight">{s.name}</h3>
                  <p className="mt-3 text-secondary-soft leading-relaxed">{s.body}</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-gold text-xs font-mono uppercase tracking-widest">
                    Engage <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

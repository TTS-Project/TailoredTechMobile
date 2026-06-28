import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, ChevronDown, LifeBuoy, MessageCircle, BookOpen } from 'lucide-react';
import { Nav } from '../components/tts/Nav';
import { Footer } from '../components/tts/Footer';

const FAQS = [
  {
    q: 'How does the 50% deposit work?',
    a: 'When you check out, we charge 50% of the Total Project Value (which already includes the $49.95 AI Project Consultation). This deposit secures your engineering slot. The remaining 50% is invoiced upon completion, before final delivery.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Sign in, click your avatar in the top-right, and choose “Delete account”. We will immediately remove your authentication credentials and personal data from active systems. Order records may be retained for up to 7 years to satisfy US tax law, but are anonymised after that.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Deposits are non-refundable once work begins because we allocate engineering capacity immediately. If we materially fail to deliver, we issue a pro-rated refund within 30 days. Digital products are non-refundable once downloaded.',
  },
  {
    q: 'I forgot my password — how do I reset it?',
    a: 'Self-serve password reset is not yet available. Email support@tailoredtechsolutions.org from the address tied to your account and we will help within 1 business day.',
  },
  {
    q: 'Where can I see my orders?',
    a: 'A “My Orders” dashboard is on our short-term roadmap. Today, email support@tailoredtechsolutions.org with your account email and we will pull your order history.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'We deliver digital services globally. Project contracts are written in English and governed by California law (USA).',
  },
  {
    q: 'Is my payment information stored on your servers?',
    a: 'No. Payments are processed by PayPal. We only store the order amount, currency, your internal user id, and PayPal’s order/capture IDs — never your card number or PayPal credentials.',
  },
  {
    q: 'Do you use AI on my data?',
    a: 'Only when you commission an AI service (chatbot, voice agent, automation), and only with the data you provide for that engagement. We will tell you which AI provider (OpenAI, Anthropic, Google) will see the data before work begins and obtain explicit written consent.',
  },
];

export default function SupportPage() {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="relative pt-32 sm:pt-36 pb-24 bg-void">
        <div className="absolute inset-0 circuit-grid opacity-[0.35] pointer-events-none" />
        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12">
          <Link to="/" className="inline-flex items-center gap-2 text-chrome-mid hover:text-gold mb-6" data-testid="legal-back-home"><ArrowLeft size={14} /> Back to home</Link>
          <div className="eyebrow">Help & Support</div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-chrome">We&apos;re here to <span className="gold-text-gradient">help.</span></h1>
          <p className="mt-5 text-sm sm:text-base text-secondary-soft max-w-2xl leading-relaxed">
            Real humans, fast answers. Choose how you&apos;d like to reach us — or scroll down for the questions we hear most often.
          </p>

          {/* Contact cards */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ContactCard icon={Mail} eyebrow="Customer Service" title="CS@tailoredtechsolutions.org" href="mailto:CS@tailoredtechsolutions.org" note="Replies within 1 business day" />
            <ContactCard icon={LifeBuoy} eyebrow="Technical Support" title="support@tailoredtechsolutions.org" href="mailto:support@tailoredtechsolutions.org" note="For bugs, account, billing" />
            <ContactCard icon={Phone} eyebrow="Phone" title="(940) 601-5260" href="tel:+19406015260" note="9am–6pm PT, Mon–Fri" />
            <ContactCard icon={MessageCircle} eyebrow="Project Inquiries" title="gwaltney@tailoredtechsolutions.org" href="mailto:gwaltney@tailoredtechsolutions.org" note="Direct to leadership" />
            <ContactCard icon={MapPin} eyebrow="Mail" title="Nipomo, CA 93444" note="Digital Cartel Global LLC" />
            <ContactCard icon={BookOpen} eyebrow="Start a project" title="AI Readiness Intake" to="/intake" note="21 questions, 7 dimensions" />
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <div className="eyebrow">Frequently Asked</div>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-chrome">Questions, answered.</h2>
            <div className="mt-8 space-y-3" data-testid="support-faq-list">
              {FAQS.map((f, i) => (
                <FaqItem key={f.q} index={i} q={f.q} a={f.a} />
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-3xl p-6 sm:p-8 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.10), rgba(13,13,26,0.6))', border: '1px solid var(--gold-dim)' }}>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-chrome">Didn&apos;t find your answer?</h3>
            <p className="mt-3 text-sm text-chrome-mid">Email us — we read every message and reply personally.</p>
            <a href="mailto:support@tailoredtechsolutions.org" data-testid="support-email-cta"
              className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[52px] rounded-xl font-semibold transition-all active:scale-[0.98] hover:opacity-90"
              style={{ background: 'var(--gold-bright)', color: '#09090f' }}>
              <Mail size={14} /> Email support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ContactCard({ icon: Icon, eyebrow, title, href, to, note }) {
  const Inner = (
    <div className="h-full rounded-2xl p-5 sm:p-6 transition-all bg-card-soft group hover:opacity-90" style={{ border: '1px solid var(--border-subtle)' }}>
      <span className="inline-flex w-10 h-10 rounded-xl items-center justify-center" style={{ background: 'rgba(212,168,67,0.10)', border: '1px solid var(--gold-dim)' }}>
        <Icon size={16} className="text-gold" />
      </span>
      <div className="mt-4 text-[10px] font-mono uppercase tracking-widest text-gold-dim">{eyebrow}</div>
      <div className="mt-1 font-display text-base text-chrome group-hover:text-gold transition-colors break-all">{title}</div>
      {note && <div className="mt-2 text-xs text-chrome-mid">{note}</div>}
    </div>
  );
  if (to) return <Link to={to} className="block">{Inner}</Link>;
  if (href) return <a href={href} className="block">{Inner}</a>;
  return <div>{Inner}</div>;
}

function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div data-testid={`faq-${index}`} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
      <button type="button" onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
        <span className="font-display text-base sm:text-lg text-chrome font-semibold">{q}</span>
        <ChevronDown size={16} className={`text-gold transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-chrome-mid leading-relaxed">{a}</div>
      )}
    </div>
  );
}

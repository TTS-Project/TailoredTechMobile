import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Reveal } from './Reveal';

export function Contact() {
  const [state, setState] = useState('idle');
  const [errors, setErrors] = useState({});

  function validate(data) {
    const errs = {};
    if (!data.name || data.name.trim().length === 0) errs.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(data.email)) errs.email = 'Enter a valid email';
    if (!data.message || data.message.trim().length < 10) errs.message = 'Tell us a bit more (10+ characters)';
    return errs;
  }

  function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      company: String(fd.get('company') || ''),
      message: String(fd.get('message') || ''),
    };
    const errs = validate(data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setState('loading');
    setTimeout(() => setState('success'), 900);
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-void overflow-hidden">
      <div className="absolute inset-0 circuit-grid opacity-[0.5]" />
      <div className="absolute -top-40 left-1/3 w-[520px] h-[520px] rounded-full" style={{background:'radial-gradient(circle, rgba(212,168,67,0.12), transparent 60%)', filter:'blur(40px)'}} />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="eyebrow">Begin</div>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tight text-chrome">
            Start a <span className="gold-text-gradient">conversation.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 gap-10 lg:gap-16">
          <Reveal>
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              {[
                { name: 'name', label: 'Full Name', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'company', label: 'Company / Organization (optional)', type: 'text' },
              ].map((f) => (
                <div key={f.name}>
                  <label htmlFor={f.name} className="block text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-2">{f.label}</label>
                  <input id={f.name} name={f.name} type={f.type}
                    className="w-full bg-card-soft rounded-lg px-4 py-3 text-chrome outline-none transition-colors"
                    style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
                    onFocus={e => e.currentTarget.style.borderColor='var(--gold-bright)'}
                    onBlur={e => e.currentTarget.style.borderColor='var(--border-subtle)'}
                  />
                  {errors[f.name] && <div className="mt-1.5 text-xs text-red-400">{errors[f.name]}</div>}
                </div>
              ))}
              <div>
                <label htmlFor="message" className="block text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-2">What are you building?</label>
                <textarea id="message" name="message" rows={4}
                  className="w-full bg-card-soft rounded-lg px-4 py-3 text-chrome outline-none transition-colors resize-none"
                  style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
                  onFocus={e => e.currentTarget.style.borderColor='var(--gold-bright)'}
                  onBlur={e => e.currentTarget.style.borderColor='var(--border-subtle)'}
                />
                {errors.message && <div className="mt-1.5 text-xs text-red-400">{errors.message}</div>}
              </div>
              <button type="submit" disabled={state !== 'idle'}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all active:scale-[0.99] disabled:opacity-80 hover:opacity-90"
                style={{background:'var(--gold-bright)', color:'#09090f'}}
              >
                {state === 'idle' && 'Send Message'}
                {state === 'loading' && (<><Loader2 size={16} className="animate-spin" /> Sending…</>)}
                {state === 'success' && (<><Check size={16} /> Received. We'll be in touch within 24 hours.</>)}
              </button>
            </form>
          </Reveal>

          <Reveal delay={120}>
            <div className="bg-card-soft rounded-2xl p-8 gold-diffuse h-full" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}>
              <div className="font-display text-2xl text-chrome">Tailored Tech Solutions</div>
              <div className="mt-6 space-y-3 font-mono text-sm">
                <a href="mailto:gwaltney@tailoredtechsolutions.org" className="block text-gold hover:text-[var(--gold-mid)]">gwaltney@tailoredtechsolutions.org</a>
                <a href="tel:+19406015260" className="block text-chrome hover:text-gold">(940) 601-5260</a>
                <div className="text-chrome-mid pt-2">164 S Mallagh Street<br/>Nipomo, CA 93444</div>
              </div>
              <div className="mt-8 pt-6" style={{borderTop:'1px solid var(--border-subtle)'}}>
                <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim">Legal Entity</div>
                <div className="mt-2 text-sm text-chrome">Digital Cartel Global LLC</div>
                <div className="text-xs font-mono text-chrome-mid mt-1">EIN: 42-2500306 · Registered: Wyoming</div>
              </div>
              <div className="mt-8 pt-6 grid grid-cols-2 gap-4" style={{borderTop:'1px solid var(--border-subtle)'}}>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim">USA</div>
                  <a href="mailto:athie@tailoredtechsolutions.org" className="block mt-1.5 text-sm font-mono text-chrome hover:text-gold break-all">athie@tailoredtechsolutions.org</a>
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim">APAC</div>
                  <a href="mailto:gwaltney@tailoredtechsolutions.org" className="block mt-1.5 text-sm font-mono text-chrome hover:text-gold break-all">gwaltney@tailoredtechsolutions.org</a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

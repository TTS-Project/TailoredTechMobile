import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Check, Loader2, ArrowRight, Mail } from 'lucide-react';
import { INTAKE_SECTIONS, TOTAL_QUESTIONS, isAnswered } from '../../data/intakeQuestions';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SECTION_LABELS = INTAKE_SECTIONS.map(s => s.label);

function flatQuestions() {
  const out = [];
  INTAKE_SECTIONS.forEach((sec, si) => sec.questions.forEach(q => out.push({ ...q, sectionIndex: si })));
  return out;
}
const FLAT = flatQuestions();

// ---------- Reusable inputs ----------

function RadioGroup({ q, value, onChange }) {
  const cols = q.columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2';
  return (
    <div className={`grid ${cols} gap-2.5`}>
      {q.options.map(opt => {
        const selected = value === opt.value;
        return (
          <label key={opt.value}
            className="group cursor-pointer flex items-start gap-3 rounded-xl px-4 py-3.5 transition-all"
            style={{
              borderWidth: '1px', borderStyle: 'solid',
              borderColor: selected ? 'var(--gold-bright)' : 'var(--border-subtle)',
              background: selected ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)',
            }}
          >
            <input type="radio" name={q.id} value={opt.value} checked={selected}
              onChange={() => onChange(opt.value)} className="sr-only" />
            <span aria-hidden="true" className="mt-0.5 shrink-0 w-4 h-4 rounded-full inline-flex items-center justify-center"
              style={{
                borderWidth: '1.5px', borderStyle: 'solid',
                borderColor: selected ? 'var(--gold-bright)' : 'var(--chrome-dim)',
              }}
            >
              {selected && <span className="w-2 h-2 rounded-full" style={{background:'var(--gold-bright)'}} />}
            </span>
            <span className="text-sm leading-snug" style={{color: selected ? 'var(--chrome-light)' : 'var(--text-secondary)'}}>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function CheckboxGroup({ q, value = [], onChange }) {
  const cols = q.columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2';
  const toggle = (v) => {
    const set = new Set(value);
    if (set.has(v)) set.delete(v); else set.add(v);
    onChange(Array.from(set));
  };
  return (
    <div className={`grid ${cols} gap-2.5`}>
      {q.options.map(opt => {
        const selected = value.includes(opt.value);
        return (
          <label key={opt.value}
            className="group cursor-pointer flex items-start gap-3 rounded-xl px-4 py-3.5 transition-all"
            style={{
              borderWidth: '1px', borderStyle: 'solid',
              borderColor: selected ? 'var(--gold-bright)' : 'var(--border-subtle)',
              background: selected ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)',
            }}
          >
            <input type="checkbox" name={q.id} value={opt.value} checked={selected}
              onChange={() => toggle(opt.value)} className="sr-only" />
            <span aria-hidden="true" className="mt-0.5 shrink-0 w-4 h-4 rounded-[4px] inline-flex items-center justify-center"
              style={{
                borderWidth: '1.5px', borderStyle: 'solid',
                borderColor: selected ? 'var(--gold-bright)' : 'var(--chrome-dim)',
                background: selected ? 'var(--gold-bright)' : 'transparent',
              }}
            >
              {selected && <Check size={11} strokeWidth={3} style={{color:'#09090f'}} />}
            </span>
            <span className="text-sm leading-snug" style={{color: selected ? 'var(--chrome-light)' : 'var(--text-secondary)'}}>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function ScaleInput({ q, value, onChange }) {
  const min = q.min ?? 1, max = q.max ?? 10;
  const v = value ?? '';
  const pct = v === '' ? 0 : ((Number(v) - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <div
          className="font-display font-bold text-4xl"
          style={{
            color: v === '' ? 'var(--gold-dim)' : 'var(--gold-bright)',
            textShadow: v === '' ? 'none' : '0 0 14px rgba(212,168,67,0.45)',
          }}
        >
          {v === '' ? '—' : v}
        </div>
      </div>
      <div className="relative">
        <input
          type="range" min={min} max={max} step={1}
          value={v === '' ? Math.round((min + max) / 2) : v}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full tts-range" aria-label={q.text}
          style={{ '--pct': `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-mono uppercase tracking-widest text-chrome-mid">
        <span>{q.endpoints?.[0]}</span>
        <span>{q.endpoints?.[1]}</span>
      </div>
    </div>
  );
}

function TextareaInput({ q, value = '', onChange }) {
  return (
    <textarea
      name={q.id}
      placeholder={q.placeholder}
      value={value}
      rows={q.rows || 3}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-card-soft rounded-xl px-4 py-3 text-chrome outline-none transition-colors resize-y"
      style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)', minHeight: '120px'}}
      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--gold-bright)'}
      onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
    />
  );
}

// ---------- Question card ----------

function QuestionCard({ q, number, value, onChange }) {
  const answered = isAnswered(q, { [q.id]: value });
  return (
    <div
      className="rounded-2xl p-5 sm:p-6 md:p-7 transition-all"
      style={{
        background: 'rgba(20,20,32,0.72)',
        backdropFilter: 'blur(6px)',
        borderWidth: '1px', borderStyle: 'solid',
        borderColor: answered ? 'rgba(212,168,67,0.45)' : 'var(--border-subtle)',
        boxShadow: answered ? '0 20px 40px -15px rgba(212,168,67,0.10)' : 'none',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-gold-dim">Question {String(number).padStart(2, '0')}</span>
        <span
          aria-hidden="true"
          className="w-6 h-6 rounded-full inline-flex items-center justify-center transition-all"
          style={{
            background: answered ? 'var(--gold-bright)' : 'transparent',
            borderWidth: '1px', borderStyle: 'solid',
            borderColor: answered ? 'var(--gold-bright)' : 'var(--border-subtle)',
          }}
        >
          {answered && <Check size={12} strokeWidth={3} style={{color:'#09090f'}} />}
        </span>
      </div>
      <p className="font-display text-lg sm:text-xl font-semibold text-chrome leading-snug">{q.text}</p>
      {q.hint && <p className="mt-1.5 text-[13px] text-chrome-mid">{q.hint}</p>}
      <div className="mt-5">
        {q.type === 'radio' && <RadioGroup q={q} value={value} onChange={onChange} />}
        {q.type === 'checkbox' && <CheckboxGroup q={q} value={value} onChange={onChange} />}
        {q.type === 'scale' && <ScaleInput q={q} value={value} onChange={onChange} />}
        {q.type === 'textarea' && <TextareaInput q={q} value={value} onChange={onChange} />}
      </div>
    </div>
  );
}

// ---------- Main form ----------

export function IntakeForm({ embedded = false }) {
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: '', email: '', company: '' });
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);

  const answeredCount = useMemo(() =>
    FLAT.reduce((n, q) => n + (isAnswered(q, answers) ? 1 : 0), 0)
  , [answers]);
  const pct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  // Section spy
  useEffect(() => {
    const els = INTAKE_SECTIONS.map((_, i) => document.getElementById(`intake-sec-${i}`)).filter(Boolean);
    if (!els.length) return;
    const compute = () => {
      const line = 220;
      let best = 0, bestTop = -Infinity;
      els.forEach((el, i) => {
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > bestTop) { bestTop = top; best = i; }
      });
      setActiveSection(best);
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => { window.removeEventListener('scroll', compute); window.removeEventListener('resize', compute); };
  }, [state]);

  const setAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));

  const validate = () => {
    if (!contact.name.trim()) return 'Please share your name.';
    if (!/^\S+@\S+\.\S+$/.test(contact.email)) return 'Please enter a valid email.';
    if (answeredCount < TOTAL_QUESTIONS) {
      const first = FLAT.find(q => !isAnswered(q, answers));
      const el = document.getElementById(`q-${first.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return `Please answer all ${TOTAL_QUESTIONS} questions (${answeredCount}/${TOTAL_QUESTIONS}).`;
    }
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setErrorMsg(err); setState('error'); return; }
    setErrorMsg('');
    setState('loading');
    try {
      const payload = {
        contact,
        answers,
        meta: { total: TOTAL_QUESTIONS, answered: answeredCount, userAgent: navigator.userAgent, submittedAt: new Date().toISOString() },
      };
      const res = await axios.post(`${API}/intake`, payload, { timeout: 30000 });
      if (res.status >= 200 && res.status < 300) {
        setState('success');
        window.scrollTo({ top: formRef.current?.offsetTop || 0, behavior: 'smooth' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (err2) {
      setState('error');
      setErrorMsg("We couldn't submit your diagnostic. Please try again, or email gwaltney@tailoredtechsolutions.org directly.");
    }
  };

  if (state === 'success') {
    return (
      <SuccessSummary answers={answers} contact={contact} />
    );
  }

  return (
    <div ref={formRef}>
      {/* Sticky progress */}
      <div className="sticky top-[76px] z-20 -mx-5 sm:-mx-6 md:-mx-12 px-5 sm:px-6 md:px-12 py-4 backdrop-blur-xl"
        style={{ background: 'rgba(9,9,15,0.85)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-dim">
            <span className="text-gold font-semibold">{answeredCount}</span> / {TOTAL_QUESTIONS} answered
          </span>
          <span className="text-[11px] font-mono text-chrome-mid">{pct}% complete</span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(to right, var(--gold-mid), var(--gold-bright))' }} />
        </div>
        <div className="mt-3 flex items-center gap-2 overflow-x-auto scrollbar-hidden">
          {SECTION_LABELS.map((label, i) => (
            <a key={label} href={`#intake-sec-${i}`}
              className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-colors"
              style={{
                background: activeSection === i ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)',
                color: activeSection === i ? 'var(--gold-bright)' : 'var(--chrome-mid)',
                borderWidth: '1px', borderStyle: 'solid',
                borderColor: activeSection === i ? 'var(--gold-dim)' : 'var(--border-subtle)',
              }}
            >
              {String(i + 1).padStart(2, '0')} · {label}
            </a>
          ))}
        </div>
      </div>

      {/* Intro */}
      <div className="mt-8 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 flex items-start gap-4"
        style={{ background: 'rgba(212,168,67,0.06)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-subtle)' }}>
        <span className="shrink-0 text-gold text-xl leading-none mt-0.5">⚡</span>
        <p className="text-sm sm:text-base text-chrome-mid leading-relaxed">
          Answer based on how things actually run — not how they should. <strong className="text-chrome">Honesty beats polish here.</strong> Your responses are used exclusively to design the most relevant AI strategy for your team.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-10" noValidate>
        {/* Contact identity block */}
        <div id="intake-contact" className="rounded-2xl p-5 sm:p-6 md:p-7"
          style={{ background: 'rgba(20,20,32,0.72)', backdropFilter: 'blur(6px)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-subtle)' }}>
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-gold-dim">Your details</span>
          <h3 className="mt-1 font-display text-lg sm:text-xl font-semibold text-chrome">Who is filling this out?</h3>
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <ContactField label="Full name" value={contact.name} onChange={(v) => setContact(s => ({ ...s, name: v }))} />
            <ContactField label="Email" type="email" value={contact.email} onChange={(v) => setContact(s => ({ ...s, email: v }))} />
            <ContactField label="Company / Organization (optional)" value={contact.company} onChange={(v) => setContact(s => ({ ...s, company: v }))} containerClass="sm:col-span-2" />
          </div>
        </div>

        {/* Sections */}
        {INTAKE_SECTIONS.map((sec, i) => {
          const startNum = INTAKE_SECTIONS.slice(0, i).reduce((s, x) => s + x.questions.length, 1);
          return (
            <div key={sec.label} id={`intake-sec-${i}`} className="space-y-5">
              <div className="flex items-center gap-3 pt-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-gold-dim">{String(i + 1).padStart(2, '0')}</span>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, var(--gold-dim), transparent)' }} />
                <span className="font-display text-base sm:text-lg font-semibold text-gold uppercase tracking-wider">{sec.label}</span>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, var(--gold-dim), transparent)' }} />
              </div>
              {sec.questions.map((q, qi) => (
                <div key={q.id} id={`q-${q.id}`}>
                  <QuestionCard
                    q={q}
                    number={startNum + qi}
                    value={answers[q.id]}
                    onChange={(v) => setAnswer(q.id, v)}
                  />
                </div>
              ))}
            </div>
          );
        })}

        {/* Submit */}
        <div className="rounded-2xl p-6 sm:p-8 md:p-10 text-center"
          style={{ background: 'linear-gradient(180deg, rgba(20,12,8,0.92) 0%, rgba(13,13,26,0.88) 100%)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--gold-dim)' }}>
          <div className="font-display text-2xl sm:text-3xl font-bold text-chrome">You're done.</div>
          <p className="mt-3 text-chrome-mid max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            Submit your responses and we'll map out exactly where AI can deliver the highest ROI for your operation.
          </p>
          {state === 'error' && errorMsg && (
            <div className="mt-5 inline-block text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
              {errorMsg}
            </div>
          )}
          <button type="submit" disabled={state === 'loading'}
            className="mt-6 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 min-h-[52px] rounded-xl font-semibold transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-70"
            style={{ background: 'var(--gold-bright)', color: '#09090f' }}
          >
            {state === 'loading' ? (<><Loader2 size={16} className="animate-spin" /> Sending…</>) : (<>Submit My Diagnostic <ArrowRight size={16} /></>)}
          </button>
          <p className="mt-4 text-[11px] font-mono uppercase tracking-widest text-chrome-mid">
            Sent privately to&nbsp;
            <a href="mailto:gwaltney@tailoredtechsolutions.org" className="text-gold hover:underline">gwaltney@tailoredtechsolutions.org</a>
          </p>
        </div>
      </form>
    </div>
  );
}

function ContactField({ label, type = 'text', value, onChange, containerClass = '' }) {
  return (
    <div className={containerClass}>
      <label className="block text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-card-soft rounded-lg px-4 py-3 min-h-[48px] text-chrome outline-none transition-colors"
        style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-subtle)' }}
        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--gold-bright)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
      />
    </div>
  );
}

function SuccessSummary({ answers, contact }) {
  // Build a snapshot of selected highlights
  const items = [];
  const find = (id) => INTAKE_SECTIONS.flatMap(s => s.questions).find(q => q.id === id);
  const labelFor = (id) => {
    const q = find(id);
    const v = answers[id];
    if (!q) return '';
    if (q.type === 'radio') return q.options.find(o => o.value === v)?.label || '';
    if (q.type === 'checkbox') return (v || []).map(x => q.options.find(o => o.value === x)?.label).filter(Boolean).join(' · ');
    if (q.type === 'scale') return String(v);
    if (q.type === 'textarea') return v;
    return '';
  };
  ['q1','q2','q4','q5','q8','q12','q13','q17','q18','q20'].forEach(id => {
    const v = labelFor(id);
    if (v) items.push({ id, q: find(id).text, a: v });
  });

  return (
    <div className="text-center py-12 sm:py-16">
      <div className="mx-auto w-16 h-16 rounded-full inline-flex items-center justify-center"
        style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: 'var(--gold-bright)', background: 'var(--gold-glow)' }}>
        <Check size={28} strokeWidth={3} style={{ color: 'var(--gold-bright)' }} />
      </div>
      <h2 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-chrome">Diagnostic <span className="gold-text-gradient">complete.</span></h2>
      <p className="mt-4 text-chrome-mid max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
        Thanks {contact.name?.split(' ')[0] || 'there'} — your responses have been sent to our strategy team.
        We'll be in touch at <span className="text-gold">{contact.email}</span> within 24 hours.
      </p>
      <div className="mt-10 text-left max-w-2xl mx-auto rounded-2xl p-6 sm:p-8"
        style={{ background: 'rgba(20,20,32,0.72)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-subtle)' }}>
        <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-4">Your snapshot</div>
        <dl className="space-y-4">
          {items.map((it) => (
            <div key={it.id}>
              <dt className="text-xs text-chrome-mid">{it.q}</dt>
              <dd className="mt-1 text-sm text-chrome font-medium">{it.a}</dd>
            </div>
          ))}
        </dl>
      </div>
      <a href="mailto:gwaltney@tailoredtechsolutions.org" className="mt-8 inline-flex items-center gap-2 text-gold hover:underline">
        <Mail size={14} /> Reply directly to gwaltney@tailoredtechsolutions.org
      </a>
    </div>
  );
}

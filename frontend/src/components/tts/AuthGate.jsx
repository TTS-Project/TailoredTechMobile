import React, { useEffect, useState } from 'react';
import { Lock, Mail, KeyRound, User, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * AuthGate
 * --------
 * Locks all content below the Hero with an Apple-quality glassmorphism overlay.
 * Renders nothing once the user is authenticated. While checking session it
 * shows a faint loading shimmer so we don't flash the gate to authed users.
 *
 * IMPORTANT: this wraps the post-Hero sections only. The Hero remains visible.
 */
export function AuthGate({ children }) {
  const { isChecking, isAuthed } = useAuth();
  const [dissolving, setDissolving] = useState(false);
  const [wasAuthed, setWasAuthed] = useState(false);

  // When user transitions from un-authed -> authed, play a brief blur-out animation.
  useEffect(() => {
    if (isAuthed && !wasAuthed) {
      setDissolving(true);
      const t = setTimeout(() => { setDissolving(false); setWasAuthed(true); }, 700);
      return () => clearTimeout(t);
    }
    if (!isAuthed) setWasAuthed(false);
  }, [isAuthed, wasAuthed]);

  // While we're still figuring out auth status, hide gate to avoid flicker.
  if (isChecking) {
    return (
      <div className="relative">
        <div aria-hidden="true" className="select-none pointer-events-none filter blur-[4px] opacity-40">
          {children}
        </div>
      </div>
    );
  }

  if (isAuthed && !dissolving) return children;

  return (
    <div className="relative" data-testid="auth-gate-wrapper">
      {/* Locked content behind frosted glass — limited to one viewport so user can't scroll past it. */}
      <div
        aria-hidden="true"
        data-testid="auth-gate-locked-content"
        className={`select-none pointer-events-none transition-all duration-700 ${
          dissolving ? 'filter-none opacity-100' : 'filter blur-[10px] opacity-50'
        }`}
        style={dissolving ? undefined : { maxHeight: '100vh', overflow: 'hidden' }}
      >
        {children}
      </div>

      {!dissolving && <AuthGateOverlay />}
    </div>
  );
}

function AuthGateOverlay() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login(email.trim(), password);
      else await register(email.trim(), password, name.trim());
    } catch (err) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-testid="auth-gate-overlay"
      className="absolute inset-0 z-40 flex items-start sm:items-center justify-center px-4 sm:px-6 py-12 sm:py-16 tts-gate-fade-in"
      style={{
        background: 'radial-gradient(120% 80% at 50% 0%, rgba(212,168,67,0.10) 0%, rgba(9,9,15,0.65) 35%, rgba(9,9,15,0.92) 100%)',
        backdropFilter: 'blur(18px) saturate(140%)',
        WebkitBackdropFilter: 'blur(18px) saturate(140%)',
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden tts-gate-pop"
        style={{
          background: 'linear-gradient(180deg, rgba(20,20,32,0.86), rgba(13,13,26,0.82))',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 40px 120px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,67,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Header */}
        <div className="px-7 sm:px-8 pt-8 pb-6 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="mx-auto w-12 h-12 rounded-2xl inline-flex items-center justify-center"
            style={{ background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.35)' }}>
            <Lock size={18} className="text-gold" />
          </div>
          <div className="mt-4 eyebrow">Members Only</div>
          <h2 className="mt-2 font-display text-2xl sm:text-[28px] font-bold tracking-tight text-chrome leading-tight">
            {mode === 'login' ? 'Welcome back.' : 'Create your account.'}
          </h2>
          <p className="mt-2 text-sm text-chrome-mid leading-relaxed">
            {mode === 'login'
              ? 'Sign in to unlock the full Tailored Tech experience.'
              : 'Sign up to explore our catalog, projects, and intake studio.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="px-7 sm:px-8 pt-6 pb-6 space-y-3">
          {mode === 'register' && (
            <Field icon={User} placeholder="Your name" type="text" value={name}
              onChange={(e) => setName(e.target.value)} autoComplete="name" required testid="auth-name" />
          )}
          <Field icon={Mail} placeholder="you@company.com" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} autoComplete="email" required testid="auth-email" />
          <Field icon={KeyRound} placeholder={mode === 'login' ? 'Password' : 'Password (min 8 chars)'}
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={mode === 'register' ? 8 : 1} required testid="auth-password" />

          {error && (
            <div data-testid="auth-error" className="rounded-lg p-2.5 text-[12px] leading-relaxed"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            data-testid="auth-submit"
            className="group relative w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[52px] rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-70"
            style={{ background: 'var(--gold-bright)', color: '#09090f' }}
          >
            {busy ? (
              <><Loader2 size={16} className="animate-spin" /> Working…</>
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <div className="pt-1 text-center text-[12px] text-chrome-mid">
            {mode === 'login' ? (
              <>New here?{' '}
                <button type="button" onClick={() => { setMode('register'); setError(''); }}
                  data-testid="auth-toggle-register" className="text-gold hover:underline font-medium">
                  Create an account
                </button>
              </>
            ) : (
              <>Already a member?{' '}
                <button type="button" onClick={() => { setMode('login'); setError(''); }}
                  data-testid="auth-toggle-login" className="text-gold hover:underline font-medium">
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>

        {/* Footer / quiet brag */}
        <div className="px-7 sm:px-8 pb-7">
          <div className="flex items-start gap-2 rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Sparkles size={14} className="text-gold shrink-0 mt-0.5" />
            <div className="text-[11px] text-chrome-mid leading-relaxed">
              Members unlock the full service catalog, project case studies, the Terra Farming dashboard, and our AI Readiness diagnostic.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, testid, ...inputProps }) {
  return (
    <label className="relative block">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-chrome-mid pointer-events-none">
        <Icon size={15} />
      </span>
      <input
        data-testid={testid}
        {...inputProps}
        className="w-full pl-10 pr-3 py-3 min-h-[48px] rounded-xl text-[14px] text-chrome placeholder:text-chrome-mid focus:outline-none focus:ring-2 focus:ring-[var(--gold-bright)] transition-all"
        style={{
          background: 'rgba(9,9,15,0.55)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      />
    </label>
  );
}

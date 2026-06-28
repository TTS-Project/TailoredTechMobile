import React, { useEffect, useRef, useState } from 'react';
import { LogOut, User2, ChevronDown, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function UserMenu({ variant = 'desktop' }) {
  const { user, logout, deleteAccount } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const ref = useRef(null);
  const suffix = variant === 'mobile' ? '-mobile' : '-desktop';

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;
  const initial = (user.name || user.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        data-testid={`user-menu-trigger${suffix}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full p-1 pr-2 transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}
      >
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-8 h-8 rounded-full font-display font-bold text-[13px]"
          style={{ background: 'var(--gold-bright)', color: '#09090f' }}
        >
          {initial}
        </span>
        <ChevronDown size={12} className={`text-chrome-mid transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          data-testid={`user-menu-panel${suffix}`}
          className="absolute right-0 top-full mt-2 min-w-[240px] rounded-xl py-1.5 z-50 tts-modal-pop"
          style={{
            background: 'rgba(13,13,26,0.96)',
            border: '1px solid var(--border-subtle)',
            backdropFilter: 'blur(18px)',
            boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
          }}
        >
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="text-[10px] font-mono uppercase tracking-widest text-gold-dim">Signed in as</div>
            <div className="mt-1 text-sm text-chrome font-medium truncate">{user.name || user.email}</div>
            <div className="text-[11px] text-chrome-mid truncate">{user.email}</div>
          </div>
          <div className="py-1.5">
            <MenuItem icon={User2} label="My account" disabled />
            <MenuItem
              icon={LogOut}
              label="Sign out"
              testid={`user-menu-signout${suffix}`}
              onClick={async () => { setOpen(false); await logout(); }}
            />
            <MenuItem
              icon={Trash2}
              label="Delete account"
              testid={`user-menu-delete${suffix}`}
              danger
              onClick={() => { setConfirmingDelete(true); setDeleteError(''); }}
            />
          </div>
        </div>
      )}

      {confirmingDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" data-testid="delete-account-modal">
          <div className="absolute inset-0" style={{ background: 'rgba(9,9,15,0.78)', backdropFilter: 'blur(8px)' }}
            onClick={() => !deleting && setConfirmingDelete(false)} />
          <div className="relative w-full max-w-md rounded-2xl p-6 tts-modal-pop"
            style={{
              background: 'linear-gradient(180deg, rgba(20,20,32,0.92), rgba(13,13,26,0.88))',
              border: '1px solid rgba(239,68,68,0.45)',
              boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)',
            }}>
            <div className="w-11 h-11 rounded-xl inline-flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.45)' }}>
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-chrome">Delete your account?</h2>
            <p className="mt-2 text-sm text-chrome-mid leading-relaxed">
              This permanently removes your account, sign-in credentials, and personal data within 30 days.
              Order records may be retained anonymously for 7 years to satisfy US tax law. <strong className="text-chrome">This cannot be undone.</strong>
            </p>
            {deleteError && (
              <div className="mt-4 rounded-lg p-2.5 text-[12px]" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5' }}>{deleteError}</div>
            )}
            <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <button type="button" disabled={deleting}
                onClick={() => setConfirmingDelete(false)}
                data-testid="delete-account-cancel"
                className="flex-1 inline-flex items-center justify-center px-4 py-3 min-h-[48px] rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: 'var(--chrome)' }}>
                Cancel
              </button>
              <button type="button" disabled={deleting}
                data-testid="delete-account-confirm"
                onClick={async () => {
                  setDeleting(true);
                  setDeleteError('');
                  try {
                    await deleteAccount();
                    setConfirmingDelete(false);
                    setOpen(false);
                  } catch (err) {
                    setDeleteError(err?.message || 'Could not delete account.');
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-70"
                style={{ background: '#dc2626', color: '#fff' }}>
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, testid, disabled, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      disabled={disabled}
      role="menuitem"
      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-chrome-mid ${
        danger
          ? 'text-red-400 hover:text-red-300 hover:bg-red-500/[0.08]'
          : 'text-chrome-mid hover:text-gold hover:bg-[var(--gold-glow)]'
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { LogOut, User2, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
        data-testid="user-menu-trigger"
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
          data-testid="user-menu-panel"
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
              testid="user-menu-signout"
              onClick={async () => { setOpen(false); await logout(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, testid, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      disabled={disabled}
      role="menuitem"
      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-chrome-mid hover:text-gold hover:bg-[var(--gold-glow)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-chrome-mid"
    >
      <Icon size={14} /> {label}
    </button>
  );
}

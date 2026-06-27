import React, { useEffect, useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#projects', label: 'Products' },
  { href: '#terra', label: 'Terra' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

function scrollToId(id) {
  const el = document.querySelector(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', id);
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = LINKS.map((l) => l.href);
    const targets = ids
      .map((id) => document.querySelector(id))
      .filter(Boolean);
    if (targets.length === 0) return;
    const NAV_H = 68;
    const compute = () => {
      const line = NAV_H + 1;
      let current = null;
      for (const el of targets) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) { current = el; break; }
      }
      if (!current) {
        let bestTop = -Infinity;
        for (const el of targets) {
          const top = el.getBoundingClientRect().top;
          if (top <= line && top > bestTop) { bestTop = top; current = el; }
        }
      }
      setActive(current ? `#${current.id}` : '');
    };
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; compute(); });
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const onLinkClick = useCallback((e, href) => {
    e.preventDefault();
    if (open) setOpen(false);
    setTimeout(() => scrollToId(href), open ? 280 : 0);
  }, [open]);

  const linkBase = 'text-[13px] font-medium tracking-wide transition-colors relative';
  const linkInactive = 'text-chrome-mid hover:text-chrome';
  const linkActive = 'text-gold';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        open ? 'bg-[#09090f] border-b border-subtle' :
        scrolled ? 'bg-[rgba(13,13,26,0.85)] backdrop-blur-xl border-b border-subtle' : 'bg-transparent'
      }`}
      style={{ borderBottomWidth: (open || scrolled) ? '1px' : 0, borderBottomStyle: 'solid' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-[68px] flex items-center justify-between">
        <a href="#top" onClick={(e) => onLinkClick(e, '#top')} className="shrink-0">
          <Logo />
        </a>
        <nav className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => {
            const isActive = active === l.href;
            return (
              <a key={l.label} href={l.href} onClick={(e) => onLinkClick(e, l.href)}
                className={`${linkBase} ${isActive ? linkActive : linkInactive}`}>
                {l.label}
                {isActive && <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full" style={{background:'var(--gold-bright)'}} />}
              </a>
            );
          })}
        </nav>
        <a href="#contact" onClick={(e) => onLinkClick(e, '#contact')}
          className="hidden md:inline-flex items-center px-5 py-2 rounded-lg border border-gold-dim text-gold text-[13px] font-semibold tracking-wide hover:bg-[var(--gold-glow)] hover:border-gold transition-all"
          style={{borderWidth:'1px', borderStyle:'solid'}}>
          Get Started
        </a>
        <button onClick={() => setOpen((v) => !v)} className="md:hidden text-chrome p-2 -mr-2" aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className={`md:hidden fixed inset-0 top-[68px] bg-[#09090f] transition-opacity duration-300 z-50 overflow-y-auto ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <nav className="flex flex-col px-8 pt-10 gap-2">
          {LINKS.map((l, i) => (
            <a key={l.label} href={l.href} onClick={(e) => onLinkClick(e, l.href)}
              style={{ transitionDelay: `${open ? i * 60 : 0}ms` }}
              className={`font-display text-3xl font-bold tracking-tight py-3 border-b border-subtle transition-all ${
                open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
              } ${active === l.href ? 'text-gold' : 'text-chrome'}`}>
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={(e) => onLinkClick(e, '#contact')}
            className="mt-8 inline-flex items-center justify-center px-6 py-4 rounded-lg font-bold"
            style={{background:'var(--gold-bright)', color:'#09090f'}}>
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}

import React, { useEffect, useState, useCallback } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

// Top-level links. "Projects" contains a submenu with Terra.
const LINKS = [
  { href: '#services', label: 'Services' },
  {
    href: '#projects',
    label: 'Projects',
    children: [
      { href: '/projects', label: 'All Projects', kind: 'route' },
      { href: '#projects', label: 'Selected Work', kind: 'anchor' },
      { href: '#terra',    label: 'Terra Farming', kind: 'anchor' },
    ],
  },
  { href: '#about',    label: 'About' },
  { href: '#contact',  label: 'Contact' },
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
  const [mobileSub, setMobileSub] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['#services', '#projects', '#terra', '#about', '#contact'];
    const targets = ids.map((id) => document.querySelector(id)).filter(Boolean);
    if (targets.length === 0) return;
    const NAV_H = 76;
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

  const onLinkClick = useCallback((e, href, kind) => {
    if (kind === 'route' || (typeof href === 'string' && href.startsWith('/') && !href.startsWith('/#'))) {
      // Route navigation handled by <Link>; just close mobile.
      if (open) setOpen(false);
      return;
    }
    e.preventDefault();
    if (open) setOpen(false);
    setTimeout(() => scrollToId(href), open ? 280 : 0);
  }, [open]);

  // Treat "#projects" or "#terra" as active state for the Projects parent
  const isProjectsActive = active === '#projects' || active === '#terra';

  const linkBase = 'text-[13px] font-medium tracking-wide transition-colors relative inline-flex items-center';
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
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 h-[76px] flex items-center justify-between">
        <a href="#top" onClick={(e) => onLinkClick(e, '#top')} className="shrink-0" aria-label="Tailored Tech Solutions — Home">
          <Logo size={48} />
        </a>

        <nav className="hidden md:flex items-center gap-8 lg:gap-9">
          {LINKS.map((l) => {
            const isActive = l.children ? isProjectsActive : active === l.href;
            if (l.children) {
              return (
                <div key={l.label} className="relative group">
                  <a href={l.href} onClick={(e) => onLinkClick(e, l.href)}
                    className={`${linkBase} gap-1 ${isActive ? linkActive : linkInactive}`}
                  >
                    {l.label}
                    <ChevronDown size={12} className="opacity-60 group-hover:rotate-180 transition-transform" />
                    {isActive && <span className="absolute -bottom-1 left-0 right-6 h-[2px] rounded-full" style={{background:'var(--gold-bright)'}} />}
                  </a>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="min-w-[200px] rounded-xl bg-[rgba(13,13,26,0.96)] backdrop-blur-xl py-2"
                      style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)', boxShadow:'0 20px 60px -20px rgba(0,0,0,0.6)'}}
                    >
                      {l.children.map((c) => (
                        c.kind === 'route' ? (
                          <Link key={c.label} to={c.href}
                            className="block px-4 py-2.5 text-[13px] font-medium text-chrome-mid hover:text-gold hover:bg-[var(--gold-glow)] transition-colors"
                          >
                            {c.label}
                          </Link>
                        ) : (
                          <a key={c.label} href={c.href}
                            onClick={(e) => onLinkClick(e, c.href, c.kind)}
                            className="block px-4 py-2.5 text-[13px] font-medium text-chrome-mid hover:text-gold hover:bg-[var(--gold-glow)] transition-colors"
                          >
                            {c.label}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <a key={l.label} href={l.href} onClick={(e) => onLinkClick(e, l.href)}
                className={`${linkBase} ${isActive ? linkActive : linkInactive}`}>
                {l.label}
                {isActive && <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full" style={{background:'var(--gold-bright)'}} />}
              </a>
            );
          })}
        </nav>

        <Link to="/intake"
          className="hidden md:inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg text-[13px] font-semibold tracking-wide transition-all active:scale-[0.98] hover:opacity-90"
          style={{background:'var(--gold-bright)', color:'#09090f'}}>
          Intake Form
        </Link>

        <button onClick={() => setOpen((v) => !v)} className="md:hidden text-chrome p-2 -mr-2 w-12 h-12 flex items-center justify-center" aria-label="Menu" aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 top-[76px] bg-[#09090f] transition-opacity duration-300 z-50 overflow-y-auto ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <nav className="flex flex-col px-7 pt-8 pb-12 gap-1">
          {LINKS.map((l, i) => {
            const isActive = l.children ? isProjectsActive : active === l.href;
            const baseCls = `font-display text-3xl font-bold tracking-tight py-4 transition-all flex items-center justify-between ${
              open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
            } ${isActive ? 'text-gold' : 'text-chrome'}`;
            if (l.children) {
              const expanded = mobileSub === l.label;
              return (
                <div key={l.label} style={{ transitionDelay: `${open ? i * 60 : 0}ms`, borderBottom: '1px solid var(--border-subtle)' }}>
                  <button onClick={() => setMobileSub(expanded ? '' : l.label)}
                    className={baseCls + ' w-full'} aria-expanded={expanded}>
                    {l.label}
                    <ChevronDown size={22} className={`opacity-60 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-72 opacity-100 pb-3' : 'max-h-0 opacity-0'}`}>
                    {l.children.map((c) => (
                      c.kind === 'route' ? (
                        <Link key={c.label} to={c.href} onClick={() => setOpen(false)}
                          className="block pl-5 py-3 text-base font-medium text-chrome-mid hover:text-gold"
                        >
                          {c.label}
                        </Link>
                      ) : (
                        <a key={c.label} href={c.href}
                          onClick={(e) => onLinkClick(e, c.href, c.kind)}
                          className="block pl-5 py-3 text-base font-medium text-chrome-mid hover:text-gold"
                        >
                          {c.label}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <a key={l.label} href={l.href} onClick={(e) => onLinkClick(e, l.href)}
                style={{ transitionDelay: `${open ? i * 60 : 0}ms`, borderBottom: '1px solid var(--border-subtle)' }}
                className={baseCls}>
                {l.label}
              </a>
            );
          })}
          <Link to="/intake" onClick={() => setOpen(false)}
            className="mt-8 inline-flex items-center justify-center px-6 py-4 min-h-[56px] rounded-xl font-bold"
            style={{background:'var(--gold-bright)', color:'#09090f'}}>
            Intake Form
          </Link>
        </nav>
      </div>
    </header>
  );
}

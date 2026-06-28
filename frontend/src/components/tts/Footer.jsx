import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, LifeBuoy } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-deep" style={{borderTop:'1px solid var(--border-subtle)'}}>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 py-14 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand block */}
        <div className="md:col-span-5">
          <Logo size={56} />
          <p className="mt-5 text-secondary-soft text-sm max-w-md leading-relaxed">Intelligence, tailored.</p>
          <p className="mt-2 text-xs font-mono text-muted-soft">Digital Cartel Global LLC</p>

          {/* Email contacts (replaces previous social icons) */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:CS@tailoredtechsolutions.org"
              className="group inline-flex items-center gap-3 rounded-xl px-4 py-3 min-h-[52px] transition-all hover:bg-[var(--gold-glow)]"
              style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)', background:'rgba(255,255,255,0.02)'}}
            >
              <span className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)', background:'var(--gold-glow)'}}>
                <Headphones size={15} className="text-gold" />
              </span>
              <span className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dim leading-tight">Customer Service</span>
                <span className="text-[13px] font-mono text-chrome group-hover:text-gold mt-0.5 break-all">CS@tailoredtechsolutions.org</span>
              </span>
            </a>
            <a
              href="mailto:support@tailoredtechsolutions.org"
              className="group inline-flex items-center gap-3 rounded-xl px-4 py-3 min-h-[52px] transition-all hover:bg-[var(--gold-glow)]"
              style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)', background:'rgba(255,255,255,0.02)'}}
            >
              <span className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)', background:'var(--gold-glow)'}}>
                <LifeBuoy size={15} className="text-gold" />
              </span>
              <span className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dim leading-tight">Support</span>
                <span className="text-[13px] font-mono text-chrome group-hover:text-gold mt-0.5 break-all">support@tailoredtechsolutions.org</span>
              </span>
            </a>
          </div>
        </div>

        {/* Company column (Frameworks & Careers removed; Terra Farming -> terrafarming.io) */}
        <div className="md:col-span-2 md:col-start-7">
          <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-4">Company</div>
          <ul className="space-y-3 text-sm">
            <li><a href="/#about"   className="text-chrome-mid hover:text-gold transition-colors">About</a></li>
            <li>
              <a href="https://terrafarming.io" target="_blank" rel="noopener noreferrer"
                className="text-chrome-mid hover:text-gold transition-colors inline-flex items-center gap-1.5">
                Terra Farming
                <span aria-hidden="true" className="text-[10px] opacity-60">↗</span>
              </a>
            </li>
            <li><a href="/#contact" className="text-chrome-mid hover:text-gold transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Legal column */}
        <div className="md:col-span-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-4">Legal</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/privacy" data-testid="footer-link-privacy" className="text-chrome-mid hover:text-gold transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms"   data-testid="footer-link-terms"   className="text-chrome-mid hover:text-gold transition-colors">Terms of Service</Link></li>
            <li><Link to="/support" data-testid="footer-link-support" className="text-chrome-mid hover:text-gold transition-colors">Help & Support</Link></li>
          </ul>
        </div>

        {/* Contact column */}
        <div className="md:col-span-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-4">Contact</div>
          <ul className="space-y-3 text-sm">
            <li><a href="mailto:gwaltney@tailoredtechsolutions.org" className="text-chrome-mid hover:text-gold transition-colors break-all">gwaltney@tailoredtechsolutions.org</a></li>
            <li><a href="tel:+19406015260" className="text-chrome-mid hover:text-gold transition-colors">(940) 601-5260</a></li>
            <li className="text-chrome-mid">Nipomo, CA 93444</li>
          </ul>
        </div>
      </div>

      <div style={{borderTop:'1px solid var(--border-subtle)'}}>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 py-6 grid md:grid-cols-3 gap-3 text-xs">
          <div className="text-chrome-mid">© 2025 Digital Cartel Global LLC. All rights reserved.</div>
          <div className="md:text-center font-display font-bold text-gold">Tailored Tech Solutions</div>
          <div className="md:text-right font-mono text-chrome-mid">Built with intent.</div>
        </div>
      </div>
    </footer>
  );
}

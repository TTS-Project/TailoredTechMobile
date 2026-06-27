import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import { Logo } from './Logo';

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-4">{title}</div>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i}><a href="#" className="text-chrome-mid hover:text-gold transition-colors">{i}</a></li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-deep" style={{borderTop:'1px solid var(--border-subtle)'}}>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 py-14 sm:py-16 grid md:grid-cols-4 gap-10">
        <div>
          <Logo size={44} />
          <p className="mt-5 text-secondary-soft text-sm max-w-xs">Intelligence, tailored.</p>
          <p className="mt-2 text-xs font-mono text-muted-soft">Digital Cartel Global LLC</p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-md flex items-center justify-center text-chrome-mid hover:text-gold transition-colors" style={{border:'1px solid var(--border-subtle)'}}>
              <Github size={16} />
            </a>
            <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-md flex items-center justify-center text-chrome-mid hover:text-gold transition-colors" style={{border:'1px solid var(--border-subtle)'}}>
              <Linkedin size={16} />
            </a>
          </div>
        </div>
        <FooterCol title="Services" items={['AI Integration','Mobile Development','Web Platforms','Embedded Systems','UI/UX Engineering','Consulting']} />
        <FooterCol title="Company" items={['About','Terra Farming','Frameworks','Careers','Contact']} />
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-4">Contact</div>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:gwaltney@tailoredtechsolutions.org" className="text-chrome-mid hover:text-gold">gwaltney@tailoredtechsolutions.org</a></li>
            <li className="text-chrome-mid">(940) 601-5260</li>
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

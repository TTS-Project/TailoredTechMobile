import React from 'react';

/**
 * Animated brand logo:
 *  - Uses the real Tailored Tech circuit-suit mark as the badge
 *  - Pulsing aura glow (shade in/out) extending beyond the badge
 *  - Sparks pulsing at corners (inside the badge frame)
 *  - Wordmark: "Tailored" white · "Tech" gold · "Solutions" white
 */
export function Logo({ size = 48, showWordmark = true }) {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Outer wrapper hosts the aura (no clipping) */}
      <div className="relative shrink-0 tts-logo-badge" style={{ width: size, height: size }} aria-hidden="true">
        {/* Pulsing aura glow — sits behind, can extend outside */}
        <span className="tts-logo-aura" />
        {/* Inner crop frame holds the real brand image and sparks */}
        <div className="relative w-full h-full overflow-hidden rounded-xl">
          <img
            src="/logos/tts-brand.jpeg"
            alt="Tailored Tech Solutions logo"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 18%', transform: 'scale(2.05)', transformOrigin: '50% 30%' }}
          />
          {/* Soft inner highlight + frame */}
          <span className="absolute inset-0 rounded-xl pointer-events-none" style={{
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 0 1px rgba(212,168,67,0.32)',
          }} />
          {/* Sparks (clipped to badge) */}
          <span className="tts-spark" style={{ top: '8%',  left: '8%' }} />
          <span className="tts-spark" style={{ top: '8%',  right: '8%',  animationDelay: '0.7s' }} />
          <span className="tts-spark" style={{ bottom: '8%', left: '12%', animationDelay: '1.4s' }} />
          <span className="tts-spark" style={{ bottom: '8%', right: '8%', animationDelay: '2.1s' }} />
        </div>
      </div>

      {showWordmark && (
        <span className="font-display tracking-tight leading-none flex items-baseline gap-[0.18em]" style={{ fontSize: 'clamp(15px, 1.7vw, 19px)' }}>
          <span style={{ color: 'var(--chrome-light)', fontWeight: 800 }}>Tailored</span>
          <span className="tts-logo-tech" style={{ color: 'var(--gold-bright)', fontWeight: 800 }}>Tech</span>
          <span style={{ color: 'var(--chrome-light)', fontWeight: 800 }}>Solutions</span>
        </span>
      )}
    </div>
  );
}

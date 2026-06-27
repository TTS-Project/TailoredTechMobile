import React from 'react';

/**
 * Animated brand logo:
 *  - Real Tailored Tech circuit-suit shield (background removed -> PNG)
 *  - Pulsing aura glow (cyan / violet / red) that shades in & out
 *  - Sparks twinkling around the mark
 *  - Wordmark: "Tailored" white · "Tech" red · "Solutions" white
 */
export function Logo({ size = 52, showWordmark = true, fontSize }) {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Outer wrapper hosts the aura — no clipping */}
      <div className="relative shrink-0 tts-logo-badge" style={{ width: size, height: size }} aria-hidden="true">
        {/* Pulsing aura behind the mark */}
        <span className="tts-logo-aura" />
        {/* The actual brand mark — already transparent PNG */}
        <img
          src="/logos/tts-shield.png"
          alt="Tailored Tech Solutions logo"
          className="relative w-full h-full object-contain tts-logo-img"
          draggable={false}
        />
        {/* Sparks (positioned around the badge) */}
        <span className="tts-spark" style={{ top: '4%',  left: '4%' }} />
        <span className="tts-spark" style={{ top: '4%',  right: '4%',  animationDelay: '0.7s' }} />
        <span className="tts-spark" style={{ bottom: '4%', left: '8%',  animationDelay: '1.4s' }} />
        <span className="tts-spark" style={{ bottom: '4%', right: '4%', animationDelay: '2.1s' }} />
      </div>

      {showWordmark && (
        <span
          className="font-display tracking-tight leading-none flex items-baseline gap-[0.18em]"
          style={{ fontSize: fontSize || 'clamp(15px, 1.7vw, 19px)' }}
        >
          <span style={{ color: 'var(--chrome-light)', fontWeight: 800 }}>Tailored</span>
          <span className="tts-logo-tech" style={{ color: 'var(--gold-bright)', fontWeight: 800 }}>Tech</span>
          <span style={{ color: 'var(--chrome-light)', fontWeight: 800 }}>Solutions</span>
        </span>
      )}
    </div>
  );
}

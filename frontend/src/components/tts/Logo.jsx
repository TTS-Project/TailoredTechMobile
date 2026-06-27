import React from 'react';

/**
 * Animated logo:
 *  - circuit-board badge with electrons traversing traces
 *  - sparks pulsing at corners
 *  - shade-in/out glow on the badge
 *  - wordmark: "Tailored" white · "Tech" gold · "Solutions" white
 */
export function Logo({ size = 48, showWordmark = true }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className="relative shrink-0 rounded-xl overflow-hidden tts-logo-badge"
        style={{
          width: size,
          height: size,
          background: 'radial-gradient(circle at 35% 30%, #1a1230 0%, #0a0815 70%)',
          border: '1px solid rgba(212,168,67,0.55)',
        }}
        aria-hidden="true"
      >
        {/* circuit svg */}
        <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="ttsTraceGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d4a843" />
              <stop offset="100%" stopColor="#8855ff" />
            </linearGradient>
          </defs>
          {/* outer board frame */}
          <rect x="6" y="6" width="52" height="52" rx="8" fill="none" stroke="rgba(212,168,67,0.30)" strokeWidth="0.6" />
          {/* horizontal & vertical traces */}
          <path d="M6 22 H22 V14 H42 V22 H58" fill="none" stroke="url(#ttsTraceGrad)" strokeWidth="0.9" />
          <path d="M6 42 H18 V52 H46 V42 H58" fill="none" stroke="url(#ttsTraceGrad)" strokeWidth="0.9" />
          <path d="M22 22 V42" fill="none" stroke="url(#ttsTraceGrad)" strokeWidth="0.9" />
          <path d="M42 22 V42" fill="none" stroke="url(#ttsTraceGrad)" strokeWidth="0.9" />
          <path d="M32 14 V52" fill="none" stroke="url(#ttsTraceGrad)" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.55" />
          {/* solder nodes */}
          {[[22,22],[42,22],[22,42],[42,42],[32,32]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="1.6" fill="#d4a843" />
          ))}
          {/* corner pads */}
          {[[10,10],[54,10],[10,54],[54,54]].map(([x,y],i)=>(
            <rect key={i} x={x-2} y={y-2} width="4" height="4" rx="0.8" fill="rgba(212,168,67,0.55)" />
          ))}
          {/* electrons flowing along traces */}
          <circle r="1.4" fill="#fff7d6" className="tts-electron-1">
            <animateMotion dur="2.4s" repeatCount="indefinite" path="M6 22 H22 V14 H42 V22 H58" />
          </circle>
          <circle r="1.4" fill="#fff7d6" className="tts-electron-2">
            <animateMotion dur="3.2s" repeatCount="indefinite" path="M58 42 H46 V52 H18 V42 H6" />
          </circle>
          <circle r="1.2" fill="#d4a843" className="tts-electron-3">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M22 22 V42" />
          </circle>
          <circle r="1.2" fill="#d4a843" className="tts-electron-4">
            <animateMotion dur="3.4s" repeatCount="indefinite" path="M42 42 V22" />
          </circle>
        </svg>
        {/* sparks */}
        <span className="tts-spark" style={{ top: '8%', left: '8%' }} />
        <span className="tts-spark" style={{ top: '8%', right: '8%', animationDelay: '0.7s' }} />
        <span className="tts-spark" style={{ bottom: '8%', left: '12%', animationDelay: '1.4s' }} />
        <span className="tts-spark" style={{ bottom: '8%', right: '8%', animationDelay: '2.1s' }} />
        {/* shade glow overlay */}
        <span className="tts-logo-glow" />
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

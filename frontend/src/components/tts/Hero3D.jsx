import React from 'react';

export function Hero3D() {
  return (
    <div className="relative aspect-square w-full max-w-[560px] mx-auto select-none">
      <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.28), transparent 65%)', filter: 'blur(40px)' }} />
      <div className="absolute inset-6 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(136,85,255,0.18), transparent 70%)', filter: 'blur(40px)' }} />

      {/* Outer wireframe ring */}
      <svg className="absolute inset-0 orb-ring-1" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(212,168,67,0.35)" strokeWidth="0.5" strokeDasharray="4 8" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(212,168,67,0.2)" strokeWidth="0.4" />
        <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="rgba(212,168,67,0.25)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="30" ry="90" fill="none" stroke="rgba(212,168,67,0.25)" strokeWidth="0.5" />
      </svg>
      <svg className="absolute inset-0 orb-ring-2" viewBox="0 0 200 200">
        <ellipse cx="100" cy="100" rx="75" ry="75" fill="none" stroke="rgba(136,85,255,0.25)" strokeWidth="0.4" strokeDasharray="2 6" />
        <ellipse cx="100" cy="100" rx="75" ry="22" fill="none" stroke="rgba(136,85,255,0.3)" strokeWidth="0.5" transform="rotate(45 100 100)" />
        <ellipse cx="100" cy="100" rx="75" ry="22" fill="none" stroke="rgba(136,85,255,0.3)" strokeWidth="0.5" transform="rotate(-45 100 100)" />
      </svg>
      <svg className="absolute inset-0 orb-ring-3" viewBox="0 0 200 200">
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const r = 60 + (i % 7) * 5;
          const x = 100 + Math.cos(a) * r;
          const y = 100 + Math.sin(a) * r;
          return <circle key={i} cx={x} cy={y} r="0.6" fill="#d4a843" opacity={0.4 + ((i * 13) % 60) / 100} />;
        })}
      </svg>

      {/* Core orb */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%] h-[42%] rounded-full orb-core orb-gradient" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[32%] h-[32%] rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, rgba(255,232,168,0.9) 0%, rgba(212,168,67,0.5) 35%, rgba(13,13,26,0.7) 80%)' }} />
    </div>
  );
}

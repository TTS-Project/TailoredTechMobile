import React, { useEffect, useState } from 'react';

export function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1200, decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const animate = (t) => {
      const elapsed = t - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString('en-US');
  return <span>{prefix}{formatted}{suffix}</span>;
}

export function StatWidget({ label, value, prefix = '', suffix = '', accent = 'var(--gold-bright)', icon: Icon, sub }) {
  return (
    <div className="bg-card-soft rounded-2xl p-5 sm:p-6 gold-diffuse transition-colors"
      style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
    >
      <div className="flex items-start justify-between">
        <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-gold-dim">{label}</div>
        {Icon && (
          <span className="w-8 h-8 rounded-md flex items-center justify-center" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)', background:'rgba(212,168,67,0.06)'}}>
            <Icon size={14} style={{color: accent}} />
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl sm:text-4xl font-bold leading-none" style={{color: accent}}>
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      </div>
      {sub && <div className="mt-2 text-[11px] font-mono text-chrome-mid">{sub}</div>}
    </div>
  );
}

export function CircularProgress({ value, size = 84, stroke = 6, color = 'var(--gold-bright)', label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--border-subtle)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display font-bold text-base sm:text-lg" style={{color}}>{value}%</div>
        {label && <div className="text-[9px] font-mono text-chrome-mid uppercase tracking-widest">{label}</div>}
      </div>
    </div>
  );
}

export function BarMini({ data, color = 'var(--gold-bright)', height = 60 }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1" style={{height}}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm" style={{
          height: `${Math.max((v/max)*100, 6)}%`,
          background: v > 0 ? `linear-gradient(to top, ${color}, ${color}66)` : 'rgba(255,255,255,0.04)',
          opacity: v > 0 ? 1 : 0.45,
          minHeight: '6px',
          transition: 'height 900ms cubic-bezier(0.16,1,0.3,1)',
        }} />
      ))}
    </div>
  );
}

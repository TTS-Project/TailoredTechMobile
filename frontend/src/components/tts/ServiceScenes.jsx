import React from 'react';

const GOLD = '#d4a843';
const CHROME = '#e8e8f0';
const CYAN = '#00ffcc';

const SceneShell = ({ children, className = '' }) => (
  <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 circuit-grid opacity-30" />
    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 60%, rgba(212,168,67,0.10), transparent 60%)' }} />
    {children}
  </div>
);

export const AnalyticsScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      <g className="kpi-pop" style={{ animationDelay: '0.1s' }}>
        <rect x="20" y="20" width="80" height="32" rx="6" fill="rgba(212,168,67,0.08)" stroke={GOLD} strokeOpacity="0.4" />
        <text x="28" y="34" fill={GOLD} fontSize="8" fontFamily="monospace">REVENUE</text>
        <text x="28" y="48" fill={CHROME} fontSize="13" fontWeight="700" fontFamily="monospace">$84.2K</text>
      </g>
      <g className="kpi-pop" style={{ animationDelay: '0.3s' }}>
        <rect x="110" y="20" width="80" height="32" rx="6" fill="rgba(0,255,204,0.06)" stroke={CYAN} strokeOpacity="0.3" />
        <text x="118" y="34" fill={CYAN} fontSize="8" fontFamily="monospace">USERS</text>
        <text x="118" y="48" fill={CHROME} fontSize="13" fontWeight="700" fontFamily="monospace">12,408</text>
      </g>
      <g className="kpi-pop" style={{ animationDelay: '0.5s' }}>
        <rect x="200" y="20" width="100" height="32" rx="6" fill="rgba(212,168,67,0.08)" stroke={GOLD} strokeOpacity="0.4" />
        <text x="208" y="34" fill={GOLD} fontSize="8" fontFamily="monospace">CONVERSION</text>
        <text x="208" y="48" fill={CHROME} fontSize="13" fontWeight="700" fontFamily="monospace">+18.6%</text>
      </g>
      {[40,72,55,90,65,82,70].map((h,i)=>(
        <rect key={i} className="bar-rise" style={{animationDelay:`${0.4+i*0.08}s`}} x={28+i*38} y={170-h} width="22" height={h} rx="3" fill="url(#barGrad)" />
      ))}
      <line className="scan-bar" x1="20" y1="70" x2="300" y2="70" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.6" />
      <defs>
        <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.9" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  </SceneShell>
);

export const CyberScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      <circle className="pulse-ring" cx="160" cy="100" r="40" fill="none" stroke={GOLD} strokeWidth="1" />
      <circle className="pulse-ring" cx="160" cy="100" r="40" fill="none" stroke={GOLD} strokeWidth="1" style={{animationDelay:'1s'}} />
      <g transform="translate(160 100)">
        <path d="M 0 -28 L 22 -14 L 22 14 L 0 28 L -22 14 L -22 -14 Z" fill="rgba(212,168,67,0.12)" stroke={GOLD} strokeWidth="1.5" />
        <path d="M -8 0 L -2 6 L 10 -8" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      </g>
      {[0,1,2,3].map(i => (
        <circle key={i} cx={20+i*15} cy={50+i*8} r="3" fill={GOLD} opacity="0.7">
          <animate attributeName="cx" from={20+i*15} to="140" dur="3s" begin={`${i*0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="3s" begin={`${i*0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="160" y="170" textAnchor="middle" fill={GOLD} fontSize="8" fontFamily="monospace" letterSpacing="2">ZERO-TRUST</text>
    </svg>
  </SceneShell>
);

export const SalesAgentScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      <circle cx="60" cy="100" r="28" fill="rgba(212,168,67,0.12)" stroke={GOLD} strokeWidth="1" />
      <text x="60" y="105" textAnchor="middle" fill={GOLD} fontSize="18" fontFamily="monospace">AI</text>
      {[0,1,2].map(i => (
        <path key={i} d={`M 90 ${94+i*4} Q ${110+i*10} ${100} ${130+i*20} ${94+i*4}`} fill="none" stroke={GOLD} strokeWidth="1.5" strokeOpacity={0.7-i*0.2}>
          <animate attributeName="opacity" values="0;1;0" dur="2s" begin={`${i*0.4}s`} repeatCount="indefinite" />
        </path>
      ))}
      <g>
        <rect x="180" y="50" width="110" height="30" rx="6" fill="rgba(255,255,255,0.04)" stroke={CHROME} strokeOpacity="0.2" />
        <text x="190" y="68" fill={CHROME} fontSize="9" fontFamily="monospace">"Hello, may I help?"</text>
      </g>
      <g>
        <rect x="180" y="90" width="110" height="30" rx="6" fill="rgba(212,168,67,0.08)" stroke={GOLD} strokeOpacity="0.3" />
        <text x="190" y="108" fill={GOLD} fontSize="9" fontFamily="monospace">Booking confirmed</text>
      </g>
      <g>
        <rect x="180" y="130" width="110" height="30" rx="6" fill="rgba(0,255,204,0.06)" stroke={CYAN} strokeOpacity="0.3" />
        <text x="190" y="148" fill={CYAN} fontSize="9" fontFamily="monospace">Lead qualified ✓</text>
      </g>
    </svg>
  </SceneShell>
);

export const AutomationScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      {[[40,60],[40,100],[40,140],[140,60],[140,100],[140,140],[240,80],[240,120]].map(([x,y],i)=>(
        <circle key={i} className="nn-node" cx={x} cy={y} r="6" fill={i%3===0?GOLD:'rgba(212,168,67,0.5)'} stroke={GOLD} strokeWidth="0.5" />
      ))}
      {[[40,60,140,60],[40,60,140,100],[40,100,140,60],[40,100,140,100],[40,100,140,140],[40,140,140,100],[40,140,140,140],[140,60,240,80],[140,100,240,80],[140,100,240,120],[140,140,240,120]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth="0.4" strokeOpacity="0.4" />
      ))}
      <text x="160" y="185" textAnchor="middle" fill={GOLD} fontSize="8" fontFamily="monospace" letterSpacing="2">NEURAL PIPELINE</text>
    </svg>
  </SceneShell>
);

export const MobileScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      <g transform="translate(110 25)">
        <rect x="0" y="0" width="100" height="160" rx="14" fill="#0d0d1a" stroke={GOLD} strokeWidth="1.2" />
        <rect x="38" y="6" width="24" height="3" rx="1.5" fill="#1a1a2a" />
        <rect x="10" y="20" width="80" height="30" rx="4" fill="rgba(212,168,67,0.10)" stroke={GOLD} strokeOpacity="0.3" />
        <rect x="10" y="58" width="80" height="20" rx="4" fill="rgba(255,255,255,0.04)" />
        <rect x="10" y="86" width="80" height="20" rx="4" fill="rgba(255,255,255,0.04)" />
        <rect x="10" y="114" width="50" height="20" rx="4" fill="rgba(0,255,204,0.06)" stroke={CYAN} strokeOpacity="0.3" />
      </g>
    </svg>
  </SceneShell>
);

export const WebScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      <g transform="translate(40 30)">
        <rect x="0" y="0" width="240" height="140" rx="6" fill="#0d0d1a" stroke={GOLD} strokeWidth="1" />
        <rect x="0" y="0" width="240" height="16" rx="6" fill="#111126" />
        <circle cx="8" cy="8" r="2" fill="#ef4444" />
        <circle cx="16" cy="8" r="2" fill="#facc15" />
        <circle cx="24" cy="8" r="2" fill="#22c55e" />
        <rect x="10" y="24" width="100" height="60" rx="4" fill="rgba(212,168,67,0.1)" />
        <rect x="120" y="24" width="110" height="28" rx="4" fill="rgba(255,255,255,0.04)" />
        <rect x="120" y="58" width="110" height="26" rx="4" fill="rgba(255,255,255,0.04)" />
        <rect x="10" y="90" width="220" height="40" rx="4" fill="rgba(0,255,204,0.04)" stroke={CYAN} strokeOpacity="0.2" />
      </g>
    </svg>
  </SceneShell>
);

export const SocialScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      {[0,1,2,3,4].map(i => (
        <g key={i} transform={`translate(${40+i*52} ${60+(i%2)*40})`}>
          <rect width="42" height="42" rx="6" fill="rgba(212,168,67,0.12)" stroke={GOLD} strokeOpacity="0.4" />
          <text x="21" y="26" textAnchor="middle" fill={GOLD} fontSize="14" fontFamily="monospace">{['IG','TW','FB','TT','LI'][i]}</text>
        </g>
      ))}
      <text x="160" y="175" textAnchor="middle" fill={GOLD} fontSize="8" fontFamily="monospace" letterSpacing="2">ALL CHANNELS</text>
    </svg>
  </SceneShell>
);

export const ContentScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      <rect x="40" y="40" width="100" height="60" rx="6" fill="rgba(212,168,67,0.12)" stroke={GOLD} strokeOpacity="0.4" />
      <polygon points="80,60 80,80 100,70" fill={GOLD} />
      <rect x="160" y="40" width="120" height="24" rx="4" fill="rgba(255,255,255,0.05)" />
      <rect x="160" y="70" width="90" height="24" rx="4" fill="rgba(255,255,255,0.05)" />
      <rect x="40" y="120" width="240" height="40" rx="6" fill="rgba(0,255,204,0.05)" stroke={CYAN} strokeOpacity="0.2" />
    </svg>
  </SceneShell>
);

export const ChatBotScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      <rect x="30" y="40" width="100" height="28" rx="14" fill="rgba(255,255,255,0.04)" />
      <text x="42" y="58" fill={CHROME} fontSize="9" fontFamily="monospace">Hi, I need help</text>
      <rect x="190" y="80" width="100" height="28" rx="14" fill="rgba(212,168,67,0.12)" stroke={GOLD} strokeOpacity="0.4" />
      <text x="202" y="98" fill={GOLD} fontSize="9" fontFamily="monospace">Sure! Tell me more</text>
      <rect x="30" y="120" width="120" height="28" rx="14" fill="rgba(255,255,255,0.04)" />
      <text x="42" y="138" fill={CHROME} fontSize="9" fontFamily="monospace">My order is late</text>
    </svg>
  </SceneShell>
);

export const VoiceAgentScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      <circle cx="160" cy="100" r="30" fill="rgba(212,168,67,0.12)" stroke={GOLD} strokeWidth="1.5" />
      <circle className="pulse-ring" cx="160" cy="100" r="30" fill="none" stroke={GOLD} strokeWidth="1" />
      <path d="M 150 90 L 150 110 M 160 84 L 160 116 M 170 90 L 170 110" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      {[35,55,40,70,50,60,42,68,52,38].map((h,i)=>(
        <rect key={i} x={50+i*15} y={150-h/2} width="4" height={h} rx="2" fill={GOLD} opacity="0.6">
          <animate attributeName="height" values={`${h};${h/2};${h}`} dur="1s" begin={`${i*0.1}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </svg>
  </SceneShell>
);

export const VirtualAssistantScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      {[
        ['Calendar','9:30 AM'],
        ['Email','12 new'],
        ['CRM','4 deals'],
        ['Tasks','3 due'],
      ].map(([l,v],i)=>(
        <g key={i} transform={`translate(${30+(i%2)*140} ${40+Math.floor(i/2)*60})`}>
          <rect width="130" height="44" rx="6" fill="rgba(212,168,67,0.08)" stroke={GOLD} strokeOpacity="0.3" />
          <text x="10" y="18" fill={GOLD} fontSize="9" fontFamily="monospace">{l.toUpperCase()}</text>
          <text x="10" y="34" fill={CHROME} fontSize="11" fontFamily="monospace">{v}</text>
        </g>
      ))}
    </svg>
  </SceneShell>
);

export const MarketingTeamScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      {['Strategist','Copy','Design','Analytics'].map((l,i)=>(
        <g key={l} transform={`translate(${20+i*75} 70)`}>
          <circle cx="30" cy="30" r="22" fill="rgba(212,168,67,0.10)" stroke={GOLD} strokeWidth="1" />
          <text x="30" y="34" textAnchor="middle" fill={GOLD} fontSize="8" fontFamily="monospace">{l}</text>
          {i < 3 && <line x1="52" y1="30" x2="73" y2="30" stroke={GOLD} strokeWidth="0.6" strokeDasharray="2 3" />}
        </g>
      ))}
      <text x="160" y="170" textAnchor="middle" fill={GOLD} fontSize="8" fontFamily="monospace" letterSpacing="2">END-TO-END</text>
    </svg>
  </SceneShell>
);

export const CallCenterScene = () => (
  <SceneShell>
    <svg viewBox="0 0 320 200" className="w-[85%] h-[85%]">
      {Array.from({length:24}).map((_,i)=>{
        const x = 30 + (i%8)*35;
        const y = 40 + Math.floor(i/8)*45;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="10" fill="rgba(212,168,67,0.10)" stroke={GOLD} strokeOpacity="0.5" />
            <path d={`M ${x-3} ${y-2} L ${x+3} ${y-2} L ${x+3} ${y+3} L ${x-3} ${y+3} Z`} fill="none" stroke={GOLD} strokeWidth="1" />
          </g>
        );
      })}
    </svg>
  </SceneShell>
);

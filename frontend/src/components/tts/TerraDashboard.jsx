import React, { useState } from 'react';
import {
  Building2, Tractor, ShoppingBag, Truck, BarChart3, Store, MapPin,
  TrendingUp, CloudSun, Box, CircleDollarSign, Star, CheckCircle2, Navigation,
} from 'lucide-react';

const TABS = [
  { id: 'admin',      label: 'Admin / HQ',      Icon: Building2 },
  { id: 'farmer',     label: 'Farmer',          Icon: Tractor },
  { id: 'buyer',      label: 'Buyer',           Icon: ShoppingBag },
  { id: 'driver',     label: 'Driver',          Icon: Truck },
  { id: 'business',   label: 'Business Center', Icon: BarChart3 },
  { id: 'market',     label: 'Marketplace',     Icon: Store },
  { id: 'farms',      label: 'Farms',           Icon: MapPin },
];

const GREEN = '#7ac462';
const GREEN_D = '#4a8c3a';
const PARCH = '#f4e9d2';
const COPPER = '#c9a47a';
const BORDER = 'rgba(139,90,43,0.35)';
const BG = 'rgba(139,90,43,0.10)';

// ---------- tiny building blocks (scoped to phone frame) ----------
const HeaderRow = ({ left, right, dotColor = GREEN }) => (
  <div className="flex items-center justify-between">
    <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: COPPER }}>{left}</div>
    <div className="flex items-center gap-1.5">
      {right && <span className="text-[10px] font-mono" style={{ color: COPPER }}>{right}</span>}
      <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: dotColor }} />
    </div>
  </div>
);

const Stat = ({ label, value, delta, accent = GREEN }) => (
  <div>
    <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: COPPER }}>{label}</div>
    <div className="font-display text-2xl sm:text-3xl mt-1 leading-none" style={{ color: PARCH }}>{value}</div>
    {delta && <div className="text-[10px] mt-1" style={{ color: accent }}>{delta}</div>}
  </div>
);

const Row = ({ left, right, accent = GREEN }) => (
  <div className="flex items-center justify-between rounded-md px-3 py-2"
    style={{ borderColor: BORDER, background: BG, borderWidth: 1, borderStyle: 'solid' }}>
    <span className="text-[11px] truncate pr-2" style={{ color: '#d8c9ad' }}>{left}</span>
    <span className="text-[11px] font-mono shrink-0" style={{ color: accent }}>{right}</span>
  </div>
);

const Bars = ({ values, palette = [GREEN, GREEN_D] }) => (
  <div className="grid grid-cols-7 gap-1 h-14">
    {values.map((h, i) => (
      <div key={i} className="rounded flex items-end" style={{ background: 'rgba(139,90,43,0.12)', border: '1px solid rgba(139,90,43,0.30)' }}>
        <div className="w-full rounded-b" style={{ height: `${h}%`, background: `linear-gradient(to top, ${palette[0]}, ${palette[1]})` }} />
      </div>
    ))}
  </div>
);

const ProgressLine = ({ value, color = GREEN }) => (
  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
    <div className="h-full rounded-full" style={{ width: `${value}%`, background: `linear-gradient(to right, ${color}, ${color}aa)` }} />
  </div>
);

// ---------- ROLE VIEWS ----------

function AdminView() {
  return (
    <div className="space-y-4">
      <HeaderRow left="TERRA · HQ" />
      <Stat label="Today's Yield" value="47.3 t" delta="▲ 12.4% vs last week" />
      <div className="space-y-2">
        <Row left="Farmer · Nakamura" right="12.1 t" />
        <Row left="Driver · Route 4B" right="On route" />
        <Row left="Buyer · LogiChain" right="$24.8k" />
        <Row left="HQ · Inventory" right="84% full" />
      </div>
      <Bars values={[40, 70, 55, 65, 48, 78, 60]} />
    </div>
  );
}

function FarmerView() {
  return (
    <div className="space-y-4">
      <HeaderRow left="TERRA · FARMER" right="Nakamura Farm" />
      <Stat label="Today's Harvest" value="12.1 t" delta="▲ 6.2% vs target" />
      <div className="space-y-2">
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{color:COPPER}}>Field A · Tomatoes</span>
            <span className="text-[10px] font-mono" style={{color:GREEN}}>82%</span>
          </div>
          <ProgressLine value={82} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{color:COPPER}}>Field B · Lettuce</span>
            <span className="text-[10px] font-mono" style={{color:GREEN}}>54%</span>
          </div>
          <ProgressLine value={54} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{color:COPPER}}>Field C · Strawberry</span>
            <span className="text-[10px] font-mono" style={{color:GREEN}}>91%</span>
          </div>
          <ProgressLine value={91} />
        </div>
      </div>
      <div className="rounded-md px-3 py-2 flex items-center gap-2" style={{borderColor:BORDER, background:BG, borderWidth:1, borderStyle:'solid'}}>
        <CloudSun size={14} style={{color: GREEN}} />
        <span className="text-[11px]" style={{color:'#d8c9ad'}}>Light rain · 68°F · Good harvest window</span>
      </div>
      <Row left="Pending orders" right="3 fulfill" />
    </div>
  );
}

function BuyerView() {
  return (
    <div className="space-y-4">
      <HeaderRow left="TERRA · BUYER" right="LogiChain" dotColor="#3b82f6" />
      <Stat label="Spent · This month" value="$24.8k" delta="▲ 3 active orders" accent="#3b82f6" />
      <div className="space-y-2">
        <Row left="Order #4821 · Heirloom Tomato" right="In transit" accent="#3b82f6" />
        <Row left="Order #4820 · Romaine 200 lb" right="Delivered" />
        <Row left="Order #4819 · Strawberry 80 lb" right="Processing" accent="#f59e0b" />
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest" style={{color:COPPER}}>Recommended farms</div>
      <div className="grid grid-cols-3 gap-1.5">
        {['Nakamura','Pacific Bloom','Verde Valley'].map((n, i) => (
          <div key={n} className="rounded-md p-2 text-center" style={{borderColor:BORDER, background:BG, borderWidth:1, borderStyle:'solid'}}>
            <Star size={10} className="mx-auto" style={{color:GREEN}}/>
            <div className="text-[9px] mt-1 font-mono truncate" style={{color:PARCH}}>{n}</div>
            <div className="text-[9px] font-mono" style={{color:COPPER}}>4.{9-i}★</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DriverView() {
  return (
    <div className="space-y-4">
      <HeaderRow left="TERRA · DRIVER" right="Route 4B" dotColor="#f59e0b" />
      <Stat label="Earnings · Today" value="$342" delta="▲ 7 of 9 stops complete" accent="#f59e0b" />
      <div className="rounded-md px-3 py-2.5" style={{borderColor:BORDER, background:BG, borderWidth:1, borderStyle:'solid'}}>
        <div className="flex items-center gap-2">
          <Navigation size={12} style={{color: GREEN}} />
          <span className="text-[11px] font-mono" style={{color:PARCH}}>Next pickup</span>
        </div>
        <div className="text-[12px] mt-1.5 font-medium" style={{color:'#d8c9ad'}}>Nakamura Farm · 1.2 mi · 4 min</div>
      </div>
      <div className="space-y-2">
        <Row left="08:14 · Pacific Bloom (P)" right="✓ Done" />
        <Row left="09:02 · Verde Valley (P)" right="✓ Done" />
        <Row left="10:30 · Nakamura (P)" right="ETA 4m" accent="#f59e0b" />
        <Row left="11:45 · LogiChain HQ (D)" right="Queued" accent="#9ca3af" />
      </div>
    </div>
  );
}

function BusinessView() {
  return (
    <div className="space-y-4">
      <HeaderRow left="TERRA · BUSINESS" />
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Revenue MTD" value="$184k" delta="▲ 18.6%" />
        <Stat label="Active Users" value="4.2k" delta="▲ 312" />
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest" style={{color:COPPER}}>Growth · 7d</div>
      <Bars values={[36, 52, 44, 68, 58, 74, 82]} />
      <div className="space-y-2">
        <Row left="Top farm · Nakamura" right="$32.1k" />
        <Row left="Top buyer · LogiChain" right="$24.8k" />
        <Row left="Top driver · Patel" right="38 stops" />
      </div>
    </div>
  );
}

function MarketView() {
  const items = [
    { n: 'Heirloom Tomato', p: '$3.20 / lb', trend: '▲', tcolor: GREEN },
    { n: 'Romaine Lettuce',  p: '$1.80 / lb', trend: '▼', tcolor: '#ef4444' },
    { n: 'Honey Strawberry', p: '$4.40 / lb', trend: '▲', tcolor: GREEN },
    { n: 'Sweet Corn',       p: '$0.65 / ear', trend: '▲', tcolor: GREEN },
  ];
  return (
    <div className="space-y-4">
      <HeaderRow left="TERRA · MARKETPLACE" right="Live" />
      <Stat label="Listings · Today" value="248" delta="▲ 12 new" />
      <div className="space-y-2">
        {items.map(it => (
          <div key={it.n} className="flex items-center justify-between rounded-md px-3 py-2"
            style={{borderColor:BORDER, background:BG, borderWidth:1, borderStyle:'solid'}}>
            <div className="min-w-0 pr-2">
              <div className="text-[11px] truncate" style={{color:PARCH}}>{it.n}</div>
              <div className="text-[10px] font-mono" style={{color:COPPER}}>{it.p}</div>
            </div>
            <div className="shrink-0 inline-flex items-center gap-1">
              <span className="text-[12px]" style={{color: it.tcolor}}>{it.trend}</span>
              <button className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded"
                style={{color:'#09090f', background:'#d4a843'}}>Buy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FarmsView() {
  return (
    <div className="space-y-4">
      <HeaderRow left="TERRA · FARMS" right="84 active" />
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Total Acreage" value="1,284" delta="acres under mgmt" />
        <Stat label="Certified" value="61 / 84" delta="organic · fair-trade" />
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest" style={{color:COPPER}}>Capacity by region</div>
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { r: 'NW', v: 78 }, { r: 'NE', v: 64 }, { r: 'SW', v: 92 }, { r: 'SE', v: 48 },
          { r: 'C',  v: 84 }, { r: 'N',  v: 71 }, { r: 'S',  v: 56 }, { r: 'E',  v: 88 },
        ].map(({ r, v }) => (
          <div key={r} className="rounded-md p-2 text-center" style={{borderColor:BORDER, background:BG, borderWidth:1, borderStyle:'solid'}}>
            <div className="text-[9px] font-mono" style={{color:COPPER}}>{r}</div>
            <div className="text-[12px] font-bold mt-0.5" style={{color: v >= 80 ? GREEN : v >= 60 ? '#facc15' : '#ef4444'}}>{v}%</div>
          </div>
        ))}
      </div>
      <div className="rounded-md px-3 py-2 flex items-center gap-2" style={{borderColor:BORDER, background:BG, borderWidth:1, borderStyle:'solid'}}>
        <CheckCircle2 size={14} style={{color: GREEN}} />
        <span className="text-[11px]" style={{color:'#d8c9ad'}}>All compliance audits passing</span>
      </div>
    </div>
  );
}

const VIEWS = {
  admin: AdminView, farmer: FarmerView, buyer: BuyerView,
  driver: DriverView, business: BusinessView, market: MarketView, farms: FarmsView,
};

// ---------- Main interactive component (phone + tab switcher) ----------

export function TerraDashboard() {
  const [active, setActive] = useState('admin');
  const View = VIEWS[active];

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 md:flex-row md:items-stretch md:gap-10">
      {/* Tab rail: vertical on desktop, horizontal scroll on mobile */}
      <nav
        aria-label="Terra role view"
        className="order-2 md:order-1 w-full md:w-44 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-hidden md:py-2 -mx-2 md:mx-0 px-2 md:px-0"
      >
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              aria-pressed={isActive}
              className="shrink-0 flex items-center gap-2.5 rounded-xl px-3.5 py-3 min-h-[48px] text-left transition-all active:scale-[0.98]"
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isActive ? 'var(--gold-bright)' : 'var(--border-subtle)',
                background: isActive ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)',
                color: isActive ? 'var(--gold-bright)' : 'var(--chrome-mid)',
                boxShadow: isActive ? '0 10px 24px -12px rgba(212,168,67,0.35)' : 'none',
              }}
            >
              <span className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{
                  borderWidth: '1px', borderStyle: 'solid',
                  borderColor: isActive ? 'var(--gold-bright)' : 'var(--border-subtle)',
                  background: isActive ? 'rgba(212,168,67,0.18)' : 'rgba(255,255,255,0.03)',
                }}>
                <Icon size={13} />
              </span>
              <span className="text-[12px] font-medium tracking-wide whitespace-nowrap md:whitespace-normal">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Phone mockup with switching content */}
      <div className="order-1 md:order-2 flex-1 flex justify-center md:justify-start" style={{ perspective: '1200px' }}>
        <div
          className="relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px] rounded-[40px] sm:rounded-[44px] p-3 shadow-[0_40px_80px_-20px_rgba(101,67,33,0.55)]"
          style={{ transform: 'rotateY(-10deg) rotateX(4deg)', borderWidth: '2px', borderStyle: 'solid', borderColor: '#8b5a2b' }}
        >
          <div className="absolute inset-0 rounded-[40px] sm:rounded-[44px]" style={{ background: 'linear-gradient(160deg,#3b2410 0%,#1a0f06 60%,#0a0805 100%)' }} />
          <div className="absolute left-1/2 -translate-x-1/2 top-3 w-24 h-5 rounded-full bg-black/70 z-10" />
          <div className="relative w-full h-full rounded-[30px] sm:rounded-[34px] overflow-hidden bg-gradient-to-b from-[#2a1a0c] via-[#1a1208] to-[#0a0805] p-4 sm:p-5">
            <div className="flex justify-center mb-3">
              <img src="/logos/terra-logo.png" alt="Terra Farming logo" className="h-14 sm:h-16 w-14 sm:w-16 rounded-2xl object-contain drop-shadow-[0_4px_18px_rgba(122,196,98,0.35)]" />
            </div>
            {/* Animated view container — fade between tabs */}
            <div key={active} className="terra-fade-in">
              <View />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

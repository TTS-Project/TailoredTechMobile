import React from 'react';
import { Search, Grid3x3, List, X } from 'lucide-react';
import { CATEGORIES, STATUSES } from '../../data/projects';

export function ProjectFilters({
  search, setSearch,
  category, setCategory,
  status, setStatus,
  sort, setSort,
  view, setView,
  showFavoritesOnly, setShowFavoritesOnly,
  favCount,
}) {
  return (
    <div className="sticky top-[68px] z-30 -mx-5 sm:-mx-6 md:-mx-12 px-5 sm:px-6 md:px-12 py-4 backdrop-blur-xl" style={{background:'rgba(9,9,15,0.85)', borderBottom:'1px solid var(--border-subtle)'}}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-dim pointer-events-none" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects, clients, tech…"
              className="w-full bg-card-soft rounded-xl pl-10 pr-9 py-3 min-h-[48px] text-sm text-chrome outline-none transition-colors"
              style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
              onFocus={e => e.currentTarget.style.borderColor='var(--gold-bright)'}
              onBlur={e => e.currentTarget.style.borderColor='var(--border-subtle)'}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center text-chrome-mid hover:text-gold" aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="hidden sm:flex items-center rounded-xl overflow-hidden" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}>
            <button onClick={() => setView('grid')} className="w-11 h-12 flex items-center justify-center transition-colors"
              style={{background: view === 'grid' ? 'var(--gold-glow)' : 'transparent', color: view === 'grid' ? 'var(--gold-bright)' : 'var(--chrome-mid)'}}
              aria-label="Grid view" aria-pressed={view === 'grid'}>
              <Grid3x3 size={16} />
            </button>
            <button onClick={() => setView('list')} className="w-11 h-12 flex items-center justify-center transition-colors"
              style={{background: view === 'list' ? 'var(--gold-glow)' : 'transparent', color: view === 'list' ? 'var(--gold-bright)' : 'var(--chrome-mid)'}}
              aria-label="List view" aria-pressed={view === 'list'}>
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-hidden">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className="shrink-0 px-3.5 py-2 min-h-[40px] rounded-full text-[11px] font-mono uppercase tracking-widest transition-colors"
              style={{
                background: status === s ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)',
                color: status === s ? 'var(--gold-bright)' : 'var(--chrome-mid)',
                borderWidth:'1px', borderStyle:'solid',
                borderColor: status === s ? 'var(--gold-dim)' : 'var(--border-subtle)',
              }}
            >
              {s}
            </button>
          ))}
          <span className="shrink-0 w-px h-6 bg-[var(--border-subtle)] mx-1" />
          <button onClick={() => setShowFavoritesOnly(v => !v)}
            className="shrink-0 px-3.5 py-2 min-h-[40px] rounded-full text-[11px] font-mono uppercase tracking-widest transition-colors inline-flex items-center gap-1.5"
            style={{
              background: showFavoritesOnly ? 'var(--gold-glow)' : 'rgba(255,255,255,0.02)',
              color: showFavoritesOnly ? 'var(--gold-bright)' : 'var(--chrome-mid)',
              borderWidth:'1px', borderStyle:'solid',
              borderColor: showFavoritesOnly ? 'var(--gold-dim)' : 'var(--border-subtle)',
            }}
          >
            ★ Favorites{favCount > 0 && <span className="opacity-80">({favCount})</span>}
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 scrollbar-hidden">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className="shrink-0 px-3.5 py-2 min-h-[40px] rounded-full text-[11px] font-mono uppercase tracking-widest transition-colors"
              style={{
                background: category === c ? 'rgba(212,168,67,0.12)' : 'transparent',
                color: category === c ? 'var(--gold-bright)' : 'var(--chrome-mid)',
                borderWidth:'1px', borderStyle:'solid',
                borderColor: category === c ? 'var(--gold-dim)' : 'var(--border-subtle)',
              }}
            >
              {c}
            </button>
          ))}
          <span className="shrink-0 w-px h-6 bg-[var(--border-subtle)] mx-1" />
          <div className="shrink-0 relative">
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-card-soft px-4 pr-9 py-2 min-h-[40px] rounded-full text-[11px] font-mono uppercase tracking-widest text-chrome-mid outline-none cursor-pointer"
              style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
            >
              <option value="updated">Recently Updated</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="value">Highest Value</option>
              <option value="views">Most Viewed</option>
              <option value="completion">Completion %</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-dim pointer-events-none">▾</span>
          </div>
        </div>
      </div>
    </div>
  );
}

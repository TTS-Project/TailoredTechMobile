import React from 'react';
import { Star, ArrowUpRight, Users, Activity, Calendar, Github } from 'lucide-react';
import { CircularProgress } from './StatsWidget';

const STATUS_STYLE = {
  Active: { color: '#7ac462', bg: 'rgba(122,196,98,0.10)', border: 'rgba(122,196,98,0.40)' },
  Completed: { color: '#d4a843', bg: 'rgba(212,168,67,0.10)', border: 'rgba(212,168,67,0.40)' },
  Pending: { color: '#c084fc', bg: 'rgba(192,132,252,0.10)', border: 'rgba(192,132,252,0.40)' },
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatValue(v) {
  if (v >= 1_000_000) return `$${(v/1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v/1000).toFixed(0)}k`;
  return `$${v}`;
}

export function ProjectCard({ project, view = 'grid', favorited, onToggleFavorite, onOpen }) {
  const st = STATUS_STYLE[project.status] || STATUS_STYLE.Active;
  if (view === 'list') {
    return (
      <article className="group relative bg-card-soft rounded-2xl overflow-hidden transition-all"
        style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-dim)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-44 h-32 sm:h-auto flex items-center justify-center shrink-0 overflow-hidden" style={{ background: project.splash.background }}>
            {project.cover ? (
              <img src={project.cover} alt={project.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at 50% 50%, ${project.splash.ring}, transparent 60%)` }} />
                {project.logo ? (
                  <img src={project.logo} alt={project.name} className="relative h-20 max-w-[70%] object-contain" />
                ) : (
                  <div className="relative font-display text-3xl font-bold" style={{color: project.splash.accent}}>
                    {project.name.split(' ').map(w => w[0]).join('').slice(0,2)}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex-1 p-5 sm:p-6 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest" style={{color: project.splash.accent}}>{project.industry}</div>
                <h3 className="mt-1 font-display text-xl font-bold text-chrome leading-tight">{project.name}</h3>
                <div className="text-xs text-chrome-mid mt-1">{project.client}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(project.id); }}
                className="shrink-0 w-10 h-10 rounded-md flex items-center justify-center hover:bg-[var(--gold-glow)] transition"
                aria-label="Favorite">
                <Star size={16} className={favorited ? 'text-gold fill-current' : 'text-chrome-mid'} />
              </button>
            </div>
            <p className="text-sm text-secondary-soft leading-relaxed line-clamp-2">{project.summary}</p>
            <div className="flex items-center justify-between gap-3 mt-auto pt-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded" style={{color: st.color, background: st.bg, border: `1px solid ${st.border}`}}>{project.status}</span>
              <div className="flex items-center gap-3">
                <div className="text-[11px] font-mono text-chrome-mid hidden sm:block">{formatValue(project.value)}</div>
                <CircularProgress value={project.completion} size={44} stroke={4} color={project.splash.accent} />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
  // Grid view
  return (
    <article className="group relative bg-card-soft rounded-2xl overflow-hidden transition-all flex flex-col h-full"
      style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-bright)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
    >
      <div className="relative h-44 sm:h-48 flex items-center justify-center overflow-hidden" style={{ background: project.splash.background }}>
        {project.cover ? (
          <>
            <img src={project.cover} alt={project.name} loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(9,9,15,0) 55%, rgba(9,9,15,0.45) 100%)' }} />
          </>
        ) : (
          <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at 50% 50%, ${project.splash.ring}, transparent 60%)` }} />
        )}
        {!project.cover && (
          project.logo ? (
            <img src={project.logo} alt={project.name} className="relative h-28 max-w-[70%] object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />
          ) : (
            <div className="relative font-display text-5xl font-bold transition-transform duration-500 group-hover:scale-105" style={{color: project.splash.accent, textShadow: `0 4px 18px ${project.splash.ring}`}}>
              {project.name.split(' ').map(w => w[0]).join('').slice(0,2)}
            </div>
          )
        )}
        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(project.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-md flex items-center justify-center backdrop-blur-md transition"
          style={{background:'rgba(9,9,15,0.55)', borderWidth:'1px', borderStyle:'solid', borderColor:'rgba(255,255,255,0.08)'}}
          aria-label="Favorite">
          <Star size={14} className={favorited ? 'text-gold fill-current' : 'text-chrome-mid'} />
        </button>
        <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded backdrop-blur-md" style={{color: st.color, background: 'rgba(9,9,15,0.55)', border: `1px solid ${st.border}`}}>{project.status}</span>
      </div>
      <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest" style={{color: project.splash.accent}}>{project.industry}</div>
          <h3 className="mt-1 font-display text-xl font-bold text-chrome leading-tight">{project.name}</h3>
          <div className="text-xs text-chrome-mid mt-1">{project.client}</div>
        </div>
        <p className="text-sm text-secondary-soft leading-relaxed line-clamp-2">{project.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0,4).map(t => (
            <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded text-chrome-mid" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}>{t}</span>
          ))}
          {project.tech.length > 4 && <span className="text-[10px] font-mono px-2 py-0.5 rounded text-chrome-mid">+{project.tech.length - 4}</span>}
        </div>
        <div className="mt-2">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dim">Completion</span>
            <span className="text-xs font-mono font-bold" style={{color: project.splash.accent}}>{project.completion}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
            <div className="h-full rounded-full transition-all duration-1000" style={{width: `${project.completion}%`, background: `linear-gradient(to right, ${project.splash.accent}, ${project.splash.accent}aa)`}} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-3 text-[10px] font-mono text-chrome-mid">
            <span className="inline-flex items-center gap-1"><Calendar size={10}/> {formatDate(project.completionDate)}</span>
            <span className="inline-flex items-center gap-1"><Activity size={10}/> {project.views.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button onClick={() => onOpen?.(project)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold uppercase tracking-widest transition-all active:scale-[0.98] hover:opacity-90" style={{background:'rgba(212,168,67,0.10)', color:'var(--gold-bright)', borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)'}}>
            View details <ArrowUpRight size={14} />
          </button>
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              data-testid={`project-repo-${project.id}`}
              aria-label={`View ${project.name} source code on GitHub`}
              className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl transition-all active:scale-[0.98] hover:opacity-90"
              style={{background:'rgba(255,255,255,0.04)', borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)', color:'var(--chrome)'}}>
              <Github size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

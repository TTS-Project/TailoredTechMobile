import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, CheckCircle2, Activity, DollarSign, Clock, X, ExternalLink, Calendar, Users } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import { StatWidget, CircularProgress, BarMini } from '../components/dashboard/StatsWidget';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { ProjectFilters } from '../components/dashboard/ProjectFilters';

const FAV_KEY = 'tts:favorite_projects';

// Stores ONLY a list of favourite project slug ids (e.g. ["terra-farming"]).
// This is a UI preference — no auth tokens, credentials, or PII.
function loadFavs() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn('Failed to read favourite projects from localStorage:', err);
    return [];
  }
}
function saveFavs(arr) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(arr));
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn('Failed to persist favourite projects to localStorage:', err);
  }
}

function sortProjects(projects, sort) {
  const arr = [...projects];
  switch (sort) {
    case 'newest': return arr.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    case 'oldest': return arr.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    case 'value': return arr.sort((a, b) => b.value - a.value);
    case 'views': return arr.sort((a, b) => b.views - a.views);
    case 'completion': return arr.sort((a, b) => b.completion - a.completion);
    case 'updated':
    default: return arr.sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate));
  }
}

function ProjectDetailModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-md" style={{background:'rgba(5,5,10,0.75)'}} />
      <div className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-card-soft rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)'}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-44 sm:h-56 flex items-center justify-center shrink-0" style={{ background: project.splash.background }}>
          <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at 50% 50%, ${project.splash.ring}, transparent 60%)` }} />
          {project.logo ? (
            <img src={project.logo} alt={project.name} className="relative h-28 sm:h-36 max-w-[70%] object-contain" />
          ) : (
            <div className="relative font-display text-6xl font-bold" style={{color: project.splash.accent}}>
              {project.name.split(' ').map(w => w[0]).join('').slice(0,2)}
            </div>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 w-10 h-10 rounded-md flex items-center justify-center backdrop-blur-md" style={{background:'rgba(9,9,15,0.65)', borderWidth:'1px', borderStyle:'solid', borderColor:'rgba(255,255,255,0.1)'}} aria-label="Close">
            <X size={16} className="text-chrome" />
          </button>
        </div>
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          <div className="text-[10px] font-mono uppercase tracking-widest" style={{color: project.splash.accent}}>{project.industry} · {project.category}</div>
          <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-chrome leading-tight">{project.name}</h2>
          <div className="text-sm text-chrome-mid mt-1">{project.client}</div>
          <p className="mt-5 text-secondary-soft leading-relaxed">{project.summary}</p>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl p-3 sm:p-4" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)', background:'rgba(255,255,255,0.02)'}}>
              <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-gold-dim">Uptime</div>
              <div className="mt-1 font-display text-base sm:text-lg font-bold text-chrome">{project.metrics.uptime}</div>
            </div>
            <div className="rounded-xl p-3 sm:p-4" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)', background:'rgba(255,255,255,0.02)'}}>
              <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-gold-dim">Users</div>
              <div className="mt-1 font-display text-base sm:text-lg font-bold text-chrome">{project.metrics.users}</div>
            </div>
            <div className="rounded-xl p-3 sm:p-4" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)', background:'rgba(255,255,255,0.02)'}}>
              <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-gold-dim">Value</div>
              <div className="mt-1 font-display text-base sm:text-lg font-bold" style={{color: project.splash.accent}}>${(project.value/1000).toFixed(0)}k</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-gold-dim">Completion</span>
              <span className="text-sm font-mono font-bold" style={{color: project.splash.accent}}>{project.completion}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
              <div className="h-full rounded-full transition-all duration-1000" style={{width: `${project.completion}%`, background: `linear-gradient(to right, ${project.splash.accent}, ${project.splash.accent}aa)`}} />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-2">Technology Stack</div>
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map(t => (
                <span key={t} className="text-[11px] font-mono px-2.5 py-1 rounded text-chrome" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)', background:'rgba(255,255,255,0.02)'}}>{t}</span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim mb-2">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map(t => (
                <span key={t} className="text-[11px] font-mono px-2.5 py-1 rounded" style={{color: project.splash.accent, borderWidth:'1px', borderStyle:'solid', borderColor:project.splash.ring, background:'rgba(255,255,255,0.02)'}}>#{t}</span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-gold-dim">Started</div>
              <div className="text-chrome mt-1">{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-gold-dim">Target / Delivered</div>
              <div className="text-chrome mt-1">{new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>

          <a href="/#contact" className="mt-7 inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 min-h-[52px] rounded-xl font-semibold transition-all active:scale-[0.98] hover:opacity-90" style={{background:'var(--gold-bright)', color:'#09090f'}}>
            Discuss a similar project <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('updated');
  const [view, setView] = useState('grid');
  const [favs, setFavs] = useState(loadFavs);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [openProject, setOpenProject] = useState(null);

  useEffect(() => { saveFavs(favs); }, [favs]);

  const toggleFav = (id) => setFavs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const filtered = useMemo(() => {
    let list = PROJECTS;
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.industry.toLowerCase().includes(q) ||
      p.tech.some(t => t.toLowerCase().includes(q)) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
    if (category !== 'All') list = list.filter(p => p.category === category);
    if (status !== 'All') list = list.filter(p => p.status === status);
    if (showFavOnly) list = list.filter(p => favs.includes(p.id));
    return sortProjects(list, sort);
  }, [search, category, status, sort, showFavOnly, favs]);

  // Derived stats (animated)
  const stats = useMemo(() => {
    const total = PROJECTS.length;
    const completed = PROJECTS.filter(p => p.status === 'Completed').length;
    const active = PROJECTS.filter(p => p.status === 'Active').length;
    const pending = PROJECTS.filter(p => p.status === 'Pending').length;
    const revenue = PROJECTS.reduce((s, p) => s + p.value, 0);
    const avgCompletion = Math.round(PROJECTS.reduce((s, p) => s + p.completion, 0) / total);
    const avgDuration = Math.round(PROJECTS.reduce((s, p) => {
      const d = (new Date(p.completionDate) - new Date(p.startDate)) / (1000*60*60*24);
      return s + d;
    }, 0) / total);
    return { total, completed, active, pending, revenue, avgCompletion, avgDuration };
  }, []);

  // Monthly activity (last 12 months) — simple distribution mock
  const activity = useMemo(() => {
    const arr = new Array(12).fill(0);
    PROJECTS.forEach(p => {
      const m = new Date(p.completionDate).getMonth();
      arr[m] = (arr[m] || 0) + 1;
    });
    return arr;
  }, []);

  return (
    <div className="min-h-screen bg-void" style={{background:'var(--bg-void)'}}>
      {/* Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl" style={{background:'rgba(13,13,26,0.85)', borderBottom:'1px solid var(--border-subtle)'}}>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 h-[68px] flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-chrome-mid hover:text-gold transition-colors">
            <ArrowLeft size={16} />
            <span className="text-[13px] font-medium tracking-wide">Back to home</span>
          </Link>
          <div className="text-[11px] font-mono uppercase tracking-widest text-gold-dim">Projects · Dashboard</div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 pt-8 sm:pt-12 pb-20 sm:pb-24">
        {/* Title */}
        <div>
          <div className="eyebrow">Live Portfolio</div>
          <h1 className="mt-3 font-display text-[30px] sm:text-4xl md:text-5xl font-bold tracking-tight text-chrome leading-tight">
            Projects we&apos;ve <span className="gold-text-gradient">shipped & shipping.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-secondary-soft max-w-2xl leading-relaxed">
            A live operations view across every TTS engagement — active builds, recent deliveries, and upcoming work. Filter, sort, and dive into any project.
          </p>
        </div>

        {/* Widgets */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatWidget label="Total Projects" value={stats.total} icon={Briefcase} accent="var(--gold-bright)" sub="Across all programs" />
          <StatWidget label="Completed" value={stats.completed} icon={CheckCircle2} accent="#d4a843" sub="Delivered & in production" />
          <StatWidget label="Active" value={stats.active} icon={Activity} accent="#7ac462" sub={`${stats.pending} pending`} />
          <StatWidget label="Revenue" value={Math.round(stats.revenue/1000)} prefix="$" suffix="k" icon={DollarSign} accent="#d4a843" sub="Cumulative value" />
        </div>

        {/* Secondary widgets */}
        <div className="mt-3 sm:mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-card-soft rounded-2xl p-5 sm:p-6" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}>
            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-gold-dim">Average Completion</div>
            <div className="mt-4 flex items-center justify-between">
              <CircularProgress value={stats.avgCompletion} size={96} stroke={7} />
              <div className="text-right">
                <div className="font-display text-3xl font-bold text-chrome leading-none">{stats.avgDuration}d</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-chrome-mid mt-1.5">Avg duration</div>
              </div>
            </div>
          </div>

          <div className="bg-card-soft rounded-2xl p-5 sm:p-6 md:col-span-2" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}>
            <div className="flex items-center justify-between">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-gold-dim">Monthly Delivery Activity</div>
              <span className="text-[10px] font-mono text-chrome-mid">Jan – Dec</span>
            </div>
            <div className="mt-4">
              <BarMini data={activity} height={72} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-chrome-mid">
              <span>J</span><span>F</span><span>M</span><span>A</span><span>M</span><span>J</span><span>J</span><span>A</span><span>S</span><span>O</span><span>N</span><span>D</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8">
          <ProjectFilters
            search={search} setSearch={setSearch}
            category={category} setCategory={setCategory}
            status={status} setStatus={setStatus}
            sort={sort} setSort={setSort}
            view={view} setView={setView}
            showFavoritesOnly={showFavOnly} setShowFavoritesOnly={setShowFavOnly}
            favCount={favs.length}
          />
        </div>

        {/* Results count */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-[11px] font-mono uppercase tracking-widest text-chrome-mid">
            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
          </div>
        </div>

        {/* Project grid */}
        {filtered.length === 0 ? (
          <div className="mt-12 text-center py-16 bg-card-soft rounded-2xl" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--border-subtle)'}}>
            <div className="font-display text-xl text-chrome">No projects match your filters.</div>
            <button onClick={() => { setSearch(''); setCategory('All'); setStatus('All'); setShowFavOnly(false); }} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold text-gold transition-all" style={{borderWidth:'1px', borderStyle:'solid', borderColor:'var(--gold-dim)'}}>
              Reset filters
            </button>
          </div>
        ) : (
          <div className={view === 'grid'
            ? 'mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
            : 'mt-6 flex flex-col gap-3 sm:gap-4'}>
            {filtered.map(p => (
              <ProjectCard key={p.id} project={p} view={view}
                favorited={favs.includes(p.id)}
                onToggleFavorite={toggleFav}
                onOpen={setOpenProject}
              />
            ))}
          </div>
        )}
      </main>

      <ProjectDetailModal project={openProject} onClose={() => setOpenProject(null)} />
    </div>
  );
}

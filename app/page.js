'use client';
import Link from 'next/link';
import Nav from '../components/Nav';
import ProgressBar from '../components/ProgressBar';
import { useApp } from '../components/AppProvider';
import { T } from '../lib/i18n';
import { MODULES, LESSONS } from '../lib/data';

// New palette — blue primary, purple accent, per-module colours
const MODULE_COLORS = { A1:'#7C3AED', A2:'#0891B2', B1:'#D97706', B2:'#2563EB', TEF:'#7C3AED' };
const MODULE_BGS    = { A1:'#EDE9FE', A2:'#E0F2FE', B1:'#FEF9C3', B2:'#DBEAFE', TEF:'#EDE9FE' };
const MODULE_BORDER = { A1:'#C4B5FD', A2:'#BAE6FD', B1:'#FDE68A', B2:'#BFDBFE', TEF:'#C4B5FD' };

export default function HomePage() {
  const { state, level, xpInLevel, completedCount } = useApp();
  if (!state) return null;
  const lang = state?.lang || 'en';
  const ht = T[lang]?.home || T.en.home;
  const navT = T[lang]?.nav || T.en.nav;

  const allLessons = Object.values(LESSONS);
  const firstIncomplete = allLessons.find(l => !state.completed?.[l.id]);

  return (
    <div className="page-shell">
      <Nav navT={navT} />
      <main className="page-content">

        {/* ── Hero banner ──────────────────────────────────────────────────── */}
        <div className="rounded-4xl p-7 mb-5 text-white overflow-hidden relative animate-fade-in"
          style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 55%, #2563EB 100%)' }}>

          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-1/4 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)' }} />

          {/* Brand tag */}
          <div className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase mb-3 font-body backdrop-blur-sm">
            🇨🇦 TEFReady.ca
          </div>

          <h1 className="font-display font-extrabold text-2xl md:text-3xl leading-tight mb-2 text-white" style={{ letterSpacing:'-0.02em' }}>
            {ht.tagline}
          </h1>
          <p className="text-sm text-blue-100 mb-6 font-body leading-relaxed max-w-sm">{ht.sub}</p>

          {/* XP level bar */}
          <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-blue-100 mb-2 font-body font-medium">
              <span className="flex items-center gap-1.5">⚡ Level {level}</span>
              <span>{xpInLevel}/100 XP</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${xpInLevel}%`, background: 'linear-gradient(90deg, #FDE68A, #F59E0B)' }} />
            </div>
            <p className="text-xs text-blue-200 mt-1.5 font-body">{xpInLevel} / 100 XP to Level {level + 1}</p>
          </div>
        </div>

        {/* ── Stats row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-5 animate-slide-up">
          {[
            { label: 'XP Earned', value: state.xp || 0,          icon: '⚡', bg: '#EFF6FF', col: '#1D4ED8', bdr: '#BFDBFE' },
            { label: 'Lessons',   value: completedCount,           icon: '📚', bg: '#F0FDF4', col: '#15803D', bdr: '#BBF7D0' },
            { label: 'Day Streak',value: `${state.streak || 0}d`, icon: '🔥', bg: '#FFF7ED', col: '#C2410C', bdr: '#FED7AA' },
          ].map((s, i) => (
            <div key={i} className="rounded-3xl p-4 text-center transition-transform hover:scale-105"
              style={{ background: s.bg, border: `1.5px solid ${s.bdr}`, boxShadow:'0 2px 8px rgba(37,99,235,0.07)' }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-display font-extrabold text-xl leading-none" style={{ color: s.col }}>{s.value}</div>
              <div className="text-xs font-body mt-1 font-semibold" style={{ color: s.col + 'cc' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Quick actions ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 mb-7 animate-slide-up">

          {/* Continue learning */}
          {firstIncomplete ? (
            <Link href={`/learn/${firstIncomplete.moduleId}/${firstIncomplete.id}`}
              className="card p-5 no-underline group hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-xl mb-3">
                {firstIncomplete.icon || '📚'}
              </div>
              <div className="font-display font-bold text-sm mb-1" style={{ color: '#1E3A8A' }}>{ht.continueLearn}</div>
              <div className="text-xs text-slate-500 font-body leading-snug line-clamp-2">
                {firstIncomplete.title[lang] || firstIncomplete.title.en}
              </div>
              <div className="mt-3 text-xs font-semibold text-primary flex items-center gap-1">
                Start → <span className="group-hover:translate-x-1 transition-transform inline-block">›</span>
              </div>
            </Link>
          ) : (
            <div className="card p-5 text-center" style={{ background:'#F0FDF4', borderColor:'#BBF7D0' }}>
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-display font-bold text-sm" style={{ color:'#15803D' }}>{ht.allDone}</div>
            </div>
          )}

          {/* Quick Feed */}
          <Link href="/quick"
            className="rounded-3xl p-5 no-underline group hover:-translate-y-0.5 hover:opacity-95 transition-all duration-200 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)', boxShadow:'0 4px 16px rgba(124,58,237,0.3)' }}>
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full"
              style={{ background:'rgba(255,255,255,0.07)' }} />
            <div className="text-2xl mb-3">⚡</div>
            <div className="font-display font-bold text-white text-sm mb-1">Quick Feed</div>
            <div className="text-xs text-blue-200 font-body leading-snug">TikTok-style vocab cards</div>
          </Link>
        </div>

        {/* ── Modules ────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg" style={{ color:'#1E3A8A' }}>{ht.modules}</h2>
          <span className="badge badge-blue">{MODULES.length} levels</span>
        </div>

        <div className="space-y-3 animate-slide-up">
          {MODULES.map(mod => {
            const doneLessons = mod.lessons.filter(id => state.completed?.[id]).length;
            const total = mod.lessons.length;
            const pct = total > 0 ? Math.round(doneLessons / total * 100) : 0;
            const color  = MODULE_COLORS[mod.id];
            const bg     = MODULE_BGS[mod.id];
            const border = MODULE_BORDER[mod.id];

            return (
              <Link key={mod.id}
                href={mod.locked ? '#' : `/learn/${mod.id}`}
                className={`card flex items-center gap-4 p-4 no-underline ${
                  mod.locked ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
                } transition-all duration-200`}>

                {/* Module icon */}
                <div className="w-14 h-14 rounded-3xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: bg, border: `1.5px solid ${border}` }}>
                  {mod.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-display font-bold text-sm" style={{ color:'#1E3A8A' }}>
                      {mod.label[lang] || mod.label.en}
                    </span>
                    {mod.locked
                      ? <span className="badge badge-blue opacity-60">🔒</span>
                      : <span className="text-xs font-bold font-body" style={{ color }}>
                          {doneLessons}/{total}
                        </span>
                    }
                  </div>

                  <p className="text-xs text-slate-500 font-body mb-2.5 leading-snug truncate">
                    {mod.desc[lang] || mod.desc.en}
                  </p>

                  {!mod.locked && (
                    <div className="progress-track h-1.5">
                      <div className="progress-fill h-full" style={{ width:`${pct}%`, background: color }} />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Bottom CTA for signed-out users ──────────────────────────────── */}
        <div className="mt-8 rounded-4xl p-6 text-center animate-slide-up"
          style={{ background:'linear-gradient(135deg, #EFF6FF 0%, #EDE9FE 100%)', border:'1.5px solid #BFDBFE' }}>
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-display font-bold text-base mb-1" style={{ color:'#1E3A8A' }}>Ready to reach CLB 7?</h3>
          <p className="text-xs text-slate-500 font-body mb-4 leading-relaxed">
            Track progress, earn XP, and prepare for TEF Canada — all in one place.
          </p>
          <Link href="/auth/signup"
            className="btn-primary text-sm inline-flex" style={{ padding:'0.625rem 1.5rem' }}>
            Start Free →
          </Link>
        </div>

      </main>
    </div>
  );
}

'use client';
import Link from 'next/link';
import Nav from '../components/Nav';
import ProgressBar from '../components/ProgressBar';
import { useApp } from '../components/AppProvider';
import { T } from '../lib/i18n';
import { MODULES, LESSONS } from '../lib/data';

const MODULE_COLORS = { A1:'#7C3AED', A2:'#0D9488', B1:'#D97706', B2:'#DC2626', TEF:'#BE185D' };
const MODULE_BGS    = { A1:'#F5F3FF', A2:'#F0FDFA', B1:'#FFFBEB', B2:'#FEF2F2', TEF:'#FDF2F8' };

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

        {/* Hero */}
        <div className="rounded-3xl p-7 mb-5 text-white overflow-hidden relative animate-fade-in"
          style={{ background: 'linear-gradient(135deg, #0A2540 0%, #1a3a5c 100%)' }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #E8A020, transparent)' }} />
          <div className="text-xs font-semibold tracking-widest uppercase opacity-60 mb-2 font-body">
            🇨🇦 TEFReady.ca
          </div>
          <h1 className="font-display font-bold text-2xl leading-tight mb-2">{ht.tagline}</h1>
          <p className="text-sm opacity-70 mb-5 font-body leading-relaxed">{ht.sub}</p>

          {/* XP Progress */}
          <div className="flex items-center justify-between text-xs opacity-70 mb-1.5 font-body">
            <span>Level {level}</span>
            <span>{xpInLevel}/100 XP → Level {level + 1}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${xpInLevel}%`, background: '#E8A020' }} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5 animate-slide-up">
          {[
            { label: 'XP Earned', value: state.xp || 0, icon: '⚡', bg: '#FFFBEB', col: '#92400E' },
            { label: 'Lessons',   value: completedCount,              icon: '📚', bg: '#F0FDF4', col: '#166534' },
            { label: 'Streak',    value: `${state.streak || 0}d`,      icon: '🔥', bg: '#FFF7ED', col: '#9A3412' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-4 text-center" style={{ background: s.bg }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-display font-bold text-xl" style={{ color: s.col }}>{s.value}</div>
              <div className="text-xs font-body mt-0.5" style={{ color: s.col + 'bb' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Continue + Daily */}
        <div className="grid grid-cols-2 gap-3 mb-6 animate-slide-up">
          {/* Continue */}
          {firstIncomplete ? (
            <Link href={`/learn/${firstIncomplete.moduleId}/${firstIncomplete.id}`}
              className="card p-5 no-underline hover:shadow-lift transition-shadow">
              <div className="text-2xl mb-2">{firstIncomplete.icon || '📚'}</div>
              <div className="font-display font-semibold text-navy text-sm mb-1">{ht.continueLearn}</div>
              <div className="text-xs text-slate-500 font-body leading-snug">
                {firstIncomplete.title[lang] || firstIncomplete.title.en}
              </div>
            </Link>
          ) : (
            <div className="card p-5 text-center">
              <div className="text-2xl mb-2">✅</div>
              <div className="font-display font-semibold text-navy text-sm">{ht.allDone}</div>
            </div>
          )}

          {/* Daily AI lesson */}
          <Link href="/daily"
            className="rounded-2xl p-5 no-underline hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' }}>
            <div className="text-2xl mb-2">🤖</div>
            <div className="font-display font-semibold text-white text-sm mb-1">{ht.aiDaily}</div>
            <div className="text-xs text-purple-200 font-body leading-snug">{ht.aiSub}</div>
          </Link>
        </div>

        {/* Modules */}
        <div className="font-display font-bold text-navy text-lg mb-3">{ht.modules}</div>
        <div className="space-y-2.5 animate-slide-up">
          {MODULES.map(mod => {
            const doneLessons = mod.lessons.filter(id => state.completed?.[id]).length;
            const total = mod.lessons.length;
            const pct = total > 0 ? Math.round(doneLessons / total * 100) : 0;
            const color = MODULE_COLORS[mod.id];
            const bg = MODULE_BGS[mod.id];

            return (
              <Link key={mod.id}
                href={mod.locked ? '#' : `/learn/${mod.id}`}
                className={`card flex items-center gap-4 p-4 no-underline transition-all ${
                  mod.locked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lift'
                }`}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: bg }}>
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-display font-semibold text-navy text-sm">
                      {mod.label[lang] || mod.label.en}
                    </span>
                    {mod.locked
                      ? <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 font-body">🔒</span>
                      : <span className="text-xs font-semibold font-body" style={{ color }}>{pct}%</span>
                    }
                  </div>
                  <p className="text-xs text-slate-500 font-body mb-2 leading-snug truncate">
                    {mod.desc[lang] || mod.desc.en}
                  </p>
                  {!mod.locked && <ProgressBar pct={pct} color={color} height={4} />}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

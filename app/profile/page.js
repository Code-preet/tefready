'use client';
import { useState } from 'react';
import Nav from '../../components/Nav';
import ProgressBar from '../../components/ProgressBar';
import { useApp } from '../../components/AppProvider';
import { T } from '../../lib/i18n';
import { MODULES } from '../../lib/data';

const MODULE_COLORS = { A1:'#7C3AED', A2:'#0D9488', B1:'#D97706', B2:'#DC2626', TEF:'#BE185D' };

export default function ProfilePage() {
  const { state, reset, level, xpInLevel, completedCount } = useApp();
if (!state) return null;
  const lang = state.lang || 'en';
  const pt = T[lang]?.profile || T.en.profile;
  const navT = T[lang]?.nav || T.en.nav;
  const [confirming, setConfirming] = useState(false);

  const stats = [
    { label: pt.totalXP,     value: state.xp || 0,             icon: '⚡', bg: '#FFFBEB', col: '#92400E' },
    { label: pt.lessonsDone, value: completedCount,             icon: '📚', bg: '#EFF6FF', col: '#1E40AF' },
    { label: pt.streak,      value: `${state.streak || 0}d`,   icon: '🔥', bg: '#FFF7ED', col: '#9A3412' },
    { label: pt.level,       value: `Lv ${level}`,             icon: '🏅', bg: '#F0FDF4', col: '#166534' },
  ];

  return (
    <div className="page-shell">
      <Nav navT={navT} />
      <main className="page-content">

        {/* Avatar */}
        <div className="flex flex-col items-center py-8 mb-6">
          <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center text-4xl mb-3 shadow-lift">
            🧑‍🎓
          </div>
          <h1 className="font-display font-bold text-navy text-xl mb-1">{pt.title}</h1>
          <div className="text-sm text-slate-500 font-body">Level {level} · {state.xp || 0} XP total</div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl p-4 text-center" style={{ background: s.bg }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-display font-bold text-xl" style={{ color: s.col }}>{s.value}</div>
              <div className="text-xs font-body mt-0.5 opacity-70" style={{ color: s.col }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Level progress */}
        <div className="card p-5 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-display font-semibold text-navy text-sm">{pt.progress}</span>
            <span className="text-xs text-slate-500 font-body">{xpInLevel}/100 XP</span>
          </div>
          <ProgressBar pct={xpInLevel} color="#0A2540" height={8} />
          <div className="text-xs text-slate-400 font-body mt-1.5">
            Level {level} → Level {level + 1}: {100 - xpInLevel} XP to go
          </div>
        </div>

        {/* Module breakdown */}
        <div className="card p-5 mb-6">
          <h2 className="font-display font-bold text-navy text-sm mb-4">{pt.breakdown}</h2>
          {MODULES.filter(m => m.lessons.length > 0).map(mod => {
            const done = mod.lessons.filter(id => state.completed?.[id]).length;
            const total = mod.lessons.length;
            const pct = total > 0 ? Math.round(done / total * 100) : 0;
            const color = MODULE_COLORS[mod.id];
            return (
              <div key={mod.id} className="mb-4 last:mb-0">
                <div className="flex justify-between text-xs font-body mb-1.5">
                  <span className="font-semibold text-slate-700">
                    {mod.icon} {mod.label[lang] || mod.label.en}
                  </span>
                  <span style={{ color }}>{done}/{total}</span>
                </div>
                <ProgressBar pct={pct} color={color} height={5} />
              </div>
            );
          })}
        </div>

        {/* Reset */}
        {!confirming ? (
          <button onClick={() => setConfirming(true)}
            className="w-full py-3.5 rounded-2xl font-body font-semibold text-sm text-red-600 border-2 border-red-100 bg-red-50 hover:bg-red-100 transition-colors">
            {pt.reset}
          </button>
        ) : (
          <div className="card p-5 border-2 border-red-200">
            <p className="text-sm text-red-800 font-body mb-4 text-center">{pt.resetConfirm}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirming(false)}
                className="flex-1 py-3 rounded-xl font-body font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={() => { reset(); setConfirming(false); }}
                className="flex-1 py-3 rounded-xl font-body font-semibold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors">
                Reset
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-slate-400 font-body">
          TEFReady.ca · Made for Canadian immigrants 🍁
        </div>
      </main>
    </div>
  );
}

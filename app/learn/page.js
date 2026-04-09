'use client';
import Link from 'next/link';
import Nav from '../../components/Nav';
import ProgressBar from '../../components/ProgressBar';
import { useApp } from '../../components/AppProvider';
import { T } from '../../lib/i18n';
import { MODULES } from '../../lib/data';

const MODULE_COLORS = { A1:'#7C3AED', A2:'#0D9488', B1:'#D97706', B2:'#DC2626', TEF:'#BE185D' };
const MODULE_BGS    = { A1:'#F5F3FF', A2:'#F0FDFA', B1:'#FFFBEB', B2:'#FEF2F2', TEF:'#FDF2F8' };

export default function LearnPage() {
  const { state } = useApp();
  const lang = state?.lang || 'en';
  const lt = T[lang]?.learn || T.en.learn;
  const navT = T[lang]?.nav || T.en.nav;

  return (
    <div className="page-shell">
      <Nav navT={navT} />
      <main className="page-content">
        <h1 className="font-display font-bold text-navy text-2xl mb-1">{lt.title}</h1>
        <p className="text-sm text-slate-500 font-body mb-6">{lt.sub}</p>

        <div className="space-y-3">
          {MODULES.map(mod => {
            const color = MODULE_COLORS[mod.id];
            const bg = MODULE_BGS[mod.id];
            const doneLessons = mod.lessons.filter(id => state.completed?.[id]).length;
            const total = mod.lessons.length;
            const pct = total > 0 ? Math.round(doneLessons / total * 100) : 0;

            const inner = (
              <div className={`card p-5 transition-all ${mod.locked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lift cursor-pointer'}`}>
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: bg }}>
                    {mod.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="font-display font-bold text-navy text-base leading-tight">
                        {mod.label[lang] || mod.label.en}
                      </h2>
                      {mod.locked
                        ? <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2.5 py-1 font-body ml-2 flex-shrink-0">🔒 Locked</span>
                        : <span className="text-xs font-semibold font-body ml-2 flex-shrink-0" style={{ color }}>
                            {doneLessons}/{total} {lt.lessons}
                          </span>
                      }
                    </div>
                    <p className="text-sm text-slate-500 font-body mb-3 leading-relaxed">
                      {mod.desc[lang] || mod.desc.en}
                    </p>
                    {!mod.locked && (
                      <>
                        <ProgressBar pct={pct} color={color} height={5} />
                        <div className="text-xs text-slate-400 font-body mt-1.5">
                          {doneLessons} {lt.done} · {pct}%
                        </div>
                      </>
                    )}
                    {mod.locked && (
                      <p className="text-xs text-slate-400 font-body italic">{lt.locked}</p>
                    )}
                  </div>
                </div>
              </div>
            );

            return mod.locked
              ? <div key={mod.id}>{inner}</div>
              : <Link key={mod.id} href={`/learn/${mod.id}`} className="block no-underline">{inner}</Link>;
          })}
        </div>
      </main>
    </div>
  );
}

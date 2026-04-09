'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Nav from '../../../components/Nav';
import ProgressBar from '../../../components/ProgressBar';
import { useApp } from '../../../components/AppProvider';
import { T } from '../../../lib/i18n';
import { MODULES, LESSONS } from '../../../lib/data';

const MODULE_COLORS = { A1:'#7C3AED', A2:'#0D9488', B1:'#D97706', B2:'#DC2626', TEF:'#BE185D' };
const MODULE_BGS    = { A1:'#F5F3FF', A2:'#F0FDFA', B1:'#FFFBEB', B2:'#FEF2F2', TEF:'#FDF2F8' };

export default function ModulePage() {
  const { moduleId } = useParams();
  const { state } = useApp();
if (!state) return null;
  const lang = state?.lang || 'en';
  const lt = T[lang]?.lesson || T.en.lesson;
  const navT = T[lang]?.nav || T.en.nav;

  const mod = MODULES.find(m => m.id === moduleId);
  if (!mod) return <div className="p-8 text-center text-slate-500">Module not found.</div>;

  const color = MODULE_COLORS[moduleId] || '#0A2540';
  const bg = MODULE_BGS[moduleId] || '#F5F5F5';
  const lessonObjects = mod.lessons.map(id => LESSONS[id]).filter(Boolean);
  const doneLessons = lessonObjects.filter(l => state.completed?.[l.id]).length;
  const pct = lessonObjects.length > 0 ? Math.round(doneLessons / lessonObjects.length * 100) : 0;

  return (
    <div className="page-shell">
      <Nav navT={navT} />
      <main className="page-content">
        {/* Back */}
        <Link href="/learn" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy mb-5 no-underline font-body transition-colors">
          ← Back to modules
        </Link>

        {/* Module header */}
        <div className="rounded-3xl p-6 mb-6" style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)`, border: `1.5px solid ${color}30` }}>
          <div className="text-4xl mb-3">{mod.icon}</div>
          <h1 className="font-display font-bold text-navy text-2xl mb-2">
            {mod.label[lang] || mod.label.en}
          </h1>
          <p className="text-sm text-slate-600 font-body mb-4">{mod.desc[lang] || mod.desc.en}</p>
          <div className="flex items-center justify-between text-xs font-body text-slate-500 mb-2">
            <span>{doneLessons}/{lessonObjects.length} lessons complete</span>
            <span style={{ color }}>{pct}%</span>
          </div>
          <ProgressBar pct={pct} color={color} height={6} />
        </div>

        {/* Lessons */}
        {lessonObjects.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-4xl mb-3">🚧</div>
            <p className="font-display font-semibold text-navy">Coming Soon</p>
            <p className="text-sm text-slate-500 mt-1 font-body">Lessons for this module are being built. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {lessonObjects.map((lesson, idx) => {
              const done = state.completed?.[lesson.id];
              const prevDone = idx === 0 || state.completed?.[lessonObjects[idx - 1]?.id];
              return (
                <Link key={lesson.id} href={`/learn/${moduleId}/${lesson.id}`}
                  className="card flex items-center gap-4 p-4 no-underline hover:shadow-lift transition-all"
                  style={{ borderColor: done ? color + '44' : undefined, borderWidth: done ? '1.5px' : undefined }}>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: bg }}>
                    {lesson.icon}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-navy text-sm mb-0.5">
                      {lesson.title[lang] || lesson.title.en}
                    </div>
                    <div className="text-xs text-slate-500 font-body">
                      +{lesson.xp} XP · {lesson.vocab.length} words · {lesson.exercises.length} exercises
                    </div>
                  </div>
                  {/* Status */}
                  <div className="flex-shrink-0">
                    {done
                      ? <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: color }}>✓</div>
                      : <div className="w-7 h-7 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 text-sm">→</div>
                    }
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

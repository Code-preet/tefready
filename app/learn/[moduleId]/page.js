'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Nav from '../../../components/Nav';
import ProgressBar from '../../../components/ProgressBar';
import { useApp } from '../../../components/AppProvider';
import { T } from '../../../lib/i18n';
import { MODULES, LESSONS } from '../../../lib/data';

const MODULE_COLORS = { A1:'#7C3AED', A2:'#0891B2', B1:'#D97706', B2:'#2563EB', TEF:'#BE185D' };
const MODULE_BGS    = { A1:'#F5F3FF', A2:'#E0F2FE', B1:'#FFFBEB', B2:'#EFF6FF', TEF:'#FDF2F8' };
const PASS_THRESHOLD = 70;

function ScoreBadge({ score }) {
  if (!score) return null;
  const passed = score.passed;
  const pct = score.bestPct || score.pct || 0;
  return (
    <span className="text-xs font-bold rounded-full px-2 py-0.5 flex-shrink-0"
      style={{ background: passed ? '#DCFCE7' : '#FEF2F2', color: passed ? '#15803D' : '#DC2626' }}>
      {pct}%
    </span>
  );
}

export default function ModulePage() {
  const { moduleId } = useParams();
  const { state } = useApp();
  if (!state) return null;

  const lang = state?.lang || 'en';
  const lt   = T[lang]?.lesson || T.en.lesson;
  const navT = T[lang]?.nav || T.en.nav;

  const mod = MODULES.find(m => m.id === moduleId);
  if (!mod) return <div className="p-8 text-center text-slate-500">Module not found.</div>;

  const color = MODULE_COLORS[moduleId] || '#0A2540';
  const bg    = MODULE_BGS[moduleId] || '#F5F5F5';
  const lessonObjects = mod.lessons.map(id => LESSONS[id]).filter(Boolean);

  // Count passed lessons (score >= 70%) for progress
  const passedLessons = lessonObjects.filter(l => state.lessonScores?.[l.id]?.passed).length;
  const pct = lessonObjects.length > 0 ? Math.round(passedLessons / lessonObjects.length * 100) : 0;

  return (
    <div className="page-shell">
      <Nav navT={navT} />
      <main className="page-content">
        <Link href="/learn" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy mb-5 no-underline font-body transition-colors">
          ← Back to modules
        </Link>

        {/* Module header */}
        <div className="rounded-3xl p-6 mb-6" style={{ background:`linear-gradient(135deg, ${color}15, ${color}08)`, border:`1.5px solid ${color}30` }}>
          <div className="text-4xl mb-3">{mod.icon}</div>
          <h1 className="font-display font-bold text-navy text-2xl mb-2">{mod.label[lang] || mod.label.en}</h1>
          <p className="text-sm text-slate-600 font-body mb-4">{mod.desc[lang] || mod.desc.en}</p>

          <div className="flex items-center justify-between text-xs font-body text-slate-500 mb-2">
            <span>{passedLessons}/{lessonObjects.length} lessons mastered</span>
            <span style={{ color }}>{pct}% complete</span>
          </div>
          <ProgressBar pct={pct} color={color} height={6} />

          {/* Legend */}
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-body">
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              Mastered (≥{PASS_THRESHOLD}%)
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-body">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              Attempted
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-body">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              Locked
            </div>
          </div>
        </div>

        {/* Lesson list */}
        {lessonObjects.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-4xl mb-3">🚧</div>
            <p className="font-display font-semibold text-navy">Coming Soon</p>
            <p className="text-sm text-slate-500 mt-1 font-body">Lessons for this module are being built. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessonObjects.map((lesson, idx) => {
              const score     = state.lessonScores?.[lesson.id];
              const passed    = score?.passed;
              const attempted = score && !passed;
              const prevId    = idx > 0 ? lessonObjects[idx - 1]?.id : null;
              const prevPassed= idx === 0 || !!(state.lessonScores?.[prevId]?.passed);
              const locked    = idx > 0 && !prevPassed;

              if (locked) {
                // Locked lesson — not clickable
                return (
                  <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                    style={{ background: '#F8FAFC', border: '1.5px solid #F1F5F9', opacity: 0.65 }}>
                    {/* Lock icon */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 bg-slate-100">
                      🔒
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-slate-400 text-sm mb-0.5">
                        {lesson.title?.[lang] || lesson.title?.en}
                      </div>
                      <div className="text-xs text-slate-300 font-body">
                        Complete lesson {idx} with {PASS_THRESHOLD}%+ to unlock
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 text-sm">🔒</div>
                    </div>
                  </div>
                );
              }

              // Unlocked lesson
              return (
                <Link key={lesson.id} href={`/learn/${moduleId}/${lesson.id}`}
                  className="card flex items-start gap-4 p-4 no-underline hover:shadow-lift transition-all"
                  style={{
                    borderColor: passed ? color + '44' : attempted ? '#FDE68A' : undefined,
                    borderWidth: (passed || attempted) ? '1.5px' : undefined,
                  }}>
                  {/* Icon with status ring */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: passed ? color + '15' : attempted ? '#FFFBEB' : bg }}>
                      {passed ? '✅' : attempted ? '⚠️' : (lesson.icon || '📖')}
                    </div>
                    {passed && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: color }}>✓</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <div className="font-display font-semibold text-navy text-sm">
                        {lesson.title?.[lang] || lesson.title?.en}
                      </div>
                      <ScoreBadge score={score} />
                    </div>
                    <div className="text-xs text-slate-500 font-body">
                      +{lesson.xp} XP · {lesson.vocab?.length || 0} words · {(lesson.exercises?.length || 0)} exercises
                    </div>

                    {/* Status tags */}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {passed && (
                        <span className="text-[10px] font-bold rounded-full px-2 py-0.5" style={{ background: color + '15', color }}>
                          ✓ Mastered
                        </span>
                      )}
                      {attempted && (
                        <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-amber-100 text-amber-700">
                          ⚠ Review Required — {score?.pct}%
                        </span>
                      )}
                      {!score && (
                        <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-slate-100 text-slate-400">
                          Not started
                        </span>
                      )}
                      {score && score.attempts > 1 && (
                        <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-slate-100 text-slate-400">
                          {score.attempts} attempts
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ background: passed ? color : attempted ? '#D97706' : color + '40' }}>
                      →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Module completion message */}
        {lessonObjects.length > 0 && passedLessons === lessonObjects.length && (
          <div className="mt-6 rounded-3xl p-6 text-center"
            style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, border: `2px solid ${color}40` }}>
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="font-display font-extrabold text-xl text-navy mb-1">Module Complete!</h3>
            <p className="text-sm text-slate-600 font-body">You've mastered all lessons in this module. You're one step closer to CLB 7!</p>
          </div>
        )}
      </main>
    </div>
  );
}

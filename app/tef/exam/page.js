'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav from '../../../components/Nav';
import { useApp } from '../../../components/AppProvider';
import { T } from '../../../lib/i18n';

const MODULES = [
  {
    id: 'listening',
    icon: '🎧',
    title: "Compréhension de l'oral",
    subtitle: 'Listening Comprehension',
    color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE',
    time: '40 min', questions: '13 questions', clb: 'CLB 5–12',
    maxScore: 13,
    href: '/listen',
    scoreKey: 'tefListeningScore',
    description: 'Audio dialogues and monologues. Choose the best answer for each.',
    tips: ['Listen to each audio twice', 'Read all options before choosing', 'Focus on the specific question asked'],
  },
  {
    id: 'reading',
    icon: '📖',
    title: "Compréhension de l'écrit",
    subtitle: 'Reading Comprehension',
    color: '#0891B2', bg: '#E0F2FE', border: '#BAE6FD',
    time: '50 min', questions: '13 questions', clb: 'CLB 5–12',
    maxScore: 13,
    href: '/tef/exam/reading',
    scoreKey: 'tefReadingScore',
    description: 'Three texts on Canadian topics. Answer comprehension questions.',
    tips: ['Skim the text first, then read questions', 'The answer is always in the text', 'Look for key words from the question in the passage'],
  },
  {
    id: 'speaking',
    icon: '🎤',
    title: "Expression orale",
    subtitle: 'Speaking Expression',
    color: '#D97706', bg: '#FEF9C3', border: '#FDE68A',
    time: '15 min', questions: '3 tasks', clb: 'CLB 5–12',
    maxScore: 20,
    href: '/tef/exam/speaking',
    scoreKey: 'tefSpeakingScore',
    description: 'Three oral tasks: monologue, interaction, and point of view.',
    tips: ['Use the prep time to organize ideas', 'Always use "vous" formal register', 'Structure: intro → points → conclusion'],
  },
  {
    id: 'writing',
    icon: '✍️',
    title: "Expression écrite",
    subtitle: 'Writing Expression',
    color: '#7C3AED', bg: '#EDE9FE', border: '#C4B5FD',
    time: '60 min', questions: '2 tasks', clb: 'CLB 5–12',
    maxScore: 20,
    href: '/tef/exam/writing',
    scoreKey: 'tefWritingScore',
    description: 'Write a formal message and an opinion essay in French.',
    tips: ['Plan before writing', 'Use connecting words (néanmoins, en revanche)', 'Leave 5 min to re-read and correct'],
  },
];

const CLB_BANDS = [
  { clb: 'CLB 4–5', range: [0, 40], color: '#DC2626', bg: '#FEF2F2', label: 'Basic' },
  { clb: 'CLB 6',   range: [41, 55], color: '#EA580C', bg: '#FFF7ED', label: 'Intermediate' },
  { clb: 'CLB 7',   range: [56, 70], color: '#D97706', bg: '#FEF9C3', label: 'Immigration Ready ✓' },
  { clb: 'CLB 8',   range: [71, 83], color: '#16A34A', bg: '#F0FDF4', label: 'Strong Proficiency' },
  { clb: 'CLB 9+',  range: [84, 100], color: '#7C3AED', bg: '#EDE9FE', label: 'Near-Native' },
];

function estimateCLB(pct) {
  return CLB_BANDS.find(b => pct >= b.range[0] && pct <= b.range[1]) || CLB_BANDS[0];
}

export default function ExamHubPage() {
  const { state } = useApp();
  const lang = state?.lang || 'en';
  const navT = T[lang]?.nav || T.en.nav;

  // Load scores from localStorage
  const [scores, setScores] = useState({});
  useEffect(() => {
    try {
      const saved = {};
      MODULES.forEach(m => {
        const v = localStorage.getItem(m.scoreKey);
        if (v !== null) saved[m.id] = JSON.parse(v);
      });
      setScores(saved);
    } catch {}
  }, []);

  // Overall score estimate
  const completedModules = MODULES.filter(m => scores[m.id] != null);
  const overallPct = completedModules.length > 0
    ? Math.round(completedModules.reduce((sum, m) => sum + (scores[m.id] / m.maxScore) * 100, 0) / completedModules.length)
    : null;
  const clbEstimate = overallPct != null ? estimateCLB(overallPct) : null;

  return (
    <div className="page-shell">
      <Nav navT={navT} />
      <main className="page-content">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="rounded-4xl overflow-hidden mb-6 relative animate-fade-in"
          style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 60%, #2563EB 100%)' }}>
          <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />
          <div className="p-7 relative">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs font-semibold text-white/80 mb-3 tracking-wide uppercase">
              🏆 TEF Canada Prep
            </div>
            <h1 className="font-display font-extrabold text-2xl text-white leading-tight mb-2">
              Simulateur d'examen TEF
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed mb-5 max-w-md">
              Practice all 4 modules under real TEF conditions — timed, scored, and with detailed feedback.
            </p>

            {/* Overall CLB estimate */}
            {clbEstimate ? (
              <div className="bg-white/15 rounded-3xl p-4 backdrop-blur-sm">
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">
                  Estimated CLB Score
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-extrabold text-white font-display">{clbEstimate.clb}</div>
                  <div>
                    <div className="text-white font-semibold text-base">{clbEstimate.label}</div>
                    <div className="text-blue-200 text-sm">{completedModules.length}/4 modules completed · {overallPct}% avg</div>
                  </div>
                </div>
                {overallPct != null && (
                  <div className="mt-3 h-2.5 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${overallPct}%`, background:'linear-gradient(90deg,#FDE68A,#F59E0B)' }} />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/10 rounded-3xl p-4">
                <p className="text-white/70 text-sm">Complete at least one module to see your CLB estimate.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── CLB Reference ──────────────────────────────────────────────── */}
        <div className="card p-4 mb-6 animate-slide-up">
          <p className="section-label mb-3">TEF Score → CLB Level</p>
          <div className="grid grid-cols-5 gap-1.5">
            {CLB_BANDS.map(b => (
              <div key={b.clb} className="rounded-2xl p-2.5 text-center"
                style={{ background: clbEstimate?.clb === b.clb ? b.bg : '#f8fafc', border: clbEstimate?.clb === b.clb ? `2px solid ${b.color}` : '1.5px solid #e2e8f0' }}>
                <div className="font-display font-bold text-xs leading-tight" style={{ color: b.color }}>{b.clb}</div>
                <div className="text-slate-400 text-[10px] mt-0.5 leading-tight hidden md:block">{b.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2.5 font-body">CLB 7+ required for most Express Entry immigration streams</p>
        </div>

        {/* ── Module Cards ───────────────────────────────────────────────── */}
        <h2 className="font-display font-bold text-lg mb-4" style={{ color:'#1E3A8A' }}>
          Choose a Module
        </h2>
        <div className="space-y-3 animate-slide-up">
          {MODULES.map(mod => {
            const score = scores[mod.id];
            const done = score != null;
            const pct = done ? Math.round((score / mod.maxScore) * 100) : 0;
            const clb = done ? estimateCLB(pct) : null;

            return (
              <div key={mod.id} className="card overflow-hidden">
                {/* Top section */}
                <div className="flex items-start gap-4 p-4 pb-3">
                  <div className="w-14 h-14 rounded-3xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: mod.bg, border:`1.5px solid ${mod.border}` }}>
                    {mod.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-bold text-sm leading-tight" style={{ color:'#1E3A8A' }}>
                          {mod.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-body mt-0.5">{mod.subtitle}</p>
                      </div>
                      {done && (
                        <div className="flex-shrink-0 rounded-2xl px-2.5 py-1 text-xs font-bold"
                          style={{ background: clb.bg, color: clb.color, border:`1px solid ${mod.border}` }}>
                          {clb.clb}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-body">
                      <span>⏱ {mod.time}</span>
                      <span>•</span>
                      <span>📝 {mod.questions}</span>
                      <span>•</span>
                      <span style={{ color: mod.color, fontWeight:600 }}>{mod.clb}</span>
                    </div>
                  </div>
                </div>

                {/* Score bar (if done) */}
                {done && (
                  <div className="px-4 pb-3">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-500">Score: {score}/{mod.maxScore}</span>
                      <span style={{ color: mod.color }}>{pct}%</span>
                    </div>
                    <div className="progress-track h-2">
                      <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background: mod.color }} />
                    </div>
                  </div>
                )}

                {/* Tips row */}
                <div className="mx-4 mb-3 rounded-2xl p-3" style={{ background: mod.bg, border:`1px solid ${mod.border}` }}>
                  <p className="text-xs font-bold mb-1.5" style={{ color: mod.color }}>💡 Exam Tips</p>
                  <ul className="space-y-0.5">
                    {mod.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-slate-600 font-body flex gap-1.5">
                        <span className="text-slate-300 mt-0.5">›</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-4 pb-4">
                  <Link href={mod.href}
                    className="flex items-center justify-center gap-2 w-full rounded-2xl py-3 text-sm font-bold text-white no-underline transition-all active:scale-95 hover:opacity-90"
                    style={{ background: done ? `linear-gradient(135deg, ${mod.color}cc, ${mod.color})` : `linear-gradient(135deg, ${mod.color}dd, ${mod.color})`, boxShadow:`0 3px 12px ${mod.color}40` }}>
                    {mod.icon} {done ? 'Retake Module' : 'Start Module'} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Study Tips ─────────────────────────────────────────────────── */}
        <div className="mt-6 rounded-4xl p-5 animate-slide-up"
          style={{ background:'linear-gradient(135deg, #EDE9FE 0%, #DBEAFE 100%)', border:'1.5px solid #C4B5FD' }}>
          <h3 className="font-display font-bold text-sm mb-3" style={{ color:'#1E3A8A' }}>
            🎯 How TEF Canada is scored
          </h3>
          <div className="space-y-1.5 text-xs text-slate-600 font-body leading-relaxed">
            <p>• Each module is scored separately. CLB 7 = roughly 70% in each section.</p>
            <p>• Immigration Canada requires CLB 7 in all 4 skills for most programs.</p>
            <p>• Speaking & Writing are graded by human examiners (AI feedback here is for practice).</p>
            <p>• Official TEF scores are valid for 2 years from the test date.</p>
          </div>
        </div>

      </main>
    </div>
  );
}

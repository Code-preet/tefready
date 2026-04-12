'use client';
import Link from 'next/link';
import { useApp } from '../../components/AppProvider';
import Nav from '../../components/Nav';
import { T } from '../../lib/i18n';

const SECTIONS = [
  {
    id: 'listening',
    icon: '🎧',
    color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE',
    title: "Compréhension de l'oral",
    subtitle: 'Listening Comprehension',
    desc: 'Audio dialogues and monologues. Choose the best answer for each situation.',
    time: '40 min', questions: '13 questions', clb: 'CLB 5–12',
    examHref: '/listen',
    studyHref: '/learn/TEF',
  },
  {
    id: 'reading',
    icon: '📖',
    color: '#0891B2', bg: '#E0F2FE', border: '#BAE6FD',
    title: "Compréhension de l'écrit",
    subtitle: 'Reading Comprehension',
    desc: 'Three authentic Canadian texts. Answer comprehension questions under time pressure.',
    time: '50 min', questions: '13 questions', clb: 'CLB 5–12',
    examHref: '/tef/exam/reading',
    studyHref: '/learn/TEF',
  },
  {
    id: 'speaking',
    icon: '🎤',
    color: '#D97706', bg: '#FEF9C3', border: '#FDE68A',
    title: "Expression orale",
    subtitle: 'Speaking Expression',
    desc: 'Three oral tasks: monologue, interaction, point of view. Prep + speak timers.',
    time: '15 min', questions: '3 tasks', clb: 'CLB 5–12',
    examHref: '/tef/exam/speaking',
    studyHref: '/speak',
  },
  {
    id: 'writing',
    icon: '✍️',
    color: '#7C3AED', bg: '#EDE9FE', border: '#C4B5FD',
    title: "Expression écrite",
    subtitle: 'Written Expression',
    desc: 'Formal message + opinion essay. Live word counter, structure guide, sample answers.',
    time: '60 min', questions: '2 tasks', clb: 'CLB 5–12',
    examHref: '/tef/exam/writing',
    studyHref: '/learn/TEF',
  },
];

const CLB_TABLE = [
  { clb: 'CLB 4–5', tef: '181–225', desc: 'Basic communication',           color: '#DC2626', bg: '#FEF2F2' },
  { clb: 'CLB 6',   tef: '226–270', desc: 'Intermediate',                  color: '#EA580C', bg: '#FFF7ED' },
  { clb: 'CLB 7',   tef: '271–315', desc: 'Immigration ready ✅',           color: '#16A34A', bg: '#DCFCE7' },
  { clb: 'CLB 8',   tef: '316–360', desc: 'Strong proficiency',            color: '#0891B2', bg: '#E0F2FE' },
  { clb: 'CLB 9+',  tef: '361–450', desc: 'Near-native',                   color: '#7C3AED', bg: '#EDE9FE' },
];

const TOP_TIPS = [
  { icon: '📖', tip: 'Reading: Read the questions BEFORE the text — then scan for answers.' },
  { icon: '✍️', tip: 'Writing: Always use thèse–antithèse–synthèse structure for essays.' },
  { icon: '🎧', tip: 'Listening: Take notes on numbers and proper nouns immediately.' },
  { icon: '🎤', tip: "Speaking: Never stay silent. Use «C'est-à-dire que...» to buy time." },
  { icon: '🔤', tip: 'All sections: Vary vocabulary — repetition is penalised by examiners.' },
];

export default function TEFPage() {
  const { state } = useApp();
  const lang = state?.lang || 'en';
  const navT = T[lang]?.nav || T.en.nav;

  return (
    <div className="page-shell">
      <Nav navT={navT} />
      <main className="page-content">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="rounded-4xl overflow-hidden mb-6 relative animate-fade-in"
          style={{ background:'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 55%, #2563EB 100%)' }}>
          <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full opacity-10"
            style={{ background:'radial-gradient(circle,#fff,transparent)' }} />
          <div className="p-7">
            <div className="text-4xl mb-3">🏆</div>
            <h1 className="font-display font-extrabold text-2xl text-white leading-tight mb-2">
              TEF Canada Prep
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed mb-5 max-w-sm">
              Complete preparation for all 4 TEF Canada exam sections. Target CLB 7+ for immigration.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon:'📋', label:'4 exam sections' },
                { icon:'⏱', label:'~2h 45min total' },
                { icon:'🎯', label:'CLB 7+ target' },
                { icon:'📊', label:'Instant scoring' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs font-semibold text-white/80 rounded-full px-3 py-1.5"
                  style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)' }}>
                  {item.icon} {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Exam Simulator CTA ───────────────────────────────────────────── */}
        <Link href="/tef/exam"
          className="flex items-center justify-between rounded-4xl p-5 mb-6 no-underline group hover:-translate-y-0.5 transition-all animate-slide-up"
          style={{ background:'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)', boxShadow:'0 6px 24px rgba(124,58,237,0.35)' }}>
          <div>
            <div className="text-white/70 text-xs font-bold uppercase tracking-wide mb-1">New</div>
            <h2 className="font-display font-extrabold text-xl text-white leading-tight">
              TEF Exam Simulator
            </h2>
            <p className="text-blue-200 text-sm mt-1">
              All 4 modules · Timed · Scored · CLB estimate
            </p>
          </div>
          <div className="flex-shrink-0 w-12 h-12 rounded-3xl flex items-center justify-center text-2xl"
            style={{ background:'rgba(255,255,255,0.2)' }}>
            →
          </div>
        </Link>

        {/* ── 4 Sections ───────────────────────────────────────────────────── */}
        <h2 className="font-display font-bold text-lg mb-4 animate-slide-up" style={{ color:'#1E3A8A' }}>
          The 4 TEF Canada Sections
        </h2>
        <div className="space-y-3 mb-6 animate-slide-up">
          {SECTIONS.map(s => (
            <div key={s.id} className="card overflow-hidden">
              {/* Header */}
              <div className="flex items-start gap-4 p-4">
                <div className="w-12 h-12 rounded-3xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: s.bg, border:`1.5px solid ${s.border}` }}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-sm leading-tight" style={{ color:'#1E3A8A' }}>{s.title}</h3>
                  <p className="text-xs text-slate-400 font-body mt-0.5">{s.subtitle}</p>
                  <p className="text-xs text-slate-500 font-body mt-1.5 leading-snug">{s.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="badge badge-blue">⏱ {s.time}</span>
                    <span className="badge" style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
                      {s.questions}
                    </span>
                  </div>
                </div>
              </div>
              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                <Link href={s.examHref}
                  className="flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-bold text-white no-underline transition-all active:scale-95"
                  style={{ background: s.color, boxShadow:`0 2px 10px ${s.color}40` }}>
                  {s.icon} Practice Exam
                </Link>
                <Link href={s.studyHref}
                  className="flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-bold no-underline transition-all"
                  style={{ background: s.bg, color: s.color, border:`1.5px solid ${s.border}` }}>
                  📚 Study Lessons
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ── CLB Score Table ───────────────────────────────────────────────── */}
        <div className="card p-5 mb-5 animate-slide-up">
          <h2 className="font-display font-bold text-base mb-4" style={{ color:'#1E3A8A' }}>
            📊 TEF Score → CLB Level
          </h2>
          <div className="space-y-2">
            {CLB_TABLE.map((row, i) => (
              <div key={row.clb} className="flex items-center gap-3 rounded-2xl p-3"
                style={{ background: row.bg, border:`1px solid ${row.color}22` }}>
                <div className="flex-shrink-0 rounded-xl px-3 py-1.5 font-bold text-xs text-white text-center min-w-[70px]"
                  style={{ background: row.color }}>
                  {row.clb}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold" style={{ color: row.color }}>{row.tef} points</span>
                </div>
                <div className="text-xs font-semibold text-slate-500 font-body">{row.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 font-body">
            * CLB 7 minimum required for most Express Entry and Provincial Nominee programs
          </p>
        </div>

        {/* ── Top Tips ─────────────────────────────────────────────────────── */}
        <div className="rounded-4xl p-5 animate-slide-up"
          style={{ background:'linear-gradient(135deg, #FEF9C3, #FFF7ED)', border:'1.5px solid #FDE68A' }}>
          <h3 className="font-display font-bold text-base mb-4" style={{ color:'#92400E' }}>
            💡 Top 5 TEF Success Strategies
          </h3>
          <div className="space-y-3">
            {TOP_TIPS.map((t, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-sm"
                  style={{ background:'rgba(217,119,6,0.15)' }}>{t.icon}</span>
                <p className="text-sm text-amber-900 font-body leading-relaxed">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

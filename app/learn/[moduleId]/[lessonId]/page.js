'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../../components/AppProvider';
import { T } from '../../../../lib/i18n';
import { LESSONS } from '../../../../lib/data';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const MODULE_COLORS = { A1:'#7C3AED', A2:'#0D9488', B1:'#D97706', B2:'#DC2626', TEF:'#BE185D' };
const MODULE_BGS    = { A1:'#F5F3FF', A2:'#F0FDFA', B1:'#FFFBEB', B2:'#FEF2F2', TEF:'#FDF2F8' };

const STEP_META = {
  concept:   { label: 'Learn',      icon: '📖' },
  vocab:     { label: 'Vocab',      icon: '🗂️' },
  dialogue:  { label: 'Dialogue',   icon: '💬' },
  exercises: { label: 'Practice',   icon: '✏️' },
  speaking:  { label: 'Speaking',   icon: '🎙️' },
  writing:   { label: 'Writing',    icon: '✍️' },
};

// ─────────────────────────────────────────────────────────────────────────────
// TTS helper
// ─────────────────────────────────────────────────────────────────────────────
function speakFr(text, rate = 0.85) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR'; u.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const fr = voices.find(v => v.lang.startsWith('fr'));
  if (fr) u.voice = fr;
  window.speechSynthesis.speak(u);
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeader — consistent title bar for every step
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle, color }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-xl">{icon}</span>
        <h2 className="font-display font-bold text-navy text-xl leading-tight">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-slate-500 font-body ml-8">{subtitle}</p>}
      <div className="h-0.5 rounded-full mt-3" style={{ background: color + '30' }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VocabCard
// ─────────────────────────────────────────────────────────────────────────────
function VocabCard({ item, lang, color }) {
  const [speaking, setSpeaking] = useState(false);
  const handleSpeak = () => {
    speakFr(item.fr);
    setSpeaking(true);
    setTimeout(() => setSpeaking(false), 1400);
  };
  return (
    <div className="card mb-3 overflow-hidden">
      {/* French word row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3"
        style={{ borderBottom: `1px solid ${color}15` }}>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-navy text-lg leading-tight">{item.fr}</div>
          {item.ph && <div className="text-xs text-slate-400 italic mt-0.5 font-body">/{item.ph}/</div>}
        </div>
        <button onClick={handleSpeak}
          className="ml-3 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{ background: speaking ? color : color + '18', color: speaking ? 'white' : color }}
          aria-label="Pronounce">
          <span className="text-base">{speaking ? '🔊' : '▶'}</span>
        </button>
      </div>
      {/* Translations row */}
      <div className="grid grid-cols-2 gap-0">
        <div className="px-4 py-3" style={{ borderRight: `1px solid #F1F5F9` }}>
          <div className="text-xs font-semibold text-slate-400 font-body mb-1 uppercase tracking-wider">English</div>
          <div className="text-sm text-slate-800 font-body font-medium">{item.en}</div>
        </div>
        <div className="px-4 py-3">
          {lang !== 'en' && item[lang] ? (
            <>
              <div className="text-xs font-semibold text-slate-400 font-body mb-1 uppercase tracking-wider">{lang.toUpperCase()}</div>
              <div className="text-sm text-slate-800 font-body">{item[lang]}</div>
            </>
          ) : item.example ? (
            <>
              <div className="text-xs font-semibold text-slate-400 font-body mb-1 uppercase tracking-wider">Example</div>
              <div className="text-sm text-slate-600 font-body italic leading-snug">{item.example}</div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MCQExercise
// ─────────────────────────────────────────────────────────────────────────────
function MCQExercise({ exercise, color, onResult }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const correct = checked && selected === exercise.answer;

  return (
    <div>
      {/* Type badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold font-body uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: color + '15', color }}>
          Multiple Choice
        </span>
      </div>

      <p className="font-display font-semibold text-navy text-base leading-snug mb-5">
        {exercise.question}
      </p>

      <div className="space-y-2.5 mb-5">
        {exercise.options.map((opt, i) => {
          let bg = 'white', border = '#E2E8F0', textColor = '#334155';
          if (!checked) {
            if (selected === i) { bg = color + '12'; border = color; textColor = color; }
          } else {
            if (i === exercise.answer) { bg = '#F0FDF4'; border = '#16A34A'; textColor = '#15803D'; }
            else if (selected === i) { bg = '#FEF2F2'; border = '#DC2626'; textColor = '#B91C1C'; }
            else { textColor = '#94A3B8'; }
          }
          return (
            <button key={i} onClick={() => !checked && setSelected(i)}
              className="w-full text-left px-4 py-3.5 rounded-2xl font-body text-sm transition-all border-2 flex items-center gap-3"
              style={{ background: bg, borderColor: border, color: textColor }}>
              <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ borderColor: !checked ? (selected === i ? color : '#CBD5E1') : (i === exercise.answer ? '#16A34A' : selected === i ? '#DC2626' : '#CBD5E1') }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className={selected === i || (checked && i === exercise.answer) ? 'font-semibold' : ''}>{opt}</span>
            </button>
          );
        })}
      </div>

      {checked ? (
        <div>
          <div className={`rounded-xl px-4 py-3 mb-3 font-body text-sm font-semibold flex items-center gap-2 ${correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {correct ? '✅ Correct!' : `❌ Correct answer: ${exercise.options[exercise.answer]}`}
          </div>
          <button onClick={() => onResult(correct)}
            className="w-full py-4 rounded-2xl font-display font-bold text-sm text-white shadow-lift transition-all hover:opacity-90"
            style={{ background: color }}>
            Next →
          </button>
        </div>
      ) : (
        <button disabled={selected === null}
          onClick={() => selected !== null && setChecked(true)}
          className={`w-full py-4 rounded-2xl font-display font-bold text-sm transition-all ${selected !== null ? 'text-white shadow-lift' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          style={selected !== null ? { background: color } : {}}>
          Check Answer
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FillBlanksExercise
// ─────────────────────────────────────────────────────────────────────────────
function FillBlanksExercise({ exercise, color, onResult }) {
  const [inputs, setInputs] = useState(exercise.blanks.map(() => ''));
  const [checked, setChecked] = useState(false);
  const results = exercise.blanks.map((b, i) => inputs[i].trim().toLowerCase() === b.toLowerCase());
  const allCorrect = results.every(Boolean);

  return (
    <div>
      {/* Type badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold font-body uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: color + '15', color }}>
          Fill in the Blanks
        </span>
      </div>

      {/* Hint */}
      <div className="rounded-xl px-4 py-3 mb-5 flex gap-2 items-start"
        style={{ background: color + '0A', border: `1px dashed ${color}40` }}>
        <span className="text-sm flex-shrink-0">💡</span>
        <p className="text-xs font-body text-slate-600 leading-relaxed"><strong>Hint:</strong> {exercise.hint}</p>
      </div>

      {/* Sentence with inputs */}
      <div className="card p-5 mb-5 leading-loose">
        <p className="font-body text-navy text-sm leading-loose">
          {exercise.sentence.split('___').map((part, i) => (
            <span key={i}>
              {part}
              {i < exercise.blanks.length && (
                <input type="text" value={inputs[i]}
                  onChange={e => { if (!checked) { const n = [...inputs]; n[i] = e.target.value; setInputs(n); }}}
                  className="inline-block font-body text-sm px-2 py-0.5 rounded-lg border-b-2 border-l-0 border-r-0 border-t-0 mx-1 outline-none text-center transition-all"
                  style={{
                    width: `${Math.max(7, (exercise.blanks[i]?.length || 6) + 3)}ch`,
                    borderBottomColor: !checked ? color : results[i] ? '#16A34A' : '#DC2626',
                    background: !checked ? color + '08' : results[i] ? '#F0FDF4' : '#FEF2F2',
                    color: !checked ? '#0A2540' : results[i] ? '#15803D' : '#B91C1C',
                    fontWeight: checked ? 700 : 400,
                  }}
                  placeholder="___"
                />
              )}
            </span>
          ))}
        </p>
      </div>

      {checked && (
        <div className={`rounded-xl px-4 py-3 mb-3 font-body text-sm font-semibold ${allCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {allCorrect ? '✅ Perfect!' : `❌ Correct: ${exercise.blanks.join(', ')}`}
        </div>
      )}

      {!checked ? (
        <button disabled={inputs.some(v => !v.trim())} onClick={() => setChecked(true)}
          className={`w-full py-4 rounded-2xl font-display font-bold text-sm transition-all ${inputs.every(v => v.trim()) ? 'text-white shadow-lift' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          style={inputs.every(v => v.trim()) ? { background: color } : {}}>
          Check Answer
        </button>
      ) : (
        <button onClick={() => onResult(allCorrect)}
          className="w-full py-4 rounded-2xl font-display font-bold text-sm text-white shadow-lift hover:opacity-90"
          style={{ background: color }}>
          Next →
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DialogueLine — single chat bubble with translation toggle
// ─────────────────────────────────────────────────────────────────────────────
function DialogueLine({ line, isA, color }) {
  const [showTrans, setShowTrans] = useState(false);
  return (
    <div className={`flex gap-3 items-start ${isA ? '' : 'flex-row-reverse'}`}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
        style={{ background: isA ? color : '#64748B' }}>
        {line.speaker[0]}
      </div>
      <div style={{ maxWidth: '78%' }}>
        <div className={`flex items-center gap-2 mb-1 ${isA ? '' : 'flex-row-reverse'}`}>
          <span className="text-xs font-semibold font-body" style={{ color: isA ? color : '#64748B' }}>{line.speaker}</span>
          {line.translation && (
            <button onClick={() => setShowTrans(v => !v)}
              className="text-xs font-body font-semibold px-1.5 py-0.5 rounded transition-all"
              style={{ background: showTrans ? color + '20' : '#F1F5F9', color: showTrans ? color : '#94A3B8' }}>
              {showTrans ? 'FR' : 'EN'}
            </button>
          )}
        </div>
        <div className={`rounded-2xl px-4 py-3 ${isA ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
          style={{ background: isA ? color + '12' : '#F1F5F9' }}>
          <p className="text-sm font-body text-slate-800 leading-relaxed">
            {showTrans && line.translation ? line.translation : line.text}
          </p>
          {showTrans && line.translation && (
            <p className="text-xs font-body text-slate-400 italic mt-1.5 pt-1.5 border-t border-black/5 leading-snug">{line.text}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Complete Screen — shows score, breakdown, links
// ─────────────────────────────────────────────────────────────────────────────
function CompleteScreen({ lesson, score, total, color, moduleId }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 100;
  const medal = pct >= 90 ? '🥇' : pct >= 70 ? '🥈' : pct >= 50 ? '🥉' : '📚';
  const msg   = pct >= 90 ? 'Excellent!' : pct >= 70 ? 'Très bien!' : pct >= 50 ? 'Bien !' : 'Keep practicing!';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5" style={{ background: '#FAFBFF' }}>
      <div className="w-full max-w-sm">
        {/* Trophy card */}
        <div className="card p-8 text-center mb-4 animate-pop-in">
          <div className="text-6xl mb-3" style={{ animation: 'celebrate 0.7s ease-in-out' }}>{medal}</div>
          <h2 className="font-display font-bold text-navy text-2xl mb-1">Lesson Complete!</h2>
          <p className="text-slate-500 font-body text-sm mb-6">{msg}</p>

          {/* XP badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 font-display font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}>
            <span className="text-xl">⚡</span>
            <span>+{lesson.xp} XP earned</span>
          </div>

          {/* Score ring */}
          {total > 0 && (
            <div className="rounded-2xl p-5 mb-2" style={{ background: color + '0A', border: `1px solid ${color}20` }}>
              <div className="text-xs font-semibold font-body uppercase tracking-wider mb-3 text-slate-400">Exercise Score</div>
              <div className="font-display font-bold text-4xl mb-1" style={{ color }}>{score}<span className="text-slate-300 text-2xl font-normal">/{total}</span></div>
              {/* Mini progress bar */}
              <div className="h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="text-xs text-slate-500 font-body mt-1.5">{pct}% correct</div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-2.5">
          {/* Speaking reference link if lesson has it */}
          {lesson.speaking && (
            <div className="card p-4 flex items-start gap-3 cursor-default">
              <span className="text-xl flex-shrink-0">🎙️</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold font-body uppercase tracking-wide text-slate-400 mb-0.5">Speaking Task</div>
                <p className="text-sm font-body text-slate-700 leading-snug line-clamp-2">{lesson.speaking.prompt.slice(0, 80)}…</p>
              </div>
            </div>
          )}

          {/* Writing reference link if lesson has it */}
          {lesson.writing && (
            <div className="card p-4 flex items-start gap-3 cursor-default">
              <span className="text-xl flex-shrink-0">✍️</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold font-body uppercase tracking-wide text-slate-400 mb-0.5">Writing Task</div>
                <p className="text-sm font-body text-slate-700 leading-snug line-clamp-2">{lesson.writing.prompt.slice(0, 80)}…</p>
              </div>
            </div>
          )}

          <Link href={`/learn/${moduleId}`}
            className="block w-full py-4 rounded-2xl font-display font-bold text-sm text-white text-center no-underline hover:opacity-90 transition-opacity shadow-lift"
            style={{ background: color }}>
            ← Back to Module
          </Link>
          <Link href="/learn"
            className="block w-full py-3.5 rounded-2xl font-display font-semibold text-sm text-center no-underline transition-all border"
            style={{ color, borderColor: color + '40', background: color + '08' }}>
            Browse All Modules
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step Progress Indicator (dots + label)
// ─────────────────────────────────────────────────────────────────────────────
function StepIndicator({ steps, currentStep, color }) {
  const idx = steps.indexOf(currentStep);
  return (
    <div className="flex items-center justify-center gap-1.5 mt-2">
      {steps.map((s, i) => {
        const done    = i < idx;
        const active  = i === idx;
        const meta    = STEP_META[s] || { icon: '•', label: s };
        return (
          <div key={s} className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              {i > 0 && (
                <div className="w-3 h-0.5 rounded-full"
                  style={{ background: done ? color : '#E2E8F0' }} />
              )}
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all"
                style={{
                  background: active ? color : done ? color + '30' : '#F1F5F9',
                  color: active ? 'white' : done ? color : '#94A3B8',
                  boxShadow: active ? `0 0 0 3px ${color}25` : 'none',
                }}>
                {done ? '✓' : meta.icon}
              </div>
            </div>
            <span className="text-xs font-body hidden sm:block"
              style={{ color: active ? color : done ? color + '99' : '#CBD5E1', fontWeight: active ? 700 : 400 }}>
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Lesson Page
// ─────────────────────────────────────────────────────────────────────────────
export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const router = useRouter();
  const { state, addXP, markComplete } = useApp();

  // Hooks must come before any conditional return
  const [step, setStep]         = useState('concept');
  const [exIdx, setExIdx]       = useState(0);
  const [score, setScore]       = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!state) return null;
  const lang  = state?.lang || 'en';
  const lt    = T[lang]?.lesson || T.en.lesson;
  const lesson = LESSONS[lessonId];
  const color  = MODULE_COLORS[moduleId] || '#0A2540';
  const bg     = MODULE_BGS[moduleId]    || '#F5F5F5';

  // Build step list dynamically — only include steps the lesson data has
  const STEPS = [
    'concept',
    'vocab',
    lesson?.dialogue ? 'dialogue'  : null,
    'exercises',
    lesson?.speaking ? 'speaking'  : null,
    lesson?.writing  ? 'writing'   : null,
  ].filter(Boolean);

  if (!lesson) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-slate-500 font-body mb-4">Lesson not found.</p>
        <Link href="/learn" className="font-body font-semibold text-sm underline" style={{ color }}>← Back to Learn</Link>
      </div>
    </div>
  );

  if (completed) {
    return <CompleteScreen lesson={lesson} score={score} total={lesson.exercises?.length || 0}
      color={color} moduleId={moduleId} />;
  }

  const stepIdx = STEPS.indexOf(step);

  // Navigate to next step; if no next step, complete the lesson
  const goNext = () => {
    const next = STEPS[stepIdx + 1];
    if (next) { setStep(next); }
    else {
      if (!state.completed?.[lesson.id]) { addXP(lesson.xp); markComplete(lesson.id); }
      setCompleted(true);
    }
  };

  // Handle exercise completion — advances to next step (speaking/writing), or completes
  const handleExerciseResult = (isCorrect) => {
    const newScore = isCorrect ? score + 1 : score;
    if (exIdx < (lesson.exercises?.length ?? 0) - 1) {
      setScore(newScore);
      setExIdx(exIdx + 1);
    } else {
      setScore(newScore);
      const nextStep = STEPS[STEPS.indexOf('exercises') + 1];
      if (nextStep) {
        if (!state.completed?.[lesson.id]) { addXP(lesson.xp); markComplete(lesson.id); }
        setStep(nextStep);
      } else {
        if (!state.completed?.[lesson.id]) { addXP(lesson.xp); markComplete(lesson.id); }
        setCompleted(true);
      }
    }
  };

  const ContinueBtn = ({ label, onClick }) => (
    <button onClick={onClick || goNext}
      className="w-full py-4 rounded-2xl font-display font-bold text-sm text-white shadow-lift hover:opacity-90 transition-opacity mt-2"
      style={{ background: color }}>
      {label || 'Continue →'}
    </button>
  );

  return (
    <div className="min-h-screen font-body" style={{ background: '#FAFBFF' }}>

      {/* ── Sticky top bar ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-2">
          {/* Row 1: back / title / xp */}
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => stepIdx > 0 ? setStep(STEPS[stepIdx - 1]) : router.push(`/learn/${moduleId}`)}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100 text-slate-500 text-lg">
              ←
            </button>
            <div className="flex-1 text-center font-display font-semibold text-navy text-sm leading-snug truncate px-1">
              {lesson.icon || '📖'} {lesson.title[lang] || lesson.title.en}
            </div>
            <div className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: color + '15', color }}>
              +{lesson.xp} XP
            </div>
          </div>
          {/* Row 2: step indicator */}
          <StepIndicator steps={STEPS} currentStep={step} color={color} />
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-28">

        {/* ═══════════════════════════════════════════════════════ CONCEPT ═══ */}
        {step === 'concept' && (
          <div className="animate-fade-in">
            <SectionHeader icon="📖" title="Lesson Overview"
              subtitle={`${lesson.title[lang] || lesson.title.en} · ${lesson.vocab?.length || 0} words · ${lesson.exercises?.length || 0} exercises`}
              color={color} />

            {/* Objective */}
            {lesson.objective && (
              <div className="rounded-2xl px-5 py-4 mb-5 flex gap-3 items-start"
                style={{ background: color + '0D', border: `1px solid ${color}25` }}>
                <span className="text-xl flex-shrink-0">🎯</span>
                <div>
                  <div className="text-xs font-semibold font-body uppercase tracking-wider mb-1.5" style={{ color }}>What you'll learn</div>
                  <p className="text-sm text-slate-700 font-body leading-relaxed">{lesson.objective}</p>
                </div>
              </div>
            )}

            {/* Grammar / explanation */}
            <div className="rounded-3xl p-6 mb-4 text-white shadow-lift"
              style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}BB 100%)` }}>
              <div className="text-xs font-semibold tracking-widest uppercase opacity-75 mb-2 font-body">
                {lesson.grammar?.title || 'Key Concept'}
              </div>
              <p className="text-base leading-relaxed font-body">
                {lesson.grammar?.explanation || lesson.concept?.[lang] || lesson.concept?.en || ''}
              </p>
            </div>

            {/* Grammar points */}
            {lesson.grammar?.points?.length > 0 && (
              <div className="card p-5 mb-4">
                <div className="text-xs font-semibold font-body uppercase tracking-wider text-slate-400 mb-4">Key Rules</div>
                <div className="space-y-2.5">
                  {lesson.grammar.points.map((pt, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ background: color + '18', color }}>{i + 1}</div>
                      <p className="text-sm font-body text-slate-700 leading-relaxed">{pt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grammar examples */}
            {lesson.grammar?.examples?.length > 0 && (
              <div className="card p-5 mb-6" style={{ background: '#F8FAFF', borderColor: '#E0E8FF' }}>
                <div className="text-xs font-semibold font-body uppercase tracking-wider text-slate-400 mb-3">Examples</div>
                <div className="space-y-2">
                  {lesson.grammar.examples.map((ex, i) => (
                    <div key={i} className="flex gap-2 text-sm font-body text-navy leading-relaxed">
                      <span style={{ color }} className="flex-shrink-0">→</span>
                      <span className="italic">{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's coming */}
            <div className="card p-4 mb-6">
              <div className="text-xs font-semibold font-body uppercase tracking-wider text-slate-400 mb-3">This lesson includes</div>
              <div className="grid grid-cols-2 gap-2">
                {STEPS.filter(s => s !== 'concept').map(s => {
                  const m = STEP_META[s];
                  return (
                    <div key={s} className="flex items-center gap-2 text-sm font-body text-slate-600">
                      <span>{m?.icon}</span><span>{m?.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <ContinueBtn label={`Start Vocabulary (${lesson.vocab?.length || 0} words) →`} />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ VOCAB ════ */}
        {step === 'vocab' && (
          <div className="animate-fade-in">
            <SectionHeader icon="🗂️" title="Vocabulary"
              subtitle={`${lesson.vocab.length} words to learn`} color={color} />
            {lesson.vocab.map((item, i) => (
              <VocabCard key={i} item={item} lang={lang} color={color} />
            ))}
            <ContinueBtn label={STEPS[stepIdx + 1] === 'dialogue' ? '💬 Continue to Dialogue →' : 'Start Practice →'} />
          </div>
        )}

        {/* ═════════════════════════════════════════════════ DIALOGUE ══════ */}
        {step === 'dialogue' && lesson.dialogue && (
          <div className="animate-fade-in">
            <SectionHeader icon="💬" title={lesson.dialogue.title}
              subtitle={lesson.dialogue.context} color={color} />

            {/* Translate-all toggle */}
            {lesson.dialogue.lines.some(l => l.translation) && (
              <TranslateAllDialogue
                lines={lesson.dialogue.lines}
                color={color}
                keyPhrases={lesson.dialogue.keyPhrases}
                onNext={goNext}
                nextLabel={STEPS[stepIdx + 1] === 'exercises' ? 'Start Practice →' : 'Continue →'}
              />
            )}
            {!lesson.dialogue.lines.some(l => l.translation) && (
              <div>
                <div className="card p-5 mb-4 space-y-4">
                  {lesson.dialogue.lines.map((line, i) => (
                    <DialogueLine key={i} line={line} isA={i % 2 === 0} color={color} />
                  ))}
                </div>
                {lesson.dialogue.keyPhrases?.length > 0 && <KeyPhrasesCard phrases={lesson.dialogue.keyPhrases} color={color} />}
                <ContinueBtn label={STEPS[stepIdx + 1] === 'exercises' ? 'Start Practice →' : 'Continue →'} />
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════ EXERCISES ════ */}
        {step === 'exercises' && (
          <div className="animate-fade-in">
            <SectionHeader icon="✏️" title="Practice"
              subtitle={`Question ${exIdx + 1} of ${lesson.exercises.length} · Score: ${score}`}
              color={color} />

            {/* Micro progress bar */}
            <div className="h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round((exIdx / lesson.exercises.length) * 100)}%`, background: color }} />
            </div>

            {lesson.exercises[exIdx]?.type === 'fill' ? (
              <FillBlanksExercise key={exIdx} exercise={lesson.exercises[exIdx]} color={color} onResult={handleExerciseResult} />
            ) : (
              <MCQExercise key={exIdx} exercise={lesson.exercises[exIdx]} color={color} onResult={handleExerciseResult} />
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ SPEAKING ════ */}
        {step === 'speaking' && lesson.speaking && (
          <div className="animate-fade-in">
            <SectionHeader icon="🎙️" title="Speaking Task"
              subtitle={`${lesson.speaking.clbLevel} · ${lesson.speaking.timeLimit}`} color={color} />

            <div className="rounded-3xl p-6 mb-5 text-white shadow-lift"
              style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}AA 100%)` }}>
              <div className="text-xs font-semibold tracking-widest uppercase opacity-75 mb-3 font-body">Your Prompt</div>
              <p className="text-base leading-relaxed font-body">{lesson.speaking.prompt}</p>
            </div>

            {lesson.speaking.sampleOpener && (
              <div className="card p-5 mb-4" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
                <div className="text-xs font-semibold font-body uppercase tracking-wider text-green-700 mb-2.5">💡 Sample Opener</div>
                <p className="text-sm font-body text-green-900 italic leading-relaxed">"{lesson.speaking.sampleOpener}"</p>
              </div>
            )}

            <div className="card p-5 mb-6">
              <div className="text-xs font-semibold font-body uppercase tracking-wider text-slate-400 mb-4">Examiner Tips</div>
              <div className="space-y-2.5">
                {lesson.speaking.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start text-sm font-body text-slate-700">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: color + '18', color }}>✓</div>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <ContinueBtn label={STEPS[stepIdx + 1] === 'writing' ? '✍️ Continue to Writing →' : 'Complete Lesson 🎉'} />
          </div>
        )}

        {/* ════════════════════════════════════════════════════ WRITING ════ */}
        {step === 'writing' && lesson.writing && (
          <div className="animate-fade-in">
            <SectionHeader icon="✍️" title="Writing Task"
              subtitle={`${lesson.writing.clbLevel} · ${lesson.writing.wordCount}`} color={color} />

            <div className="rounded-3xl p-6 mb-5 text-white shadow-lift"
              style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}AA 100%)` }}>
              <div className="text-xs font-semibold tracking-widest uppercase opacity-75 mb-3 font-body">Your Prompt</div>
              <p className="text-base leading-relaxed font-body">{lesson.writing.prompt}</p>
            </div>

            {lesson.writing.structure?.length > 0 && (
              <div className="card p-5 mb-4">
                <div className="text-xs font-semibold font-body uppercase tracking-wider text-slate-400 mb-4">📐 Structure Guide</div>
                <div className="space-y-3">
                  {lesson.writing.structure.map((s, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 text-white"
                        style={{ background: color }}>{i + 1}</div>
                      <div>
                        <div className="text-xs font-bold font-body mb-0.5" style={{ color }}>{s.part}</div>
                        <p className="text-sm font-body text-slate-600 leading-relaxed">{s.instruction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.writing.usefulExpressions?.length > 0 && (
              <div className="card p-5 mb-6" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
                <div className="text-xs font-semibold font-body uppercase tracking-wider text-yellow-700 mb-3">🗣️ Useful Expressions</div>
                <div className="space-y-2">
                  {lesson.writing.usefulExpressions.map((expr, i) => (
                    <div key={i} className="flex gap-2 text-sm font-body text-slate-700 py-1.5 border-b border-yellow-100 last:border-0">
                      <span className="text-yellow-500 flex-shrink-0">→</span>
                      <span className="italic">{expr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ContinueBtn label="Complete Lesson 🎉" onClick={() => {
              if (!state.completed?.[lesson.id]) { addXP(lesson.xp); markComplete(lesson.id); }
              setCompleted(true);
            }} />
          </div>
        )}

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TranslateAllDialogue — dialogue with global translate toggle
// ─────────────────────────────────────────────────────────────────────────────
function TranslateAllDialogue({ lines, color, keyPhrases, onNext, nextLabel }) {
  const [showAll, setShowAll] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs font-body text-slate-500">Tap <strong>EN</strong> on any line, or translate all at once</p>
        <button onClick={() => setShowAll(v => !v)}
          className="text-xs font-body font-semibold px-3 py-1.5 rounded-full border transition-all flex-shrink-0"
          style={{ borderColor: showAll ? color : '#E2E8F0', color: showAll ? color : '#64748B', background: showAll ? color + '10' : 'white' }}>
          {showAll ? '🇫🇷 Show French' : '🇬🇧 Translate All'}
        </button>
      </div>
      <div className="card p-5 mb-4 space-y-4">
        {lines.map((line, i) =>
          showAll ? (
            <div key={i} className={`flex gap-3 items-start ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: i % 2 === 0 ? color : '#64748B' }}>{line.speaker[0]}</div>
              <div className={`rounded-2xl px-4 py-3 ${i % 2 === 0 ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
                style={{ maxWidth: '78%', background: i % 2 === 0 ? color + '12' : '#F1F5F9' }}>
                <div className="text-xs font-semibold font-body mb-1" style={{ color: i % 2 === 0 ? color : '#64748B' }}>{line.speaker}</div>
                {line.translation && <p className="text-sm font-body text-slate-800 leading-relaxed mb-1">{line.translation}</p>}
                <p className="text-xs font-body text-slate-400 italic leading-snug">{line.text}</p>
              </div>
            </div>
          ) : (
            <DialogueLine key={i} line={line} isA={i % 2 === 0} color={color} />
          )
        )}
      </div>
      {keyPhrases?.length > 0 && <KeyPhrasesCard phrases={keyPhrases} color={color} />}
      <button onClick={onNext}
        className="w-full py-4 rounded-2xl font-display font-bold text-sm text-white shadow-lift hover:opacity-90 transition-opacity mt-2"
        style={{ background: color }}>
        {nextLabel}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KeyPhrasesCard
// ─────────────────────────────────────────────────────────────────────────────
function KeyPhrasesCard({ phrases, color }) {
  return (
    <div className="card p-5 mb-4" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
      <div className="text-xs font-semibold font-body uppercase tracking-wider text-yellow-700 mb-3">🔑 Key Phrases</div>
      <div className="divide-y divide-yellow-100">
        {phrases.map((kp, i) => (
          <div key={i} className="flex justify-between items-center py-2.5 gap-3">
            <span className="text-sm font-body font-semibold text-slate-800 italic">{kp.fr}</span>
            <span className="text-sm font-body text-slate-500 text-right flex-shrink-0">{kp.en}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

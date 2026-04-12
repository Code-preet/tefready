'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProgressBar from '../../../../components/ProgressBar';
import { useApp } from '../../../../components/AppProvider';
import { T } from '../../../../lib/i18n';
import { LESSONS, MODULES } from '../../../../lib/data';

const MODULE_COLORS = { A1:'#7C3AED', A2:'#0D9488', B1:'#D97706', B2:'#DC2626', TEF:'#BE185D' };
const MODULE_BGS    = { A1:'#F5F3FF', A2:'#F0FDFA', B1:'#FFFBEB', B2:'#FEF2F2', TEF:'#FDF2F8' };

function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// ── Vocab Card ──────────────────────────────────────────────────────────────
function VocabCard({ item, lang, lt, color }) {
  const [speaking, setSpeaking] = useState(false);
  const handleSpeak = () => {
    speak(item.fr);
    setSpeaking(true);
    setTimeout(() => setSpeaking(false), 1200);
  };
  return (
    <div className="card p-4 mb-3 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-display font-bold text-navy text-xl leading-tight">{item.fr}</div>
          {item.ph && <div className="text-sm text-slate-400 font-body italic mt-0.5">/{item.ph}/</div>}
        </div>
        <button onClick={handleSpeak}
          className={`ml-3 flex-shrink-0 text-sm px-3 py-1.5 rounded-full font-body font-semibold transition-all ${
            speaking ? 'scale-110' : ''
          }`}
          style={{ background: color + '18', color }}>
          {lt.listen}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3" style={{ background: '#EFF6FF' }}>
          <div className="text-xs font-semibold text-blue-400 font-body mb-1 uppercase tracking-wider">EN</div>
          <div className="text-sm text-blue-900 font-body">{item.en}</div>
        </div>
        {lang !== 'en' && (
          <div className="rounded-xl p-3" style={{ background: '#F0FDF4' }}>
            <div className="text-xs font-semibold text-green-500 font-body mb-1 uppercase tracking-wider">{lang.toUpperCase()}</div>
            <div className="text-sm text-green-900 font-body">{item[lang] || item.en}</div>
          </div>
        )}
        {lang === 'en' && (item.ph || item.example) && (
          <div className="rounded-xl p-3" style={{ background: '#FFFBEB' }}>
            <div className="text-xs font-semibold text-yellow-600 font-body mb-1">{item.ph ? 'PHONETIC' : 'EXAMPLE'}</div>
            <div className="text-sm text-yellow-900 font-body">{item.ph || item.example}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MCQ Exercise ─────────────────────────────────────────────────────────────
function MCQExercise({ exercise, lang, lt, color, onResult }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const correct = checked && selected === exercise.answer;
  const question = exercise.question;

  return (
    <div className="animate-slide-up">
      <p className="font-display font-semibold text-navy text-lg mb-5 leading-snug">{question}</p>
      <div className="space-y-2.5 mb-5">
        {exercise.options.map((opt, i) => {
          let style = {};
          let cls = 'w-full text-left px-5 py-3.5 rounded-2xl text-sm font-body transition-all border-2 ';
          if (!checked) {
            if (selected === i) {
              cls += 'border-current font-semibold';
              style = { borderColor: color, background: color + '12', color: color };
            } else {
              cls += 'border-slate-200 text-slate-700 bg-white hover:border-slate-300 hover:bg-slate-50';
            }
          } else {
            if (i === exercise.answer) {
              cls += 'font-semibold';
              style = { borderColor: '#16A34A', background: '#F0FDF4', color: '#15803D' };
            } else if (selected === i && selected !== exercise.answer) {
              style = { borderColor: '#DC2626', background: '#FEF2F2', color: '#B91C1C' };
              cls += 'font-semibold';
            } else {
              cls += 'border-slate-100 text-slate-400 bg-white';
            }
          }
          return (
            <button key={i} className={cls} style={style}
              onClick={() => !checked && setSelected(i)}>
              <span className="mr-3 opacity-50 font-display font-bold">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {!checked ? (
        <button
          disabled={selected === null}
          onClick={() => selected !== null && setChecked(true)}
          className={`w-full py-4 rounded-2xl font-display font-bold text-sm transition-all ${
            selected !== null ? 'text-white shadow-lift' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          style={selected !== null ? { background: color } : {}}>
          {lt.check}
        </button>
      ) : (
        <div>
          <div className={`rounded-xl px-5 py-3 mb-3 font-body font-semibold text-sm flex items-center gap-2 ${
            correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {correct ? lt.correct : lt.wrong}
          </div>
          <button onClick={() => onResult(correct)}
            className="w-full py-4 rounded-2xl font-display font-bold text-sm text-white shadow-lift transition-all hover:opacity-90"
            style={{ background: color }}>
            {lt.next}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Complete Screen ──────────────────────────────────────────────────────────
function CompleteScreen({ lesson, score, total, lang, lt, color, moduleId }) {
  const pct = Math.round(score / total * 100);
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-5">
      <div className="card max-w-sm w-full p-8 text-center animate-pop-in">
        <div className="text-6xl mb-4" style={{ animation: 'celebrate 0.6s ease-in-out' }}>🎉</div>
        <h2 className="font-display font-bold text-navy text-2xl mb-2">{lt.lessonDone}</h2>
        <p className="text-slate-500 font-body mb-6">
          {lt.earned} <strong className="text-navy">+{lesson.xp} XP</strong>
        </p>
        <div className="rounded-2xl p-5 mb-6" style={{ background: color + '0F', border: `1px solid ${color}30` }}>
          <div className="text-xs font-semibold font-body uppercase tracking-wider mb-2" style={{ color }}>
            {lt.score}
          </div>
          <div className="font-display font-bold text-3xl text-navy mb-3">{score}/{total}</div>
          <ProgressBar pct={pct} color={color} height={8} />
          <div className="text-sm text-slate-500 font-body mt-2">{pct}% correct</div>
        </div>
        <Link href={`/learn/${moduleId}`}
          className="block w-full py-4 rounded-2xl font-display font-bold text-sm text-white text-center no-underline hover:opacity-90 transition-opacity"
          style={{ background: color }}>
          {lt.backToModule}
        </Link>
      </div>
    </div>
  );
}

// ── Main Lesson Page ─────────────────────────────────────────────────────────
export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const router = useRouter();
  const { state, addXP, markComplete } = useApp();

  // ALL hooks must be called before any conditional returns (React rules)
  const [step, setStep] = useState('concept');
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!state) return null;
  const lang = state?.lang || 'en';
  const lt = T[lang]?.lesson || T.en.lesson;

  const lesson = LESSONS[lessonId];
  const color = MODULE_COLORS[moduleId] || '#0A2540';
  const STEPS = ['concept', 'vocab', 'exercises'];

  if (!lesson) return (
    <div className="p-8 text-center">
      <p className="text-slate-500 font-body">Lesson not found.</p>
      <Link href="/learn" className="text-navy underline mt-2 block">Back to Learn</Link>
    </div>
  );

  if (completed) {
    return <CompleteScreen lesson={lesson} score={score} total={lesson.exercises.length}
      lang={lang} lt={lt} color={color} moduleId={moduleId} />;
  }

  const stepIdx = STEPS.indexOf(step);
  const progressPct = Math.round((stepIdx / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-ivory font-body">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-5 py-3">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => step === 'concept' ? router.push(`/learn/${moduleId}`) : setStep(STEPS[stepIdx - 1])}
              className="text-sm text-slate-500 hover:text-navy font-body transition-colors flex-shrink-0">
              {lt.back}
            </button>
            <div className="flex-1 text-center font-display font-semibold text-navy text-sm truncate px-2">
              {lesson.icon || '📖'} {lesson.title[lang] || lesson.title.en}
            </div>
            <div className="text-xs font-semibold flex-shrink-0" style={{ color }}>+{lesson.xp} XP</div>
          </div>
          <ProgressBar pct={progressPct} color={color} height={3} />
          <div className="flex justify-between mt-1.5">
            {STEPS.map((s, i) => (
              <span key={s} className={`text-xs font-body ${i <= stepIdx ? 'font-semibold' : 'text-slate-400'}`}
                style={i <= stepIdx ? { color } : {}}>
                {lt[s]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 py-6 pb-24">

        {/* ── CONCEPT ── */}
        {step === 'concept' && (
          <div className="animate-fade-in">
            <div className="rounded-3xl p-7 mb-6 text-white" style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}>
              <div className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-3 font-body">
                {lt.concept}
              </div>
              <p className="text-base leading-relaxed font-body">
                {lesson.grammar?.explanation || lesson.concept?.[lang] || lesson.concept?.en || ''}
              </p>
            </div>
            <button onClick={() => setStep('vocab')}
              className="w-full py-4 rounded-2xl font-display font-bold text-white text-sm hover:opacity-90 transition-opacity shadow-lift"
              style={{ background: color }}>
              {lt.startVocab}
            </button>
          </div>
        )}

        {/* ── VOCAB ── */}
        {step === 'vocab' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-navy text-lg">{lt.vocab}</h2>
              <span className="text-xs font-body text-slate-500 bg-slate-100 rounded-full px-3 py-1">
                {lesson.vocab.length} words
              </span>
            </div>
            {lesson.vocab.map((item, i) => (
              <VocabCard key={i} item={item} lang={lang} lt={lt} color={color} />
            ))}
            <button onClick={() => setStep('exercises')}
              className="w-full py-4 rounded-2xl font-display font-bold text-white text-sm hover:opacity-90 transition-opacity shadow-lift mt-2"
              style={{ background: color }}>
              {lt.startPractice}
            </button>
          </div>
        )}

        {/* ── EXERCISES ── */}
        {step === 'exercises' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold font-body uppercase tracking-wider text-slate-400">
                {lt.practice} {exerciseIdx + 1}/{lesson.exercises.length}
              </span>
              <span className="text-xs font-body text-slate-400">{lt.score}: {score}</span>
            </div>
            <ProgressBar pct={Math.round(exerciseIdx / lesson.exercises.length * 100)} color={color} height={4} />
            <div className="mt-6">
              <MCQExercise
                key={exerciseIdx}
                exercise={lesson.exercises[exerciseIdx]}
                lang={lang}
                lt={lt}
                color={color}
                onResult={(isCorrect) => {
                  const newScore = isCorrect ? score + 1 : score;
                  if (exerciseIdx < lesson.exercises.length - 1) {
                    setScore(newScore);
                    setExerciseIdx(exerciseIdx + 1);
                  } else {
                    // Complete
                    if (!state.completed?.[lesson.id]) {
                      addXP(lesson.xp);
                      markComplete(lesson.id);
                    }
                    setScore(newScore);
                    setCompleted(true);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

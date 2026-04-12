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

// ── Fill-in-the-Blanks Exercise ──────────────────────────────────────────────
function FillBlanksExercise({ exercise, lt, color, onResult }) {
  const [inputs, setInputs] = useState(exercise.blanks.map(() => ''));
  const [checked, setChecked] = useState(false);
  const results = exercise.blanks.map((b, i) => inputs[i].trim().toLowerCase() === b.toLowerCase());
  const allCorrect = results.every(Boolean);

  const handleCheck = () => setChecked(true);
  const handleNext = () => onResult(allCorrect);

  return (
    <div className="animate-slide-up">
      <div className="rounded-2xl p-4 mb-4" style={{ background: color + '0D', border: `1px solid ${color}25` }}>
        <div className="text-xs font-semibold font-body uppercase tracking-wider mb-2" style={{ color }}>💡 Hint: {exercise.hint}</div>
      </div>
      <p className="font-display font-semibold text-navy text-base mb-5 leading-relaxed">
        {exercise.sentence.split('___').map((part, i) => (
          <span key={i}>
            {part}
            {i < exercise.blanks.length && (
              <input
                type="text"
                value={inputs[i]}
                onChange={e => {
                  if (checked) return;
                  const next = [...inputs]; next[i] = e.target.value; setInputs(next);
                }}
                className="font-body text-sm px-2 py-1 rounded-lg border-2 mx-1 outline-none w-32"
                style={{
                  borderColor: !checked ? color : results[i] ? '#16A34A' : '#DC2626',
                  background: !checked ? 'white' : results[i] ? '#F0FDF4' : '#FEF2F2',
                  color: !checked ? '#0A2540' : results[i] ? '#15803D' : '#B91C1C',
                }}
                placeholder="..."
              />
            )}
          </span>
        ))}
      </p>
      {checked && (
        <div className="rounded-xl px-4 py-3 mb-3 font-body text-sm" style={{
          background: allCorrect ? '#F0FDF4' : '#FEF2F2',
          color: allCorrect ? '#15803D' : '#B91C1C'
        }}>
          {allCorrect ? '✓ Perfect!' : `Correct answers: ${exercise.blanks.join(', ')}`}
        </div>
      )}
      {!checked ? (
        <button disabled={inputs.some(v => !v.trim())} onClick={handleCheck}
          className={`w-full py-4 rounded-2xl font-display font-bold text-sm transition-all ${inputs.every(v => v.trim()) ? 'text-white shadow-lift' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          style={inputs.every(v => v.trim()) ? { background: color } : {}}>
          {lt.check}
        </button>
      ) : (
        <button onClick={handleNext}
          className="w-full py-4 rounded-2xl font-display font-bold text-sm text-white shadow-lift hover:opacity-90"
          style={{ background: color }}>
          {lt.next}
        </button>
      )}
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

// ── Dialogue Line (with translation toggle) ──────────────────────────────────
function DialogueLine({ line, isA, color }) {
  const [showTranslation, setShowTranslation] = useState(false);
  return (
    <div className={`flex gap-3 items-start ${isA ? '' : 'flex-row-reverse'}`}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-1"
        style={{ background: isA ? color : '#64748B' }}>
        {line.speaker[0]}
      </div>
      <div className={`flex-1 max-w-xs rounded-2xl px-4 py-3 ${isA ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
        style={{ background: isA ? color + '12' : '#F1F5F9' }}>
        <div className="flex justify-between items-center mb-1 gap-2">
          <span className="text-xs font-semibold font-body" style={{ color: isA ? color : '#64748B' }}>{line.speaker}</span>
          {line.translation && (
            <button onClick={() => setShowTranslation(v => !v)}
              className="text-xs font-body px-2 py-0.5 rounded-full flex-shrink-0 transition-all"
              style={{
                background: showTranslation ? color + '20' : 'rgba(0,0,0,0.06)',
                color: showTranslation ? color : '#94A3B8'
              }}>
              {showTranslation ? 'FR' : 'EN'}
            </button>
          )}
        </div>
        <p className="text-sm font-body text-slate-800 leading-relaxed">
          {showTranslation && line.translation ? line.translation : line.text}
        </p>
        {showTranslation && line.translation && (
          <p className="text-xs font-body text-slate-400 italic mt-1 leading-snug">{line.text}</p>
        )}
      </div>
    </div>
  );
}

// ── Dialogue Section ─────────────────────────────────────────────────────────
function DialogueSection({ dialogue, color, onNext, nextLabel }) {
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-1 gap-3">
        <div>
          <h2 className="font-display font-bold text-navy text-lg leading-tight">{dialogue.title}</h2>
          <p className="text-sm text-slate-500 font-body mt-0.5">{dialogue.context}</p>
        </div>
        {dialogue.lines.some(l => l.translation) && (
          <button onClick={() => setShowAllTranslations(v => !v)}
            className="flex-shrink-0 text-xs font-body font-semibold px-3 py-1.5 rounded-full border transition-all mt-1"
            style={{
              borderColor: showAllTranslations ? color : '#E2E8F0',
              color: showAllTranslations ? color : '#64748B',
              background: showAllTranslations ? color + '10' : 'white'
            }}>
            {showAllTranslations ? '🇫🇷 French' : '🇬🇧 Translate All'}
          </button>
        )}
      </div>

      {/* Tip bar */}
      <div className="rounded-xl px-4 py-2.5 mb-4 mt-3 flex gap-2 items-center" style={{ background: color + '0A' }}>
        <span className="text-sm">💡</span>
        <p className="text-xs font-body text-slate-600">Tap the <strong>EN</strong> button on any line to see its translation</p>
      </div>

      {/* Conversation */}
      <div className="card p-5 mb-4 space-y-4">
        {dialogue.lines.map((line, i) => (
          showAllTranslations
            ? (
              <div key={i} className={`flex gap-3 items-start ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-1"
                  style={{ background: i % 2 === 0 ? color : '#64748B' }}>
                  {line.speaker[0]}
                </div>
                <div className={`flex-1 max-w-xs rounded-2xl px-4 py-3 ${i % 2 === 0 ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
                  style={{ background: i % 2 === 0 ? color + '12' : '#F1F5F9' }}>
                  <div className="text-xs font-semibold font-body mb-1" style={{ color: i % 2 === 0 ? color : '#64748B' }}>{line.speaker}</div>
                  {line.translation && <p className="text-sm font-body text-slate-800 leading-relaxed mb-1">{line.translation}</p>}
                  <p className="text-xs font-body text-slate-400 italic leading-snug">{line.text}</p>
                </div>
              </div>
            )
            : <DialogueLine key={i} line={line} isA={i % 2 === 0} color={color} />
        ))}
      </div>

      {/* Key Phrases */}
      {dialogue.keyPhrases?.length > 0 && (
        <div className="card p-5 mb-5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <div className="text-xs font-semibold font-body uppercase tracking-wider text-yellow-700 mb-3">🔑 Key Phrases</div>
          <div className="space-y-0">
            {dialogue.keyPhrases.map((kp, i) => (
              <div key={i} className="flex justify-between items-start py-2 border-b border-yellow-100 last:border-0 gap-3">
                <span className="text-sm font-body font-semibold text-slate-800 italic">{kp.fr}</span>
                <span className="text-sm font-body text-slate-500 text-right flex-shrink-0">{kp.en}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onNext}
        className="w-full py-4 rounded-2xl font-display font-bold text-white text-sm hover:opacity-90 transition-opacity shadow-lift"
        style={{ background: color }}>
        {nextLabel}
      </button>
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
  // Build steps dynamically — only include sections the lesson actually has
  // Order: concept → vocab → dialogue → exercises → speaking → writing
  const STEPS = [
    'concept',
    'vocab',
    lesson?.dialogue  ? 'dialogue'  : null,
    'exercises',
    lesson?.speaking  ? 'speaking'  : null,
    lesson?.writing   ? 'writing'   : null,
  ].filter(Boolean);

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
            {STEPS.map((s, i) => {
              const labels = { concept: lt.concept || 'Concept', vocab: lt.vocab || 'Vocab', dialogue: '💬 Dialogue', speaking: '🎙️ Speaking', writing: '✍️ Writing', exercises: lt.practice || 'Practice' };
              return (
                <span key={s} className={`text-xs font-body ${i <= stepIdx ? 'font-semibold' : 'text-slate-400'}`}
                  style={i <= stepIdx ? { color } : {}}>
                  {labels[s] || s}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 py-6 pb-24">

        {/* ── CONCEPT ── */}
        {step === 'concept' && (
          <div className="animate-fade-in">
            {lesson.objective && (
              <div className="rounded-2xl px-5 py-4 mb-4 flex gap-3 items-start" style={{ background: color + '0D', border: `1px solid ${color}25` }}>
                <span className="text-lg flex-shrink-0">🎯</span>
                <div>
                  <div className="text-xs font-semibold font-body uppercase tracking-wider mb-1" style={{ color }}>Lesson Objective</div>
                  <p className="text-sm text-slate-700 font-body leading-relaxed">{lesson.objective}</p>
                </div>
              </div>
            )}
            <div className="rounded-3xl p-7 mb-4 text-white" style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}>
              <div className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-3 font-body">
                {lesson.grammar?.title || lt.concept}
              </div>
              <p className="text-base leading-relaxed font-body">
                {lesson.grammar?.explanation || lesson.concept?.[lang] || lesson.concept?.en || ''}
              </p>
            </div>
            {lesson.grammar?.points?.length > 0 && (
              <div className="card p-5 mb-4">
                <div className="text-xs font-semibold font-body uppercase tracking-wider text-slate-400 mb-3">Key Rules</div>
                <ul className="space-y-2">
                  {lesson.grammar.points.map((pt, i) => (
                    <li key={i} className="flex gap-2 text-sm font-body text-slate-700">
                      <span style={{ color }} className="font-bold flex-shrink-0">→</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {lesson.grammar?.examples?.length > 0 && (
              <div className="card p-5 mb-6" style={{ background: '#F8FAFF' }}>
                <div className="text-xs font-semibold font-body uppercase tracking-wider text-slate-400 mb-3">Examples</div>
                {lesson.grammar.examples.map((ex, i) => (
                  <div key={i} className="text-sm font-body text-navy italic mb-1.5">• {ex}</div>
                ))}
              </div>
            )}
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
            {(() => {
              const nextStep = STEPS[STEPS.indexOf('vocab') + 1];
              const nextLabel = nextStep === 'dialogue' ? '💬 Read Dialogue →' : nextStep === 'exercises' ? lt.startPractice : '→ Continue';
              return (
                <button onClick={() => setStep(nextStep)}
                  className="w-full py-4 rounded-2xl font-display font-bold text-white text-sm hover:opacity-90 transition-opacity shadow-lift mt-2"
                  style={{ background: color }}>
                  {nextLabel}
                </button>
              );
            })()}
          </div>
        )}

        {/* ── DIALOGUE ── */}
        {step === 'dialogue' && lesson.dialogue && (
          <DialogueSection
            dialogue={lesson.dialogue}
            color={color}
            onNext={() => setStep(STEPS[STEPS.indexOf('dialogue') + 1])}
            nextLabel={STEPS[STEPS.indexOf('dialogue') + 1] === 'exercises' ? lt.startPractice : '→ Continue'}
          />
        )}

        {/* ── SPEAKING ── */}
        {step === 'speaking' && lesson.speaking && (
          <div className="animate-fade-in">
            <div className="rounded-3xl p-6 mb-5 text-white" style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)` }}>
              <div className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-2 font-body">🎙️ TEF Speaking Task · {lesson.speaking.clbLevel} · {lesson.speaking.timeLimit}</div>
              <p className="text-base leading-relaxed font-body font-semibold">{lesson.speaking.prompt}</p>
            </div>
            {lesson.speaking.sampleOpener && (
              <div className="card p-5 mb-4" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                <div className="text-xs font-semibold font-body uppercase tracking-wider text-green-700 mb-2">💡 Sample Opener</div>
                <p className="text-sm font-body text-green-900 italic leading-relaxed">"{lesson.speaking.sampleOpener}"</p>
              </div>
            )}
            <div className="card p-5 mb-5">
              <div className="text-xs font-semibold font-body uppercase tracking-wider text-slate-400 mb-3">Examiner Tips</div>
              <ul className="space-y-2">
                {lesson.speaking.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm font-body text-slate-700">
                    <span className="font-bold flex-shrink-0" style={{ color }}>✓</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
            {(() => {
              const nextStep = STEPS[STEPS.indexOf('speaking') + 1];
              return (
                <button onClick={() => nextStep ? setStep(nextStep) : setCompleted(true)}
                  className="w-full py-4 rounded-2xl font-display font-bold text-white text-sm hover:opacity-90 transition-opacity shadow-lift"
                  style={{ background: color }}>
                  {nextStep === 'writing' ? '✍️ Writing Task →' : nextStep ? '→ Continue' : lt.finish || 'Finish Lesson'}
                </button>
              );
            })()}
          </div>
        )}

        {/* ── WRITING ── */}
        {step === 'writing' && lesson.writing && (
          <div className="animate-fade-in">
            <div className="rounded-3xl p-6 mb-5 text-white" style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)` }}>
              <div className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-2 font-body">✍️ TEF Writing Task · {lesson.writing.clbLevel} · {lesson.writing.wordCount}</div>
              <p className="text-base leading-relaxed font-body font-semibold">{lesson.writing.prompt}</p>
            </div>
            {lesson.writing.structure?.length > 0 && (
              <div className="card p-5 mb-4">
                <div className="text-xs font-semibold font-body uppercase tracking-wider text-slate-400 mb-3">📐 Structure Guide</div>
                <div className="space-y-3">
                  {lesson.writing.structure.map((s, i) => (
                    <div key={i} className="rounded-xl p-3" style={{ background: color + '08', border: `1px solid ${color}20` }}>
                      <div className="text-xs font-bold font-body mb-1" style={{ color }}>{s.part}</div>
                      <p className="text-sm font-body text-slate-700">{s.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {lesson.writing.usefulExpressions?.length > 0 && (
              <div className="card p-5 mb-5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <div className="text-xs font-semibold font-body uppercase tracking-wider text-yellow-700 mb-3">🗣️ Useful Expressions</div>
                {lesson.writing.usefulExpressions.map((expr, i) => (
                  <div key={i} className="text-sm font-body text-slate-700 py-1 border-b border-yellow-100 last:border-0 italic">{expr}</div>
                ))}
              </div>
            )}
            {(() => {
              const writingIdx = STEPS.indexOf('writing');
              const nextStep = STEPS[writingIdx + 1];
              return (
                <button
                  onClick={() => {
                    if (nextStep) { setStep(nextStep); }
                    else {
                      if (!state.completed?.[lesson.id]) { addXP(lesson.xp); markComplete(lesson.id); }
                      setCompleted(true);
                    }
                  }}
                  className="w-full py-4 rounded-2xl font-display font-bold text-white text-sm hover:opacity-90 transition-opacity shadow-lift"
                  style={{ background: color }}>
                  {nextStep ? '→ Continue' : lt.finish || '🎉 Complete Lesson'}
                </button>
              );
            })()}
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
              {lesson.exercises[exerciseIdx]?.type === 'fill' ? (
                <FillBlanksExercise
                  key={exerciseIdx}
                  exercise={lesson.exercises[exerciseIdx]}
                  lt={lt}
                  color={color}
                  onResult={(isCorrect) => {
                    const newScore = isCorrect ? score + 1 : score;
                    if (exerciseIdx < lesson.exercises.length - 1) {
                      setScore(newScore); setExerciseIdx(exerciseIdx + 1);
                    } else {
                      if (!state.completed?.[lesson.id]) { addXP(lesson.xp); markComplete(lesson.id); }
                      setScore(newScore); setCompleted(true);
                    }
                  }}
                />
              ) : (
                <MCQExercise
                  key={exerciseIdx}
                  exercise={lesson.exercises[exerciseIdx]}
                  lang={lang}
                  lt={lt}
                  color={color}
                  onResult={(isCorrect) => {
                    const newScore = isCorrect ? score + 1 : score;
                    if (exerciseIdx < lesson.exercises.length - 1) {
                      setScore(newScore); setExerciseIdx(exerciseIdx + 1);
                    } else {
                      if (!state.completed?.[lesson.id]) { addXP(lesson.xp); markComplete(lesson.id); }
                      setScore(newScore); setCompleted(true);
                    }
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

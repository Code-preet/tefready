'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Nav from '../../../../components/Nav';
import { useApp } from '../../../../components/AppProvider';
import { T } from '../../../../lib/i18n';
import { readingTest } from '../../../../lib/readingData';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({ score, total, answers, passages, onRetake }) {
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 60;

  const CLB =
    pct >= 85 ? { level:'CLB 9+', color:'#7C3AED', bg:'#EDE9FE', label:'Near-Native' }
    : pct >= 72 ? { level:'CLB 8',  color:'#16A34A', bg:'#DCFCE7', label:'Strong Proficiency' }
    : pct >= 60 ? { level:'CLB 7',  color:'#D97706', bg:'#FEF9C3', label:'Immigration Ready ✓' }
    : pct >= 45 ? { level:'CLB 6',  color:'#EA580C', bg:'#FFF7ED', label:'Intermediate' }
    :             { level:'CLB 5',  color:'#DC2626', bg:'#FEF2F2', label:'Basic' };

  // Save score
  useEffect(() => {
    try { localStorage.setItem('tefReadingScore', JSON.stringify(score)); } catch {}
  }, [score]);

  return (
    <div className="page-shell" style={{ background:'#EFF6FF' }}>
      <main className="page-content">
        <div className="animate-pop-in">

          {/* Result card */}
          <div className="card p-6 text-center mb-5">
            <div className="text-5xl mb-3">{pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '📚'}</div>
            <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color:'#1E3A8A' }}>
              {pct >= 70 ? 'Excellent travail !' : pct >= 50 ? 'Bon effort !' : 'Continue à pratiquer !'}
            </h1>
            <p className="text-slate-500 text-sm font-body mb-5">Compréhension de l'écrit — Résultats</p>

            {/* Score ring */}
            <div className="flex items-center justify-center gap-6 mb-5">
              <div className="text-center">
                <div className="font-display font-extrabold text-5xl" style={{ color: CLB.color }}>{score}</div>
                <div className="text-slate-400 text-xs mt-1">out of {total}</div>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center">
                <div className="font-display font-extrabold text-5xl" style={{ color: CLB.color }}>{pct}%</div>
                <div className="text-slate-400 text-xs mt-1">accuracy</div>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center rounded-2xl px-4 py-2" style={{ background: CLB.bg }}>
                <div className="font-display font-extrabold text-xl" style={{ color: CLB.color }}>{CLB.level}</div>
                <div className="text-xs mt-0.5 font-semibold" style={{ color: CLB.color }}>{CLB.label}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-track mb-4">
              <div className="progress-fill" style={{ width:`${pct}%`, background: CLB.color }} />
            </div>
            <p className="text-sm text-slate-500 font-body">
              {pct >= 70 ? 'You are on track for CLB 7+! Keep practising.' : pct >= 50 ? 'Getting closer to CLB 7. Review the passages you missed.' : 'Review the vocabulary and try again. CLB 7 needs 70%+.'}
            </p>
          </div>

          {/* Per-passage breakdown */}
          <h2 className="font-display font-bold text-base mb-3" style={{ color:'#1E3A8A' }}>Detailed Review</h2>
          {passages.map(p => {
            const passageAnswers = answers[p.id] || {};
            const correct = p.questions.filter(q => passageAnswers[q.id] === q.answer).length;
            return (
              <div key={p.id} className="card mb-3 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor:'#DBEAFE' }}>
                  <div>
                    <p className="font-display font-bold text-sm" style={{ color:'#1E3A8A' }}>{p.title}</p>
                    <p className="text-xs text-slate-400 font-body mt-0.5">Texte {p.number} · {p.clbLevel}</p>
                  </div>
                  <div className="rounded-2xl px-3 py-1.5 font-bold text-sm"
                    style={{ background: correct === p.questions.length ? '#DCFCE7' : correct >= p.questions.length * 0.6 ? '#FEF9C3' : '#FEF2F2',
                             color:      correct === p.questions.length ? '#15803D' : correct >= p.questions.length * 0.6 ? '#B45309' : '#B91C1C' }}>
                    {correct}/{p.questions.length}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {p.questions.map((q, qi) => {
                    const given = passageAnswers[q.id];
                    const isRight = given === q.answer;
                    return (
                      <div key={q.id} className="rounded-2xl p-3"
                        style={{ background: isRight ? '#F0FDF4' : '#FFF7ED', border:`1px solid ${isRight ? '#BBF7D0' : '#FED7AA'}` }}>
                        <div className="flex items-start gap-2 mb-1.5">
                          <span className="text-sm">{isRight ? '✅' : '❌'}</span>
                          <p className="text-sm font-semibold text-slate-700 leading-snug">{q.question}</p>
                        </div>
                        {!isRight && given != null && (
                          <p className="text-xs text-red-600 font-body ml-6 mb-1">
                            Your answer: <span className="font-semibold">{q.options[given]}</span>
                          </p>
                        )}
                        <p className="text-xs font-body ml-6"
                          style={{ color: isRight ? '#15803D' : '#92400E' }}>
                          {isRight ? '✓ Correct' : `Correct: ${q.options[q.answer]}`}
                        </p>
                        <p className="text-xs text-slate-500 font-body ml-6 mt-1 leading-relaxed italic">
                          {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={onRetake} className="btn-secondary text-sm">🔄 Retake Test</button>
            <Link href="/tef/exam" className="btn-primary text-sm no-underline text-center flex items-center justify-center gap-2">
              🏆 Exam Hub
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

// ── Main Reading Exam ─────────────────────────────────────────────────────────
export default function ReadingExamPage() {
  const { state } = useApp();
  const lang = state?.lang || 'en';
  const navT = T[lang]?.nav || T.en.nav;

  const [phase, setPhase] = useState('intro');   // intro | exam | results
  const [passageIdx, setPassageIdx] = useState(0);
  const [answers, setAnswers] = useState({});     // { passageId: { questionId: answerIdx } }
  const [timeLeft, setTimeLeft] = useState(readingTest.totalTime);
  const [showResults, setShowResults] = useState(false);
  const timerRef = useRef(null);

  const passages = readingTest.passages;
  const currentPassage = passages[passageIdx];
  const totalQuestions = passages.reduce((s, p) => s + p.questions.length, 0);

  // Timer
  useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); finishExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const finishExam = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase('results');
  }, []);

  const handleAnswer = (passageId, questionId, idx) => {
    setAnswers(prev => ({
      ...prev,
      [passageId]: { ...(prev[passageId] || {}), [questionId]: idx }
    }));
  };

  const handleRetake = () => {
    setAnswers({});
    setPassageIdx(0);
    setTimeLeft(readingTest.totalTime);
    setPhase('intro');
  };

  // Calculate score for results
  const score = passages.reduce((sum, p) =>
    sum + p.questions.filter(q => (answers[p.id] || {})[q.id] === q.answer).length, 0);

  const answeredCount = Object.values(answers).reduce((s, pa) => s + Object.keys(pa).length, 0);
  const timerUrgent = timeLeft < 5 * 60;

  if (phase === 'results') {
    return <ResultsScreen score={score} total={totalQuestions} answers={answers} passages={passages} onRetake={handleRetake} />;
  }

  if (phase === 'intro') {
    return (
      <div className="page-shell">
        <Nav navT={navT} />
        <main className="page-content animate-fade-in">

          <div className="rounded-4xl p-7 mb-5 text-white overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #0369A1 0%, #0891B2 100%)' }}>
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10"
              style={{ background:'radial-gradient(circle,#fff,transparent)' }} />
            <div className="text-4xl mb-3">📖</div>
            <h1 className="font-display font-extrabold text-2xl text-white mb-1">Compréhension de l'écrit</h1>
            <p className="text-cyan-100 text-sm">Reading Comprehension — TEF Canada</p>
          </div>

          <div className="card p-5 mb-4">
            <h2 className="font-display font-bold text-base mb-3" style={{ color:'#1E3A8A' }}>Instructions</h2>
            <div className="space-y-2 text-sm text-slate-600 font-body leading-relaxed">
              <p>📖 You will read <strong>3 texts</strong> on different Canadian topics.</p>
              <p>❓ Answer <strong>{totalQuestions} multiple-choice questions</strong> based on each text.</p>
              <p>⏱ Total time: <strong>50 minutes</strong>. The timer starts when you click Begin.</p>
              <p>💡 The answer is always found in the text — do not use outside knowledge.</p>
              <p>✅ You can go back and change answers before submitting.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label:'Texts', value:'3', icon:'📄', bg:'#E0F2FE', col:'#0E7490' },
              { label:'Questions', value:`${totalQuestions}`, icon:'❓', bg:'#DBEAFE', col:'#1D4ED8' },
              { label:'Time Limit', value:'50 min', icon:'⏱', bg:'#FEF9C3', col:'#B45309' },
            ].map((s,i) => (
              <div key={i} className="rounded-3xl p-4 text-center" style={{ background:s.bg, border:`1.5px solid ${s.col}22` }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-display font-extrabold text-lg" style={{ color:s.col }}>{s.value}</div>
                <div className="text-xs font-semibold mt-0.5" style={{ color:s.col+'aa' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <button onClick={() => setPhase('exam')}
            className="btn-primary w-full text-base py-4"
            style={{ background:'linear-gradient(135deg, #0369A1, #0891B2)', boxShadow:'0 4px 16px rgba(8,145,178,0.4)' }}>
            📖 Begin Reading Test →
          </button>

          <p className="text-center text-xs text-slate-400 mt-3 font-body">
            The timer will start immediately after clicking Begin.
          </p>
        </main>
      </div>
    );
  }

  // ── Exam View ───────────────────────────────────────────────────────────────
  return (
    <div className="page-shell">
      {/* Sticky timer bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-11"
        style={{ background: timerUrgent ? '#FEF2F2' : 'rgba(255,255,255,0.96)', backdropFilter:'blur(12px)', borderBottom:`1.5px solid ${timerUrgent ? '#FECACA' : '#DBEAFE'}`, boxShadow:'0 1px 8px rgba(37,99,235,0.07)' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-display font-bold" style={{ color:'#1E3A8A' }}>Reading</span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 font-body">Texte {passageIdx + 1}/{passages.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-body">{answeredCount}/{totalQuestions} answered</span>
          <div className={`font-display font-bold text-base px-3 py-1 rounded-xl ${timerUrgent ? 'animate-pulse' : ''}`}
            style={{ color: timerUrgent ? '#DC2626' : '#1D4ED8', background: timerUrgent ? '#FEF2F2' : '#EFF6FF', border:`1.5px solid ${timerUrgent ? '#FECACA' : '#BFDBFE'}` }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <main style={{ paddingTop:'3rem' }}>
        <div className="max-w-2xl mx-auto px-4 pb-32">

          {/* Passage tabs */}
          <div className="flex gap-2 py-4 overflow-x-auto">
            {passages.map((p, i) => {
              const passageAnswered = Object.keys(answers[p.id] || {}).length;
              const isActive = i === passageIdx;
              return (
                <button key={p.id} onClick={() => setPassageIdx(i)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: isActive ? '#0891B2' : passageAnswered === p.questions.length ? '#F0FDF4' : '#f8fafc',
                    color: isActive ? 'white' : passageAnswered === p.questions.length ? '#15803D' : '#64748b',
                    border: isActive ? 'none' : `1.5px solid ${passageAnswered === p.questions.length ? '#BBF7D0' : '#e2e8f0'}`,
                  }}>
                  {passageAnswered === p.questions.length ? '✓ ' : ''}Texte {i + 1}
                </button>
              );
            })}
          </div>

          {/* Text header */}
          <div className="rounded-3xl p-4 mb-4"
            style={{ background:'#E0F2FE', border:'1.5px solid #BAE6FD' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wide">Texte {currentPassage.number}</span>
              <span className="badge badge-blue">{currentPassage.clbLevel}</span>
            </div>
            <h2 className="font-display font-bold text-base leading-snug" style={{ color:'#0E7490' }}>
              {currentPassage.title}
            </h2>
          </div>

          {/* Passage text */}
          <div className="card p-5 mb-5">
            <p className="text-sm text-slate-700 font-body leading-loose whitespace-pre-line"
              style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'0.925rem', lineHeight:'1.85' }}>
              {currentPassage.text}
            </p>
          </div>

          {/* Questions */}
          <h3 className="font-display font-bold text-base mb-3" style={{ color:'#1E3A8A' }}>Questions</h3>
          <div className="space-y-4">
            {currentPassage.questions.map((q, qi) => {
              const selected = (answers[currentPassage.id] || {})[q.id];
              return (
                <div key={q.id} className="card p-4">
                  <p className="font-semibold text-sm text-slate-800 leading-snug mb-3 font-body">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold mr-2">{qi + 1}</span>
                    {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const isSelected = selected === oi;
                      return (
                        <button key={oi} onClick={() => handleAnswer(currentPassage.id, q.id, oi)}
                          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-body transition-all active:scale-98"
                          style={{
                            background: isSelected ? '#DBEAFE' : '#f8fafc',
                            border: `1.5px solid ${isSelected ? '#2563EB' : '#e2e8f0'}`,
                            color: isSelected ? '#1D4ED8' : '#374151',
                            fontWeight: isSelected ? 600 : 400,
                          }}>
                          <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: isSelected ? '#2563EB' : '#e2e8f0', color: isSelected ? 'white' : '#64748b' }}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {passageIdx > 0 && (
              <button onClick={() => setPassageIdx(passageIdx - 1)} className="btn-secondary flex-1">
                ← Texte {passageIdx}
              </button>
            )}
            {passageIdx < passages.length - 1 ? (
              <button onClick={() => setPassageIdx(passageIdx + 1)} className="btn-primary flex-1">
                Texte {passageIdx + 2} →
              </button>
            ) : (
              <button onClick={finishExam}
                className="btn-primary flex-1"
                style={{ background: answeredCount === totalQuestions ? 'linear-gradient(135deg,#15803D,#16A34A)' : undefined }}>
                {answeredCount === totalQuestions ? '✅ Submit Test' : `Submit (${answeredCount}/${totalQuestions} answered)`}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

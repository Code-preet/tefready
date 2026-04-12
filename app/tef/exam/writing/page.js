'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Nav from '../../../../components/Nav';
import { useApp } from '../../../../components/AppProvider';
import { T } from '../../../../lib/i18n';
import { writingTasks } from '../../../../lib/writingData';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function countWords(text) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

// ── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({ submissions, onRetake }) {
  useEffect(() => {
    try { localStorage.setItem('tefWritingScore', JSON.stringify(12)); } catch {}
  }, []);

  return (
    <div className="page-shell" style={{ background:'#EFF6FF' }}>
      <main className="page-content animate-pop-in">

        <div className="card p-6 text-center mb-5">
          <div className="text-5xl mb-3">✍️</div>
          <h1 className="font-display font-extrabold text-xl mb-1" style={{ color:'#1E3A8A' }}>
            Expression écrite — Terminée !
          </h1>
          <p className="text-sm text-slate-500 font-body mb-4">
            Your responses have been saved. Writing is scored by human examiners in the real TEF.
          </p>
          <div className="rounded-3xl p-4 mb-4" style={{ background:'#EDE9FE', border:'1.5px solid #C4B5FD' }}>
            <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">Self-Assessment Guide</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-body text-left">
              <div>✅ Used formal register</div>
              <div>✅ Covered all bullet points</div>
              <div>✅ Stayed within word count</div>
              <div>✅ Varied vocabulary</div>
              <div>✅ Correct connectors</div>
              <div>✅ Clear structure</div>
            </div>
          </div>
        </div>

        {/* Per-task review */}
        {writingTasks.map((task, i) => (
          <div key={task.id} className="card mb-4 overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor:'#DBEAFE', background: task.colorBg }}>
              <span className="text-2xl">{task.icon}</span>
              <div>
                <h3 className="font-display font-bold text-sm" style={{ color: task.color }}>{task.title}</h3>
                <p className="text-xs text-slate-500 font-body">{task.type} · {task.clbLevel} · {task.wordCount.min}–{task.wordCount.max} words</p>
              </div>
            </div>

            {/* Your text */}
            <div className="p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Your Response</p>
              <div className="rounded-2xl p-3 bg-slate-50 border border-slate-200 min-h-20">
                <p className="text-sm text-slate-700 font-body leading-relaxed whitespace-pre-line">
                  {submissions[task.id] || <span className="text-slate-300 italic">No response submitted</span>}
                </p>
                {submissions[task.id] && (
                  <p className="text-xs text-slate-400 mt-2 font-body">{countWords(submissions[task.id])} words</p>
                )}
              </div>
            </div>

            {/* Sample answer */}
            <div className="px-4 pb-4">
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: task.color }}>
                📝 Sample Answer (B2 Level)
              </p>
              <div className="rounded-2xl p-3 text-sm font-body leading-relaxed whitespace-pre-line"
                style={{ background: task.colorBg, border:`1px solid ${task.colorBorder}`, color:'#374151' }}>
                {task.sampleAnswer}
              </div>
            </div>

            {/* Scoring criteria */}
            <div className="px-4 pb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Scoring Criteria</p>
              <div className="grid grid-cols-2 gap-2">
                {task.scoringCriteria.map((c, ci) => (
                  <div key={ci} className="rounded-2xl p-2.5" style={{ background:'#f8fafc', border:'1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-600">{c.criterion}</span>
                      <span className="text-xs font-bold" style={{ color: task.color }}>{c.points}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-body leading-tight">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button onClick={onRetake} className="btn-secondary text-sm">🔄 Redo Writing</button>
          <Link href="/tef/exam" className="btn-primary text-sm no-underline text-center flex items-center justify-center">
            🏆 Exam Hub
          </Link>
        </div>
      </main>
    </div>
  );
}

// ── Main Writing Exam ─────────────────────────────────────────────────────────
export default function WritingExamPage() {
  const { state } = useApp();
  const lang = state?.lang || 'en';
  const navT = T[lang]?.nav || T.en.nav;

  const TOTAL_TIME = 60 * 60;  // 60 minutes

  const [phase, setPhase] = useState('intro');
  const [taskIdx, setTaskIdx] = useState(0);
  const [texts, setTexts] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showFormat, setShowFormat] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  const currentTask = writingTasks[taskIdx];
  const currentText = texts[currentTask.id] || '';
  const words = countWords(currentText);
  const wordMin = currentTask.wordCount.min;
  const wordMax = currentTask.wordCount.max;
  const timerUrgent = timeLeft < 10 * 60;

  useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('results'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase('results');
  }, []);

  const handleRetake = () => {
    setTexts({});
    setTaskIdx(0);
    setTimeLeft(TOTAL_TIME);
    setShowFormat(false);
    setShowPhrases(false);
    setPhase('intro');
  };

  if (phase === 'results') {
    return <ResultsScreen submissions={texts} onRetake={handleRetake} />;
  }

  if (phase === 'intro') {
    return (
      <div className="page-shell">
        <Nav navT={navT} />
        <main className="page-content animate-fade-in">
          <div className="rounded-4xl p-7 mb-5 text-white relative overflow-hidden"
            style={{ background:'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)' }}>
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10"
              style={{ background:'radial-gradient(circle,#fff,transparent)' }} />
            <div className="text-4xl mb-3">✍️</div>
            <h1 className="font-display font-extrabold text-2xl text-white mb-1">Expression écrite</h1>
            <p className="text-purple-100 text-sm">Written Expression — TEF Canada</p>
          </div>

          <div className="card p-5 mb-4">
            <h2 className="font-display font-bold text-base mb-3" style={{ color:'#1E3A8A' }}>Instructions</h2>
            <div className="space-y-2 text-sm text-slate-600 font-body leading-relaxed">
              <p>✍️ You will complete <strong>2 writing tasks</strong>.</p>
              <p>📧 <strong>Task 1</strong>: Formal message (150–200 words) — 25 min recommended</p>
              <p>💬 <strong>Task 2</strong>: Opinion essay (200–250 words) — 35 min recommended</p>
              <p>⏱ Total time: <strong>60 minutes</strong>. Use the structure guides provided.</p>
              <p>🔍 After submitting, a sample B2-level answer will be revealed for comparison.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {writingTasks.map(t => (
              <div key={t.id} className="rounded-3xl p-4" style={{ background: t.colorBg, border:`1.5px solid ${t.colorBorder}` }}>
                <div className="text-2xl mb-2">{t.icon}</div>
                <p className="font-display font-bold text-sm mb-0.5" style={{ color: t.color }}>{t.type}</p>
                <p className="text-xs text-slate-500 font-body">{t.wordCount.min}–{t.wordCount.max} words · {t.timeRecommended} min · {t.clbLevel}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setPhase('exam')}
            className="btn-primary w-full text-base py-4"
            style={{ background:'linear-gradient(135deg,#5B21B6,#7C3AED)', boxShadow:'0 4px 16px rgba(124,58,237,0.4)' }}>
            ✍️ Begin Writing Test →
          </button>
        </main>
      </div>
    );
  }

  // ── Exam View ───────────────────────────────────────────────────────────────
  return (
    <div className="page-shell">
      {/* Timer bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-11"
        style={{ background: timerUrgent ? '#FEF2F2' : 'rgba(255,255,255,0.96)', backdropFilter:'blur(12px)', borderBottom:`1.5px solid ${timerUrgent ? '#FECACA' : '#DBEAFE'}` }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-display font-bold" style={{ color:'#1E3A8A' }}>Writing</span>
          <span className="text-slate-300">|</span>
          <div className="flex gap-1.5">
            {writingTasks.map((t, i) => (
              <button key={t.id} onClick={() => setTaskIdx(i)}
                className="text-xs font-bold rounded-lg px-2 py-0.5 transition-all"
                style={{ background: i === taskIdx ? t.color : countWords(texts[t.id]||'') >= t.wordCount.min ? '#DCFCE7' : '#f1f5f9',
                         color:      i === taskIdx ? 'white'   : countWords(texts[t.id]||'') >= t.wordCount.min ? '#15803D' : '#64748b' }}>
                {countWords(texts[t.id]||'') >= t.wordCount.min ? '✓ ' : ''}T{i+1}
              </button>
            ))}
          </div>
        </div>
        <div className={`font-display font-bold text-base px-3 py-1 rounded-xl ${timerUrgent ? 'animate-pulse' : ''}`}
          style={{ color: timerUrgent ? '#DC2626' : '#7C3AED', background: timerUrgent ? '#FEF2F2' : '#EDE9FE', border:`1.5px solid ${timerUrgent ? '#FECACA' : '#C4B5FD'}` }}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <main style={{ paddingTop:'3rem' }}>
        <div className="max-w-2xl mx-auto px-4 pb-32 pt-4">

          {/* Task header */}
          <div className="rounded-3xl p-4 mb-4"
            style={{ background: currentTask.colorBg, border:`1.5px solid ${currentTask.colorBorder}` }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="badge" style={{ background: currentTask.colorBg, color: currentTask.color, border:`1px solid ${currentTask.colorBorder}` }}>
                {currentTask.icon} {currentTask.type}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-body text-slate-500">
                <span>🕐 {currentTask.timeRecommended} min</span>
                <span>•</span>
                <span>{currentTask.clbLevel}</span>
              </div>
            </div>
            <h2 className="font-display font-bold text-base" style={{ color: currentTask.color }}>
              {currentTask.title}
            </h2>
          </div>

          {/* Prompt */}
          <div className="card p-5 mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Sujet</p>
            <p className="text-sm font-body leading-loose text-slate-700 whitespace-pre-line">
              {currentTask.prompt}
            </p>
          </div>

          {/* Format guide (collapsible) */}
          <button onClick={() => setShowFormat(!showFormat)}
            className="w-full flex items-center justify-between rounded-2xl px-4 py-3 mb-2 text-sm font-semibold transition-all"
            style={{ background: currentTask.colorBg, border:`1.5px solid ${currentTask.colorBorder}`, color: currentTask.color }}>
            <span>📋 Structure Guide</span>
            <span>{showFormat ? '▲' : '▼'}</span>
          </button>
          {showFormat && (
            <div className="card p-4 mb-3 animate-fade-in">
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: currentTask.color }}>
                {currentTask.format.title}
              </p>
              <div className="space-y-2">
                {currentTask.format.parts.map((part, pi) => (
                  <div key={pi} className="flex gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                      style={{ background: currentTask.color }}>
                      {pi + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{part.label}</p>
                      <p className="text-xs text-slate-500 font-body leading-snug">{part.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Useful phrases (collapsible) */}
          <button onClick={() => setShowPhrases(!showPhrases)}
            className="w-full flex items-center justify-between rounded-2xl px-4 py-3 mb-4 text-sm font-semibold transition-all"
            style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', color:'#475569' }}>
            <span>💬 Useful Phrases</span>
            <span>{showPhrases ? '▲' : '▼'}</span>
          </button>
          {showPhrases && (
            <div className="card p-4 mb-4 animate-fade-in">
              <div className="space-y-2">
                {currentTask.usefulPhrases.map((ph, pi) => (
                  <div key={pi} className="flex gap-3 items-start p-2.5 rounded-xl bg-slate-50">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">{ph.fr}</p>
                      <p className="text-xs text-slate-400 font-body italic">{ph.en}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text area */}
          <div className="card p-0 overflow-hidden mb-3">
            <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor:'#DBEAFE', background:'#F8FBFF' }}>
              <p className="text-xs font-bold text-slate-500 font-body">Your Response</p>
              <div className="flex items-center gap-2 text-xs font-body font-semibold"
                style={{ color: words < wordMin ? '#EA580C' : words <= wordMax ? '#16A34A' : '#DC2626' }}>
                {words} / {wordMin}–{wordMax} words
                {words >= wordMin && words <= wordMax && <span>✓</span>}
                {words > wordMax && <span>⚠ Too long</span>}
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={currentText}
              onChange={e => setTexts(prev => ({ ...prev, [currentTask.id]: e.target.value }))}
              placeholder={`Écrivez votre ${currentTask.type.toLowerCase()} ici...`}
              className="w-full p-4 text-sm font-body leading-loose resize-none outline-none"
              style={{ minHeight:'280px', background:'white', color:'#1e293b', border:'none' }}
            />
            {/* Progress bar */}
            <div className="h-1 bg-slate-100">
              <div className="h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (words / wordMax) * 100)}%`,
                         background: words < wordMin ? '#EA580C' : words <= wordMax ? '#16A34A' : '#DC2626' }} />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {taskIdx > 0 && (
              <button onClick={() => setTaskIdx(0)} className="btn-secondary flex-1">← Tâche 1</button>
            )}
            {taskIdx === 0 ? (
              <button onClick={() => setTaskIdx(1)} className="btn-primary flex-1"
                style={{ background:`linear-gradient(135deg,${writingTasks[1].color}cc,${writingTasks[1].color})` }}>
                Tâche 2 →
              </button>
            ) : (
              <button onClick={handleSubmit}
                className="btn-primary flex-1"
                style={{ background: Object.keys(texts).length === 2 ? 'linear-gradient(135deg,#15803D,#16A34A)' : undefined }}>
                {Object.keys(texts).length === 2 ? '✅ Submit Writing' : `Submit (${Object.keys(texts).length}/2 tasks)`}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

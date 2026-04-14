'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '../../../components/AppProvider';
import {
  LISTENING_QUESTIONS, LEVELS, getQuestionsByLevel,
  shuffleQuestions, LEVEL_COLORS, LEVEL_BGS,
} from '../../../lib/listeningPracticeData';
import { cleanForSpeech } from '../../../lib/cleanForSpeech';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const MAX_REPLAYS   = 2;   // 0 = first play, then 2 more = 3 total listens
const SESSION_SIZE  = 8;   // questions per session
const TIMER_SECONDS = 45;  // seconds per question when timer is on

// ─────────────────────────────────────────────────────────────────────────────
// TTS — returns a Promise that resolves when speech ends
// ─────────────────────────────────────────────────────────────────────────────
function speakScript(text, rate = 0.88) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(cleanForSpeech(text));
    u.lang = 'fr-CA';
    u.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const fr = voices.find(v => v.lang === 'fr-CA') || voices.find(v => v.lang.startsWith('fr')) || null;
    if (fr) u.voice = fr;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SpeakerIcon
// ─────────────────────────────────────────────────────────────────────────────
function SpeakerIcon({ active, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
      {active ? (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </>
      ) : (
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Waveform animation (shown while playing)
// ─────────────────────────────────────────────────────────────────────────────
function Waveform({ active, color }) {
  const heights = [4, 8, 14, 20, 14, 8, 4, 10, 18, 10, 4, 8, 14, 20, 14];
  return (
    <div className="flex items-center gap-0.5" style={{ height: 24 }}>
      {heights.map((h, i) => (
        <div key={i} className="rounded-full flex-shrink-0 transition-all"
          style={{
            width: 3,
            height: active ? h : 4,
            background: active ? color : '#CBD5E1',
            transition: active ? `height ${0.3 + i * 0.05}s ease-in-out` : 'height 0.2s',
            animation: active ? `wave ${0.6 + (i % 4) * 0.15}s ease-in-out infinite alternate` : 'none',
          }} />
      ))}
      <style>{`@keyframes wave { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Timer ring
// ─────────────────────────────────────────────────────────────────────────────
function TimerRing({ seconds, total, color }) {
  const r = 22, circ = 2 * Math.PI * r;
  const pct = seconds / total;
  const urgent = seconds <= 10;
  const ringColor = urgent ? '#DC2626' : color;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <svg width="56" height="56" className="absolute" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="28" cy="28" r={r} fill="none" stroke="#F1F5F9" strokeWidth="4"/>
        <circle cx="28" cy="28" r={r} fill="none" stroke={ringColor} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}/>
      </svg>
      <span className="font-bold text-sm relative" style={{ color: ringColor }}>{seconds}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETUP SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [level, setLevel]     = useState('All');
  const [timer, setTimer]     = useState(false);
  const [count, setCount]     = useState(SESSION_SIZE);

  const available = getQuestionsByLevel(level).length;

  return (
    <div className="min-h-screen px-4 pt-6 pb-24" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-md mx-auto">
        <Link href="/listen" className="inline-flex items-center gap-1.5 text-sm text-slate-500 mb-6 no-underline">← Back</Link>

        {/* Hero */}
        <div className="rounded-3xl p-6 mb-6 text-white" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #7C3AED 100%)' }}>
          <div className="text-4xl mb-3">🎧</div>
          <h1 className="font-display font-extrabold text-2xl mb-2">Listening Practice</h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Train your ear for TEF Canada. Listen to authentic French, then answer comprehension questions — just like the real exam.
          </p>
        </div>

        {/* Config card */}
        <div className="card p-5 mb-4">
          {/* Level */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Difficulty Level</p>
            <div className="grid grid-cols-5 gap-1.5">
              {LEVELS.map(l => {
                const c = l === 'All' ? '#2563EB' : LEVEL_COLORS[l];
                const active = level === l;
                return (
                  <button key={l} onClick={() => setLevel(l)}
                    className="rounded-xl py-2 text-xs font-bold transition-all"
                    style={{
                      background: active ? c : c + '12',
                      color: active ? 'white' : c,
                      border: `1.5px solid ${active ? c : c + '30'}`,
                    }}>
                    {l}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 font-body mt-2">{available} questions available at this level</p>
          </div>

          {/* Questions count */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Questions per Session</p>
            <div className="flex gap-2">
              {[4, 6, 8, 10].map(n => (
                <button key={n} onClick={() => setCount(Math.min(n, available))}
                  className="flex-1 rounded-xl py-2 text-sm font-bold transition-all"
                  style={{
                    background: count === n ? '#2563EB' : '#F8FAFC',
                    color: count === n ? 'white' : '#64748B',
                    border: `1.5px solid ${count === n ? '#2563EB' : '#E2E8F0'}`,
                    opacity: n > available ? 0.4 : 1,
                  }}
                  disabled={n > available}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Timer toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
            <div>
              <p className="text-sm font-bold text-navy">⏱ Timer ({TIMER_SECONDS}s per question)</p>
              <p className="text-xs text-slate-400 font-body mt-0.5">Simulates real exam time pressure</p>
            </div>
            <button onClick={() => setTimer(t => !t)}
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ background: timer ? '#2563EB' : '#CBD5E1' }}>
              <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: timer ? 'translateX(1.25rem)' : 'translateX(0.125rem)' }} />
            </button>
          </div>
        </div>

        {/* Rules card */}
        <div className="rounded-2xl p-4 mb-6" style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A' }}>
          <p className="text-xs font-bold text-amber-700 mb-2">📋 How it works</p>
          <div className="space-y-1">
            {[
              `Each audio can be replayed up to ${MAX_REPLAYS} extra times`,
              'You must listen at least once before answering',
              'After your answer, the full transcript is revealed',
              'TEF exam tip shown after each question',
            ].map((r, i) => <p key={i} className="text-xs text-amber-800 font-body">• {r}</p>)}
          </div>
        </div>

        <button onClick={() => onStart(level, count, timer)}
          className="w-full rounded-2xl py-4 font-bold text-white text-base transition-all"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 4px 16px rgba(37,99,235,0.4)' }}>
          Start Session →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function QuestionScreen({ question, qIdx, total, timerOn, onAnswer, onSkip }) {
  const [playing, setPlaying]       = useState(false);
  const [replaysLeft, setReplaysLeft] = useState(MAX_REPLAYS);
  const [hasListened, setHasListened] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [submitted, setSubmitted]   = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [timeLeft, setTimeLeft]     = useState(TIMER_SECONDS);
  const timerRef = useRef(null);

  const color = LEVEL_COLORS[question.level] || '#2563EB';
  const bg    = LEVEL_BGS[question.level]    || '#EFF6FF';

  // Timer
  useEffect(() => {
    if (!timerOn || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); if (!submitted) handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerOn, submitted]);

  const handlePlay = useCallback(async () => {
    if (playing) return;
    if (!hasListened) {
      setHasListened(true);
    } else {
      if (replaysLeft <= 0) return;
      setReplaysLeft(r => r - 1);
    }
    setPlaying(true);
    await speakScript(question.script);
    setPlaying(false);
  }, [playing, hasListened, replaysLeft, question.script]);

  const handleSubmit = useCallback((timedOut = false) => {
    if (submitted) return;
    clearInterval(timerRef.current);
    setSubmitted(true);
    setShowTranscript(false); // transcript hidden until they tap
    const correct = !timedOut && selected === question.answer;
    // Small delay before allowing "next"
    setTimeout(() => {}, 300);
    return correct;
  }, [submitted, selected, question.answer]);

  const correct = submitted && selected === question.answer;
  const timedOut = submitted && selected === null;

  const replayDisabled = playing || replaysLeft <= 0;
  const canAnswer = hasListened && !submitted;

  return (
    <div className="min-h-screen px-4 pt-4 pb-28" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold rounded-full px-3 py-1" style={{ background: color + '18', color }}>
              {question.level}
            </span>
            <span className="text-xs text-slate-400 font-body">{question.title}</span>
          </div>
          {timerOn && !submitted && (
            <TimerRing seconds={timeLeft} total={TIMER_SECONDS} color={color} />
          )}
        </div>

        {/* Progress dots */}
        <div className="flex gap-1 mb-5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
              style={{ background: i < qIdx ? color : i === qIdx ? color + '60' : '#E2E8F0' }} />
          ))}
        </div>

        {/* Audio player card */}
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color }}>🎧 Audio</p>
              <p className="text-xs text-slate-400 font-body mt-0.5">
                {submitted
                  ? 'Replay anytime'
                  : hasListened
                    ? replaysLeft > 0 ? `${replaysLeft} replay${replaysLeft !== 1 ? 's' : ''} remaining` : 'No replays left'
                    : 'Press play to start'
                }
              </p>
            </div>
            <div className="text-xs font-bold rounded-xl px-2.5 py-1"
              style={{ background: bg, color }}>
              Q {qIdx + 1} / {total}
            </div>
          </div>

          {/* Big play button */}
          <div className="flex items-center gap-4">
            <button onClick={handlePlay}
              disabled={playing || (!submitted && !hasListened ? false : replayDisabled && !submitted)}
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: playing ? color : hasListened && replayDisabled && !submitted ? '#F1F5F9' : color,
                color: 'white',
                boxShadow: playing ? `0 0 0 4px ${color}30` : 'none',
                opacity: !playing && replayDisabled && !submitted ? 0.4 : 1,
              }}>
              <SpeakerIcon active={playing} size={28} />
            </button>

            <div className="flex-1">
              <Waveform active={playing} color={color} />
              {playing && (
                <p className="text-xs text-slate-400 font-body mt-1.5 animate-pulse">Playing French audio...</p>
              )}
              {!playing && !hasListened && (
                <p className="text-sm font-body text-slate-400 italic">Tap to hear the audio</p>
              )}
              {!playing && hasListened && !submitted && (
                <p className="text-xs font-body text-slate-500">
                  {replaysLeft > 0 ? 'Tap to replay' : 'Answer the question below'}
                </p>
              )}
              {!playing && submitted && (
                <p className="text-xs font-body text-slate-400">Tap to hear again</p>
              )}
            </div>
          </div>

          {/* Replay dots */}
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-[10px] text-slate-400 font-body">Replays:</span>
            {Array.from({ length: MAX_REPLAYS }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full transition-all"
                style={{ background: i < replaysLeft ? color : '#E2E8F0' }} />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="card p-5 mb-4">
          {!hasListened && (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">👂</div>
              <p className="font-display font-bold text-navy text-sm">Listen first, then answer</p>
              <p className="text-xs text-slate-400 font-body mt-1">Press the play button above</p>
            </div>
          )}

          {hasListened && (
            <>
              <p className="font-display font-bold text-navy text-base leading-snug mb-1">{question.question}</p>
              <p className="text-xs text-slate-400 font-body italic mb-4">{question.questionEn}</p>

              <div className="space-y-2.5 mb-4">
                {question.options.map((opt, i) => {
                  const isCorrect  = i === question.answer;
                  const isSelected = i === selected;
                  let bg = 'white', border = '#E2E8F0', tc = '#1E293B';

                  if (submitted) {
                    if (isCorrect)             { bg = '#DCFCE7'; border = '#16A34A'; tc = '#15803D'; }
                    else if (isSelected)       { bg = '#FEF2F2'; border = '#DC2626'; tc = '#DC2626'; }
                    else                       { bg = '#F8FAFC'; tc = '#94A3B8'; }
                  } else if (isSelected)       { bg = color + '12'; border = color; tc = color; }

                  return (
                    <button key={i}
                      onClick={() => canAnswer && setSelected(i)}
                      className="w-full text-left rounded-2xl px-4 py-3.5 transition-all font-body text-sm font-medium"
                      style={{ background: bg, border: `1.5px solid ${border}`, color: tc, cursor: canAnswer ? 'pointer' : 'default' }}>
                      <span className="inline-flex w-5 h-5 rounded-full mr-2.5 text-xs font-bold items-center justify-center flex-shrink-0"
                        style={{
                          background: (isSelected || (submitted && isCorrect)) ? border : '#F1F5F9',
                          color: (isSelected || (submitted && isCorrect)) ? 'white' : '#94A3B8',
                          verticalAlign: 'middle',
                        }}>
                        {submitted && isCorrect ? '✓' : submitted && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!submitted && (
                <button onClick={() => handleSubmit()}
                  disabled={selected === null}
                  className="w-full rounded-2xl py-3.5 font-bold text-sm transition-all"
                  style={{
                    background: selected !== null ? color : '#E2E8F0',
                    color: selected !== null ? 'white' : '#94A3B8',
                    boxShadow: selected !== null ? `0 4px 12px ${color}40` : 'none',
                  }}>
                  Submit Answer
                </button>
              )}
            </>
          )}
        </div>

        {/* Result + Transcript (shown after submit) */}
        {submitted && (
          <div className="space-y-3">
            {/* Result banner */}
            <div className="rounded-2xl px-5 py-4"
              style={{ background: timedOut ? '#FEF9EC' : correct ? '#DCFCE7' : '#FEF2F2', border: `1.5px solid ${timedOut ? '#FDE68A' : correct ? '#86EFAC' : '#FCA5A5'}` }}>
              <p className="font-bold text-base" style={{ color: timedOut ? '#92400E' : correct ? '#15803D' : '#DC2626' }}>
                {timedOut ? '⏱ Time\'s up!' : correct ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              {!correct && !timedOut && (
                <p className="text-sm mt-1 font-body" style={{ color: '#DC2626' }}>
                  Correct answer: <strong>{question.options[question.answer]}</strong>
                </p>
              )}
            </div>

            {/* Explanation */}
            <div className="rounded-2xl px-4 py-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <p className="text-xs font-bold text-slate-500 mb-1">💡 Explanation</p>
              <p className="text-sm text-slate-700 font-body leading-relaxed">{question.explanation}</p>
            </div>

            {/* Transcript toggle */}
            <button onClick={() => setShowTranscript(s => !s)}
              className="w-full rounded-2xl px-4 py-3 flex items-center justify-between transition-all"
              style={{ background: color + '10', border: `1.5px solid ${color}25` }}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color }}>📄 Full Transcript</span>
                <span className="text-xs text-slate-400 font-body">French + English</span>
              </div>
              <span className="text-slate-400 text-sm">{showTranscript ? '▲' : '▼'}</span>
            </button>

            {showTranscript && (
              <div className="rounded-2xl p-4 space-y-3" style={{ background: color + '08', border: `1.5px solid ${color}20` }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color }}>🇫🇷 French</p>
                  <p className="text-sm font-body text-navy leading-relaxed font-medium">{question.script}</p>
                </div>
                <div className="border-t pt-3" style={{ borderColor: color + '20' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-2 text-slate-400">🇬🇧 English Translation</p>
                  <p className="text-sm font-body text-slate-500 leading-relaxed italic">{question.scriptEn}</p>
                </div>
              </div>
            )}

            {/* TEF tip */}
            <div className="rounded-2xl p-4" style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A' }}>
              <p className="text-xs font-bold text-amber-700 mb-1">🎯 TEF Exam Tip</p>
              <p className="text-xs text-amber-800 font-body leading-relaxed">
                {question.type === 'conversation'
                  ? 'In TEF listening conversations, focus on the KEY ACTION or DECISION made — not just who speaks. Ignore filler phrases.'
                  : 'In TEF monologues, listen for numbers, names, and contrast words (mais, cependant, toutefois). They often hold the answer.'}
              </p>
            </div>

            {/* Next button */}
            <button onClick={() => onAnswer(selected === question.answer)}
              className="w-full rounded-2xl py-4 font-bold text-white text-sm transition-all mt-2"
              style={{ background: color, boxShadow: `0 4px 14px ${color}40` }}>
              Next Question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULTS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function ResultsScreen({ questions, answers, onRetry, onNewSession }) {
  const correct = answers.filter(Boolean).length;
  const total   = questions.length;
  const pct     = Math.round((correct / total) * 100);
  const excellent = pct >= 80, good = pct >= 60;
  const barColor = excellent ? '#16A34A' : good ? '#2563EB' : '#DC2626';

  return (
    <div className="min-h-screen px-4 pt-8 pb-24" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-md mx-auto">

        {/* Score hero */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{excellent ? '🏆' : good ? '👍' : '📚'}</div>
          <h2 className="font-display font-extrabold text-2xl text-navy mb-1">Session Complete!</h2>
          <div className="text-5xl font-bold mb-1" style={{ color: barColor }}>{pct}%</div>
          <p className="text-slate-400 font-body">{correct} of {total} correct</p>
        </div>

        {/* Score bar */}
        <div className="h-4 rounded-full bg-slate-100 mb-2 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: barColor }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 font-body mb-6">
          <span>0%</span><span style={{ color: '#D97706' }}>60%</span><span style={{ color: '#16A34A' }}>80%+</span><span>100%</span>
        </div>

        {/* Message */}
        <div className="rounded-2xl p-4 mb-6"
          style={{
            background: excellent ? '#DCFCE7' : good ? '#EFF6FF' : '#FEF2F2',
            border: `1.5px solid ${excellent ? '#86EFAC' : good ? '#BFDBFE' : '#FCA5A5'}`,
          }}>
          <p className="text-sm font-semibold leading-relaxed" style={{ color: excellent ? '#15803D' : good ? '#1D4ED8' : '#DC2626' }}>
            {excellent
              ? '✅ Excellent listening! You\'re on track for TEF CLB 7+ comprehension.'
              : good
              ? '👍 Good work. Practice 2–3 sessions per day to reach TEF exam readiness.'
              : '⚠️ Keep practicing! Focus on the transcripts and re-read the explanations.'}
          </p>
        </div>

        {/* Per-question breakdown */}
        <div className="card p-4 mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Question Breakdown</p>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div key={q.id} className="flex items-center gap-3 rounded-xl px-3 py-2"
                style={{ background: answers[i] ? '#DCFCE7' : '#FEF2F2' }}>
                <span className="text-sm flex-shrink-0">{answers[i] ? '✅' : '❌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-navy truncate">{q.title}</p>
                  <p className="text-[10px] text-slate-400 font-body">{q.level} · {q.type}</p>
                </div>
                <span className="text-[10px] font-bold rounded-full px-2 py-0.5 flex-shrink-0"
                  style={{ background: LEVEL_BGS[q.level], color: LEVEL_COLORS[q.level] }}>
                  {q.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CLB hint */}
        <div className="rounded-2xl p-4 mb-6" style={{ background: '#F5F3FF', border: '1.5px solid #DDD6FE' }}>
          <p className="text-xs font-bold text-purple-700 mb-1">📊 TEF Readiness</p>
          <p className="text-xs text-purple-700 font-body leading-relaxed">
            {pct >= 80
              ? 'Scores above 80% on B1–B2 questions indicate CLB 7+ listening readiness. Keep it up!'
              : pct >= 60
              ? 'You\'re approaching CLB 6–7. Focus on B1 conversations — that\'s the key TEF zone.'
              : 'Start with A1–A2 questions daily. Replay audios and study transcripts before moving up.'}
          </p>
        </div>

        <div className="space-y-3">
          <button onClick={onNewSession}
            className="w-full rounded-2xl py-4 font-bold text-white text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
            New Session →
          </button>
          <Link href="/listen"
            className="block w-full rounded-2xl py-3.5 text-center font-bold text-sm no-underline transition-all"
            style={{ background: '#F8FAFC', color: '#64748B', border: '1.5px solid #E2E8F0' }}>
            ← Back to Listening Hub
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ListeningPracticePage() {
  const { addXP } = useApp();

  // phase: 'setup' | 'question' | 'results'
  const [phase, setPhase]         = useState('setup');
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx]           = useState(0);
  const [answers, setAnswers]     = useState([]);
  const [timerOn, setTimerOn]     = useState(false);
  const [sessionXP, setSessionXP] = useState(0);

  const handleStart = (level, count, timer) => {
    const pool = shuffleQuestions(getQuestionsByLevel(level)).slice(0, count);
    setQuestions(pool);
    setQIdx(0);
    setAnswers([]);
    setTimerOn(timer);
    setSessionXP(0);
    setPhase('question');
  };

  const handleAnswer = (correct) => {
    const q = questions[qIdx];
    const xpEarned = correct ? q.xp : Math.round(q.xp * 0.3);
    addXP(xpEarned);
    setSessionXP(x => x + xpEarned);
    setAnswers(a => [...a, correct]);

    if (qIdx + 1 >= questions.length) {
      setPhase('results');
    } else {
      setQIdx(i => i + 1);
    }
  };

  const handleNewSession = () => {
    setPhase('setup');
    setQuestions([]);
    setQIdx(0);
    setAnswers([]);
  };

  return (
    <>
      {/* Sticky top bar during question phase */}
      {phase === 'question' && (
        <div className="sticky top-0 z-40" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid #DBEAFE' }}>
          <div className="max-w-md mx-auto px-4 h-11 flex items-center justify-between">
            <button onClick={handleNewSession} className="text-slate-400 text-sm hover:text-slate-600">✕ End</button>
            <p className="text-xs font-bold text-slate-500">Listening Practice</p>
            <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#2563EB' }}>
              ⚡ {sessionXP} XP
            </div>
          </div>
        </div>
      )}

      {phase === 'setup' && <SetupScreen onStart={handleStart} />}

      {phase === 'question' && questions[qIdx] && (
        <QuestionScreen
          key={`${qIdx}-${questions[qIdx].id}`}
          question={questions[qIdx]}
          qIdx={qIdx}
          total={questions.length}
          timerOn={timerOn}
          onAnswer={handleAnswer}
          onSkip={() => handleAnswer(false)}
        />
      )}

      {phase === 'results' && (
        <ResultsScreen
          questions={questions}
          answers={answers}
          onRetry={() => { setQIdx(0); setAnswers([]); setPhase('question'); }}
          onNewSession={handleNewSession}
        />
      )}
    </>
  );
}

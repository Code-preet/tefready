'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Nav from '../../../components/Nav';
import { useApp } from '../../../components/AppProvider';
import { T } from '../../../lib/i18n';
import { cleanForSpeech } from '../../../lib/cleanForSpeech';
import {
  LISTENING_QUESTIONS,
  LEVEL_COLORS, LEVEL_BGS, TYPE_ICONS, TOTAL_QUESTIONS,
} from '../../../lib/tefListeningTestData';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const MAX_PLAYS    = 2;
const ADVANCE_DELAY = 1600; // ms after answer to auto-advance

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function fmtTime(s) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

function speakScript(text, rate = 0.88) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(cleanForSpeech(text));
    u.lang = 'fr-CA'; u.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const fr = voices.find(v => v.lang === 'fr-CA') || voices.find(v => v.lang.startsWith('fr')) || null;
    if (fr) u.voice = fr;
    u.onend  = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PlayButton
// ─────────────────────────────────────────────────────────────────────────────
function PlayButton({ disabled, playing, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '64px', height: '64px', borderRadius: '50%', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? '#1E293B' : playing ? '#EF4444' : '#2563EB',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        boxShadow: disabled ? 'none' : playing ? '0 0 0 8px rgba(239,68,68,0.2)' : '0 4px 16px rgba(37,99,235,0.4)',
        transition: 'all 0.2s',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {playing ? (
        /* Pause icon while speaking */
        <svg width={20} height={20} viewBox="0 0 24 24" fill="white">
          <rect x="5" y="3" width="4" height="18" rx="1.5"/>
          <rect x="15" y="3" width="4" height="18" rx="1.5"/>
        </svg>
      ) : (
        /* Play icon */
        <svg width={22} height={22} viewBox="0 0 24 24" fill="white">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Timer bar
// ─────────────────────────────────────────────────────────────────────────────
function TimerBar({ timeLeft, totalTime }) {
  const pct   = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const color = timeLeft <= 5 ? '#EF4444' : timeLeft <= totalTime * 0.35 ? '#F59E0B' : '#22C55E';
  return (
    <div style={{ height: '6px', background: '#1E293B', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: '3px',
        background: color,
        width: `${pct}%`,
        transition: 'width 1s linear, background 0.4s',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Question nav dots
// ─────────────────────────────────────────────────────────────────────────────
function NavDots({ total, current, answers }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {Array.from({ length: total }, (_, i) => {
        const answered  = answers[i] !== undefined;
        const isCurrent = i === current;
        const correct   = answered && answers[i] === LISTENING_QUESTIONS[i].answer;
        const wrong     = answered && answers[i] !== LISTENING_QUESTIONS[i].answer && answers[i] !== null;
        const skipped   = answered && answers[i] === null;

        let bg = '#1E293B'; // future
        if (isCurrent)     bg = '#2563EB';
        else if (correct)  bg = '#16A34A';
        else if (wrong)    bg = '#EF4444';
        else if (skipped)  bg = '#475569';

        return (
          <div key={i} style={{
            width: isCurrent ? '24px' : '10px',
            height: '10px',
            borderRadius: '5px',
            background: bg,
            transition: 'all 0.25s',
            flexShrink: 0,
          }} />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Option button
// ─────────────────────────────────────────────────────────────────────────────
function OptionButton({ label, text, idx, selected, correct, submitted, onClick }) {
  const isSelected = selected === idx;
  const isCorrect  = correct === idx;

  let bg = '#0F172A', border = '#1E293B', textColor = '#94A3B8', badge = '#1E293B', badgeText = '#475569';

  if (!submitted) {
    if (isSelected) { bg = '#1E3A8A'; border = '#2563EB'; textColor = 'white'; badge = '#2563EB'; badgeText = 'white'; }
  } else {
    if (isCorrect)         { bg = '#0F2A1A'; border = '#16A34A'; textColor = '#4ADE80'; badge = '#16A34A'; badgeText = 'white'; }
    else if (isSelected)   { bg = '#2A0F0F'; border = '#EF4444'; textColor = '#F87171'; badge = '#EF4444'; badgeText = 'white'; }
    else                   { bg = '#0F172A'; border = '#1E293B'; textColor = '#475569'; badge = '#1E293B'; badgeText = '#475569'; }
  }

  const LABELS = ['A', 'B', 'C', 'D'];

  return (
    <button
      onClick={() => !submitted && onClick(idx)}
      disabled={submitted}
      style={{
        width: '100%', textAlign: 'left', padding: '0.85rem 1rem',
        background: bg, border: `1.5px solid ${border}`, borderRadius: '0.9rem',
        cursor: submitted ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', gap: '0.85rem',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!submitted) e.currentTarget.style.borderColor = '#2563EB'; }}
      onMouseLeave={e => { if (!submitted) e.currentTarget.style.borderColor = isSelected ? '#2563EB' : '#1E293B'; }}
    >
      <span style={{
        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
        background: badge, color: badgeText,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: '0.82rem', transition: 'all 0.15s',
      }}>{LABELS[idx]}</span>
      <span style={{ color: textColor, fontSize: '0.9rem', fontWeight: isSelected || isCorrect ? 700 : 400, lineHeight: 1.5, flex: 1, transition: 'color 0.15s' }}>
        {text}
      </span>
      {submitted && isCorrect && <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>✓</span>}
      {submitted && isSelected && !isCorrect && <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>✗</span>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function ListeningTestPage() {
  const { state, addXP } = useApp();
  const lang  = state?.lang || 'en';
  const navT  = T[lang]?.nav || T.en.nav;

  // ── Phase
  const [phase, setPhase] = useState('intro'); // 'intro' | 'question' | 'results'

  // ── Per-question state
  const [qIdx,      setQIdx]      = useState(0);
  const [playsLeft, setPlaysLeft] = useState(MAX_PLAYS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerLeft, setTimerLeft] = useState(0);
  const [selected,  setSelected]  = useState(null);  // option index chosen, or null
  const [submitted, setSubmitted] = useState(false);  // locked in

  // ── Results
  const [answers, setAnswers] = useState([]); // array of chosen indices (null = timed out)

  const timerRef   = useRef(null);
  const advanceRef = useRef(null);

  const q = LISTENING_QUESTIONS[qIdx];

  // ── Reset per-question state when qIdx changes
  useEffect(() => {
    if (phase !== 'question') return;
    window.speechSynthesis?.cancel();
    setPlaysLeft(MAX_PLAYS);
    setIsPlaying(false);
    setSelected(null);
    setSubmitted(false);
    setTimerLeft(LISTENING_QUESTIONS[qIdx].timerSeconds);
    clearTimeout(advanceRef.current);
  }, [qIdx, phase]);

  // ── Countdown timer (runs while question is active and not yet submitted)
  useEffect(() => {
    if (phase !== 'question' || submitted) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, qIdx, submitted]);

  // ── Auto-submit when timer hits 0
  useEffect(() => {
    if (phase === 'question' && timerLeft === 0 && !submitted) {
      lockIn(null); // timed out — no answer
    }
  }, [timerLeft, phase, submitted]);

  // ── Lock in an answer (or null for timeout)
  const lockIn = useCallback((chosenIdx) => {
    clearInterval(timerRef.current);
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setSelected(chosenIdx);
    setSubmitted(true);

    setAnswers(prev => {
      const next = [...prev];
      next[qIdx] = chosenIdx;
      return next;
    });

    // Auto-advance after feedback delay
    advanceRef.current = setTimeout(() => {
      if (qIdx < TOTAL_QUESTIONS - 1) {
        setQIdx(i => i + 1);
      } else {
        // Tally XP
        const correct = [...Array(TOTAL_QUESTIONS)].filter((_, i) => {
          const ans = i === qIdx ? chosenIdx : answers[i];
          return ans === LISTENING_QUESTIONS[i].answer;
        }).length;
        addXP(correct * 3);
        setPhase('results');
      }
    }, ADVANCE_DELAY);
  }, [qIdx, answers, addXP]);

  // ── Play audio
  const handlePlay = useCallback(async () => {
    if (playsLeft <= 0 || isPlaying || submitted) return;
    setPlaysLeft(p => p - 1);
    setIsPlaying(true);
    await speakScript(q.script);
    setIsPlaying(false);
  }, [playsLeft, isPlaying, submitted, q]);

  const startTest = () => {
    setQIdx(0);
    setAnswers([]);
    setPhase('question');
  };

  const retry = () => {
    setQIdx(0);
    setAnswers([]);
    setSelected(null);
    setSubmitted(false);
    setPhase('question');
  };

  // ── Score calculation
  const score = answers.filter((a, i) => a === LISTENING_QUESTIONS[i].answer).length;
  const pct   = Math.round((score / TOTAL_QUESTIONS) * 100);

  // ─────────────────────────────────────────────
  // DARK WRAPPER (question screen)
  // ─────────────────────────────────────────────
  const DarkWrapper = ({ children }) => (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '5rem' }}>
      <Nav navT={navT} />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.25rem 1rem 0' }}>
        {children}
      </div>
    </div>
  );

  const LightWrapper = ({ children }) => (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '5rem' }}>
      <Nav navT={navT} />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 0' }}>
        {children}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────
  // INTRO
  // ─────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <LightWrapper>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #1E3A8A 100%)',
          borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.75rem', color: 'white',
          boxShadow: '0 6px 24px rgba(10,22,40,0.4)',
        }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>🎧</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.7rem', fontWeight: 800, margin: '0 0 0.4rem' }}>
            TEF Listening Test
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.78)', margin: '0 0 1.25rem', lineHeight: 1.6, fontSize: '0.92rem' }}>
            10 questions across A1–B2. Real exam pressure — limited replays, per-question timer.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[`🎯 ${TOTAL_QUESTIONS} questions`, '🔁 Max 2 replays', '⏱ Timed per question', '📋 Results + transcript'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '1rem', padding: '0.22rem 0.7rem', fontSize: '0.74rem', fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.25rem', border: '1.5px solid #E8F0FB' }}>
          <p style={{ margin: '0 0 0.9rem', fontWeight: 700, color: '#0A2540', fontSize: '0.9rem' }}>📋 Rules</p>
          {[
            { icon: '🔊', text: 'Press Play to hear the French audio. You may replay it at most once more (2 plays total).' },
            { icon: '⏱', text: 'Each question has a timer. When it runs out, you move to the next question automatically.' },
            { icon: '✅', text: 'Select your answer — you will get instant feedback, then the test advances on its own.' },
            { icon: '📊', text: 'At the end, see your score with full transcripts and explanations.' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: i < 3 ? '0.65rem' : 0 }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{r.icon}</span>
              <span style={{ color: '#4A5568', fontSize: '0.85rem', lineHeight: 1.55 }}>{r.text}</span>
            </div>
          ))}
        </div>

        {/* Question overview */}
        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.1rem 1.25rem', marginBottom: '1.5rem', border: '1.5px solid #E8F0FB' }}>
          <p style={{ margin: '0 0 0.75rem', fontWeight: 700, color: '#0A2540', fontSize: '0.88rem' }}>Question overview</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {LISTENING_QUESTIONS.map(q => (
              <div key={q.id} style={{
                background: LEVEL_BGS[q.level], borderRadius: '0.6rem',
                padding: '0.3rem 0.65rem', fontSize: '0.75rem',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}>
                <span style={{ color: LEVEL_COLORS[q.level], fontWeight: 700 }}>{q.level}</span>
                <span style={{ color: '#94A3B8' }}>{TYPE_ICONS[q.type]}</span>
                <span style={{ color: '#64748B' }}>{q.timerSeconds}s</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={startTest} style={{
          width: '100%', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
          color: 'white', border: 'none', borderRadius: '1rem',
          padding: '1.1rem', fontFamily: "'Outfit', sans-serif",
          fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
        }}>
          Start Test →
        </button>
        <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.78rem', marginTop: '0.75rem' }}>
          Make sure your volume is turned up before starting
        </p>
      </LightWrapper>
    );
  }

  // ─────────────────────────────────────────────
  // QUESTION
  // ─────────────────────────────────────────────
  if (phase === 'question' && q) {
    const levelColor = LEVEL_COLORS[q.level] || '#2563EB';
    const timedOut   = submitted && selected === null;

    return (
      <DarkWrapper>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 700 }}>
            Q {q.number} / {TOTAL_QUESTIONS}
          </span>
          <span style={{ background: levelColor, color: 'white', borderRadius: '0.4rem', padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 800 }}>
            {q.level}
          </span>
          <span style={{ color: '#475569', fontSize: '0.75rem' }}>{TYPE_ICONS[q.type]} {q.typeLabel}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem',
              color: timerLeft <= 5 ? '#EF4444' : timerLeft <= q.timerSeconds * 0.35 ? '#F59E0B' : '#22C55E',
            }}>
              {fmtTime(timerLeft)}
            </span>
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>⏱</span>
          </div>
        </div>

        {/* Timer bar */}
        <div style={{ marginBottom: '1rem' }}>
          <TimerBar timeLeft={submitted ? 0 : timerLeft} totalTime={q.timerSeconds} />
        </div>

        {/* Nav dots */}
        <div style={{ marginBottom: '1.25rem' }}>
          <NavDots total={TOTAL_QUESTIONS} current={qIdx} answers={answers} />
        </div>

        {/* Audio card */}
        <div style={{
          background: '#0F172A', borderRadius: '1.25rem', padding: '1.25rem',
          border: '1px solid #1E293B', marginBottom: '1.1rem',
          display: 'flex', alignItems: 'center', gap: '1.1rem',
        }}>
          <PlayButton
            playing={isPlaying}
            disabled={playsLeft <= 0 || submitted}
            onClick={handlePlay}
          />
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 0.3rem', fontWeight: 700, color: 'white', fontSize: '0.92rem' }}>
              {isPlaying ? 'Playing…' : playsLeft <= 0 ? 'No replays remaining' : 'Press to play audio'}
            </p>
            {/* Replay dots */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {Array.from({ length: MAX_PLAYS }, (_, i) => (
                <div key={i} style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: i < playsLeft ? '#2563EB' : '#1E293B',
                  border: '1.5px solid',
                  borderColor: i < playsLeft ? '#2563EB' : '#334155',
                  transition: 'all 0.3s',
                }} />
              ))}
              <span style={{ color: '#475569', fontSize: '0.75rem', marginLeft: '4px' }}>
                {playsLeft === 2 ? '2 plays available' : playsLeft === 1 ? '1 play left' : 'No replays'}
              </span>
            </div>
          </div>
          {isPlaying && (
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '24px' }}>
              {[0.5, 1, 0.7, 0.9, 0.6].map((h, i) => (
                <div key={i} style={{
                  width: '3px', height: `${h * 100}%`, background: '#2563EB', borderRadius: '2px',
                  animation: `waveBar ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                }} />
              ))}
              <style>{`@keyframes waveBar { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }`}</style>
            </div>
          )}
        </div>

        {/* Timed-out banner */}
        {timedOut && (
          <div style={{
            background: '#2A1A0A', border: '1px solid #92400E', borderRadius: '0.9rem',
            padding: '0.75rem 1rem', marginBottom: '1rem', color: '#FCD34D', fontSize: '0.85rem', fontWeight: 700,
          }}>
            ⏰ Time's up! — See the correct answer highlighted below.
          </div>
        )}

        {/* Question text */}
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 0.25rem', color: 'white', fontWeight: 700, fontSize: '1rem', lineHeight: 1.6 }}>
            {q.question}
          </p>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.83rem', fontStyle: 'italic' }}>
            {q.questionFr}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {q.options.map((opt, i) => (
            <OptionButton
              key={i}
              label={['A', 'B', 'C', 'D'][i]}
              text={opt}
              idx={i}
              selected={selected}
              correct={q.answer}
              submitted={submitted}
              onClick={lockIn}
            />
          ))}
        </div>

        {/* Advancing indicator */}
        {submitted && (
          <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.78rem', marginTop: '1rem', fontStyle: 'italic' }}>
            {qIdx < TOTAL_QUESTIONS - 1 ? 'Moving to next question…' : 'Calculating results…'}
          </p>
        )}
      </DarkWrapper>
    );
  }

  // ─────────────────────────────────────────────
  // RESULTS
  // ─────────────────────────────────────────────
  if (phase === 'results') {
    const scoreColor = pct >= 80 ? '#16A34A' : pct >= 60 ? '#D97706' : '#EF4444';
    const scoreMsg   = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good effort!' : 'Keep practising!';
    const clbHint    = pct >= 80 ? 'B1–B2 readiness' : pct >= 60 ? 'A2–B1 readiness' : 'A1–A2 level — more practice needed';

    return (
      <LightWrapper>
        {/* Score card */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1628, #1E293B)',
          borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.5rem',
          color: 'white', textAlign: 'center',
          boxShadow: '0 6px 24px rgba(10,22,40,0.4)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>
            {pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: '4rem', fontWeight: 900,
            color: scoreColor, lineHeight: 1,
            textShadow: `0 0 30px ${scoreColor}66`,
          }}>{score}/{TOTAL_QUESTIONS}</div>
          <div style={{ color: '#94A3B8', fontSize: '1rem', marginBottom: '0.5rem' }}>{pct}% correct</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: scoreColor, marginBottom: '0.5rem' }}>
            {scoreMsg}
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.06)', borderRadius: '0.75rem',
            padding: '0.5rem 1rem', display: 'inline-block',
            color: '#94A3B8', fontSize: '0.82rem',
          }}>
            📊 {clbHint}
          </div>
        </div>

        {/* Per-question breakdown */}
        <p style={{ margin: '0 0 0.75rem', fontWeight: 700, color: '#0A2540', fontSize: '0.92rem' }}>
          Question Breakdown
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {LISTENING_QUESTIONS.map((q, i) => {
            const chosen    = answers[i];
            const isCorrect = chosen === q.answer;
            const isSkipped = chosen === null || chosen === undefined;
            const levelColor = LEVEL_COLORS[q.level];

            return (
              <ResultCard
                key={q.id}
                q={q} chosen={chosen} isCorrect={isCorrect}
                isSkipped={isSkipped} levelColor={levelColor} num={i + 1}
              />
            );
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={retry} style={{
            flex: 1, background: 'white', color: '#1E3A8A',
            border: '1.5px solid #BFDBFE', borderRadius: '0.9rem',
            padding: '0.85rem', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
          }}>🔄 Retry Test</button>
          <Link href="/listen" style={{
            flex: 1, background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
            color: 'white', borderRadius: '0.9rem',
            padding: '0.85rem', fontWeight: 800, fontSize: '0.9rem',
            textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>← Listen Hub</Link>
        </div>
      </LightWrapper>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Result card (per question in results screen)
// ─────────────────────────────────────────────────────────────────────────────
function ResultCard({ q, chosen, isCorrect, isSkipped, levelColor, num }) {
  const [open, setOpen] = useState(false);
  const LABELS = ['A', 'B', 'C', 'D'];

  return (
    <div style={{
      background: 'white', borderRadius: '1.25rem',
      border: `1.5px solid ${isCorrect ? '#BBF7D0' : '#FECACA'}`,
      overflow: 'hidden',
    }}>
      {/* Summary row */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '1rem 1.1rem', background: 'transparent',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left',
        }}
      >
        <span style={{
          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
          background: isCorrect ? '#16A34A' : isSkipped ? '#94A3B8' : '#EF4444',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '0.9rem', fontWeight: 800,
        }}>
          {isCorrect ? '✓' : isSkipped ? '–' : '✗'}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
            <span style={{ fontWeight: 700, color: '#0A2540', fontSize: '0.88rem' }}>Q{num}</span>
            <span style={{ background: levelColor, color: 'white', borderRadius: '0.35rem', padding: '0.08rem 0.4rem', fontSize: '0.68rem', fontWeight: 700 }}>{q.level}</span>
            <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>{TYPE_ICONS[q.type]} {q.typeLabel}</span>
          </div>
          <p style={{ margin: 0, color: '#4A5568', fontSize: '0.82rem', lineHeight: 1.4 }}>{q.question}</p>
        </div>
        <span style={{ color: '#94A3B8', fontSize: '0.72rem', background: '#F1F5F9', borderRadius: '0.4rem', padding: '0.2rem 0.5rem', flexShrink: 0 }}>
          {open ? 'Hide ▲' : 'Details ▼'}
        </span>
      </button>

      {/* Expanded details */}
      {open && (
        <div style={{ padding: '0 1.1rem 1.1rem', borderTop: '1px solid #F1F5F9' }}>
          {/* Answer summary */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.85rem', marginBottom: '0.85rem' }}>
            <div style={{ background: '#F0FDF4', borderRadius: '0.6rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              <span style={{ color: '#16A34A', fontWeight: 700 }}>✓ Correct: </span>
              <span style={{ color: '#15803D' }}>{LABELS[q.answer]}. {q.options[q.answer]}</span>
            </div>
            {!isSkipped && !isCorrect && (
              <div style={{ background: '#FEF2F2', borderRadius: '0.6rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>✗ Your answer: </span>
                <span style={{ color: '#DC2626' }}>{LABELS[chosen]}. {q.options[chosen]}</span>
              </div>
            )}
            {isSkipped && (
              <div style={{ background: '#F8FAFC', borderRadius: '0.6rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#94A3B8', fontWeight: 700 }}>— Skipped (time ran out)</span>
              </div>
            )}
          </div>

          {/* Explanation */}
          <div style={{ background: '#FFFBEB', borderRadius: '0.75rem', padding: '0.65rem 0.85rem', marginBottom: '0.85rem', border: '1px solid #FDE68A' }}>
            <p style={{ margin: '0 0 0.2rem', fontSize: '0.72rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' }}>💡 Explanation</p>
            <p style={{ margin: 0, color: '#78350F', fontSize: '0.83rem', lineHeight: 1.6 }}>{q.explanation}</p>
          </div>

          {/* Transcript */}
          <div style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <div style={{ background: '#0F172A', padding: '0.6rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🇫🇷 French Transcript</span>
              <button onClick={() => speakScript(q.script, 0.82)} style={{
                background: '#1E293B', color: '#2563EB', border: 'none',
                borderRadius: '0.4rem', padding: '0.2rem 0.55rem', fontSize: '0.72rem',
                fontWeight: 700, cursor: 'pointer',
              }}>▶ Listen</button>
            </div>
            <div style={{ background: '#0F172A', padding: '0.7rem 0.85rem', borderTop: '1px solid #1E293B' }}>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.83rem', lineHeight: 1.7, fontStyle: 'italic' }}>{q.script}</p>
            </div>
            <div style={{ background: '#F8FAFC', padding: '0.6rem 0.85rem', borderTop: '1px solid #E2E8F0' }}>
              <p style={{ margin: '0 0 0.2rem', fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>🇬🇧 English</p>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.83rem', lineHeight: 1.65 }}>{q.scriptEn}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

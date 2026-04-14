'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Nav from '../../../components/Nav';
import { useApp } from '../../../components/AppProvider';
import { T } from '../../../lib/i18n';
import { cleanForSpeech } from '../../../lib/cleanForSpeech';
import {
  SPEAKING_PRACTICE_TASKS, LEVELS, LEVEL_COLORS, LEVEL_BGS,
  getTasksByLevel, formatDuration,
} from '../../../lib/speakingPracticeData';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function speakFr(text, rate = 0.85) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(cleanForSpeech(text));
  u.lang = 'fr-CA'; u.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const fr = voices.find(v => v.lang === 'fr-CA') || voices.find(v => v.lang.startsWith('fr')) || null;
  if (fr) u.voice = fr;
  window.speechSynthesis.speak(u);
}

// ─────────────────────────────────────────────────────────────────────────────
// MicIcon
// ─────────────────────────────────────────────────────────────────────────────
function MicIcon({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="9" y1="22" x2="15" y2="22" />
    </svg>
  );
}

function StopIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="3" />
    </svg>
  );
}

function PlayIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function PauseIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="3" width="4" height="18" rx="1.5" />
      <rect x="15" y="3" width="4" height="18" rx="1.5" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Waveform animation (recording indicator)
// ─────────────────────────────────────────────────────────────────────────────
function WaveformBars() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '28px' }}>
      {[0.4, 0.8, 1.0, 0.7, 0.5, 0.9, 0.6, 1.0, 0.45, 0.75].map((h, i) => (
        <div
          key={i}
          style={{
            width: '3px',
            height: `${h * 100}%`,
            background: '#EF4444',
            borderRadius: '2px',
            animation: `waveBar ${0.5 + i * 0.07}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.3); opacity: 0.6; }
          to   { transform: scaleY(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Task selection card
// ─────────────────────────────────────────────────────────────────────────────
function TaskCard({ task, onSelect }) {
  const color = LEVEL_COLORS[task.level] || '#2563EB';
  const bg    = LEVEL_BGS[task.level]   || '#EFF6FF';
  return (
    <div
      onClick={() => onSelect(task)}
      style={{
        background: 'white',
        border: `1.5px solid #E8F0FB`,
        borderRadius: '1.25rem',
        padding: '1.1rem',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          background: bg, borderRadius: '0.65rem', width: '40px', height: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', flexShrink: 0,
        }}>{task.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{
              background: color, color: 'white', borderRadius: '0.4rem',
              padding: '0.1rem 0.45rem', fontSize: '0.68rem', fontWeight: 700,
            }}>{task.level}</span>
            <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>{task.category}</span>
          </div>
        </div>
      </div>
      <p style={{ color: '#1E293B', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
        {task.prompt}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>⏱ {formatDuration(task.duration)}</span>
          <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>⚡ {task.xp} XP</span>
        </div>
        <span style={{ color: color, fontSize: '0.8rem', fontWeight: 700 }}>Practice →</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Starter chip
// ─────────────────────────────────────────────────────────────────────────────
function StarterChip({ starter, onSpeak }) {
  const [active, setActive] = useState(false);
  const handleClick = () => {
    setActive(true);
    onSpeak(starter.fr);
    setTimeout(() => setActive(false), 1800);
  };
  return (
    <button
      onClick={handleClick}
      style={{
        background: active ? '#1E3A8A' : '#EFF6FF',
        color: active ? 'white' : '#1E3A8A',
        border: `1.5px solid ${active ? '#1E3A8A' : '#BFDBFE'}`,
        borderRadius: '2rem',
        padding: '0.45rem 0.9rem',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        textAlign: 'left',
      }}
    >
      <span style={{ fontSize: '0.75rem', opacity: 0.75 }}>🔊</span>
      <span>{starter.fr}</span>
      <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>— {starter.en}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom audio player for playback
// ─────────────────────────────────────────────────────────────────────────────
function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded    = () => setDuration(audio.duration || 0);
    const onEnded     = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('durationchange', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('durationchange', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else         { audio.play(); setPlaying(true); }
  };

  const onSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      background: '#F8FAFC', borderRadius: '1rem', padding: '1rem 1.25rem',
      border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={togglePlay}
        style={{
          background: '#1E3A8A', color: 'white', border: 'none',
          borderRadius: '50%', width: '44px', height: '44px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 8px rgba(30,58,138,0.3)',
        }}
      >
        {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
      </button>

      <div style={{ flex: 1 }}>
        {/* Progress bar */}
        <div
          onClick={onSeek}
          style={{
            height: '6px', background: '#E2E8F0', borderRadius: '3px',
            cursor: 'pointer', position: 'relative', marginBottom: '0.35rem',
          }}
        >
          <div style={{
            height: '100%', background: '#1E3A8A', borderRadius: '3px',
            width: `${pct}%`, transition: 'width 0.1s',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: `${pct}%`,
            transform: 'translate(-50%, -50%)',
            width: '12px', height: '12px', background: '#1E3A8A',
            borderRadius: '50%', border: '2px solid white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
          <span>{fmtTime(Math.floor(currentTime))}</span>
          <span>{duration > 0 ? fmtTime(Math.floor(duration)) : '--:--'}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function SpeakingPracticePage() {
  const { state, addXP } = useApp();
  const lang = state?.lang || 'en';
  const navT = T[lang]?.nav || T.en.nav;

  // ── Phase: 'select' | 'practice'
  const [phase, setPhase] = useState('select');
  const [levelFilter, setLevelFilter] = useState('All');
  const [task, setTask] = useState(null);

  // ── Sample answer toggle
  const [showSample, setShowSample] = useState(false);

  // ── Recording state: 'idle' | 'requesting' | 'recording' | 'stopped'
  const [recState, setRecState] = useState('idle');
  const [recTime,  setRecTime]  = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [permError, setPermError] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef        = useRef(null);
  const chunksRef        = useRef([]);
  const timerRef         = useRef(null);

  // Cleanup on unmount or task change
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const resetRecording = useCallback(() => {
    clearInterval(timerRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch(_) {}
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecState('idle');
    setRecTime(0);
    setPermError(false);
    setXpAwarded(false);
    setShowSample(false);
  }, [audioUrl]);

  const selectTask = (t) => {
    resetRecording();
    setTask(t);
    setPhase('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToSelect = () => {
    resetRecording();
    setTask(null);
    setPhase('select');
  };

  // ── Start recording
  const startRecording = useCallback(async () => {
    setPermError(false);
    setRecState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Try common MIME types
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
        .find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
        const url  = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecState('stopped');
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start(100);
      setRecState('recording');
      setRecTime(0);
      timerRef.current = setInterval(() => setRecTime(t => t + 1), 1000);

    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') setPermError(true);
      setRecState('idle');
    }
  }, []);

  // ── Stop recording
  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Award XP when first recording is saved
  useEffect(() => {
    if (recState === 'stopped' && audioUrl && !xpAwarded && task) {
      addXP(task.xp || 5);
      setXpAwarded(true);
    }
  }, [recState, audioUrl, xpAwarded, task, addXP]);

  const filteredTasks = getTasksByLevel(levelFilter);

  // ─────────────────────────────────────────────
  // SELECT SCREEN
  // ─────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFEF5', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '6rem' }}>
        <Nav navT={navT} />
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem 0' }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #BE185D 0%, #7C3AED 100%)',
            borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.75rem', color: 'white',
            boxShadow: '0 6px 24px rgba(124,58,237,0.3)',
          }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>🎙️</div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.7rem', margin: '0 0 0.4rem', fontWeight: 800 }}>
              Speaking Practice
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', margin: '0 0 1.25rem', lineHeight: 1.6, fontSize: '0.92rem' }}>
              Short daily drills — read a prompt, record your answer, play it back, and listen to a sample.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {['🎤 Browser mic', '▶ Instant playback', '💬 Sample answer', '📝 Sentence starters'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.18)', borderRadius: '1rem',
                  padding: '0.25rem 0.7rem', fontSize: '0.75rem', fontWeight: 600,
                }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Level filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {['All', 'A1', 'A2', 'B1', 'B2'].map(lv => {
              const active = levelFilter === lv;
              const color  = lv === 'All' ? '#475569' : LEVEL_COLORS[lv];
              return (
                <button
                  key={lv}
                  onClick={() => setLevelFilter(lv)}
                  style={{
                    background: active ? (lv === 'All' ? '#475569' : LEVEL_COLORS[lv]) : 'white',
                    color: active ? 'white' : (lv === 'All' ? '#475569' : LEVEL_COLORS[lv]),
                    border: `1.5px solid ${lv === 'All' ? '#CBD5E0' : LEVEL_COLORS[lv]}`,
                    borderRadius: '2rem', padding: '0.35rem 1rem',
                    fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >{lv === 'All' ? 'All levels' : lv}</button>
              );
            })}
            <span style={{ marginLeft: 'auto', color: '#94A3B8', fontSize: '0.8rem', alignSelf: 'center' }}>
              {filteredTasks.length} tasks
            </span>
          </div>

          {/* Task grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {filteredTasks.map(t => (
              <TaskCard key={t.id} task={t} onSelect={selectTask} />
            ))}
          </div>

          {/* Link to full TEF exam */}
          <div style={{
            background: 'white', borderRadius: '1.25rem', padding: '1.25rem',
            border: '1.5px solid #E8F0FB', display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <span style={{ fontSize: '1.8rem' }}>🏆</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#0A2540', fontSize: '0.9rem' }}>Ready for the real exam?</p>
              <p style={{ margin: '0.1rem 0 0', color: '#64748B', fontSize: '0.82rem' }}>Try the full TEF Speaking simulation with AI feedback.</p>
            </div>
            <Link href="/speak" style={{
              background: '#BE185D', color: 'white', borderRadius: '0.75rem',
              padding: '0.5rem 1rem', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap',
            }}>TEF Exam →</Link>
          </div>

        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // PRACTICE SCREEN
  // ─────────────────────────────────────────────
  const color = LEVEL_COLORS[task?.level] || '#2563EB';
  const bg    = LEVEL_BGS[task?.level]    || '#EFF6FF';

  return (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '7rem' }}>
      <Nav navT={navT} />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 0' }}>

        {/* Back + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <button
            onClick={backToSelect}
            style={{
              background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '0.75rem',
              padding: '0.4rem 0.85rem', fontWeight: 700, fontSize: '0.82rem',
              color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
          >
            ← Tasks
          </button>
          <span style={{
            background: color, color: 'white', borderRadius: '0.5rem',
            padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: 700,
          }}>{task?.level}</span>
          <span style={{ color: '#64748B', fontSize: '0.82rem' }}>{task?.category}</span>
          <span style={{ marginLeft: 'auto', background: '#FFF7ED', color: '#C2410C', borderRadius: '1rem', padding: '0.2rem 0.65rem', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #FED7AA' }}>
            ⚡ {task?.xp} XP
          </span>
        </div>

        {/* Prompt card */}
        <div style={{
          background: 'white', borderRadius: '1.25rem', padding: '1.5rem',
          border: `2px solid ${color}22`, marginBottom: '1.1rem',
          boxShadow: `0 2px 12px ${color}14`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
            <div style={{
              background: bg, borderRadius: '0.75rem', width: '48px', height: '48px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', flexShrink: 0,
            }}>{task?.icon}</div>
            <div>
              <p style={{ margin: '0 0 0.5rem', color: '#1E293B', fontWeight: 700, fontSize: '1rem', lineHeight: 1.5 }}>
                {task?.prompt}
              </p>
              <p style={{ margin: 0, color: '#64748B', fontSize: '0.83rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                {task?.promptFr}
              </p>
            </div>
          </div>
          {task?.tips?.length > 0 && (
            <div style={{
              marginTop: '1rem', background: '#FFFBEB', borderRadius: '0.75rem',
              padding: '0.7rem 0.9rem', border: '1px solid #FDE68A',
              fontSize: '0.8rem', color: '#92400E',
            }}>
              💡 <strong>Tip:</strong> {task.tips[0]}
            </div>
          )}
        </div>

        {/* Sentence starters */}
        <div style={{
          background: 'white', borderRadius: '1.25rem', padding: '1.1rem 1.25rem',
          border: '1.5px solid #E8F0FB', marginBottom: '1.1rem',
        }}>
          <p style={{ margin: '0 0 0.75rem', fontWeight: 700, color: '#0A2540', fontSize: '0.88rem' }}>
            💬 Sentence Starters — tap to hear pronunciation
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {task?.starters?.map((s, i) => (
              <StarterChip key={i} starter={s} onSpeak={speakFr} />
            ))}
          </div>
        </div>

        {/* Sample answer (collapsible) */}
        <div style={{
          background: 'white', borderRadius: '1.25rem',
          border: '1.5px solid #E8F0FB', marginBottom: '1.1rem', overflow: 'hidden',
        }}>
          <button
            onClick={() => setShowSample(s => !s)}
            style={{
              width: '100%', padding: '1rem 1.25rem', background: 'transparent', border: 'none',
              cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontWeight: 700, color: '#0A2540', fontSize: '0.88rem',
            }}
          >
            <span>👁 Sample Answer</span>
            <span style={{ fontSize: '0.7rem', color: '#94A3B8', background: '#F1F5F9', borderRadius: '0.4rem', padding: '0.2rem 0.5rem' }}>
              {showSample ? 'Hide ▲' : 'Show ▼'}
            </span>
          </button>
          {showSample && task?.sampleAnswer && (
            <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #F1F5F9' }}>
              {/* French */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', paddingTop: '0.9rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🇫🇷 French</span>
                <button
                  onClick={() => speakFr(task.sampleAnswer.fr, 0.82)}
                  style={{
                    background: bg, color: color, border: 'none', borderRadius: '0.5rem',
                    padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                  }}
                >▶ Listen</button>
              </div>
              <p style={{ margin: '0 0 0.85rem', color: '#1E293B', fontSize: '0.88rem', lineHeight: 1.7, background: bg, padding: '0.85rem 1rem', borderRadius: '0.75rem' }}>
                {task.sampleAnswer.fr}
              </p>
              {/* English */}
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🇬🇧 English</span>
              <p style={{ margin: '0.4rem 0 0', color: '#64748B', fontSize: '0.85rem', lineHeight: 1.65, fontStyle: 'italic' }}>
                {task.sampleAnswer.en}
              </p>
            </div>
          )}
        </div>

        {/* ── RECORDING SECTION ── */}
        <div style={{
          background: 'white', borderRadius: '1.5rem', padding: '1.75rem 1.25rem',
          border: '1.5px solid #E8F0FB', marginBottom: '1.1rem',
          textAlign: 'center',
        }}>
          <p style={{ margin: '0 0 1.25rem', fontWeight: 700, color: '#0A2540', fontSize: '0.92rem' }}>
            🎙️ Your Recording
          </p>

          {/* IDLE */}
          {recState === 'idle' && (
            <>
              <button
                onClick={startRecording}
                style={{
                  background: 'linear-gradient(135deg, #BE185D, #7C3AED)',
                  color: 'white', border: 'none', borderRadius: '50%',
                  width: '88px', height: '88px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', margin: '0 auto 1rem',
                  boxShadow: '0 4px 20px rgba(190,24,93,0.4)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
              >
                <MicIcon size={32} color="white" />
              </button>
              <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>Tap to start recording</p>
              <p style={{ color: '#94A3B8', fontSize: '0.76rem', marginTop: '0.3rem' }}>
                Suggested: {formatDuration(task?.duration)} · Microphone access required
              </p>
              {permError && (
                <div style={{
                  marginTop: '1rem', background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#DC2626', fontSize: '0.82rem',
                }}>
                  ⚠️ Microphone access was denied. Please allow microphone access in your browser settings and try again.
                </div>
              )}
            </>
          )}

          {/* REQUESTING */}
          {recState === 'requesting' && (
            <>
              <div style={{
                width: '88px', height: '88px', borderRadius: '50%',
                background: '#F1F5F9', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 1rem',
                animation: 'spin 1s linear infinite',
              }}>
                <MicIcon size={30} color="#64748B" />
              </div>
              <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>Requesting microphone…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </>
          )}

          {/* RECORDING */}
          {recState === 'recording' && (
            <>
              {/* Pulsing ring */}
              <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto 1rem' }}>
                <div style={{
                  position: 'absolute', inset: '-8px', borderRadius: '50%',
                  border: '3px solid #EF4444', opacity: 0.5,
                  animation: 'pulse-ring 1.2s ease-out infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: '-16px', borderRadius: '50%',
                  border: '2px solid #EF4444', opacity: 0.25,
                  animation: 'pulse-ring 1.2s ease-out infinite 0.3s',
                }} />
                <div style={{
                  width: '88px', height: '88px', borderRadius: '50%',
                  background: '#EF4444', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 4px 16px rgba(239,68,68,0.45)',
                }}>
                  <MicIcon size={32} color="white" />
                </div>
              </div>
              <style>{`
                @keyframes pulse-ring {
                  0%   { transform: scale(0.95); opacity: 0.5; }
                  70%  { transform: scale(1.15); opacity: 0; }
                  100% { transform: scale(1.15); opacity: 0; }
                }
              `}</style>

              {/* Timer */}
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontSize: '2.4rem', fontWeight: 800,
                color: '#EF4444', margin: '0 0 0.75rem', letterSpacing: '0.04em',
              }}>
                {fmtTime(recTime)}
              </div>

              {/* Waveform */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <WaveformBars />
              </div>

              {/* Stop button */}
              <button
                onClick={stopRecording}
                style={{
                  background: '#EF4444', color: 'white', border: 'none',
                  borderRadius: '0.9rem', padding: '0.75rem 2rem',
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: '0 3px 12px rgba(239,68,68,0.35)',
                }}
              >
                <StopIcon size={18} /> Stop Recording
              </button>
            </>
          )}

          {/* STOPPED — playback */}
          {recState === 'stopped' && audioUrl && (
            <>
              {/* Saved confirmation row */}
              <div style={{
                background: '#F0FDF4', borderRadius: '1rem', padding: '0.7rem 1rem',
                border: '1.5px solid #BBF7D0', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
              }}>
                <span style={{ fontSize: '1.1rem' }}>✅</span>
                <span style={{ color: '#15803D', fontSize: '0.85rem', fontWeight: 700 }}>
                  Recording saved —
                </span>
                <span style={{ color: '#15803D', fontSize: '0.85rem', fontWeight: 400 }}>
                  {fmtTime(recTime)} recorded
                </span>
                {xpAwarded && (
                  <span style={{
                    marginLeft: 'auto', background: '#FFF7ED', color: '#C2410C',
                    borderRadius: '1rem', padding: '0.15rem 0.6rem', fontSize: '0.75rem',
                    fontWeight: 700, border: '1px solid #FED7AA', whiteSpace: 'nowrap',
                  }}>+{task?.xp} XP</span>
                )}
              </div>

              {/* Encouragement card */}
              <div style={{
                background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)',
                border: '1.5px solid #FDE68A',
                borderRadius: '1rem',
                padding: '1rem 1.1rem',
                marginBottom: '1rem',
              }}>
                <p style={{ margin: '0 0 0.3rem', fontWeight: 800, color: '#92400E', fontSize: '0.92rem' }}>
                  👏 Good attempt!
                </p>
                <p style={{ margin: '0 0 0.75rem', color: '#78350F', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Listen back carefully — notice your rhythm, word stress, and any sounds that felt uncertain.
                  Pronunciation improves most through <strong>hearing yourself</strong> and repeating.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {[
                    'Listen to your recording below',
                    'Open the Sample Answer and compare pronunciation',
                    'Re-record and try to sound closer to the sample',
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <span style={{
                        background: '#D97706', color: 'white', borderRadius: '50%',
                        width: '20px', height: '20px', fontSize: '0.68rem', fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px',
                      }}>{i + 1}</span>
                      <span style={{ color: '#78350F', fontSize: '0.82rem', lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Playback controls */}
              <AudioPlayer src={audioUrl} />

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={resetRecording}
                  style={{
                    background: 'white', color: '#475569', border: '1.5px solid #CBD5E0',
                    borderRadius: '0.75rem', padding: '0.6rem 1.2rem',
                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                  }}
                >
                  🔄 Re-record
                </button>
                <button
                  onClick={() => { setShowSample(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    background: color, color: 'white', border: 'none',
                    borderRadius: '0.75rem', padding: '0.6rem 1.2rem',
                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    boxShadow: `0 2px 8px ${color}44`,
                  }}
                >
                  👁 Compare Sample Answer
                </button>
              </div>
            </>
          )}
        </div>

        {/* Next task */}
        {recState === 'stopped' && (
          <div style={{
            background: 'white', borderRadius: '1.25rem', padding: '1rem 1.25rem',
            border: '1.5px solid #E8F0FB', display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#0A2540', fontSize: '0.88rem' }}>
                Satisfied with your recording?
              </p>
              <p style={{ margin: '0.1rem 0 0', color: '#64748B', fontSize: '0.78rem' }}>
                Try another task or re-record to keep improving.
              </p>
            </div>
            <button
              onClick={backToSelect}
              style={{
                background: '#1E3A8A', color: 'white', border: 'none',
                borderRadius: '0.75rem', padding: '0.55rem 1.1rem',
                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Next Task →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

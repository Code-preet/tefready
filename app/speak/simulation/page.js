'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Nav from '../../../components/Nav';
import { useApp } from '../../../components/AppProvider';
import { T } from '../../../lib/i18n';
import { cleanForSpeech } from '../../../lib/cleanForSpeech';
import { SIMULATIONS } from '../../../lib/tefSimulationData';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function speakFr(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(cleanForSpeech(text));
  u.lang = 'fr-CA'; u.rate = 0.84;
  const fr = window.speechSynthesis.getVoices().find(v => v.lang === 'fr-CA')
    || window.speechSynthesis.getVoices().find(v => v.lang.startsWith('fr'))
    || null;
  if (fr) u.voice = fr;
  window.speechSynthesis.speak(u);
}

// ─────────────────────────────────────────────────────────────────────────────
// Circular countdown timer
// ─────────────────────────────────────────────────────────────────────────────
function CircularTimer({ timeLeft, totalTime, label, size = 160 }) {
  const r  = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const pct = totalTime > 0 ? timeLeft / totalTime : 0;
  const dashOffset = circumference * (1 - pct);

  const color =
    timeLeft <= 10              ? '#EF4444' :
    timeLeft <= totalTime * 0.3 ? '#F59E0B' :
    '#22C55E';

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1E293B" strokeWidth={10} />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: size > 130 ? '2.6rem' : '1.6rem',
          fontWeight: 800, color, lineHeight: 1,
          textShadow: `0 0 20px ${color}66`,
        }}>
          {fmtTime(timeLeft)}
        </span>
        {label && (
          <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Waveform during recording
// ─────────────────────────────────────────────────────────────────────────────
function RecordingWave() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '32px' }}>
      {[0.5, 0.9, 0.7, 1.0, 0.6, 0.85, 0.45, 0.95, 0.65, 0.8, 0.5, 0.9].map((h, i) => (
        <div key={i} style={{
          width: '4px',
          height: `${h * 100}%`,
          background: '#EF4444',
          borderRadius: '2px',
          animation: `wave ${0.45 + i * 0.06}s ease-in-out infinite alternate`,
        }} />
      ))}
      <style>{`
        @keyframes wave {
          from { transform: scaleY(0.25); opacity: 0.5; }
          to   { transform: scaleY(1);    opacity: 1;   }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Audio playback player
// ─────────────────────────────────────────────────────────────────────────────
function AudioPlayer({ src, label = 'Your Recording' }) {
  const audioRef = useRef(null);
  const [playing, setPlaying]     = useState(false);
  const [current, setCurrent]     = useState(0);
  const [duration, setDuration]   = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onLoad = () => setDuration(a.duration || 0);
    const onEnd  = () => setPlaying(false);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onLoad);
    a.addEventListener('durationchange', onLoad);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onLoad);
      a.removeEventListener('durationchange', onLoad);
      a.removeEventListener('ended', onEnd);
    };
  }, [src]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else         { a.play();  setPlaying(true); }
  };

  const seek = (e) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const r   = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    a.currentTime = pct * duration;
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div style={{ background: '#0F172A', borderRadius: '1rem', padding: '1rem 1.25rem', border: '1px solid #1E293B' }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        🎙 {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={toggle} style={{
          background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%',
          width: '42px', height: '42px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
          boxShadow: '0 2px 10px rgba(239,68,68,0.4)',
        }}>
          {playing
            ? <svg width={16} height={16} viewBox="0 0 24 24" fill="white"><rect x="5" y="3" width="4" height="18" rx="1.5"/><rect x="15" y="3" width="4" height="18" rx="1.5"/></svg>
            : <svg width={16} height={16} viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
          }
        </button>
        <div style={{ flex: 1 }}>
          <div onClick={seek} style={{
            height: '5px', background: '#1E293B', borderRadius: '3px',
            cursor: 'pointer', position: 'relative', marginBottom: '0.3rem',
          }}>
            <div style={{ height: '100%', background: '#EF4444', borderRadius: '3px', width: `${pct}%` }} />
            <div style={{
              position: 'absolute', top: '50%', left: `${pct}%`,
              transform: 'translate(-50%,-50%)',
              width: '11px', height: '11px', background: 'white',
              borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>
            <span>{fmtTime(Math.floor(current))}</span>
            <span>{duration > 0 ? fmtTime(Math.floor(duration)) : '--:--'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Structure guide
// ─────────────────────────────────────────────────────────────────────────────
function StructureGuide({ structure }) {
  const [open, setOpen] = useState(null);
  const steps = [
    { key: 'introduction', label: 'Introduction',  icon: '1️⃣', color: '#0891B2' },
    { key: 'mainIdea',     label: 'Main Idea',      icon: '2️⃣', color: '#7C3AED' },
    { key: 'example',      label: 'Example',         icon: '3️⃣', color: '#D97706' },
    { key: 'conclusion',   label: 'Conclusion',      icon: '4️⃣', color: '#16A34A' },
  ];
  return (
    <div style={{ background: '#0F172A', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #1E293B' }}>
      <p style={{ margin: 0, padding: '0.85rem 1.1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #1E293B' }}>
        📐 Answer Structure
      </p>
      {steps.map((s, i) => (
        <div key={s.key} style={{ borderBottom: i < steps.length - 1 ? '1px solid #1E293B' : 'none' }}>
          <button
            onClick={() => setOpen(open === s.key ? null : s.key)}
            style={{
              width: '100%', padding: '0.8rem 1.1rem', background: 'transparent', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{s.icon}</span>
            <span style={{ flex: 1, fontWeight: 700, color: s.color, fontSize: '0.85rem' }}>{s.label}</span>
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>{open === s.key ? '▲' : '▼'}</span>
          </button>
          {open === s.key && (
            <div style={{ padding: '0 1.1rem 0.9rem 2.85rem' }}>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.83rem', lineHeight: 1.65 }}>
                {structure[s.key]}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function SimulationPage() {
  const { state, addXP } = useApp();
  const lang  = state?.lang || 'en';
  const navT  = T[lang]?.nav || T.en.nav;

  // ── top-level phase
  const [phase, setPhase]           = useState('pick');         // 'pick' | 'intro' | 'prep' | 'speaking' | 'review' | 'complete'
  const [simulation, setSimulation] = useState(null);
  const [taskIdx, setTaskIdx]       = useState(0);

  // ── timers
  const [prepLeft, setPrepLeft]     = useState(0);
  const [speakLeft, setSpeakLeft]   = useState(0);

  // ── recording
  const [micReady, setMicReady]     = useState(false);
  const [micError, setMicError]     = useState(false);
  const [recordings, setRecordings] = useState({});           // { taskIdx: url }
  const [recDuration, setRecDuration] = useState({});         // { taskIdx: seconds }

  // ── review
  const [showSample, setShowSample] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef        = useRef(null);
  const chunksRef        = useRef([]);
  const prepTimerRef     = useRef(null);
  const speakTimerRef    = useRef(null);
  const speakSecondsRef  = useRef(0);

  const task = simulation?.tasks[taskIdx] ?? null;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(prepTimerRef.current);
      clearInterval(speakTimerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      Object.values(recordings).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // ── Request microphone (called when starting a simulation)
  const requestMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicReady(true);
      setMicError(false);
      return true;
    } catch {
      setMicError(true);
      return false;
    }
  }, []);

  // ── Start prep phase for current task
  const startPrep = useCallback((sim, idx) => {
    const t = sim.tasks[idx];
    setPrepLeft(t.prepTime);
    setPhase('prep');
    setShowSample(false);
    setShowPhrases(false);
  }, []);

  // ── Transition: prep → speaking (auto-recording starts)
  const startSpeaking = useCallback(() => {
    if (!streamRef.current) return;
    clearInterval(prepTimerRef.current);

    // Determine MIME type
    const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
      .find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || '';

    const recorder = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : undefined);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
      const url  = URL.createObjectURL(blob);
      setRecordings(prev => ({ ...prev, [taskIdx]: url }));
      setRecDuration(prev => ({ ...prev, [taskIdx]: speakSecondsRef.current }));
      setPhase('review');
    };

    speakSecondsRef.current = 0;
    recorder.start(100);
    setPhase('speaking');
    setSpeakLeft(simulation.tasks[taskIdx].speakTime);
  }, [simulation, taskIdx]);

  // ── Stop recording manually or auto
  const stopRecording = useCallback(() => {
    clearInterval(speakTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // ── Prep timer
  useEffect(() => {
    if (phase !== 'prep') return;
    clearInterval(prepTimerRef.current);
    prepTimerRef.current = setInterval(() => {
      setPrepLeft(t => {
        if (t <= 1) { clearInterval(prepTimerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(prepTimerRef.current);
  }, [phase]);

  // Auto-transition prep → speaking when timer hits 0
  useEffect(() => {
    if (phase === 'prep' && prepLeft === 0) startSpeaking();
  }, [prepLeft, phase, startSpeaking]);

  // ── Speaking timer
  useEffect(() => {
    if (phase !== 'speaking') return;
    clearInterval(speakTimerRef.current);
    speakTimerRef.current = setInterval(() => {
      speakSecondsRef.current += 1;
      setSpeakLeft(t => {
        if (t <= 1) { clearInterval(speakTimerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(speakTimerRef.current);
  }, [phase]);

  // Auto-stop when speaking timer hits 0
  useEffect(() => {
    if (phase === 'speaking' && speakLeft === 0) stopRecording();
  }, [speakLeft, phase, stopRecording]);

  // Award XP when each task review is reached
  useEffect(() => {
    if (phase === 'review' && task) addXP(task.clbLevel.includes('10') || task.clbLevel.includes('12') ? 20 : 15);
  }, [phase, taskIdx]);

  // ── Next task or finish
  const nextTask = () => {
    if (taskIdx < simulation.tasks.length - 1) {
      setTaskIdx(i => i + 1);
      startPrep(simulation, taskIdx + 1);
    } else {
      // Stop stream — we are done
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
      setPhase('complete');
    }
  };

  // ── Pick simulation and launch
  const pickSim = async (sim) => {
    setSimulation(sim);
    setTaskIdx(0);
    setRecordings({});
    setRecDuration({});
    setPhase('intro');
  };

  const launchSim = async () => {
    const ok = await requestMic();
    if (ok) startPrep(simulation, 0);
  };

  const reset = () => {
    clearInterval(prepTimerRef.current);
    clearInterval(speakTimerRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setMicReady(false);
    setMicError(false);
    setSimulation(null);
    setTaskIdx(0);
    setRecordings({});
    setRecDuration({});
    setPhase('pick');
  };

  // ─────────────────────────────────────────────
  // SHARED WRAPPER
  // ─────────────────────────────────────────────
  const Wrapper = ({ children, dark = false }) => (
    <div style={{
      minHeight: '100vh',
      background: dark ? '#0A1628' : '#FFFEF5',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      paddingBottom: '5rem',
    }}>
      <Nav navT={navT} />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 0' }}>
        {children}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────
  // PICK SCREEN
  // ─────────────────────────────────────────────
  if (phase === 'pick') {
    return (
      <Wrapper>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #1E3A8A 100%)',
          borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.75rem', color: 'white',
          boxShadow: '0 6px 24px rgba(10,22,40,0.4)',
        }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>🎙️</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.7rem', fontWeight: 800, margin: '0 0 0.4rem' }}>
            TEF Speaking Simulation
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '0 0 1.25rem', lineHeight: 1.6, fontSize: '0.92rem' }}>
            Real exam conditions — prep timer, auto-recording, structured feedback.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['⏱ Auto-timed', '🎤 Auto-records', '📋 Sample answers', '📐 Answer structure'].map(tag => (
              <span key={tag} style={{
                background: 'rgba(255,255,255,0.12)', borderRadius: '1rem',
                padding: '0.22rem 0.7rem', fontSize: '0.74rem', fontWeight: 600,
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.5rem', border: '1.5px solid #E8F0FB' }}>
          <p style={{ margin: '0 0 0.9rem', fontWeight: 700, color: '#0A2540', fontSize: '0.9rem' }}>📋 How it works</p>
          {[
            { icon: '📖', text: 'Read the task — you have preparation time to plan your answer' },
            { icon: '⏱', text: 'When prep ends, recording starts automatically' },
            { icon: '🎙', text: 'Speak until the timer runs out — or stop early' },
            { icon: '▶', text: 'Listen to your recording and compare with the sample answer' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: i < 3 ? '0.65rem' : 0 }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{s.icon}</span>
              <span style={{ color: '#4A5568', fontSize: '0.85rem', lineHeight: 1.55 }}>{s.text}</span>
            </div>
          ))}
        </div>

        {/* Simulation cards */}
        <p style={{ margin: '0 0 0.75rem', fontWeight: 700, color: '#0A2540', fontSize: '0.95rem' }}>Choose a simulation:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {SIMULATIONS.map(sim => (
            <button
              key={sim.id}
              onClick={() => pickSim(sim)}
              style={{
                background: 'white', border: `2px solid ${sim.color}33`,
                borderRadius: '1.25rem', padding: '1.25rem 1.5rem',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                display: 'flex', gap: '1rem', alignItems: 'center',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${sim.color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
            >
              <div style={{
                background: sim.bg, borderRadius: '0.9rem', width: '56px', height: '56px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', flexShrink: 0,
              }}>{sim.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#0A2540', fontSize: '1.05rem' }}>{sim.title}</span>
                  <span style={{ background: sim.color, color: 'white', borderRadius: '0.4rem', padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>{sim.level}</span>
                </div>
                <p style={{ margin: '0 0 0.6rem', color: '#64748B', fontSize: '0.83rem' }}>{sim.subtitle}</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {sim.tasks.map(t => (
                    <span key={t.id} style={{
                      background: sim.bg, color: sim.color,
                      borderRadius: '0.5rem', padding: '0.18rem 0.55rem',
                      fontSize: '0.72rem', fontWeight: 700,
                    }}>Task {t.number}: {t.type}</span>
                  ))}
                </div>
              </div>
              <span style={{ color: sim.color, fontSize: '1.3rem', flexShrink: 0 }}>→</span>
            </button>
          ))}
        </div>

        <Link href="/speak" style={{
          display: 'block', textAlign: 'center', color: '#94A3B8',
          fontSize: '0.83rem', textDecoration: 'none', padding: '0.5rem',
        }}>← Back to Speaking Hub</Link>
      </Wrapper>
    );
  }

  // ─────────────────────────────────────────────
  // INTRO SCREEN
  // ─────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <Wrapper dark>
        <button onClick={reset} style={{
          background: 'transparent', border: '1px solid #1E293B', color: '#64748B',
          borderRadius: '0.75rem', padding: '0.4rem 0.85rem', fontSize: '0.82rem',
          cursor: 'pointer', marginBottom: '1.25rem', fontWeight: 600,
        }}>← Simulations</button>

        <div style={{
          background: `linear-gradient(135deg, ${simulation.color}22, ${simulation.color}11)`,
          border: `1.5px solid ${simulation.color}44`, borderRadius: '1.5rem',
          padding: '2rem', marginBottom: '1.5rem', color: 'white',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{simulation.icon}</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.7rem', fontWeight: 800, margin: '0 0 0.3rem', color: 'white' }}>
            {simulation.title}
          </h1>
          <p style={{ color: '#94A3B8', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>{simulation.subtitle}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {simulation.tasks.map(t => (
              <div key={t.id} style={{
                background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem',
                padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, color: 'white', fontSize: '0.88rem' }}>Task {t.number}: {t.type}</span>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                    <span style={{ color: '#64748B', fontSize: '0.75rem' }}>⏳ {t.prepTime}s prep</span>
                    <span style={{ color: '#64748B', fontSize: '0.75rem' }}>🎙 {fmtTime(t.speakTime)} speaking</span>
                    <span style={{ color: simulation.color, fontSize: '0.75rem', fontWeight: 700 }}>{t.clbLevel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#0F172A', borderRadius: '1.25rem', padding: '1.1rem 1.25rem', marginBottom: '1.5rem', border: '1px solid #1E293B' }}>
          <p style={{ margin: '0 0 0.6rem', fontWeight: 700, color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚠️ Exam rules</p>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#64748B', fontSize: '0.83rem', lineHeight: 2 }}>
            <li>Read the task carefully during prep time — take mental notes</li>
            <li>Recording starts automatically when prep ends</li>
            <li>Speak clearly and at a natural pace</li>
            <li>You may stop early — don't leave excessive silence</li>
          </ul>
        </div>

        {micError && (
          <div style={{ background: '#2D1515', border: '1px solid #EF4444', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem', color: '#F87171', fontSize: '0.85rem' }}>
            ⚠️ Microphone access was denied. Please allow microphone access in your browser and try again.
          </div>
        )}

        <button
          onClick={launchSim}
          style={{
            width: '100%', background: `linear-gradient(135deg, ${simulation.color}, ${simulation.color}cc)`,
            color: 'white', border: 'none', borderRadius: '1rem',
            padding: '1.1rem', fontFamily: "'Outfit', sans-serif",
            fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
            boxShadow: `0 4px 20px ${simulation.color}55`,
          }}
        >
          Start Simulation →
        </button>
        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.78rem', marginTop: '0.75rem' }}>
          Make sure your microphone is connected before starting.
        </p>
      </Wrapper>
    );
  }

  // ─────────────────────────────────────────────
  // PREP SCREEN
  // ─────────────────────────────────────────────
  if (phase === 'prep' && task) {
    return (
      <Wrapper dark>
        {/* Header bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ background: simulation.color, color: 'white', borderRadius: '0.5rem', padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 800 }}>
            Task {task.number}/{simulation.tasks.length}
          </span>
          <span style={{ color: '#64748B', fontSize: '0.83rem' }}>{task.type}</span>
          <span style={{ marginLeft: 'auto', background: '#0F172A', color: simulation.color, border: `1px solid ${simulation.color}44`, borderRadius: '0.5rem', padding: '0.2rem 0.6rem', fontSize: '0.72rem', fontWeight: 700 }}>
            {task.clbLevel}
          </span>
        </div>

        {/* Timer */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#22C55E', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>
            📖 Preparation Time
          </p>
          <CircularTimer timeLeft={prepLeft} totalTime={task.prepTime} size={160} label="prep" />
          <p style={{ color: '#475569', fontSize: '0.78rem', marginTop: '0.75rem' }}>
            Recording begins automatically when this ends
          </p>
        </div>

        {/* Task instructions */}
        <div style={{ background: '#0F172A', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.8rem' }}>{task.icon}</span>
            <div>
              <p style={{ margin: 0, fontWeight: 800, color: 'white', fontSize: '1rem' }}>Task {task.number}: {task.type}</p>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.75rem' }}>{task.context}</p>
            </div>
          </div>
          <p style={{ margin: '0 0 0.75rem', color: '#E2E8F0', fontSize: '0.93rem', lineHeight: 1.7, fontWeight: 500 }}>
            {task.instructions}
          </p>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.83rem', lineHeight: 1.65, fontStyle: 'italic', borderTop: '1px solid #1E293B', paddingTop: '0.75rem' }}>
            {task.instructionsFr}
          </p>
        </div>

        {/* Key phrases */}
        <div style={{ background: '#0F172A', borderRadius: '1rem', padding: '1rem 1.1rem', border: '1px solid #1E293B' }}>
          <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>💬 Useful phrases</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {task.keyPhrases.map((p, i) => (
              <button key={i} onClick={() => speakFr(p.fr)} style={{
                background: '#1E293B', border: 'none', borderRadius: '0.6rem',
                padding: '0.5rem 0.75rem', textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
              }}>
                <span style={{ fontSize: '0.7rem', color: '#475569' }}>🔊</span>
                <span style={{ color: simulation.color, fontSize: '0.82rem', fontWeight: 600 }}>{p.fr}</span>
                <span style={{ color: '#475569', fontSize: '0.75rem', marginLeft: 'auto', whiteSpace: 'nowrap' }}>— {p.en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Skip prep */}
        <button onClick={startSpeaking} style={{
          width: '100%', background: 'transparent', border: '1px solid #1E293B',
          color: '#475569', borderRadius: '0.75rem', padding: '0.7rem',
          fontSize: '0.83rem', cursor: 'pointer', marginTop: '1rem', fontWeight: 600,
        }}>
          Skip prep — start recording now
        </button>
      </Wrapper>
    );
  }

  // ─────────────────────────────────────────────
  // SPEAKING SCREEN
  // ─────────────────────────────────────────────
  if (phase === 'speaking' && task) {
    const urgent = speakLeft <= 10;
    return (
      <Wrapper dark>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ background: '#EF4444', color: 'white', borderRadius: '0.5rem', padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 800 }}>
            🔴 Recording
          </span>
          <span style={{ color: '#64748B', fontSize: '0.83rem' }}>Task {task.number}: {task.type}</span>
        </div>

        {/* Big timer */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: urgent ? '#EF4444' : '#F59E0B', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem', animation: urgent ? 'pulse 0.6s ease-in-out infinite alternate' : 'none' }}>
            {urgent ? '⚠️ Almost done — wrap up!' : '🎙️ Speaking Time'}
          </p>
          <CircularTimer timeLeft={speakLeft} totalTime={task.speakTime} size={180} label="speaking" />
          <div style={{ marginTop: '1.25rem' }}>
            <RecordingWave />
          </div>
          <style>{`@keyframes pulse { from { opacity: 1; } to { opacity: 0.4; } }`}</style>
        </div>

        {/* Compact prompt reminder */}
        <div style={{ background: '#0F172A', borderRadius: '1rem', padding: '1rem 1.1rem', marginBottom: '1rem', border: '1px solid #1E293B' }}>
          <p style={{ margin: '0 0 0.4rem', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>📋 Task reminder</p>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.83rem', lineHeight: 1.6 }}>{task.instructions}</p>
        </div>

        {/* Structure quick-ref */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {['Introduction', 'Main Idea', 'Example', 'Conclusion'].map((s, i) => (
            <div key={s} style={{
              flex: 1, background: '#0F172A', border: '1px solid #1E293B',
              borderRadius: '0.6rem', padding: '0.5rem 0.3rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.15rem' }}>{['1️⃣','2️⃣','3️⃣','4️⃣'][i]}</div>
              <div style={{ fontSize: '0.62rem', color: '#475569', fontWeight: 700, lineHeight: 1.2 }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Stop early */}
        <button onClick={stopRecording} style={{
          width: '100%', background: '#1E293B', border: '1.5px solid #EF4444',
          color: '#EF4444', borderRadius: '0.9rem', padding: '0.85rem',
          fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="#EF4444"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>
          Stop Recording
        </button>
      </Wrapper>
    );
  }

  // ─────────────────────────────────────────────
  // REVIEW SCREEN
  // ─────────────────────────────────────────────
  if (phase === 'review' && task) {
    const recUrl = recordings[taskIdx];
    const isLast = taskIdx === simulation.tasks.length - 1;

    return (
      <Wrapper dark>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <span style={{ background: '#16A34A', color: 'white', borderRadius: '0.5rem', padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 800 }}>
            ✅ Task {task.number} done
          </span>
          <span style={{ color: '#64748B', fontSize: '0.83rem' }}>{task.type}</span>
          <span style={{ marginLeft: 'auto', color: '#64748B', fontSize: '0.78rem' }}>
            {taskIdx + 1} / {simulation.tasks.length} tasks
          </span>
        </div>

        {/* Encouragement */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2A1A, #0A1F14)',
          border: '1px solid #16A34A44', borderRadius: '1.25rem',
          padding: '1.1rem 1.25rem', marginBottom: '1.1rem',
        }}>
          <p style={{ margin: '0 0 0.3rem', fontWeight: 800, color: '#4ADE80', fontSize: '0.95rem' }}>
            👏 Good attempt!
          </p>
          <p style={{ margin: 0, color: '#86EFAC', fontSize: '0.83rem', lineHeight: 1.6 }}>
            Listen to your recording, then open the Sample Answer to compare pronunciation and structure. Re-record if you want to improve.
          </p>
        </div>

        {/* Playback */}
        {recUrl && (
          <div style={{ marginBottom: '1.1rem' }}>
            <AudioPlayer src={recUrl} label={`Task ${task.number} — Your Recording`} />
          </div>
        )}

        {/* Structure guide */}
        <div style={{ marginBottom: '1.1rem' }}>
          <StructureGuide structure={task.structure} />
        </div>

        {/* Sample answer */}
        <div style={{ background: '#0F172A', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #1E293B', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setShowSample(s => !s)}
            style={{
              width: '100%', padding: '0.9rem 1.1rem', background: 'transparent',
              border: 'none', cursor: 'pointer', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 700, color: '#94A3B8', fontSize: '0.85rem' }}>👁 Sample Answer</span>
            <span style={{ color: '#475569', fontSize: '0.72rem', background: '#1E293B', borderRadius: '0.4rem', padding: '0.2rem 0.5rem' }}>
              {showSample ? 'Hide ▲' : 'Show ▼'}
            </span>
          </button>
          {showSample && (
            <div style={{ padding: '0 1.1rem 1.1rem', borderTop: '1px solid #1E293B' }}>
              <div style={{ paddingTop: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: simulation.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🇫🇷 French</span>
                  <button onClick={() => speakFr(task.sampleAnswer.fr)} style={{
                    background: '#1E293B', color: simulation.color, border: 'none',
                    borderRadius: '0.5rem', padding: '0.2rem 0.6rem', fontSize: '0.72rem',
                    fontWeight: 700, cursor: 'pointer',
                  }}>▶ Listen</button>
                </div>
                <p style={{ margin: '0 0 0.9rem', color: '#E2E8F0', fontSize: '0.85rem', lineHeight: 1.75, background: '#1E293B', padding: '0.85rem', borderRadius: '0.75rem' }}>
                  {task.sampleAnswer.fr}
                </p>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🇬🇧 English</span>
                <p style={{ margin: '0.4rem 0 0', color: '#64748B', fontSize: '0.83rem', lineHeight: 1.65, fontStyle: 'italic' }}>
                  {task.sampleAnswer.en}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Key phrases */}
        <div style={{ background: '#0F172A', borderRadius: '1rem', padding: '1rem 1.1rem', border: '1px solid #1E293B', marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>💬 Key Phrases</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {task.keyPhrases.map((p, i) => (
              <button key={i} onClick={() => speakFr(p.fr)} style={{
                background: '#1E293B', border: 'none', borderRadius: '0.6rem',
                padding: '0.5rem 0.75rem', textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
              }}>
                <span style={{ fontSize: '0.7rem', color: '#475569' }}>🔊</span>
                <span style={{ color: simulation.color, fontSize: '0.82rem', fontWeight: 600 }}>{p.fr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Next / Finish */}
        <button
          onClick={nextTask}
          style={{
            width: '100%', background: isLast
              ? 'linear-gradient(135deg, #16A34A, #15803D)'
              : `linear-gradient(135deg, ${simulation.color}, ${simulation.color}cc)`,
            color: 'white', border: 'none', borderRadius: '1rem',
            padding: '1rem', fontFamily: "'Outfit', sans-serif",
            fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
            boxShadow: `0 3px 14px ${isLast ? '#16A34A' : simulation.color}44`,
          }}
        >
          {isLast ? '🏆 Finish Simulation' : `Next: Task ${taskIdx + 2} →`}
        </button>
      </Wrapper>
    );
  }

  // ─────────────────────────────────────────────
  // COMPLETE SCREEN
  // ─────────────────────────────────────────────
  if (phase === 'complete') {
    return (
      <Wrapper dark>
        {/* Trophy card */}
        <div style={{
          background: 'linear-gradient(135deg, #0F2A1A, #0A1F14)',
          border: '1.5px solid #16A34A55', borderRadius: '1.5rem',
          padding: '2rem', textAlign: 'center', marginBottom: '1.5rem',
          boxShadow: '0 4px 24px rgba(22,163,74,0.25)',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#4ADE80', margin: '0 0 0.4rem' }}>
            Simulation Complete!
          </h1>
          <p style={{ color: '#86EFAC', fontSize: '0.9rem', margin: '0 0 0.5rem' }}>{simulation.title} · {simulation.tasks.length} tasks</p>
          <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0 }}>
            Every recording you make under exam pressure builds real TEF confidence.
          </p>
        </div>

        {/* All recordings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {simulation.tasks.map((t, i) => {
            const url = recordings[i];
            return (
              <div key={t.id} style={{ background: '#0F172A', borderRadius: '1rem', padding: '1rem 1.1rem', border: '1px solid #1E293B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: url ? '0.75rem' : 0 }}>
                  <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
                  <span style={{ fontWeight: 700, color: '#94A3B8', fontSize: '0.85rem' }}>Task {t.number}: {t.type}</span>
                  {recDuration[i] && (
                    <span style={{ marginLeft: 'auto', color: '#475569', fontSize: '0.75rem' }}>{fmtTime(recDuration[i])} recorded</span>
                  )}
                </div>
                {url && <AudioPlayer src={url} label={`Task ${t.number} Recording`} />}
                {!url && <p style={{ margin: 0, color: '#475569', fontSize: '0.8rem' }}>No recording captured.</p>}
              </div>
            );
          })}
        </div>

        {/* Study tips */}
        <div style={{ background: '#0F172A', borderRadius: '1rem', padding: '1.1rem 1.25rem', border: '1px solid #1E293B', marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 0.75rem', fontWeight: 700, color: '#94A3B8', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>💡 What to do next</p>
          {[
            'Listen to each recording once without judging — just notice.',
            'Identify one specific thing to improve: speed, pronunciation, or structure.',
            'Re-do the same simulation next week and compare.',
            'Practice daily drills in Speaking Practice to build fluency.',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: i < 3 ? '0.55rem' : 0 }}>
              <span style={{ color: simulation.color, fontWeight: 800, fontSize: '0.82rem', flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ color: '#64748B', fontSize: '0.83rem', lineHeight: 1.55 }}>{tip}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => { setTaskIdx(0); setRecordings({}); setRecDuration({}); setPhase('intro'); }} style={{
            flex: 1, background: '#1E293B', color: '#94A3B8', border: '1px solid #1E293B',
            borderRadius: '0.9rem', padding: '0.85rem', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
          }}>🔄 Redo Simulation</button>
          <button onClick={reset} style={{
            flex: 1, background: `linear-gradient(135deg, ${simulation.color}, ${simulation.color}cc)`,
            color: 'white', border: 'none', borderRadius: '0.9rem',
            padding: '0.85rem', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
          }}>Try Other Simulation →</button>
        </div>
      </Wrapper>
    );
  }

  return null;
}

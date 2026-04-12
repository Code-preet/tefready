'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { listeningTest } from '@/lib/listeningData'
import Link from 'next/link'

const SPEED_OPTIONS = [
  { label: '0.6×', value: 0.6 },
  { label: '0.8×', value: 0.8 },
  { label: '1×',   value: 1.0 },
  { label: '1.2×', value: 1.2 },
]

export default function ListeningTestPage() {
  const [phase, setPhase] = useState('intro')
  const [currentPart, setCurrentPart] = useState(0)
  const [currentItem, setCurrentItem] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [audioState, setAudioState] = useState('idle') // idle | playing | paused | done
  const [timeLeft, setTimeLeft] = useState(listeningTest.totalTime)
  const [speed, setSpeed] = useState(0.88)
  const timerRef = useRef(null)
  const currentTextRef = useRef('')

  const allItems = listeningTest.parts.flatMap(p => p.items)
  const totalItems = allItems.length
  const currentIndex = listeningTest.parts.slice(0, currentPart).reduce((acc, p) => acc + p.items.length, 0) + currentItem
  const currentData = listeningTest.parts[currentPart]?.items[currentItem]
  const currentPartData = listeningTest.parts[currentPart]

  useEffect(() => {
    if (phase === 'test') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); setPhase('results'); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const speakText = useCallback((text, rate) => {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    currentTextRef.current = text
    setAudioState('playing')
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'fr-CA'
    utter.rate = rate || 0.88
    utter.pitch = 1.0
    const voices = window.speechSynthesis.getVoices()
    const frVoice = voices.find(v => v.lang.startsWith('fr'))
    if (frVoice) utter.voice = frVoice
    utter.onend = () => setAudioState('done')
    utter.onerror = () => setAudioState('done')
    window.speechSynthesis.speak(utter)
  }, [])

  const handlePause = () => {
    if (typeof window === 'undefined') return
    if (audioState === 'playing') {
      window.speechSynthesis.pause()
      setAudioState('paused')
    } else if (audioState === 'paused') {
      window.speechSynthesis.resume()
      setAudioState('playing')
    }
  }

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed)
    // If audio is currently playing or paused, restart at new speed
    if (audioState === 'playing' || audioState === 'paused') {
      speakText(currentTextRef.current, newSpeed)
    }
  }

  const handleStart = () => {
    setPhase('test')
    setTimeout(() => speakText(currentData.script, speed), 500)
  }

  const handleSelect = (idx) => {
    if (audioState === 'playing') return
    setSelected(idx)
  }

  const handleNext = () => {
    if (selected === null) return
    setAnswers(prev => ({ ...prev, [currentData.id]: selected }))
    setSelected(null)
    setAudioState('idle')
    const partItems = listeningTest.parts[currentPart].items
    if (currentItem < partItems.length - 1) {
      setCurrentItem(ci => {
        const next = ci + 1
        setTimeout(() => speakText(listeningTest.parts[currentPart].items[next].script, speed), 300)
        return next
      })
    } else if (currentPart < listeningTest.parts.length - 1) {
      setCurrentPart(cp => {
        const nextPart = cp + 1
        setCurrentItem(0)
        setTimeout(() => speakText(listeningTest.parts[nextPart].items[0].script, speed), 300)
        return nextPart
      })
    } else {
      clearInterval(timerRef.current)
      setPhase('results')
    }
  }

  const calculateScore = () => {
    let correct = 0
    allItems.forEach(item => {
      if (answers[item.id] === item.answer) correct++
    })
    return { correct, total: totalItems, percent: Math.round((correct / totalItems) * 100) }
  }

  const getCLB = (percent) => {
    if (percent >= 90) return { level: 'CLB 10–12', label: 'Excellent', color: '#059669' }
    if (percent >= 75) return { level: 'CLB 8–9', label: 'Très bien', color: '#0D9488' }
    if (percent >= 60) return { level: 'CLB 6–7', label: 'Bien', color: '#D97706' }
    if (percent >= 45) return { level: 'CLB 4–5', label: 'Passable', color: '#DC2626' }
    return { level: 'CLB 1–3', label: 'À améliorer', color: '#7F1D1D' }
  }

  if (phase === 'intro') return (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎧</div>
        <h1 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, margin: '0 0 1rem' }}>
          Compréhension de l'oral
        </h1>
        <p style={{ color: '#4A5568', lineHeight: 1.8, marginBottom: '2rem' }}>
          This exam has <strong>13 questions</strong> across 3 parts.<br />
          You have <strong>40 minutes</strong>. Audio plays automatically.<br />
          Make sure your <strong>volume is on</strong> before starting.
        </p>
        <div style={{ background: '#FFF8EC', border: '1.5px solid #F6D07A', borderRadius: '1rem', padding: '1rem 1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
          <p style={{ color: '#92400E', fontWeight: 700, margin: '0 0 0.5rem' }}>⚠️ Before you start:</p>
          <ul style={{ color: '#78350F', margin: 0, paddingLeft: '1.2rem', lineHeight: 2, fontSize: '0.9rem' }}>
            <li>Put on headphones if available</li>
            <li>Find a quiet place</li>
            <li>The audio uses French text-to-speech</li>
            <li>Read each question before audio plays</li>
          </ul>
        </div>
        <button onClick={handleStart} style={{
          background: '#0A2540', color: 'white', border: 'none',
          borderRadius: '1rem', padding: '1.1rem 3rem',
          fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif", width: '100%'
        }}>
          🎧 Start Exam
        </button>
      </div>
    </div>
  )

  if (phase === 'results') {
    const { correct, total, percent } = calculateScore()
    const clb = getCLB(percent)
    return (
      <div style={{ minHeight: '100vh', background: '#FFFEF5', padding: '2rem 1rem 6rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ background: '#0A2540', borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center', color: 'white', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📊</div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', margin: '0 0 0.5rem' }}>Your Results</h1>
            <div style={{ fontSize: '4rem', fontWeight: 900, color: '#E8A020', margin: '1rem 0 0.5rem' }}>{percent}%</div>
            <div style={{ fontSize: '1.1rem', color: '#94A3B8' }}>{correct} correct out of {total}</div>
            <div style={{ display: 'inline-block', background: clb.color, borderRadius: '2rem', padding: '0.5rem 1.5rem', marginTop: '1rem', fontWeight: 700 }}>
              {clb.level} — {clb.label}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', border: '1.5px solid #E8F0FB', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', margin: '0 0 1rem' }}>Answer Review</h2>
            {allItems.map((item, idx) => {
              const userAnswer = answers[item.id]
              const isCorrect = userAnswer === item.answer
              return (
                <div key={item.id} style={{
                  padding: '1rem', borderRadius: '0.75rem',
                  background: isCorrect ? '#F0FDF4' : '#FFF5F5',
                  border: `1px solid ${isCorrect ? '#86EFAC' : '#FCA5A5'}`,
                  marginBottom: '0.75rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.2rem' }}>{isCorrect ? '✅' : '❌'}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#0A2540', fontWeight: 600, margin: '0 0 0.4rem', fontSize: '0.9rem' }}>Q{idx + 1}: {item.question}</p>
                      {!isCorrect && <p style={{ color: '#DC2626', fontSize: '0.85rem', margin: '0 0 0.25rem' }}>Your answer: {item.options[userAnswer] ?? 'No answer'}</p>}
                      <p style={{ color: '#059669', fontSize: '0.85rem', margin: '0 0 0.25rem' }}>Correct: {item.options[item.answer]}</p>
                      <p style={{ color: '#718096', fontSize: '0.82rem', margin: 0, fontStyle: 'italic' }}>{item.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => { setPhase('intro'); setAnswers({}); setCurrentPart(0); setCurrentItem(0); setTimeLeft(listeningTest.totalTime); setAudioState('idle'); window.speechSynthesis.cancel() }} style={{
              flex: 1, background: '#0A2540', color: 'white', border: 'none',
              borderRadius: '0.75rem', padding: '1rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Outfit', sans-serif"
            }}>🔄 Retry Exam</button>
            <Link href="/listen" style={{
              flex: 1, background: 'white', color: '#0A2540', border: '1.5px solid #E2E8F0',
              borderRadius: '0.75rem', padding: '1rem', fontWeight: 700,
              textDecoration: 'none', textAlign: 'center', fontFamily: "'Outfit', sans-serif"
            }}>← Back</Link>
          </div>
        </div>
      </div>
    )
  }

  const progressPercent = (currentIndex / totalItems) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: '#0A2540', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{currentPartData?.title}</div>
        <div style={{ color: '#E8A020', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'monospace' }}>⏱️ {formatTime(timeLeft)}</div>
        <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{currentIndex + 1} / {totalItems}</div>
      </div>

      <div style={{ height: '4px', background: '#E2E8F0' }}>
        <div style={{ height: '100%', background: '#E8A020', width: `${progressPercent}%`, transition: 'width 0.4s' }} />
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 6rem' }}>
        <div style={{ background: '#0A2540', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {audioState === 'playing' ? '🔊' : audioState === 'paused' ? '⏸️' : audioState === 'done' ? '✅' : '🔇'}
          </div>
          <p style={{ color: '#94A3B8', margin: '0 0 1rem', fontSize: '0.9rem' }}>
            {audioState === 'playing' ? 'Audio playing — listen carefully...'
              : audioState === 'paused' ? 'Audio paused — press resume to continue'
              : audioState === 'done' ? 'Audio finished — select your answer below'
              : 'Audio will play shortly...'}
          </p>

          {/* Pause / Resume button */}
          {(audioState === 'playing' || audioState === 'paused') && (
            <button onClick={handlePause} style={{
              background: 'rgba(255,255,255,0.15)', color: 'white',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: '0.5rem',
              padding: '0.5rem 1.25rem', cursor: 'pointer', fontSize: '0.9rem',
              fontWeight: 700, marginBottom: '0.75rem'
            }}>
              {audioState === 'paused' ? '▶ Resume' : '⏸ Pause'}
            </button>
          )}

          {/* Replay button (shown after audio done) */}
          {audioState === 'done' && (
            <button onClick={() => speakText(currentData.script, speed)} style={{
              background: 'rgba(255,255,255,0.1)', color: 'white',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.5rem',
              padding: '0.5rem 1.25rem', cursor: 'pointer', fontSize: '0.85rem',
              marginBottom: '0.75rem'
            }}>🔄 Replay (practice only)</button>
          )}

          {/* Speed selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ color: '#64748B', fontSize: '0.78rem', alignSelf: 'center', marginRight: '0.25rem' }}>Speed:</span>
            {SPEED_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => handleSpeedChange(opt.value)} style={{
                background: Math.abs(speed - opt.value) < 0.05 ? '#E8A020' : 'rgba(255,255,255,0.08)',
                color: Math.abs(speed - opt.value) < 0.05 ? '#0A2540' : '#CBD5E0',
                border: 'none', borderRadius: '0.4rem',
                padding: '0.3rem 0.65rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                transition: 'all 0.15s'
              }}>{opt.label}</button>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem', border: '1.5px solid #E8F0FB' }}>
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Question {currentIndex + 1}</p>
          <p style={{ color: '#0A2540', fontWeight: 700, fontSize: '1.05rem', margin: 0, lineHeight: 1.6 }}>{currentData?.question}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {currentData?.options.map((opt, idx) => {
            const isSelected = selected === idx
            return (
              <button key={idx} onClick={() => handleSelect(idx)} disabled={audioState === 'playing'} style={{
                background: isSelected ? '#EFF6FF' : 'white',
                border: `2px solid ${isSelected ? '#3B82F6' : '#E2E8F0'}`,
                borderRadius: '0.85rem', padding: '1rem 1.25rem',
                textAlign: 'left', cursor: audioState === 'playing' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                opacity: audioState === 'playing' ? 0.6 : 1, transition: 'all 0.15s'
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? '#3B82F6' : '#F1F5F9',
                  color: isSelected ? 'white' : '#0A2540', fontWeight: 700, fontSize: '0.85rem'
                }}>{String.fromCharCode(65 + idx)}</div>
                <span style={{ color: '#0A2540', fontSize: '0.95rem', lineHeight: 1.5 }}>{opt}</span>
              </button>
            )
          })}
        </div>

        <button onClick={handleNext} disabled={selected === null} style={{
          width: '100%', background: selected === null ? '#CBD5E0' : '#E8A020',
          color: 'white', border: 'none', borderRadius: '0.85rem', padding: '1rem',
          fontWeight: 800, fontSize: '1rem', cursor: selected === null ? 'not-allowed' : 'pointer',
          fontFamily: "'Outfit', sans-serif"
        }}>
          {currentIndex === totalItems - 1 ? 'Finish Exam →' : 'Next Question →'}
        </button>
      </div>
    </div>
  )
}
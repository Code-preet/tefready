'use client'
import { useState, useEffect, useRef } from 'react'
import { speakingTasks } from '@/lib/speakingData'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function SpeakingTaskPage() {
  const params = useParams()
  const task = speakingTasks.find(t => t.id === params.taskId) || speakingTasks[0]

  const [phase, setPhase] = useState('intro')
  const [prepTime, setPrepTime] = useState(task.prepTime)
  const [recordTime, setRecordTime] = useState(task.timeLimit)
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState('')

  const timerRef = useRef(null)
  const recognitionRef = useRef(null)
  const transcriptRef = useRef('')

  useEffect(() => {
    if (phase === 'prep') {
      timerRef.current = setInterval(() => {
        setPrepTime(t => {
          if (t <= 1) { clearInterval(timerRef.current); setPhase('recording'); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  useEffect(() => {
    if (phase === 'recording') {
      startRecording()
      timerRef.current = setInterval(() => {
        setRecordTime(t => {
          if (t <= 1) { clearInterval(timerRef.current); stopRecording(); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const startRecording = () => {
    if (typeof window === 'undefined') return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser. Please use Chrome.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = (event) => {
      let full = ''
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript + ' '
      }
      transcriptRef.current = full
      setTranscript(full)
    }
    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        setError('Microphone error: ' + event.error + '. Please allow microphone access.')
      }
    }
    recognition.onend = () => setIsListening(false)
    recognition.start()
    recognitionRef.current = recognition
    setIsListening(true)
  }

  const stopRecording = () => {
    clearInterval(timerRef.current)
    if (recognitionRef.current) recognitionRef.current.stop()
    setIsListening(false)
    setPhase('processing')
    setTimeout(() => getFeedback(transcriptRef.current), 500)
  }

  const getFeedback = async (spokenText) => {
    if (!spokenText || spokenText.trim().length < 10) {
      setError('No speech detected. Make sure your microphone is working and try again.')
      setPhase('intro')
      return
    }
    try {
      const response = await fetch('/api/speaking-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: spokenText,
          prompt: task.prompt,
          taskType: task.type,
          clbLevel: task.clbLevel
        })
      })
      const data = await response.json()
      if (data.feedback) { setFeedback(data.feedback); setPhase('results') }
      else { setError('Could not get feedback. Please try again.'); setPhase('intro') }
    } catch {
      setError('Network error. Please check your connection and try again.')
      setPhase('intro')
    }
  }

  const resetTask = () => {
    setPhase('intro')
    setPrepTime(task.prepTime)
    setRecordTime(task.timeLimit)
    setTranscript('')
    setFeedback(null)
    setError('')
    transcriptRef.current = ''
  }

  if (phase === 'intro') return (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '2rem 1rem 6rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <Link href="/speak" style={{ color: '#BE185D', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.5rem' }}>
          ← Back to Speaking Tasks
        </Link>
        <div style={{ background: task.color, borderRadius: '1.5rem', padding: '2rem', color: 'white', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{task.icon}</div>
          <p style={{ opacity: 0.8, margin: '0 0 0.25rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{task.type} · {task.clbLevel}</p>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', margin: '0 0 1rem', fontWeight: 800 }}>{task.title}</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', padding: '0.3rem 0.75rem', fontSize: '0.82rem' }}>📝 {task.prepTime}s to prepare</span>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', padding: '0.3rem 0.75rem', fontSize: '0.82rem' }}>⏱️ {Math.floor(task.timeLimit / 60)} min to speak</span>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem', border: '1.5px solid #E8F0FB' }}>
          <h2 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1rem', margin: '0 0 1rem', fontWeight: 700 }}>📋 Your Speaking Prompt</h2>
          <p style={{ color: '#0A2540', lineHeight: 1.8, fontSize: '1rem', margin: '0 0 1rem', fontWeight: 500 }}>{task.prompt}</p>
          <p style={{ color: '#718096', fontSize: '0.875rem', margin: 0, fontStyle: 'italic' }}>🇬🇧 {task.englishHint}</p>
        </div>

        <div style={{ background: '#F8F4FF', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem', border: '1.5px solid #DDD6FE' }}>
          <h3 style={{ color: '#5B21B6', fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', margin: '0 0 0.75rem', fontWeight: 700 }}>💡 Tips for this task</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#4C1D95', lineHeight: 2, fontSize: '0.875rem' }}>
            {task.tips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>

        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1.5px solid #E8F0FB' }}>
          <h3 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', margin: '0 0 0.75rem', fontWeight: 700 }}>📚 Useful vocabulary</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {task.vocabulary.map((word, i) => (
              <span key={i} style={{ background: '#F1F5F9', color: '#0A2540', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.875rem', fontWeight: 500 }}>{word}</span>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: '#FFF5F5', border: '1px solid #FC8181', borderRadius: '0.75rem', padding: '1rem', color: '#C53030', fontSize: '0.875rem', marginBottom: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={() => setPhase('prep')} style={{
          width: '100%', background: task.color, color: 'white', border: 'none',
          borderRadius: '1rem', padding: '1.2rem', fontWeight: 800, fontSize: '1.1rem',
          cursor: 'pointer', fontFamily: "'Outfit', sans-serif"
        }}>🎤 Start Task →</button>
      </div>
    </div>
  )

  if (phase === 'prep') return (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧠</div>
        <h1 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Preparation Time</h1>
        <p style={{ color: '#718096', marginBottom: '2rem' }}>Organize your thoughts. Recording starts automatically.</p>
        <div style={{ fontSize: '5rem', fontWeight: 900, color: task.color, fontFamily: 'monospace', marginBottom: '1rem' }}>{formatTime(prepTime)}</div>
        <div style={{ background: '#F1F5F9', borderRadius: '1rem', padding: '1rem 1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
          <p style={{ color: '#0A2540', fontWeight: 600, margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Reminder:</p>
          <p style={{ color: '#4A5568', margin: 0, fontSize: '0.875rem', lineHeight: 1.7 }}>{task.prompt}</p>
        </div>
        <button onClick={() => { clearInterval(timerRef.current); setPhase('recording') }} style={{
          background: task.color, color: 'white', border: 'none', borderRadius: '0.75rem',
          padding: '0.85rem 2rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif"
        }}>Skip prep → Start Recording Now</button>
      </div>
    </div>
  )

  if (phase === 'recording') return (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '2rem 1rem 6rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{
          background: isListening ? '#DC2626' : '#0A2540',
          borderRadius: '1.5rem', padding: '2rem', textAlign: 'center', color: 'white', marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{isListening ? '🔴' : '⏳'}</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', margin: '0 0 0.5rem', fontWeight: 800 }}>
            {isListening ? 'Recording...' : 'Starting microphone...'}
          </h2>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'monospace', color: recordTime < 30 ? '#FCA5A5' : '#E8A020', margin: '0.5rem 0' }}>
            {formatTime(recordTime)}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
            {isListening ? 'Speak clearly in French. Your speech is being transcribed.' : 'Allow microphone access when prompted.'}
          </p>
          <button onClick={stopRecording} style={{
            background: 'white', color: '#DC2626', border: 'none', borderRadius: '0.75rem',
            padding: '0.85rem 2rem', fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif", fontSize: '1rem'
          }}>⏹️ Stop & Get Feedback</button>
        </div>

        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', border: '1.5px solid #E8F0FB' }}>
          <h3 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', margin: '0 0 0.75rem', fontWeight: 700 }}>📝 Live Transcript</h3>
          <p style={{ color: transcript ? '#0A2540' : '#CBD5E0', fontSize: '0.9rem', lineHeight: 1.8, margin: 0, minHeight: '80px' }}>
            {transcript || 'Your words will appear here as you speak...'}
          </p>
        </div>
      </div>
    </div>
  )

  if (phase === 'processing') return (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
        <h2 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Analysing your French...</h2>
        <p style={{ color: '#718096' }}>AI is scoring your fluency, vocabulary, grammar, and coherence</p>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }`}</style>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#BE185D', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  )

  if (phase === 'results' && feedback) return (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '2rem 1rem 6rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ background: '#0A2540', borderRadius: '1.5rem', padding: '2rem', color: 'white', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', margin: '0 0 0.5rem' }}>Your Speaking Score</h1>
          <div style={{ fontSize: '4rem', fontWeight: 900, color: '#E8A020', margin: '0.5rem 0' }}>{feedback.overallScore}/100</div>
          <div style={{ display: 'inline-block', background: '#E8A020', borderRadius: '2rem', padding: '0.4rem 1.25rem', fontWeight: 700, fontSize: '0.95rem' }}>
            {feedback.clbEstimate}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', border: '1.5px solid #E8F0FB', marginBottom: '1rem' }}>
          <h2 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.05rem', margin: '0 0 1rem', fontWeight: 700 }}>Score Breakdown</h2>
          {[
            { label: 'Fluency & Delivery', score: feedback.scores?.fluency, color: '#7C3AED' },
            { label: 'Vocabulary Range', score: feedback.scores?.vocabulary, color: '#0D9488' },
            { label: 'Grammar Accuracy', score: feedback.scores?.grammar, color: '#D97706' },
            { label: 'Coherence & Task', score: feedback.scores?.coherence, color: '#BE185D' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: '#0A2540', fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</span>
                <span style={{ color: item.color, fontWeight: 700, fontSize: '0.875rem' }}>{item.score}/25</span>
              </div>
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: item.color, width: `${(item.score / 25) * 100}%`, borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#F0FDF4', borderRadius: '1.25rem', padding: '1.5rem', border: '1.5px solid #86EFAC', marginBottom: '1rem' }}>
          <h3 style={{ color: '#065F46', fontFamily: "'Outfit', sans-serif", fontSize: '1rem', margin: '0 0 0.75rem', fontWeight: 700 }}>📝 Overall Feedback</h3>
          <p style={{ color: '#064E3B', lineHeight: 1.8, margin: 0, fontSize: '0.9rem' }}>{feedback.summary}</p>
        </div>

        <div style={{ background: '#FFF5F5', borderRadius: '1.25rem', padding: '1.5rem', border: '1.5px solid #FCA5A5', marginBottom: '1rem' }}>
          <h3 style={{ color: '#7F1D1D', fontFamily: "'Outfit', sans-serif", fontSize: '1rem', margin: '0 0 0.75rem', fontWeight: 700 }}>🎯 Areas to Improve</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#991B1B', lineHeight: 2, fontSize: '0.875rem' }}>
            {feedback.improvements?.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>

        {feedback.vocabularySuggestions?.length > 0 && (
          <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', border: '1.5px solid #E8F0FB', marginBottom: '1rem' }}>
            <h3 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1rem', margin: '0 0 0.75rem', fontWeight: 700 }}>📚 Vocabulary to Learn</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {feedback.vocabularySuggestions.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#0A2540', fontWeight: 700, fontSize: '0.875rem', minWidth: '140px' }}>{item.word}</span>
                  <span style={{ color: '#718096', fontSize: '0.875rem' }}>{item.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: '#F7F9FC', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', margin: '0 0 0.75rem', fontWeight: 700 }}>📝 Your Transcript</h3>
          <p style={{ color: '#4A5568', lineHeight: 1.8, margin: 0, fontSize: '0.875rem' }}>{transcript}</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={resetTask} style={{
            flex: 1, background: task.color, color: 'white', border: 'none',
            borderRadius: '0.75rem', padding: '1rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Outfit', sans-serif"
          }}>🔄 Try Again</button>
          <Link href="/speak" style={{
            flex: 1, background: 'white', color: '#0A2540', border: '1.5px solid #E2E8F0',
            borderRadius: '0.75rem', padding: '1rem', fontWeight: 700,
            textDecoration: 'none', textAlign: 'center', fontFamily: "'Outfit', sans-serif"
          }}>← All Tasks</Link>
        </div>
      </div>
    </div>
  )

  return null
}
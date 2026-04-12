'use client'
import Link from 'next/link'
import { speakingTasks } from '@/lib/speakingData'
import Nav from '../../components/Nav'
import { useApp } from '../../components/AppProvider'
import { T } from '../../lib/i18n'

export default function SpeakPage() {
  const { state } = useApp()
  const lang = state?.lang || 'en'
  const navT = T[lang]?.nav || T.en.nav

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFEF5',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      paddingBottom: '6rem'
    }}>
      <Nav navT={navT} />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1rem 0' }}>

        <div style={{
          background: 'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎤</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', margin: '0 0 0.5rem', fontWeight: 800 }}>
            Expression orale
          </h1>
          <p style={{ color: '#FBCFE8', margin: 0, lineHeight: 1.6 }}>
            TEF Canada Speaking — Record your response and get instant AI feedback
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: '🎤', label: 'Microphone recording' },
              { icon: '🤖', label: 'AI feedback' },
              { icon: '📊', label: 'TEF scoring' },
              { icon: '💡', label: 'Improvement tips' }
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                {item.icon} {item.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1.5px solid #E8F0FB' }}>
          <h2 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', margin: '0 0 1rem', fontWeight: 700 }}>
            🤖 How AI Feedback Works
          </h2>
          {[
            { step: '1', text: 'Read the prompt and prepare your response' },
            { step: '2', text: 'Click Record and speak your answer in French' },
            { step: '3', text: 'AI transcribes your speech and analyses it' },
            { step: '4', text: 'Get scores on fluency, vocabulary, grammar, coherence' },
            { step: '5', text: 'Receive specific tips and related vocabulary' },
          ].map(s => (
            <div key={s.step} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{
                background: '#BE185D', color: 'white', borderRadius: '50%',
                width: '24px', height: '24px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
              }}>{s.step}</div>
              <p style={{ color: '#4A5568', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>{s.text}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', margin: '0 0 1rem', fontWeight: 700 }}>
          Choose a Speaking Task
        </h2>

        {speakingTasks.map(task => (
          <Link key={task.id} href={`/speak/${task.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white', borderRadius: '1.25rem', padding: '1.5rem',
              marginBottom: '1rem', border: '1.5px solid #E8F0FB', cursor: 'pointer',
              display: 'flex', gap: '1rem', alignItems: 'flex-start'
            }}>
              <div style={{
                background: task.color, borderRadius: '0.75rem',
                width: '48px', height: '48px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', flexShrink: 0
              }}>{task.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#0A2540', fontWeight: 700, fontSize: '1rem' }}>{task.title}</span>
                  <span style={{ background: task.color, color: 'white', borderRadius: '1rem', padding: '0.15rem 0.6rem', fontSize: '0.7rem', fontWeight: 700 }}>{task.clbLevel}</span>
                </div>
                <p style={{ color: '#4A5568', fontSize: '0.875rem', margin: '0 0 0.5rem', lineHeight: 1.5 }}>
                  {task.englishHint}
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>⏱️ {Math.floor(task.timeLimit / 60)} min</span>
                  <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>📝 {task.prepTime}s prep</span>
                </div>
              </div>
              <div style={{ color: '#CBD5E0', fontSize: '1.2rem' }}>→</div>
            </div>
          </Link>
        ))}

        <div style={{ background: '#FFF8EC', borderRadius: '1.25rem', padding: '1.5rem', border: '1.5px solid #F6D07A', marginTop: '0.5rem' }}>
          <h3 style={{ color: '#92400E', fontFamily: "'Outfit', sans-serif", fontSize: '1rem', margin: '0 0 0.75rem', fontWeight: 700 }}>
            📊 TEF Scoring Criteria
          </h3>
          {[
            { label: 'Fluency & Delivery', desc: 'Natural flow, pace, pronunciation' },
            { label: 'Vocabulary Range', desc: 'Word variety and appropriateness' },
            { label: 'Grammar Accuracy', desc: 'Correct French grammar structures' },
            { label: 'Coherence & Task', desc: 'Organization and addressing the prompt' },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #FDE68A' }}>
              <div>
                <span style={{ color: '#92400E', fontWeight: 600, fontSize: '0.875rem' }}>{c.label}</span>
                <span style={{ color: '#B45309', fontSize: '0.8rem', marginLeft: '0.5rem' }}>— {c.desc}</span>
              </div>
              <span style={{ color: '#D97706', fontWeight: 700, fontSize: '0.875rem' }}>25%</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
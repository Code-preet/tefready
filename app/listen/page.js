'use client'
import Link from 'next/link'
import Nav from '../../components/Nav'
import { useApp } from '../../components/AppProvider'
import { T } from '../../lib/i18n'

export default function ListenPage() {
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
          background: 'linear-gradient(135deg, #0A2540 0%, #1a3a5c 100%)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎧</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', margin: '0 0 0.5rem', fontWeight: 800 }}>
            Compréhension de l'oral
          </h1>
          <p style={{ color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
            TEF Canada Listening — Full simulation exam with authentic French audio
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: '⏱️', label: '40 minutes' },
              { icon: '📻', label: '13 audio clips' },
              { icon: '❓', label: '13 questions' },
              { icon: '🎯', label: 'CLB 5–12' }
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.1)',
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
            📋 Official TEF Canada Format
          </h2>
          {[
            { part: 'Part 1', desc: '6 short dialogues (everyday situations)', level: 'CLB 5–7', color: '#7C3AED' },
            { part: 'Part 2', desc: '4 medium documents (news, info, speeches)', level: 'CLB 7–9', color: '#0D9488' },
            { part: 'Part 3', desc: '3 long debates and interviews', level: 'CLB 9–12', color: '#D97706' },
          ].map(p => (
            <div key={p.part} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.75rem 0', borderBottom: '1px solid #F1F5F9'
            }}>
              <div style={{
                background: p.color, color: 'white', borderRadius: '0.5rem',
                padding: '0.3rem 0.7rem', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap'
              }}>{p.part}</div>
              <div style={{ flex: 1, color: '#4A5568', fontSize: '0.9rem' }}>{p.desc}</div>
              <div style={{ color: '#94A3B8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{p.level}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFF8EC', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '2rem', border: '1.5px solid #F6D07A' }}>
          <h3 style={{ color: '#92400E', fontFamily: "'Outfit', sans-serif", fontSize: '1rem', margin: '0 0 0.75rem', fontWeight: 700 }}>
            💡 Exam Tips
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#78350F', lineHeight: 2, fontSize: '0.9rem' }}>
            <li>Read the question <strong>before</strong> the audio plays</li>
            <li>Focus on key words — you don't need to understand everything</li>
            <li>In the real exam, audio plays only once — practice without replaying</li>
            <li>Look for contrast words: <em>mais, cependant, pourtant, en revanche</em></li>
          </ul>
        </div>

        {/* TEF Listening Test Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #1E3A8A 100%)',
          borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem',
          color: 'white', boxShadow: '0 4px 18px rgba(10,22,40,0.45)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ fontSize: '2.2rem', lineHeight: 1 }}>🎧</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.3rem' }}>
                TEF Listening Test
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', margin: '0 0 0.85rem', lineHeight: 1.5 }}>
                10 questions, A1–B2. Max 2 replays per question, countdown timer, auto-advance. Full transcript in results.
              </p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                {['10 questions', '2 replays max', 'Timed', 'Results + transcript'].map(tag => (
                  <span key={tag} style={{
                    background: 'rgba(255,255,255,0.12)', borderRadius: '1rem',
                    padding: '0.18rem 0.6rem', fontSize: '0.72rem', fontWeight: 600,
                  }}>{tag}</span>
                ))}
              </div>
              <Link href="/listen/test" style={{
                display: 'inline-block', background: 'white', color: '#1E3A8A',
                borderRadius: '0.75rem', padding: '0.55rem 1.3rem',
                textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem',
                fontFamily: "'Outfit', sans-serif",
              }}>
                Start Test →
              </Link>
            </div>
          </div>
        </div>

        {/* Practice Listening Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0891B2 0%, #0369A1 100%)',
          borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem',
          color: 'white', border: '1.5px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 18px rgba(3,105,161,0.35)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ fontSize: '2.2rem', lineHeight: 1 }}>🎯</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.3rem' }}>
                Listening Practice
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', margin: '0 0 0.9rem', lineHeight: 1.5 }}>
                Short MCQ sessions with TTS audio. Choose your level, set a timer, and train your ear for the real exam.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {['A1 → B2 levels', 'Replay control', 'FR + EN transcript', 'Timed mode'].map(tag => (
                  <span key={tag} style={{
                    background: 'rgba(255,255,255,0.18)', borderRadius: '1rem',
                    padding: '0.2rem 0.65rem', fontSize: '0.75rem', fontWeight: 600
                  }}>{tag}</span>
                ))}
              </div>
              <Link href="/listen/practice" style={{
                display: 'inline-block', background: 'white', color: '#0369A1',
                borderRadius: '0.75rem', padding: '0.6rem 1.4rem',
                textDecoration: 'none', fontWeight: 800, fontSize: '0.95rem',
                fontFamily: "'Outfit', sans-serif", boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
              }}>
                Start Practice →
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0 1rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>OR TAKE THE FULL EXAM</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        </div>

        <Link href="/listen/tef-listening-01" style={{
          display: 'block', background: '#0A2540', color: 'white',
          borderRadius: '1rem', padding: '1.2rem', textAlign: 'center',
          textDecoration: 'none', fontWeight: 800, fontSize: '1.1rem',
          fontFamily: "'Outfit', sans-serif"
        }}>
          🎧 Start Listening Exam →
        </Link>

        <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', marginTop: '1rem' }}>
          Make sure your volume is turned up before starting
        </p>
      </div>
    </div>
  )
}
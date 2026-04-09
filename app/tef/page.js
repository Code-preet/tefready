'use client'
import Link from 'next/link'
import { useApp } from '../../components/AppProvider'

export default function TEFPage() {
  const { state } = useApp()
  const lang = state?.lang || 'en'

  const sections = [
    {
      id: 'reading',
      icon: '📖',
      color: '#0D9488',
      title: 'Compréhension de l\'écrit',
      subtitle: 'Reading Comprehension',
      desc: 'Master TEF reading with authentic texts, strategies and timed practice.',
      time: '50 min',
      questions: '3 texts',
      clb: 'CLB 5–12',
      href: '/learn/TEF',
      lessons: ['tef-1']
    },
    {
      id: 'writing',
      icon: '✍️',
      color: '#7C3AED',
      title: 'Expression écrite',
      subtitle: 'Written Expression',
      desc: 'Learn formal letter writing, essay structure and TEF scoring criteria.',
      time: '60 min',
      questions: '2 tasks',
      clb: 'CLB 5–12',
      href: '/learn/TEF',
      lessons: ['tef-2']
    },
    {
      id: 'listening',
      icon: '🎧',
      color: '#BE185D',
      title: 'Compréhension de l\'oral',
      subtitle: 'Listening Comprehension',
      desc: 'Full 40-minute listening simulation with authentic French audio.',
      time: '40 min',
      questions: '13 questions',
      clb: 'CLB 5–12',
      href: '/listen',
      lessons: ['tef-3']
    },
    {
      id: 'speaking',
      icon: '🎤',
      color: '#D97706',
      title: 'Expression orale',
      subtitle: 'Speaking Expression',
      desc: 'Record your responses and get instant AI feedback on your French.',
      time: '15 min',
      questions: '3 tasks',
      clb: 'CLB 5–12',
      href: '/speak',
      lessons: ['tef-4']
    },
  ]

  const clbLevels = [
    { clb: 'CLB 4–5', tef: '181–225', description: 'Basic communication', color: '#DC2626' },
    { clb: 'CLB 6', tef: '226–270', description: 'Intermediate communication', color: '#D97706' },
    { clb: 'CLB 7', tef: '271–315', description: 'Immigration requirement ✅', color: '#059669' },
    { clb: 'CLB 8', tef: '316–360', description: 'Strong proficiency', color: '#0D9488' },
    { clb: 'CLB 9+', tef: '361–450', description: 'Near-native proficiency', color: '#7C3AED' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '2rem 1rem 6rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A2540 0%, #1a3a5c 100%)',
          borderRadius: '1.5rem', padding: '2.5rem', marginBottom: '2rem', color: 'white'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', margin: '0 0 0.5rem', fontWeight: 800 }}>
            TEF Canada Prep
          </h1>
          <p style={{ color: '#94A3B8', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
            Complete preparation for all 4 TEF Canada exam sections. Target CLB 7+ for immigration.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { icon: '📋', label: '4 exam sections' },
              { icon: '⏱️', label: '~3 hours total' },
              { icon: '🎯', label: 'CLB 7+ target' },
              { icon: '🤖', label: 'AI feedback' },
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem',
                padding: '0.5rem 1rem', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}>
                {item.icon} {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* 4 Sections */}
        <h2 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', margin: '0 0 1rem', fontWeight: 700 }}>
          The 4 TEF Canada Sections
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {sections.map(section => (
            <div key={section.id} style={{
              background: 'white', borderRadius: '1.25rem', padding: '1.5rem',
              border: '1.5px solid #E8F0FB', display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  background: section.color, borderRadius: '0.75rem',
                  width: '48px', height: '48px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0
                }}>{section.icon}</div>
                <div>
                  <h3 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1rem', margin: '0 0 0.2rem', fontWeight: 700 }}>
                    {section.title}
                  </h3>
                  <p style={{ color: '#718096', fontSize: '0.8rem', margin: 0 }}>{section.subtitle}</p>
                </div>
              </div>

              <p style={{ color: '#4A5568', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
                {section.desc}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[section.time, section.questions, section.clb].map(tag => (
                  <span key={tag} style={{
                    background: '#F1F5F9', color: '#64748B', borderRadius: '0.4rem',
                    padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 600
                  }}>{tag}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link href={section.href} style={{
                  flex: 1, background: section.color, color: 'white',
                  borderRadius: '0.75rem', padding: '0.75rem',
                  textAlign: 'center', textDecoration: 'none',
                  fontWeight: 700, fontSize: '0.875rem',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                  Practice Now →
                </Link>
                <Link href={`/learn/TEF`} style={{
                  flex: 1, background: '#F7F9FC', color: '#0A2540',
                  borderRadius: '0.75rem', padding: '0.75rem',
                  textAlign: 'center', textDecoration: 'none',
                  fontWeight: 700, fontSize: '0.875rem',
                  border: '1px solid #E2E8F0'
                }}>
                  Study Tips
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CLB Score Table */}
        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.5rem', border: '1.5px solid #E8F0FB', marginBottom: '2rem' }}>
          <h2 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', margin: '0 0 1rem', fontWeight: 700 }}>
            📊 TEF Canada Score → CLB Level
          </h2>
          {clbLevels.map(level => (
            <div key={level.clb} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.75rem 0', borderBottom: '1px solid #F1F5F9'
            }}>
              <div style={{
                background: level.color, color: 'white', borderRadius: '0.5rem',
                padding: '0.3rem 0.7rem', fontSize: '0.8rem', fontWeight: 700,
                minWidth: '70px', textAlign: 'center'
              }}>{level.clb}</div>
              <div style={{ flex: 1 }}>
                <span style={{ color: '#0A2540', fontWeight: 600, fontSize: '0.875rem' }}>TEF: {level.tef} points</span>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem', marginLeft: '0.5rem' }}>— {level.description}</span>
              </div>
            </div>
          ))}
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '0.75rem', margin: '0.75rem 0 0' }}>
            * CLB 7 (271+ TEF points) is the minimum for most Canadian immigration programs
          </p>
        </div>

        {/* Quick tips */}
        <div style={{ background: '#FFF8EC', borderRadius: '1.25rem', padding: '1.5rem', border: '1.5px solid #F6D07A' }}>
          <h3 style={{ color: '#92400E', fontFamily: "'Outfit', sans-serif", fontSize: '1rem', margin: '0 0 0.75rem', fontWeight: 700 }}>
            💡 Top 5 TEF Success Tips
          </h3>
          {[
            'Reading: Read questions BEFORE the text — never after',
            'Writing: Use thèse-antithèse-synthèse structure every time',
            'Listening: Audio plays ONCE — take notes on numbers and names immediately',
            'Speaking: Never stay silent — use fillers like "C\'est-à-dire que..." to buy time',
            'All sections: Vary your vocabulary — repetition costs points',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#E8A020', fontWeight: 800, fontSize: '0.9rem', minWidth: '20px' }}>{i + 1}.</span>
              <p style={{ color: '#78350F', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>{tip}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
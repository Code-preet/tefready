'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    if (authError) {
      setLoading(false)
      return setError('Invalid email or password. Please try again.')
    }

    setLoading(false)
    router.push('/')
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#FFFEF5', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '1rem'
    }}>
      <div style={{
        background: 'white', borderRadius: '1.5rem', padding: '2.5rem 2rem',
        maxWidth: '420px', width: '100%',
        boxShadow: '0 8px 40px rgba(10,37,64,0.10)', border: '1.5px solid #E8F0FB'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#0A2540', borderRadius: '0.75rem',
            padding: '0.5rem 1.1rem', marginBottom: '1.25rem'
          }}>
            <span style={{ color: '#E8A020', fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem' }}>TEF</span>
            <span style={{ color: 'white', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '1.2rem' }}>Ready</span>
          </div>
          <h1 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>
            Welcome back
          </h1>
          <p style={{ color: '#718096', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Sign in to continue your progress
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { label: 'Email address', name: 'email', type: 'email', placeholder: 'you@email.com' },
            { label: 'Password', name: 'password', type: 'password', placeholder: 'Your password' },
          ].map(f => (
            <div key={f.name}>
              <label style={{ display: 'block', color: '#0A2540', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                {f.label}
              </label>
              <input
                name={f.name} type={f.type} value={form[f.name]}
                onChange={handle} required placeholder={f.placeholder}
                style={{
                  width: '100%', padding: '0.8rem 1rem', borderRadius: '0.65rem',
                  border: '1.5px solid #E2E8F0', fontSize: '0.95rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0A2540',
                  background: '#FAFBFF', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          ))}

          {error && (
            <div style={{
              background: '#FFF5F5', border: '1px solid #FC8181',
              borderRadius: '0.5rem', padding: '0.75rem 1rem',
              color: '#C53030', fontSize: '0.875rem'
            }}>⚠️ {error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            background: loading ? '#CBD5E0' : '#0A2540', color: 'white',
            border: 'none', borderRadius: '0.75rem', padding: '0.9rem',
            fontWeight: 700, fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'Outfit', sans-serif", marginTop: '0.5rem'
          }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#718096', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link href="/auth/signup" style={{ color: '#E8A020', fontWeight: 700, textDecoration: 'none' }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
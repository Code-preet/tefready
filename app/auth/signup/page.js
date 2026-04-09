'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.username.length < 3) return setError('Username must be at least 3 characters.')
    setLoading(true)

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', form.username)
      .single()

    if (existing) {
      setLoading(false)
      return setError('Username already taken. Please choose another.')
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email.toLowerCase().trim(),
      password: form.password,
      options: { data: { username: form.username } }
    })

    if (authError) {
      setLoading(false)
      return setError(authError.message)
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        username: form.username,
        email: form.email.toLowerCase().trim(),
      })

      await fetch('/api/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, username: form.username })
      })
    }

    setLoading(false)
    setDone(true)
  }

  if (done) return (
    <div style={{
      minHeight: '100vh', background: '#FFFEF5', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '1rem'
    }}>
      <div style={{
        background: 'white', borderRadius: '1.5rem', padding: '3rem 2.5rem',
        maxWidth: '480px', width: '100%', textAlign: 'center',
        boxShadow: '0 8px 40px rgba(10,37,64,0.10)', border: '1.5px solid #E8F0FB'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.7rem', marginBottom: '0.75rem' }}>
          Account Created!
        </h2>
        <p style={{ color: '#4a5568', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Your account is ready. You can now sign in and start learning French!
        </p>
        <Link href="/auth/login" style={{
          display: 'inline-block', background: '#E8A020', color: 'white',
          padding: '0.85rem 2rem', borderRadius: '0.75rem', fontWeight: 700,
          textDecoration: 'none', fontSize: '1rem'
        }}>Sign In Now →</Link>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#FFFEF5', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '1rem'
    }}>
      <div style={{
        background: 'white', borderRadius: '1.5rem', padding: '2.5rem 2rem',
        maxWidth: '460px', width: '100%',
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
            Create your account
          </h1>
          <p style={{ color: '#718096', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Track your progress and save your work across all devices
          </p>
        </div>

        {/* Benefits */}
        <div style={{ background: '#F0FDF4', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #86EFAC' }}>
          {[
            '📊 Track your XP and streak',
            '💾 Save completed lessons',
            '🎯 Get personalized homework',
            '📈 Monitor your TEF progress'
          ].map((b, i) => (
            <div key={i} style={{ color: '#065F46', fontSize: '0.85rem', padding: '0.2rem 0' }}>{b}</div>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { label: 'Username', name: 'username', type: 'text', placeholder: 'John Doe' },
            { label: 'Email address', name: 'email', type: 'email', placeholder: 'john@example.com' },
            { label: 'Password', name: 'password', type: 'password', placeholder: 'Minimum 6 characters' },
            { label: 'Confirm password', name: 'confirm', type: 'password', placeholder: 'Repeat your password' },
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
            background: loading ? '#CBD5E0' : '#E8A020', color: 'white',
            border: 'none', borderRadius: '0.75rem', padding: '0.9rem',
            fontWeight: 700, fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'Outfit', sans-serif", marginTop: '0.5rem'
          }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#718096', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#E8A020', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useApp } from './AppProvider';
import { LANG_NAMES } from '../lib/i18n';

const NAV_ITEMS = [
  { href: '/',        icon: '🏠', key: 'home' },
  { href: '/learn',   icon: '📚', key: 'learn' },
  { href: '/quick',   icon: '⚡', key: 'quick' },
  { href: '/listen',  icon: '🎧', key: 'listen' },
  { href: '/speak',   icon: '🎤', key: 'speak' },
  { href: '/tef',     icon: '🏆', key: 'tef' },
  { href: '/tools',   icon: '🛠️', key: 'tools' },
  { href: '/profile', icon: '👤', key: 'profile' },
]

export default function Nav({ navT }) {
  const pathname = usePathname()
  const router = useRouter()
  const { state, setLang } = useApp()
  const [langOpen, setLangOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [supabase, setSupabase] = useState(null)

  useEffect(() => {
    // Dynamically import supabase to avoid SSR issues
    import('../lib/supabase').then(({ supabase: sb }) => {
      setSupabase(sb)
      sb.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          sb.from('profiles').select('username').eq('id', session.user.id).single()
            .then(({ data }) => { if (data) setUsername(data.username) })
        }
      }).catch(() => {})

      const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          sb.from('profiles').select('username').eq('id', session.user.id).single()
            .then(({ data }) => { if (data) setUsername(data.username) })
        } else {
          setUsername('')
        }
      })
      return () => subscription.unsubscribe()
    }).catch(() => {})
  }, [])

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const navLabel = (key) => {
    const labels = { listen: 'Listen', speak: 'Speak', tools: 'Tools', quick: 'Feed', daily: 'Daily' }
    if (!navT) return labels[key] || key
    return navT[key] || labels[key] || key
  }

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:block sticky top-0 z-50" style={{ background:'rgba(255,255,255,0.92)', backdropFilter:'blur(16px)', borderBottom:'1.5px solid #DBEAFE', boxShadow:'0 1px 8px rgba(37,99,235,0.07)' }}>
        <div className="max-w-5xl mx-auto px-5 flex items-center h-14 gap-1">
          <Link href="/" className="flex items-center gap-2 mr-4 font-display font-bold no-underline hover:opacity-80 transition-opacity" style={{ color:'#1E3A8A' }}>
            <span className="text-xl">🇫🇷</span>
            <span>TEFReady</span>
          </Link>

          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={`px-3 py-1.5 rounded-xl text-sm font-body no-underline transition-all font-medium ${
                  active
                    ? 'text-white font-semibold'
                    : 'text-slate-500 hover:bg-blue-50'
                }`}
                style={active ? { background:'#2563EB', color:'white' } : { color:'#475569' }}>
                {item.icon} {navLabel(item.key)}
              </Link>
            )
          })}

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background:'#FFF7ED', color:'#C2410C', border:'1px solid #FED7AA' }}>
              🔥 {state?.streak || 0}
            </div>
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background:'#EFF6FF', color:'#1D4ED8', border:'1px solid #BFDBFE' }}>
              ⚡ {state?.xp || 0} XP
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-navy bg-slate-100 rounded-full px-3 py-1">
                  👤 {username || 'User'}
                </span>
                <button onClick={handleLogout}
                  className="text-xs bg-red-50 text-red-600 rounded-lg px-3 py-1.5 font-medium hover:bg-red-100 transition-colors border-none cursor-pointer">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login"
                  className="text-xs px-3 py-1.5 rounded-xl no-underline font-medium transition-colors hover:bg-blue-50"
                  style={{ color:'#2563EB' }}>
                  Sign in
                </Link>
                <Link href="/auth/signup"
                  className="text-xs text-white px-3 py-1.5 rounded-xl no-underline font-semibold transition-opacity hover:opacity-90"
                  style={{ background:'#2563EB', boxShadow:'0 2px 6px rgba(37,99,235,0.3)' }}>
                  Sign up
                </Link>
              </div>
            )}

            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 bg-slate-100 text-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-slate-200 transition-colors">
                {LANG_NAMES[state?.lang] || 'English'}
                <span className="opacity-60">▾</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl overflow-hidden z-50 shadow-lift min-w-[140px]">
                  {Object.entries(LANG_NAMES).map(([code, name]) => (
                    <button key={code} onClick={() => { setLang(code); setLangOpen(false) }}
                      className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                        state?.lang === code ? 'bg-navy/5 text-navy font-semibold' : 'text-slate-700'
                      }`}>
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-50" style={{ background:'rgba(255,255,255,0.95)', backdropFilter:'blur(12px)', borderBottom:'1.5px solid #DBEAFE', boxShadow:'0 1px 6px rgba(37,99,235,0.07)' }}>
        <div className="flex items-center justify-between h-12 px-4">
          <Link href="/" className="font-display font-bold text-base no-underline flex items-center gap-1.5" style={{ color:'#1E3A8A' }}>
            <span>🇫🇷</span> TEFReady
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold rounded-full px-2 py-0.5" style={{ background:'#FFF7ED', color:'#C2410C', border:'1px solid #FED7AA' }}>🔥{state?.streak || 0}</span>
            <span className="text-xs font-semibold rounded-full px-2 py-0.5" style={{ background:'#EFF6FF', color:'#1D4ED8', border:'1px solid #BFDBFE' }}>⚡{state?.xp || 0}</span>
            {user ? (
              <button onClick={handleLogout}
                className="text-xs bg-red-50 text-red-600 rounded-md px-2 py-1 border-none cursor-pointer">
                Out
              </button>
            ) : (
              <Link href="/auth/login"
                className="text-xs bg-navy text-white rounded-md px-2 py-1 no-underline font-semibold">
                Login
              </Link>
            )}
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="text-xs bg-slate-100 text-slate-600 rounded-md px-2 py-1">
                {state?.lang?.toUpperCase() || 'EN'}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl overflow-hidden z-50 shadow-lift min-w-[130px]">
                  {Object.entries(LANG_NAMES).map(([code, name]) => (
                    <button key={code} onClick={() => { setLang(code); setLangOpen(false) }}
                      className={`block w-full text-left px-3 py-2 text-sm ${state?.lang === code ? 'bg-navy/5 text-navy font-semibold' : 'text-slate-700'}`}>
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{ background:'rgba(255,255,255,0.97)', backdropFilter:'blur(16px)', borderTop:'1.5px solid #DBEAFE', boxShadow:'0 -2px 12px rgba(37,99,235,0.08)' }}>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className="flex-1 flex flex-col items-center py-2 no-underline gap-0.5 transition-colors">
              <span className={`text-lg leading-none transition-transform ${active ? 'scale-110' : ''}`}
                style={active ? { filter:'drop-shadow(0 0 6px rgba(37,99,235,0.5))' } : {}}>
                {item.icon}
              </span>
              <span className="text-[10px] font-body font-semibold"
                style={{ color: active ? '#2563EB' : '#94a3b8' }}>
                {navLabel(item.key)}
              </span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full"
                  style={{ background:'#2563EB', display:'block', position:'absolute', bottom:0 }} />
              )}
            </Link>
          )
        })}
      </div>
    </>
  )
}
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
      <nav className="hidden md:block bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 flex items-center h-14 gap-1">
          <Link href="/" className="flex items-center gap-2 mr-4 font-display font-bold text-navy text-lg no-underline hover:opacity-80 transition-opacity">
            <span className="text-xl">🇫🇷</span>
            <span>TEFReady</span>
          </Link>

          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-body no-underline transition-all ${
                  active ? 'bg-navy/8 text-navy font-semibold' : 'text-slate-500 hover:text-navy hover:bg-slate-50'
                }`}>
                {item.icon} {navLabel(item.key)}
              </Link>
            )
          })}

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 rounded-full px-3 py-1 text-xs font-semibold">
              🔥 {state?.streak || 0}
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 rounded-full px-3 py-1 text-xs font-semibold">
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
                  className="text-xs text-slate-600 hover:text-navy px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors no-underline font-medium">
                  Sign in
                </Link>
                <Link href="/auth/signup"
                  className="text-xs bg-navy text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity no-underline font-semibold">
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
      <div className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between h-12 px-4">
          <Link href="/" className="font-display font-bold text-navy text-base no-underline flex items-center gap-1.5">
            <span>🇫🇷</span> TEFReady
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 rounded-full px-2 py-0.5">🔥{state?.streak || 0}</span>
            <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 rounded-full px-2 py-0.5">⚡{state?.xp || 0}</span>
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className={`flex-1 flex flex-col items-center py-2 no-underline gap-0.5 transition-colors ${
                active ? 'text-navy' : 'text-slate-400'
              }`}>
              <span className="text-lg leading-none">{item.icon}</span>
              <span className={`text-[10px] font-body ${active ? 'font-semibold' : ''}`}>{navLabel(item.key)}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
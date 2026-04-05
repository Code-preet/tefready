'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useApp } from './AppProvider';
import { LANG_NAMES } from '../lib/i18n';

const NAV_ITEMS = [
  { href: '/',        icon: '🏠', key: 'home' },
  { href: '/learn',   icon: '📚', key: 'learn' },
  { href: '/daily',   icon: '⚡', key: 'daily' },
  { href: '/tef',     icon: '🏆', key: 'tef' },
  { href: '/profile', icon: '👤', key: 'profile' },
];

export default function Nav({ navT }) {
  const pathname = usePathname();
  const { state, setLang, level, xpInLevel } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:block bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 flex items-center h-14 gap-1">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-5 font-display font-bold text-navy text-lg no-underline hover:opacity-80 transition-opacity">
            <span className="text-xl">🇫🇷</span>
            <span>TEFReady</span>
          </Link>

          {/* Nav links */}
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-body no-underline transition-all ${
                  active
                    ? 'bg-navy/8 text-navy font-semibold'
                    : 'text-slate-500 hover:text-navy hover:bg-slate-50'
                }`}>
                {navT[item.key]}
              </Link>
            );
          })}

          <div className="ml-auto flex items-center gap-2">
            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 rounded-full px-3 py-1 text-xs font-semibold">
              🔥 {state.streak || 0}
            </div>
            {/* XP */}
            <div className="flex items-center gap-1.5 bg-gold-light text-gold-muted rounded-full px-3 py-1 text-xs font-semibold">
              ⚡ {state.xp || 0} XP
            </div>

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 bg-slate-100 text-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-slate-200 transition-colors"
              >
                {LANG_NAMES[state.lang] || 'English'}
                <span className="opacity-60">▾</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl overflow-hidden z-50 shadow-lift min-w-[140px]">
                  {Object.entries(LANG_NAMES).map(([code, name]) => (
                    <button key={code}
                      onClick={() => { setLang(code); setLangOpen(false); }}
                      className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                        state.lang === code ? 'bg-navy/5 text-navy font-semibold' : 'text-slate-700'
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
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 rounded-full px-2 py-0.5">🔥{state.streak || 0}</span>
            <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 rounded-full px-2 py-0.5">⚡{state.xp || 0}</span>
            {/* Mobile language */}
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="text-xs bg-slate-100 text-slate-600 rounded-md px-2 py-1">
                {state.lang?.toUpperCase()}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl overflow-hidden z-50 shadow-lift min-w-[130px]">
                  {Object.entries(LANG_NAMES).map(([code, name]) => (
                    <button key={code} onClick={() => { setLang(code); setLangOpen(false); }}
                      className={`block w-full text-left px-3 py-2 text-sm ${state.lang === code ? 'bg-navy/5 text-navy font-semibold' : 'text-slate-700'}`}>
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
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={`flex-1 flex flex-col items-center py-2 no-underline gap-0.5 transition-colors ${
                active ? 'text-navy' : 'text-slate-400'
              }`}>
              <span className="text-lg leading-none">{item.icon}</span>
              <span className={`text-[10px] font-body ${active ? 'font-semibold' : ''}`}>{navT[item.key]}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

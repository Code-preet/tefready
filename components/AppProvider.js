'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const KEY = 'tefready_v1';
const DEFAULT_STATE = { xp: 0, streak: 0, completed: {}, lastLogin: null, lang: 'en' };

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        let streak = saved.streak || 0;
        if (saved.lastLogin && saved.lastLogin !== today) {
          streak = saved.lastLogin === yesterday ? streak + 1 : 1;
        }
        setState({ ...DEFAULT_STATE, ...saved, lastLogin: today, streak });
      } else {
        setState(s => ({ ...s, lastLogin: new Date().toDateString() }));
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state, loaded]);

  const addXP = (n) => setState(s => ({ ...s, xp: (s.xp || 0) + n }));
  const markComplete = (id) => setState(s => ({ ...s, completed: { ...s.completed, [id]: true } }));
  const setLang = (l) => setState(s => ({ ...s, lang: l }));
  const reset = () => setState({ ...DEFAULT_STATE, lastLogin: new Date().toDateString() });

  const xp = state.xp || 0;
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const completedCount = Object.keys(state.completed || {}).length;

  return (
    <AppContext.Provider value={{ state, addXP, markComplete, setLang, reset, loaded, level, xpInLevel, completedCount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

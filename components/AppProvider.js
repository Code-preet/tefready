'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const KEY = 'tefready_v2';   // bumped so new fields merge cleanly

const DEFAULT_STATE = {
  // ── Existing ───────────────────────────────────────────────────────────────
  xp:          0,
  streak:      0,
  completed:   {},
  lastLogin:   null,
  lang:        'en',
  // ── Daily system ──────────────────────────────────────────────────────────
  dailyGoal:          2,     // how many lessons the user wants to do per day
  todayDate:          null,  // 'Mon Jan 01 2025' — resets daily fields when changed
  todayCompleted:     [],    // lesson IDs completed today
  todayXP:            0,     // XP earned today
  dailyBonusClaimed:  false, // did we award the goal-completion bonus today?
  // ── Long-term ─────────────────────────────────────────────────────────────
  longestStreak:   0,
  totalLessons:    0,
};

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  // ── Load from localStorage ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const today     = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      // Try new key first, fall back to old key for existing users
      const raw = localStorage.getItem(KEY) || localStorage.getItem('tefready_v1');
      if (raw) {
        const saved = JSON.parse(raw);

        // ── Streak logic ────────────────────────────────────────────────────
        let streak = saved.streak || 0;
        if (saved.lastLogin && saved.lastLogin !== today) {
          streak = saved.lastLogin === yesterday ? streak + 1 : 1;
        }
        const longestStreak = Math.max(streak, saved.longestStreak || 0);

        // ── Daily reset logic ────────────────────────────────────────────────
        const isNewDay = saved.todayDate !== today;
        const todayCompleted    = isNewDay ? [] : (saved.todayCompleted || []);
        const todayXP           = isNewDay ? 0  : (saved.todayXP       || 0);
        const dailyBonusClaimed = isNewDay ? false : (saved.dailyBonusClaimed || false);

        setState({
          ...DEFAULT_STATE,
          ...saved,
          lastLogin:          today,
          streak,
          longestStreak,
          todayDate:          today,
          todayCompleted,
          todayXP,
          dailyBonusClaimed,
          // carry over totalLessons (may be more than saved.totalLessons if migrating)
          totalLessons: Math.max(
            saved.totalLessons || 0,
            Object.keys(saved.completed || {}).length
          ),
        });
      } else {
        // First-ever visit
        setState(s => ({ ...s, lastLogin: today, todayDate: today }));
      }
    } catch {}
    setLoaded(true);
  }, []);

  // ── Persist on every state change ─────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state, loaded]);

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Add XP — also tracks today's XP */
  const addXP = (n) => setState(s => ({
    ...s,
    xp:      (s.xp     || 0) + n,
    todayXP: (s.todayXP || 0) + n,
  }));

  /** Mark a lesson complete — also adds to today's list and totalLessons */
  const markComplete = (id) => setState(s => {
    const alreadyTodayDone = (s.todayCompleted || []).includes(id);
    const alreadyEverDone  = !!(s.completed || {})[id];
    return {
      ...s,
      completed:     { ...s.completed, [id]: true },
      todayCompleted: alreadyTodayDone ? s.todayCompleted : [...(s.todayCompleted || []), id],
      totalLessons:  alreadyEverDone ? s.totalLessons : (s.totalLessons || 0) + 1,
    };
  });

  /** Change the daily lesson goal (1–5) */
  const setDailyGoal = (n) => setState(s => ({
    ...s,
    dailyGoal: Math.min(5, Math.max(1, Number(n))),
  }));

  /** Claim the daily goal completion bonus (called once per day from daily page) */
  const claimDailyBonus = () => setState(s => {
    if (s.dailyBonusClaimed) return s;
    return {
      ...s,
      xp:                 (s.xp || 0) + 50,
      todayXP:            (s.todayXP || 0) + 50,
      dailyBonusClaimed:  true,
    };
  });

  const setLang = (l) => setState(s => ({ ...s, lang: l }));

  const reset = () => setState({
    ...DEFAULT_STATE,
    lastLogin: new Date().toDateString(),
    todayDate: new Date().toDateString(),
  });

  // ── Derived values ─────────────────────────────────────────────────────────
  const xp             = state.xp || 0;
  const level          = Math.floor(xp / 100) + 1;
  const xpInLevel      = xp % 100;
  const completedCount = Object.keys(state.completed || {}).length;

  const todayCount     = (state.todayCompleted || []).length;
  const dailyGoal      = state.dailyGoal || 2;
  const dailyProgress  = Math.min(1, todayCount / dailyGoal);   // 0–1
  const goalMet        = todayCount >= dailyGoal;

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      state,
      // actions
      addXP, markComplete, setLang, reset, setDailyGoal, claimDailyBonus,
      // scalars
      loaded, level, xpInLevel, completedCount,
      // daily
      todayCount, dailyGoal, dailyProgress, goalMet,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

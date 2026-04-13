'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const KEY = 'tefready_v3';   // bumped — adds lessonScores field

const DEFAULT_STATE = {
  xp:          0,
  streak:      0,
  completed:   {},
  lastLogin:   null,
  lang:        'en',
  // ── Daily system ──────────────────────────────────────────────────────────
  dailyGoal:          2,
  todayDate:          null,
  todayCompleted:     [],
  todayXP:            0,
  dailyBonusClaimed:  false,
  // ── Long-term ─────────────────────────────────────────────────────────────
  longestStreak:  0,
  totalLessons:   0,
  // ── Progression (new) ─────────────────────────────────────────────────────
  // { [lessonId]: { pct: 87, correct: 7, total: 8, passed: true, attempts: 2 } }
  lessonScores: {},
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

      // Try new key first, then fall back through previous keys
      const raw = localStorage.getItem(KEY)
               || localStorage.getItem('tefready_v2')
               || localStorage.getItem('tefready_v1');

      if (raw) {
        const saved = JSON.parse(raw);

        // ── Streak logic ─────────────────────────────────────────────────────
        let streak = saved.streak || 0;
        if (saved.lastLogin && saved.lastLogin !== today) {
          streak = saved.lastLogin === yesterday ? streak + 1 : 1;
        }
        const longestStreak = Math.max(streak, saved.longestStreak || 0);

        // ── Daily reset logic ─────────────────────────────────────────────────
        const isNewDay = saved.todayDate !== today;

        setState({
          ...DEFAULT_STATE,
          ...saved,
          lastLogin:          today,
          streak,
          longestStreak,
          todayDate:          today,
          todayCompleted:     isNewDay ? [] : (saved.todayCompleted || []),
          todayXP:            isNewDay ? 0  : (saved.todayXP || 0),
          dailyBonusClaimed:  isNewDay ? false : (saved.dailyBonusClaimed || false),
          totalLessons: Math.max(
            saved.totalLessons || 0,
            Object.keys(saved.completed || {}).length
          ),
          lessonScores: saved.lessonScores || {},
        });
      } else {
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

  const addXP = (n) => setState(s => ({
    ...s,
    xp:      (s.xp     || 0) + n,
    todayXP: (s.todayXP || 0) + n,
  }));

  const markComplete = (id) => setState(s => {
    const alreadyTodayDone = (s.todayCompleted || []).includes(id);
    const alreadyEverDone  = !!(s.completed || {})[id];
    return {
      ...s,
      completed:      { ...s.completed, [id]: true },
      todayCompleted: alreadyTodayDone ? s.todayCompleted : [...(s.todayCompleted || []), id],
      totalLessons:   alreadyEverDone ? s.totalLessons : (s.totalLessons || 0) + 1,
    };
  });

  /**
   * Save a lesson exercise score.
   * @param {string} lessonId
   * @param {number} correct  — number of correct answers
   * @param {number} total    — total questions
   * @param {number} lessonXP — XP for the lesson (used to award on first pass)
   */
  const saveScore = (lessonId, correct, total, lessonXP = 20) => {
    setState(s => {
      const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;
      const passed  = pct >= 70;
      const prev    = s.lessonScores?.[lessonId] || { attempts: 0 };
      const attempts= (prev.attempts || 0) + 1;

      // Only award XP and mark complete on first ever pass
      const wasAlreadyPassed = prev.passed;
      const xpEarned = (!wasAlreadyPassed && passed)
        ? Math.round(lessonXP * (0.5 + 0.5 * (pct / 100)))
        : 0;

      const newScores = {
        ...s.lessonScores,
        [lessonId]: { pct, correct, total, passed, attempts, bestPct: Math.max(pct, prev.bestPct || 0) },
      };

      const alreadyEverDone  = !!(s.completed || {})[lessonId];
      const alreadyTodayDone = (s.todayCompleted || []).includes(lessonId);

      return {
        ...s,
        xp:           s.xp + xpEarned,
        todayXP:      (s.todayXP || 0) + xpEarned,
        lessonScores: newScores,
        completed: passed ? { ...s.completed, [lessonId]: true } : s.completed,
        todayCompleted: (passed && !alreadyTodayDone)
          ? [...(s.todayCompleted || []), lessonId]
          : s.todayCompleted,
        totalLessons: (passed && !alreadyEverDone)
          ? (s.totalLessons || 0) + 1
          : s.totalLessons,
      };
    });
  };

  const setDailyGoal = (n) => setState(s => ({
    ...s, dailyGoal: Math.min(5, Math.max(1, Number(n))),
  }));

  const claimDailyBonus = () => setState(s => {
    if (s.dailyBonusClaimed) return s;
    return {
      ...s,
      xp:                s.xp + 50,
      todayXP:           (s.todayXP || 0) + 50,
      dailyBonusClaimed: true,
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
  const dailyProgress  = Math.min(1, todayCount / dailyGoal);
  const goalMet        = todayCount >= dailyGoal;

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      state,
      addXP, markComplete, saveScore, setLang, reset, setDailyGoal, claimDailyBonus,
      loaded, level, xpInLevel, completedCount,
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

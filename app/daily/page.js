'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav from '../../components/Nav';
import { useApp } from '../../components/AppProvider';
import { T } from '../../lib/i18n';
import { MODULES, LESSONS } from '../../lib/data';

// ── Helpers ───────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDayOfWeek() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

const GOAL_OPTIONS = [1, 2, 3, 5];

const STREAK_MILESTONES = [
  { days: 3,  badge: '🥉', label: '3-Day Streak!' },
  { days: 7,  badge: '🥈', label: 'One Week!' },
  { days: 14, badge: '🥇', label: '2 Weeks Strong!' },
  { days: 30, badge: '💎', label: '30-Day Champion!' },
  { days: 100,badge: '🏆', label: '100 Days Legend!' },
];

function getStreakMilestone(streak) {
  return [...STREAK_MILESTONES].reverse().find(m => streak >= m.days);
}

function ttsSpeak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-CA'; u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// ── Mini AI Lesson Component (kept from old daily page) ───────────────────────
function AIDailyLesson({ onClose }) {
  const { state, addXP, markComplete } = useApp();
  const lang = state?.lang || 'en';
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const generate = async () => {
    setLoading(true); setError(null); setLesson(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp: state.xp || 0, completedLessons: Object.keys(state.completed || {}), lang }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLesson(data.lesson);
    } catch (e) { setError(e.message || 'Could not generate. Try again.'); }
    setLoading(false);
  };

  useEffect(() => { generate(); }, []);

  const complete = () => { addXP(20); setDone(true); };

  if (done) {
    return (
      <div className="card p-6 text-center animate-pop-in">
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="font-display font-bold text-lg mb-1" style={{ color:'#1E3A8A' }}>Lesson Complete!</h3>
        <p className="text-sm text-slate-500 font-body mb-4">+20 XP added</p>
        <div className="flex gap-3">
          <button onClick={() => { setLesson(null); setDone(false); generate(); }} className="btn-secondary flex-1 text-sm">
            🔄 Another
          </button>
          <button onClick={onClose} className="btn-primary flex-1 text-sm">← Back to Daily</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card p-8 text-center animate-fade-in">
        <div className="text-4xl mb-4 animate-bounce">⚡</div>
        <p className="font-display font-semibold text-base" style={{ color:'#1E3A8A' }}>Generating your lesson…</p>
        <p className="text-sm text-slate-400 font-body mt-1">AI is crafting a personalised French lesson</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-sm text-red-600 font-body mb-3">{error}</p>
        <div className="flex gap-3">
          <button onClick={generate} className="btn-primary flex-1 text-sm">Retry</button>
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">Cancel</button>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="animate-fade-in space-y-4">
      <div className="rounded-3xl p-5 text-white relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,#5B21B6,#7C3AED)' }}>
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10"
          style={{ background:'radial-gradient(circle,#fff,transparent)' }} />
        <p className="text-xs font-bold uppercase tracking-widest text-purple-200 mb-2">🤖 AI Lesson</p>
        <h3 className="font-display font-bold text-lg text-white">{lesson.title}</h3>
        <p className="text-sm text-purple-200 mt-1">{lesson.topic}</p>
      </div>

      {lesson.concept && (
        <div className="card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-purple-500 mb-2">Concept</p>
          <p className="text-sm text-slate-700 font-body leading-relaxed">{lesson.concept}</p>
        </div>
      )}

      {lesson.vocabulary?.length > 0 && (
        <div className="card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-purple-500 mb-3">Vocabulary</p>
          <div className="space-y-3">
            {lesson.vocabulary.map((v, i) => (
              <div key={i} className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-display font-bold text-base" style={{ color:'#1E3A8A' }}>{v.french}</span>
                  {v.phonetic && <span className="text-xs text-slate-400 font-body italic ml-2">/{v.phonetic}/</span>}
                  <p className="text-sm text-blue-700 font-body">{v.english}</p>
                  {v.example && <p className="text-xs text-slate-400 font-body italic">"{v.example}"</p>}
                </div>
                <button onClick={() => ttsSpeak(v.french)}
                  className="flex-shrink-0 text-xs px-2 py-1 rounded-xl font-semibold"
                  style={{ background:'#EDE9FE', color:'#7C3AED' }}>🔊</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {lesson.tip && (
        <div className="rounded-2xl p-4" style={{ background:'#FEF9C3', border:'1px solid #FDE68A' }}>
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">💡 Canada Tip</p>
          <p className="text-sm text-amber-900 font-body leading-relaxed">{lesson.tip}</p>
        </div>
      )}

      <button onClick={complete}
        className="btn-primary w-full py-3.5 text-sm"
        style={{ background:'linear-gradient(135deg,#5B21B6,#7C3AED)', boxShadow:'0 4px 14px rgba(124,58,237,0.4)' }}>
        ✅ Complete Lesson (+20 XP)
      </button>
      <button onClick={onClose} className="btn-ghost w-full text-sm">← Back to Daily</button>
    </div>
  );
}

// ── Main Daily Dashboard ──────────────────────────────────────────────────────
export default function DailyPage() {
  const {
    state, addXP, markComplete,
    level, xpInLevel, completedCount,
    todayCount, dailyGoal, dailyProgress, goalMet,
    setDailyGoal, claimDailyBonus,
  } = useApp();
  if (!state) return null;

  const lang     = state.lang || 'en';
  const navT     = T[lang]?.nav || T.en.nav;
  const streak   = state.streak || 0;
  const todayXP  = state.todayXP || 0;
  const milestone = getStreakMilestone(streak);

  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [bonusJustClaimed, setBonusJustClaimed] = useState(false);

  // All lessons, find first incomplete
  const allLessons = Object.values(LESSONS);
  const firstIncomplete = allLessons.find(l => !state.completed?.[l.id]);

  // Recommend lessons from the first unlocked module that has incomplete lessons
  const recommendedLessons = MODULES
    .flatMap(mod => mod.lessons.map(id => LESSONS[id]).filter(Boolean))
    .filter(l => !state.completed?.[l.id])
    .slice(0, 3);

  const handleClaimBonus = () => {
    claimDailyBonus();
    setBonusJustClaimed(true);
  };

  if (showAI) {
    return (
      <div className="page-shell">
        <Nav navT={navT} />
        <main className="page-content">
          <button onClick={() => setShowAI(false)}
            className="flex items-center gap-2 text-sm font-semibold mb-4 px-3 py-2 rounded-xl transition-colors hover:bg-blue-50"
            style={{ color:'#2563EB' }}>
            ← Daily Dashboard
          </button>
          <AIDailyLesson onClose={() => setShowAI(false)} />
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Nav navT={navT} />
      <main className="page-content">

        {/* ── Greeting hero ─────────────────────────────────────────────────── */}
        <div className="rounded-4xl overflow-hidden mb-5 relative animate-fade-in"
          style={{ background:'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 55%, #2563EB 100%)' }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
            style={{ background:'radial-gradient(circle,#fff,transparent)' }} />
          <div className="p-6">
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">{getDayOfWeek()}</p>
            <h1 className="font-display font-extrabold text-2xl text-white leading-tight mb-0.5">
              {getGreeting()}! {streak > 0 ? '🔥' : '👋'}
            </h1>
            {streak > 0 && (
              <p className="text-blue-100 text-sm font-semibold mb-4">
                {milestone ? `${milestone.badge} ${milestone.label}` : `${streak}-day streak — keep it up!`}
              </p>
            )}
            {streak === 0 && (
              <p className="text-blue-100 text-sm mb-4">Start your streak today — complete a lesson!</p>
            )}

            {/* XP today + level pill */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <span className="text-sm">⚡</span>
                <span className="text-white font-bold text-sm">+{todayXP} XP today</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <span className="text-sm">🏅</span>
                <span className="text-white font-bold text-sm">Level {level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Today's Goal ──────────────────────────────────────────────────── */}
        <div className="card p-5 mb-4 animate-slide-up">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-display font-bold text-base" style={{ color:'#1E3A8A' }}>Today's Goal</h2>
              <p className="text-xs text-slate-400 font-body mt-0.5">
                {goalMet
                  ? '🎯 Goal completed!'
                  : `${dailyGoal - todayCount} lesson${dailyGoal - todayCount !== 1 ? 's' : ''} to go`}
              </p>
            </div>
            <button onClick={() => setShowGoalPicker(!showGoalPicker)}
              className="text-xs font-bold rounded-xl px-3 py-1.5 transition-all"
              style={{ background:'#EFF6FF', color:'#2563EB', border:'1.5px solid #BFDBFE' }}>
              ✏️ {dailyGoal} lessons/day
            </button>
          </div>

          {/* Goal picker */}
          {showGoalPicker && (
            <div className="flex gap-2 mb-4 animate-fade-in">
              {GOAL_OPTIONS.map(n => (
                <button key={n} onClick={() => { setDailyGoal(n); setShowGoalPicker(false); }}
                  className="flex-1 rounded-2xl py-2.5 text-sm font-bold transition-all"
                  style={{
                    background: dailyGoal === n ? '#2563EB' : '#f8fafc',
                    color:      dailyGoal === n ? 'white'   : '#475569',
                    border:     `1.5px solid ${dailyGoal === n ? '#2563EB' : '#e2e8f0'}`,
                  }}>
                  {n}
                </button>
              ))}
            </div>
          )}

          {/* Progress dots + bar */}
          <div className="flex items-center gap-2 mb-2">
            {Array.from({ length: dailyGoal }).map((_, i) => (
              <div key={i} className="flex-1 h-2.5 rounded-full transition-all duration-500"
                style={{
                  background: i < todayCount ? '#2563EB' : '#DBEAFE',
                  boxShadow: i < todayCount ? '0 0 6px rgba(37,99,235,0.4)' : 'none',
                }} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: goalMet ? '#16A34A' : '#2563EB' }}>
              {todayCount}/{dailyGoal} lessons
            </span>
            <span className="text-xs text-slate-400 font-body">
              {Math.round(dailyProgress * 100)}% done
            </span>
          </div>

          {/* Bonus reward banner */}
          {goalMet && !state.dailyBonusClaimed && !bonusJustClaimed && (
            <div className="mt-4 rounded-3xl p-4 animate-pop-in"
              style={{ background:'linear-gradient(135deg,#FEF9C3,#FFF7ED)', border:'1.5px solid #FDE68A' }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display font-bold text-sm" style={{ color:'#92400E' }}>
                    🎁 Daily Goal Bonus!
                  </p>
                  <p className="text-xs text-amber-700 font-body mt-0.5">Claim your +50 XP reward</p>
                </div>
                <button onClick={handleClaimBonus}
                  className="flex-shrink-0 font-bold text-sm text-white rounded-2xl px-4 py-2 transition-all active:scale-95"
                  style={{ background:'linear-gradient(135deg,#D97706,#EA580C)', boxShadow:'0 3px 10px rgba(217,119,6,0.4)' }}>
                  Claim ⚡
                </button>
              </div>
            </div>
          )}

          {/* Bonus just claimed */}
          {(bonusJustClaimed || (goalMet && state.dailyBonusClaimed)) && (
            <div className="mt-4 rounded-3xl p-4"
              style={{ background:'#F0FDF4', border:'1.5px solid #BBF7D0' }}>
              <p className="text-sm font-bold" style={{ color:'#15803D' }}>
                {bonusJustClaimed ? '✅ +50 XP bonus claimed! Come back tomorrow 🎉' : '✅ Daily bonus claimed today!'}
              </p>
            </div>
          )}
        </div>

        {/* ── Stats row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-5 animate-slide-up">
          {[
            {
              icon: '🔥',
              value: streak,
              label: 'Day Streak',
              sub: streak > 0 ? milestone?.label || 'Keep going!' : 'Start today!',
              bg: '#FFF7ED', col: '#C2410C', bdr: '#FED7AA',
            },
            {
              icon: '⚡',
              value: `${todayXP}`,
              label: 'XP Today',
              sub: `Total: ${state.xp || 0} XP`,
              bg: '#EFF6FF', col: '#1D4ED8', bdr: '#BFDBFE',
            },
            {
              icon: '📚',
              value: completedCount,
              label: 'Lessons Done',
              sub: `Lv ${level} · ${xpInLevel}/100`,
              bg: '#F0FDF4', col: '#15803D', bdr: '#BBF7D0',
            },
          ].map((s, i) => (
            <div key={i} className="rounded-3xl p-4 text-center"
              style={{ background: s.bg, border:`1.5px solid ${s.bdr}`, boxShadow:'0 2px 8px rgba(37,99,235,0.06)' }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-display font-extrabold text-xl leading-none" style={{ color: s.col }}>{s.value}</div>
              <div className="text-xs font-bold mt-1" style={{ color: s.col + 'cc' }}>{s.label}</div>
              <div className="text-xs text-slate-400 font-body mt-0.5 leading-tight">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Continue where you left off ────────────────────────────────────── */}
        {firstIncomplete && (
          <div className="mb-5 animate-slide-up">
            <h2 className="section-title mb-3">Continue Learning</h2>
            <Link href={`/learn/${firstIncomplete.moduleId}/${firstIncomplete.id}`}
              className="card flex items-center gap-4 p-4 no-underline group hover:-translate-y-0.5 transition-all">
              <div className="w-14 h-14 rounded-3xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background:'#DBEAFE', border:'1.5px solid #BFDBFE' }}>
                {firstIncomplete.icon || '📖'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-500 font-body mb-0.5">Next Up</p>
                <h3 className="font-display font-bold text-sm leading-snug" style={{ color:'#1E3A8A' }}>
                  {firstIncomplete.title[lang] || firstIncomplete.title.en}
                </h3>
                <p className="text-xs text-slate-400 font-body mt-0.5">
                  Module {firstIncomplete.moduleId} · +{firstIncomplete.xp || 20} XP
                </p>
              </div>
              <div className="text-blue-400 text-xl font-bold group-hover:translate-x-1 transition-transform">›</div>
            </Link>
          </div>
        )}

        {/* ── Recommended lessons ────────────────────────────────────────────── */}
        {recommendedLessons.length > 0 && (
          <div className="mb-5 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title mb-0">Recommended for Today</h2>
              <Link href="/learn" className="text-xs font-bold text-blue-500 no-underline hover:text-blue-700">
                All lessons →
              </Link>
            </div>
            <div className="space-y-2">
              {recommendedLessons.map((lesson, i) => {
                const mod = MODULES.find(m => m.id === lesson.moduleId);
                const done = !!state.completed?.[lesson.id];
                return (
                  <Link key={lesson.id}
                    href={`/learn/${lesson.moduleId}/${lesson.id}`}
                    className="card flex items-center gap-3 p-3.5 no-underline hover:-translate-y-0.5 transition-all">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: done ? '#DCFCE7' : '#EFF6FF', border:`1.5px solid ${done ? '#BBF7D0' : '#BFDBFE'}` }}>
                      {done ? '✅' : (lesson.icon || mod?.icon || '📖')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-sm leading-snug" style={{ color:'#1E3A8A' }}>
                        {lesson.title[lang] || lesson.title.en}
                      </p>
                      <p className="text-xs text-slate-400 font-body mt-0.5">
                        {mod?.label[lang] || mod?.label.en} · +{lesson.xp || 20} XP
                      </p>
                    </div>
                    <span className="text-xs font-bold rounded-xl px-2 py-0.5"
                      style={{ background:'#EFF6FF', color:'#2563EB' }}>
                      +{lesson.xp || 20} XP
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Other practice options ─────────────────────────────────────────── */}
        <div className="mb-5 animate-slide-up">
          <h2 className="section-title mb-3">Practice Options</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon:'⚡', label:'Quick Feed',    sub:'Swipe vocab cards',   href:'/quick',     bg:'linear-gradient(135deg,#1D4ED8,#7C3AED)', text:'white' },
              { icon:'🎧', label:'Listening',     sub:'TEF audio practice',  href:'/listen',    bg:'linear-gradient(135deg,#0369A1,#0891B2)', text:'white' },
              { icon:'🎤', label:'Speaking',      sub:'Oral exam prep',      href:'/tef/exam/speaking', bg:'linear-gradient(135deg,#B45309,#D97706)', text:'white' },
              { icon:'🏆', label:'TEF Exam',      sub:'Full simulator',      href:'/tef/exam',  bg:'linear-gradient(135deg,#1E3A8A,#1D4ED8)',  text:'white' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="rounded-3xl p-4 no-underline hover:-translate-y-0.5 transition-all"
                style={{ background: item.bg, boxShadow:'0 3px 12px rgba(37,99,235,0.2)' }}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-display font-bold text-sm text-white leading-tight">{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.7)' }}>{item.sub}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── AI Daily Lesson card ───────────────────────────────────────────── */}
        <div className="mb-5 animate-slide-up">
          <button onClick={() => setShowAI(true)}
            className="w-full rounded-4xl p-5 text-left no-underline hover:-translate-y-0.5 transition-all relative overflow-hidden"
            style={{ background:'linear-gradient(135deg,#5B21B6 0%,#7C3AED 100%)', boxShadow:'0 4px 18px rgba(124,58,237,0.35)' }}>
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-10"
              style={{ background:'radial-gradient(circle,#fff,transparent)' }} />
            <div className="flex items-center gap-4">
              <div className="text-4xl">🤖</div>
              <div>
                <p className="font-display font-bold text-white text-base">AI Daily Lesson</p>
                <p className="text-purple-200 text-xs font-body mt-0.5">Personalised to your level · +20 XP</p>
              </div>
              <div className="ml-auto text-white text-xl font-bold opacity-60">›</div>
            </div>
          </button>
        </div>

        {/* ── Level progress ─────────────────────────────────────────────────── */}
        <div className="card p-4 mb-4 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <p className="font-display font-bold text-sm" style={{ color:'#1E3A8A' }}>Level {level}</p>
            <p className="text-xs text-slate-400 font-body">{xpInLevel}/100 XP → Level {level + 1}</p>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width:`${xpInLevel}%` }} />
          </div>
          <p className="text-xs text-slate-400 font-body mt-2">
            {100 - xpInLevel} XP until Level {level + 1}
          </p>
        </div>

        {/* ── Streak calendar (last 7 days) ──────────────────────────────────── */}
        <div className="card p-4 animate-slide-up">
          <h2 className="font-display font-bold text-sm mb-3" style={{ color:'#1E3A8A' }}>7-Day Activity</h2>
          <div className="flex gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const daysAgo = 6 - i;
              const d = new Date(Date.now() - daysAgo * 86400000);
              const isToday = daysAgo === 0;
              // Estimate activity: today = based on todayCompleted, others = rough estimate from streak
              const hasActivity = isToday
                ? (state.todayCompleted?.length || 0) > 0
                : daysAgo <= streak;
              const dayLabel = d.toLocaleDateString('en-US', { weekday:'short' })[0];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm transition-all`}
                    style={{
                      background: hasActivity ? (isToday ? '#2563EB' : '#BFDBFE') : '#f1f5f9',
                      boxShadow: hasActivity && isToday ? '0 0 10px rgba(37,99,235,0.4)' : 'none',
                    }}>
                    {hasActivity ? (isToday ? '🔥' : '✓') : ''}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: isToday ? '#2563EB' : '#94a3b8' }}>
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
          {streak > 0 && (
            <p className="text-xs text-slate-400 font-body text-center mt-3">
              🔥 {streak}-day streak · Best: {state.longestStreak || streak} days
            </p>
          )}
        </div>

      </main>
    </div>
  );
}

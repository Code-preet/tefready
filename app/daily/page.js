'use client';
import { useState } from 'react';
import Nav from '../../components/Nav';
import { useApp } from '../../components/AppProvider';
import { T } from '../../lib/i18n';

function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR'; u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export default function DailyPage() {
  const { state, addXP, completedCount } = useApp();
if (!state) return null;
  const lang = state.lang || 'en';
  const dt = T[lang]?.daily || T.en.daily;
  const navT = T[lang]?.nav || T.en.nav;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const level = completedCount < 4 ? 'A1 (absolute beginner)' : completedCount < 8 ? 'A2 (elementary)' : 'B1 (intermediate)';

  const generateLesson = async () => {
    setLoading(true);
    setError(null);
    setLesson(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, completedCount, lang }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLesson(data);
    } catch (e) {
      setError(e.message || 'Could not generate lesson. Please try again.');
    }
    setLoading(false);
  };

  const completeLesson = () => {
    addXP(20);
    setDone(true);
  };

  if (done) {
    return (
      <div className="page-shell">
        <Nav navT={navT} />
        <main className="page-content text-center py-16">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display font-bold text-navy text-2xl mb-2">Lesson Complete!</h2>
          <p className="text-slate-500 font-body mb-6">{dt.xpEarned} added to your profile</p>
          <button onClick={() => { setLesson(null); setDone(false); }}
            className="bg-navy text-white rounded-2xl px-8 py-3.5 font-display font-bold text-sm hover:opacity-90 transition-opacity">
            {dt.different}
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Nav navT={navT} />
      <main className="page-content">
        <h1 className="font-display font-bold text-navy text-2xl mb-1">{dt.title}</h1>
        <p className="text-sm text-slate-500 font-body mb-6">{dt.sub}</p>

        {!lesson && !loading && (
          <div className="text-center py-12">
            <div className="text-7xl mb-5">🤖</div>
            <p className="text-slate-600 font-body mb-8 max-w-sm mx-auto leading-relaxed">{dt.sub}</p>
            {error && (
              <div className="bg-red-50 text-red-700 rounded-xl px-5 py-3 text-sm font-body mb-5 max-w-sm mx-auto">
                {error}
              </div>
            )}
            <button onClick={generateLesson}
              className="bg-navy text-white rounded-2xl px-8 py-4 font-display font-bold text-sm hover:opacity-90 transition-opacity shadow-lift">
              {dt.generate}
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 animate-bounce">⚡</div>
            <p className="font-display font-semibold text-navy text-lg mb-2">Generating…</p>
            <p className="text-sm text-slate-500 font-body">{dt.loading}</p>
          </div>
        )}

        {lesson && !loading && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="rounded-3xl p-6 mb-5 text-white"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)' }}>
              <div className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-2 font-body">
                🤖 AI GENERATED · {dt.title.toUpperCase()}
              </div>
              <h2 className="font-display font-bold text-xl mb-1">{lesson.title}</h2>
              <p className="text-sm opacity-80 font-body">{lesson.topic}</p>
            </div>

            {/* Concept */}
            <div className="card p-5 mb-4">
              <div className="text-xs font-semibold text-purple-500 tracking-widest uppercase font-body mb-3">{dt.concept}</div>
              <p className="text-sm text-slate-700 font-body leading-relaxed">{lesson.concept}</p>
            </div>

            {/* Vocabulary */}
            <div className="card p-5 mb-4">
              <div className="text-xs font-semibold text-purple-500 tracking-widest uppercase font-body mb-4">{dt.vocab}</div>
              {lesson.vocabulary?.map((v, i) => (
                <div key={i} className={`${i < lesson.vocabulary.length - 1 ? 'border-b border-slate-100 pb-4 mb-4' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-display font-bold text-navy text-lg">{v.french}</span>
                      <span className="text-slate-400 text-sm font-body italic ml-2">/{v.phonetic}/</span>
                    </div>
                    <button onClick={() => speak(v.french)}
                      className="text-sm px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 font-body font-semibold hover:bg-purple-100 transition-colors">
                      🔊
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 font-body">{v.english}</p>
                  {v.example && (
                    <p className="text-xs text-slate-400 font-body italic mt-1">"{v.example}"
                      <button onClick={() => speak(v.example)} className="ml-2 text-purple-400 hover:text-purple-600">🔊</button>
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Canada Tip */}
            {lesson.tip && (
              <div className="rounded-2xl p-5 mb-5 border" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
                <div className="text-xs font-semibold text-yellow-700 tracking-widest uppercase font-body mb-2">💡 {dt.tip}</div>
                <p className="text-sm text-yellow-800 font-body leading-relaxed">{lesson.tip}</p>
              </div>
            )}

            {/* Actions */}
            <button onClick={completeLesson}
              className="w-full py-4 rounded-2xl font-display font-bold text-white text-sm hover:opacity-90 transition-opacity shadow-lift mb-3"
              style={{ background: '#7C3AED' }}>
              {dt.complete} (+20 XP)
            </button>
            <button onClick={generateLesson}
              className="w-full py-3.5 rounded-2xl font-display font-semibold text-slate-600 text-sm hover:bg-slate-50 transition-colors border border-slate-200 bg-white">
              {dt.different}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

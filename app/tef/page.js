'use client';
import { useState } from 'react';
import Nav from '../../components/Nav';
import { useApp } from '../../components/AppProvider';
import { T } from '../../lib/i18n';
import { TEF_SECTIONS } from '../../lib/data';

const SECTION_COLORS  = { reading:'#2563EB', writing:'#7C3AED', listening:'#059669', speaking:'#D97706' };
const SECTION_BGS     = { reading:'#EFF6FF', writing:'#F5F3FF', listening:'#ECFDF5', speaking:'#FFFBEB' };

// ── Reading Section ──────────────────────────────────────────────────────────
function ReadingSection({ section, lang, tt, addXP, onBack }) {
  const [step, setStep] = useState('read'); // read | quiz | done
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const color = SECTION_COLORS.reading;

  if (step === 'done') {
    return (
      <div className="text-center py-12 animate-pop-in">
        <div className="text-5xl mb-4">📖</div>
        <h2 className="font-display font-bold text-navy text-xl mb-2">{tt.sectionDone}</h2>
        <p className="text-slate-500 font-body mb-2">{tt.score}: {score}/{section.questions.length}</p>
        <p className="text-green-700 font-semibold font-body mb-6">+40 XP earned</p>
        <button onClick={() => { addXP(40); onBack(); }}
          className="bg-navy text-white rounded-2xl px-8 py-3.5 font-display font-bold text-sm hover:opacity-90 transition-opacity">
          ← Back to TEF Prep
        </button>
      </div>
    );
  }

  return (
    <div>
      {step === 'read' && (
        <div className="animate-fade-in">
          <div className="card p-5 mb-5">
            <div className="text-xs font-semibold uppercase tracking-widest font-body mb-3" style={{ color }}>
              {tt.reading}
            </div>
            <p className="text-sm text-slate-700 font-body leading-loose">{section.passage}</p>
          </div>
          <button onClick={() => setStep('quiz')}
            className="w-full py-4 rounded-2xl font-display font-bold text-white text-sm hover:opacity-90 shadow-lift"
            style={{ background: color }}>
            {tt.answerQs}
          </button>
        </div>
      )}
      {step === 'quiz' && (
        <div className="animate-fade-in">
          {section.questions.map((q, i) => (
            <div key={i} className="card p-5 mb-3">
              <p className="font-display font-semibold text-navy text-sm mb-4">Q{i + 1}: {q.q[lang] || q.q.en}</p>
              <div className="space-y-2">
                {q.opts.map((opt, j) => (
                  <button key={j} onClick={() => setAnswers(a => ({ ...a, [i]: j }))}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-body transition-all border-2 ${
                      answers[i] === j
                        ? 'font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                    style={answers[i] === j ? { borderColor: color, background: color + '12', color } : {}}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(answers).length === section.questions.length && (
            <button onClick={() => {
              let s = 0;
              section.questions.forEach((q, i) => { if (answers[i] === q.ans) s++; });
              setScore(s);
              setStep('done');
            }}
              className="w-full py-4 rounded-2xl font-display font-bold text-white text-sm hover:opacity-90 shadow-lift"
              style={{ background: color }}>
              {tt.submit}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Writing Section ──────────────────────────────────────────────────────────
function WritingSection({ section, lang, tt, addXP, onBack }) {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const color = SECTION_COLORS.writing;
  const prompt = section.prompts[0][lang] || section.prompts[0].en;

  const getFeedback = async () => {
    if (text.length < 30) return;
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, text }),
      });
      const data = await res.json();
      setFeedback(data);
    } catch {
      setFeedback({ score: '—', strengths: 'Good effort! Keep practicing.', improve: 'Try to write more sentences.', phrase: 'Je vous écris pour...' });
    }
    setLoading(false);
  };

  if (feedback) {
    return (
      <div className="animate-fade-in">
        <div className="rounded-2xl p-6 mb-4 border" style={{ background: '#F5F3FF', borderColor: '#DDD6FE' }}>
          <div className="flex justify-between items-center mb-4">
            <span className="font-display font-bold text-navy text-base">AI Feedback</span>
            <span className="font-display font-bold text-white text-sm px-3 py-1 rounded-full" style={{ background: color }}>
              {feedback.score}
            </span>
          </div>
          <div className="mb-3">
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider font-body mb-1">{tt.strengths}</div>
            <p className="text-sm text-slate-700 font-body">{feedback.strengths}</p>
          </div>
          <div className="mb-3">
            <div className="text-xs font-semibold text-yellow-600 uppercase tracking-wider font-body mb-1">{tt.improve}</div>
            <p className="text-sm text-slate-700 font-body">{feedback.improve}</p>
          </div>
          {feedback.phrase && (
            <div className="bg-white rounded-xl p-4 mt-3">
              <div className="text-xs font-semibold uppercase tracking-wider font-body mb-1" style={{ color }}>
                {tt.phrase}
              </div>
              <div className="font-display font-bold text-navy text-base">{feedback.phrase}</div>
            </div>
          )}
        </div>
        <button onClick={() => { addXP(50); onBack(); }}
          className="w-full py-4 rounded-2xl font-display font-bold text-white text-sm hover:opacity-90 shadow-lift"
          style={{ background: '#0A2540' }}>
          ← Back (+50 XP)
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="card p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-widest font-body mb-3" style={{ color }}>
          {tt.writeTask}
        </div>
        <p className="text-sm text-slate-700 font-body leading-relaxed">{prompt}</p>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write your response here (French or English for practice)..."
        className="w-full min-h-44 border-2 border-slate-200 rounded-2xl p-4 text-sm font-body text-slate-700 outline-none resize-y focus:border-purple-400 transition-colors"
        style={{ background: 'white' }}
      />
      <div className="flex justify-between items-center text-xs text-slate-400 font-body mt-1.5 mb-4">
        <span>{text.length} characters</span>
        <span className={text.length >= 30 ? 'text-green-600' : ''}>
          {text.length < 30 ? `${30 - text.length} more characters needed` : 'Ready to submit ✓'}
        </span>
      </div>
      <button
        disabled={text.length < 30 || loading}
        onClick={getFeedback}
        className={`w-full py-4 rounded-2xl font-display font-bold text-sm text-white transition-all ${
          text.length >= 30 && !loading ? 'hover:opacity-90 shadow-lift' : 'opacity-40 cursor-not-allowed'
        }`}
        style={{ background: color }}>
        {loading ? tt.getting : tt.getFeedback}
      </button>
    </div>
  );
}

// ── Main TEF Page ────────────────────────────────────────────────────────────
export default function TEFPage() {
  const { state, addXP } = useApp();
  const lang = state.lang || 'en';
  const tt = T[lang]?.tef || T.en.tef;
  const navT = T[lang]?.nav || T.en.nav;

  const [activeSection, setActiveSection] = useState(null);

  if (activeSection) {
    const section = TEF_SECTIONS.find(s => s.id === activeSection);
    const color = SECTION_COLORS[activeSection];
    return (
      <div className="page-shell">
        <Nav navT={navT} />
        <main className="page-content">
          <button onClick={() => setActiveSection(null)}
            className="text-sm text-slate-500 hover:text-navy font-body mb-5 transition-colors">
            ← Back to TEF Prep
          </button>
          <div className="rounded-3xl p-6 mb-6 text-white" style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)` }}>
            <div className="text-3xl mb-3">{section.icon}</div>
            <h2 className="font-display font-bold text-xl mb-1">{section.title[lang] || section.title.en}</h2>
            <p className="text-sm opacity-80 font-body">{section.desc[lang] || section.desc.en}</p>
          </div>

          {section.comingSoon ? (
            <div className="card p-10 text-center">
              <div className="text-4xl mb-3">🚧</div>
              <p className="font-display font-semibold text-navy">{tt.comingSoon}</p>
            </div>
          ) : activeSection === 'reading' ? (
            <ReadingSection section={section} lang={lang} tt={tt} addXP={addXP} onBack={() => setActiveSection(null)} />
          ) : activeSection === 'writing' ? (
            <WritingSection section={section} lang={lang} tt={tt} addXP={addXP} onBack={() => setActiveSection(null)} />
          ) : null}
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Nav navT={navT} />
      <main className="page-content">
        <h1 className="font-display font-bold text-navy text-2xl mb-1">{tt.title}</h1>
        <div className="rounded-2xl p-4 mb-6 border" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
          <p className="text-sm text-yellow-800 font-body leading-relaxed">💡 {tt.sub}</p>
        </div>

        <div className="space-y-3">
          {TEF_SECTIONS.map(sec => {
            const color = SECTION_COLORS[sec.id];
            const bg = SECTION_BGS[sec.id];
            return (
              <button key={sec.id} onClick={() => setActiveSection(sec.id)}
                className="card w-full text-left p-5 hover:shadow-lift transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: bg }}>
                    {sec.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-bold text-navy text-base">
                        {sec.title[lang] || sec.title.en}
                      </span>
                      {sec.comingSoon && (
                        <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 font-body">Soon</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 font-body leading-snug">
                      {sec.desc[lang] || sec.desc.en}
                    </p>
                  </div>
                  <span className="text-slate-300 text-lg flex-shrink-0">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

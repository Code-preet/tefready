'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../../components/AppProvider';
import { T } from '../../../../lib/i18n';
import { LESSONS } from '../../../../lib/data';
import { ENHANCED } from '../../../../lib/lessonsEnhanced';
import { checkAnswer } from '../../../../lib/fuzzyMatch';

// ─────────────────────────────────────────────────────────────────────────────
// Design constants
// ─────────────────────────────────────────────────────────────────────────────
const MODULE_COLORS = {
  A1: '#7C3AED', A2: '#0891B2', B1: '#D97706', B2: '#2563EB', TEF: '#BE185D',
};
const MODULE_BGS = {
  A1: '#F5F3FF', A2: '#E0F2FE', B1: '#FFFBEB', B2: '#EFF6FF', TEF: '#FDF2F8',
};

// ─────────────────────────────────────────────────────────────────────────────
// TTS helper
// ─────────────────────────────────────────────────────────────────────────────
function speakFr(text, rate = 0.82) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-CA'; u.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const fr = voices.find(v => v.lang.startsWith('fr')) || null;
  if (fr) u.voice = fr;
  window.speechSynthesis.speak(u);
}

// ─────────────────────────────────────────────────────────────────────────────
// Step order builder — only include steps with content
// ─────────────────────────────────────────────────────────────────────────────
function buildSteps(lesson, enhanced) {
  const steps = [];
  if (enhanced?.situation)    steps.push({ key: 'situation',  label: 'Situation',  icon: '🎬' });
  if (enhanced?.dialogue)     steps.push({ key: 'dialogue',   label: 'Dialogue',   icon: '💬' });
  if (enhanced?.breakdown)    steps.push({ key: 'breakdown',  label: 'Breakdown',  icon: '🔍' });
  if (enhanced?.keyPhrases)   steps.push({ key: 'phrases',    label: 'Key Phrases', icon: '💡' });
  if (lesson?.grammar)        steps.push({ key: 'grammar',    label: 'Grammar',    icon: '📖' });
  if (lesson?.vocab?.length)  steps.push({ key: 'vocab',      label: 'Vocabulary', icon: '📝' });
  if (lesson?.exercises?.length || enhanced?.exercises?.length)
                              steps.push({ key: 'exercises',  label: 'Practice',   icon: '✍️' });
  return steps;
}

// ─────────────────────────────────────────────────────────────────────────────
// ProgressBar — top step indicator
// ─────────────────────────────────────────────────────────────────────────────
function ProgressBar({ steps, currentIdx, color }) {
  return (
    <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {steps.map((s, i) => {
        const done    = i < currentIdx;
        const active  = i === currentIdx;
        return (
          <div key={s.key} className="flex items-center gap-1 flex-shrink-0">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: done ? color : active ? color : '#E2E8F0',
                  color: (done || active) ? 'white' : '#94A3B8',
                  boxShadow: active ? `0 0 0 3px ${color}30` : 'none',
                }}>
                {done ? '✓' : s.icon}
              </div>
              <span className="text-[9px] font-semibold text-slate-400 leading-none"
                style={{ color: active ? color : done ? '#64748B' : '#CBD5E1' }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-5 h-0.5 rounded-full mb-3 flex-shrink-0"
                style={{ background: done ? color : '#E2E8F0' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SituationStep
// ─────────────────────────────────────────────────────────────────────────────
function SituationStep({ data, color, moduleBg }) {
  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-3"
          style={{ background: moduleBg, border: `2px solid ${color}30` }}>
          {data.icon}
        </div>
        <h2 className="font-display font-extrabold text-xl text-navy leading-tight">{data.title}</h2>
        <span className="inline-block mt-1 text-xs font-bold rounded-full px-3 py-0.5"
          style={{ background: color + '18', color }}>
          {data.difficulty}
        </span>
      </div>

      <div className="rounded-3xl p-5 mb-4"
        style={{ background: moduleBg, border: `1.5px solid ${color}25` }}>
        <div className="flex items-start gap-3">
          <span className="text-lg flex-shrink-0 mt-0.5">📍</span>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">The Situation</p>
            <p className="text-sm text-slate-700 font-body leading-relaxed">{data.context}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 border border-amber-200" style={{ background: '#FFFBEB' }}>
        <p className="text-xs font-bold text-amber-700 mb-1">💡 TEF Canada Tip</p>
        <p className="text-sm text-amber-800 font-body">
          Real-life situations like this appear in TEF Canada oral and written exams. Study this scenario carefully — it will help you in the actual test!
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DialogueStep
// ─────────────────────────────────────────────────────────────────────────────
function DialogueStep({ lines, color }) {
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const handleSpeak = (text, idx) => {
    speakFr(text);
    setSpeakingIdx(idx);
    setTimeout(() => setSpeakingIdx(null), 2200);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-navy">The Dialogue</h2>
          <p className="text-xs text-slate-400 font-body">Read each line out loud with the speaker</p>
        </div>
        <button onClick={() => setShowAll(s => !s)}
          className="text-xs font-semibold rounded-xl px-3 py-1.5 transition-colors"
          style={{ background: color + '15', color }}>
          {showAll ? 'Hide EN' : 'Show EN'}
        </button>
      </div>

      <div className="space-y-3">
        {lines.map((line, i) => {
          const isYou = line.speaker === 'Vous';
          return (
            <div key={i} className={`flex gap-3 ${isYou ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: isYou ? color : '#F1F5F9',
                  color: isYou ? 'white' : '#64748B',
                }}>
                {isYou ? '👤' : line.speaker[0]}
              </div>
              {/* Bubble */}
              <div className={`max-w-[80%] ${isYou ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                <span className="text-[10px] font-semibold text-slate-400 px-1">{line.speaker}</span>
                <div className="rounded-2xl px-4 py-3 relative"
                  style={{
                    background: isYou ? color : 'white',
                    color: isYou ? 'white' : '#1E293B',
                    border: isYou ? 'none' : '1.5px solid #E2E8F0',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}>
                  <p className="text-sm font-body leading-snug font-semibold">{line.fr}</p>
                  {showAll && (
                    <p className="text-xs mt-1.5 font-body leading-snug opacity-75 italic">{line.en}</p>
                  )}
                </div>
                {!showAll && (
                  <p className="text-[11px] text-slate-400 italic px-1 font-body leading-snug">{line.en}</p>
                )}
                <button onClick={() => handleSpeak(line.fr, i)}
                  className="text-[10px] font-semibold rounded-full px-2 py-0.5 mt-0.5 transition-all"
                  style={{
                    background: speakingIdx === i ? color : color + '18',
                    color: speakingIdx === i ? 'white' : color,
                  }}>
                  {speakingIdx === i ? '🔊 Playing...' : '▶ Listen'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <p className="text-xs font-bold text-slate-500 mb-1">📌 Practice Tip</p>
        <p className="text-xs text-slate-500 font-body">Try reading every "Vous" line out loud. Tap Listen to hear the pronunciation, then repeat after it.</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BreakdownStep
// ─────────────────────────────────────────────────────────────────────────────
function BreakdownStep({ items, color }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div>
      <h2 className="font-display font-bold text-lg text-navy mb-1">Line-by-Line Breakdown</h2>
      <p className="text-xs text-slate-400 font-body mb-4">Tap any line to understand it deeply</p>

      <div className="space-y-2.5">
        {items.map((item, i) => {
          const open = openIdx === i;
          return (
            <button key={i} onClick={() => setOpenIdx(open ? null : i)}
              className="w-full text-left rounded-2xl overflow-hidden transition-all"
              style={{ border: `1.5px solid ${open ? color : '#E2E8F0'}`, background: open ? color + '08' : 'white' }}>
              <div className="flex items-center gap-3 p-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: color + '18', color }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-navy text-sm leading-tight">{item.fr}</p>
                  <p className="text-xs text-slate-400 font-body mt-0.5 italic">{item.en}</p>
                </div>
                <span className="text-slate-300 text-sm">{open ? '▲' : '▼'}</span>
              </div>
              {open && (
                <div className="px-4 pb-4 pt-0">
                  <div className="rounded-xl p-3" style={{ background: color + '10' }}>
                    <p className="text-sm text-slate-700 font-body leading-relaxed">{item.note}</p>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KeyPhrasesStep
// ─────────────────────────────────────────────────────────────────────────────
function KeyPhrasesStep({ phrases, color }) {
  const [speakingIdx, setSpeakingIdx] = useState(null);

  return (
    <div>
      <h2 className="font-display font-bold text-lg text-navy mb-1">Key Phrases</h2>
      <p className="text-xs text-slate-400 font-body mb-4">Memorize these — they appear in real TEF exams</p>

      <div className="space-y-3">
        {phrases.map((p, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: color + '18', color }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display font-bold text-navy text-base leading-tight">{p.phrase}</p>
                  <button onClick={() => { speakFr(p.phrase); setSpeakingIdx(i); setTimeout(() => setSpeakingIdx(null), 2000); }}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
                    style={{ background: speakingIdx === i ? color : color + '18', color: speakingIdx === i ? 'white' : color }}>
                    {speakingIdx === i ? '🔊' : '▶'}
                  </button>
                </div>
                <p className="text-sm text-slate-500 font-body mt-1 italic">{p.meaning}</p>
                <div className="mt-2 rounded-xl px-3 py-2" style={{ background: '#F8FAFC' }}>
                  <p className="text-xs text-slate-500 font-body leading-snug">
                    <span className="font-semibold text-slate-600">Use when:</span> {p.usage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GrammarStep
// ─────────────────────────────────────────────────────────────────────────────
function GrammarStep({ grammar, grammarExtra, color, lang }) {
  const [langMode, setLangMode] = useState('en'); // 'en' | 'pa' | 'hi'

  const extraText = langMode === 'pa' ? grammarExtra?.punjabi
                 : langMode === 'hi' ? grammarExtra?.hindi
                 : null;

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-navy leading-tight">{grammar.title}</h2>
          <p className="text-xs text-slate-400 font-body mt-0.5">Grammar rules for beginners</p>
        </div>
        {grammarExtra && (
          <div className="flex-shrink-0 flex gap-1">
            {['en', 'pa', 'hi'].map(l => (
              <button key={l} onClick={() => setLangMode(l)}
                className="text-[10px] font-bold rounded-lg px-2 py-1 transition-all"
                style={{
                  background: langMode === l ? color : '#F1F5F9',
                  color: langMode === l ? 'white' : '#94A3B8',
                }}>
                {l === 'en' ? 'EN' : l === 'pa' ? 'ਪੰਜਾਬੀ' : 'हिंदी'}
              </button>
            ))}
          </div>
        )}
      </div>

      {extraText ? (
        <div className="rounded-3xl p-5 mb-4" style={{ background: color + '10', border: `1.5px solid ${color}20` }}>
          <p className="text-sm leading-relaxed font-body text-slate-700">{extraText}</p>
        </div>
      ) : (
        <div className="rounded-3xl p-5 mb-4" style={{ background: color + '10', border: `1.5px solid ${color}20` }}>
          <p className="text-sm text-slate-600 font-body leading-relaxed">{grammar.explanation}</p>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {grammar.points.map((pt, i) => (
          <div key={i} className="flex items-start gap-3 rounded-2xl px-4 py-3"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
              style={{ background: color + '20', color }}>
              {i + 1}
            </span>
            <p className="text-sm font-body text-slate-700 leading-relaxed">{pt}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4" style={{ background: '#1E293B' }}>
        <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide">Examples</p>
        <div className="space-y-2">
          {grammar.examples.map((ex, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-blue-400 text-xs mt-0.5 flex-shrink-0">→</span>
              <p className="text-sm font-body text-white leading-snug">{ex}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VocabStep
// ─────────────────────────────────────────────────────────────────────────────
function VocabStep({ vocab, enhanced, color, lang }) {
  const [speakingFr, setSpeakingFr] = useState(null);

  const handleSpeak = (fr, key) => {
    speakFr(fr);
    setSpeakingFr(key);
    setTimeout(() => setSpeakingFr(null), 1600);
  };

  return (
    <div>
      <h2 className="font-display font-bold text-lg text-navy mb-1">Vocabulary</h2>
      <p className="text-xs text-slate-400 font-body mb-4">{vocab.length} words in this lesson — tap ▶ to hear pronunciation</p>

      <div className="space-y-2.5">
        {vocab.map((item, i) => {
          const extra = enhanced?.vocabExtra?.[item.fr] || enhanced?.vocabExtra?.[item.fr.split(' ')[0]];
          const exampleEn = extra?.exampleEn || null;
          return (
            <div key={i} className="card overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${color}12` }}>
                <button onClick={() => handleSpeak(item.fr, i)}
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ background: speakingFr === i ? color : color + '18', color: speakingFr === i ? 'white' : color }}>
                  {speakingFr === i ? '🔊' : '▶'}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-navy text-base leading-tight">{item.fr}</p>
                  <p className="text-sm text-slate-400 italic font-body">{item.en}</p>
                </div>
              </div>
              <div className="px-4 py-3" style={{ background: color + '05' }}>
                <p className="text-sm text-slate-600 font-body leading-snug" style={{ color: color }}>
                  <span className="font-semibold">FR: </span>
                  <span className="text-navy">{item.example}</span>
                </p>
                {exampleEn && (
                  <p className="text-xs text-slate-400 font-body mt-1 italic">
                    <span className="font-semibold">EN: </span>{exampleEn}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Exercise components
// ─────────────────────────────────────────────────────────────────────────────

function MCQExercise({ ex, onResult, color }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (i) => {
    if (submitted) return;
    setSelected(i);
  };

  const handleSubmit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    const correct = selected === ex.answer;
    setTimeout(() => onResult(correct), 900);
  };

  return (
    <div>
      <p className="font-body text-base text-navy font-semibold leading-snug mb-4">{ex.question}</p>
      <div className="space-y-2.5 mb-4">
        {ex.options.map((opt, i) => {
          const isCorrect = i === ex.answer;
          const isSelected = i === selected;
          let bg = 'white', border = '#E2E8F0', textColor = '#1E293B';
          if (submitted) {
            if (isCorrect) { bg = '#DCFCE7'; border = '#16A34A'; textColor = '#15803D'; }
            else if (isSelected && !isCorrect) { bg = '#FEF2F2'; border = '#DC2626'; textColor = '#DC2626'; }
          } else if (isSelected) { bg = color + '12'; border = color; textColor = color; }

          return (
            <button key={i} onClick={() => handleSelect(i)}
              className="w-full text-left rounded-2xl px-4 py-3.5 font-body text-sm font-medium transition-all"
              style={{ background: bg, border: `1.5px solid ${border}`, color: textColor }}>
              <span className="inline-block w-5 h-5 rounded-full mr-2.5 text-xs font-bold text-center leading-5"
                style={{ background: isSelected || (submitted && isCorrect) ? border : '#F1F5F9',
                         color: isSelected || (submitted && isCorrect) ? 'white' : '#94A3B8' }}>
                {submitted && isCorrect ? '✓' : submitted && isSelected ? '✗' : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {!submitted && (
        <button onClick={handleSubmit} disabled={selected === null}
          className="w-full rounded-2xl py-3.5 font-bold text-sm transition-all"
          style={{ background: selected !== null ? color : '#E2E8F0', color: selected !== null ? 'white' : '#94A3B8' }}>
          Check Answer
        </button>
      )}
      {submitted && (
        <div className="rounded-2xl px-4 py-3" style={{ background: selected === ex.answer ? '#DCFCE7' : '#FEF2F2' }}>
          <p className="text-sm font-semibold" style={{ color: selected === ex.answer ? '#15803D' : '#DC2626' }}>
            {selected === ex.answer ? '✅ Correct!' : `❌ Correct answer: ${ex.options[ex.answer]}`}
          </p>
        </div>
      )}
    </div>
  );
}

function FillExercise({ ex, onResult, color }) {
  const [values, setValues] = useState(ex.blanks.map(() => ''));
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);

  const handleSubmit = () => {
    if (submitted) return;
    const res = values.map((v, i) => checkAnswer(v, ex.blanks[i]));
    setResults(res);
    setSubmitted(true);
    const allCorrect = res.every(r => r.correct);
    setTimeout(() => onResult(allCorrect), 1000);
  };

  // Build sentence with input fields
  const parts = ex.sentence.split('___');
  let inputIdx = 0;

  return (
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{ex.instruction}</p>
      <div className="rounded-2xl p-4 mb-4 font-body text-base leading-loose" style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
        {parts.map((part, pi) => (
          <span key={pi}>
            <span className="text-navy font-semibold">{part}</span>
            {pi < parts.length - 1 && (() => {
              const idx = inputIdx++;
              return (
                <span className="inline-block mx-1 align-bottom">
                  <input
                    value={values[idx]}
                    onChange={e => { const v = [...values]; v[idx] = e.target.value; setValues(v); }}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    disabled={submitted}
                    placeholder="___"
                    className="border-b-2 text-center font-bold outline-none bg-transparent transition-all"
                    style={{
                      width: Math.max(60, (ex.blanks[idx]?.length || 5) * 12 + 20),
                      borderColor: submitted
                        ? (results[idx]?.correct ? '#16A34A' : '#DC2626')
                        : color,
                      color: submitted
                        ? (results[idx]?.correct ? '#15803D' : '#DC2626')
                        : color,
                      fontSize: '0.95rem',
                    }}
                  />
                </span>
              );
            })()}
          </span>
        ))}
      </div>

      {ex.hints && (
        <div className="flex flex-wrap gap-2 mb-4">
          {ex.hints.map((h, i) => (
            <span key={i} className="text-xs rounded-full px-3 py-1 font-body"
              style={{ background: color + '12', color }}>
              💡 {h}
            </span>
          ))}
        </div>
      )}

      {!submitted && (
        <button onClick={handleSubmit} disabled={values.some(v => !v.trim())}
          className="w-full rounded-2xl py-3.5 font-bold text-sm transition-all"
          style={{ background: values.every(v => v.trim()) ? color : '#E2E8F0', color: values.every(v => v.trim()) ? 'white' : '#94A3B8' }}>
          Check Answer
        </button>
      )}

      {submitted && results.map((r, i) => (
        <div key={i} className="rounded-2xl px-4 py-3 mt-2" style={{ background: r.correct ? '#DCFCE7' : '#FEF2F2' }}>
          <p className="text-sm font-semibold" style={{ color: r.correct ? '#15803D' : '#DC2626' }}>
            {r.correct ? `✅ Correct! "${ex.blanks[i]}"` : r.feedback}
          </p>
        </div>
      ))}
    </div>
  );
}

function TypeExercise({ ex, onResult, color }) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = () => {
    if (!value.trim() || submitted) return;
    const r = checkAnswer(value, ex.answer, ex.alternates || []);
    setResult(r);
    setSubmitted(true);
    setTimeout(() => onResult(r.correct), 1100);
  };

  return (
    <div>
      <p className="font-body text-base text-navy font-semibold leading-snug mb-4">{ex.question}</p>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
        disabled={submitted}
        rows={2}
        placeholder="Type your answer in French..."
        className="w-full rounded-2xl px-4 py-3 font-body text-sm outline-none resize-none transition-all mb-2"
        style={{ border: `1.5px solid ${submitted ? (result?.correct ? '#16A34A' : '#DC2626') : color + '60'}`,
                 background: submitted ? (result?.correct ? '#DCFCE7' : '#FEF2F2') : 'white',
                 color: '#1E293B' }}
      />
      {ex.hint && !submitted && (
        <p className="text-xs font-body text-slate-400 mb-3">💡 Hint: {ex.hint}</p>
      )}
      {!submitted && (
        <button onClick={handleSubmit} disabled={!value.trim()}
          className="w-full rounded-2xl py-3.5 font-bold text-sm transition-all"
          style={{ background: value.trim() ? color : '#E2E8F0', color: value.trim() ? 'white' : '#94A3B8' }}>
          Check Answer
        </button>
      )}
      {submitted && result && (
        <div className="rounded-2xl px-4 py-3" style={{ background: result.correct ? '#DCFCE7' : '#FEF2F2' }}>
          <p className="text-sm font-semibold" style={{ color: result.correct ? '#15803D' : '#DC2626' }}>
            {result.correct ? `✅ ${result.perfect ? 'Perfect!' : 'Almost perfect! We accepted your answer.'}` : `❌ ${result.feedback}`}
          </p>
        </div>
      )}
    </div>
  );
}

function TranslateExercise({ ex, onResult, color }) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [speakingSource, setSpeakingSource] = useState(false);

  const sourceText = ex.english || ex.french;
  const isEnToFr = !!ex.english;

  const handleSpeak = () => {
    if (!isEnToFr && ex.french) {
      speakFr(ex.french);
      setSpeakingSource(true);
      setTimeout(() => setSpeakingSource(false), 2200);
    }
  };

  const handleSubmit = () => {
    if (!value.trim() || submitted) return;
    const r = checkAnswer(value, ex.answer, ex.alternates || []);
    setResult(r);
    setSubmitted(true);
    setTimeout(() => onResult(r.correct), 1100);
  };

  return (
    <div>
      <div className="rounded-2xl px-4 py-4 mb-4"
        style={{ background: isEnToFr ? '#EFF6FF' : '#F5F3FF', border: `1.5px solid ${isEnToFr ? '#BFDBFE' : '#DDD6FE'}` }}>
        <p className="text-xs font-bold uppercase tracking-wide mb-2"
          style={{ color: isEnToFr ? '#1D4ED8' : '#7C3AED' }}>
          {isEnToFr ? '🇬🇧 Translate to French' : '🇫🇷 Translate to English'}
        </p>
        <div className="flex items-start gap-2">
          <p className="text-base font-display font-bold leading-snug flex-1"
            style={{ color: isEnToFr ? '#1E3A8A' : '#4C1D95' }}>
            {sourceText}
          </p>
          {!isEnToFr && (
            <button onClick={handleSpeak}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm transition-all"
              style={{ background: speakingSource ? '#7C3AED' : '#EDE9FE', color: speakingSource ? 'white' : '#7C3AED' }}>
              {speakingSource ? '🔊' : '▶'}
            </button>
          )}
        </div>
      </div>

      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
        disabled={submitted}
        rows={2}
        placeholder={isEnToFr ? 'Write in French...' : 'Write in English...'}
        className="w-full rounded-2xl px-4 py-3 font-body text-sm outline-none resize-none transition-all mb-2"
        style={{ border: `1.5px solid ${submitted ? (result?.correct ? '#16A34A' : '#DC2626') : color + '60'}`,
                 background: submitted ? (result?.correct ? '#DCFCE7' : '#FEF2F2') : 'white',
                 color: '#1E293B' }}
      />

      {!submitted && (
        <button onClick={handleSubmit} disabled={!value.trim()}
          className="w-full rounded-2xl py-3.5 font-bold text-sm transition-all"
          style={{ background: value.trim() ? color : '#E2E8F0', color: value.trim() ? 'white' : '#94A3B8' }}>
          Check Translation
        </button>
      )}
      {submitted && result && (
        <div className="rounded-2xl px-4 py-3" style={{ background: result.correct ? '#DCFCE7' : '#FEF2F2' }}>
          <p className="text-sm font-semibold" style={{ color: result.correct ? '#15803D' : '#DC2626' }}>
            {result.correct ? `✅ ${result.perfect ? 'Perfect translation!' : 'Close enough — accepted!'}` : `❌ ${result.feedback}`}
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ExercisesStep — orchestrates all exercise types
// ─────────────────────────────────────────────────────────────────────────────
function ExercisesStep({ exercises, color, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState([]);
  const [done, setDone] = useState(false);

  const handleResult = useCallback((correct) => {
    const newScores = [...scores, correct];
    setScores(newScores);
    if (idx + 1 >= exercises.length) {
      setDone(true);
      const correctCount = newScores.filter(Boolean).length;
      onComplete(correctCount, exercises.length);
    } else {
      setTimeout(() => setIdx(i => i + 1), 400);
    }
  }, [idx, scores, exercises.length, onComplete]);

  if (done) {
    const correct = scores.filter(Boolean).length;
    const pct = Math.round((correct / exercises.length) * 100);
    const excellent = pct >= 80;
    const good = pct >= 60;
    return (
      <div className="text-center py-4">
        <div className="text-5xl mb-4">{excellent ? '🏆' : good ? '👍' : '📚'}</div>
        <h3 className="font-display font-extrabold text-2xl text-navy mb-2">
          {excellent ? 'Excellent!' : good ? 'Good Job!' : 'Keep Practicing!'}
        </h3>
        <div className="text-4xl font-bold mb-1" style={{ color }}>
          {correct}/{exercises.length}
        </div>
        <p className="text-slate-400 font-body text-sm mb-6">{pct}% correct</p>
        <div className="w-full h-3 rounded-full bg-slate-100 mb-6 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: excellent ? '#16A34A' : good ? color : '#EA580C' }} />
        </div>
        <div className="space-y-1.5 text-left">
          {scores.map((s, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: s ? '#DCFCE7' : '#FEF2F2' }}>
              <span>{s ? '✅' : '❌'}</span>
              <span className="text-xs font-body text-slate-600 truncate">Q{i + 1}: {exercises[i].question || exercises[i].english || exercises[i].french || exercises[i].instruction}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const ex = exercises[idx];

  const typeLabel = {
    mcq: 'Multiple Choice', fill: 'Fill in the Blank',
    type: 'Type the Answer', 'translate-en-fr': 'Translate: English → French',
    'translate-fr-en': 'Translate: French → English',
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color }}>{typeLabel[ex.type] || 'Exercise'}</p>
          <p className="text-xs text-slate-400 font-body">Question {idx + 1} of {exercises.length}</p>
        </div>
        <div className="flex gap-0.5">
          {exercises.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all"
              style={{ background: i < idx ? (scores[i] ? '#16A34A' : '#DC2626') : i === idx ? color : '#E2E8F0' }} />
          ))}
        </div>
      </div>

      {/* Exercise */}
      {ex.type === 'mcq' && <MCQExercise key={idx} ex={ex} onResult={handleResult} color={color} />}
      {ex.type === 'fill' && <FillExercise key={idx} ex={ex} onResult={handleResult} color={color} />}
      {ex.type === 'type' && <TypeExercise key={idx} ex={ex} onResult={handleResult} color={color} />}
      {(ex.type === 'translate-en-fr' || ex.type === 'translate-fr-en') && (
        <TranslateExercise key={idx} ex={ex} onResult={handleResult} color={color} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const router = useRouter();
  const { state, addXP, markComplete } = useApp();
  const lang = state?.lang || 'en';

  const lesson    = LESSONS[lessonId];
  const enhanced  = ENHANCED[lessonId] || null;
  const color     = MODULE_COLORS[moduleId] || '#2563EB';
  const moduleBg  = MODULE_BGS[moduleId] || '#EFF6FF';

  // Merge exercises: enhanced exercises override if they exist
  const allExercises = enhanced?.exercises || lesson?.exercises || [];

  // Build steps dynamically
  const mergedLesson = lesson ? { ...lesson, exercises: allExercises } : null;
  const steps = mergedLesson ? buildSteps(mergedLesson, enhanced) : [];

  const [stepIdx, setStepIdx] = useState(0);
  const [completed, setCompleted]   = useState(false);
  const [xpAwarded, setXpAwarded]   = useState(false);
  const [finalScore, setFinalScore] = useState(null); // { correct, total }

  const navT = T[lang]?.nav || T.en.nav;

  const handleExerciseDone = useCallback((correct, total) => {
    setFinalScore({ correct, total });
    if (!xpAwarded) {
      const pct = correct / total;
      const earned = Math.round((lesson?.xp || 20) * (0.5 + 0.5 * pct));
      addXP(earned);
      markComplete(lessonId);
      setXpAwarded(true);
      setCompleted(true);
    }
  }, [xpAwarded, lesson?.xp, addXP, markComplete, lessonId]);

  const handleNext = () => {
    if (stepIdx < steps.length - 1) setStepIdx(s => s + 1);
    else router.push(`/learn/${moduleId}`);
  };

  const handlePrev = () => {
    if (stepIdx > 0) setStepIdx(s => s - 1);
  };

  if (!lesson) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">😕</div>
          <p className="font-display font-bold text-navy text-xl mb-2">Lesson not found</p>
          <Link href="/learn" className="btn-primary">Back to Learn</Link>
        </div>
      </div>
    );
  }

  const currentStep = steps[stepIdx];
  const isLastStep  = stepIdx === steps.length - 1;
  const isExercises = currentStep?.key === 'exercises';

  return (
    <div className="page-shell">
      {/* Top bar */}
      <div className="sticky top-0 z-40"
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
                 borderBottom: `1.5px solid ${color}20`, boxShadow: `0 1px 6px ${color}10` }}>
        <div className="max-w-xl mx-auto px-4 h-12 flex items-center gap-3">
          <Link href={`/learn/${moduleId}`}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors no-underline">
            ←
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate" style={{ color }}>{moduleId} · {lesson.title?.[lang] || lesson.title?.en || lessonId}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
            style={{ background: color + '18', color }}>
            ⚡ {lesson.xp} XP
          </div>
        </div>
        {/* thin progress line */}
        <div className="h-1 w-full" style={{ background: '#F1F5F9' }}>
          <div className="h-full transition-all duration-300 rounded-full"
            style={{ width: `${((stepIdx + 1) / steps.length) * 100}%`, background: color }} />
        </div>
      </div>

      <main className="max-w-xl mx-auto px-4 pt-5 pb-28">
        {/* Step progress */}
        <ProgressBar steps={steps} currentIdx={stepIdx} color={color} />

        {/* Card */}
        <div className="card p-5 mb-5 min-h-[300px]">
          {currentStep?.key === 'situation'  && <SituationStep data={enhanced.situation} color={color} moduleBg={moduleBg} />}
          {currentStep?.key === 'dialogue'   && <DialogueStep  lines={enhanced.dialogue}  color={color} />}
          {currentStep?.key === 'breakdown'  && <BreakdownStep items={enhanced.breakdown} color={color} />}
          {currentStep?.key === 'phrases'    && <KeyPhrasesStep phrases={enhanced.keyPhrases} color={color} />}
          {currentStep?.key === 'grammar'    && (
            <GrammarStep grammar={lesson.grammar} grammarExtra={enhanced?.grammarExtra || null} color={color} lang={lang} />
          )}
          {currentStep?.key === 'vocab'      && (
            <VocabStep vocab={lesson.vocab} enhanced={enhanced} color={color} lang={lang} />
          )}
          {currentStep?.key === 'exercises'  && (
            <ExercisesStep exercises={allExercises} color={color} onComplete={handleExerciseDone} />
          )}
        </div>

        {/* Completion banner */}
        {completed && finalScore && (
          <div className="rounded-3xl p-5 mb-5 text-center"
            style={{ background: 'linear-gradient(135deg, #DCFCE7, #D1FAE5)', border: '1.5px solid #86EFAC' }}>
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-display font-extrabold text-lg text-green-800">Lesson Complete!</p>
            <p className="text-sm text-green-700 font-body mt-1">
              You scored {finalScore.correct}/{finalScore.total} and earned <strong>{lesson.xp} XP</strong>
            </p>
          </div>
        )}

        {/* Navigation */}
        {(!isExercises || completed) && (
          <div className="flex gap-3">
            <button onClick={handlePrev} disabled={stepIdx === 0}
              className="flex-1 rounded-2xl py-3.5 font-bold text-sm transition-all"
              style={{ background: stepIdx === 0 ? '#F1F5F9' : 'white',
                       color: stepIdx === 0 ? '#CBD5E1' : '#64748B',
                       border: `1.5px solid ${stepIdx === 0 ? '#F1F5F9' : '#E2E8F0'}` }}>
              ← Previous
            </button>
            <button onClick={handleNext}
              className="flex-[2] rounded-2xl py-3.5 font-bold text-sm text-white transition-all"
              style={{ background: color, boxShadow: `0 4px 14px ${color}40` }}>
              {isLastStep ? (completed ? '🏠 Back to Module' : 'Finish Lesson') : `Next: ${steps[stepIdx + 1]?.label} →`}
            </button>
          </div>
        )}

        {/* Exercise hint while in exercise mode */}
        {isExercises && !completed && (
          <div className="text-center">
            <p className="text-xs text-slate-400 font-body">Complete all questions to finish the lesson</p>
          </div>
        )}
      </main>
    </div>
  );
}

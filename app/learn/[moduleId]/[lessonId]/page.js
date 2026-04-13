'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../../components/AppProvider';
import { T } from '../../../../lib/i18n';
import { MODULES, LESSONS } from '../../../../lib/data';
import { ENHANCED } from '../../../../lib/lessonsEnhanced';
import { RECAP } from '../../../../lib/lessonsRecap';
import { checkAnswer } from '../../../../lib/fuzzyMatch';

const MODULE_COLORS = { A1:'#7C3AED', A2:'#0891B2', B1:'#D97706', B2:'#2563EB', TEF:'#BE185D' };
const MODULE_BGS    = { A1:'#F5F3FF', A2:'#E0F2FE', B1:'#FFFBEB', B2:'#EFF6FF', TEF:'#FDF2F8' };
const PASS_THRESHOLD = 70;

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

function isLessonUnlocked(moduleId, lessonId, lessonScores) {
  const mod = MODULES.find(m => m.id === moduleId);
  if (!mod) return true;
  const idx = mod.lessons.indexOf(lessonId);
  if (idx <= 0) return true;
  const prevId = mod.lessons[idx - 1];
  return !!(lessonScores?.[prevId]?.passed);
}

function getNextLesson(moduleId, lessonId) {
  const mod = MODULES.find(m => m.id === moduleId);
  if (!mod) return null;
  const idx = mod.lessons.indexOf(lessonId);
  return idx >= 0 && idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null;
}

function buildSteps(lesson, enhanced, recap) {
  const steps = [];
  if (enhanced?.situation)  steps.push({ key:'situation', label:'Situation',   icon:'🎬' });
  if (enhanced?.dialogue)   steps.push({ key:'dialogue',  label:'Dialogue',    icon:'💬' });
  if (enhanced?.breakdown)  steps.push({ key:'breakdown', label:'Breakdown',   icon:'🔍' });
  if (enhanced?.keyPhrases) steps.push({ key:'phrases',   label:'Key Phrases', icon:'💡' });
  if (lesson?.grammar)      steps.push({ key:'grammar',   label:'Grammar',     icon:'📖' });
  if (lesson?.vocab?.length)steps.push({ key:'vocab',     label:'Vocabulary',  icon:'📝' });
  if ((lesson?.exercises?.length || enhanced?.exercises?.length))
                            steps.push({ key:'exercises', label:'Practice',    icon:'✍️' });
  if (recap)                steps.push({ key:'recap',     label:'Recap',       icon:'🧠' });
  return steps;
}

function StepBar({ steps, currentIdx, color }) {
  return (
    <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
      {steps.map((s, i) => {
        const done = i < currentIdx, active = i === currentIdx;
        return (
          <div key={s.key} className="flex items-center gap-1 flex-shrink-0">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{background:done?color:active?color:'#E2E8F0',color:(done||active)?'white':'#94A3B8',boxShadow:active?`0 0 0 3px ${color}30`:'none'}}>
                {done ? '✓' : s.icon}
              </div>
              <span className="text-[9px] font-semibold leading-none"
                style={{color:active?color:done?'#64748B':'#CBD5E1'}}>{s.label}</span>
            </div>
            {i < steps.length-1 && <div className="w-5 h-0.5 rounded-full mb-3 flex-shrink-0" style={{background:done?color:'#E2E8F0'}}/>}
          </div>
        );
      })}
    </div>
  );
}

function LockedScreen({ moduleId, prevLessonId, color }) {
  const prevLesson = LESSONS[prevLessonId];
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:'var(--bg-page)'}}>
      <div className="max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5" style={{background:'#F1F5F9',border:'2px solid #E2E8F0'}}>🔒</div>
        <h2 className="font-display font-extrabold text-navy text-2xl mb-2">Lesson Locked</h2>
        <p className="text-slate-500 font-body text-sm mb-6 leading-relaxed">
          You must complete the previous lesson with at least <strong>{PASS_THRESHOLD}%</strong> to unlock this one. Mastery before progression — that's the TEF way.
        </p>
        {prevLesson && (
          <div className="rounded-2xl p-4 mb-6" style={{background:color+'10',border:`1.5px solid ${color}25`}}>
            <p className="text-xs font-bold text-slate-400 mb-1">Complete first:</p>
            <p className="font-display font-bold text-navy">{prevLesson.title?.en || prevLessonId}</p>
          </div>
        )}
        <Link href={`/learn/${moduleId}/${prevLessonId}`}
          className="w-full block rounded-2xl py-3.5 font-bold text-sm text-white text-center no-underline"
          style={{background:color}}>
          Go to Previous Lesson →
        </Link>
        <Link href={`/learn/${moduleId}`} className="block mt-3 text-sm text-slate-400 font-body">← Back to module</Link>
      </div>
    </div>
  );
}

function ScoreFeedback({ pct, correct, total, moduleId, nextLessonId, color, onRetry, onContinue }) {
  const excellent = pct >= 90, good = pct >= PASS_THRESHOLD;
  const emoji   = excellent ? '🏆' : good ? '👍' : '📚';
  const heading = excellent ? 'Excellent!' : good ? 'Good Work!' : 'Review Required';
  const message = excellent
    ? "You're ready for TEF level progression. Move to the next lesson!"
    : good ? 'Good, but review the recap once more before moving on.'
    : 'You need to review this lesson again. Study the recap, then retry.';
  const barColor = excellent ? '#16A34A' : good ? color : '#DC2626';
  const bgColor  = excellent ? '#DCFCE7' : good ? '#EFF6FF' : '#FEF2F2';
  const textColor= excellent ? '#15803D' : good ? '#1D4ED8' : '#DC2626';

  return (
    <div className="py-2">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">{emoji}</div>
        <h2 className="font-display font-extrabold text-2xl text-navy mb-1">{heading}</h2>
        <div className="text-5xl font-bold mb-1" style={{color:barColor}}>{pct}%</div>
        <p className="text-sm text-slate-500 font-body">{correct} of {total} correct</p>
      </div>
      <div className="rounded-2xl p-4 mb-5" style={{background:bgColor,border:`1.5px solid ${textColor}30`}}>
        <p className="text-sm font-semibold leading-relaxed" style={{color:textColor}}>
          {good ? '✅' : '⚠️'} {message}
        </p>
      </div>
      <div className="h-3 rounded-full bg-slate-100 mb-5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`,background:barColor}}/>
      </div>
      {!good && (
        <div className="rounded-2xl p-4 mb-5" style={{background:'#FFFBEB',border:'1.5px solid #FDE68A'}}>
          <p className="text-xs font-bold text-amber-700 mb-2">🎯 Weak Areas — Focus On:</p>
          <p className="text-xs text-amber-800 font-body">• Re-read the <strong>Dialogue</strong> out loud 3 times</p>
          <p className="text-xs text-amber-800 font-body mt-1">• Study <strong>Grammar</strong> with Punjabi/Hindi toggle</p>
          <p className="text-xs text-amber-800 font-body mt-1">• Memorize all <strong>Must-Remember Sentences</strong> in Recap</p>
        </div>
      )}
      <div className="space-y-3">
        {good && nextLessonId && (
          <button onClick={onContinue} className="w-full rounded-2xl py-3.5 font-bold text-sm text-white transition-all"
            style={{background:color,boxShadow:`0 4px 14px ${color}40`}}>
            Next Lesson →
          </button>
        )}
        {good && !nextLessonId && (
          <Link href={`/learn/${moduleId}`} className="w-full block rounded-2xl py-3.5 font-bold text-sm text-white text-center no-underline" style={{background:color}}>
            🏁 Module Complete!
          </Link>
        )}
        <button onClick={onRetry} className="w-full rounded-2xl py-3.5 font-bold text-sm transition-all"
          style={{background:good?'#F8FAFC':'#FEF2F2',color:good?'#64748B':'#DC2626',border:`1.5px solid ${good?'#E2E8F0':'#FCA5A5'}`}}>
          {good ? '🔄 Try Again for Higher Score' : '🔄 Review & Retry Exercises'}
        </button>
        {good && <Link href={`/learn/${moduleId}`} className="block text-center text-sm text-slate-400 font-body mt-1">← Back to module</Link>}
      </div>
    </div>
  );
}

function RecapStep({ recap, color }) {
  const [speakIdx, setSpeakIdx] = useState(null);
  if (!recap) return <div className="text-center text-slate-400 py-10 font-body">Complete this lesson to unlock the recap.</div>;
  return (
    <div>
      <div className="text-center mb-5">
        <div className="text-3xl mb-2">🧠</div>
        <h2 className="font-display font-extrabold text-xl text-navy">Lesson Recap</h2>
        <p className="text-xs text-slate-400 font-body mt-1">Review before you leave — this is what you must know.</p>
      </div>
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{color}}>💡 Key Phrases</h3>
        <div className="space-y-2">
          {recap.keyPhrases.map((p, i) => (
            <div key={i} className="rounded-xl px-4 py-2.5" style={{background:color+'0D',border:`1px solid ${color}20`}}>
              <p className="text-sm font-body text-navy leading-snug">{p}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{color}}>📖 Grammar Rules</h3>
        <div className="space-y-2">
          {recap.grammarPoints.map((g, i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-xl px-4 py-3" style={{background:'#1E293B'}}>
              <span className="text-blue-400 text-sm flex-shrink-0">→</span>
              <p className="text-sm text-white font-body leading-snug">{g}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{color}}>⭐ Must-Remember Sentences</h3>
        <div className="space-y-2.5">
          {recap.mustRemember.map((s, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:color+'18',color}}>{i+1}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display font-bold text-navy text-sm leading-tight">{s.fr}</p>
                    <button onClick={() => { speakFr(s.fr); setSpeakIdx(i); setTimeout(()=>setSpeakIdx(null),2000); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all"
                      style={{background:speakIdx===i?color:color+'18',color:speakIdx===i?'white':color}}>
                      {speakIdx===i?'🔊':'▶'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-body mt-1 italic">{s.en}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevisionView({ lesson, enhanced, recap, color, onClose }) {
  const [tab, setTab] = useState('vocab');
  const [speakIdx, setSpeakIdx] = useState(null);
  const tabs = [{key:'vocab',label:'📝 Vocab'},{key:'phrases',label:'💡 Phrases'},{key:'memory',label:'⭐ Must-Know'}];
  return (
    <div className="min-h-screen" style={{background:'var(--bg-page)'}}>
      <div className="sticky top-0 z-40" style={{background:'rgba(255,255,255,0.95)',backdropFilter:'blur(12px)',borderBottom:`1.5px solid ${color}20`}}>
        <div className="max-w-xl mx-auto px-4 h-12 flex items-center gap-3">
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">←</button>
          <div className="flex-1">
            <p className="text-xs font-bold" style={{color}}>📖 Quick Revision Mode</p>
            <p className="text-[10px] text-slate-400">No exercises — just review</p>
          </div>
        </div>
        <div className="flex gap-1 px-4 pb-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className="flex-1 rounded-xl py-1.5 text-xs font-bold transition-all"
              style={{background:tab===t.key?color:'#F1F5F9',color:tab===t.key?'white':'#94A3B8'}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-xl mx-auto px-4 pt-4 pb-24">
        {tab==='vocab' && (
          <div className="space-y-2.5">
            {lesson.vocab.map((item, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3" style={{borderBottom:`1px solid ${color}12`}}>
                  <button onClick={() => { speakFr(item.fr); setSpeakIdx(i); setTimeout(()=>setSpeakIdx(null),1600); }}
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{background:speakIdx===i?color:color+'18',color:speakIdx===i?'white':color}}>
                    {speakIdx===i?'🔊':'▶'}
                  </button>
                  <div>
                    <p className="font-display font-bold text-navy">{item.fr}</p>
                    <p className="text-xs text-slate-400 italic font-body">{item.en}</p>
                  </div>
                </div>
                <div className="px-4 py-2" style={{background:color+'05'}}>
                  <p className="text-xs text-slate-600 font-body italic">{item.example}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==='phrases' && (
          <div className="space-y-2">
            {(recap?.keyPhrases || enhanced?.keyPhrases?.map(p=>p.phrase+' → '+p.meaning) || []).map((p, i) => (
              <div key={i} className="card p-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:color+'18',color}}>{i+1}</div>
                  <p className="text-sm font-body text-navy">{p}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==='memory' && (
          <div className="space-y-2.5">
            {(recap?.mustRemember || []).map((s, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{['🇫🇷','📌','💬','📝','⭐'][i]||'📌'}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display font-bold text-navy text-sm">{s.fr}</p>
                      <button onClick={() => { speakFr(s.fr); setSpeakIdx(100+i); setTimeout(()=>setSpeakIdx(null),2000); }}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                        style={{background:speakIdx===100+i?color:color+'18',color:speakIdx===100+i?'white':color}}>▶</button>
                    </div>
                    <p className="text-xs text-slate-400 italic mt-1">{s.en}</p>
                  </div>
                </div>
              </div>
            ))}
            {(!recap?.mustRemember || recap.mustRemember.length===0) && <p className="text-center text-slate-400 py-8 font-body">Complete the lesson to see must-remember sentences.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function MCQExercise({ ex, onResult, color }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => { if (selected===null||submitted) return; setSubmitted(true); setTimeout(()=>onResult(selected===ex.answer),900); };
  return (
    <div>
      <p className="font-body text-base text-navy font-semibold leading-snug mb-4">{ex.question}</p>
      <div className="space-y-2.5 mb-4">
        {ex.options.map((opt, i) => {
          const isC=i===ex.answer,isSel=i===selected;
          let bg='white',border='#E2E8F0',tc='#1E293B';
          if(submitted){if(isC){bg='#DCFCE7';border='#16A34A';tc='#15803D';}else if(isSel){bg='#FEF2F2';border='#DC2626';tc='#DC2626';}}
          else if(isSel){bg=color+'12';border=color;tc=color;}
          return (
            <button key={i} onClick={()=>!submitted&&setSelected(i)} className="w-full text-left rounded-2xl px-4 py-3.5 font-body text-sm font-medium transition-all"
              style={{background:bg,border:`1.5px solid ${border}`,color:tc}}>
              <span className="inline-block w-5 h-5 rounded-full mr-2.5 text-xs font-bold text-center leading-5"
                style={{background:(isSel||(submitted&&isC))?border:'#F1F5F9',color:(isSel||(submitted&&isC))?'white':'#94A3B8'}}>
                {submitted&&isC?'✓':submitted&&isSel?'✗':String.fromCharCode(65+i)}
              </span>{opt}
            </button>
          );
        })}
      </div>
      {!submitted&&<button onClick={handleSubmit} disabled={selected===null} className="w-full rounded-2xl py-3.5 font-bold text-sm transition-all" style={{background:selected!==null?color:'#E2E8F0',color:selected!==null?'white':'#94A3B8'}}>Check Answer</button>}
      {submitted&&<div className="rounded-2xl px-4 py-3" style={{background:selected===ex.answer?'#DCFCE7':'#FEF2F2'}}><p className="text-sm font-semibold" style={{color:selected===ex.answer?'#15803D':'#DC2626'}}>{selected===ex.answer?'✅ Correct!':`❌ Correct: ${ex.options[ex.answer]}`}</p></div>}
    </div>
  );
}

function FillExercise({ ex, onResult, color }) {
  const [values, setValues] = useState(ex.blanks.map(()=>''));
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);
  const handleSubmit = () => {
    if(submitted) return;
    const res = values.map((v,i)=>checkAnswer(v, ex.blanks[i]));
    setResults(res); setSubmitted(true);
    setTimeout(()=>onResult(res.every(r=>r.correct)),1000);
  };
  const parts = ex.sentence.split('___'); let ii=0;
  return (
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{ex.instruction}</p>
      <div className="rounded-2xl p-4 mb-4 font-body text-base leading-loose" style={{background:'#F8FAFC',border:'1.5px solid #E2E8F0'}}>
        {parts.map((part, pi)=>(
          <span key={pi}>
            <span className="text-navy font-semibold">{part}</span>
            {pi<parts.length-1&&(()=>{const idx=ii++;return(
              <input value={values[idx]} onChange={e=>{const v=[...values];v[idx]=e.target.value;setValues(v);}}
                onKeyDown={e=>e.key==='Enter'&&handleSubmit()} disabled={submitted} placeholder="___"
                className="border-b-2 text-center font-bold outline-none bg-transparent mx-1 align-bottom"
                style={{width:Math.max(60,(ex.blanks[idx]?.length||5)*12+20),borderColor:submitted?(results[idx]?.correct?'#16A34A':'#DC2626'):color,color:submitted?(results[idx]?.correct?'#15803D':'#DC2626'):color,fontSize:'0.95rem'}}/>
            );})()}
          </span>
        ))}
      </div>
      {ex.hints&&<div className="flex flex-wrap gap-2 mb-3">{ex.hints.map((h,i)=><span key={i} className="text-xs rounded-full px-3 py-1" style={{background:color+'12',color}}>💡 {h}</span>)}</div>}
      {!submitted&&<button onClick={handleSubmit} disabled={values.some(v=>!v.trim())} className="w-full rounded-2xl py-3.5 font-bold text-sm transition-all" style={{background:values.every(v=>v.trim())?color:'#E2E8F0',color:values.every(v=>v.trim())?'white':'#94A3B8'}}>Check Answer</button>}
      {submitted&&results.map((r,i)=><div key={i} className="rounded-2xl px-4 py-3 mt-2" style={{background:r.correct?'#DCFCE7':'#FEF2F2'}}><p className="text-sm font-semibold" style={{color:r.correct?'#15803D':'#DC2626'}}>{r.correct?`✅ Correct! "${ex.blanks[i]}"`:r.feedback}</p></div>)}
    </div>
  );
}

function TypeExercise({ ex, onResult, color }) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const handleSubmit = () => {
    if(!value.trim()||submitted) return;
    const r=checkAnswer(value, ex.answer, ex.alternates||[]);
    setResult(r); setSubmitted(true); setTimeout(()=>onResult(r.correct),1100);
  };
  return (
    <div>
      <p className="font-body text-base text-navy font-semibold leading-snug mb-4">{ex.question}</p>
      <textarea value={value} onChange={e=>setValue(e.target.value)}
        onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleSubmit();}}}
        disabled={submitted} rows={2} placeholder="Type your answer in French..."
        className="w-full rounded-2xl px-4 py-3 font-body text-sm outline-none resize-none transition-all mb-2"
        style={{border:`1.5px solid ${submitted?(result?.correct?'#16A34A':'#DC2626'):color+'60'}`,background:submitted?(result?.correct?'#DCFCE7':'#FEF2F2'):'white',color:'#1E293B'}}/>
      {ex.hint&&!submitted&&<p className="text-xs font-body text-slate-400 mb-3">💡 {ex.hint}</p>}
      {!submitted&&<button onClick={handleSubmit} disabled={!value.trim()} className="w-full rounded-2xl py-3.5 font-bold text-sm transition-all" style={{background:value.trim()?color:'#E2E8F0',color:value.trim()?'white':'#94A3B8'}}>Check Answer</button>}
      {submitted&&result&&<div className="rounded-2xl px-4 py-3" style={{background:result.correct?'#DCFCE7':'#FEF2F2'}}><p className="text-sm font-semibold" style={{color:result.correct?'#15803D':'#DC2626'}}>{result.correct?`✅ ${result.perfect?'Perfect!':'Almost — accepted!'}`:`❌ ${result.feedback}`}</p></div>}
    </div>
  );
}

function TranslateExercise({ ex, onResult, color }) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const isEnToFr = !!ex.english;
  const handleSubmit = () => {
    if(!value.trim()||submitted) return;
    const r=checkAnswer(value, ex.answer, ex.alternates||[]);
    setResult(r); setSubmitted(true); setTimeout(()=>onResult(r.correct),1100);
  };
  return (
    <div>
      <div className="rounded-2xl px-4 py-4 mb-4" style={{background:isEnToFr?'#EFF6FF':'#F5F3FF',border:`1.5px solid ${isEnToFr?'#BFDBFE':'#DDD6FE'}`}}>
        <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{color:isEnToFr?'#1D4ED8':'#7C3AED'}}>
          {isEnToFr?'🇬🇧 Translate to French':'🇫🇷 Translate to English'}
        </p>
        <div className="flex items-start gap-2">
          <p className="text-base font-display font-bold flex-1" style={{color:isEnToFr?'#1E3A8A':'#4C1D95'}}>{ex.english||ex.french}</p>
          {!isEnToFr&&ex.french&&(
            <button onClick={()=>{speakFr(ex.french);setSpeaking(true);setTimeout(()=>setSpeaking(false),2200);}}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{background:speaking?'#7C3AED':'#EDE9FE',color:speaking?'white':'#7C3AED'}}>
              {speaking?'🔊':'▶'}
            </button>
          )}
        </div>
      </div>
      <textarea value={value} onChange={e=>setValue(e.target.value)}
        onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleSubmit();}}}
        disabled={submitted} rows={2} placeholder={isEnToFr?'Write in French...':'Write in English...'}
        className="w-full rounded-2xl px-4 py-3 font-body text-sm outline-none resize-none transition-all mb-2"
        style={{border:`1.5px solid ${submitted?(result?.correct?'#16A34A':'#DC2626'):color+'60'}`,background:submitted?(result?.correct?'#DCFCE7':'#FEF2F2'):'white',color:'#1E293B'}}/>
      {!submitted&&<button onClick={handleSubmit} disabled={!value.trim()} className="w-full rounded-2xl py-3.5 font-bold text-sm transition-all" style={{background:value.trim()?color:'#E2E8F0',color:value.trim()?'white':'#94A3B8'}}>Check Translation</button>}
      {submitted&&result&&<div className="rounded-2xl px-4 py-3" style={{background:result.correct?'#DCFCE7':'#FEF2F2'}}><p className="text-sm font-semibold" style={{color:result.correct?'#15803D':'#DC2626'}}>{result.correct?`✅ ${result.perfect?'Perfect!':'Close — accepted!'}`:`❌ ${result.feedback}`}</p></div>}
    </div>
  );
}

function ExercisesStep({ exercises, color, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState([]);
  const [done, setDone] = useState(false);
  const handleResult = useCallback((correct) => {
    const ns=[...scores, correct];
    setScores(ns);
    if(idx+1>=exercises.length){ setDone(true); onComplete(ns.filter(Boolean).length, exercises.length); }
    else setTimeout(()=>setIdx(i=>i+1),400);
  },[idx,scores,exercises.length,onComplete]);
  if(done) return <div className="text-center py-8"><div className="text-4xl mb-3">⏳</div><p className="font-display font-bold text-navy text-lg">Calculating your score...</p></div>;
  const ex = exercises[idx];
  const typeLabel = {mcq:'Multiple Choice',fill:'Fill in the Blank',type:'Type the Answer','translate-en-fr':'English → French','translate-fr-en':'French → English'};
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide" style={{color}}>{typeLabel[ex.type]||'Exercise'}</p>
          <p className="text-xs text-slate-400 font-body">Question {idx+1} of {exercises.length}</p>
        </div>
        <div className="flex gap-0.5">
          {exercises.map((_,i)=><div key={i} className="w-2 h-2 rounded-full transition-all"
            style={{background:i<idx?(scores[i]?'#16A34A':'#DC2626'):i===idx?color:'#E2E8F0'}}/>)}
        </div>
      </div>
      {ex.type==='mcq'&&<MCQExercise key={idx} ex={ex} onResult={handleResult} color={color}/>}
      {ex.type==='fill'&&<FillExercise key={idx} ex={ex} onResult={handleResult} color={color}/>}
      {ex.type==='type'&&<TypeExercise key={idx} ex={ex} onResult={handleResult} color={color}/>}
      {(ex.type==='translate-en-fr'||ex.type==='translate-fr-en')&&<TranslateExercise key={idx} ex={ex} onResult={handleResult} color={color}/>}
    </div>
  );
}

function SituationStep({ data, color, moduleBg }) {
  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-3" style={{background:moduleBg,border:`2px solid ${color}30`}}>{data.icon}</div>
        <h2 className="font-display font-extrabold text-xl text-navy">{data.title}</h2>
        <span className="inline-block mt-1 text-xs font-bold rounded-full px-3 py-0.5" style={{background:color+'18',color}}>{data.difficulty}</span>
      </div>
      <div className="rounded-3xl p-5 mb-4" style={{background:moduleBg,border:`1.5px solid ${color}25`}}>
        <div className="flex items-start gap-3">
          <span className="text-lg flex-shrink-0 mt-0.5">📍</span>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">The Situation</p>
            <p className="text-sm text-slate-700 font-body leading-relaxed">{data.context}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl p-4 border border-amber-200" style={{background:'#FFFBEB'}}>
        <p className="text-xs font-bold text-amber-700 mb-1">💡 TEF Canada Tip</p>
        <p className="text-sm text-amber-800 font-body">Real-life situations like this appear in TEF Canada oral and written exams. Study this scenario carefully!</p>
      </div>
    </div>
  );
}

function DialogueStep({ lines, color }) {
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [showAll, setShowAll] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div><h2 className="font-display font-bold text-lg text-navy">The Dialogue</h2><p className="text-xs text-slate-400">Read each line out loud</p></div>
        <button onClick={()=>setShowAll(s=>!s)} className="text-xs font-semibold rounded-xl px-3 py-1.5" style={{background:color+'15',color}}>{showAll?'Hide EN':'Show EN'}</button>
      </div>
      <div className="space-y-3">
        {lines.map((line, i) => {
          const isYou=line.speaker==='Vous';
          return (
            <div key={i} className={`flex gap-3 ${isYou?'flex-row-reverse':''}`}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background:isYou?color:'#F1F5F9',color:isYou?'white':'#64748B'}}>{isYou?'👤':line.speaker[0]}</div>
              <div className={`max-w-[80%] ${isYou?'items-end':'items-start'} flex flex-col gap-0.5`}>
                <span className="text-[10px] font-semibold text-slate-400 px-1">{line.speaker}</span>
                <div className="rounded-2xl px-4 py-3" style={{background:isYou?color:'white',color:isYou?'white':'#1E293B',border:isYou?'none':'1.5px solid #E2E8F0'}}>
                  <p className="text-sm font-semibold">{line.fr}</p>
                  {showAll&&<p className="text-xs mt-1.5 opacity-75 italic">{line.en}</p>}
                </div>
                {!showAll&&<p className="text-[11px] text-slate-400 italic px-1">{line.en}</p>}
                <button onClick={()=>{speakFr(line.fr);setSpeakingIdx(i);setTimeout(()=>setSpeakingIdx(null),2200);}}
                  className="text-[10px] font-semibold rounded-full px-2 py-0.5 mt-0.5 transition-all"
                  style={{background:speakingIdx===i?color:color+'18',color:speakingIdx===i?'white':color}}>
                  {speakingIdx===i?'🔊 Playing...':'▶ Listen'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BreakdownStep({ items, color }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div>
      <h2 className="font-display font-bold text-lg text-navy mb-1">Line-by-Line Breakdown</h2>
      <p className="text-xs text-slate-400 mb-4">Tap to understand each line deeply</p>
      <div className="space-y-2.5">
        {items.map((item, i) => {
          const open=openIdx===i;
          return (
            <button key={i} onClick={()=>setOpenIdx(open?null:i)} className="w-full text-left rounded-2xl overflow-hidden transition-all" style={{border:`1.5px solid ${open?color:'#E2E8F0'}`,background:open?color+'08':'white'}}>
              <div className="flex items-center gap-3 p-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:color+'18',color}}>{i+1}</div>
                <div className="flex-1"><p className="font-display font-bold text-navy text-sm">{item.fr}</p><p className="text-xs text-slate-400 italic">{item.en}</p></div>
                <span className="text-slate-300">{open?'▲':'▼'}</span>
              </div>
              {open&&<div className="px-4 pb-4"><div className="rounded-xl p-3" style={{background:color+'10'}}><p className="text-sm text-slate-700 font-body">{item.note}</p></div></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function KeyPhrasesStep({ phrases, color }) {
  const [speakingIdx, setSpeakingIdx] = useState(null);
  return (
    <div>
      <h2 className="font-display font-bold text-lg text-navy mb-1">Key Phrases</h2>
      <p className="text-xs text-slate-400 mb-4">Memorize these — they appear in real TEF exams</p>
      <div className="space-y-3">
        {phrases.map((p, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:color+'18',color}}>{i+1}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display font-bold text-navy text-base">{p.phrase}</p>
                  <button onClick={()=>{speakFr(p.phrase);setSpeakingIdx(i);setTimeout(()=>setSpeakingIdx(null),2000);}}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
                    style={{background:speakingIdx===i?color:color+'18',color:speakingIdx===i?'white':color}}>
                    {speakingIdx===i?'🔊':'▶'}
                  </button>
                </div>
                <p className="text-sm text-slate-500 italic mt-1">{p.meaning}</p>
                {p.usage&&<div className="mt-2 rounded-xl px-3 py-2" style={{background:'#F8FAFC'}}><p className="text-xs text-slate-500"><span className="font-semibold text-slate-600">Use when:</span> {p.usage}</p></div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrammarStep({ grammar, grammarExtra, color }) {
  const [langMode, setLangMode] = useState('en');
  const extra = langMode==='pa'?grammarExtra?.punjabi:langMode==='hi'?grammarExtra?.hindi:null;
  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div><h2 className="font-display font-bold text-lg text-navy">{grammar.title}</h2><p className="text-xs text-slate-400 mt-0.5">Grammar rules</p></div>
        {grammarExtra&&<div className="flex gap-1 flex-shrink-0">{['en','pa','hi'].map(l=>(
          <button key={l} onClick={()=>setLangMode(l)} className="text-[10px] font-bold rounded-lg px-2 py-1 transition-all"
            style={{background:langMode===l?color:'#F1F5F9',color:langMode===l?'white':'#94A3B8'}}>
            {l==='en'?'EN':l==='pa'?'ਪੰਜਾਬੀ':'हिंदी'}
          </button>
        ))}</div>}
      </div>
      <div className="rounded-3xl p-5 mb-4" style={{background:color+'10',border:`1.5px solid ${color}20`}}>
        <p className="text-sm text-slate-600 font-body leading-relaxed">{extra||grammar.explanation}</p>
      </div>
      <div className="space-y-2 mb-4">
        {grammar.points.map((pt, i) => (
          <div key={i} className="flex items-start gap-3 rounded-2xl px-4 py-3" style={{background:'#F8FAFC',border:'1px solid #E2E8F0'}}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{background:color+'20',color}}>{i+1}</span>
            <p className="text-sm font-body text-slate-700 leading-relaxed">{pt}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-4" style={{background:'#1E293B'}}>
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

function VocabStep({ vocab, enhanced, color }) {
  const [speakingFr, setSpeakingFr] = useState(null);
  return (
    <div>
      <h2 className="font-display font-bold text-lg text-navy mb-1">Vocabulary</h2>
      <p className="text-xs text-slate-400 mb-4">{vocab.length} words — tap ▶ to hear pronunciation</p>
      <div className="space-y-2.5">
        {vocab.map((item, i) => {
          const extra=enhanced?.vocabExtra?.[item.fr];
          return (
            <div key={i} className="card overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3" style={{borderBottom:`1px solid ${color}12`}}>
                <button onClick={()=>{speakFr(item.fr);setSpeakingFr(i);setTimeout(()=>setSpeakingFr(null),1600);}}
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{background:speakingFr===i?color:color+'18',color:speakingFr===i?'white':color}}>
                  {speakingFr===i?'🔊':'▶'}
                </button>
                <div><p className="font-display font-bold text-navy text-base">{item.fr}</p><p className="text-xs text-slate-400 italic">{item.en}</p></div>
              </div>
              <div className="px-4 py-2.5" style={{background:color+'05'}}>
                <p className="text-sm text-navy font-body">{item.example}</p>
                {extra?.exampleEn&&<p className="text-xs text-slate-400 italic mt-0.5">{extra.exampleEn}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const router = useRouter();
  const { state, saveScore } = useApp();
  const lang = state?.lang || 'en';

  const lesson   = LESSONS[lessonId];
  const enhanced = ENHANCED[lessonId] || null;
  const recap    = RECAP[lessonId] || null;
  const color    = MODULE_COLORS[moduleId] || '#2563EB';
  const moduleBg = MODULE_BGS[moduleId] || '#EFF6FF';

  const allExercises = enhanced?.exercises || lesson?.exercises || [];
  const steps = lesson ? buildSteps({...lesson, exercises:allExercises}, enhanced, recap) : [];

  const [stepIdx, setStepIdx]     = useState(0);
  const [revisionMode, setRevision] = useState(false);
  const [phase, setPhase]         = useState('learning');
  const [scoreData, setScoreData] = useState(null);

  const mod = MODULES.find(m => m.id === moduleId);
  const lessonIdx = mod ? mod.lessons.indexOf(lessonId) : -1;
  const prevLessonId = (mod && lessonIdx > 0) ? mod.lessons[lessonIdx-1] : null;
  const locked = !isLessonUnlocked(moduleId, lessonId, state?.lessonScores);
  const nextLessonId = getNextLesson(moduleId, lessonId);

  const handleExerciseDone = useCallback((correct, total) => {
    const pct = total>0 ? Math.round((correct/total)*100) : 0;
    saveScore(lessonId, correct, total, lesson?.xp||20);
    setScoreData({ correct, total, pct });
    setTimeout(() => setPhase('feedback'), 600);
  }, [lessonId, lesson?.xp, saveScore]);

  const handleRetry = () => {
    const exIdx = steps.findIndex(s=>s.key==='exercises');
    setPhase('learning');
    setScoreData(null);
    setStepIdx(exIdx>=0 ? exIdx : 0);
  };

  const handleContinue = () => {
    if (nextLessonId) router.push(`/learn/${moduleId}/${nextLessonId}`);
    else router.push(`/learn/${moduleId}`);
  };

  if (!lesson) return (
    <div className="page-shell min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-4xl mb-4">😕</div>
        <p className="font-display font-bold text-navy text-xl mb-2">Lesson not found</p>
        <Link href="/learn" className="btn-primary">Back to Learn</Link>
      </div>
    </div>
  );

  if (locked && prevLessonId) return <LockedScreen moduleId={moduleId} prevLessonId={prevLessonId} color={color}/>;
  if (revisionMode) return <RevisionView lesson={lesson} enhanced={enhanced} recap={recap} color={color} onClose={()=>setRevision(false)}/>;

  const currentStep = steps[stepIdx];
  const isLastStep  = stepIdx === steps.length-1;
  const isExercises = currentStep?.key === 'exercises';
  const prevScore   = state?.lessonScores?.[lessonId];

  return (
    <div className="page-shell">
      <div className="sticky top-0 z-40" style={{background:'rgba(255,255,255,0.95)',backdropFilter:'blur(12px)',borderBottom:`1.5px solid ${color}20`,boxShadow:`0 1px 6px ${color}10`}}>
        <div className="max-w-xl mx-auto px-4 h-12 flex items-center gap-3">
          <Link href={`/learn/${moduleId}`} className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 no-underline">←</Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate" style={{color}}>{moduleId} · {lesson.title?.[lang]||lesson.title?.en}</p>
          </div>
          <div className="flex items-center gap-2">
            {prevScore && (
              <span className="text-xs font-bold rounded-full px-2 py-0.5" style={{background:prevScore.passed?'#DCFCE7':'#FEF2F2',color:prevScore.passed?'#15803D':'#DC2626'}}>
                Best: {prevScore.bestPct||prevScore.pct}%
              </span>
            )}
            {(recap||enhanced?.keyPhrases) && (
              <button onClick={()=>setRevision(true)} className="text-xs font-semibold rounded-xl px-2.5 py-1" style={{background:color+'15',color}}>📖 Revise</button>
            )}
            <div className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold" style={{background:color+'18',color}}>⚡ {lesson.xp} XP</div>
          </div>
        </div>
        <div className="h-1 w-full" style={{background:'#F1F5F9'}}>
          <div className="h-full transition-all duration-300 rounded-full" style={{width:`${((stepIdx+1)/steps.length)*100}%`,background:color}}/>
        </div>
      </div>

      <main className="max-w-xl mx-auto px-4 pt-5 pb-28">
        <StepBar steps={steps} currentIdx={stepIdx} color={color}/>

        <div className="card p-5 mb-5 min-h-[300px]">
          {phase==='feedback' && scoreData ? (
            <ScoreFeedback pct={scoreData.pct} correct={scoreData.correct} total={scoreData.total}
              moduleId={moduleId} nextLessonId={nextLessonId}
              color={color} onRetry={handleRetry} onContinue={handleContinue}/>
          ) : (
            <>
              {currentStep?.key==='situation' &&<SituationStep data={enhanced.situation} color={color} moduleBg={moduleBg}/>}
              {currentStep?.key==='dialogue'  &&<DialogueStep lines={enhanced.dialogue} color={color}/>}
              {currentStep?.key==='breakdown' &&<BreakdownStep items={enhanced.breakdown} color={color}/>}
              {currentStep?.key==='phrases'   &&<KeyPhrasesStep phrases={enhanced.keyPhrases} color={color}/>}
              {currentStep?.key==='grammar'   &&<GrammarStep grammar={lesson.grammar} grammarExtra={enhanced?.grammarExtra||null} color={color}/>}
              {currentStep?.key==='vocab'     &&<VocabStep vocab={lesson.vocab} enhanced={enhanced} color={color}/>}
              {currentStep?.key==='exercises' &&<ExercisesStep exercises={allExercises} color={color} onComplete={handleExerciseDone}/>}
              {currentStep?.key==='recap'     &&<RecapStep recap={recap} color={color}/>}
            </>
          )}
        </div>

        {phase==='learning' && !isExercises && (
          <div className="flex gap-3">
            <button onClick={()=>stepIdx>0&&setStepIdx(s=>s-1)} disabled={stepIdx===0}
              className="flex-1 rounded-2xl py-3.5 font-bold text-sm transition-all"
              style={{background:stepIdx===0?'#F1F5F9':'white',color:stepIdx===0?'#CBD5E1':'#64748B',border:`1.5px solid ${stepIdx===0?'#F1F5F9':'#E2E8F0'}`}}>
              ← Previous
            </button>
            <button onClick={()=>isLastStep?router.push(`/learn/${moduleId}`):setStepIdx(s=>s+1)}
              className="flex-[2] rounded-2xl py-3.5 font-bold text-sm text-white transition-all"
              style={{background:color,boxShadow:`0 4px 14px ${color}40`}}>
              {isLastStep?'🏠 Back to Module':`Next: ${steps[stepIdx+1]?.label} →`}
            </button>
          </div>
        )}
        {phase==='learning' && isExercises && (
          <p className="text-center text-xs text-slate-400 font-body">Answer all questions to see your score</p>
        )}
      </main>
    </div>
  );
}

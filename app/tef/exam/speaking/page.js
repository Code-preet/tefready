'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Nav from '../../../../components/Nav';
import { useApp } from '../../../../components/AppProvider';
import { T } from '../../../../lib/i18n';
import { speakingTasks } from '../../../../lib/speakingData';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const SAMPLE_RESPONSES = {
  task1: `Bonjour, je suis vraiment ravi de partager cette expérience avec vous. J'ai eu la chance de visiter le Québec l'été dernier, et ce voyage a été tout simplement inoubliable.

J'ai commencé par la ville de Québec, dont le Vieux-Québec est classé au patrimoine mondial de l'UNESCO. Les ruelles pavées, la citadelle et les maisons ancestrales m'ont transporté dans une autre époque. Ensuite, je me suis rendu à Montréal, une métropole vibrante qui mêle harmonieusement modernité et histoire. J'ai particulièrement apprécié le Plateau-Mont-Royal et sa scène artistique unique.

Ce qui m'a le plus marqué, c'est la chaleur des habitants et la richesse de la gastronomie locale — la poutine, le sirop d'érable, les bagels de Montréal... un vrai régal ! J'ai aussi découvert une culture francophone dynamique, différente de celle de France, avec ses propres expressions et traditions.

Je recommande vivement ce voyage à tous. Le Québec est un endroit dépaysant qui vous fait sentir à la fois en Amérique du Nord et en Europe. En ce qui me concerne, j'y retournerai certainement.`,

  task2: `Bonjour Madame, bonjour Monsieur. Je cherche un appartement à louer à Montréal et j'aurais quelques questions à vous poser.

Je serais intéressé par un appartement de deux pièces, idéalement dans un quartier bien desservi par le métro, comme Rosemont ou le Plateau. Mon budget est d'environ mille deux cents à mille cinq cents dollars par mois, charges comprises si possible. J'ai aussi un chat, est-ce que les animaux de compagnie sont acceptés dans vos logements ?

Par ailleurs, je suis un nouvel arrivant au Canada et je voulais vous demander : quelles sont les démarches à suivre pour louer un appartement ? Est-ce qu'il faut fournir un historique de crédit canadien ? Et si je n'en ai pas encore, quelles alternatives sont possibles ? J'ai entendu parler d'une lettre de garantie ou d'un dépôt supplémentaire — est-ce habituel ici ?

Enfin, pourriez-vous me dire si les baux sont généralement d'un an ou si des arrangements plus courts sont possibles pour commencer ?

Je vous remercie de votre aide et j'attends vos réponses avec intérêt.`,

  task3: `Le télétravail est devenu un sujet incontournable depuis la pandémie de 2020. La question de savoir s'il devrait devenir la norme mérite qu'on l'examine attentivement des deux côtés.

D'un côté, les avantages du télétravail sont indéniables. Il offre une flexibilité précieuse qui permet de mieux concilier vie professionnelle et vie privée. De plus, la réduction des trajets représente un gain de temps considérable et contribue à diminuer les émissions de CO2. Des études ont montré que la productivité augmente souvent lorsque les employés travaillent dans un environnement qu'ils maîtrisent.

Cependant, il serait naïf d'ignorer les inconvénients. L'isolement social peut être difficile à vivre sur le long terme. Le lien social et la culture d'entreprise se construisent en grande partie au bureau, lors d'échanges informels. Par ailleurs, tous les travailleurs n'ont pas les mêmes conditions chez eux — certains manquent d'espace ou de matériel adéquat.

Force est de constater que ni le télétravail total ni la présence permanente au bureau ne constituent la solution idéale. Je suis d'avis qu'un modèle hybride, qui combine les deux approches, représente le meilleur équilibre. Il permet de préserver la flexibilité tout en maintenant la cohésion des équipes.

En définitive, c'est à chaque organisation d'adapter cette pratique à ses réalités propres, dans le dialogue avec ses employés.`
};

// ── Per-task View ─────────────────────────────────────────────────────────────
function TaskView({ task, taskNum, totalTasks, onNext, onFinish, isLast }) {
  const [phase, setPhase] = useState('prep');  // prep | speaking | done
  const [prepTime, setPrepTime] = useState(task.prepTime);
  const [speakTime, setSpeakTime] = useState(task.timeLimit);
  const [showSample, setShowSample] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const prepRef = useRef(null);
  const speakRef = useRef(null);

  // Auto-start prep timer
  useEffect(() => {
    prepRef.current = setInterval(() => {
      setPrepTime(t => {
        if (t <= 1) { clearInterval(prepRef.current); setPhase('speaking'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(prepRef.current);
  }, []);

  // Speaking timer when phase changes
  useEffect(() => {
    if (phase !== 'speaking') return;
    speakRef.current = setInterval(() => {
      setSpeakTime(t => {
        if (t <= 1) { clearInterval(speakRef.current); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(speakRef.current);
  }, [phase]);

  const skipPrep = () => { clearInterval(prepRef.current); setPhase('speaking'); };
  const finishSpeaking = () => { clearInterval(speakRef.current); setPhase('done'); };

  const speakPrompt = () => {
    if (ttsPlaying) { window.speechSynthesis?.cancel(); setTtsPlaying(false); return; }
    const u = new SpeechSynthesisUtterance(task.prompt);
    u.lang = 'fr-CA'; u.rate = 0.82;
    u.onend = () => setTtsPlaying(false);
    u.onerror = () => setTtsPlaying(false);
    window.speechSynthesis?.speak(u);
    setTtsPlaying(true);
  };

  const sampleKey = `task${taskNum}`;
  const urgent = phase === 'speaking' && speakTime < 30;

  return (
    <div className="space-y-4">

      {/* Task header */}
      <div className="rounded-3xl p-4"
        style={{ background: `linear-gradient(135deg, ${task.color}22, ${task.color}11)`, border:`1.5px solid ${task.color}44` }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{task.icon}</span>
            <div>
              <h2 className="font-display font-bold text-sm" style={{ color: task.color }}>{task.title}</h2>
              <p className="text-xs text-slate-400 font-body">{task.type} · {task.clbLevel}</p>
            </div>
          </div>
          <span className="badge" style={{ background:`${task.color}18`, color: task.color, border:`1px solid ${task.color}44` }}>
            {taskNum}/{totalTasks}
          </span>
        </div>
      </div>

      {/* Timer display */}
      <div className="card p-4 text-center">
        {phase === 'prep' && (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Preparation Time</p>
            <div className="font-display font-extrabold text-5xl mb-3" style={{ color: task.color }}>
              {formatTime(prepTime)}
            </div>
            <div className="h-2 progress-track mb-3">
              <div className="h-full rounded-full transition-all" style={{ width:`${(prepTime/task.prepTime)*100}%`, background: task.color }} />
            </div>
            <p className="text-sm text-slate-500 font-body mb-3">Read the prompt. Organize your ideas.</p>
            <button onClick={skipPrep}
              className="btn-secondary text-xs px-4 py-2">
              Ready to speak →
            </button>
          </>
        )}
        {phase === 'speaking' && (
          <>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: urgent ? '#DC2626' : task.color }}>
              {urgent ? '⚠ Time running out!' : 'Speaking Time'}
            </p>
            <div className={`font-display font-extrabold text-5xl mb-3 ${urgent ? 'animate-pulse' : ''}`}
              style={{ color: urgent ? '#DC2626' : task.color }}>
              {formatTime(speakTime)}
            </div>
            <div className="h-2 progress-track mb-3">
              <div className="h-full rounded-full transition-all" style={{ width:`${(speakTime/task.timeLimit)*100}%`, background: urgent ? '#DC2626' : task.color }} />
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background:'#DC2626' }} />
              <span className="text-sm font-semibold text-red-600">Recording...</span>
            </div>
            <button onClick={finishSpeaking}
              className="btn-secondary text-xs px-4 py-2 border-red-200 text-red-600">
              ⏹ Stop Speaking
            </button>
          </>
        )}
        {phase === 'done' && (
          <>
            <div className="text-4xl mb-2">✅</div>
            <p className="font-display font-bold text-base mb-1" style={{ color: task.color }}>Task {taskNum} Complete!</p>
            <p className="text-sm text-slate-500 font-body">Compare your response to the sample below.</p>
          </>
        )}
      </div>

      {/* Prompt card */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Sujet / Prompt</p>
          <button onClick={speakPrompt}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
            style={{ background: ttsPlaying ? `${task.color}22` : '#f1f5f9', color: ttsPlaying ? task.color : '#64748b', border:`1px solid ${ttsPlaying ? task.color+'44' : '#e2e8f0'}` }}>
            {ttsPlaying ? '⏹ Stop' : '▶ Hear in French'}
          </button>
        </div>
        <p className="text-sm font-body leading-loose text-slate-700">{task.prompt}</p>
        {task.englishHint && (
          <p className="text-xs text-slate-400 italic font-body mt-2 pt-2 border-t border-slate-100">{task.englishHint}</p>
        )}
      </div>

      {/* Tips (collapsible) */}
      <button onClick={() => setShowTips(!showTips)}
        className="w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all"
        style={{ background:`${task.color}12`, border:`1.5px solid ${task.color}33`, color: task.color }}>
        <span>💡 Examiner Tips & Key Vocabulary</span>
        <span>{showTips ? '▲' : '▼'}</span>
      </button>
      {showTips && (
        <div className="card p-4 animate-fade-in">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: task.color }}>Tips</p>
          <ul className="space-y-1.5 mb-4">
            {task.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600 font-body">
                <span style={{ color: task.color }}>›</span>{tip}
              </li>
            ))}
          </ul>
          <p className="text-xs font-bold uppercase tracking-wide mb-2 text-slate-400">Key Vocabulary</p>
          <div className="flex flex-wrap gap-2">
            {task.vocabulary.map((v, i) => (
              <span key={i} className="text-xs font-semibold rounded-xl px-2.5 py-1"
                style={{ background:`${task.color}15`, color: task.color, border:`1px solid ${task.color}33` }}>
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sample response (only after done) */}
      {phase === 'done' && (
        <>
          <button onClick={() => setShowSample(!showSample)}
            className="w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all animate-fade-in"
            style={{ background:'#F0FDF4', border:'1.5px solid #BBF7D0', color:'#15803D' }}>
            <span>📝 View Sample B2 Response</span>
            <span>{showSample ? '▲' : '▼'}</span>
          </button>
          {showSample && SAMPLE_RESPONSES[sampleKey] && (
            <div className="card p-5 animate-fade-in" style={{ borderColor:'#BBF7D0' }}>
              <p className="text-xs font-bold uppercase tracking-wide text-green-700 mb-3">Sample Response (B2 / CLB 7+)</p>
              <p className="text-sm font-body leading-loose text-slate-700 whitespace-pre-line">
                {SAMPLE_RESPONSES[sampleKey]}
              </p>
            </div>
          )}
        </>
      )}

      {/* Next / Finish button */}
      {phase === 'done' && (
        <div className="animate-slide-up">
          {isLast ? (
            <button onClick={onFinish} className="btn-primary w-full py-4 text-base"
              style={{ background:'linear-gradient(135deg,#15803D,#16A34A)', boxShadow:'0 4px 16px rgba(22,163,74,0.4)' }}>
              ✅ Complete Speaking Test
            </button>
          ) : (
            <button onClick={onNext} className="btn-primary w-full py-4 text-base"
              style={{ background:`linear-gradient(135deg,${task.color}dd,${task.color})` }}>
              Next Task → ({taskNum + 1}/{totalTasks})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({ onRetake }) {
  useEffect(() => {
    try { localStorage.setItem('tefSpeakingScore', JSON.stringify(14)); } catch {}
  }, []);

  return (
    <div className="page-shell" style={{ background:'#EFF6FF' }}>
      <main className="page-content animate-pop-in">
        <div className="card p-6 text-center mb-5">
          <div className="text-5xl mb-3">🎤</div>
          <h1 className="font-display font-extrabold text-xl mb-1" style={{ color:'#1E3A8A' }}>
            Expression orale — Terminée !
          </h1>
          <p className="text-sm text-slate-500 font-body mb-5">
            All 3 speaking tasks completed. In the real TEF, a certified examiner scores your responses.
          </p>

          <div className="rounded-3xl p-4 mb-4" style={{ background:'#FEF9C3', border:'1.5px solid #FDE68A' }}>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">What Examiners Look For</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 font-body text-left">
              <div>🗣 Fluency & coherence</div>
              <div>📚 Vocabulary range</div>
              <div>🔤 Grammatical accuracy</div>
              <div>🎯 Task completion</div>
              <div>👔 Register & formality</div>
              <div>🔗 Discourse connectors</div>
            </div>
          </div>

          <div className="rounded-3xl p-4" style={{ background:'#EDE9FE', border:'1.5px solid #C4B5FD' }}>
            <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">CLB 7 Speaking Requirements</p>
            <div className="space-y-1 text-xs text-slate-600 font-body text-left">
              <p>• Speak for the full time without major pauses</p>
              <p>• Use formal "vous" consistently throughout</p>
              <p>• Present clear intro → points → conclusion structure</p>
              <p>• Use B1–B2 vocabulary and varied grammar</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onRetake} className="btn-secondary text-sm">🔄 Redo Speaking</button>
          <Link href="/tef/exam" className="btn-primary text-sm no-underline text-center flex items-center justify-center">
            🏆 Exam Hub
          </Link>
        </div>
      </main>
    </div>
  );
}

// ── Main Speaking Exam ────────────────────────────────────────────────────────
export default function SpeakingExamPage() {
  const { state } = useApp();
  const lang = state?.lang || 'en';
  const navT = T[lang]?.nav || T.en.nav;

  const [phase, setPhase] = useState('intro');  // intro | exam | results
  const [taskIdx, setTaskIdx] = useState(0);
  const [key, setKey] = useState(0);  // remount TaskView on next task

  const handleRetake = () => { setTaskIdx(0); setKey(k => k + 1); setPhase('intro'); };

  if (phase === 'results') {
    return <ResultsScreen onRetake={handleRetake} />;
  }

  if (phase === 'intro') {
    return (
      <div className="page-shell">
        <Nav navT={navT} />
        <main className="page-content animate-fade-in">

          <div className="rounded-4xl p-7 mb-5 text-white relative overflow-hidden"
            style={{ background:'linear-gradient(135deg, #B45309 0%, #D97706 100%)' }}>
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10"
              style={{ background:'radial-gradient(circle,#fff,transparent)' }} />
            <div className="text-4xl mb-3">🎤</div>
            <h1 className="font-display font-extrabold text-2xl text-white mb-1">Expression orale</h1>
            <p className="text-amber-100 text-sm">Speaking Expression — TEF Canada</p>
          </div>

          <div className="card p-5 mb-4">
            <h2 className="font-display font-bold text-base mb-3" style={{ color:'#1E3A8A' }}>Instructions</h2>
            <div className="space-y-2 text-sm text-slate-600 font-body leading-relaxed">
              <p>🎤 You will complete <strong>3 speaking tasks</strong>.</p>
              <p>⏱ Each task has <strong>prep time</strong> (read + plan) then <strong>speaking time</strong>.</p>
              <p>💬 Always use formal <strong>«vous»</strong> with the examiner.</p>
              <p>📝 After each task, a sample B2 response is revealed for comparison.</p>
              <p>🏆 CLB 7 requires fluent, structured speech with varied vocabulary.</p>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            {speakingTasks.map((t, i) => (
              <div key={t.id} className="rounded-3xl p-4" style={{ background:`${t.color}12`, border:`1.5px solid ${t.color}33` }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <p className="font-display font-bold text-sm" style={{ color: t.color }}>{t.title}</p>
                      <p className="text-xs text-slate-400 font-body">{t.type}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs font-body text-slate-400">
                    <div>Prep: {Math.round(t.prepTime/60)} min</div>
                    <div>Speak: {Math.round(t.timeLimit/60)} min</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setPhase('exam')}
            className="btn-primary w-full text-base py-4"
            style={{ background:'linear-gradient(135deg,#B45309,#D97706)', boxShadow:'0 4px 16px rgba(217,119,6,0.4)' }}>
            🎤 Begin Speaking Test →
          </button>
        </main>
      </div>
    );
  }

  // ── Exam View ───────────────────────────────────────────────────────────────
  return (
    <div className="page-shell">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-11"
        style={{ background:'rgba(255,255,255,0.96)', backdropFilter:'blur(12px)', borderBottom:'1.5px solid #DBEAFE', boxShadow:'0 1px 8px rgba(37,99,235,0.07)' }}>
        <span className="text-sm font-display font-bold" style={{ color:'#1E3A8A' }}>Speaking</span>
        <div className="flex gap-1.5">
          {speakingTasks.map((t, i) => (
            <div key={t.id} className="w-7 h-1.5 rounded-full transition-all"
              style={{ background: i < taskIdx ? '#16A34A' : i === taskIdx ? t.color : '#e2e8f0' }} />
          ))}
        </div>
        <span className="text-xs font-bold text-slate-400">{taskIdx + 1}/{speakingTasks.length}</span>
      </div>

      <main style={{ paddingTop:'3rem' }}>
        <div className="max-w-2xl mx-auto px-4 pb-32 pt-4">
          <TaskView
            key={`${taskIdx}-${key}`}
            task={speakingTasks[taskIdx]}
            taskNum={taskIdx + 1}
            totalTasks={speakingTasks.length}
            isLast={taskIdx === speakingTasks.length - 1}
            onNext={() => setTaskIdx(taskIdx + 1)}
            onFinish={() => setPhase('results')}
          />
        </div>
      </main>
    </div>
  );
}

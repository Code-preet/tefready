'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../components/AppProvider';

// ─── FEED CARD DATA ────────────────────────────────────────────────────────────
const FEED_CARDS = [
  // VOCAB
  { id:'v1', type:'vocab', fr:'Bonjour', en:'Hello / Good morning', example:'Bonjour, je m\'appelle Marie.', level:'A1' },
  { id:'v2', type:'vocab', fr:'Enchanté(e)', en:'Nice to meet you', example:'Enchanté de faire votre connaissance.', level:'A1' },
  { id:'v3', type:'vocab', fr:'Néanmoins', en:'Nevertheless / However', example:'Il est fatigué, néanmoins il continue.', level:'B2' },
  { id:'v4', type:'vocab', fr:'La mondialisation', en:'Globalisation', example:'La mondialisation transforme l\'économie mondiale.', level:'B2' },
  { id:'v5', type:'vocab', fr:'Désormais', en:'From now on / Henceforth', example:'Désormais, je parlerai français chaque jour.', level:'B1' },
  { id:'v6', type:'vocab', fr:'Davantage', en:'More / Further', example:'Il faut davantage de temps pour maîtriser une langue.', level:'B1' },
  { id:'v7', type:'vocab', fr:'La citoyenneté', en:'Citizenship', example:'La citoyenneté canadienne offre de nombreux avantages.', level:'B2' },
  { id:'v8', type:'vocab', fr:'Pourtant', en:'Yet / However', example:'Il pleut, pourtant elle est sortie sans parapluie.', level:'B1' },
  { id:'v9', type:'vocab', fr:'S\'épanouir', en:'To flourish / to thrive', example:'Les enfants s\'épanouissent dans un environnement positif.', level:'B2' },
  { id:'v10', type:'vocab', fr:'Bénévole', en:'Volunteer', example:'Elle est bénévole dans un refuge pour animaux.', level:'B1' },
  { id:'v11', type:'vocab', fr:'Voire', en:'Even / or even', example:'C\'est difficile, voire impossible, sans pratique.', level:'B2' },
  { id:'v12', type:'vocab', fr:'Entretenir', en:'To maintain / to keep up', example:'Il entretient de bonnes relations avec ses voisins.', level:'B1' },
  { id:'v13', type:'vocab', fr:'La méfiance', en:'Distrust / mistrust', example:'La méfiance envers les médias est en hausse.', level:'B2' },
  { id:'v14', type:'vocab', fr:'Franchement', en:'Frankly / honestly', example:'Franchement, je pense que c\'est une bonne idée.', level:'A2' },
  { id:'v15', type:'vocab', fr:'Le recul', en:'Hindsight / perspective', example:'Avec le recul, cette décision était la bonne.', level:'B2' },

  // QUIZ
  { id:'q1', type:'quiz', question:'What does "Néanmoins" mean?', options:['Therefore','Nevertheless','Meanwhile','However much'], answer:1, explanation:'Néanmoins = Nevertheless. Used to introduce a contrast: "Il est fatigué, néanmoins il travaille."', level:'B2' },
  { id:'q2', type:'quiz', question:'Which is formal in French?', options:['Salut, ça va ?','Comment allez-vous ?','Ouais, et toi ?','Tu vas bien ?'], answer:1, explanation:'"Comment allez-vous ?" uses "vous" — the formal register required in TEF oral exams.', level:'A1' },
  { id:'q3', type:'quiz', question:'Fill in: "Je suis ___ du Canada." (proud)', options:['fier','heureux','content','ravi'], answer:0, explanation:'"Fier/fière" = proud. "Je suis fier du Canada." — common in TEF speaking tasks about national identity.', level:'B1' },
  { id:'q4', type:'quiz', question:'Which connector shows CONTRAST?', options:['De plus','Ainsi','En revanche','Par conséquent'], answer:2, explanation:'"En revanche" = on the other hand. Essential for B2 writing tasks showing balanced arguments.', level:'B2' },
  { id:'q5', type:'quiz', question:'"La mondialisation" means?', options:['Modernisation','Globalisation','Industrialisation','Urbanisation'], answer:1, explanation:'"Mondialisation" = globalisation. From "monde" (world). Key B2 vocabulary for current events topics.', level:'B2' },
  { id:'q6', type:'quiz', question:'Which word is a "faux ami" (false friend)?', options:['Important','Actuel','Possible','Simple'], answer:1, explanation:'"Actuel" means CURRENT, not actual! "À l\'heure actuelle" = currently. Watch out for this in TEF reading!', level:'B1' },
  { id:'q7', type:'quiz', question:'TEF CLB 7 is equivalent to which NCLC level?', options:['B1','B2 low','B2 high','C1'], answer:1, explanation:'CLB 7 ≈ NCLC 7, equivalent to B2 lower range. Most Canadian immigration streams require CLB 7+.', level:'TEF' },
  { id:'q8', type:'quiz', question:'Passé composé of "avoir" + "fait"?', options:['J\'ai fait','Je faisais','J\'avais fait','Je ferai'], answer:0, explanation:'"J\'ai fait" = I did / I have done. Passé composé = avoir/être + past participle. Used for completed past actions.', level:'B1' },
  { id:'q9', type:'quiz', question:'Which is the SUBJUNCTIVE?', options:['Il vient','Il venait','Il soit venu','Il faut qu\'il vienne'], answer:3, explanation:'"Il faut que" triggers the subjunctive: "Il faut qu\'il vienne." Subjunctive after verbs of necessity, doubt, emotion.', level:'B2' },
  { id:'q10', type:'quiz', question:'"Davantage" vs "plus" — which is more formal?', options:['Plus','Davantage','Both equal','Neither'], answer:1, explanation:'"Davantage" is more formal/literary than "plus". Preferred in TEF written expression for a higher score.', level:'B2' },

  // SPEAKING PROMPTS
  { id:'s1', type:'speaking', prompt:'Décrivez votre ville idéale pour vivre au Canada.', hint:'Mention: climate, services, community, work opportunities', clb:'CLB 6–7', tip:'Start with: "La ville idéale selon moi serait..."', level:'B1' },
  { id:'s2', type:'speaking', prompt:'Pensez-vous que les réseaux sociaux sont bénéfiques ou nuisibles pour la société ?', hint:'Give 2 pros and 2 cons, then your opinion', clb:'CLB 7–9', tip:'Use: "D\'un côté... de l\'autre côté... Personnellement, je crois que..."', level:'B2' },
  { id:'s3', type:'speaking', prompt:'Parlez d\'un défi que vous avez surmonté dans votre vie.', hint:'Context → challenge → action → result → lesson learned', clb:'CLB 6–7', tip:'Use past tense (passé composé) and emotion words to engage the examiner.', level:'B1' },
  { id:'s4', type:'speaking', prompt:'Est-ce que l\'immigration contribue positivement au Canada ?', hint:'Economy, culture, demographics, challenges', clb:'CLB 8–9', tip:'Show balance: "Bien que... il est indéniable que..." earns top marks.', level:'B2' },
  { id:'s5', type:'speaking', prompt:'Décrivez votre routine quotidienne en détail.', hint:'Morning, work/school, evening, sleep', clb:'CLB 4–5', tip:'Use time expressions: "D\'abord, ensuite, puis, finalement..."', level:'A2' },
  { id:'s6', type:'speaking', prompt:'Selon vous, comment peut-on protéger l\'environnement au quotidien ?', hint:'Individual actions, government role, global cooperation', clb:'CLB 7–8', tip:'Use "il convient de", "il est essentiel que" for formal register.', level:'B2' },

  // TEF TIPS
  { id:'t1', type:'tip', icon:'🎯', title:'TEF Writing Structure', tip:'Every written response needs: Introduction (état des lieux) → Développement (2–3 arguments) → Conclusion (bilan + opinion). Missing any part costs marks.', level:'TEF' },
  { id:'t2', type:'tip', icon:'🗣️', title:'Speaking Register', tip:'Always use "vous" with the examiner, never "tu". Opening: "Bonjour, je vais vous parler de..." This formal register alone can push you from CLB 6 to CLB 7.', level:'TEF' },
  { id:'t3', type:'tip', icon:'⏱️', title:'Time Management', tip:'TEF Speaking: 1 min prep, 3 min speak. Don\'t rush — a well-structured 2.5 min response beats a rambling 3 min one. Practice timing yourself daily.', level:'TEF' },
  { id:'t4', type:'tip', icon:'📖', title:'Reading Trap', tip:'"Actuel" = current (NOT actual). "Sensible" = sensitive (NOT sensible). "Éventuel" = possible (NOT eventual). These faux amis appear often in TEF reading!', level:'TEF' },
  { id:'t5', type:'tip', icon:'🔗', title:'Top Connectors for B2', tip:'Contrast: néanmoins, en revanche, cependant\nAddition: de surcroît, qui plus est\nCause: étant donné que, vu que\nConclusion: en définitive, il ressort que', level:'B2' },
  { id:'t6', type:'tip', icon:'📝', title:'Passive Voice in Writing', tip:'Passive voice sounds formal: "Cette loi a été adoptée en 2020." Use it in TEF writing to vary your sentence structure and demonstrate grammatical range.', level:'B2' },
  { id:'t7', type:'tip', icon:'🇨🇦', title:'CLB Score Guide', tip:'CLB 4–5 = A2 | CLB 6 = B1 | CLB 7–8 = B2 | CLB 9–10 = C1. Most Express Entry streams require CLB 7 in all 4 skills. Know your target!', level:'TEF' },
  { id:'t8', type:'tip', icon:'🎧', title:'Listening Strategy', tip:'In TEF listening: read the questions BEFORE the audio plays. Underline key words. The answer usually comes in order — question 1 answer comes before question 2.', level:'TEF' },
  { id:'t9', type:'tip', icon:'💬', title:'Opinion Phrases', tip:'"À mon avis" is basic. Upgrade to: "Il me semble que", "Je suis d\'avis que", "Force est de constater que". Richer expression = higher CLB score.', level:'B2' },
  { id:'t10', type:'tip', icon:'🔤', title:'Nominalisation Trick', tip:'Turn verbs into nouns for a formal style: développer → le développement, améliorer → l\'amélioration, décider → la décision. TEF examiners reward this!', level:'B2' },
];

// Shuffle array deterministically with a seed
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── CARD TYPE CONFIGS ─────────────────────────────────────────────────────────
const CARD_CONFIG = {
  vocab:    { label: 'Vocabulary', emoji: '🔤', bg: 'from-indigo-950 via-indigo-900 to-violet-900', accent: '#818cf8', accentBg: 'rgba(129,140,248,0.15)', border: 'rgba(129,140,248,0.3)' },
  quiz:     { label: 'Quick Quiz', emoji: '🧠', bg: 'from-slate-950 via-emerald-950 to-teal-950',   accent: '#34d399', accentBg: 'rgba(52,211,153,0.15)',  border: 'rgba(52,211,153,0.3)' },
  speaking: { label: 'Speaking Prompt', emoji: '🎤', bg: 'from-rose-950 via-red-950 to-orange-950',  accent: '#fb923c', accentBg: 'rgba(251,146,60,0.15)',   border: 'rgba(251,146,60,0.3)' },
  tip:      { label: 'TEF Tip', emoji: '💡', bg: 'from-sky-950 via-blue-950 to-cyan-950',         accent: '#38bdf8', accentBg: 'rgba(56,189,248,0.15)',   border: 'rgba(56,189,248,0.3)' },
};

const LEVEL_COLORS = {
  'A1': '#86efac', 'A2': '#6ee7b7', 'B1': '#67e8f9', 'B2': '#a78bfa', 'TEF': '#fbbf24',
};

// ─── INDIVIDUAL CARD COMPONENTS ───────────────────────────────────────────────

function VocabCard({ card, revealed, onReveal, cfg }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center"
      onClick={!revealed ? onReveal : undefined}>
      {/* French word */}
      <div className="mb-2">
        <span className="text-7xl font-bold tracking-tight text-white leading-none" style={{ textShadow:'0 0 40px rgba(255,255,255,0.15)' }}>
          {card.fr}
        </span>
      </div>
      <div className="text-slate-400 text-sm mb-8">French</div>

      {!revealed ? (
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-12 h-0.5 rounded-full" style={{ background: cfg.accent }} />
          <p className="text-slate-400 text-base">Tap to reveal meaning</p>
          <div className="w-12 h-0.5 rounded-full" style={{ background: cfg.accent }} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-16 h-0.5 rounded-full mb-1" style={{ background: cfg.accent }} />
          <p className="text-3xl font-semibold text-white">{card.en}</p>
          <div className="rounded-2xl px-5 py-3 mt-2 max-w-xs text-center" style={{ background: cfg.accentBg, border: `1px solid ${cfg.border}` }}>
            <p className="text-sm text-slate-300 italic leading-relaxed">"{card.example}"</p>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizCard({ card, selected, onSelect, cfg }) {
  const answered = selected !== null;
  return (
    <div className="flex flex-col justify-center h-full px-5 gap-5">
      {/* Question */}
      <div className="rounded-2xl p-5 text-center" style={{ background: cfg.accentBg, border:`1px solid ${cfg.border}` }}>
        <p className="text-xl font-semibold text-white leading-snug">{card.question}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {card.options.map((opt, i) => {
          const isCorrect = i === card.answer;
          const isSelected = selected === i;
          let bg = 'rgba(255,255,255,0.06)';
          let border = 'rgba(255,255,255,0.12)';
          let textColor = '#cbd5e1';
          if (answered) {
            if (isCorrect) { bg = 'rgba(52,211,153,0.2)'; border = '#34d399'; textColor = '#fff'; }
            else if (isSelected) { bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; textColor = '#fca5a5'; }
          }
          return (
            <button key={i} disabled={answered}
              onClick={() => onSelect(i)}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all active:scale-95"
              style={{ background: bg, border: `1.5px solid ${border}`, color: textColor, cursor: answered ? 'default' : 'pointer' }}>
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: answered && isCorrect ? '#34d399' : answered && isSelected ? '#f87171' : 'rgba(255,255,255,0.1)', color: answered ? '#fff' : '#94a3b8' }}>
                {answered ? (isCorrect ? '✓' : isSelected ? '✗' : String.fromCharCode(65+i)) : String.fromCharCode(65+i)}
              </span>
              <span className="text-base font-medium leading-tight">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className="rounded-2xl px-5 py-4 animate-fade-in" style={{ background: 'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-sm text-slate-300 leading-relaxed">{card.explanation}</p>
        </div>
      )}
    </div>
  );
}

function SpeakingCard({ card, revealed, onReveal, cfg }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = (e) => {
    e.stopPropagation();
    if (speaking) { window.speechSynthesis?.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(card.prompt);
    u.lang = 'fr-CA'; u.rate = 0.85;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis?.speak(u);
    setSpeaking(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-6"
      onClick={!revealed ? onReveal : undefined}>
      <div className="text-5xl">{speaking ? '🔊' : '🎤'}</div>

      {/* CLB badge */}
      <div className="rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase" style={{ background: cfg.accentBg, color: cfg.accent, border:`1px solid ${cfg.border}` }}>
        {card.clb}
      </div>

      <p className="text-2xl font-semibold text-white leading-snug">{card.prompt}</p>

      {!revealed ? (
        <div className="flex flex-col items-center gap-2 animate-pulse mt-2">
          <p className="text-slate-400 text-sm">Tap to see tips & structure</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full animate-fade-in">
          <div className="rounded-2xl px-5 py-4 text-left" style={{ background: cfg.accentBg, border:`1px solid ${cfg.border}` }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: cfg.accent }}>💬 Opener</p>
            <p className="text-sm text-slate-200 italic">"{card.tip}"</p>
          </div>
          <div className="rounded-2xl px-5 py-3 text-left" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2 text-slate-400">📋 Cover</p>
            <p className="text-sm text-slate-300">{card.hint}</p>
          </div>
          <button onClick={speak}
            className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all active:scale-95"
            style={{ background: speaking ? 'rgba(251,146,60,0.25)' : cfg.accentBg, color: cfg.accent, border:`1px solid ${cfg.border}` }}>
            {speaking ? '⏹ Stop' : '▶ Hear prompt in French'}
          </button>
        </div>
      )}
    </div>
  );
}

function TipCard({ card, cfg }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-5">
      <div className="text-6xl">{card.icon}</div>
      <h2 className="text-2xl font-bold text-white">{card.title}</h2>
      <div className="rounded-2xl px-6 py-5 text-left w-full max-w-sm" style={{ background: cfg.accentBg, border:`1px solid ${cfg.border}` }}>
        <p className="text-base text-slate-200 leading-relaxed whitespace-pre-line">{card.tip}</p>
      </div>
    </div>
  );
}

// ─── CARD WRAPPER ─────────────────────────────────────────────────────────────
function FeedCard({ card, isActive, onXP }) {
  const cfg = CARD_CONFIG[card.type];
  const [revealed, setRevealedState] = useState(false);
  const [selected, setSelected] = useState(null);
  const [xpGiven, setXpGiven] = useState(false);

  const handleReveal = () => {
    setRevealedState(true);
    if (!xpGiven) { onXP(2); setXpGiven(true); }
  };

  const handleSelect = (i) => {
    setSelected(i);
    if (!xpGiven) {
      onXP(i === card.answer ? 5 : 1);
      setXpGiven(true);
    }
  };

  // Reset when card leaves view
  useEffect(() => {
    if (!isActive) {
      setRevealedState(false);
      setSelected(null);
      setXpGiven(false);
    }
  }, [isActive]);

  return (
    <div className={`relative w-full flex-shrink-0 overflow-hidden bg-gradient-to-b ${cfg.bg}`}
      style={{ height:'calc(100dvh - 112px)', scrollSnapAlign:'start' }}>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-4 pb-2 z-10"
        style={{ background:'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{cfg.emoji}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{cfg.label}</span>
        </div>
        <span className="text-xs font-bold rounded-full px-2.5 py-1" style={{ background:'rgba(0,0,0,0.4)', color: LEVEL_COLORS[card.level] || '#94a3b8' }}>
          {card.level}
        </span>
      </div>

      {/* Card content */}
      <div className="h-full pt-14 pb-4 overflow-y-auto">
        {card.type === 'vocab'    && <VocabCard    card={card} revealed={revealed} onReveal={handleReveal} cfg={cfg} />}
        {card.type === 'quiz'     && <QuizCard     card={card} selected={selected} onSelect={handleSelect} cfg={cfg} />}
        {card.type === 'speaking' && <SpeakingCard card={card} revealed={revealed} onReveal={handleReveal} cfg={cfg} />}
        {card.type === 'tip'      && <TipCard      card={card} cfg={cfg} />}
      </div>

      {/* Bottom hint */}
      {card.type !== 'quiz' && !revealed && card.type !== 'tip' && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background:'rgba(0,0,0,0.45)', backdropFilter:'blur(8px)' }}>
            <span className="text-slate-300 text-xs">👆 Tap to reveal</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN FEED ────────────────────────────────────────────────────────────────
export default function QuickLearnFeed() {
  const { addXP } = useApp() || {};
  const [cards] = useState(() => shuffle(FEED_CARDS));
  const [activeIdx, setActiveIdx] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [cardsViewed, setCardsViewed] = useState(new Set([0]));
  const containerRef = useRef(null);

  const handleXP = useCallback((amount) => {
    addXP?.(amount);
    setSessionXP(prev => prev + amount);
  }, [addXP]);

  // Track scroll position → update active card
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardH = el.scrollHeight / cards.length;
      const idx = Math.round(el.scrollTop / cardH);
      if (idx !== activeIdx) {
        setActiveIdx(idx);
        setCardsViewed(prev => new Set([...prev, idx]));
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [activeIdx, cards.length]);

  // Navigate with arrow keys on desktop
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' && activeIdx < cards.length - 1) scrollTo(activeIdx + 1);
      if (e.key === 'ArrowUp'   && activeIdx > 0)               scrollTo(activeIdx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, cards.length]);

  const scrollTo = (idx) => {
    const el = containerRef.current;
    if (!el) return;
    const cardH = el.scrollHeight / cards.length;
    el.scrollTo({ top: cardH * idx, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col" style={{ height:'calc(100dvh - 56px)', background:'#020617', position:'relative' }}>

      {/* Header bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-2.5 border-b"
        style={{ background:'rgba(2,6,23,0.95)', backdropFilter:'blur(12px)', borderColor:'rgba(255,255,255,0.08)' }}>
        <div>
          <h1 className="text-base font-bold text-white leading-none">Quick Learn</h1>
          <p className="text-xs text-slate-500 mt-0.5">{cardsViewed.size} of {cards.length} seen</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background:'rgba(251,191,36,0.15)', border:'1px solid rgba(251,191,36,0.3)' }}>
            <span className="text-xs">⚡</span>
            <span className="text-xs font-bold text-yellow-400">+{sessionXP} XP</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-slate-400" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
            {activeIdx + 1}/{cards.length}
          </div>
        </div>
      </div>

      {/* Scrollable feed */}
      <div ref={containerRef} className="flex-1 overflow-y-scroll"
        style={{ scrollSnapType:'y mandatory', WebkitOverflowScrolling:'touch' }}>
        {cards.map((card, i) => (
          <FeedCard key={card.id} card={card} isActive={i === activeIdx} onXP={handleXP} />
        ))}
      </div>

      {/* Side nav dots */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20 pointer-events-none" style={{ display:'flex' }}>
        {cards.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIdx ? 6 : 4,
              height: i === activeIdx ? 6 : 4,
              background: i === activeIdx ? '#fff' : cardsViewed.has(i) ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
            }} />
        ))}
      </div>

      {/* Swipe hint — only on very first view */}
      {activeIdx === 0 && cardsViewed.size === 1 && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none z-30 animate-bounce">
          <div className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl" style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)' }}>
            <span className="text-lg">👆</span>
            <span className="text-slate-300 text-xs font-medium">Swipe up for next card</span>
          </div>
        </div>
      )}
    </div>
  );
}

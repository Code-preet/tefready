'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Nav from '../../../components/Nav'
import { useApp } from '../../../components/AppProvider'
import { T } from '../../../lib/i18n'

// ─────────────────────────────────────────────────────────────────────────────
// DICTIONARY — hand-tuned for common French words
// CAPS = stressed syllable, hyphens = syllable breaks
// ─────────────────────────────────────────────────────────────────────────────
const DICT = {
  // Greetings
  'bonjour':      'bohn-ZHOOR',
  'bonsoir':      'bohn-SWAHR',
  'salut':        'sah-LOO',
  'allô':         'ah-LOH',
  'merci':        'mehr-SEE',
  'pardon':       'pahr-DOHN',
  'excusez-moi':  'ex-koo-ZAY mwah',
  "s'il vous plaît": 'seel voo PLAY',
  'bonjour à tous': 'bohn-ZHOOR ah too',
  'au revoir':    'oh ruh-VWAHR',
  'à bientôt':    'ah byahn-TOH',
  'à demain':     'ah duh-MAN',
  'bonne nuit':   'bun NWEE',
  'bien sûr':     'byan SOOR',
  'peut-être':    'puh-TEHT-ruh',

  // Pronouns & articles
  'je':   'zhuh',   'tu':   'too',    'il':   'eel',
  'elle': 'el',     'nous': 'noo',    'vous': 'voo',
  'ils':  'eel',    'elles':'el',     'on':   'ohn',
  'le':   'luh',    'la':   'lah',    'les':  'lay',
  'un':   'uhn',    'une':  'oon',    'des':  'day',
  'du':   'doo',    'de':   'duh',    'ce':   'suh',

  // Answers
  'oui':  'wee',
  'non':  'nohn',

  // Common function words
  'et':       'ay',
  'est':      'ay',
  'en':       'ahn',
  'au':       'oh',
  'aux':      'oh',
  'que':      'kuh',
  'qui':      'kee',
  'mais':     'may',
  'ou':       'oo',
  'où':       'oo',
  'bien':     'byahn',
  'puis':     'pwee',
  'comment':  'koh-MAHN',
  'pourquoi': 'poor-KWAH',
  'quand':    'kahn',
  'combien':  'kohm-BYAHN',
  'parce que':'pars KUH',

  // Numbers
  'zéro':    'zay-ROH',
  'deux':    'duh',
  'trois':   'twah',
  'quatre':  'KAH-truh',
  'cinq':    'sank',
  'six':     'sees',
  'sept':    'set',
  'huit':    'weet',
  'neuf':    'nuhf',
  'dix':     'dees',
  'onze':    'ohnz',
  'douze':   'dooz',
  'treize':  'trehz',
  'quatorze':'kah-TORZ',
  'quinze':  'kanz',
  'seize':   'sez',
  'vingt':   'van',
  'trente':  'trahnt',
  'cent':    'sahn',
  'mille':   'meel',

  // Common nouns
  'maison':     'may-ZOHN',
  'voiture':    'vwah-TOOR',
  'famille':    'fah-MEE-yuh',
  'enfant':     'ahn-FAHN',
  'travail':    'trah-VY',
  'école':      'ay-KOL',
  'ami':        'ah-MEE',
  'amie':       'ah-MEE',
  'livre':      'LEE-vruh',
  'eau':        'oh',
  'pain':       'pan',
  'vin':        'van',
  'chat':       'shah',
  'chien':      'shyaN',
  'cheval':     'shuh-VAL',
  'hôpital':    'oh-pee-TAL',
  'restaurant': 'res-toh-RAHN',
  'hôtel':      'oh-TEL',
  'aéroport':   'ah-ay-roh-POR',
  'gare':       'gar',
  'rue':        'roo',
  'ville':      'veel',
  'pays':       'pay-ee',
  'monde':      'mohnd',
  'temps':      'tahn',
  'jour':       'zhoor',
  'nuit':       'nwee',
  'matin':      'mah-TAN',
  'soir':       'swahr',
  'année':      'ah-NAY',
  'semaine':    'suh-MEN',
  'mois':       'mwah',
  'médecin':    'mayd-SAN',
  'musique':    'moo-ZEEK',
  'cinéma':     'see-nay-MAH',
  'professeur': 'proh-feh-SUR',
  'étudiant':   'ay-too-DYAHN',
  'université': 'oo-nee-vehr-see-TAY',
  'télévision': 'tay-lay-vee-ZYOHN',
  'téléphone':  'tay-lay-FON',
  'ordinateur': 'or-dee-nah-TUR',
  'argent':     'ahr-ZHAHN',
  'langue':     'lahng',
  'histoire':   'ees-TWAHR',
  'français':   'frahn-SAY',
  'anglais':    'ahn-GLAY',
  'canadien':   'kah-nah-DYAN',
  'montagne':   'mohn-TAH-nyuh',
  'champagne':  'shahm-PAH-nyuh',

  // Common verbs (infinitive)
  'être':       'EH-truh',
  'avoir':      'ah-VWAHR',
  'aller':      'ah-LAY',
  'faire':      'fehr',
  'dire':       'deer',
  'voir':       'vwahr',
  'vouloir':    'voo-LWAHR',
  'pouvoir':    'poo-VWAHR',
  'savoir':     'sah-VWAHR',
  'venir':      'vuh-NEER',
  'parler':     'pahr-LAY',
  'manger':     'mahn-ZHAY',
  'boire':      'bwahr',
  'prendre':    'prahn-druh',
  'mettre':     'meh-truh',
  'partir':     'pahr-TEER',
  'arriver':    'ah-ree-VAY',
  'trouver':    'troo-VAY',
  'donner':     'doh-NAY',
  'aimer':      'ay-MAY',
  'habiter':    'ah-bee-TAY',
  'travailler': 'trah-vy-YAY',
  'attendre':   'ah-TAHN-druh',
  'comprendre': 'kohm-PRAHN-druh',
  'répondre':   'ray-POHN-druh',
  'écouter':    'ay-koo-TAY',
  'acheter':    'ash-TAY',

  // Adjectives
  'grand':    'grahn',
  'petit':    'puh-TEE',
  'bon':      'bohn',
  'bonne':    'bun',
  'beau':     'boh',
  'belle':    'bel',
  'nouveau':  'noo-VOH',
  'vieux':    'vyuh',
  'jeune':    'zhuhn',
  'content':  'kohn-TAHN',
  'mauvais':  'moh-VAY',
  'difficile':'dee-fee-SEEL',
  'facile':   'fah-SEEL',
  'chaud':    'shoh',
  'froid':    'fwah',
}

// ─────────────────────────────────────────────────────────────────────────────
// PHONETIC ENGINE — character-by-character rule processor
// ─────────────────────────────────────────────────────────────────────────────
const VOWEL_CHARS = new Set([...'aeiouéèêàâîôûùœæy'])

function isVC(c) { return VOWEL_CHARS.has(c || '') }

function tokenizeWord(lower) {
  const len = lower.length
  const tokens = [] // [{p: phonemeString, src: sourceChars}]
  let i = 0

  while (i < len) {
    const rem = lower.slice(i)
    const c   = lower[i]
    const n1  = lower[i + 1] || ''
    const n2  = lower[i + 2] || ''
    const n3  = lower[i + 3] || ''
    const atEnd = i === len - 1

    // ── Trigraphs ────────────────────────────────────────────────────────────
    if (rem.startsWith('eau'))                              { tokens.push({p:'oh',  s:'eau'}); i+=3; continue }
    if (rem.startsWith('oui'))                              { tokens.push({p:'wee', s:'oui'}); i+=3; continue }
    if (rem.startsWith('oeu'))                              { tokens.push({p:'uh',  s:'oeu'}); i+=3; continue }

    // Nasal trigraphs (only nasalise before consonant or end)
    if (rem.startsWith('ain') && !isVC(n3))                { tokens.push({p:'an',  s:'ain'}); i+=3; continue }
    if (rem.startsWith('aim') && !isVC(n3))                { tokens.push({p:'an',  s:'aim'}); i+=3; continue }
    if (rem.startsWith('ein') && !isVC(n3))                { tokens.push({p:'an',  s:'ein'}); i+=3; continue }
    if (rem.startsWith('oin') && !isVC(n3))                { tokens.push({p:'wan', s:'oin'}); i+=3; continue }
    if (rem.startsWith('ien') && !isVC(n3))                { tokens.push({p:'yan', s:'ien'}); i+=3; continue }
    if (rem.startsWith('ean') && !isVC(n3))                { tokens.push({p:'ahn', s:'ean'}); i+=3; continue }

    // ── Nasal digraphs (vowel + n/m before consonant or word-end) ────────────
    if ((rem.startsWith('an')||rem.startsWith('am')) && !isVC(n2)) { tokens.push({p:'ahn', s:rem.slice(0,2)}); i+=2; continue }
    if ((rem.startsWith('en')||rem.startsWith('em')) && !isVC(n2)) { tokens.push({p:'ahn', s:rem.slice(0,2)}); i+=2; continue }
    if ((rem.startsWith('in')||rem.startsWith('im')) && !isVC(n2)) { tokens.push({p:'an',  s:rem.slice(0,2)}); i+=2; continue }
    if ((rem.startsWith('on')||rem.startsWith('om')) && !isVC(n2)) { tokens.push({p:'ohn', s:rem.slice(0,2)}); i+=2; continue }
    if ((rem.startsWith('un')||rem.startsWith('um')) && !isVC(n2)) { tokens.push({p:'uhn', s:rem.slice(0,2)}); i+=2; continue }

    // ── Consonant digraphs ───────────────────────────────────────────────────
    if (rem.startsWith('ch'))  { tokens.push({p:'sh',  s:'ch'});  i+=2; continue }
    if (rem.startsWith('gn'))  { tokens.push({p:'ny',  s:'gn'});  i+=2; continue }
    if (rem.startsWith('ph'))  { tokens.push({p:'f',   s:'ph'});  i+=2; continue }
    if (rem.startsWith('qu'))  { tokens.push({p:'k',   s:'qu'});  i+=2; continue }
    if (rem.startsWith('ck'))  { tokens.push({p:'k',   s:'ck'});  i+=2; continue }
    if (rem.startsWith('th'))  { tokens.push({p:'t',   s:'th'});  i+=2; continue }
    if (rem.startsWith('ss'))  { tokens.push({p:'s',   s:'ss'});  i+=2; continue }
    if (rem.startsWith('rr'))  { tokens.push({p:'r',   s:'rr'});  i+=2; continue }
    if (rem.startsWith('ll'))  {
      const prev = i > 0 ? lower[i - 1] : ''
      tokens.push({p: prev === 'i' ? 'y' : 'l', s:'ll'})
      i+=2; continue
    }

    // ── Vowel digraphs ───────────────────────────────────────────────────────
    if (rem.startsWith('oi'))  { tokens.push({p:'wah', s:'oi'});  i+=2; continue }
    if (rem.startsWith('ou'))  { tokens.push({p:'oo',  s:'ou'});  i+=2; continue }
    if (rem.startsWith('au'))  { tokens.push({p:'oh',  s:'au'});  i+=2; continue }
    if (rem.startsWith('ai'))  { tokens.push({p:'ay',  s:'ai'});  i+=2; continue }
    if (rem.startsWith('ei'))  { tokens.push({p:'ay',  s:'ei'});  i+=2; continue }
    if (rem.startsWith('eu'))  { tokens.push({p:'uh',  s:'eu'});  i+=2; continue }
    if (rem.startsWith('ui'))  { tokens.push({p:'wee', s:'ui'});  i+=2; continue }
    if (rem.startsWith('ie'))  { tokens.push({p:'ee',  s:'ie'});  i+=2; continue }

    // ── Accented single vowels ───────────────────────────────────────────────
    if (c === 'é')              { tokens.push({p:'ay', s:'é'}); i++; continue }
    if (c === 'è' || c === 'ê') { tokens.push({p:'eh', s:c});  i++; continue }
    if (c === 'à' || c === 'â') { tokens.push({p:'ah', s:c});  i++; continue }
    if (c === 'î')              { tokens.push({p:'ee', s:'î'}); i++; continue }
    if (c === 'ô')              { tokens.push({p:'oh', s:'ô'}); i++; continue }
    if (c === 'û' || c === 'ù') { tokens.push({p:'oo', s:c});  i++; continue }
    if (c === 'ç')              { tokens.push({p:'s',  s:'ç'}); i++; continue }
    if (c === 'œ')              { tokens.push({p:'uh', s:'œ'}); i++; continue }

    // ── Context-sensitive: c ─────────────────────────────────────────────────
    if (c === 'c') {
      const soft = 'eiéèêîy'.includes(n1)
      tokens.push({p: soft ? 's' : 'k', s:'c'})
      i++; continue
    }

    // ── Context-sensitive: g ─────────────────────────────────────────────────
    if (c === 'g') {
      const soft = 'eiéèêîy'.includes(n1)
      tokens.push({p: soft ? 'zh' : 'g', s:'g'})
      i++; continue
    }

    // ── Silent h ─────────────────────────────────────────────────────────────
    if (c === 'h') { tokens.push({p:'', s:'h'}); i++; continue }

    // ── j → zh ──────────────────────────────────────────────────────────────
    if (c === 'j') { tokens.push({p:'zh', s:'j'}); i++; continue }

    // ── Final silent consonants (d s t p x z) ───────────────────────────────
    if (atEnd && 'dstpxz'.includes(c)) { tokens.push({p:'', s:c}); i++; continue }

    // ── Final silent e ───────────────────────────────────────────────────────
    if (atEnd && c === 'e') { tokens.push({p:'', s:'e'}); i++; continue }

    // ── Regular vowels ───────────────────────────────────────────────────────
    if (c === 'a') { tokens.push({p:'ah', s:'a'}); i++; continue }
    if (c === 'e') { tokens.push({p:'uh', s:'e'}); i++; continue }
    if (c === 'i') { tokens.push({p:'ee', s:'i'}); i++; continue }
    if (c === 'o') { tokens.push({p:'oh', s:'o'}); i++; continue }
    if (c === 'u') { tokens.push({p:'oo', s:'u'}); i++; continue }
    if (c === 'y') { tokens.push({p:'ee', s:'y'}); i++; continue }

    // ── Pass-through consonants ──────────────────────────────────────────────
    tokens.push({p: c, s: c})
    i++
  }

  return tokens
}

// Group phoneme tokens into hyphen-separated syllables
const VOWEL_PHONES = new Set(['wah','wee','yan','wan','ahn','uhn','ohn','ah','ay','ee','oo','oh','uh','an'])
function isVP(p) { return VOWEL_PHONES.has(p) }

function buildPhonetic(tokens) {
  const active = tokens.filter(t => t.p) // drop silent
  if (!active.length) return ''

  const syllables = []
  let cur = ''
  let hasNucleus = false

  for (let i = 0; i < active.length; i++) {
    const p = active[i].p
    const isV = isVP(p)

    if (isV) {
      if (hasNucleus) {
        // Second vowel → new syllable
        syllables.push(cur)
        cur = p
      } else {
        cur += p
        hasNucleus = true
      }
    } else {
      // Consonant
      if (hasNucleus) {
        const nextIsV = active[i + 1] && isVP(active[i + 1].p)
        if (nextIsV) {
          // Single consonant before vowel → starts next syllable
          syllables.push(cur)
          cur = p
          hasNucleus = false
        } else {
          cur += p
        }
      } else {
        cur += p
      }
    }
  }
  if (cur) syllables.push(cur)
  return syllables.filter(Boolean).join('-')
}

// ─────────────────────────────────────────────────────────────────────────────
// SYLLABLE BREAKDOWN (original French spelling)
// ─────────────────────────────────────────────────────────────────────────────
function buildSyllables(word) {
  const lo = word.toLowerCase()
  const len = lo.length
  if (len <= 2) return word

  // Mark each char as V or C
  const isV = i => VOWEL_CHARS.has(lo[i] || '')

  const breaks = new Set()
  for (let i = 0; i < len - 1; i++) {
    if (isV(i)) {
      if (!isV(i + 1) && isV(i + 2))   breaks.add(i + 1) // V·CV
      if (!isV(i + 1) && !isV(i + 2) && isV(i + 3)) breaks.add(i + 2) // VC·CV
    }
  }

  let out = ''
  for (let i = 0; i < word.length; i++) {
    if (breaks.has(i)) out += '·'
    out += word[i]
  }
  return out
}

// ─────────────────────────────────────────────────────────────────────────────
// MOUTH TIPS — pattern-matched from the original French word
// ─────────────────────────────────────────────────────────────────────────────
const ALL_TIPS = [
  {
    id: 'r',
    label: 'French "r"',
    icon: '🗣️',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FCA5A5',
    detect: w => /r/.test(w) && !/rr/.test(w),
    guide: 'Do NOT roll your "r" like in Spanish. Instead, produce a gentle rasp deep in your throat — like gargling softly. Your tongue tip should stay behind your lower teeth.',
    examples: ['rouge → roozh', 'pardon → pahr-dohn', 'mer·ci → mehr-see'],
  },
  {
    id: 'ou',
    label: '"ou" = "oo"',
    icon: '👄',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    detect: w => /ou|û|ù/.test(w),
    guide: 'Round your lips tightly into a "kiss" shape — like saying "oo" in "food". Keep your lips very rounded. This is different from the French "u" (which has no English equivalent).',
    examples: ['loup → loo', 'bou·tique → boo-teek', 'rouge → roozh'],
  },
  {
    id: 'u',
    label: 'French "u"',
    icon: '😮',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    detect: w => /[^ao]u(?![ioa])/.test(w) && !/[aoôâà]u/.test(w),
    guide: 'There is no English equivalent! Say "ee" (as in "see"), then slowly round your lips into an "oo" shape WITHOUT moving your tongue. The result is a unique front-rounded vowel.',
    examples: ['tu → too', 'rue → roo', 'du → doo'],
  },
  {
    id: 'eu',
    label: '"eu" / "œ"',
    icon: '🫦',
    color: '#0891B2',
    bg: '#E0F2FE',
    border: '#BAE6FD',
    detect: w => /eu|œ/.test(w),
    guide: 'Say "ay" (as in "day"), then round your lips toward "oo" while keeping your tongue in the "ay" position. Think of "uh" with lip rounding. It has no direct English sound.',
    examples: ['bleu → bluh', 'peu → puh', 'peur → pur'],
  },
  {
    id: 'nasals',
    label: 'Nasal vowels',
    icon: '👃',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    detect: w => /an|en|in|on|un|ain|ein|oin|ien/.test(w),
    guide: 'These vowel + n/m combinations create nasal vowels — air flows through BOTH your mouth and nose at once. You do NOT fully pronounce the final "n". The sound comes from inside your nose-throat area.',
    examples: ['bon → bohn', 'enfant → ahn-fahn', 'cin·q → sank'],
  },
  {
    id: 'ch',
    label: '"ch" = "sh"',
    icon: '🤫',
    color: '#BE185D',
    bg: '#FDF2F8',
    border: '#FBCFE8',
    detect: w => /ch/.test(w),
    guide: 'French "ch" is ALWAYS pronounced like English "sh" (as in "shoe") — never like the English "ch" in "chair" or "church".',
    examples: ['chat → shah', 'chercher → shehr-shay', 'manche → mahnsh'],
  },
  {
    id: 'j_g',
    label: '"j" and soft "g"',
    icon: '🌊',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    detect: w => /j|g[eiéèêîy]/.test(w),
    guide: 'The French "j" (and "g" before e/i) sounds like the "s" in "measure" or "treasure" — a soft buzzing "zh". It is NOT like the English "j" in "jump".',
    examples: ['je → zhuh', 'bonjour → bohn-zhoor', 'rouge → roozh'],
  },
  {
    id: 'gn',
    label: '"gn" = "ny"',
    icon: '🎭',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    detect: w => /gn/.test(w),
    guide: 'The letters "gn" together make a single "ny" sound — like the "ny" in "canyon" or Italian "gnocchi". The "g" is completely absorbed.',
    examples: ['champagne → shahm-PAH-nyuh', 'montagne → mohn-tanyuh'],
  },
  {
    id: 'oi',
    label: '"oi" = "wah"',
    icon: '💧',
    color: '#0891B2',
    bg: '#E0F2FE',
    border: '#BAE6FD',
    detect: w => /oi/.test(w),
    guide: 'The combination "oi" sounds like "wah" — like the "wa" in "water". It is NOT "oy" as in "boy". Start with a quick "w" glide then open to "ah".',
    examples: ['moi → mwah', 'voi·ture → vwah-toor', 'roi → rwah'],
  },
  {
    id: 'silent_end',
    label: 'Silent final letters',
    icon: '🤐',
    color: '#475569',
    bg: '#F8FAFC',
    border: '#E2E8F0',
    detect: w => /[dstpxz]$/.test(w),
    guide: 'Final consonants d, s, t, p, x, z are almost always SILENT in French. Do not try to pronounce them. Exception: liaison (when the next word starts with a vowel).',
    examples: ['chat → shah', 'vous → voo', 'temps → tahn'],
  },
]

function getMouthTips(word) {
  const lo = word.toLowerCase()
  return ALL_TIPS.filter(tip => tip.detect(lo)).slice(0, 4) // max 4 tips
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ANALYSIS FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
function analyzeWord(rawWord) {
  if (!rawWord.trim()) return null
  const original = rawWord.trim()
  const lower = original.toLowerCase().normalize('NFC').replace(/\s+/g, ' ')

  const dictEntry = DICT[lower]
  const fromDict  = Boolean(dictEntry)
  const phonetic  = fromDict
    ? dictEntry
    : buildPhonetic(tokenizeWord(lower))

  return {
    original,
    phonetic: phonetic || '—',
    syllables: buildSyllables(original),
    tips: getMouthTips(lower),
    fromDict,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TTS — speak the word in French
// ─────────────────────────────────────────────────────────────────────────────
function speakFrench(text, rate = 0.85) {
  return new Promise(resolve => {
    if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return }
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'fr-CA'
    u.rate = rate
    const voices = window.speechSynthesis.getVoices()
    const fr = voices.find(v => v.lang === 'fr-CA') || voices.find(v => v.lang.startsWith('fr')) || null
    if (fr) u.voice = fr
    u.onend  = () => resolve()
    u.onerror = () => resolve()
    window.speechSynthesis.speak(u)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// UI SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function PhoneticDisplay({ phonetic, fromDict }) {
  // Colour-code each syllable differently
  const syllables = phonetic.split('-')
  const COLOURS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#BE185D', '#0891B2']
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '2px' }}>
      {syllables.map((syl, i) => {
        const colour = COLOURS[i % COLOURS.length]
        const isStressed = syl === syl.toUpperCase() && syl.length > 1
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {i > 0 && (
              <span style={{ color: '#CBD5E1', fontWeight: 400, fontSize: '1.3rem', lineHeight: 1 }}>-</span>
            )}
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: isStressed ? 900 : 600,
              fontSize: isStressed ? '1.65rem' : '1.4rem',
              color: colour,
              textTransform: 'lowercase',
              letterSpacing: isStressed ? '-0.01em' : '0',
            }}>
              {syl.toLowerCase()}
            </span>
            {isStressed && (
              <span style={{ color: colour, fontSize: '0.6rem', marginBottom: '0.8rem', opacity: 0.7 }}>▲</span>
            )}
          </span>
        )
      })}
    </div>
  )
}

function WaveIcon({ playing, size = 20, color = '#2563EB' }) {
  const bars = [0.4, 0.7, 1, 0.7, 0.4, 0.8, 0.5]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: size }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: 2.5, borderRadius: 2,
          height: playing ? `${h * size}px` : `${0.25 * size}px`,
          background: color,
          transition: `height ${0.25 + i * 0.06}s ease-in-out`,
          animation: playing ? `wave ${0.6 + (i % 3) * 0.2}s ease-in-out infinite alternate` : 'none',
        }} />
      ))}
      <style>{`@keyframes wave { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }`}</style>
    </div>
  )
}

function MouthTipCard({ tip }) {
  return (
    <div style={{
      background: tip.bg, borderRadius: '1rem',
      padding: '1rem 1.1rem', border: `1.5px solid ${tip.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.2rem' }}>{tip.icon}</span>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: tip.color }}>
          {tip.label}
        </span>
      </div>
      <p style={{ margin: '0 0 0.5rem', color: '#1E293B', fontSize: '0.85rem', lineHeight: 1.6 }}>
        {tip.guide}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
        {tip.examples.map((ex, i) => (
          <span key={i} style={{
            background: tip.color + '14', color: tip.color,
            borderRadius: '0.5rem', padding: '0.15rem 0.55rem',
            fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace',
          }}>{ex}</span>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE WORDS (quick-tap chips)
// ─────────────────────────────────────────────────────────────────────────────
const EXAMPLES = [
  { word: 'Salut',       hint: 'hi' },
  { word: 'Bonjour',     hint: 'hello' },
  { word: 'Merci',       hint: 'thanks' },
  { word: 'Oui',         hint: 'yes' },
  { word: 'Maison',      hint: 'house' },
  { word: 'Voiture',     hint: 'car' },
  { word: 'Famille',     hint: 'family' },
  { word: 'Télévision',  hint: 'TV' },
  { word: 'Champagne',   hint: '🥂' },
  { word: 'Restaurant',  hint: 'restaurant' },
  { word: 'Bonjour',     hint: 'hello' },
  { word: 'Eau',         hint: 'water' },
  { word: 'Montagne',    hint: 'mountain' },
  { word: 'Français',    hint: 'French' },
  { word: 'Bonsoir',     hint: 'good evening' },
  { word: 'Pouvoir',     hint: 'can/able' },
]

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function PronunciationPage() {
  const { state } = useApp()
  const lang  = state?.lang || 'en'
  const navT  = T[lang]?.nav || T.en.nav

  const [input,   setInput]   = useState('')
  const [result,  setResult]  = useState(null)
  const [playing, setPlaying] = useState(false)
  const [rate,    setRate]    = useState(0.85)
  const inputRef = useRef(null)

  // Cleanup TTS on unmount
  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  const analyze = useCallback((word) => {
    const w = (word || input).trim()
    if (!w) return
    setResult(analyzeWord(w))
    setPlaying(false)
    window.speechSynthesis?.cancel()
  }, [input])

  const handleKey = (e) => { if (e.key === 'Enter') analyze() }

  const handleExample = (word) => {
    setInput(word)
    analyze(word)
  }

  const handleListen = async () => {
    if (!result || playing) return
    setPlaying(true)
    await speakFrench(result.original, rate)
    setPlaying(false)
  }

  const handleListenSlow = async () => {
    if (!result || playing) return
    setPlaying(true)
    await speakFrench(result.original, 0.55)
    setPlaying(false)
  }

  // Colour for stress mark highlight
  const stressed = result?.phonetic?.split('-').findIndex(s => s === s.toUpperCase() && s.length > 1)

  return (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '6rem' }}>
      <Nav navT={navT} />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem 0' }}>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #7C3AED 100%)',
          borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.75rem', color: 'white',
          boxShadow: '0 6px 24px rgba(37,99,235,0.3)',
        }}>
          <Link href="/tools" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>
            ← Tools
          </Link>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>🗣️</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.7rem', fontWeight: 800, margin: '0 0 0.4rem' }}>
            Pronunciation Helper
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.78)', margin: '0 0 1.25rem', lineHeight: 1.6, fontSize: '0.92rem' }}>
            Type any French word — get English-style pronunciation, syllable breakdown, lip & tongue guidance, and audio playback.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['🔤 Phonetic guide', '🔊 Audio playback', '👄 Mouth tips', '📐 Syllables'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '1rem', padding: '0.22rem 0.7rem', fontSize: '0.74rem', fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* ── Input ──────────────────────────────────────────────────────── */}
        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.25rem', border: '1.5px solid #E8F0FB', boxShadow: '0 2px 10px rgba(37,99,235,0.06)' }}>
          <label style={{ display: 'block', color: '#0A2540', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.6rem' }}>
            ✍️ Type a French word
          </label>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. télévision, bonjour, eau…"
              autoFocus
              style={{
                flex: 1, padding: '0.85rem 1rem', borderRadius: '0.85rem',
                border: '2px solid #E2E8F0', fontSize: '1.05rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#0A2540', outline: 'none', transition: 'border 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
            <button
              onClick={() => analyze()}
              style={{
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                color: 'white', border: 'none', borderRadius: '0.85rem',
                padding: '0.85rem 1.25rem', fontWeight: 800, fontSize: '1rem',
                cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
              }}
            >
              Analyse →
            </button>
          </div>

          {/* Example chips */}
          <div style={{ marginTop: '0.85rem' }}>
            <p style={{ color: '#94A3B8', fontSize: '0.75rem', margin: '0 0 0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick examples
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {EXAMPLES.filter((e, i, arr) => arr.findIndex(x => x.word === e.word) === i).map(ex => (
                <button key={ex.word} onClick={() => handleExample(ex.word)}
                  style={{
                    background: input.toLowerCase() === ex.word.toLowerCase() ? '#EFF6FF' : '#F8FAFC',
                    border: `1.5px solid ${input.toLowerCase() === ex.word.toLowerCase() ? '#BFDBFE' : '#E2E8F0'}`,
                    color: input.toLowerCase() === ex.word.toLowerCase() ? '#2563EB' : '#475569',
                    borderRadius: '0.6rem', padding: '0.25rem 0.7rem',
                    fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600, transition: 'all 0.1s',
                  }}>
                  {ex.word}
                  <span style={{ color: '#94A3B8', fontWeight: 400, marginLeft: '0.3rem', fontSize: '0.72rem' }}>
                    {ex.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Result card ────────────────────────────────────────────────── */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Main pronunciation card */}
            <div style={{
              background: 'white', borderRadius: '1.25rem', padding: '1.5rem',
              border: '1.5px solid #E8F0FB', boxShadow: '0 4px 16px rgba(37,99,235,0.08)',
            }}>
              {/* Word + listen controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem', gap: '1rem' }}>
                <div>
                  <p style={{ color: '#94A3B8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.2rem' }}>
                    French word
                  </p>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 900, color: '#0A2540', lineHeight: 1.15 }}>
                    {result.original}
                  </div>
                  {result.fromDict && (
                    <span style={{ background: '#DCFCE7', color: '#15803D', borderRadius: '0.4rem', padding: '0.08rem 0.5rem', fontSize: '0.68rem', fontWeight: 700 }}>
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Audio buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
                  <button
                    onClick={handleListen}
                    disabled={playing}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: playing ? '#EFF6FF' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      color: playing ? '#2563EB' : 'white',
                      border: playing ? '1.5px solid #BFDBFE' : 'none',
                      borderRadius: '0.75rem', padding: '0.55rem 1rem',
                      fontSize: '0.85rem', fontWeight: 700, cursor: playing ? 'default' : 'pointer',
                      boxShadow: playing ? 'none' : '0 3px 10px rgba(37,99,235,0.35)',
                      transition: 'all 0.2s', minWidth: '108px', justifyContent: 'center',
                    }}
                  >
                    {playing
                      ? <WaveIcon playing={true} size={16} color="#2563EB" />
                      : <span>🔊</span>
                    }
                    {playing ? 'Playing…' : 'Listen'}
                  </button>
                  <button
                    onClick={handleListenSlow}
                    disabled={playing}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      background: '#F8FAFC', color: '#475569',
                      border: '1.5px solid #E2E8F0', borderRadius: '0.75rem',
                      padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 600,
                      cursor: playing ? 'default' : 'pointer',
                      justifyContent: 'center',
                    }}
                  >
                    🐢 Slow
                  </button>
                  {/* Speed selector */}
                  <div style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
                    {[0.7, 0.85, 1.0].map(r => (
                      <button key={r} onClick={() => setRate(r)}
                        style={{
                          padding: '0.12rem 0.4rem', borderRadius: '0.4rem', border: 'none',
                          background: rate === r ? '#2563EB' : '#F1F5F9',
                          color: rate === r ? 'white' : '#94A3B8',
                          fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer',
                        }}>
                        {r === 0.7 ? '0.7×' : r === 0.85 ? '1×' : '1.2×'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pronunciation guide */}
              <div style={{ background: '#F7F9FF', borderRadius: '1rem', padding: '1.1rem 1.25rem', marginBottom: '1rem', border: '1px solid #DBEAFE' }}>
                <p style={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.5rem' }}>
                  How to say it (in English sounds)
                </p>
                <PhoneticDisplay phonetic={result.phonetic} fromDict={result.fromDict} />
                {!result.fromDict && (
                  <p style={{ color: '#94A3B8', fontSize: '0.7rem', marginTop: '0.4rem', fontStyle: 'italic' }}>
                    * Rule-based estimate — exact pronunciation may vary
                  </p>
                )}
                {result.fromDict && (
                  <p style={{ color: '#94A3B8', fontSize: '0.7rem', marginTop: '0.4rem' }}>
                    CAPS = stressed syllable  ·  each colour = one syllable
                  </p>
                )}
              </div>

              {/* Syllable breakdown */}
              <div style={{ background: '#FFFBEB', borderRadius: '0.9rem', padding: '0.9rem 1.1rem', border: '1px solid #FDE68A' }}>
                <p style={{ color: '#92400E', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.4rem' }}>
                  📐 Syllable breakdown
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', flexWrap: 'wrap' }}>
                  {result.syllables.split('·').map((syl, i, arr) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                      <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '1.15rem', fontWeight: 700, color: '#92400E',
                        background: 'rgba(146,64,14,0.08)',
                        borderRadius: '0.4rem', padding: '0.1rem 0.45rem',
                      }}>
                        {syl}
                      </span>
                      {i < arr.length - 1 && (
                        <span style={{ color: '#FCD34D', fontSize: '1.1rem', fontWeight: 900 }}>·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mouth guidance tips */}
            {result.tips.length > 0 && (
              <div>
                <p style={{ color: '#0A2540', fontWeight: 700, fontSize: '0.88rem', margin: '0 0 0.65rem' }}>
                  👄 Mouth & tongue guidance
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.tips.map(tip => (
                    <MouthTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </div>
            )}

            {/* No tips */}
            {result.tips.length === 0 && (
              <div style={{ background: '#F0FDF4', borderRadius: '1rem', padding: '1rem', border: '1.5px solid #BBF7D0', textAlign: 'center' }}>
                <p style={{ color: '#15803D', fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>
                  ✅ This word has no unusual sounds — pronounce each letter as shown above!
                </p>
              </div>
            )}

            {/* Try another */}
            <button
              onClick={() => { setInput(''); setResult(null); inputRef.current?.focus() }}
              style={{
                background: '#F8FAFC', color: '#475569', border: '1.5px solid #E2E8F0',
                borderRadius: '0.9rem', padding: '0.75rem', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer', width: '100%',
              }}
            >
              🔄 Try another word
            </button>
          </div>
        )}

        {/* ── Tip box when nothing searched yet ──────────────────────────── */}
        {!result && (
          <div style={{ background: '#FFF8EC', borderRadius: '1.25rem', padding: '1.25rem', border: '1.5px solid #F6D07A' }}>
            <p style={{ color: '#92400E', fontWeight: 700, fontSize: '0.9rem', margin: '0 0 0.65rem' }}>
              💡 How to use this tool
            </p>
            {[
              ['Type', 'Enter any French word or short phrase above'],
              ['Read', 'See how to say it using familiar English sounds'],
              ['Listen', 'Press 🔊 to hear the correct French pronunciation'],
              ['Understand', 'Follow the mouth & tongue tips for tricky sounds'],
            ].map(([title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.55rem' }}>
                <span style={{ background: '#E8A020', color: 'white', borderRadius: '0.4rem', padding: '0.08rem 0.5rem', fontSize: '0.72rem', fontWeight: 800, flexShrink: 0, marginTop: '0.08rem' }}>
                  {title}
                </span>
                <p style={{ color: '#78350F', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

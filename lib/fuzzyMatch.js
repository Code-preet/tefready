// lib/fuzzyMatch.js — Fuzzy answer checking for typed/translation exercises

/** Levenshtein edit distance between two strings */
export function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/** Normalize: lowercase, strip accents, trim, collapse spaces, remove punctuation */
export function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')     // remove combining diacritics
    .replace(/['']/g, "'")               // normalize apostrophes
    .replace(/[^a-z0-9\s']/g, '')        // remove punctuation except apostrophe
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check a user's typed answer against correct answer + optional alternates.
 * Allows small typos based on answer length.
 * @returns {{ correct: boolean, close: boolean, feedback: string, correctAnswer: string }}
 */
export function checkAnswer(userInput, correctAnswer, alternates = []) {
  if (!userInput || !userInput.trim()) {
    return { correct: false, close: false, feedback: 'Please type your answer.', correctAnswer };
  }

  const userNorm = normalize(userInput);
  const allAnswers = [correctAnswer, ...alternates];
  const allNorm = allAnswers.map(normalize);

  let minDist = Infinity;
  let bestIdx = 0;

  for (let i = 0; i < allNorm.length; i++) {
    const d = levenshtein(userNorm, allNorm[i]);
    if (d < minDist) {
      minDist = d;
      bestIdx = i;
    }
  }

  const bestAnswer = allAnswers[bestIdx];
  const bestNorm = allNorm[bestIdx];
  const maxLen = Math.max(userNorm.length, bestNorm.length);

  // Tolerance: 0 for very short, 1 for short, 2 for medium, 3 for long
  const tolerance = maxLen <= 3 ? 0 : maxLen <= 7 ? 1 : maxLen <= 14 ? 2 : 3;

  const correct = minDist === 0;
  const close = !correct && minDist <= tolerance;

  let feedback = '';
  if (correct) {
    feedback = '✅ Perfect!';
  } else if (close) {
    feedback = `Almost! Small spelling error. Correct: "${bestAnswer}"`;
  } else {
    // Check if they got it right but with wrong accent only
    const noAccentDist = levenshtein(userNorm, normalize(bestAnswer));
    if (noAccentDist === 0) {
      feedback = `Watch your accents. Correct: "${bestAnswer}"`;
    } else {
      feedback = `Correct answer: "${bestAnswer}"`;
    }
  }

  return { correct: correct || close, close, perfect: correct, feedback, correctAnswer: bestAnswer };
}

/**
 * Check a fill-in-the-blank answer for a single blank
 */
export function checkFill(userInput, correctAnswer, alternates = []) {
  return checkAnswer(userInput, correctAnswer, alternates);
}

/**
 * cleanForSpeech(text)
 *
 * Strips fill-in-the-blank placeholders and other non-speech characters
 * before passing text to SpeechSynthesis.
 *
 * Rules applied (display text is NEVER modified — only the spoken string):
 *   1. Remove all sequences of underscores (e.g. ___, __, _)
 *   2. Collapse multiple consecutive spaces into one
 *   3. Trim leading/trailing whitespace
 *
 * Example:
 *   "Je ___ vais"   →  "Je vais"
 *   "Tu __ parles." →  "Tu parles."
 */
export function cleanForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/_+/g, '')      // remove underscore placeholders
    .replace(/\s{2,}/g, ' ') // collapse extra spaces left behind
    .trim();
}

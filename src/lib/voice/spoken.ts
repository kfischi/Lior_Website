/**
 * What the assistant says out loud, cut into sentences. The same cutting is used when the audio of the
 * answers is recorded (scripts/export-voice-script.ts) and when the chat plays an answer, so a sentence
 * in the chat finds the recording that was made for exactly that sentence.
 * Pure and safe for client and server.
 */

const MAX_CHARS = 170;
const MIN_CHARS = 28;

/** Removes what is shown but not said: links, the "read more" pointer, markers, Markdown. */
export function cleanForSpeech(text: string): string {
  return text
    .replace(/\[\[[^\]]*\]\]/g, ' ')
    .replace(/^\s*קראו עוד:.*$/gm, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/(^|\s)\/[a-z0-9\-/#]+/gi, ' ')
    .replace(/[*_`#>]+/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/** A sentence per item; a very long one is cut at commas so each recording stays short and natural. */
export function splitSpoken(text: string): string[] {
  const out: string[] = [];
  for (const block of cleanForSpeech(text).split(/\n+/)) {
    for (const sentence of block.split(/(?<=[.!?])\s+/)) {
      const s = sentence.trim();
      if (!s) continue;
      if (s.length <= MAX_CHARS) {
        out.push(s);
        continue;
      }
      let current = '';
      for (const piece of s.split(/(?<=,)\s+/)) {
        if (current && (current + ' ' + piece).length > MAX_CHARS) {
          out.push(current);
          current = piece;
        } else {
          current = current ? `${current} ${piece}` : piece;
        }
      }
      if (current) out.push(current);
    }
  }
  // A very short sentence ("בשמחה.") sounds better recorded together with the one that follows it.
  const merged: string[] = [];
  for (const s of out.filter((x) => /[֐-׿]/.test(x))) {
    const last = merged[merged.length - 1];
    if (last !== undefined && last.length < MIN_CHARS && !/[?:]$/.test(last) && (last + ' ' + s).length <= MAX_CHARS) {
      merged[merged.length - 1] = `${last} ${s}`;
    } else {
      merged.push(s);
    }
  }
  return merged;
}

/** Key of a sentence: ignores spacing, quote styles and vowel marks, so tiny edits do not lose a recording. */
export function spokenKey(sentence: string): string {
  const plain = sentence
    .replace(/[֑-ׇ]/g, '')
    .replace(/[׳'’`״"“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  // FNV-1a, 32 bit: short, stable and the same in the browser and on the server.
  let h = 0x811c9dc5;
  for (let i = 0; i < plain.length; i++) {
    h ^= plain.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

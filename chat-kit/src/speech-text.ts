/** Turns on-screen text into what the voice should say. Pure; safe on server and client. */

/** Removes what is shown but not said: links, markers, Markdown. */
export function cleanForSpeech(text: string): string {
  return text
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[*_`#>]+/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/** Applies the pronunciation list ("צ'אט" -> "טשאט"), longest words first. Never use the result on screen. */
export function forVoice(text: string, pronunciations: Record<string, string>): string {
  let out = cleanForSpeech(text);
  const words = Object.keys(pronunciations).sort((a, b) => b.length - a.length);
  for (const word of words) {
    out = out.split(word).join(pronunciations[word] ?? word);
  }
  return out;
}

/** Sentences, so a long answer is spoken in short natural pieces and can be stopped between them. */
export function sentences(text: string): string[] {
  return cleanForSpeech(text)
    .split(/\n+/)
    .flatMap((block) => block.split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
}

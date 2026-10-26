/**
 * Follow-up suggestions travel inside the assistant's text as a final marker:
 *
 *   ...answer text...
 *   [[הצעות: שאלה ראשונה | שאלה שנייה | קביעת ייעוץ]]
 *
 * The model writes it (see system.ts) and the keyword fallback appends it, so the
 * UI has one code path. `splitSuggestions` removes the marker from what the
 * visitor reads, also while it is still streaming in, and returns the chips.
 * Safe for client and server.
 */

const MARKER = /\[\[\s*הצעות\s*:\s*([^\]]*?)\s*\]\]\s*$/;
const MAX_OPTIONS = 3;
const MAX_LENGTH = 60;

export function splitSuggestions(text: string): { text: string; options: string[] } {
  const match = text.match(MARKER);
  if (match && match.index !== undefined) {
    const options = match[1]
      .split('|')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.length <= MAX_LENGTH)
      .slice(0, MAX_OPTIONS);
    return { text: text.slice(0, match.index).trimEnd(), options };
  }

  // A marker that has started but not finished streaming: hide it for now.
  const open = text.lastIndexOf('[[');
  if (open !== -1 && !text.slice(open).includes(']]')) {
    return { text: text.slice(0, open).trimEnd(), options: [] };
  }

  return { text, options: [] };
}

export function withSuggestions(text: string, options: string[]): string {
  return options.length > 0 ? `${text}\n[[הצעות: ${options.join(' | ')}]]` : text;
}

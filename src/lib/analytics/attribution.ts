import { SOURCE_LABELS } from './sources';

/** Coarse visit source and landing page, kept per tab so the office knows where an inquiry came from. */
export const ATTR_KEYS = { source: 'v_src', landing: 'v_land' } as const;

export function readAttribution(): { source: string; landing: string } {
  try {
    return {
      source: sessionStorage.getItem(ATTR_KEYS.source) ?? '',
      landing: sessionStorage.getItem(ATTR_KEYS.landing) ?? '',
    };
  } catch {
    return { source: '', landing: '' };
  }
}

/** Server side: a trustworthy one-line description from form fields, or ''. */
export function attributionLine(source: unknown, landing: unknown): string {
  const s = typeof source === 'string' && source in SOURCE_LABELS ? SOURCE_LABELS[source] : '';
  const l = typeof landing === 'string' && /^\/[\w\-/\u0590-\u05FF%]{0,100}$/.test(landing) ? landing : '';
  return [s ? `הגיע מ: ${s}` : '', l ? `עמוד נחיתה: ${l}` : ''].filter(Boolean).join(', ');
}

/** A source key we know, or undefined. */
export function knownSource(source: unknown): string | undefined {
  return typeof source === 'string' && source in SOURCE_LABELS ? source : undefined;
}

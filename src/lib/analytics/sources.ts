/** Pure helpers for cookieless visit statistics (shared by client and server). */

export const EVENTS = [
  'chat_open',
  'call_click',
  'whatsapp_click',
  'email_click',
  'lead',
  'booking_request',
] as const;
export type AnalyticsEvent = (typeof EVENTS)[number];

export const SOURCE_LABELS: Record<string, string> = {
  google: 'גוגל',
  bing: 'Bing',
  facebook: 'פייסבוק',
  instagram: 'אינסטגרם',
  youtube: 'יוטיוב',
  ai: 'כלי בינה מלאכותית',
  lawreviews: 'אתרי המלצות',
  direct: 'כניסה ישירה',
  other: 'אחר',
};

const AI_HOSTS = ['chatgpt.com', 'chat.openai.com', 'perplexity.ai', 'gemini.google.com', 'copilot.microsoft.com', 'claude.ai'];

function matches(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

/** Group a referrer into a coarse source. Only the host is ever looked at. */
export function classifySource(refHost: string, selfHost: string, utm = ''): keyof typeof SOURCE_LABELS {
  const h = refHost.toLowerCase().replace(/^www\./, '');
  const u = utm.toLowerCase();
  if (u === 'google' || u === 'bing' || u === 'facebook' || u === 'instagram' || u === 'youtube') return u;
  if (!h || matches(h, selfHost.replace(/^www\./, ''))) return 'direct';
  if (AI_HOSTS.some((d) => matches(h, d))) return 'ai';
  if (matches(h, 'google.com') || /(^|\.)google\.[a-z.]+$/.test(h)) return 'google';
  if (matches(h, 'bing.com')) return 'bing';
  if (matches(h, 'facebook.com') || matches(h, 'fb.com') || matches(h, 'l.facebook.com')) return 'facebook';
  if (matches(h, 'instagram.com')) return 'instagram';
  if (matches(h, 'youtube.com') || matches(h, 'youtu.be')) return 'youtube';
  if (matches(h, 'lawreviews.co.il') || matches(h, 'easy.co.il') || matches(h, 'b144.co.il')) return 'lawreviews';
  return 'other';
}

/** Path only: no query string, no hash; capped. */
export function cleanPath(p: string): string {
  const path = p.split(/[?#]/)[0] ?? '/';
  const out = path.startsWith('/') ? path : `/${path}`;
  return out.slice(0, 120) || '/';
}

import 'server-only';

/**
 * Best-effort in-memory sliding-window limiter. It protects the public chat
 * endpoint (LLM cost) and the lead action (WhatsApp spam). Serverless
 * instances do not share memory, so this slows abuse rather than stopping it;
 * add an edge or Redis limiter if traffic grows.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }

  hits.push(now);
  buckets.set(key, hits);

  // Keep the map from growing without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
    }
  }
  return true;
}

/** Best guess at the caller's IP behind Netlify / Vercel / generic proxies. */
export function clientIp(headers: Headers): string {
  return (
    headers.get('x-nf-client-connection-ip') ||
    headers.get('x-real-ip') ||
    // The first entry is whatever the caller sent; the last is the one the nearest proxy appended.
    headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ||
    'unknown'
  );
}

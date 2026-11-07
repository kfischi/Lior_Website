import { z } from 'zod';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { recordVisit } from '@/lib/analytics/store';
import { EVENTS, SOURCE_LABELS, classifySource, cleanPath } from '@/lib/analytics/sources';
import { brand } from '@/lib/brand';

export const dynamic = 'force-dynamic';

const Body = z.object({
  p: z.string().max(200).optional(),
  r: z.string().max(200).optional(),
  u: z.string().max(40).optional(),
  s: z.boolean().optional(),
  e: z.enum(EVENTS).optional(),
  a: z.string().max(20).optional(),
});

const BOT = /bot|crawl|spider|slurp|headless|preview|lighthouse|facebookexternalhit/i;

export async function POST(req: Request) {
  const ok = (src?: string) =>
    src ? Response.json({ s: src }) : new Response(null, { status: 204 });
  try {
    if (BOT.test(req.headers.get('user-agent') ?? '')) return ok();
    if (!rateLimit(`e:${clientIp(req.headers)}`, 120, 60_000)) return ok();
    const text = await req.text();
    if (text.length > 2048) return ok();
    const parsed = Body.safeParse(JSON.parse(text));
    if (!parsed.success) return ok();
    const { p, r, u, s, e, a } = parsed.data;
    let source: string | undefined;
    if (s) {
      let refHost = '';
      try {
        refHost = r ? new URL(r).hostname : '';
      } catch {
        /* ignore */
      }
      let self = '';
      try {
        self = new URL(process.env.SITE_URL || brand.website).hostname;
      } catch {
        /* ignore */
      }
      source = classifySource(refHost, self, u);
    }
    // `a` = the visit's source, sent with later events so actions can be counted per source.
    const attributed = source ?? (a && a in SOURCE_LABELS ? a : undefined);
    await recordVisit({ page: p ? cleanPath(p) : undefined, source, event: e, eventSource: e ? attributed : undefined });
    return ok(source);
  } catch {
    /* statistics must never break anything */
  }
  return ok();
}

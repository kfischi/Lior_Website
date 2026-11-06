import { z } from 'zod';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { recordVisit } from '@/lib/analytics/store';
import { EVENTS, classifySource, cleanPath } from '@/lib/analytics/sources';
import { getBrand } from '@/lib/sanity/content';

export const dynamic = 'force-dynamic';

const Body = z.object({
  p: z.string().max(200).optional(),
  r: z.string().max(200).optional(),
  u: z.string().max(40).optional(),
  s: z.boolean().optional(),
  e: z.enum(EVENTS).optional(),
});

const BOT = /bot|crawl|spider|slurp|headless|preview|lighthouse|facebookexternalhit/i;

export async function POST(req: Request) {
  const ok = () => new Response(null, { status: 204 });
  try {
    if (BOT.test(req.headers.get('user-agent') ?? '')) return ok();
    if (!rateLimit(`e:${clientIp(req.headers)}`, 120, 60_000)) return ok();
    const text = await req.text();
    if (text.length > 2048) return ok();
    const parsed = Body.safeParse(JSON.parse(text));
    if (!parsed.success) return ok();
    const { p, r, u, s, e } = parsed.data;
    let source: string | undefined;
    if (s) {
      let refHost = '';
      try {
        refHost = r ? new URL(r).hostname : '';
      } catch {
        /* ignore */
      }
      const brand = await getBrand();
      let self = '';
      try {
        self = new URL(brand.website).hostname;
      } catch {
        /* ignore */
      }
      source = classifySource(refHost, self, u);
    }
    await recordVisit({ page: p ? cleanPath(p) : undefined, source, event: e });
  } catch {
    /* statistics must never break anything */
  }
  return ok();
}

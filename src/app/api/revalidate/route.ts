import { revalidatePath, revalidateTag } from 'next/cache';
import { timingSafeEqual } from 'node:crypto';
import { SANITY_TAG } from '@/lib/sanity/content';

/**
 * Called by a Sanity webhook when a document is published, so edits show up at once
 * instead of within a minute. Optional: without SANITY_REVALIDATE_SECRET the endpoint
 * refuses every call and the site simply refreshes on its own schedule.
 *
 * Webhook setup (docs/cms.md): POST to /api/revalidate with the header
 * `x-revalidate-secret: <the same secret>`.
 */
export const dynamic = 'force-dynamic';

function sameSecret(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  const given = request.headers.get('x-revalidate-secret') ?? '';
  if (!expected || !sameSecret(given, expected)) {
    return Response.json({ ok: false }, { status: 401 });
  }
  revalidateTag(SANITY_TAG, 'max');
  for (const path of ['/', '/faq', '/articles']) revalidatePath(path);
  return Response.json({ ok: true, revalidated: true });
}

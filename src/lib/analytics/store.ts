import 'server-only';
import { readRaw, writeRaw } from '@/lib/learning/store';
import type { AnalyticsEvent } from './sources';

/**
 * Aggregated, anonymous daily counters. No IPs, no cookies, no per-visitor rows.
 */
export interface VisitDay {
  date: string;
  sessions: number;
  pageviews: number;
  sources: Record<string, number>;
  pages: Record<string, number>;
  events: Record<string, number>;
}

const MAX_KEYS = 80;
const key = (d: string) => `visits-${d}`;

export function today(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date());
}

function empty(date: string): VisitDay {
  return { date, sessions: 0, pageviews: 0, sources: {}, pages: {}, events: {} };
}

function bump(map: Record<string, number>, k: string) {
  if (k in map || Object.keys(map).length < MAX_KEYS) map[k] = (map[k] ?? 0) + 1;
}

async function load(date: string): Promise<VisitDay> {
  const raw = await readRaw(key(date));
  if (!raw) return empty(date);
  try {
    const v = JSON.parse(raw) as Partial<VisitDay>;
    return { ...empty(date), ...v, date };
  } catch {
    return empty(date);
  }
}

export async function recordVisit(input: { page?: string; source?: string; event?: AnalyticsEvent }): Promise<void> {
  const d = await load(today());
  if (input.source) {
    d.sessions += 1;
    bump(d.sources, input.source);
  }
  if (input.page) {
    d.pageviews += 1;
    bump(d.pages, input.page);
  }
  if (input.event) bump(d.events, input.event);
  await writeRaw(key(d.date), JSON.stringify(d));
}

export async function getVisits(days: number): Promise<VisitDay[]> {
  const out: Promise<VisitDay>[] = [];
  const now = Date.now();
  for (let i = 0; i < days; i++) {
    const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date(now - i * 864e5));
    out.push(load(date));
  }
  return Promise.all(out);
}

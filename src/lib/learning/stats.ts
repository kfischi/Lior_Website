import 'server-only';
import { tokens } from '@/lib/ai/local/text';
import { readRaw, writeRaw } from './store';

/**
 * Privacy-safe usage numbers for the attorney's dashboard: how many conversations, on which topic, how
 * many went unanswered, how many were marked unhelpful, how many left their details. Only counts and a
 * topic LABEL are kept: never the question, never a name or a number. Daily buckets, so old data is
 * simply not read any more. Counts are approximate (two writes at the same moment can drop one).
 */

export interface DayStats {
  total: number;
  unanswered: number;
  down: number;
  leads: number;
  urgentLeads: number;
  topics: Record<string, number>;
}

const EMPTY: DayStats = { total: 0, unanswered: 0, down: 0, leads: 0, urgentLeads: 0, topics: {} };

/** Which topic a question is about, from the concepts the local engine already recognises. */
const TOPICS: [concept: string, label: string][] = [
  ['#חקירה', 'חקירה ומעצר'],
  ['#פלילי', 'משפט פלילי'],
  ['#הטרדה', 'הטרדה מינית'],
  ['#פיטורים', 'פיטורים ושימוע'],
  ['#התעמרות', 'התעמרות בעבודה'],
  ['#אפליה', 'אפליה בעבודה'],
  ['#הריון', 'הריון ולידה'],
  ['#משכורת', 'שכר ופיצויים'],
  ['#רפואית', 'רשלנות רפואית'],
  ['#ירושה', 'ירושה וצוואות'],
  ['#נזיקין', 'נזיקין ולשון הרע'],
  ['#עלות', 'עלויות'],
  ['#פגישה', 'קביעת פגישה'],
  ['#טלפון', 'יצירת קשר'],
  ['#כתובת', 'יצירת קשר'],
  ['#גירושין', 'מחוץ לתחומי העיסוק'],
  ['#אחר', 'מחוץ לתחומי העיסוק'],
];

export function topicOf(question: string): string {
  const present = new Set(tokens(question));
  return TOPICS.find(([concept]) => present.has(concept))?.[1] ?? 'שאלות אחרות';
}

const dayKey = (date: Date) => `stats-${date.toISOString().slice(0, 10)}`;

async function readDay(key: string): Promise<DayStats> {
  try {
    const raw = await readRaw(key);
    if (!raw) return { ...EMPTY, topics: {} };
    const v: unknown = JSON.parse(raw);
    if (typeof v !== 'object' || v === null) return { ...EMPTY, topics: {} };
    const o = v as Partial<DayStats>;
    return {
      total: Number(o.total) || 0,
      unanswered: Number(o.unanswered) || 0,
      down: Number(o.down) || 0,
      leads: Number(o.leads) || 0,
      urgentLeads: Number(o.urgentLeads) || 0,
      topics: typeof o.topics === 'object' && o.topics !== null ? { ...o.topics } : {},
    };
  } catch {
    return { ...EMPTY, topics: {} };
  }
}

async function bump(change: (day: DayStats) => void): Promise<void> {
  try {
    const key = dayKey(new Date());
    const day = await readDay(key);
    change(day);
    await writeRaw(key, JSON.stringify(day));
  } catch (err) {
    console.error('Recording usage failed (non-fatal):', err);
  }
}

export async function recordChat(question: string, answered: boolean): Promise<void> {
  const topic = topicOf(question);
  await bump((d) => {
    d.total += 1;
    if (!answered) d.unanswered += 1;
    d.topics[topic] = (d.topics[topic] ?? 0) + 1;
  });
}

export async function recordDown(): Promise<void> {
  await bump((d) => {
    d.down += 1;
  });
}

export async function recordLead(urgent: boolean): Promise<void> {
  await bump((d) => {
    d.leads += 1;
    if (urgent) d.urgentLeads += 1;
  });
}

export interface Stats extends DayStats {
  days: number;
  perDay: { date: string; total: number }[];
}

/** The last `days` days added up, plus the per-day totals for a small chart. */
export async function getStats(days = 30): Promise<Stats> {
  const dates = Array.from({ length: days }, (_, i) => new Date(Date.now() - (days - 1 - i) * 86_400_000));
  const buckets = await Promise.all(dates.map((d) => readDay(dayKey(d))));
  const sum: Stats = { ...EMPTY, topics: {}, days, perDay: [] };
  buckets.forEach((b, i) => {
    sum.total += b.total;
    sum.unanswered += b.unanswered;
    sum.down += b.down;
    sum.leads += b.leads;
    sum.urgentLeads += b.urgentLeads;
    for (const [topic, n] of Object.entries(b.topics)) sum.topics[topic] = (sum.topics[topic] ?? 0) + n;
    sum.perDay.push({ date: dates[i].toISOString().slice(0, 10), total: b.total });
  });
  return sum;
}

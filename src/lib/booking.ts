import { z } from 'zod';
import { brand } from '@/lib/brand';
import { PHONE_PATTERN } from '@/lib/phone';

/** Shared (client + server) appointment-request helpers. */

export const BookingSchema = z.object({
  name: z.string().trim().min(2, 'נא להזין שם מלא').max(60, 'השם ארוך מדי'),
  phone: z.string().trim().regex(PHONE_PATTERN, 'נא להזין מספר טלפון תקין'),
  matter: z.string().trim().max(80).default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'נא לבחור תאריך'),
  window: z.string().max(20),
  meeting: z.string().max(20),
  note: z.string().trim().max(300).default(''),
});
export type Booking = z.infer<typeof BookingSchema>;

const fmt = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(d);

/** Selectable days (Asia/Jerusalem), from tomorrow, on allowed weekdays. */
export function bookableDays(now = new Date()): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  for (let i = 1; i <= brand.booking.horizonDays; i++) {
    const d = new Date(now.getTime() + i * 864e5);
    const value = fmt(d);
    const wd = new Date(`${value}T12:00:00Z`).getUTCDay();
    if (!(brand.booking.weekdays as readonly number[]).includes(wd)) continue;
    const label = new Intl.DateTimeFormat('he-IL', {
      timeZone: 'Asia/Jerusalem',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(d);
    out.push({ value, label });
  }
  return out;
}

export function buildBookingDetails(b: Booking, dayLabel: string): string {
  const win = brand.booking.windows.find((w) => w.id === b.window)?.label ?? b.window;
  const meet = brand.booking.meetings.find((m) => m.id === b.meeting)?.label ?? b.meeting;
  return [`בקשת פגישה: ${dayLabel}, ${win}`, `אופן הפגישה: ${meet}`, b.note ? `הערה: ${b.note}` : '']
    .filter(Boolean)
    .join('. ');
}

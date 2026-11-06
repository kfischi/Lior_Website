'use server';

import { headers } from 'next/headers';
import { BookingSchema, bookableDays, buildBookingDetails } from '@/lib/booking';
import { buildLeadMessage, buildWhatsAppHref } from '@/lib/lead';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { getBrand } from '@/lib/sanity/content';
import { isMetaWhatsAppConfigured, sendLeadViaMeta } from '@/lib/whatsapp';
import { recordVisit } from '@/lib/analytics/store';

export interface BookingState {
  status: 'idle' | 'sent' | 'handoff' | 'error';
  message?: string;
  errors?: Partial<Record<'name' | 'phone' | 'date', string>>;
  waHref?: string;
}

/**
 * Appointment REQUEST. It is not a confirmed slot: the office confirms by phone.
 * The request is forwarded to the office's WhatsApp and is not stored on the server.
 */
export async function requestAppointment(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const brand = await getBrand();
  const ip = clientIp(await headers());
  if (!rateLimit(`book:${ip}`, 4, 60 * 60 * 1000)) {
    return { status: 'error', message: `נשלחו הרבה בקשות ממכשיר זה. אפשר להתקשר ישירות: ${brand.phone}` };
  }

  const parsed = BookingSchema.safeParse({
    name: formData.get('name') ?? '',
    phone: formData.get('phone') ?? '',
    matter: formData.get('matter') ?? '',
    date: formData.get('date') ?? '',
    window: formData.get('window') ?? '',
    meeting: formData.get('meeting') ?? '',
    note: formData.get('note') ?? '',
  });
  if (!parsed.success) {
    const f = parsed.error.flatten().fieldErrors;
    return { status: 'error', message: 'נא לבדוק את הפרטים שהוזנו.', errors: { name: f.name?.[0], phone: f.phone?.[0], date: f.date?.[0] } };
  }

  const b = parsed.data;
  const day = bookableDays().find((d) => d.value === b.date);
  if (!day || !brand.booking.windows.some((w) => w.id === b.window) || !brand.booking.meetings.some((m) => m.id === b.meeting)) {
    return { status: 'error', message: 'נא לבחור תאריך, שעות ואופן פגישה מהאפשרויות המוצעות.', errors: { date: 'נא לבחור תאריך' } };
  }

  const lead = { name: b.name, phone: b.phone, matter: b.matter, message: buildBookingDetails(b, day.label) };
  const waHref = buildWhatsAppHref(buildLeadMessage(lead));
  void recordVisit({ event: 'booking_request' }).catch(() => undefined);

  if (isMetaWhatsAppConfigured()) {
    const r = await sendLeadViaMeta(lead);
    if (r.ok) return { status: 'sent', waHref };
  }
  return { status: 'handoff', waHref };
}

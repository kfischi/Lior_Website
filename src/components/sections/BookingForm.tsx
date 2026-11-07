'use client';

import * as React from 'react';
import Link from 'next/link';
import { CalendarCheck, MessageCircle } from 'lucide-react';
import { requestAppointment, type BookingState } from '@/lib/actions/booking';
import { bookableDays } from '@/lib/booking';
import { AttributionFields } from '@/components/analytics/AttributionFields';
import { NextSteps } from './NextSteps';
import { Button } from '@/components/ui/button';

const INITIAL: BookingState = { status: 'idle' };

const field =
  'min-h-12 w-full rounded-xl border border-cream/25 bg-cream/10 px-4 text-base text-cream placeholder:text-cream/60 focus-visible:border-accent-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light';

export interface BookingFormProps {
  windows: readonly { id: string; label: string }[];
  meetings: readonly { id: string; label: string }[];
  matters: string[];
}

function Chips({ name, legend, options }: { name: string; legend: string; options: readonly { id: string; label: string }[] }) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-1.5 text-sm font-medium text-cream/90">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o.id} className="cursor-pointer">
            <input type="radio" name={name} value={o.id} defaultChecked={i === 0} className="peer sr-only" />
            <span className="inline-flex min-h-11 items-center rounded-full border border-cream/30 px-4 text-sm text-cream peer-checked:border-accent-light peer-checked:bg-accent-light peer-checked:text-navy peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-light">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Appointment REQUEST form: the office confirms the time by phone. Nothing here is a confirmed slot. */
export function BookingForm({ windows, meetings, matters }: BookingFormProps) {
  // Computed in the browser so a cached page never offers past days; the server re-checks on submit.
  const isClient = React.useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const days = React.useMemo(() => (isClient ? bookableDays() : []), [isClient]);
  const uid = React.useId();
  const [state, action, pending] = React.useActionState(requestAppointment, INITIAL);

  if (state.status === 'sent') {
    return (
      <div role="status" className="rounded-2xl border border-accent-light/50 bg-cream/10 p-6 text-cream">
        <p className="text-center text-lg">הבקשה התקבלה במשרד. המועד אינו סגור עד שנאשר אותו מולכם.</p>
        <NextSteps />
      </div>
    );
  }
  if (state.status === 'handoff') {
    return (
      <div role="status" className="rounded-2xl border border-accent-light/50 bg-cream/10 p-6 text-center text-cream">
        <p className="text-lg">הבקשה מוכנה. כדי שתגיע למשרד, לחצו לשליחה בוואטסאפ.</p>
        <Button asChild size="lg" variant="accentOnDark" className="mt-5">
          <a href={state.waHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            שליחה בוואטסאפ
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="grid gap-4 sm:grid-cols-2" aria-describedby={`${uid}-hint`}>
      <AttributionFields />
      <div>
        <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-medium text-cream/90">שם מלא</label>
        <input id={`${uid}-name`} name="name" autoComplete="name" required maxLength={60} aria-invalid={Boolean(state.errors?.name)} className={field} />
        {state.errors?.name && <p role="alert" className="mt-1.5 text-sm text-amber-200">{state.errors.name}</p>}
      </div>
      <div>
        <label htmlFor={`${uid}-phone`} className="mb-1.5 block text-sm font-medium text-cream/90">טלפון</label>
        <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required aria-invalid={Boolean(state.errors?.phone)} className={`${field} text-end`} />
        {state.errors?.phone && <p role="alert" className="mt-1.5 text-sm text-amber-200">{state.errors.phone}</p>}
      </div>
      <div>
        <label htmlFor={`${uid}-matter`} className="mb-1.5 block text-sm font-medium text-cream/90">תחום</label>
        <select id={`${uid}-matter`} name="matter" className={field} defaultValue="">
          <option value="" className="text-navy">לא בטוח/ה</option>
          {matters.map((m) => (
            <option key={m} value={m} className="text-navy">{m}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${uid}-date`} className="mb-1.5 block text-sm font-medium text-cream/90">יום מועדף</label>
        <select key={days[0]?.value ?? 'none'} id={`${uid}-date`} name="date" required className={field} aria-invalid={Boolean(state.errors?.date)}>
          {days.map((d) => (
            <option key={d.value} value={d.value} className="text-navy">{d.label}</option>
          ))}
        </select>
        {state.errors?.date && <p role="alert" className="mt-1.5 text-sm text-amber-200">{state.errors.date}</p>}
      </div>
      <Chips name="window" legend="שעות נוחות" options={windows} />
      <Chips name="meeting" legend="אופן הפגישה" options={meetings} />
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-note`} className="mb-1.5 block text-sm font-medium text-cream/90">הערה קצרה (לא חובה)</label>
        <textarea id={`${uid}-note`} name="note" rows={2} maxLength={300} className={`${field} py-3`} />
        <p className="mt-1 text-xs text-cream/70">נא לא לפרט כאן את האירוע. את הפרטים נמסור בשיחה ישירה.</p>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" variant="accentOnDark" disabled={pending} className="w-full sm:w-auto">
          <CalendarCheck className="h-5 w-5" aria-hidden="true" />
          {pending ? 'שולחים…' : 'בקשת פגישת ייעוץ'}
        </Button>
        {state.status === 'error' && !state.errors && <p role="alert" className="mt-3 text-sm text-amber-200">{state.message}</p>}
        <p id={`${uid}-hint`} className="mt-3 text-sm text-cream/75">
          זו בקשה ולא קביעה סופית: המשרד יחזור אליכם לאישור המועד. ראו{' '}
          <Link href="/legal/privacy" className="underline underline-offset-2">מדיניות הפרטיות</Link>.
        </p>
      </div>
    </form>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';
import { submitLead, type LeadState } from '@/lib/actions/lead';
import { Button } from '@/components/ui/button';

const INITIAL: LeadState = { status: 'idle' };

const field =
  'min-h-12 w-full rounded-xl border border-cream/25 bg-cream/10 px-4 text-base text-cream placeholder:text-cream/60 focus-visible:border-accent-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light';

/**
 * "Leave a number and we call back": the shortest way to start, for visitors who do not want to chat.
 * It uses the same Server Action as the chat's intake (validation, rate limit, delivery to the office),
 * and says honestly whether the details reached the office or must be sent through WhatsApp.
 */
export function CallbackForm() {
  const [state, action, pending] = React.useActionState(submitLead, INITIAL);

  if (state.status === 'sent') {
    return (
      <p role="status" className="rounded-2xl border border-accent-light/50 bg-cream/10 p-6 text-center text-lg text-cream">
        תודה, הפרטים הגיעו למשרד. נחזור אליכם בהקדם.
      </p>
    );
  }

  if (state.status === 'handoff') {
    return (
      <div role="status" className="rounded-2xl border border-accent-light/50 bg-cream/10 p-6 text-center text-cream">
        <p className="text-lg">הפרטים מוכנים. כדי שיגיעו למשרד, לחצו לשליחה בוואטסאפ.</p>
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
    <form action={action} noValidate className="grid gap-4 sm:grid-cols-2" aria-describedby="callback-note">
      <div>
        <label htmlFor="cb-name" className="mb-1.5 block text-sm font-medium text-cream/90">
          שם מלא
        </label>
        <input
          id="cb-name"
          name="name"
          autoComplete="name"
          required
          maxLength={60}
          aria-invalid={Boolean(state.errors?.name)}
          aria-describedby={state.errors?.name ? 'cb-name-error' : undefined}
          className={field}
        />
        {state.errors?.name && (
          <p id="cb-name-error" role="alert" className="mt-1.5 text-sm text-amber-200">
            {state.errors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="cb-phone" className="mb-1.5 block text-sm font-medium text-cream/90">
          טלפון
        </label>
        <input
          id="cb-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          required
          aria-invalid={Boolean(state.errors?.phone)}
          aria-describedby={state.errors?.phone ? 'cb-phone-error' : undefined}
          className={`${field} text-end`}
        />
        {state.errors?.phone && (
          <p id="cb-phone-error" role="alert" className="mt-1.5 text-sm text-amber-200">
            {state.errors.phone}
          </p>
        )}
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" variant="accentOnDark" disabled={pending} className="w-full sm:w-auto">
          <Phone className="h-5 w-5" aria-hidden="true" />
          {pending ? 'שולחים…' : 'השאירו טלפון ונחזור אליכם'}
        </Button>
        {state.status === 'error' && !state.errors && (
          <p role="alert" className="mt-3 text-sm text-amber-200">
            {state.message}
          </p>
        )}
        <p id="callback-note" className="mt-3 text-sm text-cream/75">
          בפנייה הראשונה אין צורך לפרט את האירוע. הפרטים משמשים רק ליצירת קשר, ראו{' '}
          <Link href="/legal/privacy" className="underline underline-offset-2">
            מדיניות הפרטיות
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

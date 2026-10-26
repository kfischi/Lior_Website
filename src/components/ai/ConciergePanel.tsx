'use client';

import * as React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { MessageCircle, Phone, Send, Shield, Square, X } from 'lucide-react';
import type { UIMessage } from 'ai';
import { brand, telHref, whatsappHref } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { splitSuggestions } from '@/lib/ai/suggestions';
import { INTAKE_STEPS, useConcierge, type IntakeStep } from './ConciergeProvider';

const PLACEHOLDER: Record<IntakeStep, string> = {
  name: 'השם שלך',
  topic: 'או כתבו תחום במילים שלכם',
  urgency: 'בחרו אחת מהאפשרויות',
  phone: '050-0000000',
  note: 'משפט אחד על העניין (לא חובה)',
  confirm: 'לחצו על אחת האפשרויות',
};

/** The assistant's round photo. It is a brand image, so it carries no alt text. */
export function Avatar({ className }: { className?: string }) {
  return (
    <Image
      src={brand.chat.avatar}
      alt=""
      width={96}
      height={96}
      className={cn('shrink-0 rounded-full object-cover ring-2 ring-accent-light/70', className)}
    />
  );
}

function Chip({
  children,
  onClick,
  tone = 'light',
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: 'light' | 'solid';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        tone === 'solid'
          ? 'border-accent bg-accent text-cream hover:bg-accent/90'
          : 'border-navy/20 bg-cream text-navy hover:border-accent hover:text-accent',
      )}
    >
      {children}
    </button>
  );
}

function ActionLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-accent/90"
    >
      {children}
    </a>
  );
}

function Bubble({ message, isLast }: { message: UIMessage; isLast: boolean }) {
  const { extras, choose, startIntake, busy } = useConcierge();
  const ex = extras[message.id];
  const isUser = message.role === 'user';

  // Follow-up suggestions arrive as a marker at the end of the assistant's text.
  const suggestions = isUser
    ? []
    : message.parts
        .flatMap((part) => (part.type === 'text' ? splitSuggestions(part.text).options : []))
        .slice(0, 3);

  const content = message.parts.map((part, i) => {
    if (part.type === 'text') {
      if (isUser) return <span key={i}>{part.text}</span>;
      const { text } = splitSuggestions(part.text);
      return text ? <span key={i}>{text}</span> : null;
    }

    if (part.type === 'tool-getContactOptions' && 'output' in part && part.output) {
      const o = part.output as { phone: string; telHref: string; whatsapp: string };
      return (
        <span key={i} className="mt-2 block space-y-1 rounded-lg bg-cream p-3 text-sm">
          <a href={o.telHref} className="flex items-center gap-2 text-navy hover:text-accent">
            <Phone className="h-4 w-4 text-accent" aria-hidden="true" /> {o.phone}
          </a>
          <a
            href={o.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-navy hover:text-accent"
          >
            <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" /> וואטסאפ
          </a>
        </span>
      );
    }

    if (part.type === 'tool-whatsappHandoff' && 'output' in part && part.output) {
      return (
        <ActionLink key={i} href={(part.output as { href: string }).href} external>
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          שליחת ההודעה למשרד בוואטסאפ
        </ActionLink>
      );
    }

    if (part.type === 'tool-startIntake' && 'output' in part && part.output) {
      return (
        <button
          key={i}
          type="button"
          onClick={startIntake}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-accent/90"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          להשארת פרטים לקביעת ייעוץ
        </button>
      );
    }
    return null;
  });

  const hasContent = content.some((c) => c !== null);
  const chips = [
    ...(ex?.chips ?? []),
    ...suggestions.map((label) => ({ label, value: label })),
  ];

  return (
    <div className={cn('flex items-start gap-2', isUser && 'justify-end')}>
      {!isUser && <Avatar className="h-8 w-8" />}
      <div className={cn('flex min-w-0 max-w-[88%] flex-col', isUser ? 'items-end' : 'items-start')}>
        {hasContent && (
          <div
            className={cn(
              'whitespace-pre-line rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-relaxed',
              isUser
                ? 'rounded-ee-sm bg-navy text-cream'
                : 'rounded-es-sm bg-navy/[0.06] text-ink',
            )}
          >
            {content}
          </div>
        )}

        {ex?.whatsapp && (
          <div className="w-full">
            <ActionLink href={ex.whatsapp} external>
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              המשך בוואטסאפ
            </ActionLink>
          </div>
        )}
        {ex?.call && (
          <div className="w-full">
            <ActionLink href={telHref}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              התקשרו עכשיו: {brand.phone}
            </ActionLink>
          </div>
        )}
        {isLast && !busy && chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip key={c.value} onClick={() => choose(c)}>
                {c.label}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex items-end gap-2" role="status" aria-label="העוזר מקליד">
      <Avatar className="mb-0.5 h-8 w-8" />
      <div className="flex w-fit items-center gap-1 rounded-2xl rounded-es-sm bg-navy/[0.06] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-navy/50"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * The conversation UI, shared by the floating window and the inline section.
 * All state lives in <ConciergeProvider>, so both views show the same thread.
 */
export function ConciergePanel({
  className,
  onClose,
  autoFocus = false,
}: {
  className?: string;
  /** When set, shows a close button (floating window). */
  onClose?: () => void;
  autoFocus?: boolean;
}) {
  const {
    messages,
    status,
    error,
    busy,
    intakeStep,
    send,
    choose,
    startIntake,
    cancelIntake,
    stop,
  } = useConcierge();
  const [input, setInput] = React.useState('');
  const pathname = usePathname();
  const area = brand.practiceAreas.find((a) => pathname === `/practice-areas/${a.slug}`);
  // On a practice-area page, offer that page's own questions first.
  const starters = area ? area.page.faq.map((f) => f.question) : brand.chat.suggestedPrompts;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus, intakeStep]);

  const stepIndex = intakeStep ? INTAKE_STEPS.indexOf(intakeStep) : -1;
  const firstOnly = messages.length === 1 && !intakeStep;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || busy) return;
    send(input);
    setInput('');
  }

  return (
    <section
      aria-label="שיחה עם העוזר הדיגיטלי של המשרד"
      className={cn('flex flex-col overflow-hidden bg-cream', className)}
    >
      <header className="bg-navy text-cream">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Avatar className="h-11 w-11" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="font-heading text-base font-semibold">{brand.chat.assistantName}</p>
            <p className="truncate text-xs text-cream/70">עוזר דיגיטלי מבוסס בינה מלאכותית</p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="סגירת השיחה"
              className="rounded-full p-1.5 text-cream/80 hover:bg-cream/10 hover:text-cream"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        {intakeStep && (
          <div
            className="h-1 bg-cream/15"
            role="progressbar"
            aria-label="התקדמות בקליטה"
            aria-valuemin={1}
            aria-valuemax={INTAKE_STEPS.length}
            aria-valuenow={stepIndex + 1}
          >
            <div
              className="h-full bg-accent-light transition-[width] duration-500"
              style={{ width: `${((stepIndex + 1) / INTAKE_STEPS.length) * 100}%` }}
            />
          </div>
        )}
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {messages.map((m, i) => (
          <Bubble key={m.id} message={m} isLast={i === messages.length - 1} />
        ))}
        {status === 'submitted' && <Typing />}
        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-800">
            מצטערים, אירעה תקלה. אפשר להתקשר{' '}
            <a href={telHref} className="font-semibold underline">
              {brand.phone}
            </a>{' '}
            או לכתוב{' '}
            <a
              href={whatsappHref}
              className="font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              בוואטסאפ
            </a>
            .
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-navy/10 px-4 pb-1 pt-3">
        {intakeStep ? (
          <Chip onClick={cancelIntake}>ביטול</Chip>
        ) : (
          <>
            <Chip tone="solid" onClick={startIntake}>
              קביעת ייעוץ
            </Chip>
            {firstOnly &&
              starters.map((p) => (
                <Chip key={p} onClick={() => choose({ label: p, value: p })}>
                  {p}
                </Chip>
              ))}
          </>
        )}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 px-4 pb-2 pt-2">
        <label htmlFor={`concierge-input-${autoFocus ? 'float' : 'inline'}`} className="sr-only">
          הקלדת הודעה
        </label>
        <input
          ref={inputRef}
          id={`concierge-input-${autoFocus ? 'float' : 'inline'}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={intakeStep ? PLACEHOLDER[intakeStep] : 'כתבו הודעה...'}
          type={intakeStep === 'phone' ? 'tel' : 'text'}
          inputMode={intakeStep === 'phone' ? 'tel' : 'text'}
          autoComplete={intakeStep === 'name' ? 'name' : intakeStep === 'phone' ? 'tel' : 'off'}
          maxLength={500}
          className="min-w-0 flex-1 rounded-full border border-navy/20 bg-background px-4 py-2.5 text-[0.9375rem] focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        />
        {busy && status !== 'ready' ? (
          <button
            type="button"
            onClick={stop}
            aria-label="עצירה"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy"
          >
            <Square className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            aria-label="שליחה"
            disabled={!input.trim() || busy}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-cream transition-opacity disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </form>

      <p className="flex items-center justify-center gap-1.5 px-4 pb-3 text-center text-[11px] text-ink/55">
        <Shield className="h-3 w-3 shrink-0" aria-hidden="true" />
        {brand.chat.disclaimer} הפרטים נשלחים רק באישורך.
      </p>
    </section>
  );
}

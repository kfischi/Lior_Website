'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { MessageCircle, Mic, Phone, Play, RotateCcw, Send, Shield, Square, ThumbsDown, ThumbsUp, Volume2, VolumeX, X } from 'lucide-react';
import type { UIMessage } from 'ai';
import { brand, telHref, whatsappHref } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { splitSuggestions } from '@/lib/ai/suggestions';
import { INTAKE_STEPS, useConcierge, type IntakeStep } from './ConciergeProvider';
import { INTRO_START_DELAY_MS, IntroStage } from './IntroStage';
import { useSpeechInput, useSpeechOutput } from './useVoice';

const INTRO_SEEN_KEY = 'concierge-intro-seen-v1';

/** The welcome video plays once per browser tab, and only in the floating window. */
function introWanted(enabled: boolean): boolean {
  if (!enabled || !brand.chat.intro.src || typeof window === 'undefined') return false;
  try {
    return !sessionStorage.getItem(INTRO_SEEN_KEY);
  } catch {
    return true;
  }
}

const PLACEHOLDER: Record<IntakeStep, string> = {
  name: 'השם שלך',
  topic: 'או כתבו תחום במילים שלכם',
  urgency: 'בחרו אחת מהאפשרויות',
  phone: '050-0000000',
  note: 'משפט אחד על העניין (לא חובה)',
  confirm: 'לחצו על אחת האפשרויות',
};

/** The assistant's round photo. It is a brand image, so it carries no alt text. */
export function Avatar({ className, speaking }: { className?: string; speaking?: boolean }) {
  return (
    <Image
      src={brand.chat.avatar}
      alt=""
      width={96}
      height={96}
      className={cn(
        'shrink-0 rounded-full object-cover ring-2 ring-accent-light/70',
        speaking && 'motion-safe:animate-speaking',
        className,
      )}
    />
  );
}

const WAVE_DELAYS = [
  '[animation-delay:0s]',
  '[animation-delay:0.2s]',
  '[animation-delay:0.1s]',
  '[animation-delay:0.3s]',
  '[animation-delay:0.15s]',
];

/** Sound bars beside the name while the answer is read aloud (decoration; the status text says it). */
function VoiceWave() {
  return (
    <span aria-hidden="true" className="flex h-4 items-center gap-0.5">
      {WAVE_DELAYS.map((delay) => (
        <span
          key={delay}
          className={cn(
            'h-full w-0.5 origin-center rounded-full bg-accent-light motion-safe:animate-wave',
            delay,
          )}
        />
      ))}
    </span>
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

const SITE_PATH = /(\/(?:articles|practice-areas)\/[a-z0-9-]+|\/faq)/g;

function pathLabel(path: string): string {
  if (path.startsWith('/articles/')) return 'המדריך באתר';
  if (path.startsWith('/practice-areas/')) return 'עמוד התחום';
  return 'שאלות ותשובות';
}

/** Turns site paths in an answer into links, closing the chat so the page is visible. */
function WithLinks({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const parts = text.split(SITE_PATH);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Link
            key={i}
            href={part}
            onClick={onNavigate}
            className="font-semibold text-accent underline underline-offset-2"
          >
            {pathLabel(part)}
          </Link>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Bubble({
  message,
  isLast,
  question,
  showFeedback = false,
}: {
  message: UIMessage;
  isLast: boolean;
  /** The visitor's question this message answers, for the "did it help" buttons. */
  question?: string;
  showFeedback?: boolean;
}) {
  const { extras, choose, startIntake, busy, closePanel } = useConcierge();
  const [vote, setVote] = React.useState<'up' | 'down' | null>(null);
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
      return text ? (
        <span key={i}>
          <WithLinks text={text} onNavigate={closePanel} />
        </span>
      ) : null;
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

        {showFeedback && question && hasContent && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/75">
            {vote ? (
              <span role="status">
                {vote === 'down' ? 'תודה, ליאור תראה את השאלה ותלמד אותי.' : 'שמחה שעזרתי.'}
              </span>
            ) : (
              <>
                <span>עזר לכם?</span>
                <button
                  type="button"
                  aria-label="התשובה עזרה"
                  onClick={() => setVote('up')}
                  className="rounded-full p-1.5 hover:bg-navy/10"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="התשובה לא עזרה"
                  onClick={() => {
                    setVote('down');
                    void fetch('/api/chat/feedback', {
                      method: 'POST',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify({ question }),
                    }).catch(() => undefined);
                  }}
                  className="rounded-full p-1.5 hover:bg-navy/10"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </>
            )}
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

/** A short, readable reason for a failed request (the server sends {"error": "..."}). */
function errorDetail(error: Error): string {
  try {
    const parsed: unknown = JSON.parse(error.message);
    if (typeof parsed === 'object' && parsed !== null && 'error' in parsed && typeof parsed.error === 'string') {
      return parsed.error.slice(0, 120);
    }
  } catch {
    /* not JSON */
  }
  return error.message.slice(0, 120);
}

function Typing() {
  return (
    <div className="flex items-end gap-2" role="status" aria-label="העוזרת מקלידה">
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
    reset,
    stop,
  } = useConcierge();
  const [input, setInput] = React.useState('');
  const [confirmReset, setConfirmReset] = React.useState(false);
  const pathname = usePathname();
  const area = brand.practiceAreas.find((a) => pathname === `/practice-areas/${a.slug}`);
  // On a practice-area page, offer that page's own questions first.
  const starters = area ? area.page.faq.map((f) => f.question) : brand.chat.suggestedPrompts;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasIntro = Boolean(brand.chat.intro.src);
  const [intro, setIntro] = React.useState(() => introWanted(autoFocus));
  const [introDelay, setIntroDelay] = React.useState(INTRO_START_DELAY_MS);

  const replayRef = React.useRef<HTMLButtonElement>(null);

  // Counts as seen as soon as it opens, so closing the chat mid-video does not replay it with sound.
  React.useEffect(() => {
    if (!intro) return;
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      // Private mode: the video may play again next time.
    }
  }, [intro]);

  function closeIntro(reason: 'ended' | 'skipped') {
    // Focus is lost when the video unmounts; put it back only if it was in the video (or nowhere).
    const active = document.activeElement;
    const focusWasInIntro =
      !active || active === document.body || Boolean(active.closest('[data-intro-stage]'));
    setIntro(false);
    if (!focusWasInIntro) return;
    window.requestAnimationFrame(() => (reason === 'skipped' ? replayRef.current : inputRef.current)?.focus());
  }

  // Voice: dictate a message, and optionally hear the answers read aloud.
  const [readAloud, setReadAloud] = React.useState(false);
  const spokenId = React.useRef<string | null>(null);
  const {
    supported: canSpeak,
    speaking,
    speak,
    cancel: cancelSpeech,
    unlock: unlockSpeech,
  } = useSpeechOutput();
  const voice = useSpeechInput({
    onText: setInput,
    onDone: (text) => {
      // In free chat a spoken question is sent right away; in the intake the
      // person checks the text first, because names and numbers are easy to mishear.
      if (intakeStep) return;
      send(text);
      setInput('');
    },
  });

  React.useEffect(() => {
    if (!readAloud || status !== 'ready') return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant' || spokenId.current === last.id) return;
    spokenId.current = last.id;
    const text = last.parts
      .map((p) => (p.type === 'text' ? splitSuggestions(p.text).text : ''))
      .join(' ');
    speak(text);
  }, [readAloud, status, messages, speak]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus, intakeStep]);

  const stepIndex = intakeStep ? INTAKE_STEPS.indexOf(intakeStep) : -1;
  const firstOnly = messages.length === 1 && !intakeStep;

  function resetChat() {
    voice.stop();
    cancelSpeech();
    spokenId.current = null;
    setInput('');
    setConfirmReset(false);
    reset();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || busy) return;
    send(input);
    setInput('');
  }

  return (
    <section
      aria-label="שיחה עם העוזרת של ליאור"
      className={cn('relative flex flex-col overflow-hidden bg-cream', className)}
    >
      <header className="bg-navy text-cream">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Avatar className="h-11 w-11" speaking={speaking} />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="flex items-center gap-2 font-heading text-base font-semibold">
              {brand.chat.assistantName}
              {speaking && <VoiceWave />}
            </p>
            <p className="truncate text-xs text-cream/70">עוזרת וירטואלית · בינה מלאכותית</p>
            <span role="status" className="sr-only">
              {speaking ? 'העוזרת מקריאה את התשובה' : ''}
            </span>
          </div>
          {autoFocus && hasIntro && !intro && (
            <button
              ref={replayRef}
              type="button"
              onClick={() => {
                setIntroDelay(0);
                setIntro(true);
              }}
              aria-label="צפייה בסרטון ההיכרות"
              title="סרטון היכרות"
              className="rounded-full p-2 text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <Play className="h-5 w-5" />
            </button>
          )}
          {messages.length > 1 && (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              aria-label="התחלת שיחה חדשה"
              title="שיחה חדשה"
              className="rounded-full p-2 text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          )}
          {canSpeak && (
            <button
              type="button"
              onClick={() => {
                if (readAloud) cancelSpeech();
                else unlockSpeech();
                // Mark what is already on screen as heard, so only new answers are read.
                spokenId.current = messages[messages.length - 1]?.id ?? null;
                setReadAloud((v) => !v);
              }}
              aria-pressed={readAloud}
              aria-label={readAloud ? 'כיבוי הקראת תשובות' : 'הקראת תשובות בקול'}
              title={readAloud ? 'כיבוי הקראה' : 'הקראת תשובות בקול'}
              className={cn(
                'rounded-full p-2 transition-colors',
                readAloud ? 'bg-accent-light text-navy' : 'text-cream/80 hover:bg-cream/10 hover:text-cream',
              )}
            >
              {readAloud ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          )}
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
        {confirmReset && (
          <div
            role="alertdialog"
            aria-label="אישור איפוס השיחה"
            className="flex flex-wrap items-center justify-between gap-2 bg-cream px-4 py-2.5 text-sm text-ink"
          >
            <span>למחוק את השיחה ולהתחיל מחדש?</span>
            <span className="flex gap-2">
              <button
                type="button"
                onClick={resetChat}
                className="rounded-full bg-navy px-3.5 py-1 font-medium text-cream hover:bg-navy/90"
              >
                מחיקה
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-full border border-navy/25 px-3.5 py-1 font-medium text-navy hover:bg-navy/5"
              >
                ביטול
              </button>
            </span>
          </div>
        )}
      </header>
      {intro && <IntroStage onDone={closeIntro} delayMs={introDelay} focusOnShow={introDelay === 0} />}

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {messages.map((m, i) => {
          const asked = messages
            .slice(0, i)
            .reverse()
            .find((x) => x.role === 'user');
          const askedText = asked
            ? asked.parts.map((p) => (p.type === 'text' ? p.text : '')).join(' ').trim()
            : undefined;
          return (
            <Bubble
              key={m.id}
              message={m}
              isLast={i === messages.length - 1}
              question={askedText}
              showFeedback={
                m.role === 'assistant' && i === messages.length - 1 && i > 0 && !m.id.startsWith('intake-') && !busy
              }
            />
          );
        })}
        {status === 'submitted' && <Typing />}
        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-800">
            מצטערים, אירעה תקלה{error.message ? ` (${errorDetail(error)})` : ''}. אפשר להתקשר{' '}
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

      {intakeStep === 'confirm' && (
        <p className="border-t border-navy/10 px-4 pt-3 text-xs leading-relaxed text-ink/70">
          בלחיצה על &quot;כן, שלחו&quot; אני מאשר/ת את{' '}
          <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-accent underline">
            תנאי השימוש
          </a>{' '}
          ואת{' '}
          <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-accent underline">
            מדיניות הפרטיות
          </a>
          . הפרטים ישמשו רק לחזרה אליי בנוגע לפנייה, ללא דיוור שיווקי.
        </p>
      )}

      {/* Quick actions */}
      <div data-tour-target="questions" className="flex flex-wrap items-center gap-2 border-t border-navy/10 px-4 pb-1 pt-3">
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

      {voice.error && (
        <p role="status" className="px-4 pt-2 text-sm text-red-800">
          {voice.error}
        </p>
      )}

      <form onSubmit={submit} data-tour-target="chat" className="flex items-center gap-2 px-4 pb-2 pt-2">
        <label htmlFor={`concierge-input-${autoFocus ? 'float' : 'inline'}`} className="sr-only">
          הקלדת הודעה
        </label>
        <input
          ref={inputRef}
          id={`concierge-input-${autoFocus ? 'float' : 'inline'}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            voice.listening ? 'מקשיבה... אפשר לדבר' : intakeStep ? PLACEHOLDER[intakeStep] : 'כתבו הודעה או לחצו על המיקרופון'
          }
          type={intakeStep === 'phone' ? 'tel' : 'text'}
          inputMode={intakeStep === 'phone' ? 'tel' : 'text'}
          autoComplete={intakeStep === 'name' ? 'name' : intakeStep === 'phone' ? 'tel' : 'off'}
          maxLength={500}
          className="min-w-0 flex-1 rounded-full border border-navy/20 bg-background px-4 py-2.5 text-[0.9375rem] focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        />
        {voice.supported && (
          <button
            data-tour-target="voice"
            type="button"
            onClick={() => {
              if (voice.listening) {
                voice.stop();
              } else {
                cancelSpeech();
                voice.start();
              }
            }}
            aria-pressed={voice.listening}
            aria-label={voice.listening ? 'עצירת ההקלטה' : 'דיבור במקום הקלדה'}
            title={voice.listening ? 'עצירת ההקלטה' : 'דיבור במקום הקלדה'}
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors',
              voice.listening
                ? 'animate-ring border-accent bg-accent text-cream'
                : 'border-navy/25 bg-background text-navy hover:border-accent hover:text-accent',
            )}
          >
            <Mic className="h-5 w-5" />
          </button>
        )}
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

      <p className="flex items-center justify-center gap-1.5 px-4 pb-3 text-center text-[11px] text-ink/75">
        <Shield className="h-3 w-3 shrink-0" aria-hidden="true" />
        {brand.chat.disclaimer} הפרטים נשלחים רק באישורך.
      </p>
    </section>
  );
}

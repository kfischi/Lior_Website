'use client';

import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MessageCircle, X, Send, Square, Phone } from 'lucide-react';
import { brand, telHref, whatsappHref } from '@/lib/brand';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

const greeting: UIMessage = {
  id: 'greeting',
  role: 'assistant',
  parts: [{ type: 'text', text: brand.chat.greeting }],
};

function ContactCard({
  data,
}: {
  data: { phone: string; telHref: string; whatsapp: string; email: string };
}) {
  return (
    <div className="mt-2 rounded-lg border border-navy/10 bg-cream p-3 text-sm">
      <a href={data.telHref} className="flex items-center gap-2 py-1 text-navy hover:text-accent">
        <Phone className="h-4 w-4 text-accent" /> {data.phone}
      </a>
      <a
        href={data.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 py-1 text-navy hover:text-accent"
      >
        <MessageCircle className="h-4 w-4 text-accent" /> וואטסאפ
      </a>
    </div>
  );
}

function WhatsAppCard({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-accent/90"
    >
      <MessageCircle className="h-4 w-4" />
      שליחת ההודעה למשרד בוואטסאפ
    </a>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user';
  return (
    <div
      className={cn(
        'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
        isUser
          ? 'ms-auto rounded-ee-sm bg-navy text-cream'
          : 'me-auto rounded-es-sm bg-navy/5 text-ink',
      )}
    >
      {message.parts.map((part, i) => {
        if (part.type === 'text') return <span key={i}>{part.text}</span>;
        if (
          part.type === 'tool-getContactOptions' &&
          'output' in part &&
          part.output
        ) {
          return <ContactCard key={i} data={part.output as never} />;
        }
        if (part.type === 'tool-whatsappHandoff' && 'output' in part && part.output) {
          return <WhatsAppCard key={i} href={(part.output as { href: string }).href} />;
        }
        return null;
      })}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="me-auto flex items-center gap-1 rounded-2xl rounded-es-sm bg-navy/5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-navy/50"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function ChatBotInner() {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [sessionId] = React.useState(() =>
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `s_${Date.now()}`,
  );
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat', body: { sessionId } }),
    messages: [greeting],
  });

  const busy = status === 'submitted' || status === 'streaming';

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open, status]);

  function submit(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    void sendMessage({ text: value });
    setInput('');
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'סגירת הצ׳אט' : 'פתיחת הצ׳אט עם עוזר המשרד'}
        aria-expanded={open}
        className="fixed bottom-5 end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-cream shadow-lg ring-2 ring-cream/70 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.section
            aria-label="חלון צ׳אט עם עוזר המשרד"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed bottom-24 end-5 z-50 flex h-[32rem] max-h-[calc(100vh-7rem)] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-navy/10 bg-cream shadow-2xl"
          >
            <header className="flex items-center gap-2.5 bg-navy px-4 py-3.5 text-cream">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-light text-navy">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="font-heading text-sm font-semibold">{brand.chat.assistantName}</p>
                <p className="text-xs text-cream/70">{brand.firmNameShort}</p>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {status === 'submitted' && <TypingDots />}
              {error && (
                <div className="me-auto rounded-2xl bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
                  מצטערים, אירעה תקלה. ניתן להתקשר{' '}
                  <a href={telHref} className="font-semibold underline">
                    {brand.phone}
                  </a>{' '}
                  או{' '}
                  <a href={whatsappHref} className="font-semibold underline" target="_blank" rel="noopener noreferrer">
                    בוואטסאפ
                  </a>
                  .
                </div>
              )}

              {/* Suggested prompts — only before the first user message */}
              {messages.length === 1 && !busy && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {brand.chat.suggestedPrompts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => submit(p)}
                      className="rounded-full border border-navy/15 bg-cream px-3 py-1.5 text-xs text-navy transition-colors hover:border-accent hover:text-accent"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-center gap-2 border-t border-navy/10 bg-cream p-3"
            >
              <label htmlFor="chat-input" className="sr-only">
                הקלדת הודעה
              </label>
              <input
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="כתבו הודעה..."
                autoComplete="off"
                className="flex-1 rounded-full border border-navy/15 bg-background px-4 py-2 text-sm focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  aria-label="עצירה"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy"
                >
                  <Square className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="שליחה"
                  disabled={!input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-cream transition-opacity disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </form>
            <p className="bg-cream px-4 pb-2.5 text-center text-[11px] text-ink/40">
              {brand.chat.disclaimer}
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

/** Chatbot wrapped in an error boundary so a failure never blanks the page. */
export function ChatBot() {
  return (
    <ErrorBoundary fallback={null}>
      <ChatBotInner />
    </ErrorBoundary>
  );
}

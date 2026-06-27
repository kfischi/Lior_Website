'use client';

import * as React from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { brand } from '@/lib/brand';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Floating chatbot. Talks ONLY to the internal /api/chat route, which relays to
 * n8n server-side — no webhook URL or key ever reaches the browser.
 */
export function ChatBot() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([
    {
      role: 'assistant',
      content: `שלום! הגעתם ל${brand.firmName}. כיצד נוכל לעזור?`,
    },
  ]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sessionId = React.useRef<string>(
    `s_${Math.random().toString(36).slice(2)}`,
  );

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: next.slice(-10),
          sessionId: sessionId.current,
        }),
      });
      const json = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            json.ok && json.reply
              ? json.reply
              : 'מצטערים, אירעה שגיאה. ניתן להתקשר אלינו ישירות.',
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'אירעה שגיאה בחיבור. נסו שוב.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'סגירת הצ׳אט' : 'פתיחת הצ׳אט'}
        aria-expanded={open}
        className="fixed bottom-5 end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Panel */}
      {open && (
        <section
          aria-label="חלון צ׳אט"
          className="fixed bottom-24 end-5 z-50 flex h-[28rem] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-fade-up"
        >
          <header className="flex items-center gap-2 bg-primary px-4 py-3 text-primary-foreground">
            <MessageCircle className="h-5 w-5" />
            <span className="font-heading text-base font-semibold">
              {brand.firmNameShort}
            </span>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  'max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'ms-auto bg-primary text-primary-foreground'
                    : 'me-auto bg-secondary text-secondary-foreground',
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="me-auto flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                מקליד...
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              הקלדת הודעה
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="כתבו הודעה..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" size="icon" variant="accent" disabled={loading} aria-label="שליחה">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>
      )}
    </>
  );
}

'use client';

import * as React from 'react';
import { AvatarVideoPlayer } from './AvatarVideoPlayer';
import { findAnswer, isUrgent } from './matcher';
import { useSpeechInput } from './useSpeechInput';
import { useSpeechOutput } from './useSpeechOutput';
import type { ChatKitConfig, ChatLink, KnowledgeEntry } from './types';

type Message = {
  id: number;
  from: 'assistant' | 'visitor';
  text: string;
  links?: ChatLink[];
  audio?: string;
};

/** Does not take the page down if the chat ever fails: the site must keep working without it. */
class ChatBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Links({ links }: { links?: ChatLink[] }) {
  if (!links?.length) return null;
  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            className="inline-flex min-h-11 items-center rounded-full border border-current px-4 text-sm underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ChatInner({ config }: { config: ChatKitConfig }) {
  const { labels } = config;
  const dir = config.locale === 'he' ? 'rtl' : 'ltr';
  const lang = config.locale;
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 0, from: 'assistant', text: config.welcome.message },
  ]);
  const [draft, setDraft] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const [micError, setMicError] = React.useState('');
  const nextId = React.useRef(1);
  const closedByVisitor = React.useRef(false);
  const restoreFocus = React.useRef(false);
  const timer = React.useRef<number | undefined>(undefined);
  const logRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const openButton = React.useRef<HTMLButtonElement>(null);
  const voice = useSpeechOutput({ lang, pronunciations: config.pronunciations });
  const { cancel: cancelVoice } = voice;

  const quickReplies = config.knowledge.filter((entry) => entry.quickReply);

  const close = React.useCallback(() => {
    closedByVisitor.current = true;
    cancelVoice();
    restoreFocus.current = true;
    setOpen(false);
  }, [cancelVoice]);

  // The open button only exists once the panel is closed, so focus goes back to it after that render.
  React.useEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false;
      openButton.current?.focus();
    }
  }, [open]);

  // Opens by itself once, a little after the page loads, unless the visitor already used the chat.
  React.useEffect(() => {
    if (config.autoOpenAfterMs <= 0) return;
    const id = window.setTimeout(() => {
      if (!closedByVisitor.current) setOpen(true);
    }, config.autoOpenAfterMs);
    return () => window.clearTimeout(id);
  }, [config.autoOpenAfterMs]);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  React.useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const reply = React.useCallback(
    (question: string, spoken: boolean) => {
      const urgent = isUrgent(question, config.urgent?.keywords);
      const match = findAnswer(question, config.knowledge);
      if (!match) config.onUnanswered?.(question);
      const entry: KnowledgeEntry | undefined = match?.entry;
      const text = [urgent ? config.urgent?.message : '', entry?.answer ?? config.fallback.message]
        .filter(Boolean)
        .join('\n\n');
      const links = [...(urgent ? (config.urgent?.links ?? []) : []), ...(entry?.links ?? config.fallback.links ?? [])];
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTyping(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(
        () => {
          setTyping(false);
          const message: Message = { id: nextId.current++, from: 'assistant', text, links, audio: entry?.audio };
          setMessages((list) => [...list, message]);
          // Someone who spoke to the chat gets the answer spoken back; typing visitors get text only.
          if (spoken) void voice.speak(text, entry?.audio);
        },
        reduced ? 0 : 600,
      );
    },
    [config, voice],
  );

  const send = React.useCallback(
    (text: string, spoken = false) => {
      const clean = text.trim().slice(0, 500);
      if (!clean) return;
      cancelVoice();
      setMessages((list) => [...list, { id: nextId.current++, from: 'visitor', text: clean }]);
      setDraft('');
      reply(clean, spoken);
    },
    [cancelVoice, reply],
  );

  const input = useSpeechInput({
    lang: config.locale === 'he' ? 'he-IL' : config.locale,
    onText: setDraft,
    onDone: (text) => send(text, true),
    onError: (reason) =>
      setMicError(
        reason === 'not-allowed' || reason === 'service-not-allowed' || reason === 'audio-capture'
          ? labels.voiceUnsupported
          : '',
      ),
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    voice.unlock();
    send(draft);
  };

  return (
    <div dir={dir} lang={lang} className="fixed bottom-4 end-4 z-50 font-sans">
      {!open && (
        <button
          ref={openButton}
          type="button"
          onClick={() => {
            closedByVisitor.current = false;
            setOpen(true);
          }}
          className="inline-flex min-h-14 items-center gap-2 rounded-full bg-neutral-900 px-5 text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
            <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          </svg>
          <span>{labels.open}</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label={config.assistantName}
          className="flex h-[min(40rem,calc(100svh-2rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-2xl ring-1 ring-black/10"
        >
          <header className="flex items-center justify-between gap-2 border-b border-black/10 px-4 py-2">
            <div className="min-w-0">
              <p className="truncate font-semibold">{config.assistantName}</p>
              <p className="truncate text-sm text-neutral-700">
                {config.firmName} · {config.tagline}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-neutral-900"
            >
              <span className="sr-only">{labels.close}</span>
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                <path d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z" />
              </svg>
            </button>
          </header>

          <AvatarVideoPlayer
            config={config}
            speaking={voice.speaking}
            onWelcomePlayingChange={(playing) => playing && cancelVoice()}
            onStop={cancelVoice}
          />

          <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id} className={message.from === 'visitor' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    message.from === 'visitor'
                      ? 'max-w-[85%] rounded-2xl rounded-ee-sm bg-neutral-900 px-4 py-2 text-white'
                      : 'max-w-[85%] rounded-2xl rounded-es-sm bg-neutral-100 px-4 py-2'
                  }
                >
                  <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
                  <Links links={message.links} />
                  {message.from === 'assistant' && voice.supported && message.id !== 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        voice.unlock();
                        if (voice.speaking) voice.cancel();
                        else void voice.speak(message.text, message.audio);
                      }}
                      className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm underline-offset-2 hover:underline focus-visible:outline-2"
                    >
                      {voice.speaking ? labels.stopListening : labels.listen}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <p className="text-sm text-neutral-700" role="status">
                {labels.typing}
              </p>
            )}
          </div>

          {quickReplies.length > 0 && (
            <div className="border-t border-black/10 px-3 py-2">
              <p className="sr-only">{labels.quickRepliesTitle}</p>
              <ul className="flex max-h-24 flex-wrap gap-2 overflow-y-auto">
                {quickReplies.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => {
                        voice.unlock();
                        send(entry.question);
                      }}
                      className="min-h-11 rounded-full border border-neutral-300 px-3 text-sm hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-neutral-900"
                    >
                      {entry.question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-black/10 p-3">
            <label className="min-w-0 flex-1">
              <span className="sr-only">{labels.placeholder}</span>
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={labels.placeholder}
                maxLength={500}
                autoComplete="off"
                className="min-h-11 w-full rounded-full border border-neutral-300 px-4 focus-visible:outline-2 focus-visible:outline-neutral-900"
              />
            </label>
            {input.supported && (
              <button
                type="button"
                onClick={() => {
                  voice.unlock();
                  setMicError('');
                  if (input.listening) input.stop();
                  else input.start();
                }}
                aria-pressed={input.listening}
                className={
                  'inline-flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ' +
                  (input.listening ? 'bg-red-700 text-white' : 'bg-neutral-100')
                }
              >
                <span className="sr-only">{input.listening ? labels.micStop : labels.mic}</span>
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2z" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="min-h-11 shrink-0 rounded-full bg-neutral-900 px-4 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              {labels.send}
            </button>
          </form>
          {micError && (
            <p role="alert" className="px-4 pb-3 text-sm text-red-800">
              {micError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** The floating chat. Put `<ChatWidget config={chatConfig} />` once in the layout. */
export function ChatWidget({ config }: { config: ChatKitConfig }) {
  return (
    <ChatBoundary>
      <ChatInner config={config} />
    </ChatBoundary>
  );
}

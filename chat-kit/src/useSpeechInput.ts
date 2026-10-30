'use client';

import * as React from 'react';

/**
 * Dictation with the browser's Web Speech API (free, runs in the browser). Chrome, Edge and Safari support it;
 * Firefox does not, so `supported` is false there and the microphone button should be hidden.
 */

interface ResultLike {
  readonly isFinal: boolean;
  readonly 0: { readonly transcript: string };
}
interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ResultLike> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = new () => RecognitionLike;

function recognitionCtor(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const noSubscription = () => () => undefined;

export function useSpeechInput(options: {
  lang: string;
  /** Running transcript while the person speaks. */
  onText: (text: string) => void;
  /** Final transcript when they stop. */
  onDone: (text: string) => void;
  /** Message for a failure (no permission, no microphone, ...). */
  onError: (reason: string) => void;
}) {
  const supported = React.useSyncExternalStore(
    noSubscription,
    () => Boolean(recognitionCtor()),
    () => false,
  );
  const [listening, setListening] = React.useState(false);
  const recognition = React.useRef<RecognitionLike | null>(null);
  const latest = React.useRef(options);

  React.useEffect(() => {
    latest.current = options;
  });
  React.useEffect(() => () => recognition.current?.abort(), []);

  const stop = React.useCallback(() => recognition.current?.stop(), []);

  const start = React.useCallback(() => {
    const Ctor = recognitionCtor();
    if (!Ctor || recognition.current) return;
    const rec = new Ctor();
    rec.lang = latest.current.lang;
    rec.interimResults = true;
    rec.continuous = false;
    let transcript = '';
    rec.onresult = (event) => {
      transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ')
        .trim();
      latest.current.onText(transcript);
    };
    rec.onerror = (event) => latest.current.onError(event.error);
    rec.onend = () => {
      recognition.current = null;
      setListening(false);
      if (transcript) latest.current.onDone(transcript);
    };
    recognition.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      recognition.current = null;
      setListening(false);
      latest.current.onError('start-failed');
    }
  }, []);

  return { supported, listening, start, stop };
}

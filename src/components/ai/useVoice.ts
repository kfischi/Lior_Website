'use client';

import * as React from 'react';

/**
 * Browser speech for the chat: dictation (speech to text) and reading answers
 * aloud (text to speech). Both use the Web Speech API, so nothing is installed
 * and nothing is sent to this site's servers. Support varies by browser, so
 * both hooks report `supported` and the UI hides the controls when false.
 */

interface RecognitionResultLike {
  readonly isFinal: boolean;
  readonly 0: { readonly transcript: string };
}

interface RecognitionEventLike {
  readonly results: ArrayLike<RecognitionResultLike>;
}

interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: RecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type RecognitionCtor = new () => RecognitionLike;

function recognitionCtor(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const noSubscription = () => () => {};

const ERRORS: Record<string, string> = {
  'not-allowed': 'אין הרשאה למיקרופון. אפשר לאשר אותה בדפדפן, או להקליד.',
  'service-not-allowed': 'אין הרשאה למיקרופון. אפשר לאשר אותה בדפדפן, או להקליד.',
  'no-speech': 'לא שמעתי כלום. אפשר ללחוץ שוב ולדבר.',
  'audio-capture': 'לא נמצא מיקרופון במכשיר.',
  network: 'זיהוי הדיבור דורש חיבור לאינטרנט.',
};

export function useSpeechInput(handlers: {
  /** Called with the running transcript while the person is speaking. */
  onText: (text: string) => void;
  /** Called once with the final transcript when they stop. */
  onDone: (text: string) => void;
}) {
  const supported = React.useSyncExternalStore(
    noSubscription,
    () => Boolean(recognitionCtor()),
    () => false,
  );
  const [listening, setListening] = React.useState(false);
  const [error, setError] = React.useState('');
  const recognition = React.useRef<RecognitionLike | null>(null);
  const handlersRef = React.useRef(handlers);

  React.useEffect(() => {
    handlersRef.current = handlers;
  });

  React.useEffect(() => () => recognition.current?.abort(), []);

  const stop = React.useCallback(() => recognition.current?.stop(), []);

  const start = React.useCallback(() => {
    const Ctor = recognitionCtor();
    if (!Ctor || recognition.current) return;
    const rec = new Ctor();
    rec.lang = 'he-IL';
    rec.interimResults = true;
    rec.continuous = false;
    let transcript = '';

    rec.onresult = (event) => {
      transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ')
        .trim();
      handlersRef.current.onText(transcript);
    };
    rec.onerror = (event) => {
      setError(ERRORS[event.error] ?? 'לא הצלחתי להקשיב. אפשר להקליד במקום.');
    };
    rec.onend = () => {
      recognition.current = null;
      setListening(false);
      if (transcript) handlersRef.current.onDone(transcript);
    };

    recognition.current = rec;
    setError('');
    setListening(true);
    try {
      rec.start();
    } catch {
      recognition.current = null;
      setListening(false);
      setError('לא הצלחתי להפעיל את המיקרופון.');
    }
  }, []);

  return { supported, listening, error, start, stop, clearError: () => setError('') };
}

export function useSpeechOutput() {
  const supported = React.useSyncExternalStore(
    noSubscription,
    () => typeof window !== 'undefined' && 'speechSynthesis' in window,
    () => false,
  );

  const [speaking, setSpeaking] = React.useState(false);
  // The utterance being spoken now; late events from a cancelled one must not end this one.
  const current = React.useRef<SpeechSynthesisUtterance | null>(null);

  const cancel = React.useCallback(() => {
    current.current = null;
    setSpeaking(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const speak = React.useCallback(
    (text: string) => {
      if (!text.trim() || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      const hebrew = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith('he'));
      if (hebrew) utterance.voice = hebrew;
      current.current = utterance;
      const finish = () => {
        if (current.current !== utterance) return;
        current.current = null;
        setSpeaking(false);
      };
      utterance.onstart = () => {
        if (current.current === utterance) setSpeaking(true);
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
    },
    [cancel],
  );

  /** Some mobile browsers only allow speech after one utterance started by a tap. */
  const unlock = React.useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const silent = new SpeechSynthesisUtterance(' ');
    silent.volume = 0;
    window.speechSynthesis.speak(silent);
  }, []);

  React.useEffect(() => cancel, [cancel]);

  return { supported, speaking, speak, cancel, unlock };
}

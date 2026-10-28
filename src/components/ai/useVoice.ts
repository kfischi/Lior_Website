'use client';

import * as React from 'react';
import { loadVoiceManifest, recordedPlaylist } from '@/lib/voice/recorded';
import { cleanForSpeech } from '@/lib/voice/spoken';

/**
 * Speech for the chat: dictation (speech to text) and reading answers aloud (text to speech).
 * Dictation uses the browser's Web Speech API. Answers are read from the recordings in /public/voice
 * (one voice, recorded sentence by sentence) and, for any sentence without a recording, by the browser's voice.
 * Nothing is sent to this site's servers. Support varies by browser, so
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

/**
 * The most natural female Hebrew voice the device offers. Edge and Windows have neural voices ("Hila ... Natural"),
 * Chrome has "Google עברית", Apple has "Carmit"; the compact built-in ones sound robotic and rank last.
 */
function bestHebrewVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const score = (v: SpeechSynthesisVoice) => {
    const name = v.name.toLowerCase();
    let n = 0;
    if (name.includes('natural')) n += 6;
    if (name.includes('hila')) n += 4;
    if (name.includes('online')) n += 3;
    if (name.includes('google')) n += 2;
    if (name.includes('carmit')) n += 2;
    if (name.includes('female')) n += 1;
    if (name.includes('asaf') || name.includes('male') && !name.includes('female')) n -= 4;
    return n;
  };
  return voices
    .filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('he') || v.lang.toLowerCase().startsWith('iw'))
    .sort((a, b) => score(b) - score(a))[0];
}

/** A tenth of a second of silence: played on a tap so that later recordings are allowed to start by themselves. */
const SILENCE =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

export function useSpeechOutput() {
  const supported = React.useSyncExternalStore(
    noSubscription,
    () => typeof window !== 'undefined' && ('speechSynthesis' in window || 'Audio' in window),
    () => false,
  );

  const [speaking, setSpeaking] = React.useState(false);
  // The utterance being spoken now; late events from a cancelled one must not end this one.
  const current = React.useRef<SpeechSynthesisUtterance | null>(null);
  // One audio element for all recorded sentences, and a counter that tells a stale playlist from the current one.
  const player = React.useRef<HTMLAudioElement | null>(null);
  const run = React.useRef(0);

  const cancel = React.useCallback(() => {
    current.current = null;
    run.current += 1;
    setSpeaking(false);
    player.current?.pause();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const speakWithBrowser = React.useCallback((text: string) => {
    if (!text.trim() || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    const hebrew = bestHebrewVoice(window.speechSynthesis.getVoices());
    if (hebrew) utterance.voice = hebrew;
    utterance.rate = 1.05;
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
  }, []);

  /** Plays the recordings one after the other; resolves false if one cannot be played (then the browser voice takes over). */
  const playRecorded = React.useCallback(async (files: string[], token: number): Promise<boolean> => {
    const audio = (player.current ??= new Audio());
    setSpeaking(true);
    for (const file of files) {
      if (run.current !== token) return true;
      audio.src = file;
      const finished = await new Promise<boolean>((resolve) => {
        audio.onended = () => resolve(true);
        audio.onerror = () => resolve(false);
        audio.onpause = () => {
          if (run.current !== token) resolve(true);
        };
        audio.play().catch(() => resolve(false));
      });
      if (!finished) return false;
    }
    if (run.current === token) setSpeaking(false);
    return true;
  }, []);

  const speak = React.useCallback(
    (raw: string) => {
      const text = cleanForSpeech(raw);
      if (!text || typeof window === 'undefined') return;
      cancel();
      const token = run.current;
      void loadVoiceManifest().then(async (recordings) => {
        if (run.current !== token) return;
        const files = recordedPlaylist(text, recordings);
        if (files && (await playRecorded(files, token))) return;
        if (run.current === token) speakWithBrowser(text);
      });
    },
    [cancel, playRecorded, speakWithBrowser],
  );

  /** Some mobile browsers only allow speech and sound after something was started by a tap. */
  const unlock = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    if ('Audio' in window) {
      const audio = (player.current ??= new Audio());
      audio.src = SILENCE;
      void audio.play().catch(() => undefined);
    }
    if ('speechSynthesis' in window) {
      const silent = new SpeechSynthesisUtterance(' ');
      silent.volume = 0;
      window.speechSynthesis.speak(silent);
    }
  }, []);

  React.useEffect(() => cancel, [cancel]);

  return { supported, speaking, speak, cancel, unlock };
}

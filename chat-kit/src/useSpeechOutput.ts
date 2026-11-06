'use client';

import * as React from 'react';
import { forVoice, sentences } from './speech-text';

/**
 * Reads answers aloud, free and in the browser:
 *  1. a ready-made recording (`audio`, any format the browser plays: webm, mp3, ...) when the answer has one;
 *  2. otherwise the browser's Hebrew voice (Web Speech API), the most natural female one the device offers,
 *     sentence by sentence at a calm pace, with the pronunciation list applied (so "צ'אט" is not read "צאט").
 */

const noSubscription = () => () => undefined;

/** Picks the most natural Hebrew voice. Neural voices (Edge/Windows "... Natural", Hila) beat the compact built-in ones. */
export function bestVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const base = lang.toLowerCase().slice(0, 2);
  const score = (v: SpeechSynthesisVoice) => {
    const name = v.name.toLowerCase();
    let n = 0;
    if (name.includes('natural')) n += 6;
    if (name.includes('hila')) n += 4;
    if (name.includes('online')) n += 3;
    if (name.includes('google')) n += 2;
    if (name.includes('carmit')) n += 2;
    if (name.includes('female')) n += 1;
    if (name.includes('asaf') || (name.includes('male') && !name.includes('female'))) n -= 4;
    return n;
  };
  return voices
    .filter((v) => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return l.startsWith(base) || (base === 'he' && l.startsWith('iw'));
    })
    .sort((a, b) => score(b) - score(a))[0];
}

/** A tenth of a second of silence, played on the first tap so later recordings may start by themselves (iOS/Safari). */
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

export function useSpeechOutput(options: { lang: string; pronunciations: Record<string, string> }) {
  const supported = React.useSyncExternalStore(
    noSubscription,
    () => typeof window !== 'undefined' && ('speechSynthesis' in window || 'Audio' in window),
    () => false,
  );
  const [speaking, setSpeaking] = React.useState(false);
  const player = React.useRef<HTMLAudioElement | null>(null);
  /** Counter that tells a stale playback (cancelled or replaced) from the current one. */
  const run = React.useRef(0);
  const latest = React.useRef(options);

  React.useEffect(() => {
    latest.current = options;
  });

  const cancel = React.useCallback(() => {
    run.current += 1;
    setSpeaking(false);
    player.current?.pause();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  React.useEffect(() => cancel, [cancel]);

  /** Call from a tap/click handler once: browsers only allow sound that starts from a user gesture. */
  const unlock = React.useCallback(() => {
    const audio = (player.current ??= new Audio());
    if (audio.dataset.unlocked) return;
    audio.dataset.unlocked = '1';
    audio.src = SILENCE;
    void audio.play().catch(() => undefined);
  }, []);

  const speakText = React.useCallback(async (text: string, token: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const { lang, pronunciations } = latest.current;
    const voice = bestVoice(synth.getVoices(), lang);
    for (const sentence of sentences(forVoice(text, pronunciations))) {
      if (run.current !== token) return;
      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = lang === 'he' ? 'he-IL' : lang;
        if (voice) utterance.voice = voice;
        utterance.rate = 1.02;
        utterance.pitch = 1;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        synth.speak(utterance);
      });
    }
  }, []);

  /** Reads `text` aloud; with `audioSrc` the recording is played instead and the voice is only the fallback. */
  const speak = React.useCallback(
    async (text: string, audioSrc?: string) => {
      cancel();
      const token = run.current;
      setSpeaking(true);
      let played = false;
      if (audioSrc) {
        const audio = (player.current ??= new Audio());
        audio.src = audioSrc;
        played = await new Promise<boolean>((resolve) => {
          audio.onended = () => resolve(true);
          audio.onerror = () => resolve(false);
          audio.onpause = () => resolve(run.current !== token);
          audio.play().catch(() => resolve(false));
        });
      }
      if (!played && run.current === token) await speakText(text, token);
      if (run.current === token) setSpeaking(false);
    },
    [cancel, speakText],
  );

  return { supported, speaking, speak, cancel, unlock };
}

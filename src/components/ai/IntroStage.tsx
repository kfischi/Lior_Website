'use client';

import * as React from 'react';
import Image from 'next/image';
import { Captions, CaptionsOff, FileText, Play, Volume2, VolumeX, X } from 'lucide-react';
import { useReducedMotion } from '@/components/motion/useReducedMotionSafe';
import { brand, type IntroSegment } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { applyTour, clearTour } from './tour';

/** Seconds after the chat opens that the welcome starts (a replay starts at once). */
export const INTRO_START_DELAY_MS = 2000;

/**
 * The welcome at the top of the chat: a still photo of the attorney while the welcome is read aloud,
 * with live captions and a transcript you can click to jump around. While it speaks, the parts of the
 * site it mentions light up (the chat, the mic, the articles, the contact buttons...). Skippable at any time.
 */
export function IntroStage({
  onDone,
  delayMs = INTRO_START_DELAY_MS,
  focusOnShow = false,
}: {
  onDone: (reason: 'ended' | 'skipped') => void;
  delayMs?: number;
  /** Move keyboard focus into the card when it opens (a replay the visitor asked for). */
  focusOnShow?: boolean;
}) {
  const { photo, audio, segments } = brand.chat.welcome;
  const reduced = useReducedMotion();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const regionRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [needsTap, setNeedsTap] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [captionsOn, setCaptionsOn] = React.useState(true);
  const [transcriptOpen, setTranscriptOpen] = React.useState(false);

  const currentIndex = segments.reduce((found, seg, i) => (seg.start <= time ? i : found), -1);
  const current: IntroSegment | undefined = segments[currentIndex];
  const focus = visible && playing ? current?.focus : undefined;
  const scrollOrigin = React.useRef<number | null>(null);
  const visitorScrolled = React.useRef(false);

  // Buffer while closed, then open and play after the delay.
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(true);
      if (focusOnShow) regionRef.current?.focus();
      const sound = audioRef.current;
      if (!sound) return;
      if (reduced) {
        setNeedsTap(true);
        return;
      }
      sound.play().catch(() => setNeedsTap(true));
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [reduced, delayMs, focusOnShow]);

  // Light up what is being talked about.
  React.useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    if (focus && wide && !reduced && scrollOrigin.current === null) scrollOrigin.current = window.scrollY;
    applyTour(focus, { scroll: wide && !reduced, smooth: !reduced });
    return clearTour;
  }, [focus, reduced]);

  // The tour scrolls the page; when the welcome ends, take the visitor back to where they were
  // (unless they scrolled themselves in the meantime).
  React.useEffect(() => {
    const mark = () => {
      visitorScrolled.current = true;
    };
    const events = ['wheel', 'touchmove', 'keydown'] as const;
    events.forEach((name) => window.addEventListener(name, mark, { passive: true }));
    return () => {
      events.forEach((name) => window.removeEventListener(name, mark));
      if (scrollOrigin.current !== null && !visitorScrolled.current) {
        window.scrollTo({ top: scrollOrigin.current, behavior: 'smooth' });
      }
    };
  }, []);

  function play() {
    setNeedsTap(false);
    audioRef.current?.play().catch(() => setNeedsTap(true));
  }

  function seek(seconds: number) {
    const sound = audioRef.current;
    if (!sound) return;
    sound.currentTime = seconds;
    setTranscriptOpen(false);
    play();
  }

  return (
    <div
      ref={regionRef}
      role="region"
      tabIndex={-1}
      data-intro-stage
      aria-label="הודעת פתיחה מהעוזרת של ליאור"
      // While closed the buttons must not be reachable by Tab or by a screen reader.
      inert={!visible}
      className={cn(
        'flex shrink-0 flex-col overflow-hidden bg-navy text-cream outline-none transition-[max-height,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        visible ? 'max-h-[30rem] opacity-100' : 'pointer-events-none max-h-0 opacity-0',
      )}
    >
      <audio
        ref={audioRef}
        src={audio}
        preload="auto"
        muted={muted}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => onDone('ended')}
        onError={() => onDone('skipped')}
      />

      <div className="relative h-40 w-full shrink-0 sm:h-44">
        <Image
          src={photo}
          alt={brand.attorneyName}
          fill
          sizes="(min-width: 640px) 28rem, 100vw"
          className="object-cover object-[50%_9%]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/55 to-transparent"
        />
        <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-1.5 p-2">
          <span className="whitespace-nowrap rounded-full bg-black/45 px-2.5 py-1 text-[0.7rem] backdrop-blur">
            העוזרת הווירטואלית · בינה מלאכותית
          </span>
          <span className="flex-1" />
          <button
            type="button"
            onClick={() => setTranscriptOpen((v) => !v)}
            aria-pressed={transcriptOpen}
            aria-label="תמלול מלא"
            className="rounded-full bg-black/45 p-1.5 backdrop-blur transition-colors hover:bg-black/65"
          >
            <FileText className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCaptionsOn((v) => !v)}
            aria-pressed={captionsOn}
            aria-label="כתוביות"
            className="rounded-full bg-black/45 p-1.5 backdrop-blur transition-colors hover:bg-black/65"
          >
            {captionsOn ? <Captions className="h-4 w-4" /> : <CaptionsOff className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            aria-pressed={muted}
            aria-label="השתקה"
            className="rounded-full bg-black/45 p-1.5 backdrop-blur transition-colors hover:bg-black/65"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => onDone('skipped')}
            aria-label="סגירת הפתיחה והמשך לצ׳אט"
            className="rounded-full bg-black/45 p-1.5 backdrop-blur transition-colors hover:bg-black/65"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {visible && (needsTap || !playing) && (
          <button
            type="button"
            onClick={play}
            aria-label="השמעת הודעת הפתיחה"
            className="absolute inset-0 flex items-center justify-center bg-black/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-light"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/90 text-navy shadow-2xl">
              <Play className="h-6 w-6 translate-x-[-2px]" fill="currentColor" aria-hidden="true" />
            </span>
          </button>
        )}

        {transcriptOpen && (
          <div className="absolute inset-0 z-10 overflow-y-auto bg-black/85 p-4 pt-14 text-sm leading-relaxed">
            <ol className="space-y-2">
              {segments.map((seg, i) => (
                <li key={seg.start}>
                  <button
                    type="button"
                    onClick={() => seek(seg.start)}
                    aria-current={i === currentIndex ? 'true' : undefined}
                    className={cn(
                      'w-full rounded-lg px-3 py-1.5 text-start transition-colors hover:bg-cream/10',
                      i === currentIndex ? 'bg-accent-light/20 text-white' : 'text-cream/80',
                    )}
                  >
                    {seg.text}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}

        {duration > 0 && (
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
            <div className="h-full bg-accent-light" style={{ width: `${Math.min(100, (time / duration) * 100)}%` }} />
          </div>
        )}
      </div>

      {/* Live captions under the photo, so they never cover the face. */}
      {captionsOn && (
        <p aria-hidden="true" className="min-h-[4.25rem] px-4 py-2.5 text-[0.9rem] leading-snug text-cream/95">
          {current?.text ?? segments[0]?.text}
        </p>
      )}

      <span role="status" className="sr-only">
        {focus ? current?.text : ''}
      </span>
    </div>
  );
}

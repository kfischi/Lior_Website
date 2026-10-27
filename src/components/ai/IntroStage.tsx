'use client';

import * as React from 'react';
import { Captions, CaptionsOff, FileText, Play, Volume2, VolumeX, X } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { brand, type IntroSegment } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { applyTour, clearTour } from './tour';

/** Seconds after the chat opens that the video starts (a replay starts at once). */
export const INTRO_START_DELAY_MS = 2000;

/**
 * The welcome video at the top of the chat. Two seconds after the chat opens (the visitor's tap
 * allows sound) the picture opens and she starts talking, with live captions and a transcript
 * you can click to jump around. While she speaks, the parts of the site she mentions light up
 * (the chat, the mic, the articles, the contact buttons...). Skippable at any time.
 */
export function IntroStage({
  onDone,
  delayMs = INTRO_START_DELAY_MS,
  focusOnShow = false,
}: {
  onDone: (reason: 'ended' | 'skipped') => void;
  delayMs?: number;
  /** Move keyboard focus into the video when it opens (a replay the visitor asked for). */
  focusOnShow?: boolean;
}) {
  const { src, poster, segments } = brand.chat.intro;
  const reduced = useReducedMotion();
  const videoRef = React.useRef<HTMLVideoElement>(null);
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

  // Buffer while closed, then open and play after the delay.
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(true);
      if (focusOnShow) regionRef.current?.focus();
      const video = videoRef.current;
      if (!video) return;
      if (reduced) {
        setNeedsTap(true);
        return;
      }
      video.play().catch(() => setNeedsTap(true));
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [reduced, delayMs, focusOnShow]);

  // Light up what she is talking about.
  React.useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    applyTour(focus, { scroll: wide && !reduced, smooth: !reduced });
    return clearTour;
  }, [focus, reduced]);

  function play() {
    setNeedsTap(false);
    videoRef.current?.play().catch(() => setNeedsTap(true));
  }

  function seek(seconds: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = seconds;
    setTranscriptOpen(false);
    play();
  }

  return (
    <div
      ref={regionRef}
      role="region"
      tabIndex={-1}
      data-intro-stage
      aria-label="סרטון היכרות עם העוזרת של ליאור"
      // While closed the buttons must not be reachable by Tab or by a screen reader.
      inert={!visible}
      className={cn(
        'flex shrink-0 flex-col overflow-hidden bg-black text-cream outline-none transition-[height,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        visible
          ? 'h-[48%] max-h-[24rem] min-h-[15rem] opacity-100 [@media(max-height:40rem)]:min-h-[9rem]'
          : 'pointer-events-none h-0 opacity-0',
      )}
    >
      <div className="relative min-h-0 flex-1">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="auto"
          playsInline
          muted={muted}
          aria-label="סרטון היכרות: העוזרת הווירטואלית של ליאור מציגה את האתר"
          className="h-full w-full object-cover object-[50%_14%]"
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => onDone('ended')}
          onError={() => onDone('skipped')}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/55 to-transparent"
        />
        <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-2 p-2.5">
          <span className="whitespace-nowrap rounded-full bg-black/45 px-3 py-1 text-xs backdrop-blur">
            נוצר בבינה מלאכותית
          </span>
          <span className="flex-1" />
          <button
            type="button"
            onClick={() => setTranscriptOpen((v) => !v)}
            aria-pressed={transcriptOpen}
            aria-label="תמלול מלא"
            className="rounded-full bg-black/45 p-2 backdrop-blur transition-colors hover:bg-black/65"
          >
            <FileText className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCaptionsOn((v) => !v)}
            aria-pressed={captionsOn}
            aria-label="כתוביות"
            className="rounded-full bg-black/45 p-2 backdrop-blur transition-colors hover:bg-black/65"
          >
            {captionsOn ? <Captions className="h-4 w-4" /> : <CaptionsOff className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            aria-pressed={muted}
            aria-label="השתקה"
            className="rounded-full bg-black/45 p-2 backdrop-blur transition-colors hover:bg-black/65"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => onDone('skipped')}
            aria-label="סגירת הסרטון והמשך לצ׳אט"
            className="rounded-full bg-black/45 p-2 backdrop-blur transition-colors hover:bg-black/65"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {visible && (needsTap || !playing) && (
          <button
            type="button"
            onClick={play}
            aria-label="הפעלת סרטון ההיכרות"
            className="absolute inset-0 flex items-center justify-center bg-black/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-light"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/90 text-navy shadow-2xl">
              <Play className="h-7 w-7 translate-x-[-2px]" fill="currentColor" aria-hidden="true" />
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

      <p
        aria-hidden="true"
        className="min-h-[3.9rem] shrink-0 bg-black px-3.5 py-2 text-[0.9rem] leading-snug text-cream/95"
      >
        {captionsOn && current ? current.text : ''}
      </p>
      <span role="status" className="sr-only">
        {focus ? current?.text : ''}
      </span>
    </div>
  );
}

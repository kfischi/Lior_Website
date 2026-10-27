'use client';

import * as React from 'react';
import Link from 'next/link';
import { Captions, CaptionsOff, FileText, MessageCircle, Mic, Newspaper, Phone, Play, Volume2, VolumeX, X } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { brand, telHref, type IntroSegment } from '@/lib/brand';
import { cn } from '@/lib/utils';

type Focus = NonNullable<IntroSegment['focus']>;

const TOUR: { id: Focus; label: string; icon: React.ElementType }[] = [
  { id: 'chat', label: 'שיחה בצ׳אט', icon: MessageCircle },
  { id: 'questions', label: 'שאלות מכוונות', icon: Mic },
  { id: 'articles', label: 'מאמרים ותשובות', icon: Newspaper },
  { id: 'contact', label: 'קשר ישיר', icon: Phone },
];

/** Seconds after the chat opens that the video starts (a replay starts at once). */
export const INTRO_START_DELAY_MS = 2000;

/**
 * The welcome video: the assistant introduces herself and the site. It appears two seconds
 * after the chat opens (the visitor's tap allows sound), with live captions, a full transcript
 * and a short tour that lights up in step with what she says. Skippable at any time.
 */
export function IntroStage({
  onDone,
  delayMs = INTRO_START_DELAY_MS,
}: {
  onDone: (reason: 'ended' | 'skipped' | 'chat') => void;
  delayMs?: number;
}) {
  const { src, poster, segments } = brand.chat.intro;
  const reduced = useReducedMotion();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [needsTap, setNeedsTap] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [captionsOn, setCaptionsOn] = React.useState(true);
  const [transcriptOpen, setTranscriptOpen] = React.useState(false);

  const current = segments.reduce<IntroSegment | undefined>(
    (found, seg) => (seg.start <= time ? seg : found),
    undefined,
  );

  // Buffer while hidden, then show and play after the delay.
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(true);
      const video = videoRef.current;
      if (!video) return;
      if (reduced) {
        setNeedsTap(true);
        return;
      }
      video.play().catch(() => setNeedsTap(true));
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [reduced, delayMs]);

  function play() {
    const video = videoRef.current;
    if (!video) return;
    setNeedsTap(false);
    video.play().catch(() => setNeedsTap(true));
  }

  return (
    <div
      role="dialog"
      aria-label="סרטון היכרות עם העוזרת של ליאור"
      className={cn(
        'absolute inset-0 z-20 flex flex-col bg-navy text-cream transition-opacity duration-500',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!visible}
    >
      <div className="relative min-h-[11rem] flex-1 bg-black">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="auto"
          playsInline
          muted={muted}
          aria-label="סרטון היכרות: העוזרת הווירטואלית של ליאור מציגה את האתר"
          className="h-full w-full object-cover object-top"
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => onDone('ended')}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/55 to-transparent"
        />
        <div className="absolute inset-x-0 top-0 flex items-center gap-2 p-3">
          <span className="rounded-full bg-black/45 px-3 py-1 text-xs backdrop-blur">
            סרטון היכרות · נוצר בבינה מלאכותית
          </span>
          <span className="flex-1" />
          <button
            type="button"
            onClick={() => setCaptionsOn((v) => !v)}
            aria-pressed={captionsOn}
            aria-label={captionsOn ? 'כיבוי כתוביות' : 'הפעלת כתוביות'}
            className="rounded-full bg-black/45 p-2 backdrop-blur transition-colors hover:bg-black/65"
          >
            {captionsOn ? <Captions className="h-4 w-4" /> : <CaptionsOff className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            aria-pressed={muted}
            aria-label={muted ? 'הפעלת קול' : 'השתקה'}
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
        {(needsTap || (!playing && time === 0)) && visible && (
          <button
            type="button"
            onClick={play}
            aria-label="הפעלת סרטון ההיכרות"
            className="absolute inset-0 flex items-center justify-center bg-black/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-light"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream/90 text-navy shadow-2xl">
              <Play className="h-9 w-9 translate-x-[-2px]" fill="currentColor" aria-hidden="true" />
            </span>
          </button>
        )}
        {duration > 0 && (
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
            <div className="h-full bg-accent-light" style={{ width: `${Math.min(100, (time / duration) * 100)}%` }} />
          </div>
        )}
      </div>

      <div className="px-4 pb-2 pt-3">
        <p className="min-h-[4.25rem] text-[0.95rem] leading-relaxed text-cream/95" aria-live="off">
          {captionsOn ? current?.text ?? '' : ''}
        </p>
        <button
          type="button"
          onClick={() => setTranscriptOpen((v) => !v)}
          aria-expanded={transcriptOpen}
          className="mt-1 flex items-center gap-1.5 text-xs text-cream/75 underline-offset-4 hover:text-cream hover:underline"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          {transcriptOpen ? 'הסתרת התמלול' : 'תמלול מלא'}
        </button>
        {transcriptOpen && (
          <div className="mt-2 max-h-28 space-y-2 overflow-y-auto rounded-lg bg-black/25 p-3 text-sm leading-relaxed text-cream/90">
            {segments.map((seg) => (
              <p key={seg.start}>{seg.text}</p>
            ))}
          </div>
        )}
      </div>

      <ul className="grid grid-cols-2 gap-2 px-4 pb-2" aria-label="מה אפשר לעשות כאן">
        {TOUR.map(({ id, label, icon: Icon }) => {
          const active = current?.focus === id;
          const cls = cn(
            'flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-start text-sm transition-colors',
            active
              ? 'border-accent-light bg-accent-light text-navy'
              : 'border-cream/20 text-cream/90 hover:border-cream/50 hover:bg-cream/10',
          );
          const content = (
            <>
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </>
          );
          return (
            <li key={id}>
              {id === 'articles' ? (
                <Link href="/articles" onClick={() => onDone('skipped')} className={cls}>
                  {content}
                </Link>
              ) : id === 'contact' ? (
                <a href={telHref} className={cls}>
                  {content}
                </a>
              ) : (
                <button type="button" onClick={() => onDone('chat')} className={cls}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="px-4 pb-4 pt-1">
        <button
          type="button"
          onClick={() => onDone('skipped')}
          className="w-full rounded-full bg-cream px-4 py-2.5 font-medium text-navy transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-light"
        >
          המשך לצ׳אט
        </button>
      </div>
    </div>
  );
}

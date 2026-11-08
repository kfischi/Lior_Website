'use client';

import * as React from 'react';
import { Play } from 'lucide-react';
import type { VideoTranscriptLine } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { announcePlayback, useExclusivePlayback } from './useExclusivePlayback';

interface VideoCardProps {
  src: string;
  poster: string;
  label: string;
  /** What was said, line by line with times: shown as subtitles on the video while it plays. */
  transcript?: VideoTranscriptLine[];
  /** A short description under the video. */
  note?: string;
  /** Wide footage keeps its own shape instead of being letterboxed in a tall card. */
  landscape?: boolean;
}

/**
 * One client video with subtitles drawn over it. The poster carries a large play button; native controls
 * appear once it starts, and the button returns when it ends. Nothing loads until it is pressed
 * (preload="none"). Under the video: an optional description.
 */
export function VideoCard({ src, poster, label, transcript, note, landscape }: VideoCardProps) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const id = React.useId();
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [line, setLine] = React.useState<string>('');
  const hasLines = Boolean(transcript && transcript.length > 0);

  const pause = React.useCallback(() => ref.current?.pause(), []);
  useExclusivePlayback(id, boxRef, playing, pause);

  const onTime = () => {
    const t = ref.current?.currentTime ?? 0;
    const cue = transcript?.find((l) => t >= l.start && t < l.end);
    setLine(cue?.text ?? '');
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white/5 shadow-2xl ring-1 ring-cream/10">
      <div ref={boxRef} className={cn('group relative overflow-hidden bg-black', landscape ? 'aspect-[4/3]' : 'aspect-[9/16]')}>
        <video
          ref={ref}
          controls={playing}
          playsInline
          preload="none"
          poster={poster}
          aria-label={label}
          className="h-full w-full object-contain"
          onPlay={() => {
            setPlaying(true);
            announcePlayback(id);
          }}
          onPause={() => setLine('')}
          onTimeUpdate={hasLines ? onTime : undefined}
          onEnded={() => {
            setPlaying(false);
            setLine('');
          }}
        >
          <source src={src} type="video/mp4" />
        </video>

        {line && (
          <p
            aria-live="off"
            className="pointer-events-none absolute inset-x-3 bottom-14 rounded-lg bg-black/70 px-3 py-2 text-center text-sm font-medium leading-snug text-white md:text-base"
          >
            {line}
          </p>
        )}

        {!playing && (
          <button
            type="button"
            onClick={() => void ref.current?.play()}
            aria-label={`הפעלה: ${label}`}
            className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-navy/70 via-transparent to-navy/20 transition-colors hover:from-navy/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-light"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream/90 text-navy shadow-2xl backdrop-blur transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
              <Play className="h-9 w-9 translate-x-[-2px]" fill="currentColor" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>

      {note && (
        <div className="p-4 text-start">
          <p className="text-sm leading-relaxed text-cream/90">{note}</p>
        </div>
      )}
    </div>
  );
}

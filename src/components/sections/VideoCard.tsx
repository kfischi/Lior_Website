'use client';

import * as React from 'react';
import { ChevronDown, Play } from 'lucide-react';
import type { VideoTranscriptLine } from '@/lib/brand';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  src: string;
  poster: string;
  label: string;
  /** What was said, line by line with times: shown as captions and as a transcript under the video. */
  transcript?: VideoTranscriptLine[];
  /** A short description under the video. */
  note?: string;
  /** Wide footage keeps its own shape instead of being letterboxed in a tall card. */
  landscape?: boolean;
}

function vttTime(seconds: number): string {
  const ms = Math.round(seconds * 1000);
  const pad = (n: number, width = 2) => String(n).padStart(width, '0');
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)}.${pad(ms % 1000, 3)}`;
}

/** The lines as a WebVTT file, so the video carries a real captions track (off until the viewer turns it on). */
function toVtt(lines: VideoTranscriptLine[]): string {
  const cues = lines.map((l) => `${vttTime(l.start)} --> ${vttTime(l.end)}\n${l.text}`);
  return `WEBVTT\n\n${cues.join('\n\n')}\n`;
}

/**
 * One client video with its transcript. The poster carries a large play button; native controls
 * appear once it starts, and the button returns when it ends. Nothing loads until it is pressed
 * (preload="none"). Under the video: an optional description and the transcript, collapsed.
 */
export function VideoCard({ src, poster, label, transcript, note, landscape }: VideoCardProps) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const captionsUrl = React.useMemo(
    () =>
      transcript && transcript.length > 0
        ? `data:text/vtt;charset=utf-8,${encodeURIComponent(toVtt(transcript))}`
        : undefined,
    [transcript],
  );
  const hasText = Boolean(note) || Boolean(transcript && transcript.length > 0);

  return (
    <div className="overflow-hidden rounded-3xl bg-white/5 shadow-2xl ring-1 ring-cream/10">
      <div className={cn('group relative overflow-hidden bg-black', landscape ? 'aspect-[4/3]' : 'aspect-[9/16]')}>
        <video
          ref={ref}
          controls={playing}
          playsInline
          preload="none"
          poster={poster}
          aria-label={label}
          className="h-full w-full object-contain"
          onPlay={() => setPlaying(true)}
          onEnded={() => setPlaying(false)}
        >
          <source src={src} type="video/mp4" />
          {captionsUrl && <track kind="captions" srcLang="he" label="עברית" src={captionsUrl} />}
        </video>

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

      {hasText && (
        <div className="space-y-3 p-4 text-start">
          {note && <p className="text-sm leading-relaxed text-cream/90">{note}</p>}
          {transcript && transcript.length > 0 && (
            <details className="group/transcript">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded text-sm font-medium text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light [&::-webkit-details-marker]:hidden">
                תמלול
                <ChevronDown
                  className="h-4 w-4 transition-transform group-open/transcript:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <div className="mt-2 max-h-56 space-y-2 overflow-y-auto pe-1 text-sm leading-relaxed text-cream/85">
                {transcript.map((l) => (
                  <p key={l.start}>{l.text}</p>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

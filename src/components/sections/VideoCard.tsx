'use client';

import * as React from 'react';
import { Play } from 'lucide-react';

interface VideoCardProps {
  src: string;
  poster: string;
  label: string;
  captions?: string;
}

/**
 * One client video. The poster carries a large play button; native controls
 * appear once it starts, and the button returns when it ends. Nothing loads
 * until it is pressed (preload="none").
 */
export function VideoCard({ src, poster, label, captions }: VideoCardProps) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);

  return (
    <div className="group relative aspect-[9/16] overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-cream/10">
      <video
        ref={ref}
        controls={playing}
        playsInline
        preload="none"
        poster={poster}
        aria-label={label}
        className="h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
        onEnded={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
        {captions && <track kind="captions" srcLang="he" label="עברית" src={captions} default />}
      </video>

      {!playing && (
        <button
          type="button"
          onClick={() => void ref.current?.play()}
          aria-label={`הפעלה: ${label}`}
          className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-navy/70 via-transparent to-navy/20 transition-colors hover:from-navy/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-light"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream/90 text-navy shadow-2xl backdrop-blur transition-transform duration-300 group-hover:scale-110">
            <Play className="h-9 w-9 translate-x-[-2px]" fill="currentColor" aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  );
}

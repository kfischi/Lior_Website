'use client';

import * as React from 'react';
import { Play } from 'lucide-react';

interface YouTubeCardProps {
  videoId: string;
  label: string;
  /** Optional local poster. Without one a plain panel is shown: nothing is fetched from YouTube before the click. */
  poster?: string;
  landscape?: boolean;
}

const ID_PATTERN = /^[\w-]{11}$/;

/**
 * A YouTube video behind a click. The player (and its cookies) loads from the
 * privacy-enhanced domain only after the visitor presses play.
 */
export function YouTubeCard({ videoId, label, poster, landscape }: YouTubeCardProps) {
  const [active, setActive] = React.useState(false);
  const frameRef = React.useRef<HTMLIFrameElement>(null);

  // The button that was focused is replaced by the player: hand the focus over to it.
  React.useEffect(() => {
    if (active) frameRef.current?.focus();
  }, [active]);

  if (!ID_PATTERN.test(videoId)) return null;

  const shape = landscape ? 'aspect-video' : 'aspect-[9/16]';

  return (
    <div
      className={`group relative ${shape} overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-cream/10`}
    >
      {active ? (
        <iframe
          ref={frameRef}
          tabIndex={-1}
          title={label}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&cc_load_policy=1&hl=he&cc_lang_pref=he`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <>
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element -- a small local poster, same as the other video cards
            <img
              src={poster}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-br from-navy to-black" />
          )}
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`הפעלה: ${label}`}
            className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-navy/70 via-transparent to-navy/20 transition-colors hover:from-navy/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-light"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream/90 text-navy shadow-2xl backdrop-blur transition-transform duration-300 group-hover:scale-110">
              <Play className="h-9 w-9 translate-x-[-2px]" fill="currentColor" aria-hidden="true" />
            </span>
            <span className="absolute inset-x-0 bottom-0 p-4 text-center text-xs text-cream/85">
              לחיצה על ההפעלה תטען את הסרטון מ־YouTube
            </span>
          </button>
        </>
      )}
    </div>
  );
}

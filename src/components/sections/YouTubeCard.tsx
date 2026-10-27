'use client';

import * as React from 'react';
import { Play } from 'lucide-react';

interface YouTubeCardProps {
  videoId: string;
  label: string;
  /** Optional local poster; otherwise YouTube's own thumbnail is used. */
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
  if (!ID_PATTERN.test(videoId)) return null;

  const thumb = poster ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const shape = landscape ? 'aspect-video' : 'aspect-[9/16]';

  return (
    <div
      className={`group relative ${shape} overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-cream/10`}
    >
      {active ? (
        <iframe
          title={label}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&cc_load_policy=1&hl=he&cc_lang_pref=he`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <>
          {/* Plain <img>: a remote YouTube thumbnail, outside the Cloudinary image loader. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`הפעלה: ${label}`}
            className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-navy/70 via-transparent to-navy/20 transition-colors hover:from-navy/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-light"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream/90 text-navy shadow-2xl backdrop-blur transition-transform duration-300 group-hover:scale-110">
              <Play className="h-9 w-9 translate-x-[-2px]" fill="currentColor" aria-hidden="true" />
            </span>
          </button>
        </>
      )}
    </div>
  );
}

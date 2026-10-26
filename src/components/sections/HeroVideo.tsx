'use client';

import * as React from 'react';

type HeroVideoProps = {
  src: string;
  /** Seconds to cut from the end of every loop (hides glitches in the last frames). */
  trimEnd?: number;
};

/**
 * Looping, muted background video. It restarts `trimEnd` seconds before the
 * file ends instead of using the native `loop`, so the final frames are never shown.
 */
export function HeroVideo({ src, trimEnd = 0 }: HeroVideoProps) {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = ref.current;
    if (!video || trimEnd <= 0) return;

    let frame = 0;
    const tick = () => {
      const { duration, currentTime } = video;
      if (Number.isFinite(duration) && duration > trimEnd && currentTime >= duration - trimEnd) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [trimEnd]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop={trimEnd <= 0}
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src={src} />
    </video>
  );
}

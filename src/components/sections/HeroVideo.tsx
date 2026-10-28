'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type HeroVideoProps = {
  src: string;
  /** Seconds to cut from the end of every loop (hides glitches in the last frames). */
  trimEnd?: number;
};

/** A playing video whose clock has not moved for this long is treated as stuck. */
const STALL_MS = 3500;
const MAX_RECOVERIES = 3;

type SaveDataConnection = { saveData?: boolean; effectiveType?: string };

function isConstrainedNetwork(): boolean {
  const connection = (navigator as Navigator & { connection?: SaveDataConnection }).connection;
  return Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? '');
}

/**
 * Looping, muted background video that is only shown once it is really playing.
 * Until then (and whenever it cannot play: data saver, blocked autoplay, a
 * stalled or failed download) the poster image underneath stays visible, so the
 * hero never freezes on a half-loaded frame or a black box.
 *
 * It restarts `trimEnd` seconds before the file ends instead of using the
 * native `loop`, so the final frames are never shown.
 */
export function HeroVideo({ src, trimEnd = 0 }: HeroVideoProps) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const video = ref.current;
    if (!video || failed) return;

    // Data saver / 2G: skip the download, the poster is enough.
    if (isConstrainedNetwork()) {
      const skip = requestAnimationFrame(() => setFailed(true));
      return () => cancelAnimationFrame(skip);
    }

    let visible = true;
    let frame = 0;
    let lastTime = -1;
    let lastMove = performance.now();
    let recoveries = 0;

    const start = () => {
      if (!visible || document.hidden) return;
      video.muted = true;
      void video.play().catch(() => undefined);
    };

    const onPlaying = () => {
      setPlaying(true);
      lastMove = performance.now();
    };
    const onFail = () => {
      setPlaying(false);
      setFailed(true);
    };

    // Wait/retry hooks: the browser fires these as soon as data is usable again.
    video.addEventListener('playing', onPlaying);
    video.addEventListener('canplay', start);
    video.addEventListener('error', onFail);

    const tick = (now: number) => {
      const { duration, currentTime, paused } = video;
      if (!paused && !video.seeking) {
        if (Math.abs(currentTime - lastTime) > 0.01) {
          lastTime = currentTime;
          lastMove = now;
        } else if (now - lastMove > STALL_MS) {
          // Frozen: reload from the start; after a few tries give up and keep the poster.
          lastMove = now;
          if (recoveries >= MAX_RECOVERIES) {
            onFail();
            return;
          }
          recoveries += 1;
          video.load();
          start();
        }
      }
      if (
        trimEnd > 0 &&
        Number.isFinite(duration) &&
        duration > trimEnd &&
        currentTime >= duration - trimEnd
      ) {
        video.currentTime = 0;
        start();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    // Play only while the hero is on screen and the tab is in front.
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
      else video.pause();
    });
    observer.observe(video);

    const onVisibility = () => (document.hidden ? video.pause() : start());
    document.addEventListener('visibilitychange', onVisibility);

    // iOS low-power mode and some browsers refuse autoplay until the first touch.
    const onGesture = () => start();
    window.addEventListener('touchstart', onGesture, { once: true, passive: true });
    window.addEventListener('pointerdown', onGesture, { once: true, passive: true });

    start();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('canplay', start);
      video.removeEventListener('error', onFail);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('touchstart', onGesture);
      window.removeEventListener('pointerdown', onGesture);
    };
  }, [trimEnd, failed]);

  if (failed) return null;

  return (
    <video
      ref={ref}
      className={cn(
        'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
        playing ? 'opacity-100' : 'opacity-0',
      )}
      autoPlay
      muted
      loop={trimEnd <= 0}
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

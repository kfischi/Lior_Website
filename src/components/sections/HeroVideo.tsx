'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { VideoSource } from '@/lib/media';

type HeroVideoProps = {
  /** Best source first; the browser takes the first one it can play. */
  sources: VideoSource[];
  /** Still frame the browser shows natively while nothing has been decoded yet. */
  poster?: string;
  /** Seconds to cut from the end of every loop (hides glitches in the last frames). */
  trimEnd?: number;
  /** Stretches of the clip (in seconds) that are skipped: playback jumps from `from` to `to`. */
  cuts?: readonly { from: number; to: number }[];
};

/** A playing video whose clock has not moved for this long is treated as stuck. */
const STALL_MS = 3500;
const MAX_RECOVERIES = 3;
/** A video that has shown nothing at all after this long is given up on. */
const LOAD_TIMEOUT_MS = 25000;
/** How often a paused-but-visible video is nudged to play again. */
const RESUME_EVERY_MS = 1000;

/**
 * Looping, muted background video that is only shown once it is really playing.
 * It is part of the server HTML so the browser starts downloading it while the page
 * is still being parsed, before React has loaded.
 * Until then (and whenever it cannot play: data saver, blocked autoplay, a
 * stalled or failed download) the poster image underneath stays visible, so the
 * hero never freezes on a half-loaded frame or a black box.
 *
 * It restarts `trimEnd` seconds before the file ends instead of using the
 * native `loop`, so the final frames are never shown.
 */
const NO_CUTS: readonly { from: number; to: number }[] = [];

export function HeroVideo({ sources, poster, trimEnd = 0, cuts = NO_CUTS }: HeroVideoProps) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const video = ref.current;
    if (!video || failed) return;

    let visible = true;
    let frame = 0;
    let lastTime = -1;
    let lastMove = performance.now();
    let lastNudge = 0;
    const startedAt = performance.now();
    let shown = false;
    let recoveries = 0;

    const start = () => {
      if (!visible || document.hidden) return;
      video.muted = true;
      void video.play().catch(() => undefined);
    };

    const show = () => {
      shown = true;
      setPlaying(true);
    };
    const onPlaying = () => {
      lastMove = performance.now();
      show();
    };
    const onFail = () => {
      setPlaying(false);
      setFailed(true);
    };

    // Wait/retry hooks: the browser fires these as soon as data is usable again.
    video.addEventListener('playing', onPlaying);
    video.addEventListener('canplay', start);
    // Capture: a failing <source> reports its error on the source, which does not bubble.
    const onError = (event: Event) => {
      // A source that cannot be used reports its error on itself, and the browser then
      // tries the next one. Only the last source failing means the video cannot play.
      if (event.target === video || event.target === video.querySelector('source:last-of-type')) {
        onFail();
      }
    };
    video.addEventListener('error', onError, true);

    const tick = (now: number) => {
      const { duration, currentTime, paused, readyState } = video;
      // Every source may already have failed before this effect attached its listeners.
      if (!shown && video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        onFail();
        return;
      }
      // Autoplay can already be running before this effect attached its listeners.
      if (!shown && !paused && readyState >= 3) show();
      if (paused) {
        lastMove = now;
        lastTime = currentTime;
        if (visible && !document.hidden && readyState >= 3 && now - lastNudge > RESUME_EVERY_MS) {
          lastNudge = now;
          start();
        }
      } else if (readyState < 2 && !shown) {
        // First download still running: not a stall, but do not wait forever.
        lastMove = now;
        if (now - startedAt > LOAD_TIMEOUT_MS) {
          onFail();
          return;
        }
      } else if (!video.seeking) {
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
      // A skipped stretch (for example a close-up that does not belong in the loop): jump over it.
      for (const cut of cuts) {
        if (!paused && currentTime >= cut.from && currentTime < cut.to) {
          video.currentTime = cut.to;
          break;
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
      video.removeEventListener('error', onError, true);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('touchstart', onGesture);
      window.removeEventListener('pointerdown', onGesture);
    };
  }, [trimEnd, cuts, failed]);

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
      poster={poster}
      disablePictureInPicture
      aria-hidden="true"
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}

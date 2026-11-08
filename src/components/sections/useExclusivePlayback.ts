'use client';

import * as React from 'react';

const EVENT = 'client-video-play';

/** Tells every other video card that this one started, so they stop. */
export function announcePlayback(id: string): void {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: id }));
}

/**
 * Only the video the visitor is looking at keeps playing: `stop` runs when another card starts,
 * or when less than `minVisible` of this card is still on screen after scrolling.
 */
export function useExclusivePlayback(
  id: string,
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  stop: () => void,
  minVisible = 0.4,
): void {
  const stopRef = React.useRef(stop);
  React.useEffect(() => {
    stopRef.current = stop;
  });

  React.useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) stopRef.current();
    };
    window.addEventListener(EVENT, onOther);
    return () => window.removeEventListener(EVENT, onOther);
  }, [id]);

  React.useEffect(() => {
    const el = ref.current;
    if (!active || !el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.intersectionRatio < minVisible) stopRef.current();
      },
      { threshold: [0, minVisible, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active, ref, minVisible]);
}

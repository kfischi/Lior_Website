'use client';

import * as React from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/**
 * `prefers-reduced-motion`, safe for server rendering: the server and the first client render both
 * say "no preference", then it switches to the real value. (motion's own hook can answer `true` on
 * the very first client render, which does not match the server HTML and raises a hydration error.)
 */
export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

'use client';
import type { AnalyticsEvent } from './sources';

/** Fire-and-forget; sends no identifiers. */
export function track(event: AnalyticsEvent): void {
  try {
    if (navigator.doNotTrack === '1') return;
    navigator.sendBeacon?.('/api/e', new Blob([JSON.stringify({ e: event })], { type: 'application/json' }));
  } catch {
    /* ignore */
  }
}

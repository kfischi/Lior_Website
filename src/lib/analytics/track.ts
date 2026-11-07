'use client';
import type { AnalyticsEvent } from './sources';
import { readAttribution } from './attribution';

/** Fire-and-forget; sends no identifiers. */
export function track(event: AnalyticsEvent): void {
  try {
    if (navigator.doNotTrack === '1') return;
    navigator.sendBeacon?.('/api/e', new Blob([JSON.stringify({ e: event, a: readAttribution().source || undefined })], { type: 'application/json' }));
  } catch {
    /* ignore */
  }
}

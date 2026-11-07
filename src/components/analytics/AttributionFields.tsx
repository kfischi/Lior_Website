'use client';

import { useSyncExternalStore } from 'react';
import { readAttribution } from '@/lib/analytics/attribution';

const subscribe = () => () => undefined;

/** Hidden form fields carrying the visit's coarse source and landing page (no personal data). */
export function AttributionFields() {
  const source = useSyncExternalStore(subscribe, () => readAttribution().source, () => '');
  const landing = useSyncExternalStore(subscribe, () => readAttribution().landing, () => '');
  return (
    <>
      <input type="hidden" name="src" value={source} />
      <input type="hidden" name="landing" value={landing} />
    </>
  );
}

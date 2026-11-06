'use client';

import { useEffect } from 'react';

/**
 * The Studio's own interface is built left-to-right (Hebrew text inside it still
 * flows right-to-left by itself). The site is RTL, so while the Studio is open the
 * page direction is switched, and put back when the editor leaves.
 */
export function StudioDirection() {
  useEffect(() => {
    const root = document.documentElement;
    const before = root.dir;
    root.dir = 'ltr';
    return () => {
      root.dir = before;
    };
  }, []);
  return null;
}

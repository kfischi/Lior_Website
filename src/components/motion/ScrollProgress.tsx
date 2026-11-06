'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { useReducedMotion } from './useReducedMotionSafe';

/** A hairline at the top of the page that fills as you read (from the right in RTL). */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  if (reduced) return null;
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-right bg-accent-light"
    />
  );
}

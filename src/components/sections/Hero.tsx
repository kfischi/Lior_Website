'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { brand } from '@/lib/brand';
import { HeroVideo } from './HeroVideo';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const hasVideo = Boolean(brand.hero.videoUrl);
  const ref = React.useRef<HTMLElement>(null);

  // The background drifts and grows slightly as the page scrolls.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const words = brand.hero.title.split(' ');
  const fade = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section
      ref={ref}
      aria-label="כותרת ראשית"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-navy"
    >
      {/* Background: poster image (also LCP + fallback), then the video on top */}
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y: mediaY, scale: mediaScale }}
      >
        {/* Poster and video share one frame, enlarged to crop the watermark out of the corners. */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${brand.hero.mediaFrame.zoom})`,
            transformOrigin: brand.hero.mediaFrame.origin,
          }}
        >
          <Image
            src={brand.hero.posterId || brand.hero.imageId}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {hasVideo && !reduced && (
            <HeroVideo src={brand.hero.videoUrl} trimEnd={brand.hero.videoTrimEnd} />
          )}
        </div>
      </motion.div>

      {/* Light scrims only where text sits, so the video keeps its colour.
          The copy is on the start (right) side in RTL, so that side is darkest. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-navy/85 via-navy/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-navy/45 to-transparent"
      />

      <div className="shell relative z-10 pb-64 pt-32 md:pb-28">
        <div className="max-w-4xl">
          <motion.p {...fade(0.1)} className="eyebrow mb-4 text-accent-light">
            {brand.firmName}
          </motion.p>

          <h1 className="text-[clamp(2.3rem,5.2vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-cream">
            {words.map((w, i) => (
              <React.Fragment key={`${w}-${i}`}>
                <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={reduced ? false : { y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.95, ease: EASE, delay: 0.25 + i * 0.1 }}
                  >
                    {w}
                  </motion.span>
                </span>{' '}
              </React.Fragment>
            ))}
          </h1>

          <motion.p
            {...fade(0.8)}
            className="mt-5 max-w-xl text-base leading-relaxed text-cream/95 md:text-lg"
          >
            {brand.hero.subtitle}
          </motion.p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center">
        <motion.a
          href="#why"
          aria-label="גלילה למטה"
          className="text-cream/60 hover:text-cream"
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-7 w-7" />
        </motion.a>
      </div>
    </section>
  );
}

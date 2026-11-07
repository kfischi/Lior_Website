'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '@/components/motion/useReducedMotionSafe';
import { ChevronDown, MessagesSquare, Phone } from 'lucide-react';
import { useBrand } from '@/components/layout/BrandProvider';
import { Button } from '@/components/ui/button';
import { OpenChatButton } from '@/components/ai/OpenChatButton';
import { videoSources } from '@/lib/media';
import { HeroVideo } from './HeroVideo';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const live = useBrand();
  const reduced = useReducedMotion();
  const hasVideo = Boolean(live.hero.videoUrl);
  const ref = React.useRef<HTMLElement>(null);

  // The background drifts and grows slightly as the page scrolls.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const words = live.hero.title.split(' ');
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
            transform: `scale(${live.hero.mediaFrame.zoom})`,
            transformOrigin: live.hero.mediaFrame.origin,
          }}
        >
          <Image
            src={live.hero.posterId || live.hero.imageId}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {hasVideo && !reduced && (
            <HeroVideo
              sources={videoSources(live.hero.videoUrl)}
              poster={live.hero.posterId}
              trimEnd={live.hero.videoTrimEnd}
              cuts={live.hero.videoCuts}
            />
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

      <div className="shell relative z-10 pb-72 pt-32 md:pb-28">
        <div className="max-w-4xl">
          <motion.p
            {...fade(0.1)}
            className="eyebrow mb-5 font-heading text-2xl font-semibold tracking-normal text-cream text-balance [text-shadow:0_0_2px_rgb(0_0_0/0.45),0_2px_14px_rgb(0_0_0/0.6)] max-sm:before:hidden max-sm:after:hidden md:text-4xl"
          >
            {live.hero.eyebrow}
          </motion.p>

          <h1 className="text-[clamp(2.3rem,5.2vw,4.5rem)] font-semibold leading-[1.04] tracking-tight text-cream drop-shadow-[0_2px_14px_rgb(0_0_0/0.55)]">
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
            className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-white [text-shadow:0_0_2px_rgb(0_0_0/0.5),0_2px_14px_rgb(0_0_0/0.7)]"
          >
            {live.hero.subtitle}
          </motion.p>

          {/* The first screen must say what to do next: talk to the assistant, or call. */}
          <motion.div {...fade(0.95)} className="mt-7 flex flex-wrap gap-3">
            <OpenChatButton size="lg" variant="accentOnDark">
              <MessagesSquare className="h-5 w-5" />
              {live.hero.primaryCta}
            </OpenChatButton>
            <Button asChild size="lg" variant="onDark">
              <a href={live.href.tel}>
                <Phone className="h-5 w-5" />
                <span dir="ltr">{live.phone}</span>
              </a>
            </Button>
          </motion.div>
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

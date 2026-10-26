'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { MessageCircle, MessagesSquare, ChevronDown } from 'lucide-react';
import { brand, whatsappHref } from '@/lib/brand';
import { Button } from '@/components/ui/button';
import { OpenChatButton } from '@/components/ai/OpenChatButton';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const hasVideo = Boolean(brand.hero.videoUrl);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const item = {
    hidden: reduced ? {} : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <section
      aria-label="כותרת ראשית"
      className="relative flex min-h-screen items-center overflow-hidden bg-navy"
    >
      {/* Background: poster image (also LCP + fallback) */}
      <Image
        src={brand.hero.posterId || brand.hero.imageId}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Cinematic video on top (skipped when motion is reduced) */}
      {hasVideo && !reduced && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={undefined}
          aria-hidden="true"
        >
          <source src={brand.hero.videoUrl} />
        </video>
      )}

      {/* Light scrims only where text sits, so the video keeps its colour.
          The copy is on the start (right) side in RTL, so that side is darkest. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-l from-navy/65 via-navy/25 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-navy/50 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-navy/45 to-transparent"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="shell relative z-10 py-32"
      >
        <div className="max-w-3xl">
          <motion.p variants={item} className="eyebrow mb-5 text-accent-light">
            {brand.firmName}
          </motion.p>
          <motion.h1 variants={item} className="display-xl font-bold text-cream [text-shadow:0_2px_28px_rgb(0_0_0/0.35)]">
            {brand.hero.title}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-cream/90 [text-shadow:0_1px_16px_rgb(0_0_0/0.4)] md:text-xl"
          >
            {brand.hero.subtitle}
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <OpenChatButton size="lg" variant="accentOnDark">
              <MessagesSquare className="h-5 w-5" />
              {brand.hero.primaryCta}
            </OpenChatButton>
            <Button asChild size="lg" variant="onDark">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                {brand.hero.secondaryCta}
              </a>
            </Button>
          </motion.div>
        </div>
      </motion.div>

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

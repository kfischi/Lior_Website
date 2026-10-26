'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Phone, MessageCircle, ChevronDown } from 'lucide-react';
import { brand, whatsappHref } from '@/lib/brand';
import { Button } from '@/components/ui/button';

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

      {/* Legibility overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-l from-navy/70 to-transparent"
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
          <motion.h1 variants={item} className="display-xl font-bold text-cream">
            {brand.hero.title}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85 md:text-xl"
          >
            {brand.hero.subtitle}
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" variant="accentOnDark">
              <a href="#contact">
                <Phone className="h-5 w-5" />
                {brand.hero.primaryCta}
              </a>
            </Button>
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

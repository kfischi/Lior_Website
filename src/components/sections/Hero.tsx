'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { MessageCircle, MessagesSquare, ChevronDown } from 'lucide-react';
import { brand, whatsappHref } from '@/lib/brand';
import { Button } from '@/components/ui/button';
import { OpenChatButton } from '@/components/ai/OpenChatButton';
import { Avatar } from '@/components/ai/ConciergePanel';
import { useConcierge } from '@/components/ai/ConciergeProvider';
import { HeroVideo } from './HeroVideo';

const EASE = [0.22, 1, 0.36, 1] as const;

/** A glass card that invites a conversation; each chip opens the chat with that question. */
function ChatInvite() {
  const { openPanel, send, startIntake } = useConcierge();

  return (
    <motion.aside
      aria-label="שיחה מהירה עם העוזר הדיגיטלי"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 1.1 }}
      className="absolute bottom-40 end-6 z-10 hidden w-[21rem] rounded-2xl border border-cream/20 bg-navy/40 p-5 text-cream shadow-2xl backdrop-blur-xl md:block lg:end-12"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12" />
        <div className="leading-snug">
          <p className="text-sm font-semibold">שאלו את העוזר הדיגיטלי של ליאור</p>
          <p className="text-xs text-cream/75">עונה על שאלות כלליות ומסדר פנייה למשרד</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {brand.chat.suggestedPrompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              openPanel();
              send(p);
            }}
            className="rounded-full border border-cream/25 bg-cream/10 px-3 py-1.5 text-xs text-cream transition-colors hover:bg-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={startIntake}
          className="rounded-full bg-accent-light px-3 py-1.5 text-xs font-medium text-navy transition-colors hover:bg-accent-light/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
        >
          קביעת ייעוץ
        </button>
      </div>
    </motion.aside>
  );
}

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
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-navy"
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
        className="absolute inset-0 bg-linear-to-l from-navy/70 via-navy/25 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-navy/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-navy/45 to-transparent"
      />

      <div className="shell relative z-10 py-32">
        <div className="max-w-4xl">
          <motion.p {...fade(0.1)} className="eyebrow mb-6 text-accent-light">
            {brand.firmName}
          </motion.p>

          <h1 className="display-2xl font-bold text-cream">
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
            className="mt-8 max-w-xl text-lg leading-relaxed text-cream/90 [text-shadow:0_1px_16px_rgb(0_0_0/0.4)] md:text-xl"
          >
            {brand.hero.subtitle}
          </motion.p>

          <motion.div {...fade(0.95)} className="mt-10 flex flex-wrap gap-4">
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
      </div>

      <ChatInvite />

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

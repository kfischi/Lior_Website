import Image from 'next/image';
import { brand, whatsappHref } from '@/lib/brand';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';

/**
 * Hero — skeleton. Final visual design is imported from V0 in step 3.
 * Uses next/image (Cloudinary loader) + a dark overlay for legibility.
 */
export function Hero() {
  return (
    <section
      aria-label="כותרת ראשית"
      className="relative flex min-h-[80vh] items-center overflow-hidden"
    >
      {/* Background image via Cloudinary loader */}
      <Image
        src={brand.hero.imageId}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Dark overlay for contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-l from-navy/90 via-navy/75 to-navy/50"
      />

      <div className="container relative z-10 py-24">
        <div className="max-w-2xl text-cream animate-fade-up">
          <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">
            {brand.hero.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-cream/90 md:text-xl">
            {brand.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button asChild size="lg" variant="accent">
              <a href="#contact">
                <Phone className="h-5 w-5" />
                {brand.hero.primaryCta}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cream/40 bg-transparent text-cream hover:bg-cream hover:text-navy"
            >
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                {brand.hero.secondaryCta}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

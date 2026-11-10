import Image from 'next/image';
import { brand, type HeroImageKey } from '@/lib/brand';

/**
 * A faded, desaturated picture behind a page's dark header. It is decoration only (empty alt), sits
 * below the text (-z-10, so the section needs `relative isolate overflow-hidden`) and is darkened
 * toward the page colour so headings keep their contrast. Which picture a page gets lives in
 * brand.ts (`heroImages`).
 */
export function HeroBackdrop({ name, priority = true }: { name: HeroImageKey; priority?: boolean }) {
  const src = brand.heroImages[name];
  if (!src) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover opacity-30 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-linear-to-b from-navy/70 via-navy/40 to-navy/90" />
    </div>
  );
}

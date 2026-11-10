import Image from 'next/image';
import { brand, type HeroImageKey } from '@/lib/brand';

/**
 * A faded, desaturated picture behind a section. It is decoration only (empty alt), sits below the
 * text (-z-10, so the section needs `relative isolate overflow-hidden`) and is toned toward the
 * section colour so the text keeps its contrast: `dark` for navy sections, `light` for cream/white
 * ones. Which picture belongs to which topic lives in brand.ts (`heroImages`).
 */
export function HeroBackdrop({
  name,
  tone = 'dark',
  priority = false,
}: {
  name: HeroImageKey;
  tone?: 'dark' | 'light';
  /** Only for the picture at the very top of a page. */
  priority?: boolean;
}) {
  const src = brand.heroImages[name];
  if (!src) return null;
  const dark = tone === 'dark';
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className={dark ? 'object-cover opacity-25 mix-blend-luminosity' : 'object-cover opacity-[0.13] grayscale'}
      />
      <div
        className={
          dark
            ? 'absolute inset-0 bg-linear-to-b from-navy/70 via-navy/40 to-navy/90'
            : 'absolute inset-0 bg-linear-to-b from-cream/70 via-transparent to-cream/80'
        }
      />
    </div>
  );
}

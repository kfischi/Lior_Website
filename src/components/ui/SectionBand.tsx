import Image from 'next/image';
import { brand, type HeroImageKey } from '@/lib/brand';
import { cn } from '@/lib/utils';

/** The colour of the section that follows the band: the picture fades into it. */
type Into = 'navy' | 'cream' | 'white';

const FADE: Record<Into, string> = {
  navy: 'from-navy',
  cream: 'from-cream',
  white: 'from-white',
};

/**
 * A picture band that opens a home page section, so a long scroll reads as separate chapters.
 * The picture is clearly visible; no text sits on it, and its lower part fades into the colour of
 * the section below so the heading that follows keeps full contrast. It is shorter on a phone
 * and shows a different part of the picture there. Decoration only.
 */
export function SectionBand({
  name,
  into,
  focus,
  className,
}: {
  name: HeroImageKey;
  into: Into;
  /** Which part of the picture stays in view on a phone, as a literal Tailwind class such as `max-md:object-[30%_50%]`. */
  focus?: string;
  className?: string;
}) {
  const src = brand.heroImages[name];
  if (!src) return null;
  return (
    <div aria-hidden="true" className={cn('relative h-40 overflow-hidden bg-navy sm:h-56 lg:h-80', className)}>
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        className={cn('object-cover object-center', focus)}
      />
      <div className="absolute inset-0 bg-navy/25" />
      <div className={cn('absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t to-transparent', FADE[into])} />
    </div>
  );
}

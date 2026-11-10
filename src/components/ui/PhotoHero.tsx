import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The opening of a page: a photo of her fills the section and the text sits on it. The picture is
 * mirrored so she stands opposite the text, and it is darkened only where the text is (the text
 * side on a desktop, the lower part on a phone), so the text always keeps its contrast.
 * On a phone the photo fills the upper part and the text begins where it fades out.
 */
export function PhotoHero({
  src,
  alt,
  labelledBy,
  focus = 'object-[50%_12%] lg:object-[50%_4%]',
  priority = true,
  className,
  children,
}: {
  src?: string;
  alt: string;
  /** The id of the page's h1. */
  labelledBy: string;
  /** Which part of the photo stays in view, as literal Tailwind classes. */
  focus?: string;
  priority?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(
        'relative isolate flex min-h-[92svh] items-end overflow-hidden bg-navy pb-14 pt-[44svh] text-cream md:pb-16 lg:min-h-[64svh] lg:items-center lg:pb-20 lg:pt-36',
        className,
      )}
    >
      {src && (
        <div className="absolute inset-x-0 top-0 -z-10 h-[68svh] lg:inset-y-0 lg:start-auto lg:h-auto lg:w-[62%]">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 62vw, 100vw"
            className={cn('-scale-x-100 object-cover', focus)}
          />
          <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/55 to-navy/0 lg:bg-linear-to-l lg:from-navy lg:via-navy/70 lg:to-navy/0" />
        </div>
      )}
      <div className="shell relative">{children}</div>
    </section>
  );
}

import { brand } from '@/lib/brand';

/**
 * A slow band of the practice areas and values, directly under the hero.
 * Pure CSS motion (see --animate-marquee); the second copy is hidden from
 * assistive technology, and reduced-motion users get it static.
 */
export function Marquee() {
  const words = [...brand.practiceAreas.map((a) => a.title), ...brand.marquee];
  // Repeat the list so one copy is always wider than the viewport.
  const row = [...words, ...words];

  return (
    <section
      aria-label="תחומי העיסוק והערכים שלנו"
      className="overflow-hidden border-y border-cream/10 bg-navy py-6 text-cream md:py-8"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-10 pe-10 md:gap-14 md:pe-14"
          >
            {row.map((word, i) => (
              <li
                key={`${word}-${i}`}
                className="flex items-center gap-10 whitespace-nowrap font-heading text-2xl text-cream/90 md:gap-14 md:text-4xl"
              >
                {word}
                <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-accent-light" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

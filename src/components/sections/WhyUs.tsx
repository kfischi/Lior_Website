import Image from 'next/image';
import { brand } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Icon } from './Icon';

/** Grid placement for each card on large screens: one tall feature card and three supporting ones. */
const PLACEMENT = [
  'lg:col-span-6 lg:row-span-2',
  'lg:col-span-6',
  'lg:col-span-3',
  'lg:col-span-3',
];

export function WhyUs() {
  const [feature, ...rest] = brand.whyUs;

  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className="section relative overflow-hidden bg-cream"
    >
      {/* Soft light and a fine dot grid give the section depth without noise. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-1/4 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(var(--brand-accent)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      />

      <div className="shell relative">
        <Reveal className="mb-14 grid items-end gap-6 md:mb-20 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow mb-4">היתרונות שלנו</p>
            <h2 id="why-title" className="display-xl text-navy">
              למה לבחור בנו
            </h2>
          </div>
          <p className="max-w-md border-accent/40 text-lg leading-relaxed text-ink/75 md:border-s-2 md:ps-6">
            {brand.whyUsIntro}
          </p>
        </Reveal>

        <Stagger as="ul" className="grid gap-5 lg:grid-cols-12 lg:grid-rows-2 lg:gap-6">
          {/* Feature card */}
          <StaggerItem
            as="li"
            className={cn(
              'group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-navy p-8 text-cream shadow-xl md:p-10',
              PLACEMENT[0],
            )}
          >
            <Image
              src={brand.logo.iconLight}
              alt=""
              width={brand.logo.iconSize.width}
              height={brand.logo.iconSize.height}
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -end-6 h-[26rem] w-auto opacity-[0.07] transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -start-24 -top-24 h-72 w-72 rounded-full bg-accent-light/20 blur-3xl"
            />
            <div className="relative flex items-start justify-between">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-light text-navy shadow-lg">
                <Icon name={feature.icon} className="h-8 w-8" />
              </span>
              <span
                aria-hidden="true"
                className="font-heading text-8xl leading-none text-cream/15 md:text-9xl"
              >
                01
              </span>
            </div>
            <div className="relative mt-16">
              <h3 className="font-heading text-4xl font-bold leading-tight md:text-5xl">{feature.title}</h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/85">{feature.description}</p>
            </div>
          </StaggerItem>

          {rest.map((item, i) => (
            <StaggerItem
              as="li"
              key={item.title}
              className={cn(
                'group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-navy/10 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-2xl md:p-8',
                PLACEMENT[i + 1],
              )}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-white">
                  <Icon name={item.icon} className="h-7 w-7" />
                </span>
                <span
                  aria-hidden="true"
                  className="font-heading text-6xl leading-none text-accent/20 transition-colors duration-500 group-hover:text-accent/40"
                >
                  {String(i + 2).padStart(2, '0')}
                </span>
              </div>
              <div className="mt-10">
                <h3 className="font-heading text-2xl font-bold text-navy">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/75">{item.description}</p>
              </div>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1 origin-right scale-x-0 bg-linear-to-l from-accent to-accent-light transition-transform duration-500 group-hover:scale-x-100"
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

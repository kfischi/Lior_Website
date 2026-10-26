import { brand } from '@/lib/brand';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Icon } from './Icon';

export function WhyUs() {
  return (
    <section id="why" aria-labelledby="why-title" className="section bg-cream">
      <div className="shell">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="eyebrow mb-4">היתרונות שלנו</p>
          <h2 id="why-title" className="text-4xl text-navy md:text-5xl">
            למה לבחור בנו
          </h2>
        </Reveal>

        <Stagger as="ul" className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {brand.whyUs.map((item, i) => (
            <StaggerItem as="li" key={item.title} className="border-t border-navy/20 pt-6">
              <div className="flex items-start justify-between">
                <span
                  aria-hidden="true"
                  className="font-heading text-6xl leading-none text-accent/25"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent ring-1 ring-accent/20">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-navy">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-ink/70">{item.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

import { brand } from '@/lib/brand';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Icon } from './Icon';

export function WhyUs() {
  return (
    <section id="why" aria-labelledby="why-title" className="section bg-cream">
      <div className="shell">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="eyebrow mb-3">היתרונות שלנו</p>
          <h2 id="why-title" className="text-3xl text-navy md:text-4xl">
            למה לבחור בנו
          </h2>
        </Reveal>

        <Stagger as="ul" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {brand.whyUs.map((item) => (
            <StaggerItem as="li" key={item.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent ring-1 ring-accent/20">
                <Icon name={item.icon} className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

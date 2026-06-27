import { brand } from '@/lib/brand';
import { Icon } from './Icon';

export function WhyUs() {
  return (
    <section id="why-us" aria-labelledby="why-us-title" className="bg-cream">
      <div className="container-section">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <p className="font-medium text-accent">היתרונות שלנו</p>
          <h2 id="why-us-title" className="mt-2 text-3xl font-bold text-navy md:text-4xl">
            למה לבחור בנו
          </h2>
        </header>

        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {brand.whyUs.map((item) => (
            <li key={item.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Icon name={item.icon} className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

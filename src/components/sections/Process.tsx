import { brand } from '@/lib/brand';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

/** Three calm steps that make the first move feel small. */
export function Process() {
  const { eyebrow, heading, steps } = brand.process;

  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="section relative overflow-hidden bg-navy text-cream"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 start-1/3 h-96 w-96 rounded-full bg-accent-light/15 blur-3xl"
      />
      <div className="shell relative">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="eyebrow mb-4 text-accent-light">{eyebrow}</p>
          <h2 id="process-title" className="display-xl text-cream">
            {heading}
          </h2>
        </Reveal>

        <Stagger as="ul" className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <StaggerItem
              as="li"
              key={step.title}
              className="group relative overflow-hidden rounded-[1.75rem] border border-cream/15 bg-cream/[0.06] p-8 pt-10 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent-light/60 hover:bg-cream/10"
            >
              <span
                aria-hidden="true"
                className="absolute -top-4 end-4 select-none font-heading text-[8rem] leading-none text-cream/[0.08] transition-colors duration-500 group-hover:text-accent-light/25"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                aria-hidden="true"
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent-light font-heading text-xl font-semibold text-navy"
              >
                {i + 1}
              </span>
              <h3 className="relative mt-8 font-heading text-3xl font-semibold text-cream">{step.title}</h3>
              <p className="relative mt-4 leading-relaxed text-cream/80">{step.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

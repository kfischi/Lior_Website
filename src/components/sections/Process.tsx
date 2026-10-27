import { brand } from '@/lib/brand';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

/** Three calm steps that make the first move feel small. */
export function Process() {
  const { eyebrow, heading, steps } = brand.process;

  return (
    <section id="process" aria-labelledby="process-title" className="section bg-navy/[0.04]">
      <div className="shell">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 id="process-title" className="text-4xl text-navy md:text-5xl">
            {heading}
          </h2>
        </Reveal>

        <div className="relative">
          {/* Line connecting the steps (desktop) */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[16.5%] top-8 hidden h-px bg-linear-to-l from-transparent via-accent/40 to-transparent md:block"
          />
          <Stagger as="ul" className="grid gap-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <StaggerItem as="li" key={step.title} className="relative text-center">
                <span
                  aria-hidden="true"
                  className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-cream font-heading text-2xl font-semibold text-accent shadow-sm"
                >
                  {i + 1}
                </span>
                <h3 className="mt-6 text-2xl text-navy">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs leading-relaxed text-ink/70">{step.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

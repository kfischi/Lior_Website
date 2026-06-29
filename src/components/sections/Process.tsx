import { site } from "@/content/site";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

export function Process() {
  const { process } = site;
  return (
    <section id="process" className="py-24 md:py-28">
      <div className="container-page">
        <SectionHeading eyebrow={process.eyebrow} title={process.title} />

        <div className="relative mt-16">
          {/* connecting line */}
          <div
            aria-hidden
            className="gold-divider absolute right-0 left-0 top-7 hidden h-px lg:block"
          />
          <ol className="grid gap-10 lg:grid-cols-4">
            {process.steps.map((step, i) => (
              <Reveal as="li" key={step.number} delay={i * 90} className="relative">
                <div className="relative z-10 mb-5 grid h-14 w-14 place-items-center rounded-full border-2 border-gold-400 bg-background font-display text-lg font-bold text-gold-600">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

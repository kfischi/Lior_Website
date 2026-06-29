import { site } from "@/content/site";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { QuoteIcon } from "../icons";

export function Testimonials() {
  const { testimonials } = site;
  return (
    <section id="testimonials" className="relative overflow-hidden bg-navy-900 py-24 text-white md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl"
      />
      <div className="container-page relative">
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          tone="light"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.items.map((t, i) => (
            <Reveal as="article" key={t.name} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition-colors duration-300 hover:border-gold-500/40 hover:bg-white/[0.07]">
                <QuoteIcon className="h-9 w-9 text-gold-400/80" />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-navy-100">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <span className="block font-display text-lg font-bold text-gold-300">
                    {t.name}
                  </span>
                  <span className="text-sm text-navy-200">{t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { site } from "@/content/site";
import { Reveal } from "../ui/Reveal";

export function Stats() {
  return (
    <section className="relative z-10 -mt-12 px-6">
      <div className="container-page">
        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-xl shadow-navy-900/5 md:grid-cols-4">
            {site.stats.map((stat) => (
              <div
                key={stat.label}
                className="group bg-surface px-6 py-8 text-center transition-colors hover:bg-gold-50"
              >
                <dd className="font-display text-3xl font-bold text-navy-800 transition-transform duration-300 group-hover:scale-105 md:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-sm font-medium text-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

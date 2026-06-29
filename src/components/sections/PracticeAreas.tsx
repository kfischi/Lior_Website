import { site } from "@/content/site";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { iconMap, type IconName } from "../icons";

export function PracticeAreas() {
  const { practiceAreas } = site;
  return (
    <section id="practice" className="py-24 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={practiceAreas.eyebrow}
          title={practiceAreas.title}
          subtitle={practiceAreas.subtitle}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.items.map((item, i) => {
            const Icon = iconMap[item.icon as IconName] ?? iconMap.scale;
            return (
              <Reveal as="article" key={item.title} delay={i * 70}>
                <div className="group h-full rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl hover:shadow-navy-900/5">
                  <span className="inline-grid h-14 w-14 place-items-center rounded-xl bg-navy-800 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-navy-900">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-navy-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

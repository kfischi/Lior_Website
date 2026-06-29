import { site } from "@/content/site";
import { Reveal } from "../ui/Reveal";
import { MediaFrame } from "../ui/MediaFrame";
import { CheckIcon } from "../icons";

export function About() {
  const { about } = site;
  return (
    <section id="about" className="bg-navy-50/60 py-24 md:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        {/* Visual */}
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <MediaFrame
              src={about.image}
              alt={about.imageAlt}
              kind="portrait"
              className="aspect-[4/5] w-full max-w-md shadow-2xl shadow-navy-900/20 lg:mx-0 mx-auto"
            />
            <div className="absolute -bottom-5 -start-3 rounded-xl bg-gold-500 px-6 py-4 shadow-lg">
              <p className="font-display text-lg font-bold text-navy-900">
                {about.signatureName}
              </p>
              <p className="text-xs font-medium text-navy-800">
                {about.signatureRole}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow-rule mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
              {about.eyebrow}
            </p>
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">
              {about.title}
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {about.credentials.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-700">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <span className="text-[0.95rem] font-medium text-navy-800">
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

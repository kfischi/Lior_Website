import { site } from "@/content/site";
import { Button } from "../ui/Button";
import { MediaFrame } from "../ui/MediaFrame";
import { ArrowIcon, CheckIcon } from "../icons";

const trustPoints = ["ייעוץ ראשוני ללא התחייבות", "דיסקרטיות מלאה", "זמינות אישית"];

export function Hero() {
  const { hero } = site;
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-navy-900 pt-28 pb-20 text-white md:pt-36 md:pb-28"
    >
      {/* ambient gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2">
        {/* Copy */}
        <div className="max-w-xl">
          <p className="eyebrow-rule mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl">
            {hero.title}
            <span className="mt-2 block text-gold-400">{hero.titleAccent}</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-100">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={hero.primaryCta.href} size="lg" variant="primary">
              {hero.primaryCta.label}
              <ArrowIcon className="h-5 w-5" />
            </Button>
            <Button href={hero.secondaryCta.href} size="lg" variant="ghost" className="border-white/25 text-white hover:border-gold-400 hover:text-gold-300">
              {hero.secondaryCta.label}
            </Button>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
            {trustPoints.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-navy-100">
                <CheckIcon className="h-4 w-4 text-gold-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <div className="relative">
          <MediaFrame
            src={hero.image}
            alt={hero.imageAlt}
            kind="hero"
            priority
            className="aspect-[4/5] w-full shadow-2xl shadow-navy-900/50"
          />
          {/* floating credential card */}
          <div className="absolute -bottom-6 start-6 rounded-xl border border-gold-500/30 bg-navy-800/95 px-5 py-4 shadow-xl backdrop-blur">
            <p className="font-display text-2xl font-bold text-gold-400">
              {site.stats[0].value}
            </p>
            <p className="text-xs text-navy-100">{site.stats[0].label}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

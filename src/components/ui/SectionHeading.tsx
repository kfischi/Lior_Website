import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  tone?: "dark" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "dark",
}: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-start";
  const titleColor = tone === "light" ? "text-white" : "text-navy-900";
  const subColor = tone === "light" ? "text-navy-100" : "text-muted";

  return (
    <Reveal className={`max-w-2xl ${alignCls}`}>
      {eyebrow && (
        <p
          className={`eyebrow-rule mb-3 text-sm font-semibold uppercase tracking-[0.18em] ${
            tone === "light" ? "text-gold-300" : "text-gold-600"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl sm:text-4xl md:text-[2.6rem] ${titleColor}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed ${subColor}`}>{subtitle}</p>
      )}
    </Reveal>
  );
}

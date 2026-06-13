"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const PHOTO_URL =
  "https://res.cloudinary.com/dptyfvwyo/image/upload/v1781356099/%D7%A8%D7%A9%D7%9E%D7%99_ta7dag.jpg";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const stats = [
  { value: 21, suffix: "+", label: "שנות ניסיון" },
  { value: 1000, suffix: "+", label: "תיקים טופלו", formatted: "1,000+" },
  { value: 3, suffix: "", label: "ערכאות שיפוט" },
];

const tags = ["פלילי", "רשלנות רפואית", "דיני משפחה", "נזיקין", "תעבורה"];

const bioLines = [
  "עו״ד ליאור-קלואי ארז היא עורכת דין בעלת ניסיון של למעלה מ-21 שנה, המתמחה במשפט הפלילי, רשלנות רפואית, דיני משפחה ונזיקין.",
  "לאורך הקריירה שלה ייצגה מאות לקוחות בתיקים מורכבים ורגישים — החל מחקירות משטרתיות ועד לעתירות בבית המשפט העליון.",
  "בין תחומי התמחותה הבולטים: ייצוג נפגעי רשלנות רפואית, לרבות משפחות נפגעים, ייצוג פלילי מלא בכל הערכאות, וליווי משפטי בדיני משפחה ונזיקין.",
  "המשרד ממוקם בחריש ומעניק שירות גם בזום, לנוחות מרבית של הלקוח.",
];

function AnimatedCounter({
  target,
  suffix,
  formatted,
  active,
}: {
  target: number;
  suffix: string;
  formatted?: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1600;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target]);

  const display = formatted && count >= target ? formatted : `${count.toLocaleString()}${suffix}`;

  return (
    <span className="font-playfair text-4xl md:text-5xl font-bold text-noir-gold">
      {display}
    </span>
  );
}

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { delay: i * 0.15, duration: 0.7, ease },
  });

  return (
    <section
      id="about"
      ref={ref}
      className="relative bg-noir-bg/70 py-24 md:py-36 px-6 md:px-12 overflow-hidden"
      dir="rtl"
    >
      {/* Subtle gold glow top-right */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #d4af37 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-0 md:gap-20 items-start">

          {/* ── Right column: Photo ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease }}
            className="relative mb-16 md:mb-0"
          >
            <div
              className="relative overflow-hidden"
              style={{
                borderRight: "3px solid #d4af37",
                maxWidth: 480,
              }}
            >
              <Image
                src={PHOTO_URL}
                alt='עו״ד ליאור-קלואי ארז'
                width={480}
                height={600}
                className="w-full object-cover object-top"
                style={{
                  filter: "saturate(0.85) contrast(1.05)",
                  display: "block",
                }}
                priority
              />
              {/* Bottom gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)",
                }}
              />
            </div>
          </motion.div>

          {/* ── Left column: Bio text ─────────────────────────────────────── */}
          <div className="relative">
            {/* Vertical gold separator */}
            <div
              className="hidden md:block absolute -right-10 top-0 bottom-0 w-px"
              style={{ background: "rgba(212,175,55,0.6)" }}
              aria-hidden="true"
            />

            {/* Label */}
            <motion.p
              {...stagger(0)}
              className="font-heebo text-noir-gold uppercase mb-5"
              style={{ letterSpacing: "0.2em", fontSize: 11 }}
            >
              פרופיל מקצועי
            </motion.p>

            {/* Headline */}
            <motion.h2
              {...stagger(1)}
              className="font-playfair text-3xl md:text-5xl font-bold text-noir-text leading-tight mb-2"
            >
              21 שנה של ניסיון.
            </motion.h2>
            <motion.h2
              {...stagger(2)}
              className="font-playfair text-3xl md:text-5xl font-bold text-noir-gold leading-tight mb-6"
            >
              תוצאות אמיתיות.
            </motion.h2>

            {/* Gold rule */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={inView ? { width: 60, opacity: 1 } : {}}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-noir-gold mb-8"
            />

            {/* Bio paragraphs */}
            <div className="space-y-4 mb-10">
              {bioLines.map((line, i) => (
                <motion.p
                  key={i}
                  {...stagger(3 + i)}
                  className="font-heebo leading-[1.9] text-[#c8c8c8]"
                  style={{ fontSize: 16 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              {...stagger(7)}
              className="grid grid-cols-3 gap-4 py-8 mb-8"
              style={{ borderTop: "1px solid rgba(212,175,55,0.2)", borderBottom: "1px solid rgba(212,175,55,0.2)" }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.12, duration: 0.6, ease }}
                >
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    formatted={stat.formatted}
                    active={inView}
                  />
                  <p className="font-heebo text-xs text-white/60 tracking-wide mt-2">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Tags */}
            <motion.div {...stagger(8)} className="flex flex-wrap gap-2 mb-10">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="font-heebo text-xs text-noir-muted px-3 py-1.5"
                  style={{ border: "1px solid #2a2a2a" }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.a
              {...stagger(9)}
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group inline-flex items-center gap-2 font-heebo text-sm text-noir-text/70 hover:text-noir-gold transition-colors duration-200"
            >
              <span
                className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
              >
                ←
              </span>
              <span className="relative">
                לתיאום פגישת ייעוץ
                <span
                  className="absolute bottom-0 right-0 h-px bg-noir-gold transition-all duration-300 w-0 group-hover:w-full"
                />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

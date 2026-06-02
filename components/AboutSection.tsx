"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 500, suffix: "+", label: "תיקים" },
  { value: 95, suffix: "%", label: "הצלחה" },
  { value: 24, suffix: "/7", label: "זמינות" },
];

function AnimatedCounter({
  target,
  suffix,
  active,
}: {
  target: number;
  suffix: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
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

  return (
    <span className="font-playfair text-4xl md:text-5xl font-bold text-noir-gold">
      {count}
      {suffix}
    </span>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative bg-noir-bg py-24 md:py-36 px-6 md:px-12 overflow-hidden"
      dir="rtl"
    >
      {/* Subtle background accent */}
      <div
        className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #d4af37 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Right — Portrait (in RTL, this appears on the right) */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative"
          >
            {/* Portrait placeholder */}
            <div
              className="relative w-full aspect-[3/4] bg-noir-surface overflow-hidden"
              style={{ border: "1px solid rgba(212,175,55,0.15)" }}
            >
              {/* Cinematic portrait placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 bg-gradient-to-t from-noir-bg via-transparent to-transparent">
                <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                  <div className="text-center opacity-20">
                    <div className="w-32 h-32 rounded-full bg-noir-elevated mx-auto mb-4" />
                    <div className="w-48 h-2 bg-noir-elevated mx-auto mb-2" />
                    <div className="w-32 h-2 bg-noir-elevated mx-auto" />
                  </div>
                </div>
              </div>

              {/* Corner decoration */}
              <div
                className="absolute top-0 right-0 w-16 h-16"
                style={{
                  borderTop: "2px solid #d4af37",
                  borderRight: "2px solid #d4af37",
                }}
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-0 w-16 h-16"
                style={{
                  borderBottom: "2px solid #d4af37",
                  borderLeft: "2px solid #d4af37",
                }}
                aria-hidden="true"
              />
            </div>

            {/* Floating experience badge */}
            <motion.div
              className="absolute -bottom-6 -left-6 bg-noir-accent px-6 py-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="font-playfair text-2xl font-bold text-white">20+</p>
              <p className="font-heebo text-xs text-white/80 tracking-wide">שנות ניסיון</p>
            </motion.div>
          </motion.div>

          {/* Left — Bio text (in RTL, left column) */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Gold vertical line */}
            <div
              className="hidden md:block absolute -right-12 top-0 bottom-0 w-px"
              style={{ background: "rgba(212,175,55,0.2)" }}
              aria-hidden="true"
            />

            {/* Section label */}
            <p className="font-heebo text-noir-gold text-xs uppercase tracking-[0.3em] mb-4">
              אודות המשרד
            </p>

            {/* Headline */}
            <h2 className="font-playfair text-3xl md:text-5xl font-bold text-noir-text leading-tight mb-8">
              20 שנות ניסיון.
              <br />
              <span className="text-noir-gold">אלפי תיקים. תוצאות.</span>
            </h2>

            {/* Bio paragraphs */}
            <div className="space-y-5 text-noir-text/70 font-heebo text-base leading-relaxed mb-12">
              <p>
                עם ניסיון של מעל עשרים שנה בדיני פלילים, משרדנו ייצג אלפי לקוחות מול
                מערכת האכיפה הישראלית — ממעצרים ראשוניים ועד דיונים בבית המשפט העליון.
              </p>
              <p>
                אנו מאמינים שכל אדם ראוי להגנה מקצועית ובלתי מתפשרת, ללא קשר לאישום
                המיוחס לו. הגישה שלנו: מהיר, אגרסיבי, ודיסקרטי לחלוטין.
              </p>
              <p>
                השירות שלנו זמין 24 שעות ביממה, שבעה ימים בשבוע — כי המציאות הפלילית
                לא מחכה לשעות פנאי.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8" style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                >
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    active={inView}
                  />
                  <p className="font-heebo text-xs text-noir-muted tracking-wide mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

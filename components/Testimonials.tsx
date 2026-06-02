"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    quote:
      "בזכות הייצוג המקצועי והאגרסיבי, התיק נסגר ללא כתב אישום. לא האמנתי שזה אפשרי.",
    initials: "א.כ.",
    caseType: "עבירת אלימות",
  },
  {
    quote:
      "זמינות 24/7 היא לא סיסמה — הם ענו לי בשלוש בלילה כשנעצרתי ופעלו מיידית. תוצאה מדהימה.",
    initials: "מ.ל.",
    caseType: "עבירת סמים",
  },
  {
    quote:
      "הדיסקרטיות והמקצועיות ברמה אחרת לגמרי. הם הגנו עלי כאילו הייתי המשפחה שלהם.",
    initials: "ד.ר.",
    caseType: "עבירה כלכלית",
  },
  {
    quote:
      "ייצגו את בני הקטין בחוכמה ובאנושיות. העתיד שלו נשמר, ולכך אני אסיר תודה לנצח.",
    initials: "ר.ש.",
    caseType: "עבירת נוער",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative bg-noir-bg py-24 md:py-36 px-6 overflow-hidden"
      dir="rtl"
      style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="font-heebo text-noir-gold text-xs uppercase tracking-[0.3em] mb-4">
            לקוחות מספרים
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-noir-text">
            המלצות
          </h2>
          <div className="w-16 h-px bg-noir-gold mx-auto mt-6" aria-hidden="true" />
        </motion.div>

        {/* Draggable Carousel */}
        <motion.div
          className="flex gap-6 overflow-x-auto pb-6 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ right: 0, left: -(testimonials.length - 1) * 380 }}
          dragElastic={0.05}
          style={{ scrollbarWidth: "none" }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-[320px] md:w-[380px] bg-noir-surface p-8 relative"
              style={{ border: "1px solid rgba(212,175,55,0.1)" }}
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: i * 0.1,
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Decorative quotation mark */}
              <div
                className="font-playfair text-8xl text-noir-gold/20 leading-none absolute top-4 right-6 select-none pointer-events-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              {/* Quote */}
              <p className="font-heebo text-noir-text/80 text-sm leading-relaxed mb-8 relative z-10 mt-6">
                {t.quote}
              </p>

              {/* Footer */}
              <div
                className="flex items-center justify-between pt-4"
                style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
              >
                <div>
                  <p className="font-playfair text-noir-gold font-semibold">
                    {t.initials}
                  </p>
                  <p className="font-heebo text-xs text-noir-muted tracking-wide mt-0.5">
                    {t.caseType}
                  </p>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, si) => (
                    <div
                      key={si}
                      className="w-2 h-2 bg-noir-gold"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Drag hint */}
        <motion.p
          className="text-center font-heebo text-xs text-noir-muted mt-4 tracking-wide"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          ← גרור לגלול →
        </motion.p>
      </div>
    </section>
  );
}

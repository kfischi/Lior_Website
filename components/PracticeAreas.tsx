"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Pill,
  Swords,
  ShieldAlert,
  BarChart2,
  Car,
  Users,
} from "lucide-react";

const areas = [
  {
    icon: Pill,
    title: "עבירות סמים",
    description: "החזקה, סחר ויבוא — הגנה מקצועית בכל שלבי ההליך",
  },
  {
    icon: Swords,
    title: "עבירות אלימות",
    description: "תקיפה, אלימות במשפחה ואיומים — ייצוג אגרסיבי ויעיל",
  },
  {
    icon: ShieldAlert,
    title: "עבירות מין",
    description: "טיפול בדיסקרטיות מוחלטת, עם דגש על הגנת המתלונן ועל זכויות הנאשם",
  },
  {
    icon: BarChart2,
    title: "עבירות כלכליות",
    description: "הונאה, מרמה, שוחד ועבירות צווארון לבן — ניסיון מוכח",
  },
  {
    icon: Car,
    title: "תעבורה",
    description: "שלילת רישיון, נהיגה בשכרות ותאונות קטלניות",
  },
  {
    icon: Users,
    title: "עבירות נוער",
    description: "גישה ייעודית לקטינים — הגנה שמשמרת עתיד",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function PracticeAreas() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section
      id="practice-areas"
      ref={ref}
      className="relative bg-noir-surface py-24 md:py-36 px-6 md:px-12"
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
            תחומי עיסוק
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-noir-text">
            ההתמחויות שלנו
          </h2>
          <div
            className="w-16 h-px bg-noir-gold mx-auto mt-6"
            aria-hidden="true"
          />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, i) => (
            <motion.div
              key={area.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="group relative bg-noir-bg p-8"
              style={{
                border: "1px solid rgba(212,175,55,0.1)",
                transition: "border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(212,175,55,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(212,175,55,0.1)";
              }}
            >
              {/* Icon */}
              <div className="mb-5">
                <area.icon
                  size={28}
                  className="text-noir-gold group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <h3 className="font-playfair text-xl font-semibold text-noir-text mb-3">
                {area.title}
              </h3>

              {/* Description */}
              <p className="font-heebo text-sm text-noir-muted leading-relaxed">
                {area.description}
              </p>

              {/* Bottom accent line — appears on hover */}
              <div
                className="absolute bottom-0 right-0 left-0 h-0.5 bg-noir-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-right"
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

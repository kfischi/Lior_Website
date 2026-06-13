"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Activity, Users, Briefcase, Scale, MapPin } from "lucide-react";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const areas = [
  {
    icon: Shield,
    title: "פלילי ותעבורה",
    body: "ייצוג לפני חקירה, מעצרי ימים, מעצרי תום הליכים, כל הערכאות, עתירות אסירים וחנינות.",
  },
  {
    icon: Activity,
    title: "רשלנות רפואית",
    body: "ייצוג נפגעי תרופות וזריקות, לרבות משפחות נפגעים — 21 שנות ניסיון מוכח.",
  },
  {
    icon: Users,
    title: "דיני משפחה",
    body: "צוואות וירושה, אפוטרופסות, הצהרות מוות, יפוי כוח מתמשך, צווי הרחקה.",
  },
  {
    icon: Briefcase,
    title: "דיני עבודה ונזיקין",
    body: "אפליה והתעמרות בעבודה, הטרדה מינית, נזיקין ללא הוכחת נזק, ביטוח לאומי, לשון הרע.",
  },
  {
    icon: Scale,
    title: "משפט אזרחי",
    body: "תביעות נזיקין, ליטיגציה אזרחית, ייצוג בכל הערכאות.",
  },
  {
    icon: MapPin,
    title: "זמינות ונגישות",
    body: "משרד בחריש | פגישות בזום בתיאום מראש.",
  },
];

function AreaCard({ area, index }: { area: typeof areas[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease }}
      className="group relative p-8 bg-noir-surface transition-all duration-300"
      style={{ border: "1px solid #2a2a2a" }}
      whileHover={{ y: -4, borderColor: "rgba(212,175,55,0.5)" }}
    >
      <div className="flex items-start gap-4 mb-4" dir="rtl">
        <area.icon size={22} className="text-noir-gold flex-shrink-0 mt-0.5" />
        <h3 className="font-playfair text-xl font-bold text-noir-text">{area.title}</h3>
      </div>
      <p className="font-heebo text-sm text-noir-muted leading-relaxed" dir="rtl">
        {area.body}
      </p>
    </motion.div>
  );
}

export default function PracticeAreas() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="practice-areas"
      className="relative bg-noir-bg/70 py-24 md:py-36 px-6 md:px-12"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            ref={ref}
            className="font-heebo text-noir-gold text-[11px] uppercase tracking-[0.35em] mb-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            תחומי התמחות
          </motion.p>
          <motion.h2
            className="font-playfair text-3xl md:text-5xl font-bold text-noir-text"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease }}
          >
            שירותים משפטיים
          </motion.h2>
          <motion.div
            className="h-px bg-noir-gold mx-auto mt-6"
            initial={{ width: 0 }}
            animate={inView ? { width: 60 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map((area, i) => (
            <AreaCard key={area.title} area={area} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { Award, Shield, MapPin } from "lucide-react";
import { useRef } from "react";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const items = [
  {
    icon: Award,
    title: "Practical Law — קבוצת פרקטיקל",
    sub: "החקירה הפלילית בראי הסנגור | יוני 2024",
  },
  {
    icon: Shield,
    title: "21+ שנות ניסיון",
    sub: "ייצוג בכל הערכאות",
  },
  {
    icon: MapPin,
    title: "חריש | זום",
    sub: "בתיאום מראש",
  },
];

export default function CredentialsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="relative z-10 bg-noir-bg/95 py-6 px-6 md:px-12"
      style={{
        borderTop: "1px solid rgba(212,175,55,0.2)",
        borderBottom: "1px solid rgba(212,175,55,0.2)",
      }}
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.6, ease }}
          >
            <item.icon size={20} className="text-noir-gold flex-shrink-0" />
            <div>
              <p className="font-heebo text-sm text-noir-text font-medium">{item.title}</p>
              <p className="font-heebo text-xs text-noir-muted mt-0.5">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

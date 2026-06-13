"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const contactBlocks = [
  {
    icon: Phone,
    label: "052-469-4158",
    href: "tel:0524694158",
    sub: "שיחה ראשונה ללא עלות",
  },
  {
    icon: Mail,
    label: "Lioraere@gmail.com",
    href: "mailto:Lioraere@gmail.com",
    sub: "מענה תוך 24 שעות",
  },
  {
    icon: MapPin,
    label: "רח׳ רימון 5, חריש",
    href: "https://maps.google.com/?q=רימון+5+חריש",
    sub: "שירות גם בזום",
    external: true,
  },
];

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { delay: i * 0.12, duration: 0.65, ease },
  });

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-noir-surface/70 py-28 md:py-40 px-6 overflow-hidden"
      dir="rtl"
      style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(139,0,0,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Label */}
        <motion.p
          {...stagger(0)}
          className="font-heebo text-noir-gold text-[11px] uppercase tracking-[0.35em] mb-5"
        >
          צרו קשר
        </motion.p>

        {/* Headline */}
        <motion.h2
          {...stagger(1)}
          className="font-playfair text-3xl md:text-5xl font-bold text-noir-text leading-tight mb-3"
        >
          נשמח לעמוד לרשותך
        </motion.h2>
        <motion.p
          {...stagger(2)}
          className="font-heebo text-noir-text/45 text-sm tracking-widest uppercase mb-10"
        >
          פנייה ראשונה חסויה לחלוטין
        </motion.p>

        {/* Gold rule */}
        <motion.div
          className="h-px bg-noir-gold mx-auto mb-14"
          initial={{ width: 0 }}
          animate={inView ? { width: 80 } : {}}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Contact blocks */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {contactBlocks.map((block, i) => (
            <motion.a
              key={block.label}
              {...stagger(3 + i)}
              href={block.href}
              {...(block.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col items-center gap-3 py-8 px-6 transition-colors duration-200"
              style={{ border: "1px solid rgba(212,175,55,0.12)" }}
              whileHover={{ borderColor: "rgba(212,175,55,0.4)", backgroundColor: "rgba(212,175,55,0.03)" }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                style={{ border: "1px solid rgba(212,175,55,0.25)" }}
              >
                <block.icon size={18} className="text-noir-gold" />
              </div>
              <span className="font-heebo text-base text-noir-text group-hover:text-noir-gold transition-colors duration-200">
                {block.label}
              </span>
              <span className="font-heebo text-xs text-noir-muted/60 tracking-wide">
                {block.sub}
              </span>
            </motion.a>
          ))}
        </div>

        {/* CTA buttons */}
        <motion.div
          {...stagger(6)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="tel:0524694158"
            className="flex items-center gap-3 bg-noir-accent text-white font-heebo font-medium px-10 py-4 text-sm tracking-widest uppercase"
            whileHover={{ backgroundColor: "#a00000" }}
            transition={{ duration: 0.2 }}
          >
            <Phone size={15} />
            חייגי עכשיו
          </motion.a>

          <motion.a
            href="mailto:Lioraere@gmail.com"
            className="flex items-center gap-3 font-heebo font-medium px-10 py-4 text-sm tracking-widest uppercase text-noir-gold bg-transparent"
            style={{ border: "1px solid rgba(212,175,55,0.5)" }}
            whileHover={{ backgroundColor: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.8)" }}
            transition={{ duration: 0.2 }}
          >
            <Mail size={15} />
            שלחי מייל
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

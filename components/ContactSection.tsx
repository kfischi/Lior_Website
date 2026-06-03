"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, MessageSquare } from "lucide-react";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const phone = process.env.NEXT_PUBLIC_LAWYER_PHONE || "+972-52-4694158";

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-noir-surface py-28 md:py-44 px-6 text-center overflow-hidden"
      dir="rtl"
      style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
    >
      {/* Subtle radial bg glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(139,0,0,0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section label */}
        <motion.p
          className="font-heebo text-noir-gold text-xs uppercase tracking-[0.3em] mb-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          צרו קשר
        </motion.p>

        {/* Headline */}
        <motion.h2
          className="font-playfair text-3xl md:text-6xl font-bold text-noir-text leading-tight mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          המעצר שלך לא מחכה.
          <br />
          <span className="text-noir-gold">גם אנחנו לא.</span>
        </motion.h2>

        {/* Gold rule */}
        <motion.div
          className="h-px bg-noir-gold mx-auto mb-10"
          initial={{ width: 0 }}
          animate={inView ? { width: 200 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ maxWidth: 200 }}
        />

        {/* Phone number */}
        <motion.a
          href={`tel:${phone}`}
          className="block font-playfair text-4xl md:text-6xl font-bold text-noir-text hover:text-noir-gold transition-colors duration-300 mb-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {phone}
        </motion.a>

        {/* Disclaimer */}
        <motion.p
          className="font-heebo text-xs text-noir-muted tracking-widest uppercase mb-14"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          שיחה ראשונה ללא עלות &nbsp;|&nbsp; חסוי לחלוטין
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {/* Primary CTA */}
          <motion.a
            href={`tel:${phone}`}
            className="flex items-center gap-3 bg-noir-accent text-white font-heebo font-medium px-10 py-4 text-sm tracking-widest uppercase"
            whileHover={{ backgroundColor: "#a00000", scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Phone size={16} />
            התקשר עכשיו
          </motion.a>

          {/* Secondary CTA — opens AI chat */}
          <motion.button
            onClick={() => {
              const btn = document.getElementById("ai-chat-trigger");
              btn?.click();
            }}
            className="flex items-center gap-3 font-heebo font-medium px-10 py-4 text-sm tracking-widest uppercase text-noir-gold bg-transparent"
            style={{ border: "1px solid #d4af37" }}
            whileHover={{ backgroundColor: "rgba(212,175,55,0.08)", scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <MessageSquare size={16} />
            שלח הודעה
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

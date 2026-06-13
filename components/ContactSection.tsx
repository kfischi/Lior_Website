"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Monitor } from "lucide-react";
import Image from "next/image";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const CARD_IMG = "https://res.cloudinary.com/dptyfvwyo/image/upload/v1781356410/card_fmfipl.png";

const contactItems = [
  {
    icon: Phone,
    label: "052-469-4158",
    href: "tel:0524694158",
  },
  {
    icon: Mail,
    label: "Lioraere@gmail.com",
    href: "mailto:Lioraere@gmail.com",
  },
  {
    icon: MapPin,
    label: "רח׳ רימון 5, חריש",
    href: "https://maps.google.com/?q=רימון+5+חריש",
    external: true,
  },
  {
    icon: Monitor,
    label: "פגישות בזום | בתיאום מראש",
    href: "#",
  },
];

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const stagger = (i: number) => ({
    initial: { opacity: 0, x: 40 },
    animate: inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 },
    transition: { delay: i * 0.1, duration: 0.65, ease },
  });

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-noir-bg/70 py-24 md:py-36 px-6 md:px-12 overflow-hidden"
      dir="rtl"
      style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">

          {/* Right column — contact details */}
          <div>
            <motion.p {...stagger(0)} className="font-heebo text-noir-gold text-[11px] uppercase tracking-[0.35em] mb-5">
              צרו קשר
            </motion.p>

            <motion.h2 {...stagger(1)} className="font-playfair text-3xl md:text-5xl font-bold text-noir-text leading-tight mb-4">
              נשמח לעמוד לרשותך
            </motion.h2>

            <motion.div
              className="h-px bg-noir-gold mb-5"
              initial={{ width: 0, opacity: 0 }}
              animate={inView ? { width: 60, opacity: 1 } : {}}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.p {...stagger(2)} className="font-heebo text-noir-muted text-sm tracking-widest uppercase mb-10">
              פנייה ראשונה חסויה לחלוטין
            </motion.p>

            {/* Contact items */}
            <div className="space-y-6 mb-10">
              {contactItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  {...stagger(3 + i)}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-4 group"
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                    style={{ border: "1px solid rgba(212,175,55,0.25)" }}
                  >
                    <item.icon size={16} className="text-noir-gold" />
                  </div>
                  <span className="font-heebo text-base text-noir-text/80 group-hover:text-noir-gold transition-colors duration-200">
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* CTA buttons */}
            <motion.div
              {...stagger(7)}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="tel:0524694158"
                className="flex items-center gap-3 bg-noir-accent text-white font-heebo font-medium px-8 py-4 text-sm tracking-widest uppercase"
                whileHover={{ backgroundColor: "#a00000" }}
                transition={{ duration: 0.2 }}
              >
                <Phone size={15} />
                חייגי עכשיו
              </motion.a>
              <motion.a
                href="mailto:Lioraere@gmail.com"
                className="flex items-center gap-3 font-heebo font-medium px-8 py-4 text-sm tracking-widest uppercase text-noir-gold"
                style={{ border: "1px solid #d4af37" }}
                whileHover={{ backgroundColor: "rgba(212,175,55,0.06)" }}
                transition={{ duration: 0.2 }}
              >
                <Mail size={15} />
                שלחי מייל
              </motion.a>
            </motion.div>

            <motion.p
              {...stagger(8)}
              className="font-heebo text-[11px] text-noir-muted/50 mt-8"
            >
              האתר אינו מהווה ייעוץ משפטי
            </motion.p>
          </div>

          {/* Left column — business card */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease }}
          >
            <motion.div
              className="w-full max-w-md"
              whileHover={{ rotate: 0 }}
              style={{
                rotate: -2,
                transition: "transform 0.4s ease",
              }}
            >
              <Image
                src={CARD_IMG}
                alt="כרטיס ביקור — עו״ד ליאור-קלואי ארז"
                width={520}
                height={290}
                className="w-full h-auto"
                style={{
                  border: "1px solid rgba(212,175,55,0.2)",
                  filter: "saturate(0.9)",
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.08)",
                }}
              />
            </motion.div>
            <p className="font-heebo text-[11px] text-noir-muted/50 tracking-widest">
              פרטי המשרד
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

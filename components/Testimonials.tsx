"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Youtube, X } from "lucide-react";
import Image from "next/image";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const CLOUD = "dptyfvwyo";

// ← לינקי YouTube של המלצות הלקוחות
const videos = [
  {
    youtubeUrl: "https://www.youtube.com/shorts/y84XQuiUilE",
    thumb: "https://img.youtube.com/vi/y84XQuiUilE/hqdefault.jpg",
    initials: "ל.מ",
    caseType: "משפט פלילי",
  },
  {
    youtubeUrl: "https://youtu.be/WgO6rikPJDQ",
    thumb: "https://img.youtube.com/vi/WgO6rikPJDQ/hqdefault.jpg",
    initials: "מ.כ",
    caseType: "דיני עבודה",
  },
  {
    youtubeUrl: "https://youtube.com/shorts/AfU8MaoeqUA",
    thumb: "https://img.youtube.com/vi/AfU8MaoeqUA/hqdefault.jpg",
    initials: "ר.א",
    caseType: "רשלנות רפואית",
  },
];

const LETTER_IMG = `https://res.cloudinary.com/${CLOUD}/image/upload/v1781363457/4_wa9dg7.jpg`;

const WRITTEN_QUOTE = `לפני שטיפלה בי, חיי היו סערה של הרבה כאב מכל מיני תחומים.
מהיום הראשון נכנסתי ומצאתי הקשבה מלאה, מסירות ותקווה.

תמיד עמדת שם בשבילי — זה באמת לא ברור מאליו.
נתת לי תחושה שיש על מי לסמוך, כל שאלה בכל שעה נענית.
כל שיחה איתך היתה מעצימה ותמיד הראת לי את הדרך אל האור.

אני רוצה לאמר לך תודה עמוקה על הדרך שבה ליוית אותי.
סידרת לי תיקים לא פשוטים ונתת לי שקט נפשי אמיתי.
אלפי תודות.`;

function VideoCard({ v, index }: { v: typeof videos[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      className="group relative flex flex-col overflow-hidden"
      style={{ border: "1px solid #2a2a2a" }}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease }}
      whileHover={{ borderColor: "rgba(212,175,55,0.4)" }}
    >
      {/* Thumbnail area */}
      <div
        className="relative flex items-center justify-center bg-noir-elevated overflow-hidden"
        style={{ aspectRatio: "9/16", maxHeight: 380 }}
      >
        {/* YouTube thumbnail */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={v.thumb}
          alt={v.caseType}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "saturate(0.8) brightness(0.55)" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-bg/80 via-transparent to-transparent" />

        {/* Play overlay */}
        <div className="relative z-10 flex flex-col items-center gap-4 transition-transform duration-300 group-hover:scale-110">
          <div
            className="w-16 h-16 flex items-center justify-center"
            style={{ border: "1.5px solid rgba(212,175,55,0.7)", background: "rgba(0,0,0,0.5)" }}
          >
            <Youtube size={28} className="text-noir-gold" />
          </div>
        </div>
      </div>

      {/* CTA button */}
      <motion.a
        href={v.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-5 py-4 bg-noir-surface group-hover:bg-noir-elevated transition-colors duration-200"
        dir="rtl"
        whileHover={{ backgroundColor: "#0d0d0d" }}
      >
        <div className="flex items-center gap-3">
          {/* Initials badge */}
          <div
            className="w-9 h-9 flex items-center justify-center flex-shrink-0"
            style={{ border: "1px solid rgba(212,175,55,0.3)" }}
          >
            <span className="font-playfair text-noir-gold text-xs font-semibold">
              {v.initials}
            </span>
          </div>
          <div>
            <p className="font-heebo text-sm text-noir-text font-medium">
              צפה בהמלצה
            </p>
            <p className="font-heebo text-[11px] text-noir-muted">
              YouTube ↗
            </p>
          </div>
        </div>

        {/* Arrow */}
        <motion.span
          className="text-noir-gold text-lg leading-none"
          initial={{ x: 0 }}
          whileHover={{ x: -4 }}
          transition={{ duration: 0.2 }}
        >
          ←
        </motion.span>
      </motion.a>
    </motion.div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [lightbox, setLightbox] = useState(false);

  return (
    <section
      id="testimonials"
      className="relative bg-noir-surface/70 py-24 md:py-36 px-6 md:px-12"
      dir="rtl"
      style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14" ref={ref}>
          <motion.p
            className="font-heebo text-noir-gold text-[11px] uppercase tracking-[0.35em] mb-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            לקוחות ממליצים
          </motion.p>
          <motion.h2
            className="font-playfair text-3xl md:text-5xl font-bold text-noir-text"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease }}
          >
            מה אומרים עלינו
          </motion.h2>
          <motion.div
            className="h-px bg-noir-gold mx-auto mt-6"
            initial={{ width: 0 }}
            animate={inView ? { width: 60 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Video cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {videos.map((v, i) => (
            <VideoCard key={i} v={v} index={i} />
          ))}
        </div>

        {/* Written testimonial */}
        <motion.div
          className="relative p-8 md:p-12 overflow-hidden"
          style={{
            background: "#0f0f0f",
            border: "1px solid rgba(212,175,55,0.15)",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7, ease }}
          dir="rtl"
        >
          {/* Decorative quote */}
          <span
            className="absolute top-4 right-8 font-playfair text-[120px] leading-none text-noir-gold pointer-events-none select-none"
            style={{ opacity: 0.08 }}
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <p
            className="font-heebo text-base leading-[1.9] relative z-10 mb-8 whitespace-pre-line"
            style={{ color: "#c8c8c8" }}
          >
            {WRITTEN_QUOTE}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="font-playfair text-noir-gold text-sm font-semibold">לי׳אה | 3.4.18</p>
            <button
              onClick={() => setLightbox(true)}
              className="font-heebo text-xs text-noir-muted hover:text-noir-gold transition-colors duration-200 underline underline-offset-4 bg-transparent border-none"
            >
              צפה במכתב המקורי
            </button>
          </div>
        </motion.div>

        <p className="font-heebo text-[11px] text-noir-muted/50 text-center mt-4">
          * שמות ופרטים שונו לצורך שמירה על פרטיות הלקוחות
        </p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <motion.div
              className="relative max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(false)}
                className="absolute -top-10 left-0 text-noir-muted hover:text-white transition-colors bg-transparent border-none"
                aria-label="סגור"
              >
                <X size={24} />
              </button>
              <Image
                src={LETTER_IMG}
                alt="מכתב המלצה"
                width={800}
                height={600}
                className="w-full h-auto"
                style={{ border: "1px solid rgba(212,175,55,0.2)" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

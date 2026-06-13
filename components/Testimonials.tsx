"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Youtube, Play, X } from "lucide-react";
import Image from "next/image";

const ease = [0.25, 0.46, 0.45, 0.94] as const;
const CLOUD = "dptyfvwyo";

const LETTER_IMG = `https://res.cloudinary.com/${CLOUD}/image/upload/v1781363457/4_wa9dg7.jpg`;

type VideoItem =
  | { type: "youtube"; url: string; thumb: string; initials: string; caseType: string }
  | { type: "cloudinary"; src: string; thumb: string; initials: string; caseType: string };

const videos: VideoItem[] = [
  {
    type: "youtube",
    url: "https://www.youtube.com/shorts/y84XQuiUilE",
    thumb: "https://img.youtube.com/vi/y84XQuiUilE/hqdefault.jpg",
    initials: "ל.מ",
    caseType: "משפט פלילי",
  },
  {
    type: "youtube",
    url: "https://youtu.be/WgO6rikPJDQ",
    thumb: "https://img.youtube.com/vi/WgO6rikPJDQ/hqdefault.jpg",
    initials: "מ.כ",
    caseType: "דיני עבודה",
  },
  {
    type: "youtube",
    url: "https://youtube.com/shorts/AfU8MaoeqUA",
    thumb: "https://img.youtube.com/vi/AfU8MaoeqUA/hqdefault.jpg",
    initials: "ר.א",
    caseType: "רשלנות רפואית",
  },
  {
    type: "cloudinary",
    src: `https://res.cloudinary.com/${CLOUD}/video/upload/v1781363458/1_mslyru.mp4`,
    thumb: `https://res.cloudinary.com/${CLOUD}/video/upload/f_jpg,q_auto,w_480,so_1/1_mslyru.jpg`,
    initials: "א.ל",
    caseType: "משפט פלילי",
  },
  {
    type: "cloudinary",
    src: `https://res.cloudinary.com/${CLOUD}/video/upload/v1781363468/2_ctkwoq.mp4`,
    thumb: `https://res.cloudinary.com/${CLOUD}/video/upload/f_jpg,q_auto,w_480,so_1/2_ctkwoq.jpg`,
    initials: "ש.כ",
    caseType: "דיני משפחה",
  },
  {
    type: "cloudinary",
    src: `https://res.cloudinary.com/${CLOUD}/video/upload/v1781363482/3_t0bcwk.mp4`,
    thumb: `https://res.cloudinary.com/${CLOUD}/video/upload/f_jpg,q_auto,w_480,so_1/3_t0bcwk.jpg`,
    initials: "נ.ב",
    caseType: "רשלנות רפואית",
  },
];

const WRITTEN_QUOTE = `לפני שטיפלה בי, חיי היו סערה של הרבה כאב מכל מיני תחומים.
מהיום הראשון נכנסתי ומצאתי הקשבה מלאה, מסירות ותקווה.

תמיד עמדת שם בשבילי — זה באמת לא ברור מאליו.
נתת לי תחושה שיש על מי לסמוך, כל שאלה בכל שעה נענית.
כל שיחה איתך היתה מעצימה ותמיד הראת לי את הדרך אל האור.

אני רוצה לאמר לך תודה עמוקה על הדרך שבה ליוית אותי.
סידרת לי תיקים לא פשוטים ונתת לי שקט נפשי אמיתי.
אלפי תודות.`;

function VideoCard({
  v,
  index,
  onOpen,
}: {
  v: VideoItem;
  index: number;
  onOpen: (src: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const isYT = v.type === "youtube";

  const handleClick = () => {
    if (isYT) window.open(v.url, "_blank", "noopener,noreferrer");
    else onOpen(v.src);
  };

  return (
    <motion.div
      ref={ref}
      className="group relative flex flex-col overflow-hidden"
      style={{ border: "1px solid #2a2a2a" }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease }}
      whileHover={{ borderColor: "rgba(212,175,55,0.4)" }}
    >
      {/* Thumbnail */}
      <div
        className="relative flex items-center justify-center bg-noir-elevated overflow-hidden"
        style={{ aspectRatio: "9/16", maxHeight: 340 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={v.thumb}
          alt={v.caseType}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: "saturate(0.75) brightness(0.5)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-bg/80 via-transparent to-transparent" />

        {/* Icon */}
        <div className="relative z-10 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-110">
          <div
            className="w-16 h-16 flex items-center justify-center"
            style={{ border: "1.5px solid rgba(212,175,55,0.7)", background: "rgba(0,0,0,0.55)" }}
          >
            {isYT
              ? <Youtube size={26} className="text-noir-gold" />
              : <Play size={24} className="text-noir-gold mr-[-2px]" />
            }
          </div>
          <span
            className="font-heebo text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(212,175,55,0.7)" }}
          >
            {isYT ? "YouTube" : "צפה בסרטון"}
          </span>
        </div>
      </div>

      {/* CTA bar */}
      <button
        onClick={handleClick}
        className="flex items-center justify-between px-5 py-4 bg-noir-surface hover:bg-noir-elevated transition-colors duration-200 w-full text-right"
        dir="rtl"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center flex-shrink-0"
            style={{ border: "1px solid rgba(212,175,55,0.3)" }}
          >
            <span className="font-playfair text-noir-gold text-xs font-semibold">{v.initials}</span>
          </div>
          <div className="text-right">
            <p className="font-heebo text-sm text-noir-text font-medium">צפה בהמלצה</p>
            <p className="font-heebo text-[11px] text-noir-muted">{v.caseType}</p>
          </div>
        </div>
        <span className="text-noir-gold text-base leading-none group-hover:-translate-x-1 transition-transform duration-200">←</span>
      </button>
    </motion.div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [letterOpen, setLetterOpen] = useState(false);

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

        {/* 6-card grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-12">
          {videos.map((v, i) => (
            <VideoCard key={i} v={v} index={i} onOpen={(src) => setLightbox(src)} />
          ))}
        </div>

        {/* Written testimonial */}
        <motion.div
          className="relative p-8 md:p-12 overflow-hidden"
          style={{ background: "#0f0f0f", border: "1px solid rgba(212,175,55,0.15)" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7, ease }}
          dir="rtl"
        >
          <span
            className="absolute top-4 right-8 font-playfair text-[120px] leading-none text-noir-gold pointer-events-none select-none"
            style={{ opacity: 0.08 }}
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p className="font-heebo text-base leading-[1.9] relative z-10 mb-8 whitespace-pre-line" style={{ color: "#c8c8c8" }}>
            {WRITTEN_QUOTE}
          </p>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="font-playfair text-noir-gold text-sm font-semibold">לי׳אה | 3.4.18</p>
            <button
              onClick={() => setLetterOpen(true)}
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

      {/* Cloudinary video lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.93)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative w-full max-w-xs"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-10 right-0 text-noir-muted hover:text-white transition-colors bg-transparent border-none"
                aria-label="סגור"
              >
                <X size={24} />
              </button>
              <video
                src={lightbox}
                controls
                autoPlay
                playsInline
                className="w-full h-auto"
                style={{
                  border: "1px solid rgba(212,175,55,0.2)",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter lightbox */}
      <AnimatePresence>
        {letterOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.93)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLetterOpen(false)}
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
                onClick={() => setLetterOpen(false)}
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

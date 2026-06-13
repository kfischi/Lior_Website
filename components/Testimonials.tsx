"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Play, X } from "lucide-react";
import Image from "next/image";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const CLOUD = "dptyfvwyo";

const videos = [
  {
    src: `https://res.cloudinary.com/${CLOUD}/video/upload/f_auto,q_auto,w_640/1_mslyru.mp4`,
    initials: "ל.מ",
    caseType: "משפט פלילי",
  },
  {
    src: `https://res.cloudinary.com/${CLOUD}/video/upload/f_auto,q_auto,w_640/2_ctkwoq.mp4`,
    initials: "מ.כ",
    caseType: "דיני עבודה",
  },
  {
    src: `https://res.cloudinary.com/${CLOUD}/video/upload/f_auto,q_auto,w_640/3_t0bcwk.mp4`,
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
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    <motion.div
      ref={ref}
      className="group relative bg-noir-surface overflow-hidden"
      style={{ border: "1px solid #2a2a2a", aspectRatio: "9/16", maxHeight: 420 }}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease }}
      whileHover={{ borderColor: "rgba(212,175,55,0.4)" }}
    >
      <video
        ref={videoRef}
        controls={playing}
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      >
        <source src={v.src} type="video/mp4" />
      </video>

      {/* Play overlay */}
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30"
          onClick={handlePlay}
        >
          <div
            className="w-14 h-14 flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            style={{ border: "2px solid #d4af37" }}
          >
            <Play size={22} className="text-noir-gold mr-[-2px]" />
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(0,0,0,0.6)" }}
        dir="rtl"
      >
        <span className="font-playfair text-noir-gold font-semibold text-sm">{v.initials}</span>
        <span className="font-heebo text-noir-muted text-xs">{v.caseType}</span>
      </div>
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
            <VideoCard key={v.src} v={v} index={i} />
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
          {/* Decorative quote mark */}
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
              className="font-heebo text-xs text-noir-muted hover:text-noir-gold transition-colors duration-200 underline underline-offset-4 bg-transparent border-none cursor-pointer"
            >
              צפה במכתב המקורי
            </button>
          </div>
        </motion.div>

        {/* Disclaimer */}
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

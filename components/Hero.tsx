"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Phone } from "lucide-react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dptyfvwyo";
const VIDEO_ID   = process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_PUBLIC_ID || "HERO_u4uu8h";

const SRC_DESKTOP = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto:best,w_1920,vc_auto,f_auto/${VIDEO_ID}.mp4`;
const SRC_MOBILE  = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto:best,w_768,vc_auto,f_auto/${VIDEO_ID}.mp4`;
const SRC_WEBM    = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto:best,w_1920,vc_vp9,f_webm/${VIDEO_ID}.webm`;

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const phone = process.env.NEXT_PUBLIC_LAWYER_PHONE || "+972-50-0000000";

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const vid = videoRef.current;
    if (vid) vid.play().catch(() => null);
  }, []);

  const scrollToAbout = () =>
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      className="relative w-full overflow-hidden flex items-end justify-center"
      style={{ height: "100svh", minHeight: 600 }}
    >
      {/* ── Layer 0: Video ────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src={SRC_WEBM} type="video/webm" />
        <source src={isMobile ? SRC_MOBILE : SRC_DESKTOP} type="video/mp4" />
      </video>

      {/* ── Layer 1: Cinematic gradient ───────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 10,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.92) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Layer 2: Radial vignette ──────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 11,
          background:
            "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.70) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Layer 3: Letterbox bars ───────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-[3vh] bg-black" style={{ zIndex: 12 }} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 h-[3vh] bg-black" style={{ zIndex: 12 }} aria-hidden="true" />

      {/* ── Layer 4: Film grain ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          zIndex: 13,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          animation: "grain 8s steps(10) infinite",
        }}
        aria-hidden="true"
      />

      {/* ── Layer 5: Content ──────────────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center text-center px-6 max-w-4xl mx-auto w-full pb-28 md:pb-36"
        style={{ zIndex: 40 }}
        dir="rtl"
      >
        {/* Gold eyebrow */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
        >
          <div className="w-10 h-px bg-noir-gold/60" />
          <p className="font-heebo text-noir-gold text-[11px] md:text-xs uppercase tracking-[0.45em] font-medium">
            עורכת דין פלילית בכירה
          </p>
          <div className="w-10 h-px bg-noir-gold/60" />
        </motion.div>

        {/* Headline line 1 */}
        <motion.h1
          className="font-playfair font-bold text-white leading-[0.95] mb-2"
          style={{ fontSize: "clamp(52px, 9vw, 108px)" }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.9, ease }}
        >
          ההגנה שלך
        </motion.h1>

        {/* Headline line 2 */}
        <motion.h1
          className="font-playfair font-bold leading-[0.95] mb-8"
          style={{
            fontSize: "clamp(52px, 9vw, 108px)",
            color: "#d4af37",
            textShadow: "0 0 50px rgba(212,175,55,0.20)",
          }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.9, ease }}
        >
          מתחילה כאן
        </motion.h1>

        {/* Animated gold rule — grows from center */}
        <motion.div className="relative flex items-center gap-4 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-noir-gold to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 260 }}
            transition={{ delay: 1.0, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-noir-gold flex-shrink-0"
            style={{ rotate: 45 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, duration: 0.35 }}
          />
          <motion.div
            className="h-px bg-gradient-to-l from-transparent via-noir-gold to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 260 }}
            transition={{ delay: 1.0, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        {/* Subheadline */}
        <motion.p
          className="font-heebo text-white/55 text-xs md:text-sm mb-12"
          style={{ letterSpacing: "0.22em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 0.8 }}
        >
          ייעוץ משפטי חסוי&emsp;|&emsp;זמין 24/7&emsp;|&emsp;ניסיון של עשרות שנים
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7, ease }}
        >
          <motion.a
            href={`tel:${phone}`}
            className="group relative inline-flex items-center gap-3 font-heebo font-medium text-noir-gold px-10 py-4 text-xs md:text-sm tracking-[0.3em] uppercase overflow-hidden"
            style={{ border: "1px solid rgba(212,175,55,0.6)" }}
            whileHover="hover"
            initial="rest"
          >
            <motion.span
              className="absolute inset-0 bg-noir-accent"
              variants={{ rest: { scaleX: 0, originX: "100%" }, hover: { scaleX: 1, originX: "100%" } }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="relative z-10 flex items-center gap-3">
              <Phone size={14} />
              צור קשר עכשיו
            </span>
          </motion.a>
        </motion.div>
      </div>

      {/* ── Emergency badge ───────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-[5vh] right-6 md:right-10 flex items-center gap-3 font-heebo text-[11px] tracking-widest text-white/65 uppercase"
        style={{ zIndex: 40 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.7 }}
        dir="rtl"
      >
        <motion.span
          className="w-2 h-2 rounded-full bg-noir-accent flex-shrink-0"
          animate={{
            boxShadow: [
              "0 0 0px 0px rgba(139,0,0,0)",
              "0 0 6px 4px rgba(139,0,0,0.8)",
              "0 0 0px 0px rgba(139,0,0,0)",
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span>זמין 24/7 — חירום</span>
      </motion.div>

      {/* ── Scroll indicator ──────────────────────────────────────────────── */}
      <motion.button
        className="absolute bottom-[5vh] left-1/2 -translate-x-1/2 text-white/30 hover:text-noir-gold transition-colors duration-300 bg-transparent border-none"
        style={{ zIndex: 40 }}
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 2.2, duration: 0.5 },
          y: { delay: 2.2, duration: 2.0, repeat: Infinity, ease: "easeInOut" },
        }}
        aria-label="גלול מטה"
      >
        <ChevronDown size={22} strokeWidth={1.5} />
      </motion.button>
    </section>
  );
}

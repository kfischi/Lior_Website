"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Phone } from "lucide-react";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  },
});

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, delay, ease: "easeOut" },
  },
});

export default function Hero() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const videoId = process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_PUBLIC_ID || "hero-background-video";
  const phone = process.env.NEXT_PUBLIC_LAWYER_PHONE || "+972-50-0000000";

  // Responsive video source — mobile gets smaller file
  const videoSrc = useMemo(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return cloudName
        ? `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto,w_768,vc_auto/${videoId}.mp4`
        : null;
    }
    return cloudName
      ? `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto,w_1920,vc_auto/${videoId}.mp4`
      : null;
  }, [cloudName, videoId]);

  const videoSrcWebm = useMemo(() => {
    if (!cloudName) return null;
    const width = typeof window !== "undefined" && window.innerWidth < 768 ? 768 : 1920;
    // f_webm,vc_vp9 → WebM with VP9 codec (better compression for Chrome/Firefox)
    return `https://res.cloudinary.com/${cloudName}/video/upload/f_webm,q_auto,w_${width},vc_vp9/${videoId}.webm`;
  }, [cloudName, videoId]);

  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
      {/* Layer 0 — Cloudinary Video */}
      {videoSrc ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          {/* f_auto → auto format; q_auto → AI quality; w_1920 → max width; vc_auto → auto codec */}
          {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        /* Fallback gradient when no Cloudinary config */
        <div
          className="absolute inset-0 bg-gradient-to-br from-noir-bg via-[#0d0000] to-noir-bg"
          style={{ zIndex: 0 }}
        />
      )}

      {/* Layer 1 — Black overlay (opacity-60) */}
      <div
        className="absolute inset-0 bg-black/60"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      />

      {/* Layer 2 — Vignette */}
      <div
        className="absolute inset-0 bg-vignette pointer-events-none"
        style={{ zIndex: 20 }}
        aria-hidden="true"
      />

      {/* Layer 3 — Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          zIndex: 30,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      {/* Layer 4 — Content */}
      <div
        className="relative z-40 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
        dir="rtl"
      >
        {/* Gold label */}
        <motion.p
          variants={fadeIn(0.3)}
          initial="hidden"
          animate="visible"
          className="text-noir-gold font-heebo text-xs md:text-sm uppercase tracking-[0.3em] mb-6 font-medium"
        >
          עורך דין פלילי בכיר
        </motion.p>

        {/* Headline line 1 */}
        <motion.h1
          variants={fadeUp(0.6)}
          initial="hidden"
          animate="visible"
          className="font-playfair font-bold text-noir-text leading-tight"
          style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
        >
          ההגנה שלך
        </motion.h1>

        {/* Headline line 2 */}
        <motion.h1
          variants={fadeUp(0.8)}
          initial="hidden"
          animate="visible"
          className="font-playfair font-bold text-noir-gold leading-tight mb-6"
          style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
        >
          מתחילה כאן
        </motion.h1>

        {/* Gold rule */}
        <motion.div
          className="h-px bg-noir-gold mb-8 mx-auto"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          style={{ maxWidth: 320 }}
        />

        {/* Subheadline */}
        <motion.p
          variants={fadeIn(1.2)}
          initial="hidden"
          animate="visible"
          className="font-heebo text-noir-text/70 text-sm md:text-base tracking-wide mb-10"
          style={{ letterSpacing: "0.08em" }}
        >
          ייעוץ משפטי חסוי &nbsp;|&nbsp; זמין 24/7 &nbsp;|&nbsp; ניסיון של עשרות שנים
        </motion.p>

        {/* CTA Button */}
        <motion.div
          variants={fadeIn(1.4)}
          initial="hidden"
          animate="visible"
        >
          <motion.a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-3 font-heebo font-medium text-noir-gold px-10 py-4 text-sm tracking-widest uppercase"
            style={{
              border: "1px solid #d4af37",
              background: "transparent",
            }}
            whileHover={{
              backgroundColor: "#8b0000",
              scale: 1.02,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Phone size={15} />
            צור קשר עכשיו
          </motion.a>
        </motion.div>
      </div>

      {/* Emergency badge — bottom-left */}
      <motion.div
        className="absolute bottom-10 right-8 z-40 flex items-center gap-3 font-heebo text-xs tracking-wide text-noir-text/80"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        dir="rtl"
      >
        <motion.span
          className="w-2.5 h-2.5 rounded-full bg-noir-accent"
          animate={{
            boxShadow: [
              "0 0 4px 2px rgba(139,0,0,0.8)",
              "0 0 10px 5px rgba(139,0,0,0.3)",
              "0 0 4px 2px rgba(139,0,0,0.8)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span>זמין 24/7 — חירום</span>
      </motion.div>

      {/* Scroll indicator — bottom-center */}
      <motion.button
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 text-noir-text/40 hover:text-noir-gold transition-colors bg-transparent border-none"
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 2, duration: 0.5 },
          y: { delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        aria-label="גלול מטה"
      >
        <ChevronDown size={28} />
      </motion.button>
    </section>
  );
}

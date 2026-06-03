"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, Phone } from "lucide-react";

// ─── Cloudinary config (hardcoded from production upload) ───────────────────
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dptyfvwyo";
const VIDEO_ID   = process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_PUBLIC_ID || "HERO_u4uu8h";

// Build Cloudinary URL with full cinematic transformations:
//   q_auto:best  → max quality (no visible compression artifacts)
//   w_1920       → full HD width cap
//   vc_auto      → browser-native codec (H.264 on Safari, VP9 on Chrome)
//   f_auto       → format negotiation (mp4/webm)
const SRC_DESKTOP = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto:best,w_1920,vc_auto,f_auto/${VIDEO_ID}.mp4`;
const SRC_MOBILE  = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto:best,w_768,vc_auto,f_auto/${VIDEO_ID}.mp4`;
const SRC_WEBM    = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto:best,w_1920,vc_vp9,f_webm/${VIDEO_ID}.webm`;

// ─── Cinematic letter-by-letter reveal ─────────────────────────────────────
function SplitText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.65,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const phone = process.env.NEXT_PUBLIC_LAWYER_PHONE || "+972-50-0000000";

  // Parallax: video drifts at 40% scroll speed (cinematic depth)
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 800], ["0%", "20%"]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Ensure video plays on iOS (requires explicit play call after user interaction)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const tryPlay = () => vid.play().catch(() => null);
    vid.addEventListener("canplaythrough", () => { setVideoReady(true); tryPlay(); });
    vid.addEventListener("loadeddata", () => setVideoReady(true));
    tryPlay();
  }, []);

  const scrollToAbout = () =>
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ height: "100svh", minHeight: 600 }}
    >
      {/* ── Layer 0: Video with parallax ─────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 w-full"
        style={{ y: videoY, height: "120%", top: "-10%" }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ zIndex: 0 }}
          onCanPlayThrough={() => setVideoReady(true)}
        >
          {/* VP9/WebM first — better quality/size on Chrome, Firefox */}
          <source src={SRC_WEBM} type="video/webm" />
          {/* H.264 fallback — Safari, older browsers */}
          <source src={isMobile ? SRC_MOBILE : SRC_DESKTOP} type="video/mp4" />
        </video>
      </motion.div>

      {/* ── Layer 1: Multi-stop cinematic gradient ────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 10,
          background: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.55) 0%,
              rgba(0,0,0,0.30) 30%,
              rgba(0,0,0,0.45) 65%,
              rgba(0,0,0,0.88) 100%
            )
          `,
        }}
        aria-hidden="true"
      />

      {/* ── Layer 2: Radial vignette ──────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 11,
          background:
            "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 38%, rgba(0,0,0,0.75) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Layer 3: Horizontal letterbox bars (cinematic crop) ──────────── */}
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
        className="relative flex flex-col items-center text-center px-6 max-w-4xl mx-auto w-full"
        style={{ zIndex: 40 }}
        dir="rtl"
      >
        {/* Gold eyebrow */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-10 h-px bg-noir-gold/60" />
          <p className="font-heebo text-noir-gold text-[11px] md:text-xs uppercase tracking-[0.45em] font-medium">
            עורכת דין פלילית בכירה
          </p>
          <div className="w-10 h-px bg-noir-gold/60" />
        </motion.div>

        {/* Main headline — split text reveal */}
        <h1
          className="font-playfair font-bold text-white leading-[0.95] mb-2"
          style={{ fontSize: "clamp(52px, 9vw, 108px)" }}
        >
          <SplitText text="ההגנה שלך" delay={0.35} />
        </h1>
        <h1
          className="font-playfair font-bold leading-[0.95] mb-8"
          style={{
            fontSize: "clamp(52px, 9vw, 108px)",
            color: "#d4af37",
            textShadow: "0 0 60px rgba(212,175,55,0.25)",
          }}
        >
          <SplitText text="מתחילה כאן" delay={0.55} />
        </h1>

        {/* Animated gold rule */}
        <motion.div
          className="relative flex items-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-noir-gold to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 280 }}
            transition={{ delay: 1.1, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-noir-gold flex-shrink-0"
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ delay: 1.6, duration: 0.4 }}
          />
          <motion.div
            className="h-px bg-gradient-to-l from-transparent via-noir-gold to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 280 }}
            transition={{ delay: 1.1, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        {/* Subheadline */}
        <motion.p
          className="font-heebo text-white/60 text-xs md:text-sm mb-12"
          style={{ letterSpacing: "0.25em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          ייעוץ משפטי חסוי&emsp;|&emsp;זמין 24/7&emsp;|&emsp;ניסיון של עשרות שנים
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.a
            href={`tel:${phone}`}
            className="group relative inline-flex items-center gap-3 font-heebo font-medium text-noir-gold px-10 py-4 text-xs md:text-sm tracking-[0.3em] uppercase overflow-hidden"
            style={{ border: "1px solid rgba(212,175,55,0.6)" }}
            whileHover="hover"
            initial="rest"
          >
            {/* Fill on hover */}
            <motion.span
              className="absolute inset-0 bg-noir-accent"
              variants={{ rest: { scaleX: 0, originX: 1 }, hover: { scaleX: 1, originX: 1 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="relative z-10 flex items-center gap-3">
              <Phone size={14} />
              צור קשר עכשיו
            </span>
          </motion.a>
        </motion.div>
      </div>

      {/* ── Emergency badge — bottom-right (RTL) ─────────────────────────── */}
      <motion.div
        className="absolute bottom-[5vh] right-6 md:right-10 flex items-center gap-3 font-heebo text-[11px] tracking-widest text-white/70 uppercase"
        style={{ zIndex: 40 }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2, duration: 0.7 }}
        dir="rtl"
      >
        <motion.span
          className="w-2 h-2 rounded-full bg-noir-accent flex-shrink-0"
          animate={{
            boxShadow: [
              "0 0 0px 0px rgba(139,0,0,0)",
              "0 0 0px 5px rgba(139,0,0,0)",
              "0 0 6px 3px rgba(139,0,0,0.9)",
              "0 0 0px 0px rgba(139,0,0,0)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span>זמין 24/7 — חירום</span>
      </motion.div>

      {/* ── Scroll indicator — bottom-center ─────────────────────────────── */}
      <motion.button
        className="absolute bottom-[5vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-noir-gold transition-colors duration-300 bg-transparent border-none"
        style={{ zIndex: 40 }}
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        aria-label="גלול מטה"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        >
          <ChevronDown size={22} strokeWidth={1.5} />
        </motion.div>
      </motion.button>
    </section>
  );
}

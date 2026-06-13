"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility, X, ZoomIn, ZoomOut, Eye, Type, MousePointer, RotateCcw } from "lucide-react";

type Settings = {
  fontSize: number;       // 0 = normal, 1 = +20%, 2 = +40%
  contrast: boolean;      // high contrast
  grayscale: boolean;
  underlineLinks: boolean;
  readingGuide: boolean;
  cursorLarge: boolean;
};

const DEFAULT: Settings = {
  fontSize: 0, contrast: false, grayscale: false,
  underlineLinks: false, readingGuide: false, cursorLarge: false,
};

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<Settings>(DEFAULT);
  const [guideY, setGuideY] = useState(0);

  // Apply styles to <html>
  useEffect(() => {
    const html = document.documentElement;
    const fontSizes = ["", "a11y-font-md", "a11y-font-lg"];
    html.classList.remove("a11y-font-md", "a11y-font-lg");
    if (s.fontSize > 0) html.classList.add(fontSizes[s.fontSize]);
    html.classList.toggle("a11y-contrast", s.contrast);
    html.classList.toggle("a11y-grayscale", s.grayscale);
    html.classList.toggle("a11y-underline", s.underlineLinks);
    html.classList.toggle("a11y-cursor", s.cursorLarge);
  }, [s]);

  useEffect(() => {
    if (!s.readingGuide) return;
    const move = (e: MouseEvent) => setGuideY(e.clientY);
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [s.readingGuide]);

  const toggle = (key: keyof Settings) =>
    setS((prev) => ({ ...prev, [key]: !prev[key] }));

  const btn = (
    icon: React.ReactNode,
    label: string,
    active: boolean,
    onClick: () => void
  ) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="flex items-center gap-3 w-full px-4 py-3 font-heebo text-sm text-right transition-colors border-none"
      style={{
        background: active ? "rgba(212,175,55,0.12)" : "transparent",
        borderLeft: active ? "2px solid #d4af37" : "2px solid transparent",
        color: active ? "#d4af37" : "#e8e8e8",
      }}
      dir="rtl"
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <>
      {/* Reading guide line */}
      {s.readingGuide && (
        <div
          className="fixed left-0 right-0 z-[9999] pointer-events-none"
          style={{
            top: guideY - 18,
            height: 36,
            background: "rgba(212,175,55,0.08)",
            borderTop: "1px solid rgba(212,175,55,0.3)",
            borderBottom: "1px solid rgba(212,175,55,0.3)",
          }}
        />
      )}

      {/* Trigger */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="פתח תפריט נגישות"
        className="fixed left-4 bottom-24 z-[150] w-12 h-12 flex items-center justify-center bg-noir-accent text-white shadow-lg border-none"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.15 }}
      >
        <Accessibility size={22} />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed left-4 bottom-40 z-[150] w-72 bg-noir-surface overflow-hidden"
            style={{ border: "1px solid rgba(212,175,55,0.2)", boxShadow: "0 0 40px rgba(0,0,0,0.7)" }}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            dir="rtl"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid rgba(212,175,55,0.12)" }}
            >
              <span className="font-heebo text-sm font-medium text-noir-text">הגדרות נגישות</span>
              <button
                onClick={() => setOpen(false)}
                className="text-noir-muted hover:text-noir-text transition-colors bg-transparent border-none"
              >
                <X size={16} />
              </button>
            </div>

            {/* Controls */}
            <div className="py-1">
              {/* Font size */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(42,42,42,0.8)" }}>
                <span className="font-heebo text-sm text-noir-text/80">גודל טקסט</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((v) => (
                    <button
                      key={v}
                      onClick={() => setS((p) => ({ ...p, fontSize: v }))}
                      className="w-8 h-8 flex items-center justify-center font-heebo text-xs border-none"
                      style={{
                        background: s.fontSize === v ? "#d4af37" : "rgba(255,255,255,0.06)",
                        color: s.fontSize === v ? "#0a0a0a" : "#e8e8e8",
                      }}
                    >
                      {v === 0 ? "A" : v === 1 ? "A+" : "A++"}
                    </button>
                  ))}
                </div>
              </div>

              {btn(<Eye size={16} />, "ניגודיות גבוהה", s.contrast, () => toggle("contrast"))}
              {btn(<Type size={16} />, "הדגש קישורים", s.underlineLinks, () => toggle("underlineLinks"))}
              {btn(<MousePointer size={16} />, "סמן גדול", s.cursorLarge, () => toggle("cursorLarge"))}
              {btn(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="2" rx="1"/></svg>,
                "מדריך קריאה",
                s.readingGuide,
                () => toggle("readingGuide")
              )}
              {btn(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>,
                "גווני אפור",
                s.grayscale,
                () => toggle("grayscale")
              )}
            </div>

            {/* Reset */}
            <div style={{ borderTop: "1px solid rgba(42,42,42,0.8)" }}>
              <button
                onClick={() => setS(DEFAULT)}
                className="flex items-center gap-2 w-full px-4 py-3 font-heebo text-xs text-noir-muted hover:text-noir-text transition-colors border-none bg-transparent"
                dir="rtl"
              >
                <RotateCcw size={13} />
                איפוס הגדרות
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility CSS injected globally */}
      <style jsx global>{`
        .a11y-font-md { font-size: 120% !important; }
        .a11y-font-lg { font-size: 140% !important; }
        .a11y-contrast { filter: contrast(1.5) !important; }
        .a11y-grayscale { filter: grayscale(1) !important; }
        .a11y-underline a { text-decoration: underline !important; }
        .a11y-cursor, .a11y-cursor * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='8' cy='8' r='6' fill='%23d4af37' stroke='%23000' stroke-width='1.5'/%3E%3Cline x1='8' y1='14' x2='8' y2='32' stroke='%23000' stroke-width='2'/%3E%3Cline x1='0' y1='8' x2='32' y2='8' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E") 8 8, crosshair !important; }
      `}</style>
    </>
  );
}

"use client";

import { Scale } from "lucide-react";

const navLinks = [
  { label: "אודות", href: "#about" },
  { label: "תחומי עיסוק", href: "#practice-areas" },
  { label: "המלצות", href: "#testimonials" },
  { label: "צור קשר", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const handleAnchor = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="bg-noir-bg px-6 md:px-12 py-10"
      dir="rtl"
      style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Right — Logo */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-noir-gold" />
            <span className="font-playfair text-base text-noir-text">ליאור כהן</span>
            <span className="text-noir-muted text-xs font-heebo mr-1">עורך דין</span>
          </div>

          {/* Center — Nav */}
          <nav className="flex items-center gap-6 flex-wrap justify-center">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleAnchor(link.href)}
                className="font-heebo text-xs text-noir-muted hover:text-noir-gold transition-colors duration-200 bg-transparent border-none tracking-wide"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Left — Bar Association Badge */}
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{ border: "1px solid rgba(212,175,55,0.15)" }}
          >
            <Scale size={14} className="text-noir-gold" />
            <span className="font-heebo text-xs text-noir-muted">
              לשכת עורכי הדין בישראל
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-noir-muted font-heebo text-xs"
          style={{ borderTop: "1px solid rgba(42,42,42,0.8)" }}
        >
          <p>כל הזכויות שמורות © {year} — משרד עורכי דין ליאור כהן</p>
          <p className="text-noir-muted/50">
            האתר אינו מהווה ייעוץ משפטי | אין יחסי עו&quot;ד–לקוח ללא הסכם בכתב
          </p>
        </div>
      </div>
    </footer>
  );
}

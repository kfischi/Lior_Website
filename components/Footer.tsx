"use client";

import { Scale } from "lucide-react";
import Link from "next/link";

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
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Right — Logo */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-noir-gold" />
            <span className="font-playfair text-base text-noir-text">עו״ד ליאור-קלואי ארז</span>
          </div>

          {/* Center — Contact details */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-heebo text-xs text-noir-muted">
            <a href="tel:0524694158" className="hover:text-noir-gold transition-colors">
              052-469-4158
            </a>
            <span className="text-noir-border hidden md:inline">|</span>
            <a href="mailto:Lioraere@gmail.com" className="hover:text-noir-gold transition-colors">
              Lioraere@gmail.com
            </a>
            <span className="text-noir-border hidden md:inline">|</span>
            <a
              href="https://maps.google.com/?q=רימון+5+חריש"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-noir-gold transition-colors"
            >
              חריש
            </a>
          </div>

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

        {/* Nav links */}
        <div className="mt-6 flex justify-center">
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
        </div>

        {/* Legal links */}
        <div
          className="mt-6 pt-5 flex flex-wrap items-center justify-center gap-4 text-noir-muted/60 font-heebo text-[11px]"
          style={{ borderTop: "1px solid rgba(42,42,42,0.8)" }}
        >
          {[
            { label: "מדיניות פרטיות", href: "/privacy" },
            { label: "מדיניות עוגיות", href: "/cookies" },
            { label: "הצהרת נגישות", href: "/accessibility" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-noir-gold transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-2 text-noir-muted/50 font-heebo text-[11px]">
          <p>© {year} כל הזכויות שמורות — עו״ד ליאור-קלואי ארז</p>
          <p>האתר אינו מהווה ייעוץ משפטי | אין יחסי עו״ד–לקוח ללא הסכם בכתב</p>
        </div>
      </div>
    </footer>
  );
}

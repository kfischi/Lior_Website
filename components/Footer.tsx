"use client";

import { Scale } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-noir-bg px-6 md:px-12 py-8"
      dir="rtl"
      style={{ borderTop: "1px solid rgba(212,175,55,0.2)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Right — Name */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-noir-gold flex-shrink-0" />
            <span className="font-playfair text-base text-noir-text">עו״ד ליאור-קלואי ארז</span>
          </div>

          {/* Center — contact */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-heebo text-xs text-noir-muted">
            <a href="tel:0524694158" className="hover:text-noir-gold transition-colors">052-469-4158</a>
            <span className="text-noir-border hidden md:inline">|</span>
            <a href="mailto:Lioraere@gmail.com" className="hover:text-noir-gold transition-colors">Lioraere@gmail.com</a>
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

          {/* Left — website */}
          <div className="flex items-center gap-3">
            <Scale size={13} className="text-noir-gold" />
            <a
              href="https://www.liorerezadv.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-heebo text-xs text-noir-muted hover:text-noir-gold transition-colors"
            >
              www.liorerezadv.com
            </a>
          </div>
        </div>

        {/* Legal links */}
        <div
          className="mt-6 pt-4 flex flex-wrap items-center justify-center gap-4 text-noir-muted/60 font-heebo text-[11px]"
          style={{ borderTop: "1px solid #1a1a1a" }}
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
        <div
          className="mt-4 pt-4 flex flex-col md:flex-row items-center justify-between gap-2 text-noir-muted/50 font-heebo text-[11px]"
          style={{ borderTop: "1px solid #1a1a1a" }}
        >
          <p>© {year} כל הזכויות שמורות — עו״ד ליאור-קלואי ארז</p>
          <p>האתר אינו מהווה ייעוץ משפטי | אין יחסי עו״ד–לקוח ללא הסכם בכתב</p>
        </div>
      </div>
    </footer>
  );
}

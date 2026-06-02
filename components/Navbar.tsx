"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, Menu } from "lucide-react";

const navLinks = [
  { label: "אודות", href: "#about" },
  { label: "תחומי עיסוק", href: "#practice-areas" },
  { label: "המלצות", href: "#testimonials" },
  { label: "צור קשר", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const phone = process.env.NEXT_PUBLIC_LAWYER_PHONE || "+972-50-0000000";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between"
        animate={{
          backgroundColor: scrolled ? "rgba(10,10,10,0.95)" : "rgba(10,10,10,0)",
          backdropFilter: scrolled ? "blur(8px)" : "blur(0px)",
          borderBottom: scrolled
            ? "1px solid rgba(212,175,55,0.1)"
            : "1px solid transparent",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Left — CTA */}
        <motion.a
          href={`tel:${phone}`}
          className="flex items-center gap-2 bg-noir-accent text-noir-text px-5 py-2.5 text-sm font-heebo font-medium tracking-wide"
          style={{ border: "none" }}
          whileHover={{ backgroundColor: "#a00000" }}
          transition={{ duration: 0.2 }}
        >
          <Phone size={14} />
          <span>חייג עכשיו</span>
        </motion.a>

        {/* Center — nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleAnchor(link.href)}
              className="nav-link text-noir-text/80 hover:text-noir-gold text-sm font-heebo tracking-wide transition-colors duration-200 bg-transparent border-none"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right — Logo */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-noir-gold" />
          <span className="font-playfair text-lg text-noir-text tracking-wide">
            ליאור כהן
          </span>
          <span className="hidden md:inline text-noir-muted text-xs font-heebo mr-1">
            עורך דין
          </span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-noir-text/80 hover:text-noir-gold transition-colors bg-transparent border-none"
          onClick={() => setMobileOpen(true)}
          aria-label="פתח תפריט"
        >
          <Menu size={22} />
        </button>
      </motion.nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-noir-bg flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="absolute top-6 left-6 text-noir-text/60 hover:text-noir-gold bg-transparent border-none"
              onClick={() => setMobileOpen(false)}
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center gap-10">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleAnchor(link.href)}
                  className="font-playfair text-3xl text-noir-text hover:text-noir-gold transition-colors bg-transparent border-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.a
                href={`tel:${phone}`}
                className="mt-4 flex items-center gap-2 border border-noir-gold text-noir-gold px-8 py-3 font-heebo text-sm tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Phone size={14} />
                {phone}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

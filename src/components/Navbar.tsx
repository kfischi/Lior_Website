"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { Button } from "./ui/Button";
import { MenuIcon, CloseIcon } from "./icons";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-900/95 backdrop-blur shadow-lg shadow-navy-900/10"
          : "bg-transparent"
      }`}
    >
      <nav className="container-page flex h-18 items-center justify-between py-3">
        {/* Brand */}
        <a href="#hero" className="group flex items-center gap-3" aria-label={site.firmName}>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-500/60 bg-navy-800 font-display text-lg font-bold text-gold-400 transition-colors group-hover:border-gold-400">
            {site.lawyerName.charAt(0)}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold text-white">
              {site.firmName}
            </span>
            <span className="text-[0.7rem] tracking-wide text-gold-300/80">
              {site.tagline}
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 lg:flex">
          <ul className="flex items-center gap-6">
            {site.nav.slice(1, -1).map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm font-medium text-navy-100 transition-colors hover:text-gold-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href="#contact" size="md">
            קביעת פגישה
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
          aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
          aria-expanded={open}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden bg-navy-900 transition-[max-height] duration-300 ease-out ${
          open ? "max-h-[28rem]" : "max-h-0"
        }`}
      >
        <ul className="container-page flex flex-col gap-1 py-4">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-medium text-navy-100 transition-colors hover:bg-white/5 hover:text-gold-300"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="px-3 pt-3">
            <Button href="#contact" size="lg" className="w-full" >
              קביעת פגישת ייעוץ
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}

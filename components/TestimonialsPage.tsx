"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    quote:
      "הגעתי למשרד אחרי שנעצרתי בשתיים בלילה. תוך שעה הייתה עורכת הדין לצדי. התיק נסגר ללא כתב אישום — לא האמנתי שזה אפשרי.",
    initials: "א.כ.",
    caseType: "עבירת אלימות",
    result: "תיק נסגר",
    year: "2024",
  },
  {
    quote:
      "ייצגה אותי בתיק סמים מורכב שהיה יכול לשנות את חיי. המקצועיות, הדיסקרטיות והתוצאה — מעל ומעבר לכל ציפייה.",
    initials: "מ.ל.",
    caseType: "עבירת סמים",
    result: "הסדר טיעון — עבודות שירות",
    year: "2024",
  },
  {
    quote:
      "כשהאשימו אותי בהונאה פיננסית נרחבת, הרגשתי שהעולם קורס. המשרד ניהל את ההגנה בצורה כירורגית. זוכיתי.",
    initials: "ד.ר.",
    caseType: "עבירה כלכלית",
    result: "זיכוי",
    year: "2023",
  },
  {
    quote:
      "הם ייצגו את בני בתיק שהיה יכול לסגור בפניו את כל הדלתות. הגישה האנושית, לצד הידע המשפטי — הצילו את עתידו.",
    initials: "ר.ש.",
    caseType: "עבירת נוער",
    result: "ללא רישום פלילי",
    year: "2024",
  },
  {
    quote:
      "תיק תאונת דרכים קטלנית שאיים בשנות מאסר. ההגנה המקצועית חשפה פגמים בחקירה — העונש הופחת דרמטית.",
    initials: "ע.ב.",
    caseType: "תאונת דרכים קטלנית",
    result: "עונש מופחת משמעותית",
    year: "2023",
  },
  {
    quote:
      "האישום נגדי היה חמור. הייתי משוכנע שאבלה שנים בכלא. ליאור קלואי ארז הוכיחה שהנסיבות שונות לחלוטין.",
    initials: "י.מ.",
    caseType: "תקיפה חמורה",
    result: "הכרעה מזכה",
    year: "2024",
  },
  {
    quote:
      "שלילת רישיון בגלל נהיגה בשכרות הייתה עלולה לקלקל את פרנסתי. הגנה מהירה ויעילה הצילה את הרישיון שלי.",
    initials: "ס.ג.",
    caseType: "עבירת תעבורה",
    result: "הרישיון נשמר",
    year: "2023",
  },
  {
    quote:
      "עצרו אותי במסגרת חקירת שחיתות. הידע המשפטי והקשרים של המשרד אפשרו לי לצאת מהאירוע בלי הרשעה.",
    initials: "נ.ה.",
    caseType: "עבירת שוחד",
    result: "הסדר ללא הרשעה",
    year: "2024",
  },
  {
    quote:
      "20 שנה של ניסיון נמצאות בכל שאלה שהיא שואלת, בכל טיעון שהיא מעלה בבית המשפט. לא ראיתי עורכת דין טובה ממנה.",
    initials: "ב.פ.",
    caseType: "עבירת סמים — מסחרי",
    result: "מאסר על תנאי בלבד",
    year: "2023",
  },
];

const stats = [
  { value: "500+", label: "תיקים טופלו" },
  { value: "95%", label: "תוצאות חיוביות" },
  { value: "20+", label: "שנות ניסיון" },
  { value: "100%", label: "מחויבות מלאה" },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 3) * 0.1, duration: 0.7, ease }}
      className="relative bg-noir-surface flex flex-col"
      style={{ border: "1px solid rgba(212,175,55,0.1)" }}
    >
      {/* Crimson left border accent */}
      <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-noir-accent/60 via-noir-accent/20 to-transparent" />

      <div className="p-7 flex flex-col flex-1" dir="rtl">
        {/* Large decorative quote */}
        <div
          className="font-playfair text-7xl leading-none text-noir-gold/15 select-none mb-2"
          aria-hidden="true"
        >
          &ldquo;
        </div>

        {/* Quote */}
        <p className="font-heebo text-noir-text/75 text-sm leading-relaxed flex-1 mb-6">
          {t.quote}
        </p>

        {/* Result badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 self-start"
          style={{ border: "1px solid rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.04)" }}
        >
          <ShieldCheck size={11} className="text-noir-gold" />
          <span className="font-heebo text-noir-gold text-[11px] tracking-wide">
            {t.result}
          </span>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
        >
          <div>
            <p className="font-playfair text-noir-gold font-semibold text-sm">
              {t.initials}
            </p>
            <p className="font-heebo text-[11px] text-noir-muted mt-0.5 tracking-wide">
              {t.caseType}
            </p>
          </div>
          <span className="font-heebo text-[11px] text-noir-border">{t.year}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-20% 0px" });

  return (
    <>
      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <div
        className="relative bg-noir-bg/90 pt-32 pb-20 px-6 md:px-12 overflow-hidden"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #8b0000 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto text-center" dir="rtl">
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              href="/"
              className="font-heebo text-noir-muted text-xs hover:text-noir-gold transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={12} />
              דף הבית
            </Link>
            <span className="text-noir-border">/</span>
            <span className="font-heebo text-noir-gold/70 text-xs">המלצות</span>
          </motion.div>

          <motion.p
            className="font-heebo text-noir-gold text-[11px] uppercase tracking-[0.45em] mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            לקוחות מספרים
          </motion.p>

          <motion.h1
            className="font-playfair text-4xl md:text-6xl font-bold text-noir-text leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease }}
          >
            תוצאות אמיתיות.
            <br />
            <span className="text-noir-gold">לקוחות אמיתיים.</span>
          </motion.h1>

          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-noir-gold to-transparent mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.p
            className="font-heebo text-noir-text/55 text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            השמות שמורים לפי בקשת הלקוחות. הסיפורים — אמיתיים לחלוטין.
          </motion.p>
        </div>
      </div>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        className="bg-noir-surface py-12 px-6"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8" dir="rtl">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease }}
            >
              <p className="font-playfair text-3xl md:text-4xl font-bold text-noir-gold mb-1">
                {s.value}
              </p>
              <p className="font-heebo text-xs text-noir-muted tracking-widest uppercase">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Testimonials Grid ──────────────────────────────────────────────── */}
      <section className="bg-noir-bg/90 py-20 px-6 md:px-12" dir="rtl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>
      </section>

      {/* ── Disclaimer + CTA ───────────────────────────────────────────────── */}
      <section
        className="bg-noir-surface py-16 px-6 text-center"
        dir="rtl"
        style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="max-w-xl mx-auto">
          <p className="font-heebo text-noir-muted text-xs leading-relaxed mb-10">
            כל ההמלצות הן ממקרים אמיתיים. הפרטים המזהים שונו לשמירה על פרטיות הלקוחות.
            תוצאות עבר אינן מבטיחות תוצאות עתידיות.
          </p>
          <motion.a
            href={`tel:${process.env.NEXT_PUBLIC_LAWYER_PHONE || "+972-50-0000000"}`}
            className="inline-flex items-center gap-3 font-heebo font-medium text-noir-gold px-10 py-4 text-sm tracking-[0.25em] uppercase"
            style={{ border: "1px solid rgba(212,175,55,0.5)" }}
            whileHover={{ backgroundColor: "#8b0000", borderColor: "#8b0000" }}
            transition={{ duration: 0.25 }}
          >
            <Phone size={15} />
            דברו איתנו עכשיו
          </motion.a>
        </div>
      </section>
    </>
  );
}

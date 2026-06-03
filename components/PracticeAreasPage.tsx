"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Pill,
  Swords,
  ShieldAlert,
  BarChart2,
  Car,
  Users,
  Phone,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

const areas = [
  {
    icon: Pill,
    slug: "drugs",
    title: "עבירות סמים",
    subtitle: "החזקה, סחר, ייצור ויבוא",
    description:
      "עבירות סמים הן מהחמורות בחוק הישראלי — עם עונשים שיכולים להגיע לשנות מאסר ארוכות. המשרד מתמחה בהגנה על נאשמים בכל שלבי ההליך: ממעצר ראשוני, דרך חקירה, ועד ניהול מלא של ההגנה בבית המשפט.",
    details: [
      "ייצוג בשימועי מעצר והארכות",
      "ערעור על צווי חיפוש ותפיסה",
      "הפחתת עונש דרך הסדרי טיעון",
      "טיפול בתיקי סחר בינלאומי ויבוא",
      "הגנה על עבריינים ראשונים",
    ],
    caseTypes: ["החזקה לשימוש עצמי", "סחר בסמים", "ייצור ועיבוד", "יבוא ויצוא"],
  },
  {
    icon: Swords,
    slug: "violence",
    title: "עבירות אלימות",
    subtitle: "תקיפה, אלימות במשפחה, איומים",
    description:
      "עבירות אלימות דורשות הגנה מהירה ואגרסיבית. הפרשנות המשפטית של הנסיבות, עדויות העד, ומצב הנפגע — כולם קריטיים לתוצאה. הניסיון שלנו מאפשר ניהול הגנה שמבחינה בין אלימות שיש לה הסבר לגיטימי לאלימות שאין לה.",
    details: [
      "הגנה עצמית ונסיבות מקלות",
      "חקירת גרסאות המתלוננים",
      "ייצוג בבתי משפט לענייני משפחה",
      "תיקי אלימות קשה ורצח",
      "הסדרי מעצר בית ופיקוח",
    ],
    caseTypes: ["תקיפה פשוטה וחבלה", "אלימות במשפחה", "איומים והטרדה", "גרם מוות"],
  },
  {
    icon: ShieldAlert,
    slug: "sex-offenses",
    title: "עבירות מין",
    subtitle: "טיפול בדיסקרטיות מוחלטת",
    description:
      "תיקי עבירות מין הם בין המורכבים והרגישים ביותר — הן מבחינה משפטית והן מבחינה אנושית. המשרד מעניק ייצוג אישי, חסוי ומקצועי, תוך שמירה על כבוד הלקוח לאורך כל ההליך.",
    details: [
      "ייצוג חסוי מהרגע הראשון",
      "חקירת חסינות ראייתית",
      "בדיקת מהימנות עדויות",
      "הגנה מפני תיוג פלילי קבוע",
      "ייצוג בדיון ראשוני ושמיעת הוכחות",
    ],
    caseTypes: ["תקיפה מינית", "הטרדה מינית", "עבירות קטינים", "פורנוגרפיית ילדים"],
  },
  {
    icon: BarChart2,
    slug: "financial",
    title: "עבירות כלכליות",
    subtitle: "הונאה, שוחד, עבירות צווארון לבן",
    description:
      "עבירות כלכליות דורשות הבנה עמוקה הן של הדין הפלילי והן של הדין האזרחי-מסחרי. המשרד מטפל בתיקים מורכבים הכוללים ניתוח מסמכים פיננסיים, עדויות מומחים ותיאום עם גורמים מסחריים.",
    details: [
      "ייצוג מול רשויות המס ורשות ני\"ע",
      "תיקי הונאה ומרמה נרחבת",
      "שוחד ועבירות שלטוניות",
      "הלבנת הון ועבירות בנקאיות",
      "תיאום עם יועצים פיננסיים",
    ],
    caseTypes: ["הונאה ומרמה", "שוחד ומשוא פנים", "הלבנת הון", "עבירות ני\"ע"],
  },
  {
    icon: Car,
    slug: "traffic",
    title: "עבירות תעבורה",
    subtitle: "שלילת רישיון, נהיגה בשכרות, תאונות",
    description:
      "עבירת תעבורה חמורה יכולה לשנות חיים — שלילת רישיון, אובדן פרנסה, ורישום פלילי. המשרד מנהל הגנה ייעודית עם דגש על שמירת הרישיון, הפחתת עונש, ושחזור נסיבות התאונה.",
    details: [
      "ערעור על שלילת רישיון",
      "ייצוג בעבירות נהיגה בשכרות",
      "תאונות דרכים קטלניות",
      "עבירות מהירות ורמזורים",
      "שחזור נסיבות בשיתוף מומחים",
    ],
    caseTypes: ["נהיגה בשכרות", "תאונה קטלנית", "נהיגה ללא רישיון", "עבירות מהירות"],
  },
  {
    icon: Users,
    slug: "juvenile",
    title: "עבירות נוער",
    subtitle: "גישה ייעודית לשמירת עתיד הקטין",
    description:
      "ייצוג קטינים בהליכים פליליים דורש רגישות מיוחדת ומומחיות ייחודית. המשרד מתמחה בהגנה על קטינים עם דגש על שיקום, מניעת רישום פלילי, וסיום ההליך בהסדרים חלופיים לכליאה.",
    details: [
      "ייצוג בבית המשפט לנוער",
      "הסדרי שירות לתועלת הציבור",
      "מניעת רישום פלילי קבוע",
      "שיתוף עם שירותי רווחה",
      "ייעוץ להורים לאורך ההליך",
    ],
    caseTypes: ["עבירות אלימות קטינים", "גניבה ורכוש", "סמים ואלכוהול", "עבירות סייבר"],
  },
];

const easeVal = [0.25, 0.46, 0.45, 0.94] as const;

function AreaCard({ area, index }: { area: typeof areas[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.7, ease: easeVal }}
      className="relative bg-noir-surface"
      style={{ border: "1px solid rgba(212,175,55,0.12)" }}
    >
      {/* Top gold accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-noir-gold to-transparent opacity-40" />

      <div className="p-8 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6" dir="rtl">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <area.icon size={22} className="text-noir-gold flex-shrink-0" />
              <h2 className="font-playfair text-2xl font-bold text-noir-text">
                {area.title}
              </h2>
            </div>
            <p className="font-heebo text-noir-gold/70 text-xs tracking-widest uppercase">
              {area.subtitle}
            </p>
          </div>
          <span className="font-playfair text-5xl font-bold text-noir-border leading-none select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Description */}
        <p className="font-heebo text-noir-text/65 text-sm leading-relaxed mb-8" dir="rtl">
          {area.description}
        </p>

        <div className="grid md:grid-cols-2 gap-8" dir="rtl">
          {/* What we do */}
          <div>
            <p className="font-heebo text-noir-gold text-[11px] uppercase tracking-[0.25em] mb-4">
              מה אנו עושים
            </p>
            <ul className="space-y-2.5">
              {area.details.map((d) => (
                <li key={d} className="flex items-start gap-2.5">
                  <span
                    className="w-1 h-1 bg-noir-gold rounded-full mt-2 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-heebo text-sm text-noir-text/70">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Case types */}
          <div>
            <p className="font-heebo text-noir-gold text-[11px] uppercase tracking-[0.25em] mb-4">
              סוגי תיקים
            </p>
            <div className="flex flex-wrap gap-2">
              {area.caseTypes.map((c) => (
                <span
                  key={c}
                  className="font-heebo text-xs text-noir-muted px-3 py-1.5"
                  style={{ border: "1px solid rgba(212,175,55,0.15)" }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className="mt-8 pt-6 flex items-center justify-between"
          dir="rtl"
          style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
        >
          <a
            href={`tel:${process.env.NEXT_PUBLIC_LAWYER_PHONE || "+972-52-4694158"}`}
            className="flex items-center gap-2 font-heebo text-xs text-noir-gold hover:text-white transition-colors tracking-wider"
          >
            <Phone size={13} />
            ייעוץ ראשוני ללא עלות
          </a>
          <span className="font-heebo text-xs text-noir-muted/50">חסוי לחלוטין</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function PracticeAreasPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative bg-noir-bg/70 pt-32 pb-20 px-6 md:px-12 overflow-hidden"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
      >
        {/* BG glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #d4af37 0%, transparent 70%)" }}
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
            <span className="font-heebo text-noir-gold/70 text-xs">תחומי עיסוק</span>
          </motion.div>

          <motion.p
            className="font-heebo text-noir-gold text-[11px] uppercase tracking-[0.45em] mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            המומחיות שלנו
          </motion.p>

          <motion.h1
            className="font-playfair text-4xl md:text-6xl font-bold text-noir-text leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: easeVal }}
          >
            תחומי עיסוק
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
            עשרות שנות ניסיון בכל תחומי המשפט הפלילי. כל תיק מקבל ייצוג אישי, מקצועי
            וחסוי — מהרגע הראשון ועד לסיום ההליך.
          </motion.p>
        </div>
      </div>

      {/* ── Areas Grid ─────────────────────────────────────────────────────── */}
      <section
        className="bg-noir-bg/70 py-20 px-6 md:px-12"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {areas.map((area, i) => (
            <AreaCard key={area.slug} area={area} index={i} />
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section
        className="bg-noir-surface/70 py-20 px-6 text-center"
        dir="rtl"
        style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="max-w-2xl mx-auto">
          <p className="font-heebo text-noir-gold text-[11px] uppercase tracking-[0.4em] mb-4">
            צרו קשר
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-noir-text mb-6">
            לא בטוחים איפה אתם עומדים?
            <br />
            <span className="text-noir-gold">דברו איתנו עכשיו.</span>
          </h2>
          <p className="font-heebo text-noir-text/50 text-sm mb-10">
            שיחה ראשונה ללא עלות. חסוי לחלוטין.
          </p>
          <motion.a
            href={`tel:${process.env.NEXT_PUBLIC_LAWYER_PHONE || "+972-52-4694158"}`}
            className="inline-flex items-center gap-3 font-heebo font-medium text-noir-gold px-10 py-4 text-sm tracking-[0.25em] uppercase"
            style={{ border: "1px solid rgba(212,175,55,0.5)" }}
            whileHover={{ backgroundColor: "#8b0000", borderColor: "#8b0000" }}
            transition={{ duration: 0.25 }}
          >
            <Phone size={15} />
            התקשרו עכשיו
          </motion.a>
        </div>
      </section>
    </>
  );
}

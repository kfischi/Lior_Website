import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  robots: { index: false },
};

export default function Page() {
  return (
    <main className="relative z-10 min-h-screen bg-noir-bg/70">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20" dir="rtl">
        <h1 className="font-playfair text-4xl font-bold text-noir-text mb-3">הצהרת נגישות</h1>
        <p className="font-heebo text-noir-muted text-sm mb-10">בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע&quot;ג-2013</p>

        {[
          ["מחויבות לנגישות", "משרד עורכת הדין ליאור קלואי ארז מחויב לנגישות דיגיטלית ולהבטחה שאתר זה יהיה נגיש לכלל האוכלוסייה, לרבות אנשים עם מוגבלויות, בהתאם לתקן WCAG 2.1 רמה AA."],
          ["אמצעי נגישות באתר", "• כפתור נגישות קבוע המאפשר שינוי גודל טקסט, ניגודיות גבוהה, גווני אפור, הדגשת קישורים, סמן מוגדל ומדריך קריאה.\n• תגיות alt לכל התמונות.\n• ניווט מקלדת מלא.\n• שימוש בתגיות HTML סמנטיות (ARIA).\n• RTL מלא לתמיכה מיטבית בעברית."],
          ["רמת תאימות", "אנו שואפים לעמידה בתקן WCAG 2.1 ברמה AA. חלק מהדפים עשויים לכלול תכנים שטרם הונגשו במלואם."],
          ["תאריך בדיקה אחרונה", "האתר נבדק לאחרונה ב-2025. בדיקות נגישות מבוצעות על-ידי אנשי מקצוע."],
          ["פנייה בנושא נגישות", "נתקלתם בבעיית נגישות? נשמח לטפל:\n📧 office@lior-kloay-erez.co.il\n📞 " + (process.env.NEXT_PUBLIC_LAWYER_PHONE || "+972-52-4694158") + "\nנשתדל להשיב ולתקן תוך 5 ימי עסקים."],
        ].map(([title, body]) => (
          <section key={title} className="mb-8">
            <h2 className="font-playfair text-xl font-semibold text-noir-gold mb-3">{title}</h2>
            <p className="font-heebo text-noir-text/70 text-sm leading-relaxed whitespace-pre-line">{body}</p>
          </section>
        ))}
      </div>
      <Footer />
    </main>
  );
}

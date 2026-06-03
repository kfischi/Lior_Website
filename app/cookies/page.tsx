import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "מדיניות עוגיות",
  robots: { index: false },
};

export default function Page() {
  return (
    <main className="relative z-10 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20" dir="rtl">
        <h1 className="font-playfair text-4xl font-bold text-noir-text mb-3">מדיניות עוגיות</h1>
        <p className="font-heebo text-noir-muted text-sm mb-10">עדכון אחרון: {new Date().getFullYear()}</p>

        {[
          ["מהי עוגייה?", "עוגייה (Cookie) היא קובץ טקסט קטן שנשמר במכשירכם עם ביקורכם באתר. עוגיות מסייעות לנו להבין כיצד המבקרים משתמשים באתר ולשפר את חוויית הגלישה."],
          ["עוגיות שאנו משתמשים בהן", "• עוגיות הכרחיות: לתפקוד בסיסי של האתר ושמירת הגדרות הנגישות שלכם.\n• עוגיות אנליטיקה: לניתוח תנועה אנונימי (Google Analytics) — רק בהסכמה.\n• עוגיות העדפות: לזכור את הסכמתכם לעוגיות."],
          ["ניהול עוגיות", "ניתן לשלוט בעוגיות דרך הגדרות הדפדפן שלכם. מחיקת עוגיות עשויה לפגוע בחוויית הגלישה. כל עוגיות אנליטיות יופעלו רק לאחר הסכמה מפורשת."],
          ["עוגיות צד שלישי", "אנו עשויים להשתמש בשירותי ניתוח של גוגל (Google Analytics). גוגל עשויה לאסוף נתונים בהתאם למדיניות הפרטיות שלה."],
          ["יצירת קשר", "שאלות? office@lior-kloay-erez.co.il"],
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

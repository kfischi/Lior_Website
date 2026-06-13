import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  robots: { index: false },
};

export default function Page() {
  const year = new Date().getFullYear();
  return (
    <main className="relative z-10 min-h-screen bg-noir-bg/70">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20" dir="rtl">
        <h1 className="font-playfair text-4xl font-bold text-noir-text mb-3">מדיניות פרטיות</h1>
        <p className="font-heebo text-noir-muted text-sm mb-10">עדכון אחרון: {year}</p>

        {[
          ["1. כללי", "משרד עורכת הדין ליאור קלואי ארז מחויב להגנה על פרטיות המבקרים באתר. מדיניות זו מפרטת אילו מידע אנו אוספים, כיצד משתמשים בו וכיצד אנו שומרים עליו."],
          ["2. מידע הנאסף", "אנו עשויים לאסוף: שם, מספר טלפון, ואת פרטי הפנייה שתשתפו בצ'אט. לא נאסוף מידע רגיש מעבר לנדרש לטיפול בפנייתכם."],
          ["3. שימוש במידע", "המידע ישמש אך ורק ליצירת קשר חוזרת, למתן שירות משפטי, ולמילוי חובות חוקיות. לא נמכור, נשכיר או נחלוק את המידע עם גורמים שלישיים ללא הסכמתכם, למעט כנדרש על-פי חוק."],
          ["4. אבטחת מידע", "אנו משתמשים בהצפנה (SSL/TLS) לכל העברות המידע. מידע שנאסף בצ'אט מועבר דרך ערוצים מוצפנים ישירות לצוות המשפטי."],
          ["5. עוגיות", "האתר עשוי להשתמש בעוגיות לצרכי ניתוח תנועה ושיפור חוויית הגלישה. ראו מדיניות עוגיות להרחבה."],
          ["6. זכויות המשתמש", "על-פי חוק הגנת הפרטיות, תשמ\"א-1981, יש לכם זכות לעיין במידע האצור אודותיכם, לתקנו ולבקש מחיקתו. לפנייה: office@lior-kloay-erez.co.il"],
          ["7. שינויים במדיניות", "אנו שומרים את הזכות לעדכן מדיניות זו בכל עת. שינויים מהותיים יפורסמו באתר."],
          ["8. יצירת קשר", `לכל שאלה בנושא פרטיות: office@lior-kloay-erez.co.il | ${process.env.NEXT_PUBLIC_LAWYER_PHONE || "+972-52-4694158"}`],
        ].map(([title, body]) => (
          <section key={title} className="mb-8">
            <h2 className="font-playfair text-xl font-semibold text-noir-gold mb-3">{title}</h2>
            <p className="font-heebo text-noir-text/70 text-sm leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
      <Footer />
    </main>
  );
}

import type { Metadata } from 'next';
import { brand } from '@/lib/brand';
import { buildMetadata } from '@/lib/seo-config';

export const metadata: Metadata = buildMetadata({
  title: 'מדיניות פרטיות',
  description: `מדיניות הפרטיות של ${brand.firmName}`,
  path: '/legal/privacy',
});

export default function PrivacyPage() {
  return (
    <>
      <h1 className="font-heading text-3xl font-bold text-navy md:text-4xl">
        מדיניות פרטיות
      </h1>
      <p className="text-sm text-muted-foreground">
        עודכן לאחרונה: {brand.legal.lastUpdated}
      </p>

      <h2>כללי</h2>
      <p>
        {brand.firmName} (להלן: &quot;המשרד&quot;) מכבד את פרטיותכם ומחויב להגן על
        המידע האישי שאתם מוסרים בעת השימוש באתר. מדיניות זו מסבירה אילו נתונים
        נאספים, כיצד נעשה בהם שימוש, וכיצד תוכלו לממש את זכויותיכם בהתאם לחוק הגנת
        הפרטיות, התשמ&quot;א-1981.
      </p>

      <h2>איזה מידע נאסף</h2>
      <ul>
        <li>מידע שאתם מוסרים מרצונכם בטופס יצירת קשר (שם, טלפון, פרטי הפנייה).</li>
        <li>מידע טכני בסיסי הנאסף אוטומטית (כתובת IP, סוג דפדפן, עמודים שנצפו).</li>
        <li>עוגיות (Cookies) — בכפוף להסכמתכם, למעט עוגיות חיוניות לתפעול האתר.</li>
      </ul>

      <h2>השימוש במידע</h2>
      <p>
        המידע משמש למתן מענה לפניות, לשיפור השירות והאתר, ולצרכים סטטיסטיים. המשרד
        לא יעביר את המידע לצדדים שלישיים אלא לצורך מתן השירות, או כנדרש על-פי דין.
      </p>

      <h2>אבטחת מידע</h2>
      <p>
        המשרד נוקט באמצעים סבירים לאבטחת המידע. פניות הנשלחות דרך האתר מועברות
        בערוצים מאובטחים, ואין אנו חושפים מפתחות או ממשקים רגישים בצד הלקוח.
      </p>

      <h2>זכויותיכם</h2>
      <p>
        בהתאם לחוק, אתם רשאים לעיין במידע המוחזק אודותיכם, לבקש לתקנו או למוחקו.
        לבקשות בנושא זה ניתן לפנות לכתובת{' '}
        <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>

      <h2>יצירת קשר</h2>
      <p>
        בכל שאלה בנוגע למדיניות זו ניתן לפנות אל המשרד בטלפון {brand.phone} או
        בדוא&quot;ל <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>
    </>
  );
}

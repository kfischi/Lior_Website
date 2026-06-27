import type { Metadata } from 'next';
import { brand } from '@/lib/brand';
import { buildMetadata } from '@/lib/seo-config';

export const metadata: Metadata = buildMetadata({
  title: 'הצהרת נגישות',
  description: `הצהרת הנגישות של ${brand.firmName} בהתאם לתקן הישראלי 5568`,
  path: '/legal/accessibility',
});

export default function AccessibilityPage() {
  return (
    <>
      <h1 className="font-heading text-3xl font-bold text-navy md:text-4xl">
        הצהרת נגישות
      </h1>
      <p className="text-sm text-muted-foreground">
        עודכן לאחרונה: {brand.legal.lastUpdated}
      </p>

      <h2>מחויבות לנגישות</h2>
      <p>
        {brand.firmName} רואה חשיבות רבה במתן שירות שוויוני לכלל הציבור, לרבות
        אנשים עם מוגבלות. אתר זה פותח בהתאם להוראות תקנות שוויון זכויות לאנשים עם
        מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013, ובהתאם לתקן הישראלי{' '}
        <strong>ת&quot;י 5568</strong> ברמת AA, המבוסס על הנחיות{' '}
        <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer">
          WCAG 2.1
        </a>
        .
      </p>

      <h2>אמצעי הנגישות באתר</h2>
      <ul>
        <li>מבנה HTML סמנטי ותמיכה מלאה בקוראי מסך.</li>
        <li>ניווט מלא באמצעות מקלדת וסימון מיקוד (focus) ברור.</li>
        <li>טקסט חלופי לתמונות וניגודיות צבעים תקנית.</li>
        <li>תמיכה בכיווניות עברית (RTL) ובהגדלת טקסט.</li>
        <li>קישור &quot;דלג לתוכן הראשי&quot; בראש כל עמוד.</li>
      </ul>

      <h2>הסדרי נגישות חלקיים</h2>
      <p>
        חרף מאמצינו להנגיש את כלל הדפים, ייתכן שחלקים מסוימים טרם הונגשו במלואם.
        אנו פועלים באופן שוטף לשיפור הנגישות.
      </p>

      <h2>פניות בנושא נגישות</h2>
      <p>
        נתקלתם בקושי? נשמח לקבל את פנייתכם. רכז הנגישות של המשרד זמין בכתובת{' '}
        <a href={`mailto:${brand.legal.accessibilityContact}`}>
          {brand.legal.accessibilityContact}
        </a>{' '}
        ובטלפון {brand.phone}. נשתדל לטפל בפנייתכם בהקדם.
      </p>
    </>
  );
}

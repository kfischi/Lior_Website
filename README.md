# Lawyer OS — תבנית אב לאתרי משרדי עורכי דין (Elite)

תבנית **White-Label** ברמת פרימיום לאתרי תדמית למשרדי עורכי דין בישראל.
עברית-first, RTL מלא, עיצוב קולנועי/עריכתי, אנימציות מוקפדות וצ'אטבוט AI אמיתי.
החלפת לקוח = עריכת קובץ אחד (`src/lib/brand.ts`).

## סטאק (אוקטובר 2026)

- **Next.js 16** (App Router · RSC · Server Actions) · **React 19** · **TypeScript strict**
- **Tailwind CSS v4** (CSS-first `@theme`) · **Framer Motion** (micro-interactions)
- **Vercel AI SDK v7** + **Claude** — צ'אטבוט עם streaming, tool calling, ו-RAG
- **Supabase** (pgvector) — RAG והיסטוריית שיחות (אופציונלי, עם fallback)

## עקרונות

- **קובץ מיתוג יחיד** — `src/lib/brand.ts` מזין צבעים, פונטים, תוכן, צ'אטבוט ו-SEO.
  הצבעים מוזרקים כ-CSS variables, כך שעריכה אחת משנה את כל האתר.
- **אבטחה** — מפתחות (Claude/Supabase) ו-Webhooks נקראים **רק בצד השרת**
  (Server Actions / route handlers). שום סוד לא מגיע ל-client.
- **עמיד בכשל** — האתר והצ'אט ממשיכים לעבוד גם ללא Supabase/RAG/מפתח (fallback מלא).
- **נגישות (WCAG 2.1 AA)** · **Mobile-first אמיתי** · יעד Lighthouse 95+.

ראו [`CLAUDE.md`](CLAUDE.md) לחוקי הקוד ו-[`DESIGN.md`](DESIGN.md) לכיוון העיצובי.

## הרצה מקומית

```bash
cp .env.example .env.local   # מלאו ערכים
npm install
npm run dev                  # http://localhost:3000
```

### משתני סביבה

| משתנה | חובה? | תיאור |
| --- | --- | --- |
| `SITE_URL` | כן | כתובת האתר (SEO/sitemap) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | כן | שם ה-Cloud לתמונות |
| `ANTHROPIC_API_KEY` | לצ'אט | מפתח Claude (צד שרת) |
| `CHAT_MODEL` | לא | דגם Claude (ברירת מחדל `claude-sonnet-5-5`) |
| `WHATSAPP_ACCESS_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | לשליחה ישירה | WhatsApp Cloud API של Meta (צד שרת) |
| `WHATSAPP_NOTIFY_TO` / `WHATSAPP_LEAD_TEMPLATE` | לשליחה ישירה | מספר המשרד ושם התבנית המאושרת |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | ל-RAG/היסטוריה | Supabase (צד שרת) |
| `OPENAI_API_KEY` | ל-RAG | embeddings (צד שרת) |

> כל מה שאינו קריטי הוא אופציונלי: בלעדיו הפיצ'ר פשוט נכבה בחן.

## ידע הצ'אטבוט

כל מה שהצ'אט יודע על המשרד נמצא ב-[`src/lib/knowledge.ts`](src/lib/knowledge.ts) וב-`brand.ts`.
הידע נכנס ישירות להנחיות המודל, בלי מסד נתונים. **ערכו את הקובץ** והחליפו את הניסוחים
הכלליים בתהליך, במדיניות השכר ובהתמחויות האמיתיות של המשרד. הצ'אט מתייחס לכל מה שכתוב שם כעובדה.
בלי `ANTHROPIC_API_KEY` הצ'אט עונה מאותו קובץ ידע לפי נושאים (פחות גמיש, אבל לא נופל).

## וואטסאפ: חיבור ישיר דרך Meta

טופס הלידים ב-`src/lib/actions/lead.ts`:

- **עם הגדרות Meta**: הליד נשלח מהשרת ישירות לוואטסאפ של המשרד (WhatsApp Cloud API).
- **בלי הגדרות, או אם Meta דחתה**: הגולש מקבל כפתור עם הודעה מוכנה (`wa.me`). הליד לא הולך לאיבוד.

הגדרה ב-Meta (developers.facebook.com):
1. צרו אפליקציה מסוג Business והוסיפו את המוצר WhatsApp.
2. ב-API Setup העתיקו `Phone number ID` ויצרו Access Token קבוע (System User).
3. **צרו תבנית הודעה (Template)** בקטגוריית Utility עם 4 משתנים: `{{1}}` שם, `{{2}}` טלפון, `{{3}}` תחום, `{{4}}` פרטים, והמתינו לאישור.
4. הגדירו את `WHATSAPP_LEAD_TEMPLATE` לשם התבנית ואת `WHATSAPP_NOTIFY_TO` למספר שיקבל את הלידים.

> כלל של Meta: הודעה חופשית (בלי תבנית) מגיעה רק אם הנמען כתב למספר העסק ב-24 השעות האחרונות.
> לכן נדרשת תבנית מאושרת כדי לקבל לידים באופן אמין.

## צ'אטבוט + RAG (אופציונלי)

1. הריצו את ההגירה [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   בפרויקט Supabase (pgvector + טבלאות שיחה + טבלת `documents`).
2. הגדירו `SUPABASE_*` + `OPENAI_API_KEY`.
3. הטמיעו את הידע: `npm run ingest` (ממלא embeddings מתוך `brand.ts` ומקבצי `content/`).

בלי הצעדים האלה — הצ'אטבוט עדיין עונה על בסיס הידע המובנה שב-`brand.ts`.

## שכפול ללקוח חדש

1. שכפלו את הריפו.
2. ערכו `src/lib/brand.ts` (שם, צבעים, תוכן, פרטי קשר, הגדרות צ'אט).
3. החליפו תמונות/וידאו ב-Cloudinary ועדכנו `hero.videoUrl` / `hero.posterId` / public IDs.
4. (אופציונלי) הריצו `npm run ingest` לעדכון מאגר הידע של הצ'אטבוט.
5. דיפלוי (Vercel מומלץ).

## פקודות

```bash
npm run dev · build · start
npm run lint · typecheck
npm run ingest     # הטמעת ידע ל-RAG (דורש Supabase + OpenAI)
```

> הפונטים (Frank Ruhl Libre, Heebo) נטענים דרך `next/font` ומתארחים עצמית ב-build —
> ללא קריאות runtime ל-Google.

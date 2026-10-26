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
| `CHAT_MODEL` | לא | דגם Claude (ברירת מחדל `claude-sonnet-4-5`) |
| `N8N_LEAD_WEBHOOK_URL` | ללידים | Webhook לטופס (צד שרת) |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | ל-RAG/היסטוריה | Supabase (צד שרת) |
| `OPENAI_API_KEY` | ל-RAG | embeddings (צד שרת) |

> כל מה שאינו קריטי הוא אופציונלי: בלעדיו הפיצ'ר פשוט נכבה בחן.

## צ'אטבוט + RAG

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

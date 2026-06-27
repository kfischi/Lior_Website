# Lawyer OS — תבנית אב לאתרי משרדי עורכי דין

תבנית **White-Label** לאתרי תדמית למשרדי עורכי דין בישראל. עברית-first, RTL מלא,
מהירה ונגישה (יעד Lighthouse 95+). בנויה ב-Next.js (App Router) + TypeScript +
Tailwind + Shadcn/UI.

## עקרונות מפתח

- **קובץ אחד למיתוג** — כל פרטי הלקוח (שם, צבעים, פונטים, תוכן) נמצאים ב-
  [`src/lib/brand.ts`](src/lib/brand.ts). שינוי שם/צבע = עריכת קובץ אחד; כל האתר מתעדכן.
- **אבטחה** — מפתחות ו-Webhook URLs נשמרים ב-env ונקראים **רק בצד השרת**
  (`/api/lead`, `/api/chat`), ומעולם לא נחשפים ללקוח.
- **מדיה** — כל התמונות עוברות דרך `next/image` עם Cloudinary custom loader.
- **SEO + GEO** — Metadata דינמי, JSON-LD (LegalService / Attorney / FAQPage),
  `sitemap.xml`, `robots.txt`, ו-`llms.txt` למנועי AI.

## הרצה מקומית

```bash
cp .env.example .env.local   # מלאו ערכים אמיתיים
npm install
npm run dev                  # http://localhost:3000
```

### משתני סביבה (`.env.local`)

| משתנה | תיאור | צד |
| --- | --- | --- |
| `SITE_URL` | כתובת האתר (canonical, sitemap) | public |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | שם ה-Cloud ב-Cloudinary | public |
| `N8N_LEAD_WEBHOOK_URL` | Webhook לטופס לידים | **server-only** |
| `N8N_CHAT_WEBHOOK_URL` | Webhook לצ׳אטבוט | **server-only** |

## מבנה הפרויקט

```
src/
  app/                 עמודים, route handlers, sitemap/robots/llms.txt
    api/lead           טופס לידים → n8n (שרת)
    api/chat           צ׳אטבוט → n8n (שרת)
    legal/             privacy · accessibility (ת"י 5568) · terms
  components/
    ai/ChatBot.tsx
    legal/CookieConsent.tsx
    sections/          רכיבי עמוד הבית (Hero, About, ...)
    ui/                Shadcn primitives
  lib/
    brand.ts           ⭐ קונפיגורציית המיתוג (White-Label)
    cloudinary-loader.ts
    seo-config.ts      Metadata + JSON-LD
    color.ts · utils.ts
```

## שכפול ללקוח חדש

ברוב המקרים **לא מעצבים מחדש**:

1. שכפלו את הריפו.
2. ערכו את [`src/lib/brand.ts`](src/lib/brand.ts) — שם, צבעים, פרטי קשר, תכנים.
3. החליפו את התמונות ב-Cloudinary ועדכנו את ה-public IDs ב-`brand.ts`.
4. עדכנו את ה-System Prompt של הצ׳אטבוט ב-workflow של n8n.
5. דיפלוי (Vercel מומלץ).

V0 נכנס לתמונה רק כשצריך רכיב חדש שעדיין לא קיים בתבנית.

## פקודות

```bash
npm run dev        # פיתוח
npm run build      # build לפרודקשן
npm run start      # הרצת build
npm run lint       # ESLint
npm run typecheck  # בדיקת טיפוסים
```

> הערה: הפונטים (Frank Ruhl Libre, Heebo) נטענים דרך `next/font` ומתארחים
> עצמית ב-build — אין קריאות runtime ל-Google.

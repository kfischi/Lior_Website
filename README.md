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
| `ANTHROPIC_API_KEY` | לצ'אט (או Gemini) | מפתח Claude (צד שרת) |
| `CHAT_MODEL` | לא | דגם Claude (ברירת מחדל `claude-sonnet-5-5`) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | לצ'אט (או Claude) | מפתח Gemini מ-Google AI Studio (צד שרת) |
| `GEMINI_MODEL` | לא | דגם Gemini (ברירת מחדל `gemini-2.5-flash`) |
| `CHAT_PROVIDER` | לא | `anthropic` או `google`, כשיש שני מפתחות |
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

## שיחה במקום טופס

אין באתר טופס יצירת קשר. התקשורת עם פונים היא שיחה, והיא אחת בכל האתר
(החלון הצף ואזור "מתחילים בשיחה" חולקים את אותה שיחה, ב-`src/components/ai/`):

- **שאלות חופשיות** נענות על ידי Claude (או מקובץ הידע, בלי מפתח).
- **קליטה מודרכת** ("קביעת ייעוץ"): שם, תחום, דחיפות, טלפון, הערה אופציונלית ואישור מפורש.
  היא דטרמיניסטית, עובדת גם בלי מפתח Claude, ולעולם לא נשלחת למודל.
- כל כפתור "לקביעת ייעוץ" באתר מתחיל אותה. בדחיפות גבוהה מוצג כפתור התקשרות מיד.
- הגבלת קצב לפי כתובת (`src/lib/rate-limit.ts`) מגנה על עלות המודל ועל ספאם.

## וואטסאפ: חיבור ישיר דרך Meta

סיום הקליטה קורא ל-`src/lib/actions/lead.ts`:

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

> הפונטים (Rubik, Heebo) נטענים דרך `next/font` ומתארחים עצמית ב-build —
> ללא קריאות runtime ל-Google.


## הצ'אט הלומד (/admin)

עורכת הדין מלמדת את העוזרת בעצמה, בלי קוד: נכנסים ל-`/admin` עם הסיסמה שהוגדרה ב-`ADMIN_PASSWORD`, כותבים שאלה ותשובה
(או הנחיה כללית), והעוזרת משתמשת בזה כבר בשיחה הבאה. שאלות שהעוזרת לא ידעה לענות עליהן מופיעות שם לתשובה בלחיצה.
האחסון הוא Netlify Blobs (ללא הגדרה נוספת ב-Netlify); מקומית נשמר קובץ ב-`.data/` (לא נכנס ל-git).

| משתנה | תפקיד |
| --- | --- |
| `ADMIN_PASSWORD` | סיסמת עמוד הניהול. ללא הגדרה העמוד כבוי |
| `ADMIN_SESSION_SECRET` | אופציונלי, סוד לחתימת העוגייה |
| `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` | קודי אימות בעלות ל-Search Console ול-Bing |

## SEO ו-GEO

מדריכים ב-`src/lib/articles.ts` (עמודי `/articles`), שאלות ותשובות ב-`/faq`, `llms.txt`, `llms-full.txt`, `feed.xml`, sitemap,
robots שמאפשר זחלני חיפוש ובינה מלאכותית, ו-JSON-LD (Article, FAQPage, LegalService, Attorney, WebSite).
כל טקסט משפטי חייב אישור של עורכת הדין לפני הסתמכות עליו.

## סרטוני YouTube בביקורות וידאו

מוסיפים ל-`brand.videoReviews` שורה כמו `{ youtubeId: 'XXXXXXXXXXX', label: 'ביקורת וידאו', landscape: true }`
(11 התווים אחרי `v=` או `youtu.be/` או `shorts/`; `landscape` לסרטון לרוחב, בלי זה הכרטיס אנכי). הנגן נטען מ-`youtube-nocookie.com`
רק אחרי לחיצה, ומבקש כתוביות בעברית אם קיימות ב-YouTube.

## כתוביות לביקורות וידאו

`npm run captions` שולח כל סרטון ב-`brand.videoReviews` ל-Gemini ויוצר טיוטת כתוביות `public/videos/review-N.he.vtt`
(דורש `GOOGLE_GENERATIVE_AI_API_KEY`). הטיוטה היא תמלול מכונה של דברי לקוחות: חובה לקרוא אותה מול הסרטון ולתקן לפני
פרסום, ואז להוסיף `captions: '/videos/review-N.he.vtt'` לסרטון ב-`src/lib/brand.ts`.

## צ'אט חכם ולומד בלי API

כשאין מפתח למודל (או כש-`CHAT_PROVIDER=local`), העוזרת עונה ממנוע חיפוש מקומי (`src/lib/ai/local/`): הוא מאנדקס את כל מה שהאתר
אומר (בסיס הידע, שאלות נפוצות, עמודי התחומים והמדריכים) ואת מה שליאור לימדה ב-`/admin`, מדרג קטעים לפי BM25 על שורשי מילים
בעברית ועל מושגים נרדפים, ועונה רק כשהיא בטוחה. כשלא, היא אומרת זאת ושומרת את השאלה (בלי טלפון ודוא״ל) לרשימה ב-`/admin`.
כפתורי "עזר לכם?" מוסיפים לרשימה גם שאלות שהתשובה עליהן לא עזרה. כל פריט שליאור מלמדת נכנס לתשובות תוך כמה שניות.
זה עובד גם כשהמודל נכשל, ולכן הצ'אט לא נשבר אף פעם.

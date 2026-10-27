# Welcome video: script and recording notes

The chat plays this video two seconds after it opens (once per browser tab). The script below is the same
text as `src/lib/avatar-intro.json`, which is the source of truth: captions, transcript and the highlights on the
site all read it. `npm run avatar` builds the video from it (see `.claude/skills/talking-avatar`).

## Script (Hebrew, about 90 seconds, calm and warm pace)

1. שלום, ברוכים הבאים. אני ליאורה, העוזרת הווירטואלית של עורכת הדין ליאור קלואי ארז.
2. אני כאן בשבילכם עשרים וארבע שעות ביממה, שבעה ימים בשבוע. גם כשליאור בפגישה או בבית משפט, וגם בלילה. מי שפונה אלינו אף פעם לא נשאר לבד.
3. ואם אתם רוצים להכיר את ליאור ואת תחומי העיסוק שלה, הכול כאן באתר.  _(marks: about)_
4. כל השיחה איתי מתנהלת כאן, בצ׳אט. אפשר לכתוב לי כל שאלה, בכל שעה.  _(marks: chat)_
5. ואפשר גם ללחוץ על המיקרופון ולדבר, ואני אענה.  _(marks: voice)_
6. מתחת לצ׳אט תראו שאלות מוכנות, ובמהלך השיחה אשאל כמה שאלות קצרות: מה קרה, עד כמה זה דחוף, ואיך חוזרים אליכם. זה עוזר לליאור להבין את העניין מראש, ולטפל בפנייה שלכם מהר יותר, לפי הדחיפות.  _(marks: questions)_
7. באתר יש גם מדריכים ומאמרים על התעמרות בעבודה, אפליה, הטרדה מינית וחקירה במשטרה. אפשר לקרוא אותם בכל שעה, ואני אפנה אתכם לחומר המתאים.  _(marks: articles)_
8. ובעמוד השאלות והתשובות תמצאו מענה מהיר לשאלות נפוצות.  _(marks: faq)_
9. ואם אתם רוצים לשמוע מלקוחות, יש באתר המלצות וסרטונים של אנשים שסיפרו על החוויה שלהם.  _(marks: reviews)_
10. ואם אתם מעדיפים לדבר ישירות עם ליאור, אפשר להתקשר או לשלוח הודעה בוואטסאפ, או להשאיר פרטים כאן בצ׳אט והיא תחזור אליכם.  _(marks: contact)_
11. חשוב לדעת: אני עוזרת וירטואלית, ואיני מחליפה ייעוץ משפטי. אבל אעשה כל מה שאפשר כדי שתגיעו לליאור בצורה הנוחה והמהירה ביותר.
12. אז איך אפשר לעזור לכם היום?

The line that says she is a virtual assistant and not a substitute for legal advice must stay.

## Recording by hand (instead of `npm run avatar`)

- MP4 (H.264 + AAC), square (1:1, for example 1080x1080), face in the upper two thirds with room above the head.
- 80-100 seconds, 4-8 MB, 720p is enough. A half-second pause between the numbered lines makes timing easy.
- Written consent from the person whose face and voice are used; the player labels the video as AI-made.

## After recording

1. Put the file in `public/videos/` and set `src` and `poster` in `src/lib/avatar-intro.json`.
2. Set each line's `start` (seconds) from the tool's subtitle export; see `.claude/skills/avatar-tour`.

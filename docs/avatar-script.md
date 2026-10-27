# Welcome video: script and recording notes

The chat plays this video two seconds after it opens (once per browser tab). The
captions, transcript and the tour that lights up beside the video all come from
`brand.chat.intro.segments` in `src/lib/brand.ts`.

## Script (Hebrew, about 90 seconds, calm and warm pace)

1. שלום, ברוכים הבאים. אני ליאורה, העוזרת הווירטואלית של עורכת הדין ליאור קלואי ארז.
2. אני כאן בשבילכם עשרים וארבע שעות ביממה, שבעה ימים בשבוע. גם כשליאור בפגישה או בבית משפט, וגם בלילה. מי שפונה אלינו אף פעם לא נשאר לבד.
3. כך זה עובד: כל השיחה איתי מתנהלת כאן, בצ׳אט. אפשר לכתוב, ואפשר גם ללחוץ על המיקרופון ולדבר.
4. מתחת לצ׳אט תראו שאלות מוכנות, ובמהלך השיחה אשאל כמה שאלות קצרות: מה קרה, עד כמה זה דחוף, ואיך חוזרים אליכם. זה עוזר לליאור להבין את העניין מראש, ולטפל בפנייה שלכם מהר יותר, לפי הדחיפות.
5. באתר יש גם מדריכים ומאמרים, ותשובות לשאלות נפוצות על התעמרות בעבודה, אפליה, הטרדה מינית וחקירה במשטרה. אפשר לקרוא אותם בכל שעה, ואני אפנה אתכם לחומר המתאים.
6. ואם אתם מעדיפים לדבר ישירות עם ליאור, אפשר להתקשר או לשלוח הודעה בוואטסאפ, או להשאיר פרטים כאן בצ׳אט והיא תחזור אליכם.
7. חשוב לדעת: אני עוזרת וירטואלית, ואיני מחליפה ייעוץ משפטי. אבל אעשה כל מה שאפשר כדי שתגיעו לליאור בצורה הנוחה והמהירה ביותר.
8. אז איך אפשר לעזור לכם היום?

Segment 7 must stay: it tells visitors this is a virtual assistant and not legal advice.

## Recording

- Format: MP4 (H.264 video, AAC audio), square (1:1, for example 1080x1080) with the face in the
  upper two thirds and room above the head. In the chat window the lower part of the picture is
  cropped, so keep hands and text out of the bottom third.
- Length 80–100 seconds, a size of 4–8 MB (about 1 Mbps). Export a 720p version.
- Natural pauses of half a second between the numbered lines make timing easy.
- Needs Lior's written consent for the use of her face and voice, and the player labels it as AI-made.

## After recording

1. Put the file in `public/videos/` (for example `intro.mp4`) and set `brand.chat.intro.src`.
2. Send the exported subtitle file (SRT), or the video itself, so each segment's `start` can be set
   to the second it begins. The current numbers are estimates.

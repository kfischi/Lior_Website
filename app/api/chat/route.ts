import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `אתה מערכת קבלת לקוחות של משרד עורכי דין פלילי בכיר בישראל.
תפקידך הוא אחד בלבד: לאסוף בצורה אמפתית, מקצועית ויעילה
את ארבעת פרטי הפנייה הבאים, אחד אחד, לפי הסדר:

1. שם מלא של הפונה
2. מספר טלפון ליצירת קשר
3. תיאור קצר של העניין הפלילי (ללא פרטים רגישים מיותרים)
4. רמת דחיפות: האם הפונה נמצא כרגע במעצר? האם מדובר בחקירה פעילה?

חוקים שאסור לך לעבור:
- אל תיתן ייעוץ משפטי בשום צורה
- אל תפרש חוקים, פסקי דין, או מצבים משפטיים
- אל תאשר או תשלול כל פעולה משפטית
- אל תדון בנושאים שאינם קשורים לאיסוף הפרטים
- אל תגלה שאתה AI — אמור שאתה "מערכת הקבלה של המשרד"
- אם הפונה שואל שאלה משפטית, ענה בנימוס: "השאלה שלך חשובה — עורך הדין יענה עליה אישית לאחר שאקבע לך פגישה."

סגנון תקשורת:
- עברית תקינה ומקצועית
- קצר, ממוקד, ללא עודף מילים
- אמפתי אך יעיל — הפונה עלול להיות במצוק לחץ
- משפט אחד לשאלה, לעולם לא שתי שאלות בבת אחת

כאשר כל ארבעת השדות נאספו בהצלחה, ענה בדיוק כך ולא אחרת:
{"status":"INTAKE_COMPLETE","name":"...","phone":"...","incident":"...","urgency":"..."}

אל תוסיף שום טקסט לפני או אחרי ה-JSON הזה.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface IntakeData {
  name: string;
  phone: string;
  incident: string;
  urgency: string;
}

async function triggerWebhook(data: IntakeData, sessionId: string) {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = {
    source: "website_ai_intake",
    timestamp: new Date().toISOString(),
    sessionId,
    client: {
      name: data.name,
      phone: data.phone,
      incident: data.incident,
      urgency: data.urgency,
    },
    routing: {
      priority: data.urgency.includes("מעצר") ? "URGENT" : "NORMAL",
      channel: "whatsapp",
    },
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("[webhook] Failed with status:", res.status);
    }
  } catch (err) {
    // Never expose webhook failure to the client
    console.error("[webhook] Error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = (await req.json()) as {
      messages: ChatMessage[];
      sessionId: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Check if the AI has finished collecting all intake data
    const jsonMatch = rawText.match(/\{"status":"INTAKE_COMPLETE"[^}]+\}/);
    if (jsonMatch) {
      try {
        const intakeData = JSON.parse(jsonMatch[0]) as IntakeData & {
          status: string;
        };
        await triggerWebhook(intakeData, sessionId);
        return NextResponse.json({
          message:
            "תודה רבה. הפרטים שלך התקבלו בהצלחה.\nאחד מעורכי הדין שלנו ייצור איתך קשר בהקדם האפשרי.\n\nאם מדובר בדחיפות — אנא התקשר ישירות לקו החירום.",
          complete: true,
        });
      } catch {
        console.error("[intake] Failed to parse intake JSON");
      }
    }

    return NextResponse.json({ message: rawText, complete: false });
  } catch (err) {
    console.error("[chat route] Error:", err);
    return NextResponse.json(
      { message: "שגיאת שרת. אנא נסה שוב.", complete: false },
      { status: 500 }
    );
  }
}

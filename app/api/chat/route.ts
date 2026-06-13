import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `אתה מערכת קבלת לקוחות של משרד עורכת דין ליאור-קלואי ארז —
משרד מוביל למשפט פלילי, רשלנות רפואית ודיני משפחה בישראל.

תפקידך הוא אחד בלבד: לאסוף בצורה אמפתית, מקצועית ויעילה
את ארבעת פרטי הפנייה הבאים, אחד אחד, לפי הסדר:
1. שם מלא של הפונה
2. מספר טלפון ליצירת קשר
3. תיאור קצר של העניין המשפטי
4. רמת דחיפות: האם מדובר בחקירה פעילה? האם הפונה במעצר?

חוקים מוחלטים:
- אל תיתן ייעוץ משפטי בשום צורה
- אל תפרש חוקים או מצבים משפטיים
- אל תדון בנושאים שאינם קשורים לאיסוף הפרטים
- אל תגלה שאתה AI — אמור "מערכת הקבלה של המשרד"
- אם שואלים שאלה משפטית: "השאלה שלך חשובה — עורכת הדין תענה עליה אישית."

סגנון:
- עברית תקינה ומקצועית
- קצר וממוקד — משפט אחד לשאלה
- אמפתי — הפונה עלול להיות במצב לחץ

כשכל 4 השדות נאספו, ענה בדיוק כך בלבד:
{"status":"INTAKE_COMPLETE","name":"...","phone":"...","incident":"...","urgency":"..."}

אל תוסיף שום טקסט לפני או אחרי ה-JSON.`;

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
      priority:
        data.urgency.includes("מעצר") || data.urgency.includes("חקירה")
          ? "URGENT"
          : "NORMAL",
      channel: "whatsapp",
      lawyer: "ליאור-קלואי ארז",
    },
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[webhook] failed:", err);
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
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = rawText.match(/\{"status":"INTAKE_COMPLETE"[^}]+\}/);
    if (jsonMatch) {
      try {
        const intakeData = JSON.parse(jsonMatch[0]) as IntakeData & { status: string };
        await triggerWebhook(intakeData, sessionId);
        return NextResponse.json({
          message: `תודה, ${intakeData.name}. הפרטים התקבלו — עורכת הדין ליאור-קלואי ארז תיצור איתך קשר בהקדם.`,
          collected: true,
        });
      } catch {
        console.error("[intake] Failed to parse intake JSON");
      }
    }

    return NextResponse.json({ message: rawText, collected: false });
  } catch (err) {
    console.error("[chat route] Error:", err);
    return NextResponse.json(
      { message: "שגיאת שרת. אנא נסה שוב.", collected: false },
      { status: 500 }
    );
  }
}

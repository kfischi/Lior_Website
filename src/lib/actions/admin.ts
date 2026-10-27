'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { generateText } from 'ai';
import { z } from 'zod';
import { chatModelName, chatProviderOptions, getChatModel } from '@/lib/ai/model';
import {
  adminEnabled,
  endSession,
  isAdmin,
  passwordMatches,
  startSession,
} from '@/lib/admin-auth';
import { addNote, deleteNote, dismissUnknown, setNoteEnabled } from '@/lib/learning/store';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export interface FormState {
  ok: boolean;
  message: string;
}

const NoteSchema = z.object({
  question: z.string().trim().max(300, 'השאלה ארוכה מדי'),
  answer: z.string().trim().min(3, 'צריך לכתוב תשובה').max(2000, 'התשובה ארוכה מדי (עד 2000 תווים)'),
});

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!adminEnabled()) return { ok: false, message: 'ממשק הניהול לא הוגדר.' };
  const ip = clientIp(await headers());
  if (!rateLimit(`admin-login:${ip}`, 6, 15 * 60 * 1000)) {
    return { ok: false, message: 'יותר מדי ניסיונות. נסו שוב מאוחר יותר.' };
  }
  const password = formData.get('password');
  if (typeof password !== 'string' || !passwordMatches(password)) {
    return { ok: false, message: 'הסיסמה שגויה.' };
  }
  await startSession();
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect('/admin');
}

export async function teachAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { ok: false, message: 'נדרשת התחברות.' };
  const parsed = NoteSchema.safeParse({
    question: formData.get('question') ?? '',
    answer: formData.get('answer') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'הנתונים אינם תקינים.' };
  }
  try {
    await addNote(parsed.data);
  } catch (err) {
    console.error('Saving note failed:', err);
    return { ok: false, message: 'השמירה נכשלה. נסו שוב.' };
  }
  revalidatePath('/admin');
  return { ok: true, message: 'נשמר. העוזרת תשתמש בזה כבר בשיחה הבאה.' };
}

const IdSchema = z.string().uuid();

export async function toggleNoteAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;
  const id = IdSchema.safeParse(formData.get('id'));
  if (!id.success) return;
  await setNoteEnabled(id.data, formData.get('enabled') === 'true');
  revalidatePath('/admin');
}

export async function deleteNoteAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;
  const id = IdSchema.safeParse(formData.get('id'));
  if (!id.success) return;
  await deleteNote(id.data);
  revalidatePath('/admin');
}

export async function dismissUnknownAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;
  const id = IdSchema.safeParse(formData.get('id'));
  if (!id.success) return;
  await dismissUnknown(id.data);
  revalidatePath('/admin');
}

/** Admin-only check that the chat model answers, and how fast. */
export async function testChatAction(_prev: FormState): Promise<FormState> {
  if (!(await isAdmin())) return { ok: false, message: 'נדרשת התחברות.' };
  const model = getChatModel();
  const name = chatModelName();
  if (!model || !name) {
    return {
      ok: false,
      message: 'אין מפתח למודל בשרת (GOOGLE_GENERATIVE_AI_API_KEY). הצ׳אט עונה כרגע מבסיס הידע בלבד.',
    };
  }
  const started = Date.now();
  try {
    const result = await generateText({
      model,
      prompt: 'ענה במילה אחת בלבד: שלום',
      maxOutputTokens: 20,
      providerOptions: chatProviderOptions(),
    });
    const ms = Date.now() - started;
    return {
      ok: true,
      message: `מחובר: ${name}. תשובה תוך ${(ms / 1000).toFixed(1)} שניות ("${result.text.trim().slice(0, 40)}").`,
    };
  } catch (err) {
    console.error('Chat model test failed:', err);
    const reason = err instanceof Error ? err.message.slice(0, 160) : 'שגיאה לא ידועה';
    return { ok: false, message: `${name} לא ענה: ${reason}` };
  }
}

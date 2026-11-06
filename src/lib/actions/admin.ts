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
import {
  addNote,
  deleteNote,
  dismissUnknown,
  getNote,
  listApprovedNotes,
  setNoteStatus,
  updateNote,
} from '@/lib/learning/store';
import { lintNote } from '@/lib/learning/lint';
import { localReply } from '@/lib/ai/local/reply';
import type { Note as EngineNote } from '@/lib/ai/local/engine';
import { splitSuggestions } from '@/lib/ai/suggestions';
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

const SAVE_FAILED = 'הפעולה נכשלה. נסו שוב.';
const NOT_FOUND = 'הפריט לא נמצא. ייתכן שנמחק, רעננו את הדף.';
const NEED_LOGIN = 'נדרשת התחברות מחדש. רעננו את הדף.';

export async function teachAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { ok: false, message: NEED_LOGIN };
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
  return {
    ok: true,
    message: 'נשמר כטיוטה. העוזרת עדיין לא משתמשת בזה. בדקי את התשובה ואשרי אותה ברשימה למטה.',
  };
}

const IdSchema = z.string().uuid();

export async function updateNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { ok: false, message: NEED_LOGIN };
  const id = IdSchema.safeParse(formData.get('id'));
  const parsed = NoteSchema.safeParse({
    question: formData.get('question') ?? '',
    answer: formData.get('answer') ?? '',
  });
  if (!id.success) return { ok: false, message: NOT_FOUND };
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'הנתונים אינם תקינים.' };
  }
  try {
    if (!(await updateNote(id.data, parsed.data))) return { ok: false, message: NOT_FOUND };
  } catch (err) {
    console.error('Updating note failed:', err);
    return { ok: false, message: 'השמירה נכשלה. נסו שוב.' };
  }
  revalidatePath('/admin');
  return { ok: true, message: 'השינוי נשמר. התשובה חזרה להיות טיוטה ותחכה לאישור.' };
}

export async function approveNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { ok: false, message: NEED_LOGIN };
  const id = IdSchema.safeParse(formData.get('id'));
  if (!id.success) return { ok: false, message: NOT_FOUND };
  try {
    const note = await getNote(id.data);
    if (!note) return { ok: false, message: NOT_FOUND };
    // The gate is enforced here, on the server, from the saved text. The checkbox in the page is only a convenience.
    const warnings = lintNote(note);
    if (warnings.length > 0 && formData.get('acknowledge') !== 'on') {
      return {
        ok: false,
        message: 'יש אזהרות על התשובה. כדי לאשר, סמני שקראת אותן ושאת מאשרת בכל זאת.',
      };
    }
    await setNoteStatus(id.data, 'approved');
  } catch (err) {
    console.error('Approving note failed:', err);
    return { ok: false, message: SAVE_FAILED };
  }
  revalidatePath('/admin');
  return { ok: true, message: 'אושר. העוזרת תשתמש בזה מעכשיו.' };
}

export async function unapproveNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { ok: false, message: NEED_LOGIN };
  const id = IdSchema.safeParse(formData.get('id'));
  if (!id.success) return { ok: false, message: NOT_FOUND };
  try {
    if (!(await setNoteStatus(id.data, 'draft'))) return { ok: false, message: NOT_FOUND };
  } catch (err) {
    console.error('Unapproving note failed:', err);
    return { ok: false, message: SAVE_FAILED };
  }
  revalidatePath('/admin');
  return { ok: true, message: 'הוחזר לטיוטה. העוזרת לא משתמשת בזה יותר.' };
}

export async function deleteNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { ok: false, message: NEED_LOGIN };
  const id = IdSchema.safeParse(formData.get('id'));
  if (!id.success) return { ok: false, message: NOT_FOUND };
  try {
    if (!(await deleteNote(id.data))) return { ok: false, message: NOT_FOUND };
  } catch (err) {
    console.error('Deleting note failed:', err);
    return { ok: false, message: SAVE_FAILED };
  }
  revalidatePath('/admin');
  return { ok: true, message: 'נמחק.' };
}

export async function dismissUnknownAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { ok: false, message: NEED_LOGIN };
  const id = IdSchema.safeParse(formData.get('id'));
  if (!id.success) return { ok: false, message: NOT_FOUND };
  try {
    await dismissUnknown(id.data);
  } catch (err) {
    console.error('Dismissing question failed:', err);
    return { ok: false, message: SAVE_FAILED };
  }
  revalidatePath('/admin');
  return { ok: true, message: 'הוסר.' };
}

export interface TestState extends FormState {
  /** The answer a visitor would get, with follow-up chips removed. */
  reply?: string;
  chips?: string[];
  /** Whether the draft being edited was part of this test. */
  draftIncluded?: boolean;
}

const TestSchema = z.object({
  visitor: z.string().trim().min(2, 'כתבי שאלה של מבקר').max(300, 'השאלה ארוכה מדי'),
  draftId: z.string().uuid().optional(),
  draftQuestion: z.string().trim().max(300),
  draftAnswer: z.string().trim().max(2000),
});

/**
 * Dry run of the chat: what the local engine answers with the approved notes plus
 * the draft being edited. Nothing is saved, nothing is logged, and no language
 * model is called. (When a model is connected, the live chat words the answer
 * itself, but it is bound by the same approved notes.)
 */
export async function testAnswerAction(_prev: TestState, formData: FormData): Promise<TestState> {
  if (!(await isAdmin())) return { ok: false, message: NEED_LOGIN };
  const rawId = formData.get('draftId');
  const parsed = TestSchema.safeParse({
    visitor: formData.get('visitor') ?? '',
    draftId: typeof rawId === 'string' && rawId ? rawId : undefined,
    draftQuestion: formData.get('question') ?? '',
    draftAnswer: formData.get('answer') ?? '',
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'הנתונים אינם תקינים.' };
  }
  const { visitor, draftId, draftQuestion, draftAnswer } = parsed.data;
  try {
    const approved = await listApprovedNotes();
    const draftUsable = draftQuestion.length > 0 && draftAnswer.length >= 3;
    const notes: EngineNote[] = approved.filter((n) => n.id !== draftId);
    if (draftUsable) {
      notes.push({
        id: draftId ?? 'draft-preview',
        question: draftQuestion,
        answer: draftAnswer,
        status: 'approved',
      });
    }
    const raw = await localReply(visitor, undefined, { notes, recordUnknown: false });
    const { text, options } = splitSuggestions(raw);
    return {
      ok: true,
      message: draftUsable
        ? 'זו התשובה שמבקר היה מקבל אם תאשרי את הטיוטה.'
        : 'זו התשובה שמבקר מקבל עכשיו (הטיוטה לא נכללה: חסרה שאלה או תשובה).',
      reply: text,
      chips: options,
      draftIncluded: draftUsable,
    };
  } catch (err) {
    console.error('Chat dry run failed:', err);
    return { ok: false, message: 'הבדיקה נכשלה. נסו שוב.' };
  }
}

/** Admin-only check that the chat model answers, and how fast. */
export async function testChatAction(_prev: FormState): Promise<FormState> {
  if (!(await isAdmin())) return { ok: false, message: 'נדרשת התחברות.' };
  const model = getChatModel();
  const name = chatModelName();
  if (!model || !name) {
    return {
      ok: false,
      message: 'מצב מקומי, בלי API: העוזרת עונה מהאתר ומהלימוד של ליאור. זה עובד גם בלי מפתח.',
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

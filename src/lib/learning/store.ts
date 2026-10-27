import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import type { Note, NoteStatus } from './types';

export type { Note, NoteStatus };

/**
 * Persistent store for what the attorney teaches the chatbot, plus the questions
 * it could not answer. Uses Netlify Blobs in production (no setup needed on
 * Netlify) and falls back to a local file, then to memory, so the site and the
 * chat never depend on it.
 */

export interface UnknownQuestion {
  id: string;
  question: string;
  count: number;
  lastAt: string;
}

const STORE_NAME = 'lior-learning';
const DATA_DIR = path.join(process.cwd(), '.data');
const memory = new Map<string, string>();

async function readRaw(key: string): Promise<string | null> {
  try {
    const value = await getStore({ name: STORE_NAME, consistency: 'strong' }).get(key, {
      type: 'text',
    });
    return value ?? null;
  } catch {
    /* not running on Netlify (or Blobs unavailable): use the local fallbacks */
  }
  try {
    return await fs.readFile(path.join(DATA_DIR, `${key}.json`), 'utf8');
  } catch {
    return memory.get(key) ?? null;
  }
}

async function writeRaw(key: string, value: string): Promise<void> {
  try {
    await getStore({ name: STORE_NAME, consistency: 'strong' }).set(key, value);
    return;
  } catch {
    /* fall through */
  }
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(path.join(DATA_DIR, `${key}.json`), value, 'utf8');
  } catch {
    memory.set(key, value);
  }
}

async function readList<T>(key: string, isItem: (v: unknown) => v is T): Promise<T[]> {
  const raw = await readRaw(key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isItem) : [];
  } catch {
    return [];
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
const isUnknown = (v: unknown): v is UnknownQuestion =>
  isRecord(v) && typeof v.id === 'string' && typeof v.question === 'string';

/**
 * Notes are stored with both `status` and the legacy `enabled` flag, so older
 * data keeps working and a rollback to older code loses nothing. A note with no
 * `status` is approved only when `enabled === true` (the old rule for "in use").
 */
function normalizeNote(v: unknown): Note | null {
  if (!isRecord(v) || typeof v.id !== 'string' || typeof v.answer !== 'string') return null;
  const status: NoteStatus =
    v.status === 'draft' || v.status === 'approved'
      ? v.status
      : v.enabled === true
        ? 'approved'
        : 'draft';
  return {
    id: v.id,
    question: typeof v.question === 'string' ? v.question : '',
    answer: v.answer,
    status,
    createdAt: typeof v.createdAt === 'string' ? v.createdAt : new Date(0).toISOString(),
    ...(typeof v.updatedAt === 'string' ? { updatedAt: v.updatedAt } : {}),
  };
}

async function readNotes(): Promise<Note[]> {
  const raw = await readList('notes', isRecord);
  return raw.map(normalizeNote).filter((n): n is Note => n !== null);
}

let notesCache: { at: number; notes: Note[] } | null = null;
/** Short on purpose: approving, editing or withdrawing a note must reach the chat within seconds. */
const CACHE_MS = 1_500;

export async function listNotes(): Promise<Note[]> {
  if (notesCache && Date.now() - notesCache.at < CACHE_MS) return notesCache.notes;
  const notes = await readNotes();
  notesCache = { at: Date.now(), notes };
  return notes;
}

/** Only these reach the chat. */
export async function listApprovedNotes(): Promise<Note[]> {
  return (await listNotes()).filter((n) => n.status === 'approved');
}

/** Uncached read, for admin actions that must act on the latest data. */
export async function getNote(id: string): Promise<Note | null> {
  return (await readNotes()).find((n) => n.id === id) ?? null;
}

async function saveNotes(notes: Note[]): Promise<void> {
  const stored = notes.map((n) => ({ ...n, enabled: n.status === 'approved' }));
  await writeRaw('notes', JSON.stringify(stored));
  notesCache = { at: Date.now(), notes };
}

/** New notes always start as drafts. */
export async function addNote(input: { question: string; answer: string }): Promise<Note> {
  const notes = await readNotes();
  const now = new Date().toISOString();
  const note: Note = {
    id: randomUUID(),
    question: input.question,
    answer: input.answer,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
  notes.unshift(note);
  await saveNotes(notes);
  return note;
}

/** Edits a note in place. The text changed, so it goes back to draft and needs approval again. */
export async function updateNote(
  id: string,
  input: { question: string; answer: string },
): Promise<boolean> {
  const notes = await readNotes();
  if (!notes.some((n) => n.id === id)) return false;
  await saveNotes(
    notes.map((n) =>
      n.id === id
        ? { ...n, ...input, status: 'draft', updatedAt: new Date().toISOString() }
        : n,
    ),
  );
  return true;
}

export async function setNoteStatus(id: string, status: NoteStatus): Promise<boolean> {
  const notes = await readNotes();
  if (!notes.some((n) => n.id === id)) return false;
  await saveNotes(
    notes.map((n) =>
      n.id === id ? { ...n, status, updatedAt: new Date().toISOString() } : n,
    ),
  );
  return true;
}

export async function deleteNote(id: string): Promise<boolean> {
  const notes = await readNotes();
  if (!notes.some((n) => n.id === id)) return false;
  await saveNotes(notes.filter((n) => n.id !== id));
  return true;
}

export async function listUnknown(): Promise<UnknownQuestion[]> {
  const items = await readList('unknown', isUnknown);
  return items.sort((a, b) => b.lastAt.localeCompare(a.lastAt));
}

/** Records a question the assistant could not answer; repeats are counted. */
export async function logUnknown(question: string): Promise<void> {
  const items = await readList('unknown', isUnknown);
  const key = question.trim().toLowerCase();
  const existing = items.find((i) => i.question.trim().toLowerCase() === key);
  const now = new Date().toISOString();
  if (existing) {
    existing.count += 1;
    existing.lastAt = now;
  } else {
    items.push({ id: randomUUID(), question: question.trim(), count: 1, lastAt: now });
  }
  await writeRaw('unknown', JSON.stringify(items.slice(-200)));
}

export async function dismissUnknown(id: string): Promise<void> {
  const items = await readList('unknown', isUnknown);
  await writeRaw('unknown', JSON.stringify(items.filter((i) => i.id !== id)));
}

/** What the attorney taught, formatted for the system prompt (empty when nothing). */
export async function getLearnedPrompt(): Promise<string> {
  try {
    const active = await listApprovedNotes();
    if (active.length === 0) return '';
    let out = '';
    for (const n of active) {
      const entry = n.question ? `ש: ${n.question}\nת: ${n.answer}` : `הנחיה: ${n.answer}`;
      if (out.length + entry.length > 12000) break;
      out += `${entry}\n\n`;
    }
    return out.trim();
  } catch (err) {
    console.error('Reading learned notes failed (non-fatal):', err);
    return '';
  }
}

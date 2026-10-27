import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getStore } from '@netlify/blobs';

/**
 * Persistent store for what the attorney teaches the chatbot, plus the questions
 * it could not answer. Uses Netlify Blobs in production (no setup needed on
 * Netlify) and falls back to a local file, then to memory, so the site and the
 * chat never depend on it.
 */

export interface Note {
  id: string;
  /** Optional customer question this answer is for. */
  question: string;
  /** The answer or guidance, in the attorney's words. */
  answer: string;
  enabled: boolean;
  createdAt: string;
}

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
const isNote = (v: unknown): v is Note =>
  isRecord(v) && typeof v.id === 'string' && typeof v.answer === 'string';
const isUnknown = (v: unknown): v is UnknownQuestion =>
  isRecord(v) && typeof v.id === 'string' && typeof v.question === 'string';

let notesCache: { at: number; notes: Note[] } | null = null;
const CACHE_MS = 5_000;

export async function listNotes(): Promise<Note[]> {
  if (notesCache && Date.now() - notesCache.at < CACHE_MS) return notesCache.notes;
  const notes = await readList('notes', isNote);
  notesCache = { at: Date.now(), notes };
  return notes;
}

async function saveNotes(notes: Note[]): Promise<void> {
  await writeRaw('notes', JSON.stringify(notes));
  notesCache = { at: Date.now(), notes };
}

export async function addNote(input: { question: string; answer: string }): Promise<void> {
  const notes = await readList('notes', isNote);
  notes.unshift({
    id: randomUUID(),
    question: input.question,
    answer: input.answer,
    enabled: true,
    createdAt: new Date().toISOString(),
  });
  await saveNotes(notes);
}

export async function setNoteEnabled(id: string, enabled: boolean): Promise<void> {
  const notes = await readList('notes', isNote);
  await saveNotes(notes.map((n) => (n.id === id ? { ...n, enabled } : n)));
}

export async function deleteNote(id: string): Promise<void> {
  const notes = await readList('notes', isNote);
  await saveNotes(notes.filter((n) => n.id !== id));
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
    const active = (await listNotes()).filter((n) => n.enabled);
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

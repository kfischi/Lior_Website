import { splitSpoken, spokenKey } from './spoken';

/** Sentence key -> path of its recording in /public/voice. Empty until recordings are added. */
export type VoiceManifest = Record<string, string>;

let manifest: Promise<VoiceManifest> | null = null;

/** Loaded once per page. Any failure (no file, bad JSON, offline) means "no recordings": the chat then uses the browser voice. */
export function loadVoiceManifest(): Promise<VoiceManifest> {
  manifest ??= fetch('/voice/manifest.json')
    .then((res) => (res.ok ? (res.json() as Promise<unknown>) : {}))
    .then((data) => {
      if (typeof data !== 'object' || data === null || Array.isArray(data)) return {};
      const out: VoiceManifest = {};
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string' && value.startsWith('/voice/')) out[key] = value;
      }
      return out;
    })
    .catch(() => ({}));
  return manifest;
}

/**
 * The recordings for a whole answer, in order, or null. A reply is played from recordings only when every one of
 * its sentences has one: half an answer in one voice and half in another would sound worse than either.
 */
export function recordedPlaylist(text: string, recordings: VoiceManifest): string[] | null {
  const sentences = splitSpoken(text);
  if (sentences.length === 0) return null;
  const files: string[] = [];
  for (const sentence of sentences) {
    const file = recordings[spokenKey(sentence)];
    if (!file) return null;
    files.push(file);
  }
  return files;
}

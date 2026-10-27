/** Shared by the store, the local engine and the admin UI. Safe for client and server. */

export type NoteStatus = 'draft' | 'approved';

export interface Note {
  id: string;
  /** Optional customer question this answer is for. */
  question: string;
  /** The answer or guidance, in the attorney's words. */
  answer: string;
  /** Only approved notes reach the chat (local engine and model prompt). */
  status: NoteStatus;
  createdAt: string;
  updatedAt?: string;
}

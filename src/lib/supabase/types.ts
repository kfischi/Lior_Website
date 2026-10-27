/**
 * Supabase types matching supabase/migrations/0001_init.sql.
 * Regenerate once the project is live:
 *   supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: { id: string; created_at: string; last_active: string; meta: Json };
        Insert: { id?: string; created_at?: string; last_active?: string; meta?: Json };
        Update: { id?: string; created_at?: string; last_active?: string; meta?: Json };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: { id: string; content: string; metadata: Json; embedding: string | null; created_at: string };
        Insert: { id?: string; content: string; metadata?: Json; embedding?: string | null; created_at?: string };
        Update: { id?: string; content?: string; metadata?: Json; embedding?: string | null; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_documents: {
        Args: { query_embedding: string; match_count: number; match_threshold: number };
        Returns: { id: string; content: string; metadata: Json; similarity: number }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

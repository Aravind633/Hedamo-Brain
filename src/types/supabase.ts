export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          user_id: string
          content: string
          title: string | null
          tags: string[] | null
          summary: string | null
          embedding: string | null // Vector type is a string in raw JSON
          is_processing: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          content: string
          title?: string | null
          tags?: string[] | null
          summary?: string | null
          embedding?: string | null
          is_processing?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          title?: string | null
          tags?: string[] | null
          summary?: string | null
          embedding?: string | null
          is_processing?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
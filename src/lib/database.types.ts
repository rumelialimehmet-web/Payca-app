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
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'roommates' | 'vacation' | 'event' | 'general'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type?: 'roommates' | 'vacation' | 'event' | 'general'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'roommates' | 'vacation' | 'event' | 'general'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          group_id: string
          description: string
          amount: number
          paid_by: string
          receipt_url: string | null
          category: 'food' | 'bills' | 'transport' | 'entertainment' | 'other'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_id: string
          description: string
          amount: number
          paid_by: string
          receipt_url?: string | null
          category?: 'food' | 'bills' | 'transport' | 'entertainment' | 'other'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          description?: string
          amount?: number
          paid_by?: string
          receipt_url?: string | null
          category?: 'food' | 'bills' | 'transport' | 'entertainment' | 'other'
          created_at?: string
          updated_at?: string
        }
      }
      expense_splits: {
        Row: {
          id: string
          expense_id: string
          user_id: string
          amount: number
          settled: boolean
          settled_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          user_id: string
          amount: number
          settled?: boolean
          settled_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          expense_id?: string
          user_id?: string
          amount?: number
          settled?: boolean
          settled_at?: string | null
          created_at?: string
        }
      }
      settlements: {
        Row: {
          id: string
          group_id: string
          from_user_id: string
          to_user_id: string
          amount: number
          settled: boolean
          settled_at: string | null
          payment_method: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          from_user_id: string
          to_user_id: string
          amount: number
          settled?: boolean
          settled_at?: string | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          from_user_id?: string
          to_user_id?: string
          amount?: number
          settled?: boolean
          settled_at?: string | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

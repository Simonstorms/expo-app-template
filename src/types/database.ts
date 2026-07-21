export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          onboarding_complete: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      onboarding_responses: {
        Row: {
          id: string;
          user_id: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          payload: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          payload?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      delete_current_user: {
        Args: Record<string, never>;
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

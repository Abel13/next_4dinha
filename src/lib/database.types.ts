export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      match_users: {
        Row: {
          created_at: string;
          dealer: boolean | null;
          lives: number;
          match_id: string;
          next_user: string | null;
          ready: boolean;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          dealer?: boolean | null;
          lives: number;
          match_id: string;
          next_user?: string | null;
          ready?: boolean;
          user_id: string;
        };
        Update: {
          created_at?: string;
          dealer?: boolean | null;
          lives?: number;
          match_id?: string;
          next_user?: string | null;
          ready?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_match_users_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_match_users_next_user_fkey";
            columns: ["next_user"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_match_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      matches: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          status: Database["public"]["Enums"]["match_status"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          status?: Database["public"]["Enums"]["match_status"];
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          status?: Database["public"]["Enums"]["match_status"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_matches_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      round_user_cards: {
        Row: {
          card: number;
          created_at: string;
          id: string;
          round_id: string | null;
          user_id: string | null;
        };
        Insert: {
          card: number;
          created_at?: string;
          id?: string;
          round_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          card?: number;
          created_at?: string;
          id?: string;
          round_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_round_user_cards_round_id_fkey";
            columns: ["round_id"];
            isOneToOne: false;
            referencedRelation: "rounds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_round_user_cards_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      round_users: {
        Row: {
          bet: number | null;
          created_at: string;
          current: boolean;
          round_id: string;
          round_score: number;
          user_id: string;
        };
        Insert: {
          bet?: number | null;
          created_at?: string;
          current?: boolean;
          round_id: string;
          round_score?: number;
          user_id: string;
        };
        Update: {
          bet?: number | null;
          created_at?: string;
          current?: boolean;
          round_id?: string;
          round_score?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_round_users_round_id_fkey";
            columns: ["round_id"];
            isOneToOne: false;
            referencedRelation: "rounds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_round_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      rounds: {
        Row: {
          created_at: string;
          id: string;
          match_id: string;
          number: number;
          trump: number | null;
          done: boolean;
        };
        Insert: {
          created_at?: string;
          id?: string;
          match_id: string;
          number: number;
          trump?: number | null;
          done?: boolean;
        };
        Update: {
          created_at?: string;
          id?: string;
          match_id?: string;
          number?: number;
          trump?: number | null;
          done?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "public_rounds_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          }
        ];
      };
      turns: {
        Row: {
          created_at: string;
          id: string;
          number: number;
          round_id: string;
          winner: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          number: number;
          round_id: string;
          winner?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          number?: number;
          round_id?: string;
          winner?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_turns_round_id_fkey";
            columns: ["round_id"];
            isOneToOne: false;
            referencedRelation: "rounds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_turns_winner_fkey";
            columns: ["winner"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_turn: {
        Row: {
          card_id: string;
          created_at: string;
          turn_id: string;
          user_id: string;
        };
        Insert: {
          card_id: string;
          created_at?: string;
          turn_id: string;
          user_id: string;
        };
        Update: {
          card_id?: string;
          created_at?: string;
          turn_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_user_turn_card_id_fkey";
            columns: ["card_id"];
            isOneToOne: false;
            referencedRelation: "round_user_cards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_user_turn_turn_id_fkey";
            columns: ["turn_id"];
            isOneToOne: false;
            referencedRelation: "turns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_user_turn_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      match_status: "created" | "started" | "finished";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bets: {
        Row: {
          bet: number
          created_at: string | null
          match_id: string
          round_number: number
          user_id: string
        }
        Insert: {
          bet: number
          created_at?: string | null
          match_id: string
          round_number: number
          user_id?: string
        }
        Update: {
          bet?: number
          created_at?: string | null
          match_id?: string
          round_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      deck: {
        Row: {
          id: string
          power: number
          suit: Database["public"]["Enums"]["card_suit"]
          suit_power: number
          symbol: Database["public"]["Enums"]["card_symbol"]
        }
        Insert: {
          id?: string
          power: number
          suit: Database["public"]["Enums"]["card_suit"]
          suit_power: number
          symbol: Database["public"]["Enums"]["card_symbol"]
        }
        Update: {
          id?: string
          power?: number
          suit?: Database["public"]["Enums"]["card_suit"]
          suit_power?: number
          symbol?: Database["public"]["Enums"]["card_symbol"]
        }
        Relationships: []
      }
      match_actions: {
        Row: {
          action: Database["public"]["Enums"]["actions"]
          created_at: string
          id: string
          match_id: string
          round_number: number
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["actions"]
          created_at?: string
          id?: string
          match_id: string
          round_number: number
          user_id?: string
        }
        Update: {
          action?: Database["public"]["Enums"]["actions"]
          created_at?: string
          id?: string
          match_id?: string
          round_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_actions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      match_users: {
        Row: {
          created_at: string | null
          dealer: boolean
          id: string
          lives: number
          match_id: string
          ready: boolean
          table_seat: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dealer?: boolean
          id?: string
          lives?: number
          match_id: string
          ready?: boolean
          table_seat?: number | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          dealer?: boolean
          id?: string
          lives?: number
          match_id?: string
          ready?: boolean
          table_seat?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_users_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          id: string
          name: string
          round_number: number
          status: Database["public"]["Enums"]["match_status"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          round_number?: number
          status?: Database["public"]["Enums"]["match_status"] | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          round_number?: number
          status?: Database["public"]["Enums"]["match_status"] | null
          user_id?: string
        }
        Relationships: []
      }
      player_cards: {
        Row: {
          card_id: string
          created_at: string
          id: string
          match_id: string
          round_number: number
          status: Database["public"]["Enums"]["hand_status"]
          turn: number | null
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          match_id: string
          round_number: number
          status?: Database["public"]["Enums"]["hand_status"]
          turn?: number | null
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          match_id?: string
          round_number?: number
          status?: Database["public"]["Enums"]["hand_status"]
          turn?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "deck"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_cards_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_svg: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_svg?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_svg?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      rounds: {
        Row: {
          match_id: string
          round_number: number
          status: Database["public"]["Enums"]["round_status"]
          trump: string
        }
        Insert: {
          match_id: string
          round_number: number
          status?: Database["public"]["Enums"]["round_status"]
          trump: string
        }
        Update: {
          match_id?: string
          round_number?: number
          status?: Database["public"]["Enums"]["round_status"]
          trump?: string
        }
        Relationships: [
          {
            foreignKeyName: "round_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rounds_trump_fkey"
            columns: ["trump"]
            isOneToOne: false
            referencedRelation: "deck"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_player_cards: {
        Args: { _match_id: string; _round_number: number; _user_id: string }
        Returns: {
          id: string
          status: Database["public"]["Enums"]["hand_status"]
          suit: Database["public"]["Enums"]["card_suit"]
          symbol: Database["public"]["Enums"]["card_symbol"]
          turn: number
          user_id: string
        }[]
      }
      get_user_email: {
        Args: { user_id: string }
        Returns: {
          email: string
        }[]
      }
      update_dealer: {
        Args: { _match_id: string; _table_seat: number }
        Returns: undefined
      }
      update_match_status_to_end: {
        Args: { _match_id: string }
        Returns: undefined
      }
      update_match_status_to_started: {
        Args: { _match_id: string }
        Returns: undefined
      }
      update_player_lives: {
        Args: { _match_id: string; _new_lives: number; _user_id: string }
        Returns: undefined
      }
      update_ready_status: {
        Args: { _is_ready: boolean; _match_id: string }
        Returns: undefined
      }
      update_round_number: {
        Args: { _match_id: string; _new_round_number: number }
        Returns: undefined
      }
    }
    Enums: {
      actions: "deal" | "bet" | "change_status" | "play" | "round_start"
      card_suit: "♣️" | "♥️" | "♠️" | "♦️"
      card_symbol:
        | "A"
        | "2"
        | "3"
        | "4"
        | "5"
        | "6"
        | "7"
        | "8"
        | "9"
        | "10"
        | "Q"
        | "J"
        | "K"
      hand_status: "on hand" | "on table" | "played"
      match_status: "created" | "started" | "end"
      round_status: "dealing" | "betting" | "playing" | "finished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      actions: ["deal", "bet", "change_status", "play", "round_start"],
      card_suit: ["♣️", "♥️", "♠️", "♦️"],
      card_symbol: [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "Q",
        "J",
        "K",
      ],
      hand_status: ["on hand", "on table", "played"],
      match_status: ["created", "started", "end"],
      round_status: ["dealing", "betting", "playing", "finished"],
    },
  },
} as const

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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      agenda_slots: {
        Row: {
          created_at: string | null
          doctor_id: string
          duration: string | null
          id: string
          initials: string | null
          patient_name: string | null
          reason: string | null
          status: Database["public"]["Enums"]["agenda_status"] | null
          time: string
          type: Database["public"]["Enums"]["agenda_type"]
        }
        Insert: {
          created_at?: string | null
          doctor_id: string
          duration?: string | null
          id?: string
          initials?: string | null
          patient_name?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["agenda_status"] | null
          time: string
          type?: Database["public"]["Enums"]["agenda_type"]
        }
        Update: {
          created_at?: string | null
          doctor_id?: string
          duration?: string | null
          id?: string
          initials?: string | null
          patient_name?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["agenda_status"] | null
          time?: string
          type?: Database["public"]["Enums"]["agenda_type"]
        }
        Relationships: [
          {
            foreignKeyName: "agenda_slots_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_slots_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          consultation_id: string
          content: string
          created_at: string | null
          id: string
          sender_id: string
        }
        Insert: {
          consultation_id: string
          content: string
          created_at?: string | null
          id?: string
          sender_id: string
        }
        Update: {
          consultation_id?: string
          content?: string
          created_at?: string | null
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          assigned_at: string | null
          assigned_doctor_id: string | null
          closed_at: string | null
          closure_summary: string | null
          created_at: string | null
          date: string | null
          doctor_id: string | null
          id: string
          intake: Json | null
          patient_id: string
          reason: string | null
          requires_formal_consultation: boolean | null
          severity: Database["public"]["Enums"]["consultation_severity"] | null
          status: Database["public"]["Enums"]["consultation_status"]
          time: string | null
          type: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_doctor_id?: string | null
          closed_at?: string | null
          closure_summary?: string | null
          created_at?: string | null
          date?: string | null
          doctor_id?: string | null
          id?: string
          intake?: Json | null
          patient_id: string
          reason?: string | null
          requires_formal_consultation?: boolean | null
          severity?: Database["public"]["Enums"]["consultation_severity"] | null
          status?: Database["public"]["Enums"]["consultation_status"]
          time?: string | null
          type: string
        }
        Update: {
          assigned_at?: string | null
          assigned_doctor_id?: string | null
          closed_at?: string | null
          closure_summary?: string | null
          created_at?: string | null
          date?: string | null
          doctor_id?: string | null
          id?: string
          intake?: Json | null
          patient_id?: string
          reason?: string | null
          requires_formal_consultation?: boolean | null
          severity?: Database["public"]["Enums"]["consultation_severity"] | null
          status?: Database["public"]["Enums"]["consultation_status"]
          time?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          resource_type: string | null
          resource_id: string | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          actor_id?: string | null
          action: string
          resource_type?: string | null
          resource_id?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          action?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      doctor_approvals: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          specialty: string
          status: Database["public"]["Enums"]["approval_status"]
          user_id: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          specialty: string
          status?: Database["public"]["Enums"]["approval_status"]
          user_id?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          specialty?: string
          status?: Database["public"]["Enums"]["approval_status"]
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string | null
          from: string
          from_initials: string
          from_name: string
          id: string
          preview: string
          thread_id: string | null
          time: string | null
          unread: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          from: string
          from_initials: string
          from_name: string
          id?: string
          preview: string
          thread_id?: string | null
          time?: string | null
          unread?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          from?: string
          from_initials?: string
          from_name?: string
          id?: string
          preview?: string
          thread_id?: string | null
          time?: string | null
          unread?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number | null
          allergies: Json | null
          blood_pressure: string | null
          blood_type: string | null
          chronic_conditions: Json | null
          created_at: string | null
          emergency_contact: Json | null
          family_history: Json | null
          gender: string | null
          heart_rate: number | null
          height: string | null
          id: string
          medications: Json | null
          surgeries: Json | null
          vaccines: Json | null
          weight: string | null
        }
        Insert: {
          age?: number | null
          allergies?: Json | null
          blood_pressure?: string | null
          blood_type?: string | null
          chronic_conditions?: Json | null
          created_at?: string | null
          emergency_contact?: Json | null
          family_history?: Json | null
          gender?: string | null
          heart_rate?: number | null
          height?: string | null
          id: string
          medications?: Json | null
          surgeries?: Json | null
          vaccines?: Json | null
          weight?: string | null
        }
        Update: {
          age?: number | null
          allergies?: Json | null
          blood_pressure?: string | null
          blood_type?: string | null
          chronic_conditions?: Json | null
          created_at?: string | null
          emergency_contact?: Json | null
          family_history?: Json | null
          gender?: string | null
          heart_rate?: number | null
          height?: string | null
          id?: string
          medications?: Json | null
          surgeries?: Json | null
          vaccines?: Json | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          available: boolean | null
          avatar: string | null
          created_at: string | null
          id: string
          last_ui_activity_at: string | null
          name: string
          rating: number | null
          role: Database["public"]["Enums"]["user_role"]
          specialty: string | null
        }
        Insert: {
          available?: boolean | null
          avatar?: string | null
          created_at?: string | null
          id: string
          last_ui_activity_at?: string | null
          name: string
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          specialty?: string | null
        }
        Update: {
          available?: boolean | null
          avatar?: string | null
          created_at?: string | null
          id?: string
          last_ui_activity_at?: string | null
          name?: string
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          specialty?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "patient_records"
            referencedColumns: ["id"]
          },
        ]
      }
      token_transactions: {
        Row: {
          amount: number
          created_at: string | null
          date: string | null
          description: string
          detail: string | null
          id: string
          reference_id: string | null
          status: string | null
          type: Database["public"]["Enums"]["token_type"]
          user_id: string
          week_start: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date?: string | null
          description: string
          detail?: string | null
          id?: string
          reference_id?: string | null
          status?: string | null
          type: Database["public"]["Enums"]["token_type"]
          user_id: string
          week_start?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string | null
          description?: string
          detail?: string | null
          id?: string
          reference_id?: string | null
          status?: string | null
          type?: Database["public"]["Enums"]["token_type"]
          user_id?: string
          week_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      patient_records: {
        Row: {
          age: number | null
          email: string | null
          id: string | null
          last_consultation: string | null
          name: string | null
          status: string | null
        }
        Relationships: []
      }
      users_view: {
        Row: {
          email: string | null
          id: string | null
          name: string | null
          role: string | null
          status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "patient_records"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_admin_stats: { Args: never; Returns: Json }
      auto_off_inactive_doctors: { Args: Record<never, never>; Returns: number }
      log_audit: {
        Args: {
          p_actor_id: string
          p_action: string
          p_resource_type?: string | null
          p_resource_id?: string | null
          p_metadata?: Json | null
        }
        Returns: string
      }
      weekly_token_grant: { Args: Record<never, never>; Returns: number }
      doctor_heartbeat: { Args: { p_doctor_id: string }; Returns: void }
      get_token_balance: {
        Args: { p_user_id: string }
        Returns: number
      }
      start_consultation: {
        Args: {
          p_patient_id: string
          p_reason: string
          p_severity?: string
          p_intake?: Json
        }
        Returns: string
      }
      claim_pending_consultation: {
        Args: { p_consultation_id: string }
        Returns: string
      }
      list_pending_consultations: {
        Args: Record<never, never>
        Returns: {
          id: string
          status: Database["public"]["Enums"]["consultation_status"]
          reason: string | null
          severity: Database["public"]["Enums"]["consultation_severity"] | null
          intake: Json | null
          created_at: string | null
          assigned_at: string | null
          closed_at: string | null
          patient_id: string
          patient_name: string
          patient_avatar: string | null
        }[]
      }
    }
    Enums: {
      agenda_status: "en_curso" | "pendiente" | "completada" | "cancelada"
      agenda_type: "appointment" | "free" | "break"
      approval_status: "pending" | "verified"
      consultation_severity: "low" | "medium" | "high"
      consultation_status: "completed" | "in_progress" | "pending" | "assigned" | "closed"
      token_type: "credit" | "debit"
      user_role: "patient" | "doctor" | "admin"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      agenda_status: ["en_curso", "pendiente", "completada", "cancelada"],
      agenda_type: ["appointment", "free", "break"],
      approval_status: ["pending", "verified"],
      consultation_severity: ["low", "medium", "high"],
      consultation_status: ["completed", "in_progress", "pending"],
      token_type: ["credit", "debit"],
      user_role: ["patient", "doctor", "admin"],
    },
  },
} as const

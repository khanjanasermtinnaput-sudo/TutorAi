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
  public: {
    Tables: {
      ai_learning_patterns: {
        Row: {
          confidence: number
          context: string | null
          created_at: string
          id: string
          pattern: string
          tags: string[]
          type: string
          user_id: string
        }
        Insert: {
          confidence?: number
          context?: string | null
          created_at?: string
          id?: string
          pattern: string
          tags?: string[]
          type: string
          user_id: string
        }
        Update: {
          confidence?: number
          context?: string | null
          created_at?: string
          id?: string
          pattern?: string
          tags?: string[]
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_memory_v2: {
        Row: {
          confidence: number
          created_at: string
          expires_at: string
          key: string
          tags: string[]
          type: string
          updated_at: string
          user_id: string
          value: Json
        }
        Insert: {
          confidence?: number
          created_at?: string
          expires_at: string
          key: string
          tags?: string[]
          type: string
          updated_at?: string
          user_id: string
          value?: Json
        }
        Update: {
          confidence?: number
          created_at?: string
          expires_at?: string
          key?: string
          tags?: string[]
          type?: string
          updated_at?: string
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
      announcements: {
        Row: {
          active: boolean
          body: string
          created_at: string
          created_by: string | null
          cta_label: string | null
          cta_url: string | null
          dismissable: boolean
          ends_at: string | null
          id: string
          show_on: Json
          starts_at: string
          target_tiers: Json | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          body: string
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          dismissable?: boolean
          ends_at?: string | null
          id?: string
          show_on?: Json
          starts_at?: string
          target_tiers?: Json | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          body?: string
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          dismissable?: boolean
          ends_at?: string | null
          id?: string
          show_on?: Json
          starts_at?: string
          target_tiers?: Json | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          count: number
          key: string
          updated_at: string
          window_start: string
        }
        Insert: {
          count?: number
          key: string
          updated_at?: string
          window_start: string
        }
        Update: {
          count?: number
          key?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      api_usage_metrics: {
        Row: {
          completion_tokens: number | null
          cost_usd: number | null
          created_at: string
          error_code: string | null
          error_message: string | null
          feature: string | null
          id: string
          latency_ms: number | null
          model: string
          prompt_tokens: number | null
          provider: string
          route_target: string | null
          success: boolean
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          completion_tokens?: number | null
          cost_usd?: number | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          feature?: string | null
          id?: string
          latency_ms?: number | null
          model: string
          prompt_tokens?: number | null
          provider: string
          route_target?: string | null
          success?: boolean
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          completion_tokens?: number | null
          cost_usd?: number | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          feature?: string | null
          id?: string
          latency_ms?: number | null
          model?: string
          prompt_tokens?: number | null
          provider?: string
          route_target?: string | null
          success?: boolean
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          actor_ip: string | null
          created_at: string
          id: string
          metadata: Json
          outcome: string
          resource_id: string | null
          resource_type: string | null
          severity: string
          ts: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_ip?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          outcome?: string
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          ts?: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_ip?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          outcome?: string
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          ts?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      beta_access: {
        Row: {
          expires_at: string | null
          feature: string
          granted_at: string
          granted_by: string | null
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          feature: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          expires_at?: string | null
          feature?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          ai_provider: string | null
          citations: Json | null
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          ai_provider?: string | null
          citations?: Json | null
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          ai_provider?: string | null
          citations?: Json | null
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          subject_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          subject_id?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          subject_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cli_sessions: {
        Row: {
          created_at: string
          device_name: string | null
          id: string
          ip_address: string | null
          last_active_at: string
          token_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_name?: string | null
          id?: string
          ip_address?: string | null
          last_active_at?: string
          token_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_name?: string | null
          id?: string
          ip_address?: string | null
          last_active_at?: string
          token_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cli_sessions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "cli_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      cli_tokens: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          last_used_at: string | null
          revoked_at: string | null
          token_hash: string
          token_prefix: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          last_used_at?: string | null
          revoked_at?: string | null
          token_hash: string
          token_prefix: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          last_used_at?: string | null
          revoked_at?: string | null
          token_hash?: string
          token_prefix?: string
          user_id?: string
        }
        Relationships: []
      }
      cocode_files: {
        Row: {
          content: string
          created_at: string
          id: string
          path: string
          project_id: string
          sha: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          path: string
          project_id: string
          sha?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          path?: string
          project_id?: string
          sha?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cocode_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          model: string
          title: string
          updated_at: string
          user_id: string
          workspace: string
        }
        Insert: {
          created_at?: string
          id: string
          model?: string
          title?: string
          updated_at?: string
          user_id: string
          workspace?: string
        }
        Update: {
          created_at?: string
          id?: string
          model?: string
          title?: string
          updated_at?: string
          user_id?: string
          workspace?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          created_at: string
          error_code: string
          id: string
          message: string
          stack: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_code: string
          id?: string
          message: string
          stack?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_code?: string
          id?: string
          message?: string
          stack?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      execution_traces: {
        Row: {
          finished_at: string | null
          request_id: string
          started_at: string
          trace: Json
        }
        Insert: {
          finished_at?: string | null
          request_id: string
          started_at?: string
          trace?: Json
        }
        Update: {
          finished_at?: string | null
          request_id?: string
          started_at?: string
          trace?: Json
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          enabled: boolean
          flag_key: string
          id: string
          rollout_pct: number | null
          target_plans: Json | null
          target_roles: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean
          flag_key: string
          id?: string
          rollout_pct?: number | null
          target_plans?: Json | null
          target_roles?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean
          flag_key?: string
          id?: string
          rollout_pct?: number | null
          target_plans?: Json | null
          target_roles?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string
          page: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          page?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          page?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      guest_usage: {
        Row: {
          created_at: string
          email: string
          updated_at: string
          used: number
        }
        Insert: {
          created_at?: string
          email: string
          updated_at?: string
          used?: number
        }
        Update: {
          created_at?: string
          email?: string
          updated_at?: string
          used?: number
        }
        Relationships: []
      }
      image_memories: {
        Row: {
          created_at: string
          detailed_summary: string
          entities: Json
          expires_at: string
          id: string
          image_hash: string
          key_points: Json
          mime_type: string
          ocr_text: string
          reusable_context: string
          scene: string
          short_summary: string
          user_id: string
        }
        Insert: {
          created_at?: string
          detailed_summary?: string
          entities?: Json
          expires_at?: string
          id?: string
          image_hash: string
          key_points?: Json
          mime_type?: string
          ocr_text?: string
          reusable_context?: string
          scene?: string
          short_summary?: string
          user_id: string
        }
        Update: {
          created_at?: string
          detailed_summary?: string
          entities?: Json
          expires_at?: string
          id?: string
          image_hash?: string
          key_points?: Json
          mime_type?: string
          ocr_text?: string
          reusable_context?: string
          scene?: string
          short_summary?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          conflict_tags: string[]
          data: Json
          importance_score: number
          key: string
          last_used_at: string | null
          updated_at: string
          usage_count: number
        }
        Insert: {
          conflict_tags?: string[]
          data?: Json
          importance_score?: number
          key: string
          last_used_at?: string | null
          updated_at?: string
          usage_count?: number
        }
        Update: {
          conflict_tags?: string[]
          data?: Json
          importance_score?: number
          key?: string
          last_used_at?: string | null
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      message_embeddings: {
        Row: {
          created_at: string
          embedding: string | null
          message_id: string
          model: string
        }
        Insert: {
          created_at?: string
          embedding?: string | null
          message_id: string
          model?: string
        }
        Update: {
          created_at?: string
          embedding?: string | null
          message_id?: string
          model?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_embeddings_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: true
            referencedRelation: "conversation_search_v"
            referencedColumns: ["message_id"]
          },
          {
            foreignKeyName: "message_embeddings_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: true
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          model: string | null
          role: string
          route_label: string | null
          route_target: string | null
          search_vector: unknown
          style: string | null
          user_id: string
        }
        Insert: {
          content?: string
          conversation_id: string
          created_at?: string
          id: string
          model?: string | null
          role: string
          route_label?: string | null
          route_target?: string | null
          search_vector?: unknown
          style?: string | null
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          model?: string | null
          role?: string
          route_label?: string | null
          route_target?: string | null
          search_vector?: unknown
          style?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birth_date: string
          created_at: string
          education_level: string
          email: string
          id: string
          nickname: string
          onboarding_completed: boolean
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          subscription_tier: string
          updated_at: string
        }
        Insert: {
          birth_date: string
          created_at?: string
          education_level: string
          email: string
          id: string
          nickname: string
          onboarding_completed?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string
          updated_at?: string
        }
        Update: {
          birth_date?: string
          created_at?: string
          education_level?: string
          email?: string
          id?: string
          nickname?: string
          onboarding_completed?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string
          id: string
          mode: string | null
          name: string
          pinned: boolean
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          mode?: string | null
          name: string
          pinned?: boolean
          status?: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          mode?: string | null
          name?: string
          pinned?: boolean
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      provider_keys: {
        Row: {
          created_at: string
          encrypted_key: string
          key_preview: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          encrypted_key: string
          key_preview: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          encrypted_key?: string
          key_preview?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          choices: Json
          correct_choice: string
          explanation: string
          id: string
          is_correct: boolean | null
          order_index: number
          question_text: string
          quiz_id: string
          user_answer: string | null
        }
        Insert: {
          choices: Json
          correct_choice: string
          explanation: string
          id?: string
          is_correct?: boolean | null
          order_index: number
          question_text: string
          quiz_id: string
          user_answer?: string | null
        }
        Update: {
          choices?: Json
          correct_choice?: string
          explanation?: string
          id?: string
          is_correct?: boolean | null
          order_index?: number
          question_text?: string
          quiz_id?: string
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          completed_at: string | null
          created_at: string
          difficulty: string
          id: string
          question_count: number
          score: number | null
          session_id: string | null
          status: string
          subject_id: string | null
          topic: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          difficulty: string
          id?: string
          question_count: number
          score?: number | null
          session_id?: string | null
          status?: string
          subject_id?: string | null
          topic: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          difficulty?: string
          id?: string
          question_count?: number
          score?: number | null
          session_id?: string | null
          status?: string
          subject_id?: string | null
          topic?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      redeem_code_uses: {
        Row: {
          id: string
          redeem_code_id: string
          redeemed_at: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          redeem_code_id: string
          redeemed_at?: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          redeem_code_id?: string
          redeemed_at?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redeem_code_uses_redeem_code_id_fkey"
            columns: ["redeem_code_id"]
            isOneToOne: false
            referencedRelation: "redeem_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redeem_code_uses_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      redeem_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          disabled_at: string | null
          disabled_by: string | null
          duration_days: number | null
          expires_at: string | null
          id: string
          max_uses: number | null
          plan: string
          single_use_per_user: boolean
          use_count: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          disabled_at?: string | null
          disabled_by?: string | null
          duration_days?: number | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          plan: string
          single_use_per_user?: boolean
          use_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          disabled_at?: string | null
          disabled_by?: string | null
          duration_days?: number | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          plan?: string
          single_use_per_user?: boolean
          use_count?: number
        }
        Relationships: []
      }
      referral_clicks: {
        Row: {
          clicked_at: string
          id: string
          ip_hash: string | null
          referral_code: string
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          ip_hash?: string | null
          referral_code: string
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          id?: string
          ip_hash?: string | null
          referral_code?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          owner_id: string
          total_clicks: number
          total_signups: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          owner_id: string
          total_clicks?: number
          total_signups?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          owner_id?: string
          total_clicks?: number
          total_signups?: number
        }
        Relationships: []
      }
      referral_conversions: {
        Row: {
          converted_at: string
          id: string
          invitee_id: string
          referral_code: string
          referrer_id: string
          reward_at: string | null
          reward_granted: boolean
        }
        Insert: {
          converted_at?: string
          id?: string
          invitee_id: string
          referral_code: string
          referrer_id: string
          reward_at?: string | null
          reward_granted?: boolean
        }
        Update: {
          converted_at?: string
          id?: string
          invitee_id?: string
          referral_code?: string
          referrer_id?: string
          reward_at?: string | null
          reward_granted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "referral_conversions_referral_code_fkey"
            columns: ["referral_code"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["code"]
          },
        ]
      }
      subjects: {
        Row: {
          icon: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          icon?: string | null
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          notes: string | null
          plan: string
          redeem_code_id: string | null
          revoked_at: string | null
          revoked_by: string | null
          source: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          plan: string
          redeem_code_id?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          source?: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          plan?: string
          redeem_code_id?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_redeem_code_id_fkey"
            columns: ["redeem_code_id"]
            isOneToOne: false
            referencedRelation: "redeem_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      system_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          severity: string
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          severity?: string
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          severity?: string
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          occurred_at: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          occurred_at?: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          occurred_at?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      tmap_agent_logs: {
        Row: {
          attempts: number
          cost_usd: number
          duration_ms: number
          id: string
          input_tokens: number
          model: string
          output_tokens: number
          provider: string
          role: string
          session_id: string
          ts: string
        }
        Insert: {
          attempts?: number
          cost_usd?: number
          duration_ms?: number
          id: string
          input_tokens?: number
          model: string
          output_tokens?: number
          provider: string
          role: string
          session_id: string
          ts?: string
        }
        Update: {
          attempts?: number
          cost_usd?: number
          duration_ms?: number
          id?: string
          input_tokens?: number
          model?: string
          output_tokens?: number
          provider?: string
          role?: string
          session_id?: string
          ts?: string
        }
        Relationships: [
          {
            foreignKeyName: "tmap_agent_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "tmap_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tmap_costs: {
        Row: {
          session_count: number
          total_cost_usd: number
          total_tokens: number
          updated_at: string
          user_id: string
        }
        Insert: {
          session_count?: number
          total_cost_usd?: number
          total_tokens?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          session_count?: number
          total_cost_usd?: number
          total_tokens?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tmap_sessions: {
        Row: {
          cost_usd: number
          created_at: string
          files_count: number
          id: string
          iterations: number
          mode: string
          status: string
          summary: string | null
          task: string
          tokens_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cost_usd?: number
          created_at?: string
          files_count?: number
          id: string
          iterations?: number
          mode?: string
          status?: string
          summary?: string | null
          task: string
          tokens_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cost_usd?: number
          created_at?: string
          files_count?: number
          id?: string
          iterations?: number
          mode?: string
          status?: string
          summary?: string | null
          task?: string
          tokens_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      topic_summaries: {
        Row: {
          created_at: string
          education_level: string
          id: string
          sources: Json | null
          subject_id: string | null
          summary_content: Json
          topic: string
        }
        Insert: {
          created_at?: string
          education_level: string
          id?: string
          sources?: Json | null
          subject_id?: string | null
          summary_content: Json
          topic: string
        }
        Update: {
          created_at?: string
          education_level?: string
          id?: string
          sources?: Json | null
          subject_id?: string | null
          summary_content?: Json
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_summaries_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      trace_nodes: {
        Row: {
          agent_id: string
          attempt: number
          confidence: number | null
          cost_usd: number | null
          error: string | null
          id: string
          latency_ms: number | null
          node_id: string
          ok: boolean
          request_id: string
          ts: string
        }
        Insert: {
          agent_id: string
          attempt?: number
          confidence?: number | null
          cost_usd?: number | null
          error?: string | null
          id?: string
          latency_ms?: number | null
          node_id: string
          ok: boolean
          request_id: string
          ts?: string
        }
        Update: {
          agent_id?: string
          attempt?: number
          confidence?: number | null
          cost_usd?: number | null
          error?: string | null
          id?: string
          latency_ms?: number | null
          node_id?: string
          ok?: boolean
          request_id?: string
          ts?: string
        }
        Relationships: [
          {
            foreignKeyName: "trace_nodes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "execution_traces"
            referencedColumns: ["request_id"]
          },
        ]
      }
      usage_limits: {
        Row: {
          created_at: string
          guest_synced: boolean
          last_reset_12h: string
          last_reset_day: string
          last_reset_week: string
          plan: string
          updated_at: string
          used_12h: number
          used_day: number
          used_week: number
          user_id: string
        }
        Insert: {
          created_at?: string
          guest_synced?: boolean
          last_reset_12h?: string
          last_reset_day?: string
          last_reset_week?: string
          plan?: string
          updated_at?: string
          used_12h?: number
          used_day?: number
          used_week?: number
          user_id: string
        }
        Update: {
          created_at?: string
          guest_synced?: boolean
          last_reset_12h?: string
          last_reset_day?: string
          last_reset_week?: string
          plan?: string
          updated_at?: string
          used_12h?: number
          used_day?: number
          used_week?: number
          user_id?: string
        }
        Relationships: []
      }
      usage_logs: {
        Row: {
          action_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          notes: string | null
          role: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          role: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          encrypted_keys: Json
          id: string
          pin_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          encrypted_keys?: Json
          id?: string
          pin_hash: string
          username: string
        }
        Update: {
          created_at?: string
          encrypted_keys?: Json
          id?: string
          pin_hash?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      conversation_search_v: {
        Row: {
          content: string | null
          conversation_id: string | null
          conversation_title: string | null
          conversation_updated_at: string | null
          created_at: string | null
          message_id: string | null
          role: string | null
          search_vector: unknown
          user_id: string | null
          workspace: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_list_users: {
        Args: {
          p_limit?: number
          p_page?: number
          p_plan?: string
          p_role?: string
          p_search?: string
          p_status?: string
        }
        Returns: Json
      }
      consume_guest_tokens: {
        Args: { p_email: string; p_tokens: number }
        Returns: {
          created_at: string
          email: string
          updated_at: string
          used: number
        }
        SetofOptions: {
          from: "*"
          to: "guest_usage"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      consume_usage_tokens: {
        Args: {
          p_12h_start: string
          p_day_start: string
          p_plan: string
          p_tokens: number
          p_user_id: string
          p_week_start: string
        }
        Returns: {
          created_at: string
          guest_synced: boolean
          last_reset_12h: string
          last_reset_day: string
          last_reset_week: string
          plan: string
          updated_at: string
          used_12h: number
          used_day: number
          used_week: number
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "usage_limits"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      increment_rate_limit: {
        Args: { p_key: string; p_max: number; p_window_start: string }
        Returns: number
      }
      increment_redeem_code_use_count: {
        Args: { p_code_id: string }
        Returns: undefined
      }
      record_referral_click: {
        Args: { p_code: string; p_ip_hash?: string; p_ua?: string }
        Returns: undefined
      }
      record_referral_conversion: {
        Args: { p_code: string; p_invitee: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

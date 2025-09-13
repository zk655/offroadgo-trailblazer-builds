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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blog_images: {
        Row: {
          alt_text: string | null
          blog_id: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          blog_id?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          blog_id?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_images_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author: string | null
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          external_url: string | null
          id: string
          images: string[] | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          external_url?: string | null
          id?: string
          images?: string[] | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          external_url?: string | null
          id?: string
          images?: string[] | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      builds: {
        Row: {
          created_at: string
          description: string | null
          id: string
          mod_ids: string[] | null
          name: string
          total_cost: number | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          mod_ids?: string[] | null
          name: string
          total_cost?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          mod_ids?: string[] | null
          name?: string
          total_cost?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "builds_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      clubs: {
        Row: {
          club_type: string | null
          contact_email: string | null
          country: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          id: string
          image_url: string | null
          location: string | null
          member_count: number | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          club_type?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          image_url?: string | null
          location?: string | null
          member_count?: number | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          club_type?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          image_url?: string | null
          location?: string | null
          member_count?: number | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          club_id: string | null
          country: string | null
          created_at: string
          current_participants: number | null
          description: string | null
          difficulty_level: string | null
          end_date: string | null
          entry_fee: number | null
          event_type: string | null
          external_url: string | null
          id: string
          image_url: string | null
          location: string | null
          max_participants: number | null
          start_date: string | null
          terrain_type: string | null
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          club_id?: string | null
          country?: string | null
          created_at?: string
          current_participants?: number | null
          description?: string | null
          difficulty_level?: string | null
          end_date?: string | null
          entry_fee?: number | null
          event_type?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          max_participants?: number | null
          start_date?: string | null
          terrain_type?: string | null
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          club_id?: string | null
          country?: string | null
          created_at?: string
          current_participants?: number | null
          description?: string | null
          difficulty_level?: string | null
          end_date?: string | null
          entry_fee?: number | null
          event_type?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          max_participants?: number | null
          start_date?: string | null
          terrain_type?: string | null
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_providers: {
        Row: {
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          coverage_areas: string[] | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          rating: number | null
          specializes_in: string[] | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          coverage_areas?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          rating?: number | null
          specializes_in?: string[] | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          coverage_areas?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          rating?: number | null
          specializes_in?: string[] | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      insurance_quotes: {
        Row: {
          annual_premium: number | null
          coverage_limit: number | null
          coverage_type: string
          created_at: string
          deductible: number | null
          effective_date: string | null
          expiry_date: string | null
          features: string[] | null
          id: string
          max_age: number | null
          min_age: number | null
          min_experience_years: number | null
          monthly_premium: number | null
          provider_id: string
          state_code: string | null
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          annual_premium?: number | null
          coverage_limit?: number | null
          coverage_type: string
          created_at?: string
          deductible?: number | null
          effective_date?: string | null
          expiry_date?: string | null
          features?: string[] | null
          id?: string
          max_age?: number | null
          min_age?: number | null
          min_experience_years?: number | null
          monthly_premium?: number | null
          provider_id: string
          state_code?: string | null
          updated_at?: string
          vehicle_type: string
        }
        Update: {
          annual_premium?: number | null
          coverage_limit?: number | null
          coverage_type?: string
          created_at?: string
          deductible?: number | null
          effective_date?: string | null
          expiry_date?: string | null
          features?: string[] | null
          id?: string
          max_age?: number | null
          min_age?: number | null
          min_experience_years?: number | null
          monthly_premium?: number | null
          provider_id?: string
          state_code?: string | null
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_quotes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_quotes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      mods: {
        Row: {
          amazon_link: string | null
          brand: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          price: number | null
          rating: number | null
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amazon_link?: string | null
          brand?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          price?: number | null
          rating?: number | null
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amazon_link?: string | null
          brand?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          price?: number | null
          rating?: number | null
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      trails: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string | null
          distance: number | null
          elevation_gain: number | null
          gpx_url: string | null
          id: string
          image_url: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
          slug: string | null
          terrain: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          distance?: number | null
          elevation_gain?: number | null
          gpx_url?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name: string
          slug?: string | null
          terrain?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          distance?: number | null
          elevation_gain?: number | null
          gpx_url?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string
          slug?: string | null
          terrain?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          approach_angle: number | null
          approach_angle_degrees: number | null
          brand: string
          breakover_angle: number | null
          cargo_capacity: number | null
          clearance: number | null
          created_at: string
          departure_angle: number | null
          departure_angle_degrees: number | null
          drivetrain: string | null
          engine: string | null
          fuel_tank_capacity: number | null
          fuel_type: string | null
          ground_clearance: number | null
          horsepower: number | null
          id: string
          image_url: string | null
          max_payload: number | null
          mpg: number | null
          name: string
          price: number | null
          safety_rating: number | null
          seating_capacity: number | null
          slug: string | null
          starting_price: number | null
          tire_size: string | null
          top_speed: number | null
          torque: number | null
          towing_capacity: number | null
          transmission: string | null
          type: string
          updated_at: string
          wading_depth: number | null
          warranty: string | null
          year: number | null
          zero_to_sixty: number | null
        }
        Insert: {
          approach_angle?: number | null
          approach_angle_degrees?: number | null
          brand: string
          breakover_angle?: number | null
          cargo_capacity?: number | null
          clearance?: number | null
          created_at?: string
          departure_angle?: number | null
          departure_angle_degrees?: number | null
          drivetrain?: string | null
          engine?: string | null
          fuel_tank_capacity?: number | null
          fuel_type?: string | null
          ground_clearance?: number | null
          horsepower?: number | null
          id?: string
          image_url?: string | null
          max_payload?: number | null
          mpg?: number | null
          name: string
          price?: number | null
          safety_rating?: number | null
          seating_capacity?: number | null
          slug?: string | null
          starting_price?: number | null
          tire_size?: string | null
          top_speed?: number | null
          torque?: number | null
          towing_capacity?: number | null
          transmission?: string | null
          type: string
          updated_at?: string
          wading_depth?: number | null
          warranty?: string | null
          year?: number | null
          zero_to_sixty?: number | null
        }
        Update: {
          approach_angle?: number | null
          approach_angle_degrees?: number | null
          brand?: string
          breakover_angle?: number | null
          cargo_capacity?: number | null
          clearance?: number | null
          created_at?: string
          departure_angle?: number | null
          departure_angle_degrees?: number | null
          drivetrain?: string | null
          engine?: string | null
          fuel_tank_capacity?: number | null
          fuel_type?: string | null
          ground_clearance?: number | null
          horsepower?: number | null
          id?: string
          image_url?: string | null
          max_payload?: number | null
          mpg?: number | null
          name?: string
          price?: number | null
          safety_rating?: number | null
          seating_capacity?: number | null
          slug?: string | null
          starting_price?: number | null
          tire_size?: string | null
          top_speed?: number | null
          torque?: number | null
          towing_capacity?: number | null
          transmission?: string | null
          type?: string
          updated_at?: string
          wading_depth?: number | null
          warranty?: string | null
          year?: number | null
          zero_to_sixty?: number | null
        }
        Relationships: []
      }
      video_interactions: {
        Row: {
          created_at: string
          id: string
          interaction_type: string
          user_id: string | null
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_type: string
          user_id?: string | null
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interaction_type?: string
          user_id?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_interactions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_tags: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          usage_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          usage_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration: number | null
          file_size: number | null
          id: string
          is_featured: boolean | null
          is_trending: boolean | null
          like_count: number | null
          metadata_extracted: boolean | null
          processing_status: string | null
          published_at: string | null
          resolution: string | null
          save_count: number | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          share_count: number | null
          slug: string | null
          status: string | null
          tags: string[] | null
          thumbnail_generated: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_format: string | null
          video_url: string
          view_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          file_size?: number | null
          id?: string
          is_featured?: boolean | null
          is_trending?: boolean | null
          like_count?: number | null
          metadata_extracted?: boolean | null
          processing_status?: string | null
          published_at?: string | null
          resolution?: string | null
          save_count?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          share_count?: number | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail_generated?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_format?: string | null
          video_url: string
          view_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          file_size?: number | null
          id?: string
          is_featured?: boolean | null
          is_trending?: boolean | null
          like_count?: number | null
          metadata_extracted?: boolean | null
          processing_status?: string | null
          published_at?: string | null
          resolution?: string | null
          save_count?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          share_count?: number | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail_generated?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_format?: string | null
          video_url?: string
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      insurance_providers_public: {
        Row: {
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          coverage_areas: string[] | null
          created_at: string | null
          description: string | null
          id: string | null
          logo_url: string | null
          name: string | null
          rating: number | null
          specializes_in: string[] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          company_name?: string | null
          contact_email?: never
          contact_phone?: never
          coverage_areas?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          logo_url?: string | null
          name?: string | null
          rating?: number | null
          specializes_in?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          company_name?: string | null
          contact_email?: never
          contact_phone?: never
          coverage_areas?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          logo_url?: string | null
          name?: string | null
          rating?: number | null
          specializes_in?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_slug: {
        Args: { input_text: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_video_metadata: {
        Args: { original_filename: string; video_id: string; video_url: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
      app_role: ["admin", "editor", "user"],
    },
  },
} as const

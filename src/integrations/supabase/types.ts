export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          author: string | null
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          external_url: string | null
          id: string
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
          title?: string
          updated_at?: string
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
          terrain?: string | null
          updated_at?: string
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

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
      admin_invites: {
        Row: {
          accepted: boolean
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          accepted?: boolean
          created_at?: string
          email: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          accepted?: boolean
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          cover_url: string
          created_at: string
          excerpt: string
          id: string
          published: boolean
          published_at: string | null
          seo_description: string
          seo_title: string
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content?: string
          cover_url?: string
          created_at?: string
          excerpt?: string
          id?: string
          published?: boolean
          published_at?: string | null
          seo_description?: string
          seo_title?: string
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          cover_url?: string
          created_at?: string
          excerpt?: string
          id?: string
          published?: boolean
          published_at?: string | null
          seo_description?: string
          seo_title?: string
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          budget: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          property_type: string
          read: boolean
          updated_at: string
        }
        Insert: {
          budget?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name: string
          phone?: string
          property_type?: string
          read?: boolean
          updated_at?: string
        }
        Update: {
          budget?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          property_type?: string
          read?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          body: string
          content: Json
          created_at: string
          eyebrow: string
          id: string
          kind: string
          section_key: string
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          body?: string
          content?: Json
          created_at?: string
          eyebrow?: string
          id?: string
          kind: string
          section_key: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          body?: string
          content?: Json
          created_at?: string
          eyebrow?: string
          id?: string
          kind?: string
          section_key?: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt: string
          created_at: string
          folder: string
          id: string
          mime_type: string
          name: string
          path: string
          size_bytes: number
          updated_at: string
          url: string
        }
        Insert: {
          alt?: string
          created_at?: string
          folder?: string
          id?: string
          mime_type?: string
          name: string
          path: string
          size_bytes?: number
          updated_at?: string
          url: string
        }
        Update: {
          alt?: string
          created_at?: string
          folder?: string
          id?: string
          mime_type?: string
          name?: string
          path?: string
          size_bytes?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          created_at: string
          href: string
          id: string
          label: string
          location: string
          parent_id: string | null
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          href?: string
          id?: string
          label: string
          location?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          label?: string
          location?: string
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "nav_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "nav_items"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          body: string
          content: Json
          created_at: string
          eyebrow: string
          id: string
          image_url: string
          kind: string
          page_key: string
          section_key: string
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          body?: string
          content?: Json
          created_at?: string
          eyebrow?: string
          id?: string
          image_url?: string
          kind?: string
          page_key: string
          section_key: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          body?: string
          content?: Json
          created_at?: string
          eyebrow?: string
          id?: string
          image_url?: string
          kind?: string
          page_key?: string
          section_key?: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      project_images: {
        Row: {
          alt: string
          created_at: string
          id: string
          project_id: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          alt?: string
          created_at?: string
          id?: string
          project_id: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          project_id?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          after_url: string | null
          before_url: string | null
          categories: string[]
          client_name: string | null
          completion_date: string | null
          cover_url: string
          created_at: string
          description: string
          duration: string
          id: string
          location: string
          name: string
          project_type: string
          published: boolean
          scope: string[]
          slug: string
          sort_order: number
          style: string
          updated_at: string
          year: string
        }
        Insert: {
          after_url?: string | null
          before_url?: string | null
          categories?: string[]
          client_name?: string | null
          completion_date?: string | null
          cover_url?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          location?: string
          name: string
          project_type?: string
          published?: boolean
          scope?: string[]
          slug: string
          sort_order?: number
          style?: string
          updated_at?: string
          year?: string
        }
        Update: {
          after_url?: string | null
          before_url?: string | null
          categories?: string[]
          client_name?: string | null
          completion_date?: string | null
          cover_url?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          location?: string
          name?: string
          project_type?: string
          published?: boolean
          scope?: string[]
          slug?: string
          sort_order?: number
          style?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      seo_meta: {
        Row: {
          canonical: string
          created_at: string
          description: string
          id: string
          noindex: boolean
          og_image: string
          page_key: string
          path: string
          schema_json: string
          title: string
          updated_at: string
        }
        Insert: {
          canonical?: string
          created_at?: string
          description?: string
          id?: string
          noindex?: boolean
          og_image?: string
          page_key: string
          path?: string
          schema_json?: string
          title?: string
          updated_at?: string
        }
        Update: {
          canonical?: string
          created_at?: string
          description?: string
          id?: string
          noindex?: boolean
          og_image?: string
          page_key?: string
          path?: string
          schema_json?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          bullets: string[]
          created_at: string
          description: string
          icon: string
          id: string
          image_url: string
          number_label: string
          slug: string
          sort_order: number
          summary: string
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          bullets?: string[]
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_url?: string
          number_label?: string
          slug: string
          sort_order?: number
          summary?: string
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          bullets?: string[]
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image_url?: string
          number_label?: string
          slug?: string
          sort_order?: number
          summary?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string
          business_name: string
          copyright: string
          created_at: string
          email: string
          favicon_url: string
          footer_blurb: string
          header_cta_label: string
          hours: Json
          id: string
          logo_url: string
          maps_url: string
          phone_display: string
          phone_link: string
          singleton: boolean
          socials: Json
          tagline: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          address?: string
          business_name?: string
          copyright?: string
          created_at?: string
          email?: string
          favicon_url?: string
          footer_blurb?: string
          header_cta_label?: string
          hours?: Json
          id?: string
          logo_url?: string
          maps_url?: string
          phone_display?: string
          phone_link?: string
          singleton?: boolean
          socials?: Json
          tagline?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          address?: string
          business_name?: string
          copyright?: string
          created_at?: string
          email?: string
          favicon_url?: string
          footer_blurb?: string
          header_cta_label?: string
          hours?: Json
          id?: string
          logo_url?: string
          maps_url?: string
          phone_display?: string
          phone_link?: string
          singleton?: boolean
          socials?: Json
          tagline?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          detail: string
          id: string
          name: string
          photo_url: string
          project_name: string
          quote: string
          rating: number
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          detail?: string
          id?: string
          name: string
          photo_url?: string
          project_name?: string
          quote: string
          rating?: number
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          detail?: string
          id?: string
          name?: string
          photo_url?: string
          project_name?: string
          quote?: string
          rating?: number
          sort_order?: number
          updated_at?: string
          visible?: boolean
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit: { Args: { _user_id: string }; Returns: boolean }
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "editor"],
    },
  },
} as const

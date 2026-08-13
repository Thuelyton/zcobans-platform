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
      admin_users: {
        Row: {
          id: string
          name: string | null
          role: string | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          role?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          role?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          site_name: string
          site_description: string | null
          logo_url: string | null
          favicon_url: string | null
          theme_color: string | null
          social_links: Json | null
          maintenance_mode: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          site_name: string
          site_description?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          theme_color?: string | null
          social_links?: Json | null
          maintenance_mode?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          site_name?: string
          site_description?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          theme_color?: string | null
          social_links?: Json | null
          maintenance_mode?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          image_url: string
          link_url: string | null
          button_text: string | null
          position: number | null
          active: boolean | null
          starts_at: string | null
          ends_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          image_url: string
          link_url?: string | null
          button_text?: string | null
          position?: number | null
          active?: boolean | null
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          image_url?: string
          link_url?: string | null
          button_text?: string | null
          position?: number | null
          active?: boolean | null
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          id: string
          title: string
          description: string | null
          discount_type: string | null
          discount_value: number | null
          code: string | null
          active: boolean | null
          starts_at: string | null
          ends_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          code?: string | null
          active?: boolean | null
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          code?: string | null
          active?: boolean | null
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          position: number | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          position?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          position?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          description: string | null
          short_description: string | null
          features: Json
          price: number | null
          image_url: string | null
          position: number | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          features?: Json
          price?: number | null
          image_url?: string | null
          position?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          features?: Json
          price?: number | null
          image_url?: string | null
          position?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_status: {
        Row: {
          id: string
          service_id: string | null
          status: string
          message: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          service_id?: string | null
          status: string
          message?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          service_id?: string | null
          status?: string
          message?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trust_indicators: {
        Row: {
          id: string
          type: string
          title: string | null
          description: string | null
          image_url: string | null
          position: number | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          type: string
          title?: string | null
          description?: string | null
          image_url?: string | null
          position?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          type?: string
          title?: string | null
          description?: string | null
          image_url?: string | null
          position?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          message: string | null
          status: string | null
          source: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          message?: string | null
          status?: string | null
          source?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          message?: string | null
          status?: string | null
          source?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          position: number | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          position?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          position?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_settings: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          whatsapp: string | null
          address: string | null
          maps_url: string | null
          business_hours: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email?: string | null
          phone?: string | null
          whatsapp?: string | null
          address?: string | null
          maps_url?: string | null
          business_hours?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          whatsapp?: string | null
          address?: string | null
          maps_url?: string | null
          business_hours?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_sections: {
        Row: {
          id: string
          identifier: string
          title: string | null
          content: string | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          identifier: string
          title?: string | null
          content?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          identifier?: string
          title?: string | null
          content?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      query_providers: {
        Row: {
          id: string
          name: string
          slug: string
          type: string
          description: string | null
          config: Json | null
          credits_per_query: number | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          type: string
          description?: string | null
          config?: Json | null
          credits_per_query?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          type?: string
          description?: string | null
          config?: Json | null
          credits_per_query?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      consultations: {
        Row: {
          id: string
          user_id: string | null
          provider_id: string | null
          client_name: string
          client_document: string
          document_type: string
          query_type: string
          status: string | null
          error_message: string | null
          credits_used: number | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          provider_id?: string | null
          client_name: string
          client_document: string
          document_type: string
          query_type: string
          status?: string | null
          error_message?: string | null
          credits_used?: number | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          provider_id?: string | null
          client_name?: string
          client_document?: string
          document_type?: string
          query_type?: string
          status?: string | null
          error_message?: string | null
          credits_used?: number | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'consultations_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'consultations_provider_id_fkey'
            columns: ['provider_id']
            isOneToOne: false
            referencedRelation: 'query_providers'
            referencedColumns: ['id']
          },
        ]
      }
      consultation_results: {
        Row: {
          id: string
          consultation_id: string | null
          provider_id: string | null
          raw_data: Json
          processed_data: Json | null
          score: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          consultation_id?: string | null
          provider_id?: string | null
          raw_data: Json
          processed_data?: Json | null
          score?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          consultation_id?: string | null
          provider_id?: string | null
          raw_data?: Json
          processed_data?: Json | null
          score?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'consultation_results_consultation_id_fkey'
            columns: ['consultation_id']
            isOneToOne: false
            referencedRelation: 'consultations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'consultation_results_provider_id_fkey'
            columns: ['provider_id']
            isOneToOne: false
            referencedRelation: 'query_providers'
            referencedColumns: ['id']
          },
        ]
      }
      designer_projects: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          description: string | null
          page_data: Json
          published: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          description?: string | null
          page_data: Json
          published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          description?: string | null
          page_data?: Json
          published?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'designer_projects_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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

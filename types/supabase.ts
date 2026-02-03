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
    PostgrestVersion: "14.1"
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
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          address_type: Database["public"]["Enums"]["address_type"] | null
          country: string | null
          created_at: string
          id: string
          is_current: boolean | null
          participant_id: string
          postcode: string
          state: string
          suburb: string
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          address_type?: Database["public"]["Enums"]["address_type"] | null
          country?: string | null
          created_at?: string
          id?: string
          is_current?: boolean | null
          participant_id: string
          postcode: string
          state: string
          suburb: string
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          address_type?: Database["public"]["Enums"]["address_type"] | null
          country?: string | null
          created_at?: string
          id?: string
          is_current?: boolean | null
          participant_id?: string
          postcode?: string
          state?: string
          suburb?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "addresses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_categories: {
        Row: {
          allocated_amount: number
          category: Database["public"]["Enums"]["budget_category_type"]
          committed_amount: number | null
          created_at: string
          id: string
          plan_id: string
          spent_amount: number | null
          subcategory: string | null
          support_item_name: string | null
          support_item_number: string | null
          updated_at: string
        }
        Insert: {
          allocated_amount?: number
          category: Database["public"]["Enums"]["budget_category_type"]
          committed_amount?: number | null
          created_at?: string
          id?: string
          plan_id: string
          spent_amount?: number | null
          subcategory?: string | null
          support_item_name?: string | null
          support_item_number?: string | null
          updated_at?: string
        }
        Update: {
          allocated_amount?: number
          category?: Database["public"]["Enums"]["budget_category_type"]
          committed_amount?: number | null
          created_at?: string
          id?: string
          plan_id?: string
          spent_amount?: number | null
          subcategory?: string | null
          support_item_name?: string | null
          support_item_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "ndis_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_categories_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["plan_id"]
          },
        ]
      }
      consents: {
        Row: {
          consent_date: string | null
          consent_document_url: string | null
          consent_expiry_date: string | null
          consent_given: boolean | null
          consent_notes: string | null
          consent_type: string
          created_at: string
          id: string
          participant_id: string
          updated_at: string
          withdrawn_date: string | null
        }
        Insert: {
          consent_date?: string | null
          consent_document_url?: string | null
          consent_expiry_date?: string | null
          consent_given?: boolean | null
          consent_notes?: string | null
          consent_type: string
          created_at?: string
          id?: string
          participant_id: string
          updated_at?: string
          withdrawn_date?: string | null
        }
        Update: {
          consent_date?: string | null
          consent_document_url?: string | null
          consent_expiry_date?: string | null
          consent_given?: boolean | null
          consent_notes?: string | null
          consent_type?: string
          created_at?: string
          id?: string
          participant_id?: string
          updated_at?: string
          withdrawn_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consents_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consents_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "consents_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          alternative_phone: string | null
          created_at: string
          id: string
          name: string
          participant_id: string
          phone: string
          priority_order: number | null
          relationship: string
          updated_at: string
        }
        Insert: {
          alternative_phone?: string | null
          created_at?: string
          id?: string
          name: string
          participant_id: string
          phone: string
          priority_order?: number | null
          relationship: string
          updated_at?: string
        }
        Update: {
          alternative_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          participant_id?: string
          phone?: string
          priority_order?: number | null
          relationship?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_contacts_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "emergency_contacts_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          country: string | null
          created_at: string
          department: string | null
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          phone: string | null
          post_code: string | null
          role: string | null
          state: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          phone?: string | null
          post_code?: string | null
          role?: string | null
          state?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          phone?: string | null
          post_code?: string | null
          role?: string | null
          state?: string | null
          status?: string | null
        }
        Relationships: []
      }
      guardians: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          has_decision_authority: boolean | null
          id: string
          is_primary: boolean | null
          last_name: string
          participant_id: string
          phone: string
          relationship: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          has_decision_authority?: boolean | null
          id?: string
          is_primary?: boolean | null
          last_name: string
          participant_id: string
          phone: string
          relationship: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          has_decision_authority?: boolean | null
          id?: string
          is_primary?: boolean | null
          last_name?: string
          participant_id?: string
          phone?: string
          relationship?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardians_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardians_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "guardians_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_reports: {
        Row: {
          action_taken: string | null
          booking_id: string | null
          created_at: string
          created_by: string | null
          created_by_name: string
          description: string
          follow_up_notes: string | null
          follow_up_required: boolean | null
          id: string
          incident_date: string
          incident_time: string | null
          incident_type: string
          participant_id: string
          reported_to_guardian: boolean | null
          reported_to_guardian_date: string | null
          reported_to_ndis: boolean | null
          reported_to_ndis_date: string | null
          resolved_date: string | null
          severity: string | null
          updated_at: string
          witnesses: string | null
        }
        Insert: {
          action_taken?: string | null
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          created_by_name: string
          description: string
          follow_up_notes?: string | null
          follow_up_required?: boolean | null
          id?: string
          incident_date: string
          incident_time?: string | null
          incident_type: string
          participant_id: string
          reported_to_guardian?: boolean | null
          reported_to_guardian_date?: string | null
          reported_to_ndis?: boolean | null
          reported_to_ndis_date?: string | null
          resolved_date?: string | null
          severity?: string | null
          updated_at?: string
          witnesses?: string | null
        }
        Update: {
          action_taken?: string | null
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          created_by_name?: string
          description?: string
          follow_up_notes?: string | null
          follow_up_required?: boolean | null
          id?: string
          incident_date?: string
          incident_time?: string | null
          incident_type?: string
          participant_id?: string
          reported_to_guardian?: boolean | null
          reported_to_guardian_date?: string | null
          reported_to_ndis?: boolean | null
          reported_to_ndis_date?: string | null
          resolved_date?: string | null
          severity?: string | null
          updated_at?: string
          witnesses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_reports_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "service_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_reports_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_reports_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "incident_reports_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_info: {
        Row: {
          allergies: string | null
          behaviour_support_needs: string | null
          communication_needs: string | null
          dietary_requirements: string | null
          gp_clinic: string | null
          gp_name: string | null
          gp_phone: string | null
          last_updated: string
          medicare_number: string | null
          medications: string | null
          mobility_needs: string | null
          ndis_health_care_card: string | null
          notes: string | null
          participant_id: string
          primary_diagnosis: string | null
          secondary_diagnosis: string | null
          sensory_sensitivities: string | null
          therapy_providers: string | null
          updated_by: string | null
        }
        Insert: {
          allergies?: string | null
          behaviour_support_needs?: string | null
          communication_needs?: string | null
          dietary_requirements?: string | null
          gp_clinic?: string | null
          gp_name?: string | null
          gp_phone?: string | null
          last_updated?: string
          medicare_number?: string | null
          medications?: string | null
          mobility_needs?: string | null
          ndis_health_care_card?: string | null
          notes?: string | null
          participant_id: string
          primary_diagnosis?: string | null
          secondary_diagnosis?: string | null
          sensory_sensitivities?: string | null
          therapy_providers?: string | null
          updated_by?: string | null
        }
        Update: {
          allergies?: string | null
          behaviour_support_needs?: string | null
          communication_needs?: string | null
          dietary_requirements?: string | null
          gp_clinic?: string | null
          gp_name?: string | null
          gp_phone?: string | null
          last_updated?: string
          medicare_number?: string | null
          medications?: string | null
          mobility_needs?: string | null
          ndis_health_care_card?: string | null
          notes?: string | null
          participant_id?: string
          primary_diagnosis?: string | null
          secondary_diagnosis?: string | null
          sensory_sensitivities?: string | null
          therapy_providers?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_info_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: true
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_info_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: true
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "medical_info_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: true
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      ndis_plans: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          notes: string | null
          participant_id: string
          plan_end: string
          plan_manager_contact: string | null
          plan_manager_email: string | null
          plan_manager_name: string | null
          plan_manager_type: Database["public"]["Enums"]["plan_manager_type"]
          plan_number: string | null
          plan_review_date: string | null
          plan_start: string
          support_coordination_level: string | null
          support_coordinator_contact: string | null
          support_coordinator_name: string | null
          total_budget: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          participant_id: string
          plan_end: string
          plan_manager_contact?: string | null
          plan_manager_email?: string | null
          plan_manager_name?: string | null
          plan_manager_type: Database["public"]["Enums"]["plan_manager_type"]
          plan_number?: string | null
          plan_review_date?: string | null
          plan_start: string
          support_coordination_level?: string | null
          support_coordinator_contact?: string | null
          support_coordinator_name?: string | null
          total_budget?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          participant_id?: string
          plan_end?: string
          plan_manager_contact?: string | null
          plan_manager_email?: string | null
          plan_manager_name?: string | null
          plan_manager_type?: Database["public"]["Enums"]["plan_manager_type"]
          plan_number?: string | null
          plan_review_date?: string | null
          plan_start?: string
          support_coordination_level?: string | null
          support_coordinator_contact?: string | null
          support_coordinator_name?: string | null
          total_budget?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ndis_plans_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ndis_plans_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "ndis_plans_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_documents: {
        Row: {
          document_category: string | null
          document_type: string
          expiry_date: string | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          is_current: boolean | null
          mime_type: string | null
          notes: string | null
          participant_id: string
          uploaded_at: string
          uploaded_by: string | null
          uploaded_by_name: string | null
        }
        Insert: {
          document_category?: string | null
          document_type: string
          expiry_date?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          is_current?: boolean | null
          mime_type?: string | null
          notes?: string | null
          participant_id: string
          uploaded_at?: string
          uploaded_by?: string | null
          uploaded_by_name?: string | null
        }
        Update: {
          document_category?: string | null
          document_type?: string
          expiry_date?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          is_current?: boolean | null
          mime_type?: string | null
          notes?: string | null
          participant_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
          uploaded_by_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participant_documents_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_documents_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "participant_documents_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_goals: {
        Row: {
          created_at: string
          goal_category: string | null
          goal_description: string | null
          goal_title: string
          id: string
          participant_id: string
          plan_id: string | null
          progress_notes: string | null
          status: string | null
          target_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          goal_category?: string | null
          goal_description?: string | null
          goal_title: string
          id?: string
          participant_id: string
          plan_id?: string | null
          progress_notes?: string | null
          status?: string | null
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          goal_category?: string | null
          goal_description?: string | null
          goal_title?: string
          id?: string
          participant_id?: string
          plan_id?: string | null
          progress_notes?: string | null
          status?: string | null
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_goals_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_goals_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "participant_goals_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_goals_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "ndis_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_goals_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["plan_id"]
          },
        ]
      }
      participants: {
        Row: {
          created_at: string
          created_by: string | null
          date_of_birth: string
          deleted_at: string | null
          email: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          indigenous_status: string | null
          intake_date: string | null
          interpreter_required: boolean | null
          language: string | null
          last_name: string
          middle_name: string | null
          ndis_number: string
          ndis_status: Database["public"]["Enums"]["ndis_status_type"] | null
          phone: string | null
          preferred_name: string | null
          pronouns: string | null
          school_name: string | null
          status: Database["public"]["Enums"]["participant_status_type"] | null
          updated_at: string
          updated_by: string | null
          year_level: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date_of_birth: string
          deleted_at?: string | null
          email?: string | null
          first_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          indigenous_status?: string | null
          intake_date?: string | null
          interpreter_required?: boolean | null
          language?: string | null
          last_name: string
          middle_name?: string | null
          ndis_number: string
          ndis_status?: Database["public"]["Enums"]["ndis_status_type"] | null
          phone?: string | null
          preferred_name?: string | null
          pronouns?: string | null
          school_name?: string | null
          status?: Database["public"]["Enums"]["participant_status_type"] | null
          updated_at?: string
          updated_by?: string | null
          year_level?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_of_birth?: string
          deleted_at?: string | null
          email?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          indigenous_status?: string | null
          intake_date?: string | null
          interpreter_required?: boolean | null
          language?: string | null
          last_name?: string
          middle_name?: string | null
          ndis_number?: string
          ndis_status?: Database["public"]["Enums"]["ndis_status_type"] | null
          phone?: string | null
          preferred_name?: string | null
          pronouns?: string | null
          school_name?: string | null
          status?: Database["public"]["Enums"]["participant_status_type"] | null
          updated_at?: string
          updated_by?: string | null
          year_level?: string | null
        }
        Relationships: []
      }
      risk_info: {
        Row: {
          absconding_details: string | null
          absconding_risk: boolean | null
          behaviour_risks: string | null
          behaviour_support_plan_url: string | null
          choking_protocol: string | null
          choking_risk: boolean | null
          environmental_risks: string | null
          last_updated: string
          medication_risks: string | null
          next_review_date: string | null
          participant_id: string
          risk_assessment_date: string | null
          safety_plan: string | null
          seizure_protocol: string | null
          seizure_risk: boolean | null
          updated_by: string | null
        }
        Insert: {
          absconding_details?: string | null
          absconding_risk?: boolean | null
          behaviour_risks?: string | null
          behaviour_support_plan_url?: string | null
          choking_protocol?: string | null
          choking_risk?: boolean | null
          environmental_risks?: string | null
          last_updated?: string
          medication_risks?: string | null
          next_review_date?: string | null
          participant_id: string
          risk_assessment_date?: string | null
          safety_plan?: string | null
          seizure_protocol?: string | null
          seizure_risk?: boolean | null
          updated_by?: string | null
        }
        Update: {
          absconding_details?: string | null
          absconding_risk?: boolean | null
          behaviour_risks?: string | null
          behaviour_support_plan_url?: string | null
          choking_protocol?: string | null
          choking_risk?: boolean | null
          environmental_risks?: string | null
          last_updated?: string
          medication_risks?: string | null
          next_review_date?: string | null
          participant_id?: string
          risk_assessment_date?: string | null
          safety_plan?: string | null
          seizure_protocol?: string | null
          seizure_risk?: boolean | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_info_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: true
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_info_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: true
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "risk_info_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: true
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_bookings: {
        Row: {
          amount_charged: number | null
          budget_category_id: string | null
          cancellation_date: string | null
          cancellation_reason: string | null
          created_at: string
          end_time: string | null
          hours_delivered: number | null
          id: string
          notes: string | null
          participant_id: string
          plan_id: string | null
          service_date: string
          service_location: string | null
          service_type: string
          staff_member_id: string | null
          staff_member_name: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["service_status_type"] | null
          updated_at: string
        }
        Insert: {
          amount_charged?: number | null
          budget_category_id?: string | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string
          end_time?: string | null
          hours_delivered?: number | null
          id?: string
          notes?: string | null
          participant_id: string
          plan_id?: string | null
          service_date: string
          service_location?: string | null
          service_type: string
          staff_member_id?: string | null
          staff_member_name?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["service_status_type"] | null
          updated_at?: string
        }
        Update: {
          amount_charged?: number | null
          budget_category_id?: string | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string
          end_time?: string | null
          hours_delivered?: number | null
          id?: string
          notes?: string | null
          participant_id?: string
          plan_id?: string | null
          service_date?: string
          service_location?: string | null
          service_type?: string
          staff_member_id?: string | null
          staff_member_name?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["service_status_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_budget_category_id_fkey"
            columns: ["budget_category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "service_bookings_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "ndis_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["plan_id"]
          },
        ]
      }
      service_notes: {
        Row: {
          booking_id: string | null
          created_at: string
          created_by: string | null
          created_by_name: string
          id: string
          is_sensitive: boolean | null
          note: string
          note_type: string | null
          participant_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          created_by_name: string
          id?: string
          is_sensitive?: boolean | null
          note: string
          note_type?: string | null
          participant_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          created_by_name?: string
          id?: string
          is_sensitive?: boolean | null
          note?: string
          note_type?: string | null
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_notes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "service_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_notes_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_notes_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "service_notes_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          id: number
          inserted_at: string
          is_complete: boolean | null
          task: string | null
          user_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_participants_with_plans: {
        Row: {
          first_name: string | null
          id: string | null
          last_name: string | null
          ndis_number: string | null
          ndis_status: Database["public"]["Enums"]["ndis_status_type"] | null
          plan_end: string | null
          plan_manager_type:
            | Database["public"]["Enums"]["plan_manager_type"]
            | null
          plan_number: string | null
          plan_start: string | null
          total_budget: number | null
        }
        Relationships: []
      }
      participant_budget_summary: {
        Row: {
          available_balance: number | null
          first_name: string | null
          last_name: string | null
          participant_id: string | null
          plan_id: string | null
          plan_number: string | null
          total_allocated: number | null
          total_committed: number | null
          total_spent: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      address_type: "Residential" | "Postal" | "Emergency"
      budget_category_type:
        | "Core Supports"
        | "Capacity Building"
        | "Capital Supports"
      gender_type:
        | "Male"
        | "Female"
        | "Non-binary"
        | "Other"
        | "Prefer not to say"
      ndis_status_type:
        | "Active"
        | "Pending"
        | "Expired"
        | "Suspended"
        | "Cancelled"
      participant_status_type: "Active" | "Inactive" | "On Hold" | "Discharged"
      plan_manager_type: "Self-Managed" | "Plan-Managed" | "NDIA-Managed"
      service_status_type: "Scheduled" | "Completed" | "Cancelled" | "No-show"
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
      address_type: ["Residential", "Postal", "Emergency"],
      budget_category_type: [
        "Core Supports",
        "Capacity Building",
        "Capital Supports",
      ],
      gender_type: [
        "Male",
        "Female",
        "Non-binary",
        "Other",
        "Prefer not to say",
      ],
      ndis_status_type: [
        "Active",
        "Pending",
        "Expired",
        "Suspended",
        "Cancelled",
      ],
      participant_status_type: ["Active", "Inactive", "On Hold", "Discharged"],
      plan_manager_type: ["Self-Managed", "Plan-Managed", "NDIA-Managed"],
      service_status_type: ["Scheduled", "Completed", "Cancelled", "No-show"],
    },
  },
} as const

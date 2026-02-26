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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
          participant_id?: string
          postcode?: string
          state?: string
          suburb?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
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
      booking_staff: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          booking_id: string
          created_at: string
          did_not_attend: boolean | null
          did_not_attend_reason: string | null
          employee_id: string
          id: string
          is_primary: boolean | null
          organisation_id: string
          staff_role: string | null
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          booking_id: string
          created_at?: string
          did_not_attend?: boolean | null
          did_not_attend_reason?: string | null
          employee_id: string
          id?: string
          is_primary?: boolean | null
          organisation_id: string
          staff_role?: string | null
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          booking_id?: string
          created_at?: string
          did_not_attend?: boolean | null
          did_not_attend_reason?: string | null
          employee_id?: string
          id?: string
          is_primary?: boolean | null
          organisation_id?: string
          staff_role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_staff_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "booking_staff_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_staff_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings_with_staff"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "booking_staff_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "service_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_staff_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "booking_staff_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_staff_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
          plan_id?: string
          spent_amount?: number | null
          subcategory?: string | null
          support_item_name?: string | null
          support_item_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
          participant_id?: string
          updated_at?: string
          withdrawn_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consents_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
          participant_id?: string
          phone?: string
          priority_order?: number | null
          relationship?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
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
      employee_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          address_type: string | null
          country: string | null
          created_at: string
          employee_id: string
          id: string
          is_current: boolean | null
          organisation_id: string
          postcode: string
          state: string
          suburb: string
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          address_type?: string | null
          country?: string | null
          created_at?: string
          employee_id: string
          id?: string
          is_current?: boolean | null
          organisation_id: string
          postcode: string
          state: string
          suburb: string
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          address_type?: string | null
          country?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          is_current?: boolean | null
          organisation_id?: string
          postcode?: string
          state?: string
          suburb?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_addresses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_addresses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_addresses_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_availability: {
        Row: {
          created_at: string
          day_of_week: number
          employee_id: string
          end_time: string
          id: string
          is_active: boolean | null
          organisation_id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          employee_id: string
          end_time: string
          id?: string
          is_active?: boolean | null
          organisation_id: string
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          employee_id?: string
          end_time?: string
          id?: string
          is_active?: boolean | null
          organisation_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_availability_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_availability_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_availability_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_certifications: {
        Row: {
          certification_name: string
          certification_number: string | null
          certification_type: string | null
          created_at: string
          document_id: string | null
          employee_id: string
          expiry_date: string | null
          id: string
          is_current: boolean | null
          issue_date: string
          issuing_organization: string | null
          organisation_id: string
          updated_at: string
        }
        Insert: {
          certification_name: string
          certification_number?: string | null
          certification_type?: string | null
          created_at?: string
          document_id?: string | null
          employee_id: string
          expiry_date?: string | null
          id?: string
          is_current?: boolean | null
          issue_date: string
          issuing_organization?: string | null
          organisation_id: string
          updated_at?: string
        }
        Update: {
          certification_name?: string
          certification_number?: string | null
          certification_type?: string | null
          created_at?: string
          document_id?: string | null
          employee_id?: string
          expiry_date?: string | null
          id?: string
          is_current?: boolean | null
          issue_date?: string
          issuing_organization?: string | null
          organisation_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_certifications_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "employee_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_certifications_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_documents: {
        Row: {
          document_category: string | null
          document_type: string
          employee_id: string
          expiry_date: string | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          is_current: boolean | null
          is_verified: boolean | null
          issue_date: string | null
          mime_type: string | null
          notes: string | null
          organisation_id: string
          uploaded_at: string
          uploaded_by: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_category?: string | null
          document_type: string
          employee_id: string
          expiry_date?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          is_current?: boolean | null
          is_verified?: boolean | null
          issue_date?: string | null
          mime_type?: string | null
          notes?: string | null
          organisation_id: string
          uploaded_at?: string
          uploaded_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_category?: string | null
          document_type?: string
          employee_id?: string
          expiry_date?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          is_current?: boolean | null
          is_verified?: boolean | null
          issue_date?: string | null
          mime_type?: string | null
          notes?: string | null
          organisation_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_leave: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          employee_id: string
          end_date: string
          id: string
          leave_type: string
          organisation_id: string
          reason: string | null
          start_date: string
          status: string | null
          total_days: number | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          employee_id: string
          end_date: string
          id?: string
          leave_type: string
          organisation_id: string
          reason?: string | null
          start_date: string
          status?: string | null
          total_days?: number | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: string
          organisation_id?: string
          reason?: string | null
          start_date?: string
          status?: string | null
          total_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_leave_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_leave_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_leave_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_leave_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_leave_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_notes: {
        Row: {
          created_at: string
          created_by: string
          employee_id: string
          id: string
          is_confidential: boolean | null
          note: string
          note_type: string | null
          organisation_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          employee_id: string
          id?: string
          is_confidential?: boolean | null
          note: string
          note_type?: string | null
          organisation_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          employee_id?: string
          id?: string
          is_confidential?: boolean | null
          note?: string
          note_type?: string | null
          organisation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_notes_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_notes_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_notes_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          employee_id: string
          id: string
          organisation_id: string
          role_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          employee_id: string
          id?: string
          organisation_id: string
          role_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          employee_id?: string
          id?: string
          organisation_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_roles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_roles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_roles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_bsb: string | null
          casual_loading_rate: number | null
          country: string | null
          created_at: string
          department: string | null
          email: string | null
          first_name: string | null
          hourly_rate: number | null
          id: string
          last_name: string | null
          middle_name: string | null
          organisation_id: string
          overtime_rate: number | null
          phone: string | null
          police_check_date: string | null
          police_check_expiry: string | null
          post_code: string | null
          role: string | null
          state: string | null
          status: string | null
          superannuation_fund: string | null
          superannuation_member_number: string | null
          tax_file_number_provided: boolean | null
        }
        Insert: {
          address?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_bsb?: string | null
          casual_loading_rate?: number | null
          country?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          hourly_rate?: number | null
          id?: string
          last_name?: string | null
          middle_name?: string | null
          organisation_id: string
          overtime_rate?: number | null
          phone?: string | null
          police_check_date?: string | null
          police_check_expiry?: string | null
          post_code?: string | null
          role?: string | null
          state?: string | null
          status?: string | null
          superannuation_fund?: string | null
          superannuation_member_number?: string | null
          tax_file_number_provided?: boolean | null
        }
        Update: {
          address?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_bsb?: string | null
          casual_loading_rate?: number | null
          country?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          hourly_rate?: number | null
          id?: string
          last_name?: string | null
          middle_name?: string | null
          organisation_id?: string
          overtime_rate?: number | null
          phone?: string | null
          police_check_date?: string | null
          police_check_expiry?: string | null
          post_code?: string | null
          role?: string | null
          state?: string | null
          status?: string | null
          superannuation_fund?: string | null
          superannuation_member_number?: string | null
          tax_file_number_provided?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
          participant_id?: string
          phone?: string
          relationship?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardians_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
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
            referencedRelation: "bookings_with_staff"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "incident_reports_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "service_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_reports_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
          participant_id?: string
          primary_diagnosis?: string | null
          secondary_diagnosis?: string | null
          sensory_sensitivities?: string | null
          therapy_providers?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_info_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
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
            foreignKeyName: "ndis_plans_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
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
      organisation_settings: {
        Row: {
          custom_settings: Json | null
          email_notifications: boolean | null
          enable_billing_module: boolean | null
          enable_goals_tracking: boolean | null
          enable_incident_reporting: boolean | null
          enable_rostering_module: boolean | null
          mandatory_incident_photos: boolean | null
          organisation_id: string
          require_two_staff_witnesses: boolean | null
          sms_notifications: boolean | null
          updated_at: string
        }
        Insert: {
          custom_settings?: Json | null
          email_notifications?: boolean | null
          enable_billing_module?: boolean | null
          enable_goals_tracking?: boolean | null
          enable_incident_reporting?: boolean | null
          enable_rostering_module?: boolean | null
          mandatory_incident_photos?: boolean | null
          organisation_id: string
          require_two_staff_witnesses?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string
        }
        Update: {
          custom_settings?: Json | null
          email_notifications?: boolean | null
          enable_billing_module?: boolean | null
          enable_goals_tracking?: boolean | null
          enable_incident_reporting?: boolean | null
          enable_rostering_module?: boolean | null
          mandatory_incident_photos?: boolean | null
          organisation_id?: string
          require_two_staff_witnesses?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisation_settings_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: true
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          abn: string | null
          acn: string | null
          address_line1: string | null
          address_line2: string | null
          billing_email: string | null
          country: string | null
          created_at: string
          date_format: string | null
          email: string
          id: string
          is_active: boolean | null
          max_employees: number | null
          max_participants: number | null
          max_storage_gb: number | null
          ndis_registered: boolean | null
          ndis_registration_expiry: string | null
          ndis_registration_number: string | null
          organisation_name: string
          phone: string | null
          postcode: string | null
          state: string | null
          status: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_tier: string | null
          suburb: string | null
          timezone: string | null
          trading_name: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          abn?: string | null
          acn?: string | null
          address_line1?: string | null
          address_line2?: string | null
          billing_email?: string | null
          country?: string | null
          created_at?: string
          date_format?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          max_employees?: number | null
          max_participants?: number | null
          max_storage_gb?: number | null
          ndis_registered?: boolean | null
          ndis_registration_expiry?: string | null
          ndis_registration_number?: string | null
          organisation_name: string
          phone?: string | null
          postcode?: string | null
          state?: string | null
          status?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_tier?: string | null
          suburb?: string | null
          timezone?: string | null
          trading_name?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          abn?: string | null
          acn?: string | null
          address_line1?: string | null
          address_line2?: string | null
          billing_email?: string | null
          country?: string | null
          created_at?: string
          date_format?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          max_employees?: number | null
          max_participants?: number | null
          max_storage_gb?: number | null
          ndis_registered?: boolean | null
          ndis_registration_expiry?: string | null
          ndis_registration_number?: string | null
          organisation_name?: string
          phone?: string | null
          postcode?: string | null
          state?: string | null
          status?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_tier?: string | null
          suburb?: string | null
          timezone?: string | null
          trading_name?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
          participant_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
          uploaded_by_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participant_documents_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
          participant_id?: string
          plan_id?: string | null
          progress_notes?: string | null
          status?: string | null
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_goals_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
          phone?: string | null
          preferred_name?: string | null
          pronouns?: string | null
          school_name?: string | null
          status?: Database["public"]["Enums"]["participant_status_type"] | null
          updated_at?: string
          updated_by?: string | null
          year_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
          participant_id?: string
          risk_assessment_date?: string | null
          safety_plan?: string | null
          seizure_protocol?: string | null
          seizure_risk?: boolean | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_info_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
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
      roles: {
        Row: {
          created_at: string
          id: string
          organisation_id: string | null
          role_description: string | null
          role_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          organisation_id?: string | null
          role_description?: string | null
          role_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          organisation_id?: string | null
          role_description?: string | null
          role_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_exceptions: {
        Row: {
          created_at: string
          created_by: string | null
          exception_date: string
          exception_type: string
          id: string
          is_permanent: boolean | null
          organisation_id: string
          override_end_time: string | null
          override_location: string | null
          override_staff_id: string | null
          override_start_time: string | null
          reason: string | null
          schedule_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          exception_date: string
          exception_type: string
          id?: string
          is_permanent?: boolean | null
          organisation_id: string
          override_end_time?: string | null
          override_location?: string | null
          override_staff_id?: string | null
          override_start_time?: string | null
          reason?: string | null
          schedule_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          exception_date?: string
          exception_type?: string
          id?: string
          is_permanent?: boolean | null
          organisation_id?: string
          override_end_time?: string | null
          override_location?: string | null
          override_staff_id?: string | null
          override_start_time?: string | null
          reason?: string | null
          schedule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_exceptions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "schedule_exceptions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_exceptions_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_exceptions_override_staff_id_fkey"
            columns: ["override_staff_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "schedule_exceptions_override_staff_id_fkey"
            columns: ["override_staff_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_exceptions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "active_schedules_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_exceptions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["schedule_id"]
          },
          {
            foreignKeyName: "schedule_exceptions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules_with_staff"
            referencedColumns: ["schedule_id"]
          },
          {
            foreignKeyName: "schedule_exceptions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "service_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_exceptions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "understaffed_schedules"
            referencedColumns: ["schedule_id"]
          },
        ]
      }
      schedule_modifications: {
        Row: {
          change_description: string | null
          created_at: string
          created_by: string | null
          created_by_name: string | null
          effective_date: string
          id: string
          modification_type: string
          new_end_date: string | null
          new_status: Database["public"]["Enums"]["schedule_status_type"] | null
          organisation_id: string
          previous_end_date: string | null
          previous_status:
            | Database["public"]["Enums"]["schedule_status_type"]
            | null
          reason: string | null
          schedule_id: string
        }
        Insert: {
          change_description?: string | null
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          effective_date?: string
          id?: string
          modification_type: string
          new_end_date?: string | null
          new_status?:
            | Database["public"]["Enums"]["schedule_status_type"]
            | null
          organisation_id: string
          previous_end_date?: string | null
          previous_status?:
            | Database["public"]["Enums"]["schedule_status_type"]
            | null
          reason?: string | null
          schedule_id: string
        }
        Update: {
          change_description?: string | null
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          effective_date?: string
          id?: string
          modification_type?: string
          new_end_date?: string | null
          new_status?:
            | Database["public"]["Enums"]["schedule_status_type"]
            | null
          organisation_id?: string
          previous_end_date?: string | null
          previous_status?:
            | Database["public"]["Enums"]["schedule_status_type"]
            | null
          reason?: string | null
          schedule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_modifications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "schedule_modifications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_modifications_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_modifications_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "active_schedules_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_modifications_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["schedule_id"]
          },
          {
            foreignKeyName: "schedule_modifications_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules_with_staff"
            referencedColumns: ["schedule_id"]
          },
          {
            foreignKeyName: "schedule_modifications_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "service_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_modifications_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "understaffed_schedules"
            referencedColumns: ["schedule_id"]
          },
        ]
      }
      schedule_staff: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          employee_id: string
          id: string
          is_primary: boolean | null
          organisation_id: string
          schedule_id: string
          staff_role: string | null
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          employee_id: string
          id?: string
          is_primary?: boolean | null
          organisation_id: string
          schedule_id: string
          staff_role?: string | null
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          is_primary?: boolean | null
          organisation_id?: string
          schedule_id?: string
          staff_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_staff_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "schedule_staff_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_staff_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "schedule_staff_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_staff_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_staff_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "active_schedules_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_staff_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["schedule_id"]
          },
          {
            foreignKeyName: "schedule_staff_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules_with_staff"
            referencedColumns: ["schedule_id"]
          },
          {
            foreignKeyName: "schedule_staff_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "service_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_staff_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "understaffed_schedules"
            referencedColumns: ["schedule_id"]
          },
        ]
      }
      service_bookings: {
        Row: {
          amount_charged: number | null
          booking_notes: string | null
          budget_category_id: string | null
          cancellation_date: string | null
          cancellation_reason: string | null
          created_at: string
          end_time: string | null
          generated_from_schedule: boolean | null
          hours_delivered: number | null
          id: string
          notes: string | null
          organisation_id: string
          participant_id: string
          plan_id: string | null
          schedule_id: string | null
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
          booking_notes?: string | null
          budget_category_id?: string | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string
          end_time?: string | null
          generated_from_schedule?: boolean | null
          hours_delivered?: number | null
          id?: string
          notes?: string | null
          organisation_id: string
          participant_id: string
          plan_id?: string | null
          schedule_id?: string | null
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
          booking_notes?: string | null
          budget_category_id?: string | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string
          end_time?: string | null
          generated_from_schedule?: boolean | null
          hours_delivered?: number | null
          id?: string
          notes?: string | null
          organisation_id?: string
          participant_id?: string
          plan_id?: string | null
          schedule_id?: string | null
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
            foreignKeyName: "service_bookings_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
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
          {
            foreignKeyName: "service_bookings_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "active_schedules_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["schedule_id"]
          },
          {
            foreignKeyName: "service_bookings_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules_with_staff"
            referencedColumns: ["schedule_id"]
          },
          {
            foreignKeyName: "service_bookings_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "service_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "understaffed_schedules"
            referencedColumns: ["schedule_id"]
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
          organisation_id: string
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
          organisation_id: string
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
          organisation_id?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_notes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings_with_staff"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "service_notes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "service_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_notes_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
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
      service_schedules: {
        Row: {
          auto_generate_bookings: boolean | null
          budget_category_id: string | null
          created_at: string
          created_by: string | null
          custom_interval_days: number | null
          duration_hours: number | null
          end_time: string
          flat_rate: number | null
          fortnightly_week: number | null
          generate_weeks_in_advance: number | null
          hourly_rate: number | null
          id: string
          notes: string | null
          organisation_id: string
          participant_goals: string | null
          participant_id: string
          plan_id: string | null
          recurrence_day_of_month: number | null
          recurrence_days: Database["public"]["Enums"]["day_of_week"][] | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"]
          required_staff_count: number | null
          schedule_end_date: string | null
          schedule_name: string
          schedule_start_date: string
          service_address: string | null
          service_location: string | null
          service_type: string
          special_requirements: string | null
          start_time: string
          status: Database["public"]["Enums"]["schedule_status_type"] | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          auto_generate_bookings?: boolean | null
          budget_category_id?: string | null
          created_at?: string
          created_by?: string | null
          custom_interval_days?: number | null
          duration_hours?: number | null
          end_time: string
          flat_rate?: number | null
          fortnightly_week?: number | null
          generate_weeks_in_advance?: number | null
          hourly_rate?: number | null
          id?: string
          notes?: string | null
          organisation_id: string
          participant_goals?: string | null
          participant_id: string
          plan_id?: string | null
          recurrence_day_of_month?: number | null
          recurrence_days?: Database["public"]["Enums"]["day_of_week"][] | null
          recurrence_type?: Database["public"]["Enums"]["recurrence_type"]
          required_staff_count?: number | null
          schedule_end_date?: string | null
          schedule_name: string
          schedule_start_date: string
          service_address?: string | null
          service_location?: string | null
          service_type: string
          special_requirements?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["schedule_status_type"] | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          auto_generate_bookings?: boolean | null
          budget_category_id?: string | null
          created_at?: string
          created_by?: string | null
          custom_interval_days?: number | null
          duration_hours?: number | null
          end_time?: string
          flat_rate?: number | null
          fortnightly_week?: number | null
          generate_weeks_in_advance?: number | null
          hourly_rate?: number | null
          id?: string
          notes?: string | null
          organisation_id?: string
          participant_goals?: string | null
          participant_id?: string
          plan_id?: string | null
          recurrence_day_of_month?: number | null
          recurrence_days?: Database["public"]["Enums"]["day_of_week"][] | null
          recurrence_type?: Database["public"]["Enums"]["recurrence_type"]
          required_staff_count?: number | null
          schedule_end_date?: string | null
          schedule_name?: string
          schedule_start_date?: string
          service_address?: string | null
          service_location?: string | null
          service_type?: string
          special_requirements?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["schedule_status_type"] | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_schedules_budget_category_id_fkey"
            columns: ["budget_category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "service_schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "service_schedules_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "ndis_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "service_schedules_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "service_schedules_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      timesheet_attachments: {
        Row: {
          attachment_type: string | null
          description: string | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          organisation_id: string
          timesheet_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          attachment_type?: string | null
          description?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          organisation_id: string
          timesheet_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          attachment_type?: string | null
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          organisation_id?: string
          timesheet_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timesheet_attachments_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheet_attachments_timesheet_id_fkey"
            columns: ["timesheet_id"]
            isOneToOne: false
            referencedRelation: "timesheets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheet_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "timesheet_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      timesheets: {
        Row: {
          actual_end_time: string
          actual_hours: number | null
          actual_start_time: string
          approval_notes: string | null
          approved_at: string | null
          approved_by: string | null
          billable_hours: number | null
          break_minutes: number | null
          created_at: string
          created_by: string | null
          employee_id: string
          employee_signature_url: string | null
          hourly_rate: number
          id: string
          incident_occurred: boolean | null
          mileage_amount: number | null
          mileage_rate_per_km: number | null
          organisation_id: string
          overtime_amount: number | null
          overtime_hours: number | null
          overtime_rate: number | null
          paid_at: string | null
          participant_id: string
          payment_reference: string | null
          regular_amount: number | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          scheduled_date: string
          scheduled_end_time: string
          scheduled_hours: number
          scheduled_start_time: string
          service_booking_id: string
          service_location: string | null
          service_notes: string | null
          service_type: string
          status: Database["public"]["Enums"]["timesheet_status_type"] | null
          submitted_at: string | null
          submitted_by: string | null
          supervisor_signature_url: string | null
          tasks_completed: string | null
          total_amount: number | null
          travel_distance_km: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          actual_end_time: string
          actual_hours?: number | null
          actual_start_time: string
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          billable_hours?: number | null
          break_minutes?: number | null
          created_at?: string
          created_by?: string | null
          employee_id: string
          employee_signature_url?: string | null
          hourly_rate: number
          id?: string
          incident_occurred?: boolean | null
          mileage_amount?: number | null
          mileage_rate_per_km?: number | null
          organisation_id: string
          overtime_amount?: number | null
          overtime_hours?: number | null
          overtime_rate?: number | null
          paid_at?: string | null
          participant_id: string
          payment_reference?: string | null
          regular_amount?: number | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          scheduled_date: string
          scheduled_end_time: string
          scheduled_hours: number
          scheduled_start_time: string
          service_booking_id: string
          service_location?: string | null
          service_notes?: string | null
          service_type: string
          status?: Database["public"]["Enums"]["timesheet_status_type"] | null
          submitted_at?: string | null
          submitted_by?: string | null
          supervisor_signature_url?: string | null
          tasks_completed?: string | null
          total_amount?: number | null
          travel_distance_km?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          actual_end_time?: string
          actual_hours?: number | null
          actual_start_time?: string
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          billable_hours?: number | null
          break_minutes?: number | null
          created_at?: string
          created_by?: string | null
          employee_id?: string
          employee_signature_url?: string | null
          hourly_rate?: number
          id?: string
          incident_occurred?: boolean | null
          mileage_amount?: number | null
          mileage_rate_per_km?: number | null
          organisation_id?: string
          overtime_amount?: number | null
          overtime_hours?: number | null
          overtime_rate?: number | null
          paid_at?: string | null
          participant_id?: string
          payment_reference?: string | null
          regular_amount?: number | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          scheduled_date?: string
          scheduled_end_time?: string
          scheduled_hours?: number
          scheduled_start_time?: string
          service_booking_id?: string
          service_location?: string | null
          service_notes?: string | null
          service_type?: string
          status?: Database["public"]["Enums"]["timesheet_status_type"] | null
          submitted_at?: string | null
          submitted_by?: string | null
          supervisor_signature_url?: string | null
          tasks_completed?: string | null
          total_amount?: number | null
          travel_distance_km?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timesheets_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "timesheets_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "timesheets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "timesheets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "timesheets_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "timesheets_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_service_booking_id_fkey"
            columns: ["service_booking_id"]
            isOneToOne: true
            referencedRelation: "bookings_with_staff"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "timesheets_service_booking_id_fkey"
            columns: ["service_booking_id"]
            isOneToOne: true
            referencedRelation: "service_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "timesheets_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employee_schedule_assignments"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "timesheets_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
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
      active_schedules_summary: {
        Row: {
          completed_bookings: number | null
          id: string | null
          organisation_id: string | null
          participant_id: string | null
          participant_name: string | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"] | null
          schedule_end_date: string | null
          schedule_name: string | null
          schedule_start_date: string | null
          service_type: string | null
          status: Database["public"]["Enums"]["schedule_status_type"] | null
          upcoming_bookings: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_schedules_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "service_schedules_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings_with_staff: {
        Row: {
          booking_id: string | null
          organisation_id: string | null
          participant_id: string | null
          participant_name: string | null
          service_date: string | null
          service_type: string | null
          staff_count: number | null
          staff_list: string | null
          status: Database["public"]["Enums"]["service_status_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
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
        ]
      }
      employee_schedule_assignments: {
        Row: {
          employee_id: string | null
          employee_name: string | null
          end_time: string | null
          is_primary: boolean | null
          organisation_id: string | null
          participant_name: string | null
          recurrence_days: Database["public"]["Enums"]["day_of_week"][] | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"] | null
          schedule_id: string | null
          schedule_name: string | null
          staff_role: string | null
          start_time: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
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
      schedules_with_staff: {
        Row: {
          assigned_staff_count: number | null
          organisation_id: string | null
          participant_id: string | null
          participant_name: string | null
          required_staff_count: number | null
          schedule_id: string | null
          schedule_name: string | null
          service_type: string | null
          staff_list: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_schedules_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "active_participants_with_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_schedules_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant_budget_summary"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "service_schedules_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      understaffed_schedules: {
        Row: {
          assigned_staff_count: number | null
          organisation_id: string | null
          participant_name: string | null
          required_staff_count: number | null
          schedule_id: string | null
          schedule_name: string | null
          staff_shortage: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_schedules_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      approve_timesheet: {
        Args: {
          p_approver_id: number
          p_notes?: string
          p_timesheet_id: string
        }
        Returns: undefined
      }
      auto_generate_all_schedule_bookings: {
        Args: never
        Returns: {
          bookings_created: number
          schedule_id: string
          schedule_name: string
        }[]
      }
      copy_schedule_staff_to_booking: {
        Args: { p_booking_id: string; p_schedule_id: string }
        Returns: undefined
      }
      create_timesheet_from_booking: {
        Args: {
          p_actual_end: string
          p_actual_start: string
          p_booking_id: string
          p_break_minutes?: number
          p_created_by?: string
        }
        Returns: string
      }
      extend_schedule: {
        Args: {
          p_new_end_date: string
          p_reason: string
          p_schedule_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      generate_bookings_from_schedule: {
        Args: { p_generate_until_date?: string; p_schedule_id: string }
        Returns: {
          booking_date: string
          booking_id: string
          created: boolean
        }[]
      }
      get_current_employee_id: { Args: never; Returns: string }
      get_current_organisation_id: { Args: never; Returns: string }
      has_role: { Args: { role_name_param: string }; Returns: boolean }
      is_assigned_to_participant: {
        Args: { participant_id_param: string }
        Returns: boolean
      }
      is_same_organisation: { Args: { check_org_id: string }; Returns: boolean }
      pause_schedule: {
        Args: { p_reason: string; p_schedule_id: string; p_user_id: string }
        Returns: undefined
      }
      reduce_schedule: {
        Args: {
          p_cancel_future_bookings?: boolean
          p_new_end_date: string
          p_reason: string
          p_schedule_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      reject_timesheet: {
        Args: {
          p_reason: string
          p_rejector_id: string
          p_timesheet_id: string
        }
        Returns: undefined
      }
      resume_schedule: {
        Args: { p_schedule_id: string; p_user_id: string }
        Returns: undefined
      }
      submit_timesheet: {
        Args: { p_employee_id: number; p_timesheet_id: string }
        Returns: undefined
      }
      terminate_schedule: {
        Args: {
          p_cancel_future_bookings?: boolean
          p_reason: string
          p_schedule_id: string
          p_termination_date: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      address_type: "Residential" | "Postal" | "Emergency"
      budget_category_type:
        | "Core Supports"
        | "Capacity Building"
        | "Capital Supports"
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
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
      recurrence_type:
        | "once"
        | "daily"
        | "weekly"
        | "fortnightly"
        | "monthly"
        | "custom"
      schedule_status_type: "active" | "paused" | "ended" | "draft"
      service_status_type: "Scheduled" | "Completed" | "Cancelled" | "No-show"
      timesheet_status_type:
        | "draft"
        | "submitted"
        | "approved"
        | "rejected"
        | "paid"
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
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
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
      recurrence_type: [
        "once",
        "daily",
        "weekly",
        "fortnightly",
        "monthly",
        "custom",
      ],
      schedule_status_type: ["active", "paused", "ended", "draft"],
      service_status_type: ["Scheduled", "Completed", "Cancelled", "No-show"],
      timesheet_status_type: [
        "draft",
        "submitted",
        "approved",
        "rejected",
        "paid",
      ],
    },
  },
} as const

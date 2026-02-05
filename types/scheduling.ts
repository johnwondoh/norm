// ---------------------------------------------------------------------------
// Scheduling domain types – aligned with the `service_bookings` Supabase schema
// ---------------------------------------------------------------------------

/** Worker / staff type categories available for assignment */
export type WorkerType =
  | "Support Worker"
  | "Nurse"
  | "Therapist"
  | "Care Coordinator"
  | "Allied Health"
  | "Community Care";

/**
 * Mirrors the `service_status_type` Postgres enum in the DB.
 * "Unassigned" is NOT a DB status – it is derived at the UI layer
 * whenever `staffMemberId` is null and status is "Scheduled".
 */
export type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled" | "No-show";

/** Effective status shown in the UI (includes the derived "Unassigned" state) */
export type DisplayStatus = AppointmentStatus | "Unassigned";

/** NDIS budget top-level categories – mirrors `budget_category_type` enum */
export type BudgetCategoryType = "Core Supports" | "Capacity Building" | "Capital Supports";

/** Match-quality tiers returned by the staff-matching algorithm */
export type MatchQuality = "Excellent Match" | "Good Match" | "Fair Match";

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface Participant {
  id: string;
  name: string;                  // display name – composed from first_name + last_name at the data layer
  preferredName?: string;        // preferred_name from participants table (shown when available)
  ndisNumber: string;
  supportCategory: string;
  /** avatar URL – falls back to initials circle when absent */
  avatarUrl?: string;
}

export interface Employee {
  id: string;                    // maps to service_bookings.staff_member_id (string UUID)
  name: string;                  // composed from employees.first_name + last_name
  role: string;                  // employees.role
  department?: string;           // employees.department
  email?: string;                // employees.email
  phone?: string;                // employees.phone
  workerType: WorkerType;        // inferred / mapped from role
  /** skills / certifications held (populated from a skills table or static mapping) */
  skills: string[];
  /** whether the employee is available for the slot in question */
  isAvailable: boolean;
  avatarUrl?: string;
}

/**
 * A note attached to a service booking – mirrors the `service_notes` table.
 */
export interface ServiceNote {
  id: string;
  note: string;
  noteType?: string;             // e.g. "pre-visit", "post-visit", "general"
  isSensitive: boolean;
  createdByName: string;
  createdAt: string;
}

/**
 * Lightweight NDIS plan summary surfaced on each booking –
 * derived from `ndis_plans` + `budget_categories`.
 */
export interface NdisplanSummary {
  planId: string;
  planNumber?: string;
  planManagerType: string;       // "Self-Managed" | "Plan-Managed" | "NDIA-Managed"
  totalBudget: number;
  budgetCategoryId?: string;
  budgetCategory?: BudgetCategoryType;
  allocatedAmount?: number;
  spentAmount?: number;
  committedAmount?: number;
}

export interface Appointment {
  id: string;                           // service_bookings.id
  participant: Participant;

  /** required worker category for the booking (maps to service_type) */
  workerType: WorkerType;

  /** ISO date string – the date the appointment starts on (service_bookings.service_date) */
  date: string;
  /** "HH:MM" – service_bookings.start_time */
  startTime: string;
  /** "HH:MM" – service_bookings.end_time */
  endTime: string;
  /** ISO date string – the date the appointment ends on. Omit for same-day; set when the shift crosses midnight. */
  endDate?: string;
  /** computed duration in minutes */
  durationMinutes: number;

  /** service_bookings.service_location */
  location: string;
  /** skills that the assigned worker must hold */
  requiredSkills: string[];

  // ── budget / plan link ──────────────────────────────────────────────────
  /** service_bookings.plan_id */
  planId?: string;
  /** service_bookings.budget_category_id */
  budgetCategoryId?: string;
  /** human-readable budget line (e.g. "Core Supports") */
  budgetCategory: string;

  // ── pricing / delivery ──────────────────────────────────────────────────
  /** hourly rate in AUD */
  rate: number;
  /** service_bookings.hours_delivered – filled after the session completes */
  hoursDelivered?: number;
  /** service_bookings.amount_charged – total charged in AUD */
  amountCharged?: number;

  // ── status ──────────────────────────────────────────────────────────────
  /** DB status from service_status_type enum */
  status: AppointmentStatus;

  // ── staff assignment ────────────────────────────────────────────────────
  /** service_bookings.staff_member_id – null when unassigned */
  staffMemberId?: string | null;
  /** service_bookings.staff_member_name – denormalised for display */
  staffMemberName?: string | null;
  /** full Employee object – populated when matched or fetched via join */
  assignedEmployee: Employee | null;

  // ── cancellation ────────────────────────────────────────────────────────
  /** service_bookings.cancellation_reason */
  cancellationReason?: string | null;
  /** service_bookings.cancellation_date (ISO date) */
  cancellationDate?: string | null;

  // ── notes ───────────────────────────────────────────────────────────────
  /** service_bookings.notes – quick inline note on the booking itself */
  notes?: string | null;
  /** related rows from the service_notes table */
  serviceNotes?: ServiceNote[];

  /** list of candidate employees with match scores – populated when the user clicks "Match Staff" */
  candidateEmployees?: StaffCandidate[];
}

/** Helper – returns the effective display status for a booking */
export function getDisplayStatus(appt: Appointment): DisplayStatus {
  if (appt.status === "Scheduled" && !appt.staffMemberId && !appt.assignedEmployee) {
    return "Unassigned";
  }
  return appt.status;
}

export interface StaffCandidate {
  employee: Employee;
  /** 0-100 */
  matchScore: number;
  matchQuality: MatchQuality;
  /** subset of requiredSkills that the employee holds */
  matchedSkills: string[];
  /** subset of requiredSkills that the employee does NOT hold */
  missingSkills: string[];
}

// ---------------------------------------------------------------------------
// UI / filter helpers
// ---------------------------------------------------------------------------

export interface SchedulingMetrics {
  unassignedCount: number;
  assignedCount: number;
  activeClients: number;
  /** sum of amount_charged (or rate as fallback) for non-cancelled bookings */
  totalRevenue: number;
  /** sum of hours_delivered across completed bookings */
  totalHoursDelivered: number;
  /** count of bookings with "No-show" status */
  noShowCount: number;
}

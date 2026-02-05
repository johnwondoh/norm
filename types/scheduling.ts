// ---------------------------------------------------------------------------
// Scheduling domain types
// ---------------------------------------------------------------------------

/** Worker / staff type categories available for assignment */
export type WorkerType =
  | "Support Worker"
  | "Nurse"
  | "Therapist"
  | "Care Coordinator"
  | "Allied Health"
  | "Community Care";

/** Status lifecycle for a single appointment */
export type AppointmentStatus = "Scheduled" | "Unassigned" | "Cancelled" | "Completed";

/** Match-quality tiers returned by the staff-matching algorithm */
export type MatchQuality = "Excellent Match" | "Good Match" | "Fair Match";

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface Participant {
  id: string;
  name: string;
  ndisNumber: string;
  supportCategory: string;
  /** avatar URL – falls back to initials circle when absent */
  avatarUrl?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  workerType: WorkerType;
  /** skills / certifications held */
  skills: string[];
  /** whether the employee is available for the slot in question */
  isAvailable: boolean;
  avatarUrl?: string;
}

export interface Appointment {
  id: string;
  participant: Participant;
  /** required worker category for the booking */
  workerType: WorkerType;
  /** ISO date string – the date the appointment starts on */
  date: string;
  /** "HH:MM" */
  startTime: string;
  /** "HH:MM" */
  endTime: string;
  /** ISO date string – the date the appointment ends on. Omit for same-day; set when the shift crosses midnight. */
  endDate?: string;
  /** computed duration in minutes */
  durationMinutes: number;
  /** location description */
  location: string;
  /** skills that the assigned worker must hold */
  requiredSkills: string[];
  /** NDIS budget line */
  budgetCategory: string;
  /** rate in AUD */
  rate: number;
  status: AppointmentStatus;
  /** null when unassigned */
  assignedEmployee: Employee | null;
  /** list of candidate employees with match scores – populated when the user clicks "Match Staff" */
  candidateEmployees?: StaffCandidate[];
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
  totalRevenue: number;
}

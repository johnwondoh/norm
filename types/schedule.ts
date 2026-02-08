// ---------------------------------------------------------------------------
// Schedule domain types – aligned with `service_schedules` DB schema
// ---------------------------------------------------------------------------

/** Mirrors the `recurrence_type` Postgres enum */
export type RecurrenceType =
  | "once"
  | "daily"
  | "weekly"
  | "fortnightly"
  | "monthly"
  | "custom";

/** Mirrors the `schedule_status_type` Postgres enum */
export type ScheduleStatusType = "active" | "paused" | "ended" | "draft";

/** Mirrors the `day_of_week` Postgres enum */
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// ---------------------------------------------------------------------------
// Core entity
// ---------------------------------------------------------------------------

export interface ServiceSchedule {
  id: string;
  organisationId: string;
  participantId: string;
  participantName: string; // denormalised for display
  planId?: string | null;
  budgetCategoryId?: string | null;

  // Identification
  scheduleName: string;
  serviceType: string;

  // Time
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  durationHours: number; // computed

  // Location
  serviceLocation?: string | null;
  serviceAddress?: string | null;

  // Recurrence
  recurrenceType: RecurrenceType;
  scheduleStartDate: string; // ISO date
  scheduleEndDate?: string | null;
  recurrenceDays: DayOfWeek[];
  recurrenceDayOfMonth?: number | null;
  fortnightlyWeek?: number | null;
  customIntervalDays?: number | null;

  // Pricing
  hourlyRate?: number | null;
  flatRate?: number | null;

  // Preferred staff
  preferredStaffId?: string | null;
  preferredStaffName?: string | null;
  backupStaffId?: string | null;
  backupStaffName?: string | null;

  // Auto-generation
  autoGenerateBookings: boolean;
  generateWeeksInAdvance: number;

  // Status
  status: ScheduleStatusType;

  // Additional
  notes?: string | null;
  specialRequirements?: string | null;
  participantGoals?: string | null;

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;

  // Computed/joined for display
  upcomingBookings?: number;
  completedBookings?: number;
}

// ---------------------------------------------------------------------------
// Form type for create / edit modal
// ---------------------------------------------------------------------------

export interface ScheduleForm {
  participantId: string;
  participantName: string;
  planId: string;
  budgetCategoryId: string;
  scheduleName: string;
  serviceType: string;
  startTime: string;
  endTime: string;
  serviceLocation: string;
  serviceAddress: string;
  recurrenceType: RecurrenceType;
  scheduleStartDate: string;
  scheduleEndDate: string;
  recurrenceDays: DayOfWeek[];
  recurrenceDayOfMonth: string;
  fortnightlyWeek: string;
  customIntervalDays: string;
  hourlyRate: string;
  flatRate: string;
  preferredStaffId: string;
  preferredStaffName: string;
  backupStaffId: string;
  backupStaffName: string;
  autoGenerateBookings: boolean;
  generateWeeksInAdvance: string;
  status: ScheduleStatusType;
  notes: string;
  specialRequirements: string;
  participantGoals: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const RECURRENCE_TYPE_LABELS: Record<RecurrenceType, string> = {
  once: "One-time",
  daily: "Daily",
  weekly: "Weekly",
  fortnightly: "Fortnightly",
  monthly: "Monthly",
  custom: "Custom",
};

export const SCHEDULE_STATUS_LABELS: Record<ScheduleStatusType, string> = {
  active: "Active",
  paused: "Paused",
  ended: "Ended",
  draft: "Draft",
};

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export const ALL_DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const SERVICE_TYPE_OPTIONS = [
  "Personal Care",
  "Community Access",
  "Nursing Care",
  "Therapy",
  "Domestic Assistance",
  "Social & Community Participation",
  "Assistance with Daily Life",
  "Support Coordination",
  "Respite Care",
  "Transport",
];

// ---------------------------------------------------------------------------
// Filter options (for FilterDropdown)
// ---------------------------------------------------------------------------

export const SCHEDULE_STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Draft", value: "draft" },
  { label: "Ended", value: "ended" },
];

export const RECURRENCE_FILTER_OPTIONS = [
  { label: "All Patterns", value: "all" },
  { label: "One-time", value: "once" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Fortnightly", value: "fortnightly" },
  { label: "Monthly", value: "monthly" },
  { label: "Custom", value: "custom" },
];

export const SERVICE_TYPE_FILTER_OPTIONS = [
  { label: "All Services", value: "all" },
  ...SERVICE_TYPE_OPTIONS.map((s) => ({ label: s, value: s })),
];

// ---------------------------------------------------------------------------
// Incident Reports – domain types (mirrors Supabase incident_reports table)
// ---------------------------------------------------------------------------

export type IncidentType =
  | "Injury"
  | "Behaviour"
  | "Medication Error"
  | "Safeguarding"
  | "Property Damage"
  | "Near Miss"
  | "Complaint"
  | "Other";

export type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";

export type IncidentStatus =
  | "Open"          // newly created, no action yet
  | "Under Review"  // being investigated
  | "Resolved"      // resolved_date is set
  | "Closed";       // archived / no further action

// ---------------------------------------------------------------------------
// Core entity
// ---------------------------------------------------------------------------
export interface IncidentReport {
  id: string;

  // ── who / what ──
  participantId: string;
  participantName: string;   // denormalised for display
  bookingId: string | null;

  // ── when ──
  incidentDate: string;      // "YYYY-MM-DD"
  incidentTime: string | null; // "HH:MM"

  // ── classification ──
  incidentType: IncidentType;
  severity: IncidentSeverity | null;

  // ── details ──
  description: string;
  actionTaken: string | null;
  witnesses: string | null;

  // ── notifications ──
  reportedToGuardian: boolean;
  reportedToGuardianDate: string | null; // ISO timestamp
  reportedToNdis: boolean;
  reportedToNdisDate: string | null;     // ISO timestamp

  // ── follow-up ──
  followUpRequired: boolean;
  followUpNotes: string | null;
  resolvedDate: string | null; // "YYYY-MM-DD"
  status: IncidentStatus;      // derived / explicit

  // ── audit ──
  createdBy: string | null;
  createdByName: string;
  createdAt: string;  // ISO timestamp
  updatedAt: string;  // ISO timestamp
}

// ---------------------------------------------------------------------------
// Form data (create / edit)
// ---------------------------------------------------------------------------
export interface IncidentReportForm {
  participantId: string;
  participantName: string;
  bookingId: string;
  incidentDate: string;
  incidentTime: string;
  incidentType: IncidentType;
  severity: IncidentSeverity;
  description: string;
  actionTaken: string;
  witnesses: string;
  reportedToGuardian: boolean;
  reportedToNdis: boolean;
  followUpRequired: boolean;
  followUpNotes: string;
}

// ---------------------------------------------------------------------------
// Filter helpers
// ---------------------------------------------------------------------------
export const INCIDENT_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "All Types",        value: "all" },
  { label: "Injury",          value: "Injury" },
  { label: "Behaviour",       value: "Behaviour" },
  { label: "Medication Error",value: "Medication Error" },
  { label: "Safeguarding",    value: "Safeguarding" },
  { label: "Property Damage", value: "Property Damage" },
  { label: "Near Miss",       value: "Near Miss" },
  { label: "Complaint",       value: "Complaint" },
  { label: "Other",           value: "Other" },
];

export const INCIDENT_SEVERITY_OPTIONS: { label: string; value: string }[] = [
  { label: "All Severities", value: "all" },
  { label: "Low",            value: "Low" },
  { label: "Medium",         value: "Medium" },
  { label: "High",           value: "High" },
  { label: "Critical",       value: "Critical" },
];

export const INCIDENT_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Statuses",  value: "all" },
  { label: "Open",          value: "Open" },
  { label: "Under Review",  value: "Under Review" },
  { label: "Resolved",      value: "Resolved" },
  { label: "Closed",        value: "Closed" },
];

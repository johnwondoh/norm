import { Suspense } from "react";
import ShiftManagementClient from "./ShiftManagementClient";
import type { Appointment, Employee } from "@/types/scheduling";

// ---------------------------------------------------------------------------
// Mock employees – realistic NDIS workforce mix
// ---------------------------------------------------------------------------
const employees: Employee[] = [
  {
    id: "emp-1",
    name: "Sarah Johnson",
    role: "Senior Support Worker",
    department: "Personal Care",
    email: "sarah.johnson@ndiscrm.com",
    phone: "0412 345 678",
    workerType: "Support Worker",
    skills: ["Personal Care", "NDIS Worker Screening", "Manual Handling", "Medication Assist"],
    isAvailable: true,
  },
  {
    id: "emp-2",
    name: "Emily Rodriguez",
    role: "Customer Success Lead",
    department: "Community Services",
    email: "emily.rodriguez@ndiscrm.com",
    phone: "0423 456 789",
    workerType: "Support Worker",
    skills: ["Personal Care", "NDIS Worker Screening", "Community Access"],
    isAvailable: true,
  },
  {
    id: "emp-3",
    name: "Michael Chen",
    role: "Registered Nurse",
    department: "Clinical",
    email: "michael.chen@ndiscrm.com",
    phone: "0434 567 890",
    workerType: "Nurse",
    skills: ["Nursing Care", "Medication Management", "NDIS Worker Screening", "Manual Handling", "Complex Care"],
    isAvailable: true,
  },
  {
    id: "emp-4",
    name: "Amanda Lee",
    role: "Support Worker",
    department: "Personal Care",
    email: "amanda.lee@ndiscrm.com",
    phone: "0445 678 901",
    workerType: "Support Worker",
    skills: ["Personal Care", "NDIS Worker Screening", "Manual Handling"],
    isAvailable: true,
  },
  {
    id: "emp-5",
    name: "David Park",
    role: "Speech Language Therapist",
    department: "Allied Health",
    email: "david.park@ndiscrm.com",
    phone: "0456 789 012",
    workerType: "Therapist",
    skills: ["Speech Therapy", "Communication Support", "NDIS Worker Screening", "Allied Health"],
    isAvailable: true,
  },
  {
    id: "emp-6",
    name: "Jessica Williams",
    role: "Occupational Therapist",
    department: "Allied Health",
    email: "jessica.williams@ndiscrm.com",
    phone: "0467 890 123",
    workerType: "Therapist",
    skills: ["Occupational Therapy", "Allied Health", "NDIS Worker Screening", "Manual Handling"],
    isAvailable: false,
  },
  {
    id: "emp-7",
    name: "Robert Taylor",
    role: "Care Coordinator",
    department: "Coordination",
    email: "robert.taylor@ndiscrm.com",
    phone: "0478 901 234",
    workerType: "Care Coordinator",
    skills: ["Care Planning", "NDIS Worker Screening", "Community Access", "Medication Assist"],
    isAvailable: true,
  },
  {
    id: "emp-8",
    name: "Lisa Nguyen",
    role: "Community Care Worker",
    department: "Community Services",
    email: "lisa.nguyen@ndiscrm.com",
    phone: "0489 012 345",
    workerType: "Community Care",
    skills: ["Community Access", "NDIS Worker Screening", "Assistance with Daily Life"],
    isAvailable: true,
  },
];

// ---------------------------------------------------------------------------
// Helper: get date strings for "today" and nearby days
// ---------------------------------------------------------------------------
function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

// ---------------------------------------------------------------------------
// Mock appointments – spread across this week, aligned to service_bookings
// ---------------------------------------------------------------------------
const appointments: Appointment[] = [
  // ── Today ──
  {
    id: "appt-1",
    participant: { id: "p-1", name: "Emma Thompson", preferredName: "Emma", ndisNumber: "NDIS-2024-001", supportCategory: "Core Supports" },
    workerType: "Support Worker",
    date: getDateOffset(0),
    startTime: "09:00", endTime: "10:00", durationMinutes: 60,
    location: "Client Home – North Sydney",
    requiredSkills: ["Personal Care", "NDIS Worker Screening", "Manual Handling"],
    planId: "plan-001",
    budgetCategoryId: "bc-001",
    budgetCategory: "Core Supports",
    rate: 65,
    hoursDelivered: undefined,
    amountCharged: undefined,
    status: "Scheduled",
    staffMemberId: "emp-4",
    staffMemberName: "Amanda Lee",
    assignedEmployee: employees[3], // Amanda Lee
    notes: "Assist with morning routine and breakfast preparation.",
    serviceNotes: [
      { id: "sn-1", note: "Client prefers morning routine completed by 10:30 AM.", noteType: "pre-visit", isSensitive: false, createdByName: "Robert Taylor", createdAt: new Date(Date.now() - 86400000).toISOString() },
    ],
  },
  {
    id: "appt-2",
    participant: { id: "p-2", name: "Oliver Mitchell", ndisNumber: "NDIS-2024-002", supportCategory: "Community Access" },
    workerType: "Support Worker",
    date: getDateOffset(0),
    startTime: "10:30", endTime: "12:30", durationMinutes: 120,
    location: "Local Community Center",
    requiredSkills: ["Community Access", "NDIS Worker Screening"],
    planId: "plan-002",
    budgetCategoryId: "bc-003",
    budgetCategory: "Core Supports",
    rate: 75,
    status: "Scheduled",
    staffMemberId: "emp-8",
    staffMemberName: "Lisa Nguyen",
    assignedEmployee: employees[7], // Lisa Nguyen
    notes: "Weekly community access session – arts & crafts activity.",
  },
  {
    id: "appt-3",
    participant: { id: "p-3", name: "Sophia Williams", preferredName: "Sophie", ndisNumber: "NDIS-2024-003", supportCategory: "Assistance with Daily Life" },
    workerType: "Nurse",
    date: getDateOffset(0),
    startTime: "14:00", endTime: "15:30", durationMinutes: 90,
    location: "Aged Care Facility – Manly",
    requiredSkills: ["Nursing Care", "Medication Management", "Complex Care"],
    planId: "plan-003",
    budgetCategoryId: "bc-002",
    budgetCategory: "Capacity Building",
    rate: 95,
    status: "Scheduled",
    staffMemberId: null,
    staffMemberName: null,
    assignedEmployee: null,
    notes: "Post-surgery medication review and wound check.",
    serviceNotes: [
      { id: "sn-2", note: "Allergy alert: penicillin. Verify medication list on arrival.", noteType: "pre-visit", isSensitive: true, createdByName: "Michael Chen", createdAt: new Date(Date.now() - 172800000).toISOString() },
    ],
  },
  // ── Tomorrow ──
  {
    id: "appt-4",
    participant: { id: "p-1", name: "Emma Thompson", preferredName: "Emma", ndisNumber: "NDIS-2024-001", supportCategory: "Core Supports" },
    workerType: "Support Worker",
    date: getDateOffset(1),
    startTime: "08:00", endTime: "09:30", durationMinutes: 90,
    location: "Client Home – North Sydney",
    requiredSkills: ["Personal Care", "Manual Handling"],
    planId: "plan-001",
    budgetCategoryId: "bc-001",
    budgetCategory: "Core Supports",
    rate: 65,
    status: "Scheduled",
    staffMemberId: null,
    staffMemberName: null,
    assignedEmployee: null,
  },
  {
    id: "appt-5",
    participant: { id: "p-4", name: "James Hartley", ndisNumber: "NDIS-2024-004", supportCategory: "Therapy" },
    workerType: "Therapist",
    date: getDateOffset(1),
    startTime: "11:00", endTime: "12:00", durationMinutes: 60,
    location: "Allied Health Clinic – Chatswood",
    requiredSkills: ["Speech Therapy", "Communication Support"],
    planId: "plan-004",
    budgetCategoryId: "bc-004",
    budgetCategory: "Capacity Building",
    rate: 110,
    status: "Scheduled",
    staffMemberId: "emp-5",
    staffMemberName: "David Park",
    assignedEmployee: employees[4], // David Park
    notes: "Follow-up session on AAC device training.",
  },
  // ── Day after tomorrow ──
  {
    id: "appt-6",
    participant: { id: "p-5", name: "Aisha Patel", preferredName: "Aisha", ndisNumber: "NDIS-2024-005", supportCategory: "Core Supports" },
    workerType: "Support Worker",
    date: getDateOffset(2),
    startTime: "09:00", endTime: "11:00", durationMinutes: 120,
    location: "NDIS Day Program – Parramatta",
    requiredSkills: ["Personal Care", "NDIS Worker Screening", "Assistance with Daily Life"],
    planId: "plan-005",
    budgetCategoryId: "bc-005",
    budgetCategory: "Core Supports",
    rate: 80,
    status: "Scheduled",
    staffMemberId: null,
    staffMemberName: null,
    assignedEmployee: null,
    notes: "Day program orientation – first session.",
  },
  {
    id: "appt-7",
    participant: { id: "p-2", name: "Oliver Mitchell", ndisNumber: "NDIS-2024-002", supportCategory: "Community Access" },
    workerType: "Community Care",
    date: getDateOffset(2),
    startTime: "13:00", endTime: "15:00", durationMinutes: 120,
    location: "Shopping Centre – Westfield Parramatta",
    requiredSkills: ["Community Access", "NDIS Worker Screening"],
    planId: "plan-002",
    budgetCategoryId: "bc-003",
    budgetCategory: "Core Supports",
    rate: 72,
    status: "Scheduled",
    staffMemberId: "emp-8",
    staffMemberName: "Lisa Nguyen",
    assignedEmployee: employees[7], // Lisa Nguyen
  },
  // ── +3 days ──
  {
    id: "appt-8",
    participant: { id: "p-3", name: "Sophia Williams", preferredName: "Sophie", ndisNumber: "NDIS-2024-003", supportCategory: "Nursing" },
    workerType: "Nurse",
    date: getDateOffset(3),
    startTime: "08:30", endTime: "10:00", durationMinutes: 90,
    location: "Aged Care Facility – Manly",
    requiredSkills: ["Nursing Care", "Medication Management"],
    planId: "plan-003",
    budgetCategoryId: "bc-002",
    budgetCategory: "Capacity Building",
    rate: 95,
    status: "Cancelled",
    staffMemberId: "emp-3",
    staffMemberName: "Michael Chen",
    assignedEmployee: employees[2], // Michael Chen
    cancellationReason: "Participant hospitalised – rescheduling pending.",
    cancellationDate: getDateOffset(2),
  },
  {
    id: "appt-9",
    participant: { id: "p-6", name: "Lucas Bennett", ndisNumber: "NDIS-2024-006", supportCategory: "Occupational Therapy" },
    workerType: "Therapist",
    date: getDateOffset(3),
    startTime: "14:00", endTime: "15:30", durationMinutes: 90,
    location: "OT Clinic – St Leonards",
    requiredSkills: ["Occupational Therapy", "Allied Health"],
    planId: "plan-006",
    budgetCategoryId: "bc-006",
    budgetCategory: "Capacity Building",
    rate: 120,
    status: "Scheduled",
    staffMemberId: null,
    staffMemberName: null,
    assignedEmployee: null,
    notes: "Initial OT assessment – functional independence evaluation.",
  },
  // ── overnight night shift: Tuesday 11 PM → Wednesday 7 AM ──
  {
    id: "appt-night-1",
    participant: { id: "p-7", name: "Daniel Wright", ndisNumber: "NDIS-2024-007", supportCategory: "Assistance with Daily Life" },
    workerType: "Nurse",
    date: getDateOffset(-2),          // Tuesday
    startTime: "23:00",
    endTime: "07:00",
    endDate: getDateOffset(-1),       // Wednesday
    durationMinutes: 480,
    location: "Aged Care Facility – Manly",
    requiredSkills: ["Nursing Care", "Medication Management"],
    planId: "plan-007",
    budgetCategoryId: "bc-007",
    budgetCategory: "Core Supports",
    rate: 140,
    hoursDelivered: 8,
    amountCharged: 1120,
    status: "Completed",
    staffMemberId: "emp-3",
    staffMemberName: "Michael Chen",
    assignedEmployee: employees[2],   // Michael Chen
    notes: "Overnight supervision – 2-hourly vitals check required.",
    serviceNotes: [
      { id: "sn-3", note: "Vitals stable throughout shift. No incidents.", noteType: "post-visit", isSensitive: false, createdByName: "Michael Chen", createdAt: new Date(Date.now() - 43200000).toISOString() },
    ],
  },
  // ── +4 days ──
  {
    id: "appt-10",
    participant: { id: "p-1", name: "Emma Thompson", preferredName: "Emma", ndisNumber: "NDIS-2024-001", supportCategory: "Core Supports" },
    workerType: "Care Coordinator",
    date: getDateOffset(4),
    startTime: "10:00", endTime: "11:30", durationMinutes: 90,
    location: "NDIS Planning Meeting – CBD",
    requiredSkills: ["Care Planning", "NDIS Worker Screening"],
    planId: "plan-001",
    budgetCategoryId: "bc-008",
    budgetCategory: "Support Coordination",
    rate: 88,
    status: "Scheduled",
    staffMemberId: "emp-7",
    staffMemberName: "Robert Taylor",
    assignedEmployee: employees[6], // Robert Taylor
    notes: "Annual plan review with plan manager.",
  },
  // ── past completed booking (for metrics) ──
  {
    id: "appt-11",
    participant: { id: "p-4", name: "James Hartley", ndisNumber: "NDIS-2024-004", supportCategory: "Therapy" },
    workerType: "Therapist",
    date: getDateOffset(-3),
    startTime: "10:00", endTime: "11:00", durationMinutes: 60,
    location: "Allied Health Clinic – Chatswood",
    requiredSkills: ["Speech Therapy", "Communication Support"],
    planId: "plan-004",
    budgetCategoryId: "bc-004",
    budgetCategory: "Capacity Building",
    rate: 110,
    hoursDelivered: 1,
    amountCharged: 110,
    status: "Completed",
    staffMemberId: "emp-5",
    staffMemberName: "David Park",
    assignedEmployee: employees[4],
    notes: "Session completed successfully. Progress notes updated.",
  },
  // ── past no-show ──
  {
    id: "appt-12",
    participant: { id: "p-5", name: "Aisha Patel", preferredName: "Aisha", ndisNumber: "NDIS-2024-005", supportCategory: "Core Supports" },
    workerType: "Support Worker",
    date: getDateOffset(-4),
    startTime: "09:00", endTime: "10:30", durationMinutes: 90,
    location: "Client Home – Parramatta",
    requiredSkills: ["Personal Care", "NDIS Worker Screening"],
    planId: "plan-005",
    budgetCategoryId: "bc-005",
    budgetCategory: "Core Supports",
    rate: 65,
    status: "No-show",
    staffMemberId: "emp-1",
    staffMemberName: "Sarah Johnson",
    assignedEmployee: employees[0],
    notes: "Client did not answer door. Left voicemail for guardian.",
  },
];

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
function SchedulingLoading() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0" />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-72 bg-slate-100 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
                <div className="h-8 w-16 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 h-12 animate-pulse mb-6" />
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 h-48 animate-pulse" />
              ))}
            </div>
            <div className="w-80 bg-white rounded-xl border border-slate-200 h-64 animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function ShiftManagementPage() {
  // In production this would fetch from Supabase:
  //   const supabase = await createClient();
  //   const { data: bookings } = await supabase
  //     .from("service_bookings")
  //     .select("*, participants(first_name, last_name, preferred_name, ndis_number), employees(*), service_notes(*)")
  //     .order("service_date", { ascending: true });
  //   const { data: employees } = await supabase.from("employees").select("*");

  return (
    <Suspense fallback={<SchedulingLoading />}>
      <ShiftManagementClient initialAppointments={appointments} allEmployees={employees} />
    </Suspense>
  );
}

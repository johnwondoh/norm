import { Suspense } from "react";
import SchedulingClient from "./SchedulingClient";
import type { Appointment, Employee } from "@/types/scheduling";

// ---------------------------------------------------------------------------
// Mock employees – realistic NDIS workforce mix
// ---------------------------------------------------------------------------
const employees: Employee[] = [
  {
    id: "emp-1",
    name: "Sarah Johnson",
    role: "Senior Support Worker",
    workerType: "Support Worker",
    skills: ["Personal Care", "NDIS Worker Screening", "Manual Handling", "Medication Assist"],
    isAvailable: true,
  },
  {
    id: "emp-2",
    name: "Emily Rodriguez",
    role: "Customer Success Lead",
    workerType: "Support Worker",
    skills: ["Personal Care", "NDIS Worker Screening", "Community Access"],
    isAvailable: true,
  },
  {
    id: "emp-3",
    name: "Michael Chen",
    role: "Registered Nurse",
    workerType: "Nurse",
    skills: ["Nursing Care", "Medication Management", "NDIS Worker Screening", "Manual Handling", "Complex Care"],
    isAvailable: true,
  },
  {
    id: "emp-4",
    name: "Amanda Lee",
    role: "Support Worker",
    workerType: "Support Worker",
    skills: ["Personal Care", "NDIS Worker Screening", "Manual Handling"],
    isAvailable: true,
  },
  {
    id: "emp-5",
    name: "David Park",
    role: "Speech Language Therapist",
    workerType: "Therapist",
    skills: ["Speech Therapy", "Communication Support", "NDIS Worker Screening", "Allied Health"],
    isAvailable: true,
  },
  {
    id: "emp-6",
    name: "Jessica Williams",
    role: "Occupational Therapist",
    workerType: "Therapist",
    skills: ["Occupational Therapy", "Allied Health", "NDIS Worker Screening", "Manual Handling"],
    isAvailable: false,
  },
  {
    id: "emp-7",
    name: "Robert Taylor",
    role: "Care Coordinator",
    workerType: "Care Coordinator",
    skills: ["Care Planning", "NDIS Worker Screening", "Community Access", "Medication Assist"],
    isAvailable: true,
  },
  {
    id: "emp-8",
    name: "Lisa Nguyen",
    role: "Community Care Worker",
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
// Mock appointments – spread across this week
// ---------------------------------------------------------------------------
const appointments: Appointment[] = [
  // ── Today ──
  {
    id: "appt-1",
    participant: { id: "p-1", name: "Emma Thompson", ndisNumber: "NDIS-2024-001", supportCategory: "Core Supports" },
    workerType: "Support Worker",
    date: getDateOffset(0),
    startTime: "09:00", endTime: "10:00", durationMinutes: 60,
    location: "Client Home – North Sydney",
    requiredSkills: ["Personal Care", "NDIS Worker Screening", "Manual Handling"],
    budgetCategory: "Core Supports",
    rate: 65,
    status: "Scheduled",
    assignedEmployee: employees[3], // Amanda Lee
  },
  {
    id: "appt-2",
    participant: { id: "p-2", name: "Oliver Mitchell", ndisNumber: "NDIS-2024-002", supportCategory: "Community Access" },
    workerType: "Support Worker",
    date: getDateOffset(0),
    startTime: "10:30", endTime: "12:30", durationMinutes: 120,
    location: "Local Community Center",
    requiredSkills: ["Community Access", "NDIS Worker Screening"],
    budgetCategory: "Core Supports",
    rate: 75,
    status: "Scheduled",
    assignedEmployee: employees[7], // Lisa Nguyen
  },
  {
    id: "appt-3",
    participant: { id: "p-3", name: "Sophia Williams", ndisNumber: "NDIS-2024-003", supportCategory: "Assistance with Daily Life" },
    workerType: "Nurse",
    date: getDateOffset(0),
    startTime: "14:00", endTime: "15:30", durationMinutes: 90,
    location: "Aged Care Facility – Manly",
    requiredSkills: ["Nursing Care", "Medication Management", "Complex Care"],
    budgetCategory: "Capacity Building",
    rate: 95,
    status: "Unassigned",
    assignedEmployee: null,
  },
  // ── Tomorrow ──
  {
    id: "appt-4",
    participant: { id: "p-1", name: "Emma Thompson", ndisNumber: "NDIS-2024-001", supportCategory: "Core Supports" },
    workerType: "Support Worker",
    date: getDateOffset(1),
    startTime: "08:00", endTime: "09:30", durationMinutes: 90,
    location: "Client Home – North Sydney",
    requiredSkills: ["Personal Care", "Manual Handling"],
    budgetCategory: "Core Supports",
    rate: 65,
    status: "Unassigned",
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
    budgetCategory: "Capacity Building",
    rate: 110,
    status: "Scheduled",
    assignedEmployee: employees[4], // David Park
  },
  // ── Day after tomorrow ──
  {
    id: "appt-6",
    participant: { id: "p-5", name: "Aisha Patel", ndisNumber: "NDIS-2024-005", supportCategory: "Core Supports" },
    workerType: "Support Worker",
    date: getDateOffset(2),
    startTime: "09:00", endTime: "11:00", durationMinutes: 120,
    location: "NDIS Day Program – Parramatta",
    requiredSkills: ["Personal Care", "NDIS Worker Screening", "Assistance with Daily Life"],
    budgetCategory: "Core Supports",
    rate: 80,
    status: "Unassigned",
    assignedEmployee: null,
  },
  {
    id: "appt-7",
    participant: { id: "p-2", name: "Oliver Mitchell", ndisNumber: "NDIS-2024-002", supportCategory: "Community Access" },
    workerType: "Community Care",
    date: getDateOffset(2),
    startTime: "13:00", endTime: "15:00", durationMinutes: 120,
    location: "Shopping Centre – Westfield Parramatta",
    requiredSkills: ["Community Access", "NDIS Worker Screening"],
    budgetCategory: "Core Supports",
    rate: 72,
    status: "Scheduled",
    assignedEmployee: employees[7], // Lisa Nguyen
  },
  // ── +3 days ──
  {
    id: "appt-8",
    participant: { id: "p-3", name: "Sophia Williams", ndisNumber: "NDIS-2024-003", supportCategory: "Nursing" },
    workerType: "Nurse",
    date: getDateOffset(3),
    startTime: "08:30", endTime: "10:00", durationMinutes: 90,
    location: "Aged Care Facility – Manly",
    requiredSkills: ["Nursing Care", "Medication Management"],
    budgetCategory: "Capacity Building",
    rate: 95,
    status: "Cancelled",
    assignedEmployee: employees[2], // Michael Chen
  },
  {
    id: "appt-9",
    participant: { id: "p-6", name: "Lucas Bennett", ndisNumber: "NDIS-2024-006", supportCategory: "Occupational Therapy" },
    workerType: "Therapist",
    date: getDateOffset(3),
    startTime: "14:00", endTime: "15:30", durationMinutes: 90,
    location: "OT Clinic – St Leonards",
    requiredSkills: ["Occupational Therapy", "Allied Health"],
    budgetCategory: "Capacity Building",
    rate: 120,
    status: "Unassigned",
    assignedEmployee: null,
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
    budgetCategory: "Core Supports",
    rate: 140,
    status: "Scheduled",
    assignedEmployee: employees[2],   // Michael Chen
  },
  // ── +4 days ──
  {
    id: "appt-10",
    participant: { id: "p-1", name: "Emma Thompson", ndisNumber: "NDIS-2024-001", supportCategory: "Core Supports" },
    workerType: "Care Coordinator",
    date: getDateOffset(4),
    startTime: "10:00", endTime: "11:30", durationMinutes: 90,
    location: "NDIS Planning Meeting – CBD",
    requiredSkills: ["Care Planning", "NDIS Worker Screening"],
    budgetCategory: "Support Coordination",
    rate: 88,
    status: "Scheduled",
    assignedEmployee: employees[6], // Robert Taylor
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
export default async function SchedulingPage() {
  // In production this would fetch from Supabase:
  //   const supabase = await createClient();
  //   const { data: appointments } = await supabase.from("service_bookings").select("*");
  //   const { data: employees }    = await supabase.from("employees").select("*");

  return (
    <Suspense fallback={<SchedulingLoading />}>
      <SchedulingClient initialAppointments={appointments} allEmployees={employees} />
    </Suspense>
  );
}

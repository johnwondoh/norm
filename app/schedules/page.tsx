import { Suspense } from "react";
import SchedulesClient from "./SchedulesClient";
import type { ServiceSchedule } from "@/types/schedule";

// ---------------------------------------------------------------------------
// Helper: date offset
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
// Mock schedules – realistic NDIS service schedules
// ---------------------------------------------------------------------------
const schedules: ServiceSchedule[] = [
  {
    id: "sched-1",
    organisationId: "org-1",
    participantId: "p-1",
    participantName: "Emma Thompson",
    planId: "plan-001",
    budgetCategoryId: "bc-001",
    scheduleName: "Monday Morning Personal Care",
    serviceType: "Personal Care",
    startTime: "09:00",
    endTime: "10:00",
    durationHours: 1,
    serviceLocation: "Client Home – North Sydney",
    recurrenceType: "weekly",
    scheduleStartDate: getDateOffset(-30),
    scheduleEndDate: getDateOffset(60),
    recurrenceDays: ["monday"],
    autoGenerateBookings: true,
    generateWeeksInAdvance: 4,
    status: "active",
    hourlyRate: 65,
    preferredStaffId: "emp-4",
    preferredStaffName: "Amanda Lee",
    notes: "Assist with morning routine and breakfast preparation.",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    upcomingBookings: 8,
    completedBookings: 4,
  },
  {
    id: "sched-2",
    organisationId: "org-1",
    participantId: "p-2",
    participantName: "Oliver Mitchell",
    planId: "plan-002",
    budgetCategoryId: "bc-003",
    scheduleName: "Weekly Community Access",
    serviceType: "Community Access",
    startTime: "10:30",
    endTime: "12:30",
    durationHours: 2,
    serviceLocation: "Local Community Center",
    recurrenceType: "weekly",
    scheduleStartDate: getDateOffset(-14),
    scheduleEndDate: null,
    recurrenceDays: ["wednesday", "friday"],
    autoGenerateBookings: true,
    generateWeeksInAdvance: 4,
    status: "active",
    hourlyRate: 75,
    preferredStaffId: "emp-8",
    preferredStaffName: "Lisa Nguyen",
    notes: "Arts & crafts activity and social participation.",
    participantGoals: "Improve social engagement and community participation skills.",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    upcomingBookings: 12,
    completedBookings: 4,
  },
  {
    id: "sched-3",
    organisationId: "org-1",
    participantId: "p-3",
    participantName: "Sophia Williams",
    planId: "plan-003",
    budgetCategoryId: "bc-002",
    scheduleName: "Post-Surgery Nursing Visits",
    serviceType: "Nursing Care",
    startTime: "14:00",
    endTime: "15:30",
    durationHours: 1.5,
    serviceLocation: "Aged Care Facility – Manly",
    recurrenceType: "fortnightly",
    scheduleStartDate: getDateOffset(-28),
    scheduleEndDate: getDateOffset(56),
    recurrenceDays: ["tuesday", "thursday"],
    fortnightlyWeek: 1,
    autoGenerateBookings: true,
    generateWeeksInAdvance: 6,
    status: "active",
    hourlyRate: 95,
    preferredStaffId: "emp-3",
    preferredStaffName: "Michael Chen",
    specialRequirements: "Allergy alert: penicillin. Verify medication list on arrival.",
    notes: "Post-surgery medication review and wound check.",
    createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    upcomingBookings: 6,
    completedBookings: 4,
  },
  {
    id: "sched-4",
    organisationId: "org-1",
    participantId: "p-4",
    participantName: "James Hartley",
    planId: "plan-004",
    budgetCategoryId: "bc-004",
    scheduleName: "Speech Therapy Sessions",
    serviceType: "Therapy",
    startTime: "11:00",
    endTime: "12:00",
    durationHours: 1,
    serviceLocation: "Allied Health Clinic – Chatswood",
    recurrenceType: "weekly",
    scheduleStartDate: getDateOffset(-21),
    scheduleEndDate: getDateOffset(90),
    recurrenceDays: ["thursday"],
    autoGenerateBookings: true,
    generateWeeksInAdvance: 4,
    status: "active",
    hourlyRate: 110,
    preferredStaffId: "emp-5",
    preferredStaffName: "David Park",
    participantGoals: "AAC device proficiency and communication independence.",
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    upcomingBookings: 10,
    completedBookings: 3,
  },
  {
    id: "sched-5",
    organisationId: "org-1",
    participantId: "p-5",
    participantName: "Aisha Patel",
    planId: "plan-005",
    budgetCategoryId: "bc-005",
    scheduleName: "Day Program – Parramatta",
    serviceType: "Social & Community Participation",
    startTime: "09:00",
    endTime: "11:00",
    durationHours: 2,
    serviceLocation: "NDIS Day Program – Parramatta",
    recurrenceType: "weekly",
    scheduleStartDate: getDateOffset(2),
    recurrenceDays: ["monday", "wednesday", "friday"],
    autoGenerateBookings: true,
    generateWeeksInAdvance: 4,
    status: "draft",
    hourlyRate: 80,
    notes: "Day program orientation – awaiting participant confirmation.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sched-6",
    organisationId: "org-1",
    participantId: "p-7",
    participantName: "Daniel Wright",
    planId: "plan-007",
    budgetCategoryId: "bc-007",
    scheduleName: "Overnight Nursing Supervision",
    serviceType: "Nursing Care",
    startTime: "23:00",
    endTime: "07:00",
    durationHours: 8,
    serviceLocation: "Aged Care Facility – Manly",
    recurrenceType: "weekly",
    scheduleStartDate: getDateOffset(-60),
    scheduleEndDate: getDateOffset(-7),
    recurrenceDays: ["tuesday"],
    autoGenerateBookings: false,
    generateWeeksInAdvance: 2,
    status: "ended",
    hourlyRate: 140,
    preferredStaffId: "emp-3",
    preferredStaffName: "Michael Chen",
    notes: "Overnight supervision – 2-hourly vitals check required.",
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    upcomingBookings: 0,
    completedBookings: 8,
  },
  {
    id: "sched-7",
    organisationId: "org-1",
    participantId: "p-1",
    participantName: "Emma Thompson",
    planId: "plan-001",
    budgetCategoryId: "bc-008",
    scheduleName: "Monthly Plan Review",
    serviceType: "Support Coordination",
    startTime: "10:00",
    endTime: "11:30",
    durationHours: 1.5,
    serviceLocation: "NDIS Planning Meeting – CBD",
    recurrenceType: "monthly",
    scheduleStartDate: getDateOffset(-90),
    recurrenceDays: [],
    recurrenceDayOfMonth: 15,
    autoGenerateBookings: true,
    generateWeeksInAdvance: 8,
    status: "paused",
    hourlyRate: 88,
    preferredStaffId: "emp-7",
    preferredStaffName: "Robert Taylor",
    notes: "Annual plan review with plan manager. Currently paused pending plan renewal.",
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    upcomingBookings: 0,
    completedBookings: 3,
  },
];

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
function SchedulesLoading() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0" />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-72 bg-slate-100 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
                <div className="h-8 w-16 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 h-12 animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function SchedulesPage() {
  // In production this would fetch from Supabase:
  //   const supabase = await createClient();
  //   const { data } = await supabase
  //     .from("service_schedules")
  //     .select("*, participants(first_name, last_name)")
  //     .order("created_at", { ascending: false });

  return (
    <Suspense fallback={<SchedulesLoading />}>
      <SchedulesClient initialSchedules={schedules} />
    </Suspense>
  );
}

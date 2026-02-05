import { Suspense } from "react";
import IncidentReportsClient from "./IncidentReportsClient";
import type { IncidentReport } from "@/types/incidents";

// ---------------------------------------------------------------------------
// Seed data – realistic NDIS incident examples
// ---------------------------------------------------------------------------
function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const mockReports: IncidentReport[] = [
  {
    id: "inc-1",
    participantId: "p-1",
    participantName: "Emma Thompson",
    bookingId: "appt-1",
    incidentDate: getDateOffset(-1),
    incidentTime: "14:30",
    incidentType: "Injury",
    severity: "Medium",
    description: "Participant slipped on wet floor during personal care session. Minor bruising to left knee. First aid administered on site.",
    actionTaken: "First aid kit used. Incident reported to team leader within the hour. Ice pack applied.",
    witnesses: "Sarah Johnson, Amanda Lee",
    reportedToGuardian: true,
    reportedToGuardianDate: new Date(Date.now() - 3600000).toISOString(),
    reportedToNdis: false,
    reportedToNdisDate: null,
    followUpRequired: true,
    followUpNotes: "Schedule a follow-up check on the knee injury in 48 hours. Review wet floor signage in the care facility.",
    resolvedDate: null,
    status: "Under Review",
    createdBy: "emp-1",
    createdByName: "Sarah Johnson",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "inc-2",
    participantId: "p-2",
    participantName: "Oliver Mitchell",
    bookingId: null,
    incidentDate: getDateOffset(-3),
    incidentTime: "09:15",
    incidentType: "Behaviour",
    severity: "High",
    description: "Participant became agitated during community access activity at the shopping centre. Verbal outburst directed at a bystander. De-escalation techniques applied successfully.",
    actionTaken: "Worker used de-escalation strategy. Activity was paused. Participant was escorted to a quiet area and calmed down after 15 minutes.",
    witnesses: "Lisa Nguyen",
    reportedToGuardian: true,
    reportedToGuardianDate: new Date(Date.now() - 259200000).toISOString(),
    reportedToNdis: true,
    reportedToNdisDate: new Date(Date.now() - 172800000).toISOString(),
    followUpRequired: true,
    followUpNotes: "Review behaviour management plan with care coordinator. Consider whether community access activities need additional support staff.",
    resolvedDate: null,
    status: "Open",
    createdBy: "emp-8",
    createdByName: "Lisa Nguyen",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "inc-3",
    participantId: "p-3",
    participantName: "Sophia Williams",
    bookingId: "appt-3",
    incidentDate: getDateOffset(-5),
    incidentTime: "16:00",
    incidentType: "Medication Error",
    severity: "Critical",
    description: "Registered nurse administered incorrect dosage of medication. The prescribed dose was 5mg but 10mg was administered. Error was caught by second nurse during handover check within 20 minutes.",
    actionTaken: "Incident escalated immediately to the facility manager. Doctor notified and corrective medication protocol followed. Participant monitored for 4 hours with no adverse effects.",
    witnesses: "Michael Chen, Dr. Rebecca Hayes",
    reportedToGuardian: true,
    reportedToGuardianDate: new Date(Date.now() - 432000000).toISOString(),
    reportedToNdis: true,
    reportedToNdisDate: new Date(Date.now() - 345600000).toISOString(),
    followUpRequired: true,
    followUpNotes: "Full medication error review to be completed. Double-check protocol to be enforced. Staff training on medication administration to be scheduled.",
    resolvedDate: null,
    status: "Under Review",
    createdBy: "emp-3",
    createdByName: "Michael Chen",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "inc-4",
    participantId: "p-1",
    participantName: "Emma Thompson",
    bookingId: null,
    incidentDate: getDateOffset(-8),
    incidentTime: "11:00",
    incidentType: "Property Damage",
    severity: "Low",
    description: "Participant accidentally knocked over a lamp during in-home support session. Lamp was broken beyond repair.",
    actionTaken: "Damage was noted and photographed. Replacement cost estimated. Incident logged for insurance purposes.",
    witnesses: "Amanda Lee",
    reportedToGuardian: true,
    reportedToGuardianDate: new Date(Date.now() - 691200000).toISOString(),
    reportedToNdis: false,
    reportedToNdisDate: null,
    followUpRequired: false,
    followUpNotes: null,
    resolvedDate: getDateOffset(-6),
    status: "Resolved",
    createdBy: "emp-4",
    createdByName: "Amanda Lee",
    createdAt: new Date(Date.now() - 691200000).toISOString(),
    updatedAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: "inc-5",
    participantId: "p-4",
    participantName: "James Hartley",
    bookingId: "appt-5",
    incidentDate: getDateOffset(-10),
    incidentTime: "13:45",
    incidentType: "Near Miss",
    severity: "Medium",
    description: "Participant nearly fell while transitioning from wheelchair to therapy bed. Worker caught them in time. No injury sustained.",
    actionTaken: "Worker assisted safely. Incident reported. Therapy bed positioning procedure reviewed with team.",
    witnesses: "David Park",
    reportedToGuardian: false,
    reportedToGuardianDate: null,
    reportedToNdis: false,
    reportedToNdisDate: null,
    followUpRequired: true,
    followUpNotes: "Review transfer technique training for all staff handling this participant.",
    resolvedDate: getDateOffset(-7),
    status: "Closed",
    createdBy: "emp-5",
    createdByName: "David Park",
    createdAt: new Date(Date.now() - 864000000).toISOString(),
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: "inc-6",
    participantId: "p-5",
    participantName: "Aisha Patel",
    bookingId: null,
    incidentDate: getDateOffset(-2),
    incidentTime: "10:00",
    incidentType: "Safeguarding",
    severity: "High",
    description: "Concern raised by participant's family member regarding potential neglect during overnight care. Allegations of insufficient monitoring during sleep hours.",
    actionTaken: "Immediate investigation initiated. Overnight care logs reviewed. Staff member interviewed. Care plan under urgent review.",
    witnesses: null,
    reportedToGuardian: true,
    reportedToGuardianDate: new Date(Date.now() - 172800000).toISOString(),
    reportedToNdis: true,
    reportedToNdisDate: new Date(Date.now() - 86400000).toISOString(),
    followUpRequired: true,
    followUpNotes: "Full safeguarding investigation to be completed within 5 business days. Legal team to be consulted.",
    resolvedDate: null,
    status: "Open",
    createdBy: "emp-7",
    createdByName: "Robert Taylor",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "inc-7",
    participantId: "p-6",
    participantName: "Lucas Bennett",
    bookingId: "appt-9",
    incidentDate: getDateOffset(-12),
    incidentTime: "15:30",
    incidentType: "Complaint",
    severity: "Low",
    description: "Participant's parent lodged a complaint regarding communication delays in scheduling therapy sessions. Said they were not informed of a session cancellation in time.",
    actionTaken: "Complaint acknowledged. Scheduling team notified. Communication protocol with the family reviewed.",
    witnesses: null,
    reportedToGuardian: true,
    reportedToGuardianDate: new Date(Date.now() - 1036800000).toISOString(),
    reportedToNdis: false,
    reportedToNdisDate: null,
    followUpRequired: false,
    followUpNotes: null,
    resolvedDate: getDateOffset(-9),
    status: "Closed",
    createdBy: "emp-6",
    createdByName: "Jessica Williams",
    createdAt: new Date(Date.now() - 1036800000).toISOString(),
    updatedAt: new Date(Date.now() - 777600000).toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
function IncidentReportsLoading() {
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
          <div className="bg-white rounded-xl border border-slate-200 h-14 animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 h-28 animate-pulse" />
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
export default async function IncidentReportsPage() {
  // In production:
  //   const supabase = await createClient();
  //   const { data: reports } = await supabase
  //     .from("incident_reports")
  //     .select("*, participants(name)")
  //     .order("incident_date", { ascending: false });

  return (
    <Suspense fallback={<IncidentReportsLoading />}>
      <IncidentReportsClient initialReports={mockReports} />
    </Suspense>
  );
}

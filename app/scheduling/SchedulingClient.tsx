"use client";

import { useState, useMemo, useCallback } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Users,
  DollarSign,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Sidebar, SummaryMetricCard, FilterDropdown } from "@/components/crm";
import type { FilterOption } from "@/components/crm";
import { AppointmentCard, StaffMatchPanel, ScheduleCalendar } from "@/components/scheduling";
import type { Appointment, Employee, StaffCandidate } from "@/types/scheduling";

// ---------------------------------------------------------------------------
// Filter option sets
// ---------------------------------------------------------------------------
const assignmentFilterOptions: FilterOption[] = [
  { label: "All Appointments", value: "all" },
  { label: "Assigned",         value: "assigned" },
  { label: "Unassigned",       value: "unassigned" },
];

const workerTypeOptions: FilterOption[] = [
  { label: "All Worker Types",  value: "all" },
  { label: "Support Worker",    value: "Support Worker" },
  { label: "Nurse",             value: "Nurse" },
  { label: "Therapist",         value: "Therapist" },
  { label: "Care Coordinator",  value: "Care Coordinator" },
  { label: "Allied Health",     value: "Allied Health" },
  { label: "Community Care",    value: "Community Care" },
];

const dateFilterOptions: FilterOption[] = [
  { label: "All Dates",  value: "all" },
  { label: "Today",      value: "today" },
  { label: "This Week",  value: "week" },
  { label: "Next Week",  value: "nextWeek" },
];

// ---------------------------------------------------------------------------
// Scoring helper – mirrors what a real back-end would return
// ---------------------------------------------------------------------------
function computeCandidates(appointment: Appointment, allEmployees: Employee[]): StaffCandidate[] {
  return allEmployees
    .map((emp) => {
      const matchedSkills = appointment.requiredSkills.filter((s) => emp.skills.includes(s));
      const missingSkills = appointment.requiredSkills.filter((s) => !emp.skills.includes(s));
      // base score: percentage of required skills matched
      const skillPct = appointment.requiredSkills.length > 0
        ? (matchedSkills.length / appointment.requiredSkills.length) * 100
        : 50;
      // bonus for matching worker type
      const typeBonus = emp.workerType === appointment.workerType ? 10 : 0;
      // penalty for unavailability
      const availPenalty = emp.isAvailable ? 0 : -30;
      const score = Math.min(100, Math.max(0, Math.round(skillPct + typeBonus + availPenalty)));
      const matchQuality: StaffCandidate["matchQuality"] =
        score >= 90 ? "Excellent Match" : score >= 70 ? "Good Match" : "Fair Match";
      return { employee: emp, matchScore: score, matchQuality, matchedSkills, missingSkills };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekRange(offset = 0): { start: string; end: string } {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) + offset * 7;
  const monday = new Date(d);
  monday.setDate(diff);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (dt: Date) =>
    `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  return { start: fmt(monday), end: fmt(sunday) };
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface SchedulingClientProps {
  initialAppointments: Appointment[];
  allEmployees: Employee[];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function SchedulingClient({ initialAppointments, allEmployees }: SchedulingClientProps) {
  // ── sidebar ──
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ── appointment state (mutable so assign / unassign work client-side) ──
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  // ── filters ──
  const [participantSearch, setParticipantSearch] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [workerTypeFilter, setWorkerTypeFilter] = useState("all");
  const [dateFilter, setDateFilter]             = useState("all");

  // ── employee search (for the sidebar search inside the list) ──
  const [employeeSearch, setEmployeeSearch] = useState("");

  // ── staff-match panel ──
  const [matchingAppointment, setMatchingAppointment] = useState<Appointment | null>(null);

  // ---------------------------------------------------------------------------
  // Derived / filtered data
  // ---------------------------------------------------------------------------
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      // participant name search
      if (participantSearch) {
        const q = participantSearch.toLowerCase();
        if (
          !a.participant.name.toLowerCase().includes(q) &&
          !a.participant.ndisNumber.toLowerCase().includes(q) &&
          !a.participant.supportCategory.toLowerCase().includes(q)
        )
          return false;
      }
      // assignment status
      if (assignmentFilter === "assigned"   && !a.assignedEmployee) return false;
      if (assignmentFilter === "unassigned" && a.assignedEmployee)  return false;
      // worker type
      if (workerTypeFilter !== "all" && a.workerType !== workerTypeFilter) return false;
      // date range
      if (dateFilter === "today" && a.date !== todayKey()) return false;
      if (dateFilter === "week") {
        const { start, end } = getWeekRange(0);
        if (a.date < start || a.date > end) return false;
      }
      if (dateFilter === "nextWeek") {
        const { start, end } = getWeekRange(1);
        if (a.date < start || a.date > end) return false;
      }
      return true;
    });
  }, [appointments, participantSearch, assignmentFilter, workerTypeFilter, dateFilter]);

  // Group by date for the list view
  const groupedByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    // sort appointments by date then start time
    const sorted = [...filteredAppointments].sort((a, b) =>
      a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)
    );
    for (const appt of sorted) {
      (map.get(appt.date) ?? (map.set(appt.date, []) && map.get(appt.date)!)).push(appt);
    }
    return map;
  }, [filteredAppointments]);

  // metrics
  const metrics = useMemo(() => {
    const unassigned = appointments.filter((a) => a.status === "Unassigned").length;
    const assigned   = appointments.filter((a) => a.status === "Scheduled").length;
    const clients    = new Set(appointments.map((a) => a.participant.id)).size;
    const revenue    = appointments
      .filter((a) => a.status !== "Cancelled")
      .reduce((s, a) => s + a.rate, 0);
    return { unassigned, assigned, clients, revenue };
  }, [appointments]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleCardClick = useCallback((appt: Appointment) => {
    // clicking the already-selected card closes the panel (toggle)
    if (matchingAppointment?.id === appt.id) {
      setMatchingAppointment(null);
      return;
    }
    // otherwise open / swap to the new appointment's candidates
    const withCandidates: Appointment = {
      ...appt,
      candidateEmployees: computeCandidates(appt, allEmployees),
    };
    setMatchingAppointment(withCandidates);
  }, [allEmployees, matchingAppointment?.id]);

  const handleAssign = useCallback((appointmentId: string, employeeId: string) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== appointmentId) return a;
        const emp = allEmployees.find((e) => e.id === employeeId);
        if (!emp) return a;
        return { ...a, assignedEmployee: emp, status: "Scheduled" as const };
      })
    );
    // update the panel's appointment too so the "Currently Assigned" label flips
    setMatchingAppointment((prev) => {
      if (!prev || prev.id !== appointmentId) return prev;
      const emp = allEmployees.find((e) => e.id === employeeId);
      return emp ? { ...prev, assignedEmployee: emp, status: "Scheduled" as const } : prev;
    });
  }, [allEmployees]);

  const handleUnassign = useCallback((appt: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appt.id ? { ...a, assignedEmployee: null, status: "Unassigned" as const } : a
      )
    );
    // keep the match panel in sync if the unassigned card is the one being matched
    setMatchingAppointment((prev) =>
      prev?.id === appt.id ? { ...prev, assignedEmployee: null, status: "Unassigned" as const } : prev
    );
  }, []);

  // ---------------------------------------------------------------------------
  // Format a date key into a friendly label
  // ---------------------------------------------------------------------------
  function formatDateKey(key: string): string {
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return `${days[date.getDay()]} ${d} ${months[m - 1]} ${y}`;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        currentPath="/scheduling"
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        user={{ name: "Admin User", email: "admin@ndis.com" }}
      />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">

          {/* ── Page Header ── */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Staff Assignment</h1>
              <p className="text-slate-500 mt-1">Match staff to client appointments based on skills and availability</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              New Appointment
            </button>
          </div>

          {/* ── Summary Metrics ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryMetricCard
              title="Unassigned Appointments"
              value={metrics.unassigned}
              icon={AlertCircle}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
            />
            <SummaryMetricCard
              title="Assigned Appointments"
              value={metrics.assigned}
              icon={CheckCircle2}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <SummaryMetricCard
              title="Active Clients"
              value={metrics.clients}
              icon={Users}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <SummaryMetricCard
              title="Total Revenue"
              value={`$${metrics.revenue.toFixed(2)}`}
              icon={DollarSign}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
          </div>

          {/* ── Filters bar ── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* participant search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  placeholder="Filter by participant…"
                  className="w-full pl-9 pr-4 h-11 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {participantSearch && (
                  <button type="button" onClick={() => setParticipantSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>

              {/* dropdowns */}
              <div className="flex flex-wrap gap-3">
                <FilterDropdown
                  label="All Appointments"
                  options={assignmentFilterOptions}
                  value={assignmentFilter}
                  onChange={setAssignmentFilter}
                  showIcon
                />
                <FilterDropdown
                  label="All Worker Types"
                  options={workerTypeOptions}
                  value={workerTypeFilter}
                  onChange={setWorkerTypeFilter}
                />
                <FilterDropdown
                  label="All Dates"
                  options={dateFilterOptions}
                  value={dateFilter}
                  onChange={setDateFilter}
                />
              </div>
            </div>
          </div>

          {/* ── Two-column layout: appointment list + employee quick-search ── */}
          <div className="flex gap-6 mb-8">
            {/* LEFT – appointment cards grouped by date */}
            <div className="flex-1 min-w-0">
              {groupedByDate.size === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <p className="text-slate-400 text-sm">No appointments match your filters.</p>
                </div>
              )}

              {Array.from(groupedByDate.entries()).map(([dateKey, dayAppointments]) => (
                <div key={dateKey} className="mb-6">
                  {/* day header */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-sm font-bold text-slate-800">{formatDateKey(dateKey)}</h3>
                    <span className="text-xs text-slate-500">{dayAppointments.length} appointment{dayAppointments.length !== 1 ? "s" : ""}</span>
                  </div>

                  {/* cards */}
                  <div className="space-y-4">
                    {dayAppointments.map((appt) => (
                      <AppointmentCard
                        key={appt.id}
                        appointment={appt}
                        onClick={handleCardClick}
                        onUnassign={handleUnassign}
                        isSelected={matchingAppointment?.id === appt.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT – unified sidebar: employee list ↔ staff match */}
            <aside className="w-80 flex-shrink-0">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-8" style={{ maxHeight: "calc(100vh - 64px)" }}>

                {/* ── VIEW A: Employee list (shown when no appointment is selected) ── */}
                {!matchingAppointment && (
                  <div className="flex flex-col h-full p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-1">Employees</h3>
                    <p className="text-xs text-slate-500 mb-4">Search and preview available staff</p>

                    {/* search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={employeeSearch}
                        onChange={(e) => setEmployeeSearch(e.target.value)}
                        placeholder="Search employees…"
                        className="w-full pl-9 pr-4 h-10 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* employee list (scrollable) */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {allEmployees
                        .filter((emp) => {
                          if (!employeeSearch) return true;
                          const q = employeeSearch.toLowerCase();
                          return (
                            emp.name.toLowerCase().includes(q) ||
                            emp.role.toLowerCase().includes(q) ||
                            emp.workerType.toLowerCase().includes(q) ||
                            emp.skills.some((s) => s.toLowerCase().includes(q))
                          );
                        })
                        .map((emp) => {
                          const assignedCount = appointments.filter(
                            (a) => a.assignedEmployee?.id === emp.id && a.status !== "Cancelled"
                          ).length;

                          return (
                            <div key={emp.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-indigo-600">
                                  {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{emp.name}</p>
                                <p className="text-xs text-gray-500">{emp.workerType}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs font-semibold text-slate-600">{assignedCount}</p>
                                <p className="text-xs text-slate-400">shifts</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* ── VIEW B: Staff match (shown when an appointment is selected) ── */}
                {matchingAppointment && (
                  <div className="flex flex-col" style={{ maxHeight: "calc(100vh - 64px)" }}>
                    <StaffMatchPanel
                      appointment={matchingAppointment}
                      onClose={() => setMatchingAppointment(null)}
                      onAssign={handleAssign}
                    />
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* ── Weekly Calendar ── */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Weekly Schedule</h2>
            <ScheduleCalendar
              appointments={filteredAppointments}
              onAppointmentClick={handleCardClick}
            />
          </div>
        </div>
      </main>

    </div>
  );
}

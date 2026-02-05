"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { AlertCircle, CheckCircle2, Users, DollarSign, Plus } from "lucide-react";

import {
  Sidebar,
  SummaryMetricCard,
  FilterDropdown,
  SearchBar,
  ScrollFadeIndicator,
  MatchStaffHeader,
  StaffCandidateCard,
  EmployeeCard,
} from "@/components/crm";
import type { FilterOption } from "@/components/crm";
import { AppointmentCard, ScheduleCalendar } from "@/components/scheduling";
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
// Pure helpers (no component closure needed)
// ---------------------------------------------------------------------------
function computeCandidates(appointment: Appointment, allEmployees: Employee[]): StaffCandidate[] {
  return allEmployees
    .map((emp) => {
      const matchedSkills = appointment.requiredSkills.filter((s) => emp.skills.includes(s));
      const missingSkills = appointment.requiredSkills.filter((s) => !emp.skills.includes(s));
      const skillPct = appointment.requiredSkills.length > 0
        ? (matchedSkills.length / appointment.requiredSkills.length) * 100
        : 50;
      const typeBonus    = emp.workerType === appointment.workerType ? 10 : 0;
      const availPenalty = emp.isAvailable ? 0 : -30;
      const score        = Math.min(100, Math.max(0, Math.round(skillPct + typeBonus + availPenalty)));
      const matchQuality: StaffCandidate["matchQuality"] =
        score >= 90 ? "Excellent Match" : score >= 70 ? "Good Match" : "Fair Match";
      return { employee: emp, matchScore: score, matchQuality, matchedSkills, missingSkills };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekRange(offset = 0): { start: string; end: string } {
  const d   = new Date();
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

const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatDateKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAYS[date.getDay()]} ${d} ${MONTHS[m - 1]} ${y}`;
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

  // ── appointment state ──
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  // ── filters ──
  const [participantSearch, setParticipantSearch] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [workerTypeFilter, setWorkerTypeFilter] = useState("all");
  const [dateFilter, setDateFilter]             = useState("all");

  // ── staff-match panel ──
  const [matchingAppointment, setMatchingAppointment] = useState<Appointment | null>(null);

  // ── sidebar search ──
  const [sidebarSearch, setSidebarSearch] = useState("");

  // ── scroll refs for fade indicators ──
  const scheduleScrollRef = useRef<HTMLDivElement | null>(null);
  const staffScrollRef    = useRef<HTMLDivElement | null>(null);

  // ---------------------------------------------------------------------------
  // Derived / filtered data
  // ---------------------------------------------------------------------------
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      if (participantSearch) {
        const q = participantSearch.toLowerCase();
        if (
          !a.participant.name.toLowerCase().includes(q) &&
          !a.participant.ndisNumber.toLowerCase().includes(q) &&
          !a.participant.supportCategory.toLowerCase().includes(q)
        )
          return false;
      }
      if (assignmentFilter === "assigned"   && !a.assignedEmployee) return false;
      if (assignmentFilter === "unassigned" && a.assignedEmployee)  return false;
      if (workerTypeFilter !== "all" && a.workerType !== workerTypeFilter) return false;
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

  const groupedByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    const sorted = [...filteredAppointments].sort((a, b) =>
      a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)
    );
    for (const appt of sorted) {
      (map.get(appt.date) ?? (map.set(appt.date, []) && map.get(appt.date)!)).push(appt);
    }
    return map;
  }, [filteredAppointments]);

  const metrics = useMemo(() => {
    const unassigned = appointments.filter((a) => a.status === "Unassigned").length;
    const assigned   = appointments.filter((a) => a.status === "Scheduled").length;
    const clients    = new Set(appointments.map((a) => a.participant.id)).size;
    const revenue    = appointments
      .filter((a) => a.status !== "Cancelled")
      .reduce((s, a) => s + a.rate, 0);
    return { unassigned, assigned, clients, revenue };
  }, [appointments]);

  // filtered candidate list (derived from matchingAppointment + sidebarSearch)
  const filteredCandidates = useMemo(() => {
    if (!matchingAppointment?.candidateEmployees) return [];
    const q = sidebarSearch.toLowerCase();
    if (!q) return matchingAppointment.candidateEmployees;
    return matchingAppointment.candidateEmployees.filter(
      (c) =>
        c.employee.name.toLowerCase().includes(q) ||
        c.employee.role.toLowerCase().includes(q) ||
        c.employee.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [matchingAppointment, sidebarSearch]);

  // filtered employee list (derived from allEmployees + sidebarSearch)
  const filteredEmployees = useMemo(() => {
    if (!sidebarSearch) return allEmployees;
    const q = sidebarSearch.toLowerCase();
    return allEmployees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.workerType.toLowerCase().includes(q) ||
        emp.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [allEmployees, sidebarSearch]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const dismissMatch = useCallback(() => {
    setMatchingAppointment(null);
    setSidebarSearch("");
  }, []);

  const handleCardClick = useCallback((appt: Appointment) => {
    if (matchingAppointment?.id === appt.id) {
      dismissMatch();
      return;
    }
    setMatchingAppointment({
      ...appt,
      candidateEmployees: computeCandidates(appt, allEmployees),
    });
  }, [allEmployees, matchingAppointment?.id, dismissMatch]);

  const handleAssign = useCallback((appointmentId: string, employeeId: string) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== appointmentId) return a;
        const emp = allEmployees.find((e) => e.id === employeeId);
        if (!emp) return a;
        return { ...a, assignedEmployee: emp, status: "Scheduled" as const };
      })
    );
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
    setMatchingAppointment((prev) =>
      prev?.id === appt.id ? { ...prev, assignedEmployee: null, status: "Unassigned" as const } : prev
    );
  }, []);

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
            <SummaryMetricCard title="Unassigned Appointments" value={metrics.unassigned}  icon={AlertCircle}  iconColor="text-orange-600" iconBgColor="bg-orange-100" />
            <SummaryMetricCard title="Assigned Appointments"   value={metrics.assigned}    icon={CheckCircle2} iconColor="text-green-600"  iconBgColor="bg-green-100"  />
            <SummaryMetricCard title="Active Clients"          value={metrics.clients}     icon={Users}        iconColor="text-blue-600"  iconBgColor="bg-blue-100"   />
            <SummaryMetricCard title="Total Revenue"           value={`$${metrics.revenue.toFixed(2)}`} icon={DollarSign} iconColor="text-purple-600" iconBgColor="bg-purple-100" />
          </div>

          {/* ── Filters bar ── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <SearchBar
                value={participantSearch}
                onChange={setParticipantSearch}
                placeholder="Filter by participant…"
                showClear
                onClear={() => setParticipantSearch("")}
              />
              <div className="flex flex-wrap gap-3">
                <FilterDropdown label="All Appointments" options={assignmentFilterOptions} value={assignmentFilter} onChange={setAssignmentFilter} showIcon />
                <FilterDropdown label="All Worker Types" options={workerTypeOptions}      value={workerTypeFilter} onChange={setWorkerTypeFilter} />
                <FilterDropdown label="All Dates"        options={dateFilterOptions}      value={dateFilter}       onChange={setDateFilter} />
              </div>
            </div>
          </div>

          {/* ── Two-column layout ── */}
          <div className="flex gap-6 mb-8 items-start">

            {/* LEFT – appointment cards grouped by date */}
            <div className="flex-1 min-w-0 flex flex-col" style={{ height: "calc(100vh - 260px)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">
                  Showing <span className="text-blue-600">{filteredAppointments.length}</span> appointment{filteredAppointments.length !== 1 ? "s" : ""}
                  {filteredAppointments.length !== appointments.length && (
                    <span className="text-slate-400"> of {appointments.length} total</span>
                  )}
                </span>
              </div>

              <div className="relative flex-1 min-h-0">
                <div ref={scheduleScrollRef} className="overflow-y-auto pr-1 h-full">
                  {groupedByDate.size === 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                      <p className="text-slate-400 text-sm">No appointments match your filters.</p>
                    </div>
                  )}

                  {Array.from(groupedByDate.entries()).map(([dateKey, dayAppointments]) => (
                    <div key={dateKey} className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-sm font-bold text-slate-800">{formatDateKey(dateKey)}</h3>
                        <span className="text-xs text-slate-500">{dayAppointments.length} appointment{dayAppointments.length !== 1 ? "s" : ""}</span>
                      </div>
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
                <ScrollFadeIndicator scrollRef={scheduleScrollRef} />
              </div>
            </div>

            {/* RIGHT – staff sidebar */}
            <aside className="w-80 flex-shrink-0 flex flex-col" style={{ height: "calc(100vh - 260px)" }}>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-1 min-h-0">

                <MatchStaffHeader appointment={matchingAppointment} onClose={dismissMatch} />

                {/* search */}
                <div className="flex-shrink-0 px-4 pt-3 pb-3">
                  <SearchBar
                    value={sidebarSearch}
                    onChange={setSidebarSearch}
                    placeholder={matchingAppointment ? "Search staff by name or skill…" : "Search employees…"}
                  />
                </div>

                {/* scrollable list */}
                <div className="relative flex-1 min-h-0">
                  <div ref={staffScrollRef} className="overflow-y-auto px-4 pb-4 space-y-2 pr-5 h-full">

                    {/* candidate cards – appointment selected */}
                    {matchingAppointment && (
                      filteredCandidates.length === 0
                        ? <p className="text-center text-gray-400 text-sm py-8">No matching staff found.</p>
                        : filteredCandidates.map((candidate) => (
                            <StaffCandidateCard
                              key={candidate.employee.id}
                              candidate={candidate}
                              isCurrentlyAssigned={matchingAppointment.assignedEmployee?.id === candidate.employee.id}
                              onAssign={(employeeId) => handleAssign(matchingAppointment.id, employeeId)}
                            />
                          ))
                    )}

                    {/* employee cards – no appointment selected */}
                    {!matchingAppointment && filteredEmployees.map((emp) => (
                      <EmployeeCard
                        key={emp.id}
                        employee={emp}
                        assignedShifts={appointments.filter((a) => a.assignedEmployee?.id === emp.id && a.status !== "Cancelled").length}
                      />
                    ))}
                  </div>
                  <ScrollFadeIndicator scrollRef={staffScrollRef} />
                </div>
              </div>
            </aside>
          </div>

          {/* ── Weekly Calendar ── */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Weekly Schedule</h2>
            <ScheduleCalendar appointments={filteredAppointments} onAppointmentClick={handleCardClick} />
          </div>
        </div>
      </main>
    </div>
  );
}

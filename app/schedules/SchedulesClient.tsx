"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import {
  CalendarDays,
  Plus,
  PlayCircle,
  PauseCircle,
  FileEdit,
  XCircle,
} from "lucide-react";

import {
  Sidebar,
  SummaryMetricCard,
  FilterDropdown,
  SearchBar,
  ScrollFadeIndicator,
} from "@/components/crm";
import type { FilterOption } from "@/components/crm";
import { ScheduleCard, ScheduleModal } from "@/components/schedules";
import type {
  ServiceSchedule,
  ScheduleForm,
  ScheduleStatusType,
  DayOfWeek,
} from "@/types/schedule";
import {
  SCHEDULE_STATUS_FILTER_OPTIONS,
  RECURRENCE_FILTER_OPTIONS,
  SERVICE_TYPE_FILTER_OPTIONS,
} from "@/types/schedule";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface SchedulesClientProps {
  initialSchedules: ServiceSchedule[];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function SchedulesClient({ initialSchedules }: SchedulesClientProps) {
  // ── sidebar ──
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ── data state ──
  const [schedules, setSchedules] = useState<ServiceSchedule[]>(initialSchedules);

  // ── filters ──
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [recurrenceFilter, setRecurrenceFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");

  // ── modal ──
  const [modalMode, setModalMode] = useState<null | "create" | ServiceSchedule>(null);

  // ── scroll ref ──
  const listScrollRef = useRef<HTMLDivElement | null>(null);

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------
  const filtered = useMemo(() => {
    return schedules.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !s.scheduleName.toLowerCase().includes(q) &&
          !s.participantName.toLowerCase().includes(q) &&
          !s.serviceType.toLowerCase().includes(q) &&
          !(s.serviceLocation?.toLowerCase().includes(q) ?? false) &&
          !(s.notes?.toLowerCase().includes(q) ?? false)
        )
          return false;
      }
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (recurrenceFilter !== "all" && s.recurrenceType !== recurrenceFilter) return false;
      if (serviceTypeFilter !== "all" && s.serviceType !== serviceTypeFilter) return false;
      return true;
    });
  }, [schedules, search, statusFilter, recurrenceFilter, serviceTypeFilter]);

  const metrics = useMemo(() => {
    const active = schedules.filter((s) => s.status === "active").length;
    const paused = schedules.filter((s) => s.status === "paused").length;
    const draft = schedules.filter((s) => s.status === "draft").length;
    const ended = schedules.filter((s) => s.status === "ended").length;
    return { active, paused, draft, ended };
  }, [schedules]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleStatusChange = useCallback((id: string, status: ScheduleStatusType) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s))
    );
  }, []);

  const handleSave = useCallback((form: ScheduleForm, editId: string | null) => {
    // compute duration
    const [sh, sm] = form.startTime.split(":").map(Number);
    const [eh, em] = form.endTime.split(":").map(Number);
    let duration = (eh * 60 + em - (sh * 60 + sm)) / 60;
    if (duration <= 0) duration += 24; // overnight

    if (editId) {
      setSchedules((prev) =>
        prev.map((s) => {
          if (s.id !== editId) return s;
          return {
            ...s,
            participantName: form.participantName,
            participantId: form.participantId || s.participantId,
            planId: form.planId || null,
            budgetCategoryId: form.budgetCategoryId || null,
            scheduleName: form.scheduleName,
            serviceType: form.serviceType,
            startTime: form.startTime,
            endTime: form.endTime,
            durationHours: duration,
            serviceLocation: form.serviceLocation || null,
            serviceAddress: form.serviceAddress || null,
            recurrenceType: form.recurrenceType,
            scheduleStartDate: form.scheduleStartDate,
            scheduleEndDate: form.scheduleEndDate || null,
            recurrenceDays: form.recurrenceDays,
            recurrenceDayOfMonth: form.recurrenceDayOfMonth ? parseInt(form.recurrenceDayOfMonth, 10) : null,
            fortnightlyWeek: form.fortnightlyWeek ? parseInt(form.fortnightlyWeek, 10) : null,
            customIntervalDays: form.customIntervalDays ? parseInt(form.customIntervalDays, 10) : null,
            hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : null,
            flatRate: form.flatRate ? parseFloat(form.flatRate) : null,
            preferredStaffName: form.preferredStaffName || null,
            backupStaffName: form.backupStaffName || null,
            autoGenerateBookings: form.autoGenerateBookings,
            generateWeeksInAdvance: parseInt(form.generateWeeksInAdvance, 10) || 4,
            status: form.status,
            notes: form.notes || null,
            specialRequirements: form.specialRequirements || null,
            participantGoals: form.participantGoals || null,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    } else {
      const newSchedule: ServiceSchedule = {
        id: `sched-${Date.now()}`,
        organisationId: "org-1",
        participantId: form.participantId || `p-${Date.now()}`,
        participantName: form.participantName,
        planId: form.planId || null,
        budgetCategoryId: form.budgetCategoryId || null,
        scheduleName: form.scheduleName,
        serviceType: form.serviceType,
        startTime: form.startTime,
        endTime: form.endTime,
        durationHours: duration,
        serviceLocation: form.serviceLocation || null,
        serviceAddress: form.serviceAddress || null,
        recurrenceType: form.recurrenceType,
        scheduleStartDate: form.scheduleStartDate,
        scheduleEndDate: form.scheduleEndDate || null,
        recurrenceDays: form.recurrenceDays,
        recurrenceDayOfMonth: form.recurrenceDayOfMonth ? parseInt(form.recurrenceDayOfMonth, 10) : null,
        fortnightlyWeek: form.fortnightlyWeek ? parseInt(form.fortnightlyWeek, 10) : null,
        customIntervalDays: form.customIntervalDays ? parseInt(form.customIntervalDays, 10) : null,
        hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : null,
        flatRate: form.flatRate ? parseFloat(form.flatRate) : null,
        preferredStaffName: form.preferredStaffName || null,
        backupStaffName: form.backupStaffName || null,
        autoGenerateBookings: form.autoGenerateBookings,
        generateWeeksInAdvance: parseInt(form.generateWeeksInAdvance, 10) || 4,
        status: form.status,
        notes: form.notes || null,
        specialRequirements: form.specialRequirements || null,
        participantGoals: form.participantGoals || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSchedules((prev) => [newSchedule, ...prev]);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        currentPath="/schedules"
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        user={{ name: "Admin User", email: "admin@ndis.com" }}
      />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">

          {/* ── Page Header ── */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Service Schedules</h1>
              <p className="text-slate-500 mt-1">
                Create and manage recurring service schedules for participants
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalMode("create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              New Schedule
            </button>
          </div>

          {/* ── Summary Metrics ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryMetricCard
              title="Active"
              value={metrics.active}
              icon={PlayCircle}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <SummaryMetricCard
              title="Paused"
              value={metrics.paused}
              icon={PauseCircle}
              iconColor="text-amber-600"
              iconBgColor="bg-amber-100"
            />
            <SummaryMetricCard
              title="Draft"
              value={metrics.draft}
              icon={FileEdit}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <SummaryMetricCard
              title="Ended"
              value={metrics.ended}
              icon={XCircle}
              iconColor="text-slate-500"
              iconBgColor="bg-slate-100"
            />
          </div>

          {/* ── Filters bar ── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by name, participant, service…"
                showClear
                onClear={() => setSearch("")}
              />
              <div className="flex flex-wrap gap-3">
                <FilterDropdown
                  label="All Statuses"
                  options={SCHEDULE_STATUS_FILTER_OPTIONS}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  showIcon
                />
                <FilterDropdown
                  label="All Patterns"
                  options={RECURRENCE_FILTER_OPTIONS}
                  value={recurrenceFilter}
                  onChange={setRecurrenceFilter}
                />
                <FilterDropdown
                  label="All Services"
                  options={SERVICE_TYPE_FILTER_OPTIONS}
                  value={serviceTypeFilter}
                  onChange={setServiceTypeFilter}
                />
              </div>
            </div>
          </div>

          {/* ── Results count ── */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">
              Showing <span className="text-blue-600">{filtered.length}</span> schedule
              {filtered.length !== 1 ? "s" : ""}
              {filtered.length !== schedules.length && (
                <span className="text-slate-400"> of {schedules.length} total</span>
              )}
            </span>
          </div>

          {/* ── Schedule list ── */}
          <div className="relative" style={{ height: "calc(100vh - 420px)" }}>
            <div ref={listScrollRef} className="overflow-y-auto h-full space-y-3 pr-1">
              {filtered.length === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-medium">
                    No schedules match your filters.
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Try adjusting the search or filters above.
                  </p>
                </div>
              )}

              {filtered.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onEdit={setModalMode}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
            <ScrollFadeIndicator scrollRef={listScrollRef} />
          </div>
        </div>
      </main>

      {/* ── Create / Edit Modal ── */}
      <ScheduleModal
        mode={modalMode}
        onClose={() => setModalMode(null)}
        onSave={handleSave}
      />
    </div>
  );
}

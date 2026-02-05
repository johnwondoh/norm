"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { AlertTriangle, Plus, FileText, Clock, TrendingUp } from "lucide-react";

import { Sidebar, SummaryMetricCard, FilterDropdown, SearchBar, ScrollFadeIndicator } from "@/components/crm";
import type { FilterOption } from "@/components/crm";
import { IncidentCard, IncidentModal } from "@/components/incidents";
import type { IncidentReport, IncidentReportForm, IncidentStatus } from "@/types/incidents";
import { INCIDENT_TYPE_OPTIONS, INCIDENT_SEVERITY_OPTIONS, INCIDENT_STATUS_OPTIONS } from "@/types/incidents";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface IncidentReportsClientProps {
  initialReports: IncidentReport[];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function IncidentReportsClient({ initialReports }: IncidentReportsClientProps) {
  // ── sidebar ──
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ── reports state ──
  const [reports, setReports] = useState<IncidentReport[]>(initialReports);

  // ── filters ──
  const [search, setSearch]               = useState("");
  const [typeFilter, setTypeFilter]       = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter]   = useState("all");

  // ── modal ──
  const [modalMode, setModalMode] = useState<null | "create" | IncidentReport>(null);

  // ── scroll ref ──
  const listScrollRef = useRef<HTMLDivElement | null>(null);

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------
  const filtered = useMemo(() => {
    return reports.filter((r) => {
      // text search: participant name, type, description
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.participantName.toLowerCase().includes(q) &&
          !r.incidentType.toLowerCase().includes(q) &&
          !r.description.toLowerCase().includes(q) &&
          !(r.severity?.toLowerCase().includes(q) ?? false)
        )
          return false;
      }
      if (typeFilter     !== "all" && r.incidentType !== typeFilter)     return false;
      if (severityFilter !== "all" && r.severity     !== severityFilter) return false;
      if (statusFilter   !== "all" && r.status       !== statusFilter)   return false;
      return true;
    });
  }, [reports, search, typeFilter, severityFilter, statusFilter]);

  const metrics = useMemo(() => {
    const open       = reports.filter((r) => r.status === "Open").length;
    const review     = reports.filter((r) => r.status === "Under Review").length;
    const followUp   = reports.filter((r) => r.followUpRequired && r.status !== "Closed" && r.status !== "Resolved").length;
    const critical   = reports.filter((r) => r.severity === "Critical" && r.status !== "Closed" && r.status !== "Resolved").length;
    return { open, review, followUp, critical };
  }, [reports]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleStatusChange = useCallback((id: string, status: IncidentStatus) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          status,
          resolvedDate: status === "Resolved" ? new Date().toISOString().slice(0, 10) : r.resolvedDate,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const handleSave = useCallback((form: IncidentReportForm, editId: string | null) => {
    if (editId) {
      // edit
      setReports((prev) =>
        prev.map((r) => {
          if (r.id !== editId) return r;
          return {
            ...r,
            participantId:      form.participantId || r.participantId,
            participantName:    form.participantName,
            bookingId:          form.bookingId || null,
            incidentDate:       form.incidentDate,
            incidentTime:       form.incidentTime || null,
            incidentType:       form.incidentType,
            severity:           form.severity,
            description:        form.description,
            actionTaken:        form.actionTaken || null,
            witnesses:          form.witnesses || null,
            reportedToGuardian: form.reportedToGuardian,
            reportedToNdis:     form.reportedToNdis,
            followUpRequired:   form.followUpRequired,
            followUpNotes:      form.followUpNotes || null,
            updatedAt:          new Date().toISOString(),
          };
        })
      );
    } else {
      // create
      const newReport: IncidentReport = {
        id: `inc-${Date.now()}`,
        participantId:      form.participantId || "",
        participantName:    form.participantName,
        bookingId:          form.bookingId || null,
        incidentDate:       form.incidentDate,
        incidentTime:       form.incidentTime || null,
        incidentType:       form.incidentType,
        severity:           form.severity,
        description:        form.description,
        actionTaken:        form.actionTaken || null,
        witnesses:          form.witnesses || null,
        reportedToGuardian: form.reportedToGuardian,
        reportedToGuardianDate: form.reportedToGuardian ? new Date().toISOString() : null,
        reportedToNdis:     form.reportedToNdis,
        reportedToNdisDate: form.reportedToNdis ? new Date().toISOString() : null,
        followUpRequired:   form.followUpRequired,
        followUpNotes:      form.followUpNotes || null,
        resolvedDate:       null,
        status:             "Open",
        createdBy:          null,
        createdByName:      "Admin User",
        createdAt:          new Date().toISOString(),
        updatedAt:          new Date().toISOString(),
      };
      setReports((prev) => [newReport, ...prev]);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        currentPath="/incident-reports"
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        user={{ name: "Admin User", email: "admin@ndis.com" }}
      />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">

          {/* ── Page Header ── */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Incident Reports</h1>
              <p className="text-slate-500 mt-1">Track, manage, and follow up on all reported incidents</p>
            </div>
            <button
              type="button"
              onClick={() => setModalMode("create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              New Report
            </button>
          </div>

          {/* ── Summary Metrics ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryMetricCard title="Open Reports"         value={metrics.open}     icon={FileText}      iconColor="text-blue-600"   iconBgColor="bg-blue-100"   />
            <SummaryMetricCard title="Under Review"         value={metrics.review}   icon={Clock}         iconColor="text-purple-600" iconBgColor="bg-purple-100" />
            <SummaryMetricCard title="Follow-up Required"   value={metrics.followUp} icon={TrendingUp}    iconColor="text-amber-600"  iconBgColor="bg-amber-100"  />
            <SummaryMetricCard title="Critical (Active)"    value={metrics.critical} icon={AlertTriangle} iconColor="text-red-600"    iconBgColor="bg-red-100"    />
          </div>

          {/* ── Filters bar ── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by participant, type, or description…"
                showClear
                onClear={() => setSearch("")}
              />
              <div className="flex flex-wrap gap-3">
                <FilterDropdown label="All Types"      options={INCIDENT_TYPE_OPTIONS}     value={typeFilter}     onChange={setTypeFilter} />
                <FilterDropdown label="All Severities" options={INCIDENT_SEVERITY_OPTIONS} value={severityFilter} onChange={setSeverityFilter} />
                <FilterDropdown label="All Statuses"   options={INCIDENT_STATUS_OPTIONS}   value={statusFilter}   onChange={setStatusFilter} />
              </div>
            </div>
          </div>

          {/* ── Results count ── */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">
              Showing <span className="text-blue-600">{filtered.length}</span> report{filtered.length !== 1 ? "s" : ""}
              {filtered.length !== reports.length && (
                <span className="text-slate-400"> of {reports.length} total</span>
              )}
            </span>
          </div>

          {/* ── Scrollable report list ── */}
          <div className="relative" style={{ height: "calc(100vh - 420px)" }}>
            <div ref={listScrollRef} className="overflow-y-auto h-full space-y-3 pr-1">
              {filtered.length === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-medium">No incident reports match your filters.</p>
                  <p className="text-slate-400 text-xs mt-1">Try adjusting the search or filters above.</p>
                </div>
              )}

              {filtered.map((report) => (
                <IncidentCard
                  key={report.id}
                  report={report}
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
      <IncidentModal
        mode={modalMode}
        onClose={() => setModalMode(null)}
        onSave={handleSave}
      />
    </div>
  );
}

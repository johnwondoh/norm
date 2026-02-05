"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { IncidentReport, IncidentReportForm, IncidentType, IncidentSeverity } from "@/types/incidents";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface IncidentModalProps {
  /** null = closed; "create" = blank form; IncidentReport = edit mode */
  mode: null | "create" | IncidentReport;
  onClose: () => void;
  onSave: (form: IncidentReportForm, editId: string | null) => void;
}

// ---------------------------------------------------------------------------
// Dropdown options
// ---------------------------------------------------------------------------
const TYPES: IncidentType[] = ["Injury", "Behaviour", "Medication Error", "Safeguarding", "Property Damage", "Near Miss", "Complaint", "Other"];
const SEVERITIES: IncidentSeverity[] = ["Low", "Medium", "High", "Critical"];

// ---------------------------------------------------------------------------
// Default empty form
// ---------------------------------------------------------------------------
const EMPTY_FORM: IncidentReportForm = {
  participantId:    "",
  participantName:  "",
  bookingId:        "",
  incidentDate:     new Date().toISOString().slice(0, 10),
  incidentTime:     "",
  incidentType:     "Injury",
  severity:         "Medium",
  description:      "",
  actionTaken:      "",
  witnesses:        "",
  reportedToGuardian: false,
  reportedToNdis:     false,
  followUpRequired:   false,
  followUpNotes:      "",
};

// ---------------------------------------------------------------------------
// Helper – map an existing report into the form shape
// ---------------------------------------------------------------------------
function reportToForm(r: IncidentReport): IncidentReportForm {
  return {
    participantId:      r.participantId,
    participantName:    r.participantName,
    bookingId:          r.bookingId ?? "",
    incidentDate:       r.incidentDate,
    incidentTime:       r.incidentTime ?? "",
    incidentType:       r.incidentType,
    severity:           r.severity ?? "Medium",
    description:        r.description,
    actionTaken:        r.actionTaken ?? "",
    witnesses:          r.witnesses ?? "",
    reportedToGuardian: r.reportedToGuardian,
    reportedToNdis:     r.reportedToNdis,
    followUpRequired:   r.followUpRequired,
    followUpNotes:      r.followUpNotes ?? "",
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function IncidentModal({ mode, onClose, onSave }: IncidentModalProps) {
  const isOpen    = mode !== null;
  const isEditing = mode !== null && mode !== "create";
  const editId    = isEditing ? (mode as IncidentReport).id : null;

  const [form, setForm] = useState<IncidentReportForm>(EMPTY_FORM);

  // sync form when modal opens / switches target
  useEffect(() => {
    if (!isOpen)      { setForm(EMPTY_FORM); return; }
    if (isEditing)    { setForm(reportToForm(mode as IncidentReport)); return; }
    setForm(EMPTY_FORM);
  }, [mode, isOpen, isEditing]);

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // helpers
  // ---------------------------------------------------------------------------
  const set = <K extends keyof IncidentReportForm>(key: K, val: IncidentReportForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim() || !form.participantName.trim() || !form.incidentDate) return;
    onSave(form, editId);
    onClose();
  };

  // ---------------------------------------------------------------------------
  // render helpers
  // ---------------------------------------------------------------------------
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";
  const inputClass = "w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const textareaClass = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none";

  return (
    /* backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">{isEditing ? "Edit Incident Report" : "New Incident Report"}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{isEditing ? "Update the details below" : "Fill in the details to file a new report"}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* form body – scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-4">

            {/* participant */}
            <div>
              <label className={labelClass}>Participant Name *</label>
              <input
                type="text"
                required
                value={form.participantName}
                onChange={(e) => set("participantName", e.target.value)}
                placeholder="e.g. Emma Thompson"
                className={inputClass}
              />
            </div>

            {/* date + time row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Incident Date *</label>
                <input type="date" required value={form.incidentDate} onChange={(e) => set("incidentDate", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Incident Time</label>
                <input type="time" value={form.incidentTime} onChange={(e) => set("incidentTime", e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* type + severity row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Incident Type *</label>
                <select value={form.incidentType} onChange={(e) => set("incidentType", e.target.value as IncidentType)} className={inputClass}>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Severity</label>
                <select value={form.severity} onChange={(e) => set("severity", e.target.value as IncidentSeverity)} className={inputClass}>
                  {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* description */}
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the incident in detail…"
                className={textareaClass}
              />
            </div>

            {/* action taken */}
            <div>
              <label className={labelClass}>Action Taken</label>
              <textarea
                rows={2}
                value={form.actionTaken}
                onChange={(e) => set("actionTaken", e.target.value)}
                placeholder="What was done immediately after the incident…"
                className={textareaClass}
              />
            </div>

            {/* witnesses */}
            <div>
              <label className={labelClass}>Witnesses</label>
              <input
                type="text"
                value={form.witnesses}
                onChange={(e) => set("witnesses", e.target.value)}
                placeholder="Names of witnesses, comma-separated"
                className={inputClass}
              />
            </div>

            {/* notifications + follow-up checkboxes */}
            <div className="space-y-2 pt-1">
              <p className={labelClass}>Notifications & Follow-up</p>
              <div className="flex flex-col gap-2">
                {([
                  { key: "reportedToGuardian" as const, label: "Reported to Guardian" },
                  { key: "reportedToNdis"      as const, label: "Reported to NDIS" },
                  { key: "followUpRequired"    as const, label: "Follow-up Required" },
                ] as const).map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => set(key, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* follow-up notes – only when follow-up is ticked */}
            {form.followUpRequired && (
              <div>
                <label className={labelClass}>Follow-up Notes</label>
                <textarea
                  rows={2}
                  value={form.followUpNotes}
                  onChange={(e) => set("followUpNotes", e.target.value)}
                  placeholder="Details of required follow-up…"
                  className={textareaClass}
                />
              </div>
            )}
          </div>

          {/* footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 mt-auto">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/25">
              {isEditing ? "Save Changes" : "File Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

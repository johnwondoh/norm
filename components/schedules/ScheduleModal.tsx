"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type {
  ServiceSchedule,
  ScheduleForm,
  RecurrenceType,
  ScheduleStatusType,
  DayOfWeek,
} from "@/types/schedule";
import {
  ALL_DAYS,
  DAY_OF_WEEK_LABELS,
  SERVICE_TYPE_OPTIONS,
} from "@/types/schedule";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface ScheduleModalProps {
  /** null = closed; "create" = blank form; ServiceSchedule = edit mode */
  mode: null | "create" | ServiceSchedule;
  onClose: () => void;
  onSave: (form: ScheduleForm, editId: string | null) => void;
}

// ---------------------------------------------------------------------------
// Default empty form
// ---------------------------------------------------------------------------
const EMPTY_FORM: ScheduleForm = {
  participantId: "",
  participantName: "",
  planId: "",
  budgetCategoryId: "",
  scheduleName: "",
  serviceType: "Personal Care",
  startTime: "09:00",
  endTime: "10:00",
  serviceLocation: "",
  serviceAddress: "",
  recurrenceType: "weekly",
  scheduleStartDate: new Date().toISOString().slice(0, 10),
  scheduleEndDate: "",
  recurrenceDays: [],
  recurrenceDayOfMonth: "",
  fortnightlyWeek: "1",
  customIntervalDays: "",
  hourlyRate: "",
  flatRate: "",
  preferredStaffId: "",
  preferredStaffName: "",
  backupStaffId: "",
  backupStaffName: "",
  autoGenerateBookings: true,
  generateWeeksInAdvance: "4",
  status: "draft",
  notes: "",
  specialRequirements: "",
  participantGoals: "",
};

// ---------------------------------------------------------------------------
// Helper – map existing schedule to form
// ---------------------------------------------------------------------------
function scheduleToForm(s: ServiceSchedule): ScheduleForm {
  return {
    participantId: s.participantId,
    participantName: s.participantName,
    planId: s.planId ?? "",
    budgetCategoryId: s.budgetCategoryId ?? "",
    scheduleName: s.scheduleName,
    serviceType: s.serviceType,
    startTime: s.startTime,
    endTime: s.endTime,
    serviceLocation: s.serviceLocation ?? "",
    serviceAddress: s.serviceAddress ?? "",
    recurrenceType: s.recurrenceType,
    scheduleStartDate: s.scheduleStartDate,
    scheduleEndDate: s.scheduleEndDate ?? "",
    recurrenceDays: s.recurrenceDays,
    recurrenceDayOfMonth: s.recurrenceDayOfMonth?.toString() ?? "",
    fortnightlyWeek: s.fortnightlyWeek?.toString() ?? "1",
    customIntervalDays: s.customIntervalDays?.toString() ?? "",
    hourlyRate: s.hourlyRate?.toString() ?? "",
    flatRate: s.flatRate?.toString() ?? "",
    preferredStaffId: s.preferredStaffId ?? "",
    preferredStaffName: s.preferredStaffName ?? "",
    backupStaffId: s.backupStaffId ?? "",
    backupStaffName: s.backupStaffName ?? "",
    autoGenerateBookings: s.autoGenerateBookings,
    generateWeeksInAdvance: s.generateWeeksInAdvance.toString(),
    status: s.status,
    notes: s.notes ?? "",
    specialRequirements: s.specialRequirements ?? "",
    participantGoals: s.participantGoals ?? "",
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ScheduleModal({ mode, onClose, onSave }: ScheduleModalProps) {
  const isOpen = mode !== null;
  const isEditing = mode !== null && mode !== "create";
  const editId = isEditing ? (mode as ServiceSchedule).id : null;

  const [form, setForm] = useState<ScheduleForm>(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) { setForm(EMPTY_FORM); return; }
    if (isEditing) { setForm(scheduleToForm(mode as ServiceSchedule)); return; }
    setForm(EMPTY_FORM);
  }, [mode, isOpen, isEditing]);

  if (!isOpen) return null;

  const set = <K extends keyof ScheduleForm>(key: K, val: ScheduleForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const toggleDay = (day: DayOfWeek) => {
    setForm((prev) => ({
      ...prev,
      recurrenceDays: prev.recurrenceDays.includes(day)
        ? prev.recurrenceDays.filter((d) => d !== day)
        : [...prev.recurrenceDays, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.scheduleName.trim() || !form.participantName.trim() || !form.scheduleStartDate) return;
    onSave(form, editId);
    onClose();
  };

  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";
  const inputClass = "w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const textareaClass = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none";

  const showDayPicker = form.recurrenceType === "weekly" || form.recurrenceType === "fortnightly";
  const showMonthDay = form.recurrenceType === "monthly";
  const showCustomInterval = form.recurrenceType === "custom";
  const showFortnightlyWeek = form.recurrenceType === "fortnightly";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {isEditing ? "Edit Schedule" : "New Schedule"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditing ? "Update the schedule details below" : "Create a recurring service schedule for a participant"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* form body – scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-4">

            {/* Schedule name */}
            <div>
              <label className={labelClass}>Schedule Name *</label>
              <input
                type="text"
                required
                value={form.scheduleName}
                onChange={(e) => set("scheduleName", e.target.value)}
                placeholder="e.g. Monday Morning Personal Care"
                className={inputClass}
              />
            </div>

            {/* Participant + service type */}
            <div className="grid grid-cols-2 gap-3">
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
              <div>
                <label className={labelClass}>Service Type *</label>
                <select
                  value={form.serviceType}
                  onChange={(e) => set("serviceType", e.target.value)}
                  className={inputClass}
                >
                  {SERVICE_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Start Time *</label>
                <input type="time" required value={form.startTime} onChange={(e) => set("startTime", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>End Time *</label>
                <input type="time" required value={form.endTime} onChange={(e) => set("endTime", e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Service Location</label>
                <input
                  type="text"
                  value={form.serviceLocation}
                  onChange={(e) => set("serviceLocation", e.target.value)}
                  placeholder="e.g. Client Home – North Sydney"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Service Address</label>
                <input
                  type="text"
                  value={form.serviceAddress}
                  onChange={(e) => set("serviceAddress", e.target.value)}
                  placeholder="Full street address"
                  className={inputClass}
                />
              </div>
            </div>

            {/* ── Recurrence section ── */}
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <p className="text-xs font-semibold text-gray-700 mb-3">Recurrence Pattern</p>

              {/* Recurrence type */}
              <div className="mb-3">
                <label className={labelClass}>Pattern *</label>
                <select
                  value={form.recurrenceType}
                  onChange={(e) => set("recurrenceType", e.target.value as RecurrenceType)}
                  className={inputClass}
                >
                  <option value="once">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom interval</option>
                </select>
              </div>

              {/* Day picker for weekly/fortnightly */}
              {showDayPicker && (
                <div className="mb-3">
                  <label className={labelClass}>Days of Week *</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                          form.recurrenceDays.includes(day)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {DAY_OF_WEEK_LABELS[day]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fortnightly week selector */}
              {showFortnightlyWeek && (
                <div className="mb-3">
                  <label className={labelClass}>Which Fortnight Week</label>
                  <select value={form.fortnightlyWeek} onChange={(e) => set("fortnightlyWeek", e.target.value)} className={inputClass}>
                    <option value="1">Week 1</option>
                    <option value="2">Week 2</option>
                  </select>
                </div>
              )}

              {/* Monthly day */}
              {showMonthDay && (
                <div className="mb-3">
                  <label className={labelClass}>Day of Month (1–31) *</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={form.recurrenceDayOfMonth}
                    onChange={(e) => set("recurrenceDayOfMonth", e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              {/* Custom interval */}
              {showCustomInterval && (
                <div className="mb-3">
                  <label className={labelClass}>Repeat Every N Days *</label>
                  <input
                    type="number"
                    min={1}
                    value={form.customIntervalDays}
                    onChange={(e) => set("customIntervalDays", e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Start Date *</label>
                  <input type="date" required value={form.scheduleStartDate} onChange={(e) => set("scheduleStartDate", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>End Date <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="date" value={form.scheduleEndDate} onChange={(e) => set("scheduleEndDate", e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            {/* ── Pricing ── */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Hourly Rate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.hourlyRate}
                  onChange={(e) => set("hourlyRate", e.target.value)}
                  placeholder="65.00"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Flat Rate ($) <span className="text-gray-400 font-normal">(if not hourly)</span></label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.flatRate}
                  onChange={(e) => set("flatRate", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* ── Staff preferences ── */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Preferred Staff</label>
                <input
                  type="text"
                  value={form.preferredStaffName}
                  onChange={(e) => set("preferredStaffName", e.target.value)}
                  placeholder="Staff member name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Backup Staff</label>
                <input
                  type="text"
                  value={form.backupStaffName}
                  onChange={(e) => set("backupStaffName", e.target.value)}
                  placeholder="Backup staff name"
                  className={inputClass}
                />
              </div>
            </div>

            {/* ── Auto-generation ── */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autoGenerateBookings}
                  onChange={(e) => set("autoGenerateBookings", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Auto-generate bookings</span>
              </label>
              {form.autoGenerateBookings && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={form.generateWeeksInAdvance}
                    onChange={(e) => set("generateWeeksInAdvance", e.target.value)}
                    className="w-16 h-9 px-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-500">weeks in advance</span>
                </div>
              )}
            </div>

            {/* ── Status (for editing) ── */}
            {isEditing && (
              <div>
                <label className={labelClass}>Status</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value as ScheduleStatusType)} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            )}

            {/* ── Notes ── */}
            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="General notes about this schedule…"
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>Special Requirements</label>
              <textarea
                rows={2}
                value={form.specialRequirements}
                onChange={(e) => set("specialRequirements", e.target.value)}
                placeholder="Any special requirements for service delivery…"
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>Participant Goals</label>
              <textarea
                rows={2}
                value={form.participantGoals}
                onChange={(e) => set("participantGoals", e.target.value)}
                placeholder="What this schedule aims to achieve for the participant…"
                className={textareaClass}
              />
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 mt-auto">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/25">
              {isEditing ? "Save Changes" : "Create Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

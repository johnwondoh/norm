"use client";

import { Clock, MapPin, CheckCircle2, AlertCircle, User, FileText, AlertTriangle } from "lucide-react";
import type { Appointment, DisplayStatus } from "@/types/scheduling";
import { getDisplayStatus } from "@/types/scheduling";

// ---------------------------------------------------------------------------
// Colour helpers – keyed on the effective *display* status
// ---------------------------------------------------------------------------
function statusBorder(status: DisplayStatus): string {
  switch (status) {
    case "Scheduled":  return "border-l-green-500";
    case "Unassigned": return "border-l-orange-400";
    case "Cancelled":  return "border-l-red-300";
    case "Completed":  return "border-l-gray-400";
    case "No-show":    return "border-l-purple-400";
  }
}

function statusIcon(status: DisplayStatus) {
  switch (status) {
    case "Scheduled":
    case "Completed":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case "Unassigned":
      return <AlertCircle className="w-5 h-5 text-orange-400" />;
    case "Cancelled":
      return <AlertCircle className="w-5 h-5 text-red-400" />;
    case "No-show":
      return <AlertTriangle className="w-5 h-5 text-purple-400" />;
  }
}

/** tiny coloured dot for the worker-type tag */
function workerDot(status: DisplayStatus): string {
  switch (status) {
    case "Scheduled":  return "bg-green-400";
    case "Unassigned": return "bg-orange-400";
    case "Cancelled":  return "bg-red-300";
    case "Completed":  return "bg-gray-400";
    case "No-show":    return "bg-purple-400";
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: (appointment: Appointment) => void;
  onUnassign?: (appointment: Appointment) => void;
  /** hide the participant block – useful inside a single-participant view */
  hideParticipant?: boolean;
  /** true when this card is the one currently driving the match panel */
  isSelected?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Initials helper
// ---------------------------------------------------------------------------
function initials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function AppointmentCard({
  appointment,
  onClick,
  onUnassign,
  hideParticipant = false,
  isSelected = false,
  className = "",
}: AppointmentCardProps) {
  const { participant, assignedEmployee, requiredSkills } = appointment;
  const displayStatus = getDisplayStatus(appointment);

  return (
    <div
      className={`
        rounded-xl border-l-4 ${statusBorder(displayStatus)}
        transition-all duration-200 cursor-pointer
        ${isSelected
          ? "bg-blue-50 border border-blue-300 ring-2 ring-blue-400 shadow-md"
          : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
        }
        ${className}
      `}
      onClick={() => onClick?.(appointment)}
    >
      {/* ── header row: avatar · name · status-icon ── */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 min-w-0">
          {!hideParticipant && (
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-600">{initials(participant.name)}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {hideParticipant
                ? participant.supportCategory
                : participant.preferredName
                  ? `${participant.preferredName} (${participant.name})`
                  : participant.name}
            </p>
            <p className="text-xs text-gray-500">{participant.ndisNumber}</p>
          </div>
        </div>
        {statusIcon(displayStatus)}
      </div>

      {/* ── meta row: type · time · duration · location · rate ── */}
      <div className="px-4 pb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {/* worker-type chip */}
        <span className="inline-flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${workerDot(displayStatus)}`} />
          <span className="text-xs font-semibold text-gray-600">{appointment.workerType}</span>
        </span>

        {/* time + duration */}
        <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          {appointment.startTime} – {appointment.endTime}
          <span className="text-gray-400">·</span>
          {appointment.durationMinutes} min
        </span>

        {/* location */}
        <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          {appointment.location}
        </span>

        {/* rate / amount – pushed to the right when space allows */}
        <span className="ml-auto text-xs font-bold text-gray-700">
          {appointment.amountCharged != null
            ? `$${appointment.amountCharged.toFixed(2)}`
            : `$${appointment.rate}/hr`}
        </span>
      </div>

      {/* ── budget & hours row (when available) ── */}
      {(appointment.budgetCategory || appointment.hoursDelivered != null) && (
        <div className="px-4 pb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {appointment.budgetCategory && (
            <span className="text-xs text-gray-500">
              Budget: <span className="font-semibold text-gray-700">{appointment.budgetCategory}</span>
            </span>
          )}
          {appointment.hoursDelivered != null && (
            <span className="text-xs text-gray-500">
              Hours: <span className="font-semibold text-gray-700">{appointment.hoursDelivered}h</span>
            </span>
          )}
        </div>
      )}

      {/* ── skills row ── */}
      {requiredSkills.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400 mr-1">Skills:</span>
          {requiredSkills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* ── cancellation reason ── */}
      {appointment.cancellationReason && (
        <div className="mx-4 mb-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-600">{appointment.cancellationReason}</p>
        </div>
      )}

      {/* ── inline note ── */}
      {appointment.notes && (
        <div className="mx-4 mb-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2">
          <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-600">{appointment.notes}</p>
        </div>
      )}

      {/* ── service notes (from service_notes table) ── */}
      {appointment.serviceNotes && appointment.serviceNotes.length > 0 && (
        <div className="mx-4 mb-2 space-y-1">
          {appointment.serviceNotes.map((sn) => (
            <div
              key={sn.id}
              className={`px-3 py-1.5 rounded-lg flex items-start gap-2 border ${
                sn.isSensitive
                  ? "bg-amber-50 border-amber-200"
                  : "bg-blue-50 border-blue-100"
              }`}
            >
              <AlertTriangle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${sn.isSensitive ? "text-amber-500" : "text-blue-400"}`} />
              <div className="min-w-0">
                <p className={`text-xs ${sn.isSensitive ? "text-amber-700 font-semibold" : "text-blue-700"}`}>
                  {sn.isSensitive && <span className="mr-1">[Sensitive]</span>}
                  {sn.note}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {sn.noteType && <span className="capitalize mr-1">{sn.noteType} ·</span>}
                  {sn.createdByName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── staff footer ── */}
      <div className={`px-4 py-2.5 flex items-center justify-between rounded-b-xl ${isSelected ? "bg-blue-100/50" : "bg-gray-50"}`}>
        {assignedEmployee ? (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-indigo-600">{initials(assignedEmployee.name)}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">{assignedEmployee.name}</p>
                <p className="text-xs text-gray-400">Assigned</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onUnassign?.(appointment); }}
              className="px-2.5 py-0.5 text-red-600 text-xs font-semibold rounded-full hover:bg-red-50 transition-colors"
            >
              Unassign
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-400 italic">No staff assigned — click to match</p>
          </div>
        )}
      </div>
    </div>
  );
}

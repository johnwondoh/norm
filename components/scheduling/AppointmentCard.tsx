"use client";

import { Clock, MapPin, CheckCircle2, AlertCircle, User } from "lucide-react";
import type { Appointment } from "@/types/scheduling";

// ---------------------------------------------------------------------------
// Colour helpers
// ---------------------------------------------------------------------------
function statusBorder(status: Appointment["status"]): string {
  switch (status) {
    case "Scheduled":  return "border-l-green-500";
    case "Unassigned": return "border-l-orange-400";
    case "Cancelled":  return "border-l-red-300";
    case "Completed":  return "border-l-gray-400";
  }
}

function statusIcon(status: Appointment["status"]) {
  switch (status) {
    case "Scheduled":
    case "Completed":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case "Unassigned":
      return <AlertCircle className="w-5 h-5 text-orange-400" />;
    case "Cancelled":
      return <AlertCircle className="w-5 h-5 text-red-400" />;
  }
}

/** tiny coloured dot for the worker-type tag */
function workerDot(status: Appointment["status"]): string {
  switch (status) {
    case "Scheduled":  return "bg-green-400";
    case "Unassigned": return "bg-orange-400";
    case "Cancelled":  return "bg-red-300";
    case "Completed":  return "bg-gray-400";
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
  const { participant, assignedEmployee, status, requiredSkills } = appointment;

  return (
    <div
      className={`
        rounded-xl border-l-4 ${statusBorder(status)}
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
              {hideParticipant ? participant.supportCategory : participant.name}
            </p>
            <p className="text-xs text-gray-500">{participant.ndisNumber}</p>
          </div>
        </div>
        {statusIcon(status)}
      </div>

      {/* ── meta row: type · time · duration · location · rate ── */}
      <div className="px-4 pb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {/* worker-type chip */}
        <span className="inline-flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${workerDot(status)}`} />
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

        {/* rate – pushed to the right when space allows */}
        <span className="ml-auto text-xs font-bold text-gray-700">${appointment.rate}</span>
      </div>

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

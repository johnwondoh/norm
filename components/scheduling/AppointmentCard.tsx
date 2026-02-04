"use client";

import { Clock, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
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

// ---------------------------------------------------------------------------
// Props – kept narrow so this card is drop-in reusable
// ---------------------------------------------------------------------------
export interface AppointmentCardProps {
  appointment: Appointment;
  /** when the card itself is clicked (e.g. to open match panel) */
  onClick?: (appointment: Appointment) => void;
  /** when "Unassign" is pressed */
  onUnassign?: (appointment: Appointment) => void;
  /** hide the participant block – useful inside a single-participant view */
  hideParticipant?: boolean;
  /** true when this card is the one currently driving the match panel */
  isSelected?: boolean;
  /** extra className for the outer wrapper */
  className?: string;
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
      {/* ── top row: participant + status icon ── */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          {!hideParticipant && (
            <div className="flex items-center gap-3">
              {/* avatar / initials */}
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-blue-600">
                  {participant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{participant.name}</p>
                <p className="text-xs text-gray-500">{participant.ndisNumber}</p>
              </div>
            </div>
          )}

          {hideParticipant && (
            <div>
              <p className="font-semibold text-gray-900 text-sm">{participant.supportCategory}</p>
              <p className="text-xs text-gray-500">{participant.ndisNumber}</p>
            </div>
          )}

          {/* status icon */}
          {statusIcon(status)}
        </div>

        {/* support-category tag */}
        <div className="mt-3">
          <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {appointment.workerType}
          </span>
        </div>
      </div>

      {/* ── time + location row ── */}
      <div className="px-5 py-2.5 border-t border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-600 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{appointment.startTime} – {appointment.endTime}</span>
          </div>
          <span className="text-xs text-gray-500">{appointment.durationMinutes} min</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1.5">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{appointment.location}</span>
        </div>
      </div>

      {/* ── required skills ── */}
      {requiredSkills.length > 0 && (
        <div className="px-5 py-2.5 border-t border-gray-50">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Required Skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── assigned worker / action row ── */}
      <div className="px-5 py-3 border-t border-gray-50 bg-gray-50 rounded-b-xl">
        {assignedEmployee ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-indigo-600">
                  {assignedEmployee.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{assignedEmployee.name}</p>
                <p className="text-xs text-gray-500">Assigned Staff</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">${appointment.rate}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onUnassign?.(appointment); }}
                className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold hover:bg-red-100 transition-colors"
              >
                Unassign
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 italic">No staff assigned</p>
            <span className="text-sm font-semibold text-gray-700">${appointment.rate}</span>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { ArrowLeft } from "lucide-react";
import type { Appointment } from "@/types/scheduling";

export interface MatchStaffHeaderProps {
  /** the currently selected appointment, or null when idle */
  appointment: Appointment | null;
  /** called when the back arrow / dismiss is clicked */
  onClose: () => void;
}

/**
 * Blue header for the staff-match sidebar.
 *   - When an appointment is selected: back arrow + "Match Staff" title
 *     + appointment summary card (avatar, name, worker type, date/time).
 *   - When idle: just the title + hint text.
 */
export function MatchStaffHeader({ appointment, onClose }: MatchStaffHeaderProps) {
  if (appointment) {
    return (
      <div className="bg-blue-600 text-white rounded-t-xl px-5 py-4 flex-shrink-0">
        {/* back arrow + title */}
        <div className="flex items-center gap-2 mb-3">
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-white">Match Staff</h3>
            <p className="text-blue-200 text-xs">Find the best staff for this appointment</p>
          </div>
        </div>

        {/* appointment summary card */}
        <div className="bg-blue-500/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {appointment.participant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white text-sm truncate">{appointment.participant.name}</p>
            <p className="text-blue-200 text-xs">{appointment.workerType}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-blue-200 text-xs">
              {appointment.date.slice(5, 7)}/{appointment.date.slice(8, 10)}
            </p>
            <p className="text-white text-xs font-medium">
              {appointment.startTime} – {appointment.endTime}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-600 text-white rounded-t-xl px-5 py-4 flex-shrink-0">
      <h3 className="text-sm font-bold text-white">Match Staff</h3>
      <p className="text-blue-200 text-xs">Select a schedule to match with workers</p>
    </div>
  );
}

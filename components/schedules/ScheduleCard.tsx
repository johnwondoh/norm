"use client";

import {
  Clock,
  MapPin,
  User,
  CalendarDays,
  Repeat,
  Play,
  Pause,
  Edit2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import type { ServiceSchedule } from "@/types/schedule";
import {
  RECURRENCE_TYPE_LABELS,
  SCHEDULE_STATUS_LABELS,
  DAY_OF_WEEK_LABELS,
} from "@/types/schedule";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface ScheduleCardProps {
  schedule: ServiceSchedule;
  onEdit: (schedule: ServiceSchedule) => void;
  onStatusChange: (id: string, status: ServiceSchedule["status"]) => void;
}

// ---------------------------------------------------------------------------
// Status colours
// ---------------------------------------------------------------------------
const statusStyles: Record<ServiceSchedule["status"], { bg: string; text: string; dot: string }> = {
  active:  { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  paused:  { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500" },
  ended:   { bg: "bg-slate-100", text: "text-slate-600",  dot: "bg-slate-400" },
  draft:   { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ScheduleCard({ schedule, onEdit, onStatusChange }: ScheduleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const style = statusStyles[schedule.status];

  const recurrenceLabel = RECURRENCE_TYPE_LABELS[schedule.recurrenceType];
  const daysLabel =
    schedule.recurrenceDays.length > 0
      ? schedule.recurrenceDays.map((d) => DAY_OF_WEEK_LABELS[d]).join(", ")
      : null;

  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="px-5 py-4 flex items-start gap-4">
        {/* Left: info */}
        <div className="flex-1 min-w-0">
          {/* Title + status */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {schedule.scheduleName}
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {SCHEDULE_STATUS_LABELS[schedule.status]}
            </span>
          </div>

          {/* Participant */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{schedule.participantName}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">{schedule.serviceType}</span>
          </div>

          {/* Time + location */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(schedule.startTime)} – {formatTime(schedule.endTime)}
              <span className="text-slate-400">({schedule.durationHours}h)</span>
            </span>
            {schedule.serviceLocation && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {schedule.serviceLocation}
              </span>
            )}
          </div>

          {/* Recurrence */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Repeat className="w-3.5 h-3.5" />
              {recurrenceLabel}
              {daysLabel && <span className="text-slate-400">({daysLabel})</span>}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {schedule.scheduleStartDate}
              {schedule.scheduleEndDate ? ` – ${schedule.scheduleEndDate}` : " – Ongoing"}
            </span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {schedule.status === "active" && (
            <button
              onClick={() => onStatusChange(schedule.id, "paused")}
              title="Pause schedule"
              className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
          {schedule.status === "paused" && (
            <button
              onClick={() => onStatusChange(schedule.id, "active")}
              title="Resume schedule"
              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {schedule.status === "draft" && (
            <button
              onClick={() => onStatusChange(schedule.id, "active")}
              title="Activate schedule"
              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(schedule)}
            title="Edit schedule"
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded((prev) => !prev)}
            title={expanded ? "Collapse" : "Expand details"}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-4 pt-0 border-t border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 pt-3 text-xs">
            {/* Pricing */}
            {schedule.hourlyRate != null && (
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">Hourly Rate</span>
                <span className="text-slate-800">${schedule.hourlyRate.toFixed(2)}/hr</span>
              </div>
            )}
            {schedule.flatRate != null && (
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">Flat Rate</span>
                <span className="text-slate-800">${schedule.flatRate.toFixed(2)}</span>
              </div>
            )}

            {/* Preferred staff */}
            {schedule.preferredStaffName && (
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">Preferred Staff</span>
                <span className="text-slate-800">{schedule.preferredStaffName}</span>
              </div>
            )}
            {schedule.backupStaffName && (
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">Backup Staff</span>
                <span className="text-slate-800">{schedule.backupStaffName}</span>
              </div>
            )}

            {/* Generation settings */}
            <div>
              <span className="font-semibold text-slate-500 block mb-0.5">Auto-generate</span>
              <span className="text-slate-800">
                {schedule.autoGenerateBookings ? `Yes (${schedule.generateWeeksInAdvance} weeks ahead)` : "No"}
              </span>
            </div>

            {/* Booking counts */}
            {schedule.upcomingBookings != null && (
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">Upcoming Bookings</span>
                <span className="text-slate-800">{schedule.upcomingBookings}</span>
              </div>
            )}
            {schedule.completedBookings != null && (
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">Completed Bookings</span>
                <span className="text-slate-800">{schedule.completedBookings}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {schedule.notes && (
            <div className="mt-3">
              <span className="font-semibold text-slate-500 text-xs block mb-0.5">Notes</span>
              <p className="text-xs text-slate-700 whitespace-pre-wrap">{schedule.notes}</p>
            </div>
          )}
          {schedule.specialRequirements && (
            <div className="mt-2">
              <span className="font-semibold text-slate-500 text-xs block mb-0.5">Special Requirements</span>
              <p className="text-xs text-slate-700 whitespace-pre-wrap">{schedule.specialRequirements}</p>
            </div>
          )}
          {schedule.participantGoals && (
            <div className="mt-2">
              <span className="font-semibold text-slate-500 text-xs block mb-0.5">Participant Goals</span>
              <p className="text-xs text-slate-700 whitespace-pre-wrap">{schedule.participantGoals}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

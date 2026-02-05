"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Appointment } from "@/types/scheduling";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return the Monday of the week containing `date` */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust to Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** "Mon", "Tue", … */
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** visible hours range – full 24-hour day */
const START_HOUR = 0;
const END_HOUR   = 24;
const SLOT_MINS  = 30; // each row = 30 min

/** number of half-hour rows visible */
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2; // 26

/** Format HH:MM → minutes since midnight */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** minutes since midnight → pixel offset (each slot = 28 px) */
const SLOT_PX = 28;
function minutesToPx(mins: number): number {
  return ((mins - START_HOUR * 60) / SLOT_MINS) * SLOT_PX;
}

/** ISO date string → "YYYY-MM-DD" */
function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/** colour classes based on appointment status */
function blockColors(status: Appointment["status"]): string {
  switch (status) {
    case "Scheduled":  return "bg-green-100 border-green-400 text-green-800";
    case "Unassigned": return "bg-orange-50 border-orange-300 text-orange-800";
    case "Cancelled":  return "bg-red-50 border-red-200 text-red-600";
    case "Completed":  return "bg-gray-100 border-gray-300 text-gray-600";
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface ScheduleCalendarProps {
  appointments: Appointment[];
  /** clicking a block opens the match panel – forward the appointment */
  onAppointmentClick?: (appointment: Appointment) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ScheduleCalendar({ appointments, onAppointmentClick }: ScheduleCalendarProps) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

  // derive the 7 day-keys for the current week
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // group appointments by date key
  const appointmentsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const appt of appointments) {
      const key = appt.date; // already "YYYY-MM-DD"
      (map[key] ??= []).push(appt);
    }
    return map;
  }, [appointments]);

  // navigation
  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };
  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };
  const goToday = () => setWeekStart(getWeekStart(new Date()));

  // month label for header
  const monthLabel = weekStart.toLocaleDateString("en-AU", { month: "long", year: "numeric" });

  // today key for highlighting
  const todayKey = toDateKey(new Date());

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* ── calendar header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900">{monthLabel}</h3>
          <div className="flex items-center gap-1">
            <button type="button" onClick={prevWeek} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button type="button" onClick={nextWeek} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button type="button" onClick={goToday} className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
            Today
          </button>
        </div>

        {/* legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <span className="text-xs text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-300" />
            <span className="text-xs text-gray-600">Unassigned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-300" />
            <span className="text-xs text-gray-600">Cancelled</span>
          </div>
        </div>
      </div>

      {/* ── day-header row ── */}
      <div className="flex">
        {/* time-label gutter */}
        <div className="w-16 flex-shrink-0 border-r border-gray-100" />
        {/* day columns */}
        {weekDays.map((day, i) => {
          const key = toDateKey(day);
          const isToday = key === todayKey;
          return (
            <div
              key={key}
              className={`flex-1 text-center py-3 border-r border-gray-100 last:border-r-0 ${isToday ? "bg-blue-50" : ""}`}
            >
              <p className="text-xs font-semibold text-gray-500 uppercase">{DAY_LABELS[i]}</p>
              <p className={`text-sm font-bold mt-0.5 ${isToday ? "text-blue-600" : "text-gray-800"}`}>
                {day.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── time grid (scrollable) ── */}
      <div className="flex overflow-y-auto" style={{ maxHeight: 520 }}>
        {/* time labels column */}
        <div className="w-16 flex-shrink-0 border-r border-gray-100">
          {Array.from({ length: TOTAL_SLOTS }, (_, i) => {
            const totalMins = START_HOUR * 60 + i * SLOT_MINS;
            const h = Math.floor(totalMins / 60);
            const m = totalMins % 60;
            const showLabel = m === 0; // label on the hour
            return (
              <div key={i} className="h-7 flex items-start justify-end pr-2 border-b border-gray-50">
                {showLabel && (
                  <span className="text-xs text-gray-400 -mt-2.5">
                    {h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* day columns with positioned appointment blocks */}
        {weekDays.map((day) => {
          const key = toDateKey(day);
          const isToday = key === todayKey;
          const dayAppointments = appointmentsByDay[key] ?? [];

          return (
            <div
              key={key}
              className={`flex-1 relative border-r border-gray-100 last:border-r-0 ${isToday ? "bg-blue-50/30" : ""}`}
              style={{ height: TOTAL_SLOTS * SLOT_PX }}
            >
              {/* faint grid lines */}
              {Array.from({ length: TOTAL_SLOTS }, (_, i) => (
                <div key={i} className="absolute inset-x-0 border-b border-gray-50" style={{ top: i * SLOT_PX, height: SLOT_PX }} />
              ))}

              {/* appointment blocks – absolutely positioned */}
              {dayAppointments.map((appt) => {
                const startMins = toMinutes(appt.startTime);
                const endMins   = toMinutes(appt.endTime);
                const topPx     = minutesToPx(startMins);
                const heightPx  = minutesToPx(endMins) - topPx;

                return (
                  <div
                    key={appt.id}
                    onClick={() => onAppointmentClick?.(appt)}
                    className={`
                      absolute left-1 right-1 rounded-lg border overflow-hidden
                      cursor-pointer hover:shadow-md transition-shadow
                      ${blockColors(appt.status)}
                    `}
                    style={{ top: topPx, height: Math.max(heightPx, 24) }}
                  >
                    <div className="px-2 pt-1 truncate">
                      <p className="text-xs font-bold truncate">{appt.participant.name}</p>
                      {heightPx > 48 && (
                        <p className="text-xs truncate opacity-80">{appt.workerType}</p>
                      )}
                      {heightPx > 72 && appt.assignedEmployee && (
                        <p className="text-xs truncate opacity-70">→ {appt.assignedEmployee.name}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

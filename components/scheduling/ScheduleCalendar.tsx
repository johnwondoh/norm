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
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2; // 48

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

/** colour classes + left accent for appointment status */
function blockColors(status: Appointment["status"]): { bg: string; border: string; text: string; accent: string } {
  switch (status) {
    case "Scheduled":  return { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-800",  accent: "bg-green-500" };
    case "Unassigned": return { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-800",  accent: "bg-amber-400" };
    case "Cancelled":  return { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-600",    accent: "bg-red-400" };
    case "Completed":  return { bg: "bg-gray-50",   border: "border-gray-200",   text: "text-gray-600",   accent: "bg-gray-400" };
  }
}

/** true when the hour is in the "night" band (12 AM – 6 AM) */
function isNightHour(h: number) { return h < 6; }

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
      const key = appt.date;
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
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
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
            <span className="text-xs text-gray-500">Scheduled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-400" />
            <span className="text-xs text-gray-500">Unassigned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-400" />
            <span className="text-xs text-gray-500">Cancelled</span>
          </div>
        </div>
      </div>

      {/* ── scrollable grid: sticky day-header row + time grid ── */}
      <div className="overflow-y-auto" style={{ maxHeight: 520 }}>
        {/* sticky day-header row */}
        <div className="flex sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          {/* time-label gutter */}
          <div className="w-16 flex-shrink-0 border-r border-gray-100 bg-white" />
          {/* day columns */}
          {weekDays.map((day, i) => {
            const key = toDateKey(day);
            const isToday = key === todayKey;
            const isWeekend = i >= 5; // Sat = 5, Sun = 6
            return (
              <div
                key={key}
                className={`flex-1 text-center py-2.5 border-r border-gray-100 last:border-r-0 ${
                  isToday ? "bg-blue-50" : isWeekend ? "bg-slate-50" : "bg-white"
                }`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wide ${
                  isToday ? "text-blue-600" : isWeekend ? "text-indigo-500" : "text-slate-400"
                }`}>
                  {DAY_LABELS[i]}
                </p>
                <p className={`text-sm font-bold mt-0.5 ${
                  isToday ? "text-blue-600" : isWeekend ? "text-indigo-600" : "text-gray-800"
                }`}>
                  {isToday ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">
                      {day.getDate()}
                    </span>
                  ) : (
                    day.getDate()
                  )}
                </p>
              </div>
            );
          })}
        </div>

        {/* time grid rows – pt-2 so the first label isn't clipped by the sticky header */}
        <div className="flex pt-2">
          {/* time labels column */}
          <div className="w-16 flex-shrink-0 border-r border-gray-100">
            {Array.from({ length: TOTAL_SLOTS }, (_, i) => {
              const totalMins = START_HOUR * 60 + i * SLOT_MINS;
              const h = Math.floor(totalMins / 60);
              const m = totalMins % 60;
              const showLabel = m === 0;
              const night = isNightHour(h);
              return (
                <div key={i} className={`h-7 flex items-start justify-end pr-2 border-b border-gray-50 ${night ? "bg-slate-50" : ""}`}>
                  {showLabel && (
                    <span className={`text-xs ${i === 0 ? "" : "-mt-2.5"} ${night ? "text-slate-400" : "text-gray-400"}`}>
                      {h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* day columns with positioned appointment blocks */}
          {weekDays.map((day, i) => {
            const key = toDateKey(day);
            const isToday = key === todayKey;
            const isWeekend = i >= 5;
            const dayAppointments = appointmentsByDay[key] ?? [];

            return (
              <div
                key={key}
                className={`flex-1 relative border-r border-gray-100 last:border-r-0 ${
                  isToday ? "bg-blue-50/20" : isWeekend ? "bg-slate-50/50" : ""
                }`}
                style={{ height: TOTAL_SLOTS * SLOT_PX }}
              >
                {/* grid lines – thicker on the hour, faint on half-hour; night shading */}
                {Array.from({ length: TOTAL_SLOTS }, (_, idx) => {
                  const totalMins = START_HOUR * 60 + idx * SLOT_MINS;
                  const h = Math.floor(totalMins / 60);
                  const m = totalMins % 60;
                  const night = isNightHour(h);
                  const onTheHour = m === 0;
                  return (
                    <div
                      key={idx}
                      className={`absolute inset-x-0 ${
                        night && !isToday && !isWeekend ? "bg-slate-50/60" : ""
                      } ${onTheHour ? "border-b border-gray-200" : "border-b border-gray-100"}`}
                      style={{ top: idx * SLOT_PX, height: SLOT_PX }}
                    />
                  );
                })}

                {/* appointment blocks – absolutely positioned */}
                {dayAppointments.map((appt) => {
                  const startMins = toMinutes(appt.startTime);
                  const endMins   = toMinutes(appt.endTime);
                  const topPx     = minutesToPx(startMins);
                  const heightPx  = minutesToPx(endMins) - topPx;
                  const { bg, border, text, accent } = blockColors(appt.status);

                  return (
                    <div
                      key={appt.id}
                      onClick={() => onAppointmentClick?.(appt)}
                      className={`
                        absolute left-1 right-1 rounded-lg border overflow-hidden
                        cursor-pointer hover:shadow-md transition-shadow flex
                        ${bg} ${border} ${text}
                      `}
                      style={{ top: topPx, height: Math.max(heightPx, 24) }}
                    >
                      {/* left colour accent bar */}
                      <div className={`w-1 flex-shrink-0 ${accent}`} />

                      <div className="px-2 pt-1 truncate flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{appt.participant.name}</p>
                        {heightPx > 48 && (
                          <p className="text-xs truncate opacity-70">{appt.workerType}</p>
                        )}
                        {heightPx > 72 && appt.assignedEmployee && (
                          <p className="text-xs truncate opacity-60">→ {appt.assignedEmployee.name}</p>
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
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  X,
  Clock,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { EmployeeShift } from "./page";

interface TimesheetCreateModalProps {
  shift: EmployeeShift;
  onClose: () => void;
  onSuccess: () => void;
}

function formatDisplayDate(dateStr: string) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(timeStr: string | null) {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
}

/** Convert "HH:MM" or "HH:MM:SS" to datetime-local string for a given date */
function toDateTimeLocal(date: string, time: string | null) {
  if (!time) return "";
  const t = time.substring(0, 5); // "HH:MM"
  return `${date}T${t}`;
}

/** Calculate hours between two datetime-local strings, minus break minutes */
function calcActualHours(
  start: string,
  end: string,
  breakMins: number
): number | null {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  const diffMs = e.getTime() - s.getTime();
  if (diffMs <= 0) return null;
  const hours = diffMs / (1000 * 60 * 60) - breakMins / 60;
  return Math.max(0, Math.round(hours * 100) / 100);
}

export default function TimesheetCreateModal({
  shift,
  onClose,
  onSuccess,
}: TimesheetCreateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actual times — pre-fill from scheduled times
  const [actualStart, setActualStart] = useState(
    toDateTimeLocal(shift.serviceDate, shift.startTime)
  );
  const [actualEnd, setActualEnd] = useState(
    toDateTimeLocal(shift.serviceDate, shift.endTime)
  );
  const [breakMinutes, setBreakMinutes] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(shift.hourlyRate ?? 0);
  const [travelDistanceKm, setTravelDistanceKm] = useState<number | "">("");
  const [serviceNotes, setServiceNotes] = useState(shift.bookingNotes ?? "");
  const [tasksCompleted, setTasksCompleted] = useState("");
  const [incidentOccurred, setIncidentOccurred] = useState(false);
  const [submitForApproval, setSubmitForApproval] = useState(false);

  // Computed actual hours display
  const actualHours = calcActualHours(actualStart, actualEnd, breakMinutes);

  // Recalculate scheduled hours
  const scheduledHours = (() => {
    if (!shift.startTime || !shift.endTime) return 0;
    const s = new Date(`${shift.serviceDate}T${shift.startTime.substring(0, 5)}`);
    const e = new Date(`${shift.serviceDate}T${shift.endTime.substring(0, 5)}`);
    return Math.max(0, (e.getTime() - s.getTime()) / (1000 * 60 * 60));
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!actualStart || !actualEnd) {
        throw new Error("Please enter actual start and end times");
      }
      if (new Date(actualEnd) <= new Date(actualStart)) {
        throw new Error("End time must be after start time");
      }
      if (hourlyRate <= 0) {
        throw new Error("Please enter a valid hourly rate");
      }

      const body = {
        organisation_id: "",
        service_booking_id: shift.bookingId,
        participant_id: shift.participantId,
        employee_id: shift.employeeId,
        scheduled_date: shift.serviceDate,
        scheduled_start_time: shift.startTime?.substring(0, 5) ?? "00:00",
        scheduled_end_time: shift.endTime?.substring(0, 5) ?? "00:00",
        scheduled_hours: scheduledHours,
        actual_start_time: actualStart,
        actual_end_time: actualEnd,
        break_minutes: breakMinutes,
        hourly_rate: hourlyRate,
        overtime_rate: hourlyRate * 1.5,
        service_type: shift.serviceType,
        service_location: shift.serviceLocation,
        service_notes: serviceNotes || null,
        tasks_completed: tasksCompleted || null,
        incident_occurred: incidentOccurred,
        travel_distance_km: travelDistanceKm === "" ? null : travelDistanceKm,
        status: submitForApproval ? "submitted" : "draft",
      };

      const res = await fetch("/api/timesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create timesheet");

      if (incidentOccurred) {
        window.location.href = `/incident-reports/new?timesheet_id=${result.timesheet.id}`;
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Trap scroll on body while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Create Timesheet
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {shift.employeeFirstName} {shift.employeeLastName} &mdash;{" "}
                {formatDisplayDate(shift.serviceDate)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Shift summary chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 rounded-full px-3 py-1">
              <User className="h-3.5 w-3.5" />
              <span>
                {shift.participantFirstName} {shift.participantLastName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 rounded-full px-3 py-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{shift.serviceType}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 rounded-full px-3 py-1">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Scheduled: {formatTime(shift.startTime)} –{" "}
                {formatTime(shift.endTime)}
              </span>
            </div>
            {shift.serviceLocation && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 rounded-full px-3 py-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{shift.serviceLocation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Actual times */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                Actual Time Worked
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="actualStart" className="text-xs text-slate-600 mb-1 block">
                    Start Time *
                  </Label>
                  <Input
                    id="actualStart"
                    type="datetime-local"
                    value={actualStart}
                    onChange={(e) => setActualStart(e.target.value)}
                    className="text-slate-900 bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="actualEnd" className="text-xs text-slate-600 mb-1 block">
                    End Time *
                  </Label>
                  <Input
                    id="actualEnd"
                    type="datetime-local"
                    value={actualEnd}
                    onChange={(e) => setActualEnd(e.target.value)}
                    className="text-slate-900 bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="break" className="text-xs text-slate-600 mb-1 block">
                    Break (minutes)
                  </Label>
                  <Input
                    id="break"
                    type="number"
                    min="0"
                    value={breakMinutes}
                    onChange={(e) => setBreakMinutes(Number(e.target.value))}
                    className="text-slate-900 bg-white text-sm"
                  />
                </div>
              </div>

              {/* Computed hours display */}
              {actualHours !== null && (
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    Actual hours:{" "}
                    <span className="font-semibold text-slate-700">
                      {actualHours.toFixed(2)} hrs
                    </span>
                    {scheduledHours > 0 && (
                      <span className="text-slate-400 ml-1">
                        (scheduled {scheduledHours.toFixed(2)} hrs)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Rates & travel */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                Rate & Travel
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="rate" className="text-xs text-slate-600 mb-1 block">
                    Hourly Rate ($/hr) *
                  </Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="text-slate-900 bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="travel" className="text-xs text-slate-600 mb-1 block">
                    Travel Distance (km)
                  </Label>
                  <Input
                    id="travel"
                    type="number"
                    step="0.1"
                    min="0"
                    value={travelDistanceKm}
                    onChange={(e) =>
                      setTravelDistanceKm(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder="Optional"
                    className="text-slate-900 bg-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Service notes */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                Shift Notes
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="tasks" className="text-xs text-slate-600 mb-1 block">
                    Tasks Completed
                  </Label>
                  <Textarea
                    id="tasks"
                    value={tasksCompleted}
                    onChange={(e) => setTasksCompleted(e.target.value)}
                    placeholder="List tasks completed during this shift..."
                    rows={3}
                    className="text-slate-900 bg-white text-sm resize-none"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-xs text-slate-600 mb-1 block">
                    Service Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    placeholder="Any additional notes about the service..."
                    rows={3}
                    className="text-slate-900 bg-white text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Incident flag */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="incident"
                    checked={incidentOccurred}
                    onCheckedChange={(v) => setIncidentOccurred(v as boolean)}
                  />
                  <Label
                    htmlFor="incident"
                    className="text-sm font-medium text-amber-800 cursor-pointer"
                  >
                    An incident occurred during this shift
                  </Label>
                </div>
                {incidentOccurred && (
                  <p className="text-xs text-amber-700 mt-1 ml-6">
                    You will be redirected to create an incident report after
                    saving the timesheet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0 flex items-center justify-between gap-3 bg-slate-50 rounded-b-xl">
            <div className="flex items-center gap-2">
              <Checkbox
                id="submitApproval"
                checked={submitForApproval}
                onCheckedChange={(v) => setSubmitForApproval(v as boolean)}
              />
              <Label
                htmlFor="submitApproval"
                className="text-sm text-slate-700 cursor-pointer"
              >
                Submit for approval
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading
                  ? "Saving..."
                  : submitForApproval
                  ? "Save & Submit"
                  : "Save as Draft"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

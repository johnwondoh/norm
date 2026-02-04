"use client";

import { ArrowLeft, Star, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import type { Appointment, StaffCandidate } from "@/types/scheduling";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function qualityColor(quality: StaffCandidate["matchQuality"]): string {
  switch (quality) {
    case "Excellent Match": return "text-green-600";
    case "Good Match":      return "text-blue-600";
    case "Fair Match":      return "text-yellow-600";
  }
}

function qualityBg(quality: StaffCandidate["matchQuality"]): string {
  switch (quality) {
    case "Excellent Match": return "bg-green-50";
    case "Good Match":      return "bg-blue-50";
    case "Fair Match":      return "bg-yellow-50";
  }
}

function scoreBarColor(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 70) return "bg-blue-500";
  return "bg-yellow-500";
}

// ---------------------------------------------------------------------------
// Props – now designed as an inline, non-modal panel
// ---------------------------------------------------------------------------
export interface StaffMatchPanelProps {
  /** the appointment being matched – null when match view is not active */
  appointment: Appointment | null;
  /** navigate back to the employee list view */
  onClose: () => void;
  /** called when an employee is chosen */
  onAssign: (appointmentId: string, employeeId: string) => void;
}

// ---------------------------------------------------------------------------
// Component – renders inline; parent controls width / container
// ---------------------------------------------------------------------------
export function StaffMatchPanel({ appointment, onClose, onAssign }: StaffMatchPanelProps) {
  const [staffSearch, setStaffSearch] = useState("");

  // reset search every time a new appointment lands
  useEffect(() => {
    setStaffSearch("");
  }, [appointment?.id]);

  // filtered candidates
  const candidates = (() => {
    if (!appointment?.candidateEmployees) return [];
    const q = staffSearch.toLowerCase();
    if (!q) return appointment.candidateEmployees;
    return appointment.candidateEmployees.filter(
      (c) =>
        c.employee.name.toLowerCase().includes(q) ||
        c.employee.role.toLowerCase().includes(q) ||
        c.employee.skills.some((s) => s.toLowerCase().includes(q))
    );
  })();

  if (!appointment) return null;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── blue header block ── */}
      <div className="bg-blue-600 text-white rounded-t-xl px-5 py-4 flex-shrink-0">
        {/* back arrow + title row */}
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

      {/* ── staff search ── */}
      <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={staffSearch}
            onChange={(e) => setStaffSearch(e.target.value)}
            placeholder="Search staff by name or skill…"
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* ── candidate list (scrollable) ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white rounded-b-xl">
        {candidates.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No matching staff found.</p>
        )}

        {candidates.map((candidate) => {
          const { employee, matchScore, matchQuality, matchedSkills, missingSkills } = candidate;
          const isCurrentlyAssigned = appointment.assignedEmployee?.id === employee.id;

          return (
            <div
              key={employee.id}
              className={`border rounded-xl overflow-hidden ${
                isCurrentlyAssigned ? "border-blue-300 bg-blue-50" : "border-gray-100 bg-white"
              }`}
            >
              {/* top row: avatar + name + score */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-indigo-600">
                        {employee.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.role}</p>
                    </div>
                  </div>

                  {/* score badge */}
                  <div className="flex items-center gap-1">
                    <Star className={`w-4 h-4 ${matchScore >= 90 ? "text-green-500" : matchScore >= 70 ? "text-blue-500" : "text-yellow-500"}`} />
                    <span className="text-sm font-bold text-gray-900">{matchScore}%</span>
                  </div>
                </div>

                {/* match quality label */}
                <div className="mt-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${qualityBg(matchQuality)} ${qualityColor(matchQuality)}`}>
                    {matchQuality}
                  </span>
                </div>
              </div>

              {/* availability stripe */}
              <div className={`mx-3 px-3 py-1.5 rounded-lg flex items-center gap-2 ${employee.isAvailable ? "bg-green-50" : "bg-red-50"}`}>
                {employee.isAvailable ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700">Available</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-700">Unavailable</span>
                  </>
                )}
              </div>

              {/* skills match */}
              <div className="px-3 pt-3 pb-2">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Skills Match:</p>
                <p className="text-xs text-gray-500 mb-1">Has Required Skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" />{s}
                    </span>
                  ))}
                </div>
                {missingSkills.length > 0 && (
                  <>
                    <p className="text-xs text-gray-500 mt-1.5 mb-1">Missing Skills:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map((s) => (
                        <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />{s}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* match score bar */}
              <div className="px-3 pt-1 pb-2">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${scoreBarColor(matchScore)}`}
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
              </div>

              {/* action button */}
              <div className="p-3 pt-1">
                {isCurrentlyAssigned ? (
                  <button
                    type="button"
                    className="w-full py-2 bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold cursor-default"
                    disabled
                  >
                    Currently Assigned
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAssign(appointment.id, employee.id)}
                    disabled={!employee.isAvailable}
                    className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
                      employee.isAvailable
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Assign to Appointment
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

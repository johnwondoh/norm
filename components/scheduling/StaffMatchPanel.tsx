"use client";

import { X, Star, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { useState, useMemo } from "react";
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
// Props
// ---------------------------------------------------------------------------
export interface StaffMatchPanelProps {
  /** the appointment being matched – null when panel is closed */
  appointment: Appointment | null;
  /** called when the panel should close */
  onClose: () => void;
  /** called when an employee is chosen */
  onAssign: (appointmentId: string, employeeId: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function StaffMatchPanel({ appointment, onClose, onAssign }: StaffMatchPanelProps) {
  const [staffSearch, setStaffSearch] = useState("");

  // reset search whenever a new appointment opens
  const candidates = useMemo(() => {
    if (!appointment?.candidateEmployees) return [];
    const q = staffSearch.toLowerCase();
    if (!q) return appointment.candidateEmployees;
    return appointment.candidateEmployees.filter(
      (c) =>
        c.employee.name.toLowerCase().includes(q) ||
        c.employee.role.toLowerCase().includes(q) ||
        c.employee.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [appointment, staffSearch]);

  // ── nothing to render ──
  if (!appointment) return null;

  return (
    <>
      {/* ── backdrop ── */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* ── slide-in panel ── */}
      <div className="fixed top-0 right-0 h-full w-[440px] max-w-full bg-white shadow-2xl z-50 flex flex-col">

        {/* header */}
        <div className="bg-blue-600 text-white px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Match Staff</h2>
              <p className="text-blue-100 text-sm mt-0.5">Find the best staff for this appointment</p>
            </div>
            <button type="button" onClick={onClose} className="p-1 hover:bg-blue-500 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* appointment summary card inside header */}
          <div className="mt-4 bg-blue-500/60 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">
                {appointment.participant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{appointment.participant.name}</p>
              <p className="text-blue-100 text-xs">{appointment.workerType}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-blue-100 text-xs">
                {appointment.date.slice(5, 7)}/{appointment.date.slice(8, 10)}
              </p>
              <p className="text-white text-xs font-medium">
                {appointment.startTime} – {appointment.endTime}
              </p>
            </div>
          </div>
        </div>

        {/* staff search */}
        <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
              placeholder="Search staff by name or skill…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* ── candidate list (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
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
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-indigo-600">
                          {employee.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.role}</p>
                      </div>
                    </div>

                    {/* score badge */}
                    <div className="flex items-center gap-1.5">
                      <Star className={`w-4 h-4 ${matchScore >= 90 ? "text-green-500" : matchScore >= 70 ? "text-blue-500" : "text-yellow-500"}`} />
                      <span className="text-sm font-bold text-gray-900">{matchScore}%</span>
                    </div>
                  </div>

                  {/* match quality label */}
                  <div className="mt-2.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${qualityBg(matchQuality)} ${qualityColor(matchQuality)}`}>
                      {matchQuality}
                    </span>
                  </div>
                </div>

                {/* availability stripe */}
                <div className={`mx-4 px-3 py-1.5 rounded-lg flex items-center gap-2 ${employee.isAvailable ? "bg-green-50" : "bg-red-50"}`}>
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
                <div className="px-4 pt-3 pb-2">
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
                <div className="px-4 pt-2 pb-1">
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${scoreBarColor(matchScore)}`}
                      style={{ width: `${matchScore}%` }}
                    />
                  </div>
                </div>

                {/* action button */}
                <div className="p-4 pt-2">
                  {isCurrentlyAssigned ? (
                    <button
                      type="button"
                      className="w-full py-2.5 bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold cursor-default"
                      disabled
                    >
                      Currently Assigned
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAssign(appointment.id, employee.id)}
                      disabled={!employee.isAvailable}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
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
    </>
  );
}

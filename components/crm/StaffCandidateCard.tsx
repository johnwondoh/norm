"use client";

import { AlertCircle, CheckCircle2, Star } from "lucide-react";
import type { StaffCandidate } from "@/types/scheduling";

export interface StaffCandidateCardProps {
  candidate: StaffCandidate;
  /** true when this employee is the one currently assigned to the appointment */
  isCurrentlyAssigned: boolean;
  /** called with the employee id when the user clicks "Assign to Appointment" */
  onAssign: (employeeId: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function qualityStyles(quality: StaffCandidate["matchQuality"]) {
  switch (quality) {
    case "Excellent Match": return { text: "text-green-600",  bg: "bg-green-50"  };
    case "Good Match":      return { text: "text-blue-600",   bg: "bg-blue-50"   };
    case "Fair Match":      return { text: "text-yellow-600", bg: "bg-yellow-50" };
  }
}

function scoreColor(score: number) {
  if (score >= 90) return { star: "text-green-500", bar: "bg-green-500" };
  if (score >= 70) return { star: "text-blue-500",  bar: "bg-blue-500"  };
  return             { star: "text-yellow-500", bar: "bg-yellow-500" };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function StaffCandidateCard({ candidate, isCurrentlyAssigned, onAssign }: StaffCandidateCardProps) {
  const { employee, matchScore, matchQuality, matchedSkills, missingSkills } = candidate;
  const { text: qualityText, bg: qualityBg } = qualityStyles(matchQuality);
  const { star: starColor, bar: barColor }   = scoreColor(matchScore);

  return (
    <div className={`border rounded-xl overflow-hidden ${isCurrentlyAssigned ? "border-blue-300 bg-blue-50" : "border-gray-100 bg-white"}`}>
      {/* top row – avatar + name + score */}
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
          <div className="flex items-center gap-1">
            <Star className={`w-4 h-4 ${starColor}`} />
            <span className="text-sm font-bold text-gray-900">{matchScore}%</span>
          </div>
        </div>

        {/* quality badge */}
        <div className="mt-2">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${qualityBg} ${qualityText}`}>
            {matchQuality}
          </span>
        </div>
      </div>

      {/* availability stripe */}
      <div className={`mx-3 px-3 py-1.5 rounded-lg flex items-center gap-2 ${employee.isAvailable ? "bg-green-50" : "bg-red-50"}`}>
        {employee.isAvailable ? (
          <><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-sm font-medium text-green-700">Available</span></>
        ) : (
          <><AlertCircle className="w-4 h-4 text-red-500" /><span className="text-sm font-medium text-red-700">Unavailable</span></>
        )}
      </div>

      {/* skills */}
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

      {/* score bar */}
      <div className="px-3 pt-1 pb-2">
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${matchScore}%` }} />
        </div>
      </div>

      {/* action button */}
      <div className="p-3 pt-1">
        {isCurrentlyAssigned ? (
          <button type="button" className="w-full py-2 bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold cursor-default" disabled>
            Currently Assigned
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAssign(employee.id)}
            disabled={!employee.isAvailable}
            className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${employee.isAvailable ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            Assign to Appointment
          </button>
        )}
      </div>
    </div>
  );
}

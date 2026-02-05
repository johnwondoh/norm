"use client";

import { AlertTriangle, Clock, User, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { IncidentReport, IncidentSeverity, IncidentStatus } from "@/types/incidents";

// ---------------------------------------------------------------------------
// Colour helpers
// ---------------------------------------------------------------------------
function severityStyles(severity: IncidentSeverity | null) {
  switch (severity) {
    case "Critical": return { bg: "bg-red-100",    text: "text-red-700",    border: "border-red-300",   dot: "bg-red-500"    };
    case "High":     return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300",dot: "bg-orange-500" };
    case "Medium":   return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300",dot: "bg-yellow-500" };
    case "Low":      return { bg: "bg-green-100",  text: "text-green-700",  border: "border-green-300", dot: "bg-green-500"  };
    default:         return { bg: "bg-gray-100",   text: "text-gray-600",   border: "border-gray-300",  dot: "bg-gray-400"   };
  }
}

function statusStyles(status: IncidentStatus) {
  switch (status) {
    case "Open":          return { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   };
    case "Under Review":  return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" };
    case "Resolved":      return { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200"  };
    case "Closed":        return { bg: "bg-gray-50",   text: "text-gray-500",   border: "border-gray-200"   };
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface IncidentCardProps {
  report: IncidentReport;
  onEdit: (report: IncidentReport) => void;
  onStatusChange: (id: string, status: IncidentStatus) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function IncidentCard({ report, onEdit, onStatusChange }: IncidentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const sev  = severityStyles(report.severity);
  const stat = statusStyles(report.status);

  // format date nicely
  const displayDate = (() => {
    const [y, m, d] = report.incidentDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  })();

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
      {/* ── main row ── */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* left: icon + type + participant */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className={`mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${sev.bg}`}>
              <AlertTriangle className={`w-4 h-4 ${sev.text}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900 text-sm">{report.incidentType}</p>
                {report.severity && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${sev.bg} ${sev.text} ${sev.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                    {report.severity}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  {report.participantName}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {displayDate}{report.incidentTime ? ` at ${report.incidentTime}` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* right: status badge + expand toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stat.bg} ${stat.text} ${stat.border}`}>
              {report.status}
            </span>
            <button type="button" onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
          </div>
        </div>

        {/* short description preview when collapsed */}
        {!expanded && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-1 ml-12">{report.description}</p>
        )}
      </div>

      {/* ── expanded details ── */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50">
          <div className="p-4 ml-12 space-y-3">
            {/* description */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">Description</p>
              <p className="text-sm text-gray-700">{report.description}</p>
            </div>

            {/* action taken */}
            {report.actionTaken && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">Action Taken</p>
                <p className="text-sm text-gray-700">{report.actionTaken}</p>
              </div>
            )}

            {/* witnesses */}
            {report.witnesses && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">Witnesses</p>
                <p className="text-sm text-gray-700">{report.witnesses}</p>
              </div>
            )}

            {/* notifications row */}
            <div className="flex gap-3 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${report.reportedToGuardian ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${report.reportedToGuardian ? "bg-green-500" : "bg-gray-400"}`} />
                Guardian {report.reportedToGuardian ? "Notified" : "Not Notified"}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${report.reportedToNdis ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${report.reportedToNdis ? "bg-green-500" : "bg-gray-400"}`} />
                NDIS {report.reportedToNdis ? "Notified" : "Not Notified"}
              </span>
              {report.followUpRequired && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Follow-up Required
                </span>
              )}
            </div>

            {/* follow-up notes */}
            {report.followUpNotes && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">Follow-up Notes</p>
                <p className="text-sm text-gray-700">{report.followUpNotes}</p>
              </div>
            )}

            {/* resolved date */}
            {report.resolvedDate && (
              <p className="text-xs text-gray-500">Resolved: {report.resolvedDate}</p>
            )}

            {/* audit footer */}
            <p className="text-xs text-gray-400">Reported by {report.createdByName} · {new Date(report.createdAt).toLocaleDateString("en-AU")}</p>
          </div>

          {/* action buttons */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
            {/* status changer */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Change status:</span>
              <div className="flex gap-1.5">
                {(["Open", "Under Review", "Resolved", "Closed"] as IncidentStatus[]).map((s) => {
                  const active = report.status === s;
                  const st = statusStyles(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onStatusChange(report.id, s)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors ${active ? `${st.bg} ${st.text} border ${st.border}` : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* edit button */}
            <button
              type="button"
              onClick={() => onEdit(report)}
              className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Edit Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Mail, Phone, Eye, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Participant } from "@/types/participant";

export interface ParticipantTableProps {
  data: Participant[];
  onView?: (participant: Participant) => void;
  className?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (field: string) => void;
}

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-700",
  "On Hold": "bg-orange-100 text-orange-700",
  Discharged: "bg-slate-100 text-slate-700",
};

const ndisStatusColors: Record<string, string> = {
  Active: "bg-blue-100 text-blue-700",
  Suspended: "bg-red-100 text-red-700",
  Cancelled: "bg-slate-100 text-slate-700",
  Expired: "bg-yellow-100 text-yellow-700",
};

// Helper function to format date consistently on both server and client
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

interface SortIconProps {
  field: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

function SortIcon({ field, sortField, sortDirection }: SortIconProps) {
  if (sortField !== field) {
    return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />;
  }
  return sortDirection === "asc" ? (
    <ChevronUp className="h-3.5 w-3.5 text-blue-600" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5 text-blue-600" />
  );
}

export function ParticipantTable({
  data,
  onView,
  className,
  sortField,
  sortDirection,
  onSortChange,
}: ParticipantTableProps) {
  const sortableColumns = [
    { key: "name", label: "Participant" },
    { key: "ndis_number", label: "NDIS Number" },
    { key: "status", label: "Status" },
    { key: "ndis_status", label: "NDIS Status" },
    { key: "intake_date", label: "Intake Date" },
  ];

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            {sortableColumns.map((col) => (
              <th
                key={col.key}
                onClick={() => onSortChange?.(col.key)}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  <SortIcon field={col.key} sortField={sortField} sortDirection={sortDirection} />
                </div>
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((participant) => (
            <tr key={participant.id} className="hover:bg-slate-50 transition-colors">
              {/* Name + avatar */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -left-1 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center ml-2">
                      <span className="text-sm font-medium text-slate-600">
                        {participant.first_name?.charAt(0).toUpperCase() ?? "?"}
                        {participant.last_name?.charAt(0).toUpperCase() ?? ""}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {participant.preferred_name || participant.first_name}{" "}
                      {participant.last_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      DOB {formatDate(participant.date_of_birth)}
                    </p>
                  </div>
                </div>
              </td>

              {/* NDIS Number */}
              <td className="px-4 py-4">
                <span className="text-sm font-mono text-slate-700">
                  {participant.ndis_number || "-"}
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-medium",
                    statusColors[participant.status ?? ""] || "bg-slate-100 text-slate-700"
                  )}
                >
                  {participant.status || "-"}
                </Badge>
              </td>

              {/* NDIS Status */}
              <td className="px-4 py-4">
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-normal",
                    ndisStatusColors[participant.ndis_status ?? ""] || "bg-slate-100 text-slate-700"
                  )}
                >
                  {participant.ndis_status || "-"}
                </Badge>
              </td>

              {/* Intake Date */}
              <td className="px-4 py-4">
                <span className="text-sm text-slate-600">{formatDate(participant.intake_date)}</span>
              </td>

              {/* Contact */}
              <td className="px-4 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{participant.email || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{participant.phone || "-"}</span>
                  </div>
                </div>
              </td>

              {/* Actions */}
              <td className="px-4 py-4">
                <button
                  onClick={() => onView?.(participant)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label={`View ${participant.first_name} ${participant.last_name}`}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No participants found
        </div>
      )}
    </div>
  );
}

export default ParticipantTable;

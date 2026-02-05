"use client";

import type { Employee } from "@/types/scheduling";

export interface EmployeeCardProps {
  employee: Employee;
  /** number of active (non-cancelled) shifts currently assigned */
  assignedShifts: number;
}

/**
 * Compact employee card shown in the staff sidebar when no appointment
 * is selected.  Avatar + name + role + shift count + workload bar.
 */
export function EmployeeCard({ employee, assignedShifts }: EmployeeCardProps) {
  return (
    <div className="border border-gray-100 bg-white rounded-xl overflow-hidden">
      {/* top row */}
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
          <div className="text-right flex-shrink-0">
            <p className="text-xs font-semibold text-slate-600">{assignedShifts}</p>
            <p className="text-xs text-slate-400">shifts</p>
          </div>
        </div>
      </div>

      {/* workload bar */}
      <div className="px-3 pb-3">
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-indigo-400 transition-all duration-500" style={{ width: `${Math.min(assignedShifts * 20, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}

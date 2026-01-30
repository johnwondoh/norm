"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Mail, Phone, Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  avatarUrl?: string;
  // joinDate: string;
  created_at: string;
  isOnline?: boolean;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "On Leave";
  performance: number;
}

export interface StaffTableProps {
  data: StaffMember[];
  onView?: (staff: StaffMember) => void;
  onEdit?: (staff: StaffMember) => void;
  className?: string;
}

const departmentColors: Record<string, string> = {
  // Sales: "bg-slate-100 text-slate-700",
  // Support: "bg-slate-100 text-slate-700",
  // Marketing: "bg-slate-100 text-slate-700",
  // Product: "bg-slate-100 text-slate-700",
  // Engineering: "bg-slate-100 text-slate-700",
  // HR: "bg-slate-100 text-slate-700",
  // Finance: "bg-slate-100 text-slate-700",
};

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-700",
  "On Leave": "bg-yellow-100 text-yellow-700",
  "On-Hold": "bg-yellow-100 text-yellow-700",
};

const getPerformanceColor = (value: number): string => {
  if (value >= 90) return "bg-green-500";
  if (value >= 80) return "bg-blue-500";
  if (value >= 70) return "bg-yellow-500";
  return "bg-orange-500";
};

const getPerformanceTextColor = (value: number): string => {
  if (value >= 90) return "text-green-600";
  if (value >= 80) return "text-blue-600";
  if (value >= 70) return "text-yellow-600";
  return "text-orange-600";
};

export function StaffTable({
  data,
  onView,
  onEdit,
  className,
}: StaffTableProps) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Staff Member
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Performance
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((staff) => (
            <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -left-1 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
                    {staff.avatarUrl ? (
                      <Image
                        src={staff.avatarUrl}
                        alt={staff.first_name + ' ' + staff.last_name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover ml-2"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center ml-2">
                        <span className="text-sm font-medium text-slate-600">
                          {staff.first_name.charAt(0).toUpperCase()} {staff.last_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {staff.isOnline !== undefined && (
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                          staff.isOnline ? "bg-green-500" : "bg-slate-400"
                        )}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{staff.first_name + ' ' + staff.last_name}</p>
                    <p className="text-sm text-slate-500">
                      {/* Joined {staff.joinDate} */}
                      Joined {new Date(staff.created_at).toLocaleDateString()}
                      {/* Joined {staff.created_at} */}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-slate-700">{staff.role}</span>
                {/* <span className="text-sm text-slate-700">Disability Support Worker</span> */}
              </td>
              <td className="px-4 py-4">
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-normal",
                    departmentColors[staff.department] || "bg-slate-100 text-slate-700"
                    // departmentColors['Sales'] || "bg-slate-100 text-slate-700"
                  )}
                >
                  {staff.department}
                  Sales
                </Badge>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{staff.phone}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-medium",
                    statusColors[staff.status] || "bg-slate-100 text-slate-700"
                  )}
                >
                  {staff.status}
                </Badge>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        getPerformanceColor(staff.performance)
                      )}
                      style={{ width: `${staff.performance}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getPerformanceTextColor(staff.performance)
                    )}
                  >
                    {/* {staff.performance}% */}
                    {/* 90% */}
                    {Math.floor(Math.random() * (100 - 90) + 90)}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView?.(staff)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label={`View ${staff.first_name + ' ' + staff.last_name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit?.(staff)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label={`Edit ${staff.first_name + ' ' + staff.last_name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No staff members found
        </div>
      )}
    </div>
  );
}

export default StaffTable;

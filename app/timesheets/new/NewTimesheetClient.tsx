"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  User,
  MapPin,
  Calendar,
  Search,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Sidebar } from "@/components/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { EmployeeShift } from "./page";
import TimesheetCreateModal from "./TimesheetCreateModal";

interface Employee {
  id: number;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
}

interface NewTimesheetClientProps {
  employeeShifts: EmployeeShift[];
  employees: Employee[];
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeStr: string | null) {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

function isToday(dateStr: string) {
  const today = new Date();
  const [y, mo, d] = dateStr.split("-").map(Number);
  return (
    today.getFullYear() === y &&
    today.getMonth() + 1 === mo &&
    today.getDate() === d
  );
}

function isPastOrToday(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, mo, d] = dateStr.split("-").map(Number);
  const shiftDate = new Date(y, mo - 1, d);
  return shiftDate <= today;
}

export default function NewTimesheetClient({
  employeeShifts,
  employees,
}: NewTimesheetClientProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [excludeFuture, setExcludeFuture] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedShift, setSelectedShift] = useState<EmployeeShift | null>(null);

  const filtered = useMemo(() => {
    let list = employeeShifts;

    // Filter out future shifts when toggle is on
    if (excludeFuture) {
      list = list.filter((s) => isPastOrToday(s.serviceDate));
    }

    // Search across employee name, participant name, service type
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          `${s.employeeFirstName} ${s.employeeLastName}`.toLowerCase().includes(q) ||
          `${s.participantFirstName} ${s.participantLastName}`.toLowerCase().includes(q) ||
          s.serviceType.toLowerCase().includes(q) ||
          (s.serviceLocation?.toLowerCase().includes(q) ?? false)
      );
    }

    return list;
  }, [employeeShifts, excludeFuture, search]);

  // Group by date for display
  const grouped = useMemo(() => {
    const map = new Map<string, EmployeeShift[]>();
    for (const shift of filtered) {
      const existing = map.get(shift.serviceDate) ?? [];
      existing.push(shift);
      map.set(shift.serviceDate, existing);
    }
    // Sort dates descending
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const totalFuture = useMemo(
    () => employeeShifts.filter((s) => !isPastOrToday(s.serviceDate)).length,
    [employeeShifts]
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        currentPath="/timesheets"
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        user={{ name: "Admin User", email: "admin@ndis.com" }}
      />

      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/timesheets")}
            className="mb-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Timesheets
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Create Timesheet
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Select an employee shift to generate a timesheet
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search shifts..."
                  className="pl-9 w-56 text-slate-900 bg-white"
                />
              </div>

              {/* Toggle */}
              <div className="flex items-center gap-2">
                <Switch
                  id="exclude-future"
                  checked={excludeFuture}
                  onCheckedChange={setExcludeFuture}
                />
                <Label
                  htmlFor="exclude-future"
                  className="text-sm text-slate-700 cursor-pointer whitespace-nowrap"
                >
                  No future shifts
                  {excludeFuture && totalFuture > 0 && (
                    <span className="ml-1.5 text-xs text-slate-400">
                      ({totalFuture} hidden)
                    </span>
                  )}
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No pending shifts found</p>
              <p className="text-slate-400 text-sm mt-1">
                {search
                  ? "Try adjusting your search"
                  : excludeFuture
                  ? "All past shifts have timesheets, or try disabling the future-shift filter"
                  : "All shifts already have timesheets"}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.map(([date, shifts]) => (
                <div key={date}>
                  {/* Date header */}
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-sm font-semibold text-slate-700">
                      {formatDate(date)}
                    </h2>
                    {isToday(date) && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                        Today
                      </Badge>
                    )}
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400">
                      {shifts.length} shift{shifts.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Shift cards */}
                  <div className="space-y-2">
                    {shifts.map((shift) => (
                      <button
                        key={`${shift.bookingId}-${shift.employeeId}`}
                        onClick={() => setSelectedShift(shift)}
                        className="w-full text-left bg-white border border-slate-200 rounded-lg px-5 py-4 hover:border-blue-400 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          {/* Employee avatar */}
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-slate-400" />
                          </div>

                          {/* Main info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-slate-900">
                                {shift.employeeFirstName} {shift.employeeLastName}
                              </span>
                              {shift.employeeRole === "backup" && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1.5 py-0 text-slate-500 border-slate-300"
                                >
                                  Backup
                                </Badge>
                              )}
                              <span className="text-slate-400 text-sm">·</span>
                              <span className="text-sm text-slate-600">
                                {shift.serviceType}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {shift.participantFirstName}{" "}
                                {shift.participantLastName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatTime(shift.startTime)} –{" "}
                                {formatTime(shift.endTime)}
                              </span>
                              {shift.serviceLocation && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {shift.serviceLocation}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right side */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {shift.bookingStatus && (
                              <Badge
                                className={
                                  shift.bookingStatus === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                }
                              >
                                {shift.bookingStatus}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              <Calendar className="h-4 w-4" />
                              <span>Create</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Timesheet Modal */}
      {selectedShift && (
        <TimesheetCreateModal
          shift={selectedShift}
          onClose={() => setSelectedShift(null)}
          onSuccess={() => {
            setSelectedShift(null);
            router.push("/timesheets");
          }}
        />
      )}
    </div>
  );
}

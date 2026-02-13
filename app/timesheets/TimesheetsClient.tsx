"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Database } from "@/types/supabase";
import SearchBar from "@/components/crm/SearchBar";
import FilterDropdown from "@/components/crm/FilterDropdown";
import SummaryMetricCard from "@/components/crm/SummaryMetricCard";
import TimesheetTable from "@/components/timesheets/TimesheetTable";
import { Button } from "@/components/ui/button";

type Timesheet = Database["public"]["Tables"]["timesheets"]["Row"] & {
  participant?: { id: string; first_name: string; last_name: string } | null;
  employee?: { id: string; first_name: string; last_name: string } | null;
  service_booking?: { id: string; service_type: string; service_location: string | null } | null;
};

interface TimesheetsClientProps {
  initialTimesheets: Timesheet[];
}

export default function TimesheetsClient({ initialTimesheets }: TimesheetsClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRangeFilter, setDateRangeFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Filter timesheets based on search and filters
  const filteredTimesheets = useMemo(() => {
    return initialTimesheets.filter((timesheet) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const employeeName = timesheet.employee
          ? `${timesheet.employee.first_name} ${timesheet.employee.last_name}`.toLowerCase()
          : "";
        const participantName = timesheet.participant
          ? `${timesheet.participant.first_name} ${timesheet.participant.last_name}`.toLowerCase()
          : "";
        const serviceType = timesheet.service_type?.toLowerCase() || "";
        const location = timesheet.service_location?.toLowerCase() || "";

        const matches =
          employeeName.includes(query) ||
          participantName.includes(query) ||
          serviceType.includes(query) ||
          location.includes(query);

        if (!matches) return false;
      }

      // Status filter
      if (statusFilter.length > 0 && !statusFilter.includes(timesheet.status || "")) {
        return false;
      }

      // Date range filter
      if (dateRangeFilter.length > 0) {
        const timesheetDate = new Date(timesheet.scheduled_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const matchesDateRange = dateRangeFilter.some((range) => {
          if (range === "today") {
            const date = new Date(timesheet.scheduled_date);
            date.setHours(0, 0, 0, 0);
            return date.getTime() === today.getTime();
          } else if (range === "this_week") {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            return timesheetDate >= weekAgo && timesheetDate <= today;
          } else if (range === "this_month") {
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            return timesheetDate >= monthAgo && timesheetDate <= today;
          } else if (range === "overdue") {
            return timesheetDate < today && timesheet.status === "draft";
          }
          return true;
        });

        if (!matchesDateRange) return false;
      }

      return true;
    });
  }, [initialTimesheets, searchQuery, statusFilter, dateRangeFilter]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateRangeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTimesheets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTimesheets = filteredTimesheets.slice(startIndex, endIndex);

  // Calculate summary metrics
  const metrics = useMemo(() => {
    const total = initialTimesheets.length;
    const draft = initialTimesheets.filter((t) => t.status === "draft").length;
    const submitted = initialTimesheets.filter((t) => t.status === "submitted").length;
    const approved = initialTimesheets.filter((t) => t.status === "approved").length;
    const rejected = initialTimesheets.filter((t) => t.status === "rejected").length;
    const paid = initialTimesheets.filter((t) => t.status === "paid").length;

    const totalHours = initialTimesheets.reduce(
      (sum, t) => sum + Number(t.billable_hours || 0),
      0
    );

    const totalAmount = initialTimesheets.reduce(
      (sum, t) => sum + Number(t.total_amount || 0),
      0
    );

    return {
      total,
      draft,
      submitted,
      approved,
      rejected,
      paid,
      totalHours: totalHours.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  }, [initialTimesheets]);

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "paid", label: "Paid" },
  ];

  const dateRangeOptions = [
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "overdue", label: "Overdue (Draft)" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage employee timesheets and approvals
          </p>
        </div>
        <Button
          onClick={() => router.push("/timesheets/new")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Timesheet
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryMetricCard
          title="Total Timesheets"
          value={metrics.total}
          subtitle={`${metrics.draft} draft, ${metrics.submitted} pending`}
        />
        <SummaryMetricCard
          title="Approved"
          value={metrics.approved}
          subtitle={`${metrics.paid} paid`}
          variant="success"
        />
        <SummaryMetricCard
          title="Total Hours"
          value={metrics.totalHours}
          subtitle="Billable hours"
          variant="info"
        />
        <SummaryMetricCard
          title="Total Amount"
          value={`$${metrics.totalAmount}`}
          subtitle={`${metrics.rejected} rejected`}
          variant="warning"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by employee, participant, service type, or location..."
            />
          </div>
          <div className="flex gap-2">
            <FilterDropdown
              label="Status"
              options={statusOptions}
              selectedValues={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="Date Range"
              options={dateRangeOptions}
              selectedValues={dateRangeFilter}
              onChange={setDateRangeFilter}
            />
          </div>
        </div>
      </div>

      {/* Timesheet Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <TimesheetTable
          timesheets={currentTimesheets}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredTimesheets.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}

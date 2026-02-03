"use client";

import * as React from "react";
import { Users, UserCheck, Clock, AlertCircle } from "lucide-react";
import {
  Sidebar,
  SummaryMetricCard,
  SearchBar,
  FilterDropdown,
  ParticipantTable,
} from "@/components/crm";
import type { FilterOption } from "@/components/crm";
import type { Participant } from "@/types/participant";
import { useRouter } from "next/navigation";

const statusOptions: FilterOption[] = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
  { label: "On Hold", value: "on-hold" },
  { label: "Suspended", value: "suspended" },
];

const supportCategoryOptions: FilterOption[] = [
  { label: "All Categories", value: "all" },
  { label: "Core", value: "Core" },
  { label: "Capacity Building", value: "Capacity Building" },
  { label: "Capital", value: "Capital" },
];

const pageSizeOptions: FilterOption[] = [
  { label: "5 per page", value: "5" },
  { label: "10 per page", value: "10" },
  { label: "15 per page", value: "15" },
  { label: "20 per page", value: "20" },
];

type SortField = "name" | "ndis_number" | "status" | "support_category" | "created_at";
type SortDirection = "asc" | "desc";

interface ParticipantsClientProps {
  initialParticipants: Participant[];
}

export default function ParticipantsClient({ initialParticipants }: ParticipantsClientProps) {
  const router = useRouter();

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [supportCategoryFilter, setSupportCategoryFilter] = React.useState("all");

  // Sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Sorting
  const [sortField, setSortField] = React.useState<SortField>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");

  // --- Filtering ---
  const filteredParticipants = React.useMemo(() => {
    return initialParticipants.filter((p) => {
      const fullName = `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        fullName.includes(searchQuery.toLowerCase()) ||
        (p.email ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.ndis_number ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.primary_diagnosis ?? "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (p.status ?? "").toLowerCase() === statusFilter.toLowerCase();

      const matchesSupportCategory =
        supportCategoryFilter === "all" ||
        (p.support_category ?? "").toLowerCase() === supportCategoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesSupportCategory;
    });
  }, [initialParticipants, searchQuery, statusFilter, supportCategoryFilter]);

  // --- Sorting ---
  const sortedParticipants = React.useMemo(() => {
    return [...filteredParticipants].sort((a, b) => {
      let aVal: string;
      let bVal: string;

      switch (sortField) {
        case "name":
          aVal = `${a.first_name ?? ""} ${a.last_name ?? ""}`.toLowerCase();
          bVal = `${b.first_name ?? ""} ${b.last_name ?? ""}`.toLowerCase();
          break;
        case "ndis_number":
          aVal = (a.ndis_number ?? "").toLowerCase();
          bVal = (b.ndis_number ?? "").toLowerCase();
          break;
        case "status":
          aVal = (a.status ?? "").toLowerCase();
          bVal = (b.status ?? "").toLowerCase();
          break;
        case "support_category":
          aVal = (a.support_category ?? "").toLowerCase();
          bVal = (b.support_category ?? "").toLowerCase();
          break;
        case "created_at":
          aVal = a.created_at;
          bVal = b.created_at;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredParticipants, sortField, sortDirection]);

  // --- Pagination ---
  const totalPages = Math.ceil(sortedParticipants.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedParticipants = sortedParticipants.slice(startIndex, endIndex);

  // Reset to page 1 when filters / sort change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, supportCategoryFilter, pageSize, sortField, sortDirection]);

  // --- Metrics ---
  const metrics = React.useMemo(() => {
    const total = initialParticipants.length;
    const active = initialParticipants.filter(
      (p) => (p.status ?? "").toLowerCase() === "active"
    ).length;
    const pending = initialParticipants.filter(
      (p) => (p.status ?? "").toLowerCase() === "pending"
    ).length;
    const onHoldOrSuspended = initialParticipants.filter((p) => {
      const s = (p.status ?? "").toLowerCase();
      return s === "on-hold" || s === "suspended";
    }).length;
    return { total, active, pending, onHoldOrSuspended };
  }, [initialParticipants]);

  // --- Handlers ---
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field as SortField);
      setSortDirection("asc");
    }
  };

  const handleView = (participant: Participant) => {
    router.push(`/participants/${participant.id}`);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        currentPath="/participants"
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        user={{
          name: "Admin User",
          email: "admin@ndis.com",
        }}
      />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Participants</h1>
            <p className="text-slate-500 mt-1">
              Manage NDIS participants and their support plans
            </p>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryMetricCard
              title="Total Participants"
              value={metrics.total}
              icon={Users}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <SummaryMetricCard
              title="Active"
              value={metrics.active}
              icon={UserCheck}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <SummaryMetricCard
              title="Pending"
              value={metrics.pending}
              icon={Clock}
              iconColor="text-yellow-600"
              iconBgColor="bg-yellow-100"
            />
            <SummaryMetricCard
              title="On Hold / Suspended"
              value={metrics.onHoldOrSuspended}
              icon={AlertCircle}
              iconColor="text-red-600"
              iconBgColor="bg-red-100"
            />
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, email, NDIS number, or diagnosis..."
              className="flex-1"
            />
            <div className="flex gap-3">
              <FilterDropdown
                label="All Status"
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                showIcon
              />
              <FilterDropdown
                label="All Categories"
                options={supportCategoryOptions}
                value={supportCategoryFilter}
                onChange={setSupportCategoryFilter}
              />
            </div>
          </div>

          {/* Table + Pagination */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <ParticipantTable
              data={paginatedParticipants}
              onView={handleView}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
            />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  Showing {sortedParticipants.length === 0 ? 0 : startIndex + 1} to{" "}
                  {Math.min(endIndex, sortedParticipants.length)} of{" "}
                  {sortedParticipants.length} results
                </span>
              </div>

              <div className="flex items-center gap-4">
                <FilterDropdown
                  label="10 per page"
                  options={pageSizeOptions}
                  value={pageSize.toString()}
                  onChange={handlePageSizeChange}
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="px-2 text-slate-400">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

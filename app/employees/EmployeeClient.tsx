"use client";

import * as React from "react";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import {
  Sidebar,
  SummaryMetricCard,
  StaffTable,
  SearchBar,
  FilterDropdown,
} from "@/components/crm";
import type { StaffMember, FilterOption } from "@/components/crm";

const sampleStaffData: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    joinDate: "2022-01-15",
    isOnline: true,
    role: "Sales Manager",
    department: "Sales",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    performance: 92,
  },
  {
    id: "2",
    name: "Michael Chen",
    joinDate: "2022-03-20",
    isOnline: true,
    role: "Account Executive",
    department: "Sales",
    email: "michael.chen@company.com",
    phone: "+1 (555) 234-5678",
    status: "Active",
    performance: 88,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    joinDate: "2021-11-10",
    isOnline: true,
    role: "Customer Success Lead",
    department: "Support",
    email: "emily.rodriguez@company.com",
    phone: "+1 (555) 345-6789",
    status: "Active",
    performance: 95,
  },
  {
    id: "4",
    name: "David Thompson",
    joinDate: "2022-05-01",
    isOnline: true,
    role: "Marketing Manager",
    department: "Marketing",
    email: "david.thompson@company.com",
    phone: "+1 (555) 456-7890",
    status: "Active",
    performance: 85,
  },
  {
    id: "5",
    name: "Jessica Williams",
    joinDate: "2023-02-14",
    isOnline: true,
    role: "Sales Representative",
    department: "Sales",
    email: "jessica.williams@company.com",
    phone: "+1 (555) 567-8901",
    status: "Active",
    performance: 78,
  },
  {
    id: "6",
    name: "Robert Martinez",
    joinDate: "2023-06-01",
    isOnline: true,
    role: "Support Specialist",
    department: "Support",
    email: "robert.martinez@company.com",
    phone: "+1 (555) 678-9012",
    status: "Active",
    performance: 82,
  },
  {
    id: "7",
    name: "Amanda Lee",
    joinDate: "2021-09-15",
    isOnline: true,
    role: "Product Manager",
    department: "Product",
    email: "amanda.lee@company.com",
    phone: "+1 (555) 789-0123",
    status: "Active",
    performance: 90,
  },
  {
    id: "8",
    name: "James Wilson",
    joinDate: "2022-08-20",
    isOnline: false,
    role: "Sales Representative",
    department: "Sales",
    email: "james.wilson@company.com",
    phone: "+1 (555) 890-1234",
    status: "Inactive",
    performance: 65,
  },
];

const departmentOptions: FilterOption[] = [
  { label: "All Departments", value: "all" },
  { label: "Sales", value: "Sales" },
  { label: "Support", value: "Support" },
  { label: "Marketing", value: "Marketing" },
  { label: "Product", value: "Product" },
  { label: "Engineering", value: "Engineering" },
  { label: "HR", value: "HR" },
  { label: "Finance", value: "Finance" },
];

const statusOptions: FilterOption[] = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "On Leave", value: "On Leave" },
];

interface EmployeesClientProps {
  initialEmployees: any[];
}

export default function EmployeesClient({ initialEmployees }: EmployeesClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Use real data from Supabase or fall back to sample data
  const staffData = initialEmployees.length > 0 ? initialEmployees : sampleStaffData;

  const filteredStaff = React.useMemo(() => {
    return staffData.filter((staff) => {
      const matchesSearch =
        searchQuery === "" ||
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" || staff.department === departmentFilter;

      const matchesStatus =
        statusFilter === "all" || staff.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [staffData, searchQuery, departmentFilter, statusFilter]);

  const metrics = React.useMemo(() => {
    const total = staffData.length;
    const active = staffData.filter((s) => s.status === "Active").length;
    const inactive = staffData.filter((s) => s.status === "Inactive").length;
    const onLeave = staffData.filter((s) => s.status === "On Leave").length;
    return { total, active, inactive, onLeave };
  }, [staffData]);

  const handleView = (staff: StaffMember) => {
    console.log("View staff:", staff);
  };

  const handleEdit = (staff: StaffMember) => {
    console.log("Edit staff:", staff);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        currentPath="/employees"
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        user={{
          name: "Admin User",
          email: "admin@ndis.com",
        }}
      />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Staff Management
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your team members and their information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryMetricCard
              title="Total Staff"
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
              title="Inactive"
              value={metrics.inactive}
              icon={UserX}
              iconColor="text-red-600"
              iconBgColor="bg-red-100"
            />
            <SummaryMetricCard
              title="On Leave"
              value={metrics.onLeave}
              icon={Clock}
              iconColor="text-yellow-600"
              iconBgColor="bg-yellow-100"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, email, or role..."
              className="flex-1"
            />
            <div className="flex gap-3">
              <FilterDropdown
                label="All Departments"
                options={departmentOptions}
                value={departmentFilter}
                onChange={setDepartmentFilter}
                showIcon
              />
              <FilterDropdown
                label="All Status"
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <StaffTable
              data={filteredStaff}
              onView={handleView}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// "use client";

// import * as React from "react";
// import { Users, UserCheck, UserX, Clock } from "lucide-react";
// import {
//   Sidebar,
//   SummaryMetricCard,
//   StaffTable,
//   SearchBar,
//   FilterDropdown,
// } from "@/components/crm";
// import type { StaffMember, FilterOption } from "@/components/crm";
// // import { createClient } from "@/lib/supabase/server";
// // import { createBrowserClient } from "@supabase/ssr";
// import { createClient } from "@/lib/supabase/client";
// // import employeeData
// import { getEmployees } from '@/lib/actions/employees';

// const sampleStaffData: StaffMember[] = [
//   {
//     id: "1",
//     name: "Sarah Johnson",
//     joinDate: "2022-01-15",
//     isOnline: true,
//     role: "Sales Manager",
//     department: "Sales",
//     email: "sarah.johnson@company.com",
//     phone: "+1 (555) 123-4567",
//     status: "Active",
//     performance: 92,
//   },
//   {
//     id: "2",
//     name: "Michael Chen",
//     joinDate: "2022-03-20",
//     isOnline: true,
//     role: "Account Executive",
//     department: "Sales",
//     email: "michael.chen@company.com",
//     phone: "+1 (555) 234-5678",
//     status: "Active",
//     performance: 88,
//   },
//   {
//     id: "3",
//     name: "Emily Rodriguez",
//     joinDate: "2021-11-10",
//     isOnline: true,
//     role: "Customer Success Lead",
//     department: "Support",
//     email: "emily.rodriguez@company.com",
//     phone: "+1 (555) 345-6789",
//     status: "Active",
//     performance: 95,
//   },
//   {
//     id: "4",
//     name: "David Thompson",
//     joinDate: "2022-05-01",
//     isOnline: true,
//     role: "Marketing Manager",
//     department: "Marketing",
//     email: "david.thompson@company.com",
//     phone: "+1 (555) 456-7890",
//     status: "Active",
//     performance: 85,
//   },
//   {
//     id: "5",
//     name: "Jessica Williams",
//     joinDate: "2023-02-14",
//     isOnline: true,
//     role: "Sales Representative",
//     department: "Sales",
//     email: "jessica.williams@company.com",
//     phone: "+1 (555) 567-8901",
//     status: "Active",
//     performance: 78,
//   },
//   {
//     id: "6",
//     name: "Robert Martinez",
//     joinDate: "2023-06-01",
//     isOnline: true,
//     role: "Support Specialist",
//     department: "Support",
//     email: "robert.martinez@company.com",
//     phone: "+1 (555) 678-9012",
//     status: "Active",
//     performance: 82,
//   },
//   {
//     id: "7",
//     name: "Amanda Lee",
//     joinDate: "2021-09-15",
//     isOnline: true,
//     role: "Product Manager",
//     department: "Product",
//     email: "amanda.lee@company.com",
//     phone: "+1 (555) 789-0123",
//     status: "Active",
//     performance: 90,
//   },
//   {
//     id: "8",
//     name: "James Wilson",
//     joinDate: "2022-08-20",
//     isOnline: false,
//     role: "Sales Representative",
//     department: "Sales",
//     email: "james.wilson@company.com",
//     phone: "+1 (555) 890-1234",
//     status: "Inactive",
//     performance: 65,
//   },
// ];

// const departmentOptions: FilterOption[] = [
//   { label: "All Departments", value: "all" },
//   { label: "Sales", value: "Sales" },
//   { label: "Support", value: "Support" },
//   { label: "Marketing", value: "Marketing" },
//   { label: "Product", value: "Product" },
//   { label: "Engineering", value: "Engineering" },
//   { label: "HR", value: "HR" },
//   { label: "Finance", value: "Finance" },
// ];

// const statusOptions: FilterOption[] = [
//   { label: "All Status", value: "all" },
//   { label: "Active", value: "Active" },
//   { label: "Inactive", value: "Inactive" },
//   { label: "On Leave", value: "On Leave" },
// ];



// export default async function EmployeesPage() {


//   // const supabase = await createClient();
//   // let { data: employees, error } = await supabase
//   //     .from('employees')
//   //     // .select('id')
//   //     .select()

//   // console.log(employees)
//   const employees = getEmployees()
//   console.log(employees)

//   const [searchQuery, setSearchQuery] = React.useState("");
//   const [departmentFilter, setDepartmentFilter] = React.useState("all");
//   const [statusFilter, setStatusFilter] = React.useState("all");
//   const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

//   const filteredStaff = React.useMemo(() => {
//     return sampleStaffData.filter((staff) => {
//       const matchesSearch =
//         searchQuery === "" ||
//         staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         staff.role.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesDepartment =
//         departmentFilter === "all" || staff.department === departmentFilter;

//       const matchesStatus =
//         statusFilter === "all" || staff.status === statusFilter;

//       return matchesSearch && matchesDepartment && matchesStatus;
//     });
//   }, [searchQuery, departmentFilter, statusFilter]);

//   const metrics = React.useMemo(() => {
//     const total = sampleStaffData.length;
//     const active = sampleStaffData.filter((s) => s.status === "Active").length;
//     const inactive = sampleStaffData.filter((s) => s.status === "Inactive").length;
//     const onLeave = sampleStaffData.filter((s) => s.status === "On Leave").length;
//     return { total, active, inactive, onLeave };
//   }, []);

//   const handleView = (staff: StaffMember) => {
//     console.log("View staff:", staff);
//   };

//   const handleEdit = (staff: StaffMember) => {
//     console.log("Edit staff:", staff);
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar
//         currentPath="/employees"
//         collapsed={sidebarCollapsed}
//         onCollapsedChange={setSidebarCollapsed}
//         user={{
//           name: "Admin User",
//           email: "admin@ndis.com",
//         }}
//       />

//       <main className="flex-1 p-8 overflow-auto">
//         <div className="max-w-7xl mx-auto">
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-slate-900">
//               Staff Management
//             </h1>
//             <p className="text-slate-500 mt-1">
//               Manage your team members and their information
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             <SummaryMetricCard
//               title="Total Staff"
//               value={metrics.total}
//               icon={Users}
//               iconColor="text-blue-600"
//               iconBgColor="bg-blue-100"
//             />
//             <SummaryMetricCard
//               title="Active"
//               value={metrics.active}
//               icon={UserCheck}
//               iconColor="text-green-600"
//               iconBgColor="bg-green-100"
//             />
//             <SummaryMetricCard
//               title="Inactive"
//               value={metrics.inactive}
//               icon={UserX}
//               iconColor="text-red-600"
//               iconBgColor="bg-red-100"
//             />
//             <SummaryMetricCard
//               title="On Leave"
//               value={metrics.onLeave}
//               icon={Clock}
//               iconColor="text-yellow-600"
//               iconBgColor="bg-yellow-100"
//             />
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <SearchBar
//               value={searchQuery}
//               onChange={setSearchQuery}
//               placeholder="Search by name, email, or role..."
//               className="flex-1"
//             />
//             <div className="flex gap-3">
//               <FilterDropdown
//                 label="All Departments"
//                 options={departmentOptions}
//                 value={departmentFilter}
//                 onChange={setDepartmentFilter}
//                 showIcon
//               />
//               <FilterDropdown
//                 label="All Status"
//                 options={statusOptions}
//                 value={statusFilter}
//                 onChange={setStatusFilter}
//               />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <StaffTable
//               data={filteredStaff}
//               onView={handleView}
//               onEdit={handleEdit}
//             />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

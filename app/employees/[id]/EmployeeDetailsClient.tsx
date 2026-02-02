'use client'

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  User,
  Briefcase,
  DollarSign,
  FileText,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Award,
  Clock,
  CreditCard,
  Shield,
} from "lucide-react";
// import { Staff } from "../types/staff";
import { Employee } from "@/types/employee";
// import { Sidebar } from "./Sidebar";
import { Sidebar } from "@/components/crm";
import { updateEmployee } from "./actions";
import { useRouter } from "next/navigation";

// Import reusable components
import {
  SectionCard,
  SectionTheme,
  DataField,
  DataGrid,
  StatusBadge,
  InfoList,
  InfoListItem,
  AmountTrailing,
  TimeTrailing,
  MetricCard,
  MetricGrid,
  ProgressBar,
  StatusCard,
  StatusCardList,
  EditableDataField,
} from "@/components/dynamicSectionContent";

interface EmployeeDetailPageProps {
  employee: Employee;
  onBack?: () => void;
  onEdit?: () => void;
  onSave?: (updatedEmployee: Partial<Employee>) => Promise<void>;
}

interface Section {
  id: string;
  label: string;
  icon: any;
  theme: SectionTheme;
}

const sections: Section[] = [
  { id: "personal", label: "Personal Information", icon: User, theme: "blue" },
  { id: "employment", label: "Employment Details", icon: Briefcase, theme: "purple" },
  { id: "payroll", label: "Payroll & Compensation", icon: DollarSign, theme: "green" },
  { id: "performance", label: "Performance", icon: TrendingUp, theme: "orange" },
  { id: "schedule", label: "Schedule & Availability", icon: Calendar, theme: "pink" },
  { id: "documents", label: "Documents & Certifications", icon: FileText, theme: "indigo" },
  { id: "compliance", label: "NDIS Compliance", icon: Shield, theme: "red" },
];

// export function EmployeeDetailPage({
export function EmployeeDetailClient({
  employee,
  onBack,
  onEdit,
  onSave,
}: EmployeeDetailPageProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("personal");
  const [localEmployee, setLocalEmployee] = useState(employee);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Update local state when employee prop changes
  useEffect(() => {
    setLocalEmployee(employee);
  }, [employee]);

  const handleFieldSave = async (field: keyof Employee, value: string) => {
    const updates = { [field]: value };

    // If custom onSave handler is provided, use it
    if (onSave) {
      await onSave(updates);
      setLocalEmployee(prev => ({ ...prev, [field]: value }));
      return;
    }

    // Otherwise, use the default server action
    const result = await updateEmployee(employee.id, updates);

    if (result.success) {
      // Update local state optimistically
      setLocalEmployee(prev => ({ ...prev, [field]: value }));
      // Refresh server data in background
      router.refresh();
    } else {
      // Show error to user
      alert(`Failed to save: ${result.error}`);
      throw new Error(result.error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = contentRef.current;
      if (!container) return;

      const scrollPosition = container.scrollTop + 200;

      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    const container = contentRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    const container = contentRef.current;
    if (element && container) {
      const y = element.offsetTop - 20;
      container.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Data for lists
  const recentPayments: InfoListItem[] = [
    { primary: "Regular Pay", secondary: "Jan 15, 2026", trailing: <AmountTrailing amount="$2,884.62" /> },
    { primary: "Regular Pay", secondary: "Jan 1, 2026", trailing: <AmountTrailing amount="$2,884.62" /> },
    { primary: "Regular Pay", secondary: "Dec 15, 2025", trailing: <AmountTrailing amount="$2,884.62" /> },
  ];

  const upcomingSchedule: InfoListItem[] = [
    { primary: "Monday, Jan 31", secondary: "Main Office", trailing: <TimeTrailing time="9:00 AM - 5:00 PM" /> },
    { primary: "Tuesday, Feb 1", secondary: "Client Visit - North Sydney", trailing: <TimeTrailing time="9:00 AM - 5:00 PM" /> },
    { primary: "Wednesday, Feb 2", secondary: "Main Office", trailing: <TimeTrailing time="9:00 AM - 5:00 PM" /> },
  ];

  const documents: InfoListItem[] = [
    { primary: "NDIS Worker Screening Check", secondary: "Valid until Dec 2026", status: "valid", icon: FileText },
    { primary: "First Aid Certificate", secondary: "Valid until Jun 2026", status: "valid", icon: FileText },
    { primary: "Working with Children Check", secondary: "Valid until Mar 2027", status: "valid", icon: FileText },
    { primary: "Employment Contract", secondary: "Signed on Jan 15, 2022", status: "signed", icon: FileText },
    { primary: "Confidentiality Agreement", secondary: "Signed on Jan 15, 2022", status: "signed", icon: FileText },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex overflow-hidden">
      <Sidebar currentPath="staff" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-4">
                  <img
                    // src={employee.avatar}
                    src='placeholder'
                    alt={employee.first_name + ' ' + employee.last_name}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-100 bg-gray-100"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{employee.first_name + ' ' + employee.last_name}</h1>
                    <p className="text-gray-500">{employee.role}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={onEdit}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
              >
                Edit Employee
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Side Navigation */}
          <aside className="w-64 flex-shrink-0 p-6 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sticky top-0">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
                Sections
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                      <span className="text-sm font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Scrollable Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto p-6 pr-8">
            <div className="max-w-4xl space-y-6">
              {/* Personal Information */}
              <SectionCard
                id="personal"
                ref={(el) => (sectionRefs.current["personal"] = el)}
                title="Personal Information"
                icon={User}
                theme="blue"
              >
                <DataGrid>
                  <EditableDataField
                    label="First Name"
                    value={localEmployee.first_name}
                    theme="blue"
                    editable
                    onSave={(value) => handleFieldSave('first_name', value)}
                  />
                  <EditableDataField
                    label="Last Name"
                    value={localEmployee.last_name}
                    theme="blue"
                    editable
                    onSave={(value) => handleFieldSave('last_name', value)}
                  />
                  <DataField label="Employee ID" value={`#${localEmployee.id}`} theme="blue" />
                  <EditableDataField
                    label="Email Address"
                    value={localEmployee.email}
                    icon={Mail}
                    theme="blue"
                    editable
                    type="email"
                    onSave={(value) => handleFieldSave('email', value)}
                  />
                  <EditableDataField
                    label="Phone Number"
                    value={localEmployee.phone}
                    icon={Phone}
                    theme="blue"
                    editable
                    type="tel"
                    onSave={(value) => handleFieldSave('phone', value)}
                  />
                  <EditableDataField
                    label="Address"
                    value={localEmployee.address}
                    icon={MapPin}
                    theme="blue"
                    editable
                    multiline
                    onSave={(value) => handleFieldSave('address', value)}
                  />
                  <EditableDataField
                    label="State"
                    value={localEmployee.state}
                    theme="blue"
                    editable
                    onSave={(value) => handleFieldSave('state', value)}
                  />
                  <EditableDataField
                    label="Post Code"
                    value={localEmployee.post_code}
                    theme="blue"
                    editable
                    onSave={(value) => handleFieldSave('post_code', value)}
                  />
                </DataGrid>
              </SectionCard>

              {/* Employment Details */}
              <SectionCard
                id="employment"
                ref={(el) => (sectionRefs.current["employment"] = el)}
                title="Employment Details"
                icon={Briefcase}
                theme="purple"
              >
                <DataGrid>
                  <EditableDataField
                    label="Position"
                    value={localEmployee.role}
                    theme="purple"
                    editable
                    onSave={(value) => handleFieldSave('role', value)}
                  />
                  <EditableDataField
                    label="Department"
                    value={localEmployee.department}
                    theme="purple"
                    editable
                    onSave={(value) => handleFieldSave('department', value)}
                  />
                  <DataField label="Join Date" value={localEmployee.created_at} theme="purple" />
                  <EditableDataField
                    label="Employment Status"
                    value={localEmployee.status}
                    theme="purple"
                    editable
                    type="select"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'pending', label: 'Pending' },
                    ]}
                    onSave={(value) => handleFieldSave('status', value)}
                  />
                  <DataField label="Employment Type" value="Full-time" theme="purple" />
                  <DataField label="Reports To" value="Sarah Wilson, Director" theme="purple" />
                </DataGrid>
              </SectionCard>

              {/* Payroll & Compensation */}
              <SectionCard
                id="payroll"
                ref={(el) => (sectionRefs.current["payroll"] = el)}
                title="Payroll & Compensation"
                icon={DollarSign}
                theme="green"
              >
                <DataGrid>
                  <DataField label="Base Salary" value="$75,000 / year" theme="green" />
                  <DataField label="Pay Frequency" value="Bi-weekly" theme="green" />
                  <DataField label="Bank Account" value="****1234" icon={CreditCard} theme="green" />
                  <DataField label="Tax File Number" value="***-***-789" theme="green" />
                  <DataField label="Superannuation" value="11% (AustralianSuper)" theme="green" />
                  <DataField label="Last Pay Date" value="January 15, 2026" theme="green" />
                </DataGrid>
                <InfoList title="Recent Payments" items={recentPayments} showDivider />
              </SectionCard>

              {/* Performance */}
              <SectionCard
                id="performance"
                ref={(el) => (sectionRefs.current["performance"] = el)}
                title="Performance"
                icon={TrendingUp}
                theme="orange"
              >
                {/* <ProgressBar value={employee.performance} /> */}
                <ProgressBar value={90} />
                <MetricGrid>
                  <MetricCard icon={Award} value={12} label="Goals Achieved" theme="blue" />
                  <MetricCard icon={Clock} value="98%" label="Attendance Rate" theme="green" />
                  <MetricCard icon={TrendingUp} value="4.8/5" label="Client Rating" theme="purple" />
                </MetricGrid>
                <InfoList
                  title="Recent Reviews"
                  items={[
                    {
                      primary: "Annual Review 2025",
                      secondary: "Excellent performance, exceeding expectations in client care and team collaboration.",
                      trailing: <span className="text-sm text-gray-500">December 2025</span>,
                    },
                  ]}
                />
              </SectionCard>

              {/* Schedule & Availability */}
              <SectionCard
                id="schedule"
                ref={(el) => (sectionRefs.current["schedule"] = el)}
                title="Schedule & Availability"
                icon={Calendar}
                theme="pink"
              >
                <DataGrid>
                  <DataField label="Work Hours" value="Monday - Friday, 9:00 AM - 5:00 PM" theme="pink" />
                  <DataField label="Hours/Week" value="40 hours" theme="pink" />
                  <DataField label="Annual Leave Balance" value="15 days remaining" theme="pink" />
                  <DataField label="Sick Leave Balance" value="8 days remaining" theme="pink" />
                </DataGrid>
                <InfoList title="Upcoming Schedule" items={upcomingSchedule} showDivider />
              </SectionCard>

              {/* Documents & Certifications */}
              <SectionCard
                id="documents"
                ref={(el) => (sectionRefs.current["documents"] = el)}
                title="Documents & Certifications"
                icon={FileText}
                theme="indigo"
              >
                <InfoList items={documents} />
              </SectionCard>

              {/* NDIS Compliance */}
              <SectionCard
                id="compliance"
                ref={(el) => (sectionRefs.current["compliance"] = el)}
                title="NDIS Compliance"
                icon={Shield}
                theme="red"
              >
                <StatusCardList>
                  <StatusCard
                    icon={Shield}
                    title="NDIS Worker Screening"
                    status="Status: Cleared"
                    description="All NDIS worker screening requirements met. Clearance valid until December 2026."
                    theme="green"
                  />
                  <StatusCard
                    icon={Award}
                    title="Quality & Safety Training"
                    status="Status: Completed"
                    description="Completed NDIS Code of Conduct training and Quality & Safeguards Commission requirements."
                    theme="blue"
                  />
                  <StatusCard
                    icon={FileText}
                    title="Incident Reporting"
                    status="Last 12 months: 0 incidents"
                    description="No incidents reported. Maintains excellent safety and compliance record."
                    theme="purple"
                  />
                </StatusCardList>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

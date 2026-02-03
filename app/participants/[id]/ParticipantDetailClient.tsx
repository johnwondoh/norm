'use client'

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
  FileText,
  Calendar,
  DollarSign,
  Target,
  AlertTriangle,
  Users,
  ClipboardList,
} from "lucide-react";
import { Sidebar } from "@/components/crm";
import { useRouter } from "next/navigation";
import { updateParticipant } from "./actions";

import {
  SectionCard,
  SectionTheme,
  DataField,
  DataGrid,
  StatusBadge,
  InfoList,
  InfoListItem,
  AmountTrailing,
  MetricCard,
  MetricGrid,
  ProgressBar,
  StatusCard,
  StatusCardList,
  SectionEditableField,
} from "@/components/dynamicSectionContent";

// ---------------------------------------------------------------------------
// Types (mirrors what page.tsx passes down)
// ---------------------------------------------------------------------------
interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  preferred_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string;
  gender: string | null;
  pronouns: string | null;
  indigenous_status: string | null;
  language: string | null;
  interpreter_required: boolean | null;
  ndis_number: string;
  ndis_status: string | null;
  status: string | null;
  intake_date: string | null;
  school_name: string | null;
  year_level: string | null;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: string;
  address_line1: string;
  address_line2: string | null;
  suburb: string;
  state: string;
  postcode: string;
  country: string | null;
  address_type: string | null;
  is_current: boolean | null;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  alternative_phone: string | null;
  priority_order: number | null;
}

interface Guardian {
  id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  phone: string;
  email: string | null;
  is_primary: boolean | null;
  has_decision_authority: boolean | null;
}

interface MedicalInfo {
  participant_id: string;
  primary_diagnosis: string | null;
  secondary_diagnosis: string | null;
  medications: string | null;
  allergies: string | null;
  medicare_number: string | null;
  gp_name: string | null;
  gp_clinic: string | null;
  gp_phone: string | null;
  dietary_requirements: string | null;
  mobility_needs: string | null;
  communication_needs: string | null;
  sensory_sensitivities: string | null;
  behaviour_support_needs: string | null;
  therapy_providers: string | null;
  notes: string | null;
}

interface RiskInfo {
  participant_id: string;
  seizure_risk: boolean | null;
  seizure_protocol: string | null;
  choking_risk: boolean | null;
  choking_protocol: string | null;
  absconding_risk: boolean | null;
  absconding_details: string | null;
  behaviour_risks: string | null;
  environmental_risks: string | null;
  medication_risks: string | null;
  safety_plan: string | null;
  behaviour_support_plan_url: string | null;
  risk_assessment_date: string | null;
  next_review_date: string | null;
}

interface NDISPlan {
  id: string;
  participant_id: string;
  plan_number: string | null;
  plan_start: string;
  plan_end: string;
  plan_review_date: string | null;
  is_active: boolean | null;
  total_budget: number;
  plan_manager_type: string;
  plan_manager_name: string | null;
  plan_manager_email: string | null;
  plan_manager_contact: string | null;
  support_coordinator_name: string | null;
  support_coordinator_contact: string | null;
  support_coordination_level: string | null;
  notes: string | null;
}

interface BudgetCategory {
  id: string;
  plan_id: string;
  category: string;
  subcategory: string | null;
  allocated_amount: number;
  spent_amount: number | null;
  committed_amount: number | null;
  support_item_name: string | null;
  support_item_number: string | null;
}

interface Goal {
  id: string;
  goal_title: string;
  goal_description: string | null;
  goal_category: string | null;
  status: string | null;
  target_date: string | null;
  progress_notes: string | null;
}

interface ParticipantDocument {
  id: string;
  document_type: string;
  document_category: string | null;
  file_name: string;
  expiry_date: string | null;
  is_current: boolean | null;
  uploaded_at: string;
}

interface Consent {
  id: string;
  consent_type: string;
  consent_given: boolean | null;
  consent_date: string | null;
  consent_expiry_date: string | null;
  withdrawn_date: string | null;
}

interface ServiceBooking {
  id: string;
  service_type: string;
  service_date: string;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
  staff_member_name: string | null;
  service_location: string | null;
  amount_charged: number | null;
}

interface ServiceNote {
  id: string;
  note: string;
  note_type: string | null;
  created_by_name: string;
  created_at: string;
  is_sensitive: boolean | null;
}

interface IncidentReport {
  id: string;
  incident_type: string;
  incident_date: string;
  severity: string | null;
  description: string;
  action_taken: string | null;
  resolved_date: string | null;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ParticipantDetailClientProps {
  participant: Participant;
  addresses: Address[];
  emergencyContacts: EmergencyContact[];
  guardians: Guardian[];
  medicalInfo: MedicalInfo | null;
  riskInfo: RiskInfo | null;
  ndisPlans: NDISPlan[];
  activePlan: NDISPlan | null;
  budgetCategories: BudgetCategory[];
  goals: Goal[];
  documents: ParticipantDocument[];
  consents: Consent[];
  serviceBookings: ServiceBooking[];
  serviceNotes: ServiceNote[];
  incidentReports: IncidentReport[];
}

// ---------------------------------------------------------------------------
// Section nav definition
// ---------------------------------------------------------------------------
interface Section {
  id: string;
  label: string;
  icon: any;
  theme: SectionTheme;
}

const sections: Section[] = [
  { id: "personal",          label: "Personal Information",   icon: User,          theme: "blue" },
  { id: "contacts",          label: "Contacts & Guardians",   icon: Users,         theme: "purple" },
  { id: "medical",           label: "Medical Information",    icon: Heart,         theme: "red" },
  { id: "ndis-plan",         label: "NDIS Plan & Budget",     icon: DollarSign,    theme: "green" },
  { id: "goals",             label: "Goals",                  icon: Target,        theme: "orange" },
  { id: "risk",              label: "Risk & Safety",          icon: AlertTriangle, theme: "pink" },
  { id: "services",          label: "Service Bookings",       icon: Calendar,      theme: "indigo" },
  { id: "documents",         label: "Documents & Consents",   icon: FileText,      theme: "indigo" },
  { id: "notes",             label: "Service Notes",          icon: ClipboardList, theme: "purple" },
  { id: "incidents",         label: "Incident Reports",       icon: Shield,        theme: "red" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatDate = (d: string | null | undefined): string => {
  if (!d) return "-";
  const date = new Date(d);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatCurrency = (n: number | null | undefined): string =>
  n != null ? `$${n.toLocaleString("en-AU", { minimumFractionDigits: 2 })}` : "-";

const goalStatusColor = (s: string | null): string => {
  switch ((s ?? "").toLowerCase()) {
    case "achieved":  return "bg-green-100 text-green-700";
    case "in progress": return "bg-blue-100 text-blue-700";
    case "not started": return "bg-gray-100 text-gray-700";
    case "on hold":   return "bg-yellow-100 text-yellow-700";
    default:          return "bg-gray-100 text-gray-700";
  }
};

const severityColor = (s: string | null): string => {
  switch ((s ?? "").toLowerCase()) {
    case "low":    return "bg-green-100 text-green-700";
    case "medium": return "bg-yellow-100 text-yellow-700";
    case "high":   return "bg-orange-100 text-orange-700";
    case "critical": return "bg-red-100 text-red-700";
    default:       return "bg-gray-100 text-gray-700";
  }
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ParticipantDetailClient({
  participant,
  addresses,
  emergencyContacts,
  guardians,
  medicalInfo,
  riskInfo,
  ndisPlans,
  activePlan,
  budgetCategories,
  goals,
  documents,
  consents,
  serviceBookings,
  serviceNotes,
  incidentReports,
}: ParticipantDetailClientProps) {
  const router = useRouter();

  // ---- scroll nav state ----
  const [activeSection, setActiveSection] = useState("personal");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const contentRef = useRef<HTMLDivElement | null>(null);

  // ---- editable-section state (same pattern as EmployeeDetailClient) ----
  const [localParticipant, setLocalParticipant] = useState(participant);
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({});
  const [sectionDrafts, setSectionDrafts]       = useState<Record<string, Partial<Participant>>>({});
  const [savingSections, setSavingSections]     = useState<Record<string, boolean>>({});

  useEffect(() => { setLocalParticipant(participant); }, [participant]);

  const handleSectionEdit = (sectionId: string) => {
    setEditingSections(prev => ({ ...prev, [sectionId]: true }));
    setSectionDrafts(prev => ({ ...prev, [sectionId]: { ...localParticipant } }));
  };

  const handleSectionCancel = (sectionId: string) => {
    setEditingSections(prev => ({ ...prev, [sectionId]: false }));
    setSectionDrafts(prev => { const n = { ...prev }; delete n[sectionId]; return n; });
  };

  const handleSectionSave = async (sectionId: string) => {
    const draft = sectionDrafts[sectionId];
    if (!draft) return;
    setSavingSections(prev => ({ ...prev, [sectionId]: true }));
    try {
      const result = await updateParticipant(participant.id, draft as Record<string, unknown>);
      if (result.success) {
        setLocalParticipant(prev => ({ ...prev, ...draft }));
        setEditingSections(prev => ({ ...prev, [sectionId]: false }));
        setSectionDrafts(prev => { const n = { ...prev }; delete n[sectionId]; return n; });
        router.refresh();
      } else {
        alert(`Failed to save: ${result.error}`);
      }
    } catch (e) {
      console.error("Save error", e);
      alert("Failed to save changes");
    } finally {
      setSavingSections(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleFieldChange = (sectionId: string, field: keyof Participant, value: string) => {
    setSectionDrafts(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value },
    }));
  };

  const getSectionData = (sectionId: string): Partial<Participant> =>
    editingSections[sectionId] ? sectionDrafts[sectionId] || localParticipant : localParticipant;

  // ---- scroll spy ----
  useEffect(() => {
    const handleScroll = () => {
      const container = contentRef.current;
      if (!container) return;
      const scrollPosition = container.scrollTop + 200;
      for (const section of sections) {
        const el = sectionRefs.current[section.id];
        if (el) {
          const { offsetTop, offsetHeight } = el;
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
    const el = sectionRefs.current[sectionId];
    const container = contentRef.current;
    if (el && container) container.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" });
  };

  // ---- derived data for InfoLists ----
  const currentAddress = addresses.find(a => a.is_current) ?? addresses[0] ?? null;

  const emergencyContactItems: InfoListItem[] = emergencyContacts.map(ec => ({
    id: ec.id,
    primary: ec.name,
    secondary: ec.relationship,
    trailing: (
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{ec.phone}</p>
        {ec.alternative_phone && <p className="text-xs text-gray-500">{ec.alternative_phone}</p>}
      </div>
    ),
  }));

  const guardianItems: InfoListItem[] = guardians.map(g => ({
    id: g.id,
    primary: `${g.first_name} ${g.last_name}`,
    secondary: `${g.relationship}${g.is_primary ? " · Primary" : ""}${g.has_decision_authority ? " · Decision Authority" : ""}`,
    trailing: (
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{g.phone}</p>
        {g.email && <p className="text-xs text-gray-500">{g.email}</p>}
      </div>
    ),
  }));

  const documentItems: InfoListItem[] = documents.map(doc => ({
    id: doc.id,
    primary: doc.document_type,
    secondary: doc.document_category
      ? `${doc.document_category} · Uploaded ${formatDate(doc.uploaded_at)}`
      : `Uploaded ${formatDate(doc.uploaded_at)}`,
    status: doc.expiry_date
      ? new Date(doc.expiry_date) < new Date() ? "expired" : "valid"
      : undefined,
    icon: FileText,
    trailing: doc.expiry_date ? (
      <span className="text-xs text-gray-500">Expires {formatDate(doc.expiry_date)}</span>
    ) : undefined,
  }));

  const consentItems: InfoListItem[] = consents.map(c => ({
    id: c.id,
    primary: c.consent_type,
    secondary: c.consent_date ? `Dated ${formatDate(c.consent_date)}` : "No date",
    status: c.withdrawn_date
      ? "expired"
      : c.consent_given ? "valid" : "pending",
  }));

  const recentBookingItems: InfoListItem[] = serviceBookings.slice(0, 8).map(b => ({
    id: b.id,
    primary: b.service_type,
    secondary: `${formatDate(b.service_date)}${b.service_location ? ` · ${b.service_location}` : ""}${b.staff_member_name ? ` · ${b.staff_member_name}` : ""}`,
    trailing: (
      <div className="flex items-center gap-2">
        {b.amount_charged != null && <span className="text-sm text-gray-500">{formatCurrency(b.amount_charged)}</span>}
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          b.status === "Completed" ? "bg-green-100 text-green-700" :
          b.status === "Scheduled" ? "bg-blue-100 text-blue-700" :
          b.status === "Cancelled" ? "bg-red-100 text-red-700" :
          "bg-gray-100 text-gray-700"
        }`}>{b.status ?? "-"}</span>
      </div>
    ),
  }));

  // ---- budget summary for metric grid ----
  const totalAllocated   = budgetCategories.reduce((s, bc) => s + bc.allocated_amount, 0);
  const totalSpent       = budgetCategories.reduce((s, bc) => s + (bc.spent_amount ?? 0), 0);
  const totalCommitted   = budgetCategories.reduce((s, bc) => s + (bc.committed_amount ?? 0), 0);
  const budgetUsedPct    = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  // ---- budget category rows ----
  const budgetCategoryItems: InfoListItem[] = budgetCategories.map(bc => ({
    id: bc.id,
    primary: bc.category,
    secondary: bc.subcategory ?? "",
    trailing: (
      <div className="text-right space-y-0.5">
        <p className="text-sm font-semibold text-gray-900">
          {formatCurrency(bc.spent_amount)} <span className="text-gray-400 font-normal">/ {formatCurrency(bc.allocated_amount)}</span>
        </p>
        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              bc.allocated_amount > 0 && (bc.spent_amount ?? 0) / bc.allocated_amount > 0.85
                ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${bc.allocated_amount > 0 ? Math.min(((bc.spent_amount ?? 0) / bc.allocated_amount) * 100, 100) : 0}%` }}
          />
        </div>
      </div>
    ),
  }));

  // ---- risk booleans -> StatusCards ----
  const riskFlags = riskInfo ? [
    { label: "Seizure Risk",    flag: riskInfo.seizure_risk,    protocol: riskInfo.seizure_protocol },
    { label: "Choking Risk",    flag: riskInfo.choking_risk,    protocol: riskInfo.choking_protocol },
    { label: "Absconding Risk", flag: riskInfo.absconding_risk, protocol: riskInfo.absconding_details },
  ] : [];

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex overflow-hidden">
      <Sidebar currentPath="/participants" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ---- Header ---- */}
        <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/participants")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center ring-4 ring-blue-50">
                    <span className="text-xl font-bold text-blue-600">
                      {localParticipant.first_name.charAt(0)}{localParticipant.last_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {localParticipant.preferred_name || localParticipant.first_name} {localParticipant.last_name}
                    </h1>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-sm text-gray-500">NDIS {localParticipant.ndis_number}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        localParticipant.status === "Active"     ? "bg-green-100 text-green-700" :
                        localParticipant.status === "On Hold"    ? "bg-yellow-100 text-yellow-700" :
                        localParticipant.status === "Discharged" ? "bg-gray-100 text-gray-600" :
                        "bg-red-100 text-red-700"
                      }`}>{localParticipant.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ---- Layout: side nav + scrolling content ---- */}
        <div className="flex-1 flex overflow-hidden">
          {/* Side Navigation */}
          <aside className="w-64 flex-shrink-0 p-6 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sticky top-0">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-gray-600 hover:bg-gray-50"
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

              {/* ============================================================
                  1. PERSONAL INFORMATION  (editable)
                  ============================================================ */}
              <SectionCard
                id="personal"
                ref={(el) => { sectionRefs.current["personal"] = el; }}
                title="Personal Information"
                icon={User}
                theme="blue"
                editable
                isEditing={editingSections["personal"]}
                onEdit={() => handleSectionEdit("personal")}
                onSave={() => handleSectionSave("personal")}
                onCancel={() => handleSectionCancel("personal")}
                isSaving={savingSections["personal"]}
              >
                <DataGrid>
                  <SectionEditableField
                    label="First Name"        name="first_name"  theme="blue"
                    value={getSectionData("personal").first_name}
                    isEditing={editingSections["personal"]}
                    onChange={(v) => handleFieldChange("personal", "first_name", v)}
                  />
                  <SectionEditableField
                    label="Last Name"         name="last_name"   theme="blue"
                    value={getSectionData("personal").last_name}
                    isEditing={editingSections["personal"]}
                    onChange={(v) => handleFieldChange("personal", "last_name", v)}
                  />
                  <SectionEditableField
                    label="Preferred Name"    name="preferred_name" theme="blue"
                    value={getSectionData("personal").preferred_name}
                    isEditing={editingSections["personal"]}
                    onChange={(v) => handleFieldChange("personal", "preferred_name", v)}
                  />
                  <DataField label="Date of Birth" value={formatDate(localParticipant.date_of_birth)} theme="blue" />
                  <SectionEditableField
                    label="Gender"            name="gender" theme="blue" type="select"
                    options={[
                      { value: "", label: "Not specified" },
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Non-binary", label: "Non-binary" },
                      { value: "Other", label: "Other" },
                      { value: "Prefer not to say", label: "Prefer not to say" },
                    ]}
                    value={getSectionData("personal").gender}
                    isEditing={editingSections["personal"]}
                    onChange={(v) => handleFieldChange("personal", "gender", v)}
                  />
                  <SectionEditableField
                    label="Pronouns"          name="pronouns" theme="blue"
                    value={getSectionData("personal").pronouns}
                    isEditing={editingSections["personal"]}
                    onChange={(v) => handleFieldChange("personal", "pronouns", v)}
                  />
                  <SectionEditableField
                    label="Email"             name="email" theme="blue" type="email" icon={Mail}
                    value={getSectionData("personal").email}
                    isEditing={editingSections["personal"]}
                    onChange={(v) => handleFieldChange("personal", "email", v)}
                  />
                  <SectionEditableField
                    label="Phone"             name="phone" theme="blue" type="tel" icon={Phone}
                    value={getSectionData("personal").phone}
                    isEditing={editingSections["personal"]}
                    onChange={(v) => handleFieldChange("personal", "phone", v)}
                  />
                  <SectionEditableField
                    label="Indigenous Status" name="indigenous_status" theme="blue"
                    value={getSectionData("personal").indigenous_status}
                    isEditing={editingSections["personal"]}
                    onChange={(v) => handleFieldChange("personal", "indigenous_status", v)}
                  />
                  <SectionEditableField
                    label="Language"          name="language" theme="blue"
                    value={getSectionData("personal").language}
                    isEditing={editingSections["personal"]}
                    onChange={(v) => handleFieldChange("personal", "language", v)}
                  />
                </DataGrid>

                {/* Current address (read-only inline) */}
                {currentAddress && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Current Address</label>
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-base font-medium text-gray-900">
                        {currentAddress.address_line1}{currentAddress.address_line2 ? `, ${currentAddress.address_line2}` : ""}, {currentAddress.suburb} {currentAddress.state} {currentAddress.postcode}
                      </p>
                    </div>
                  </div>
                )}
              </SectionCard>

              {/* ============================================================
                  2. CONTACTS & GUARDIANS
                  ============================================================ */}
              <SectionCard
                id="contacts"
                ref={(el) => { sectionRefs.current["contacts"] = el; }}
                title="Contacts & Guardians"
                icon={Users}
                theme="purple"
              >
                {guardians.length > 0 && <InfoList title="Guardians / Legal Representatives" items={guardianItems} />}
                {emergencyContacts.length > 0 && <InfoList title="Emergency Contacts" items={emergencyContactItems} showDivider={guardians.length > 0} />}
                {guardians.length === 0 && emergencyContacts.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No contacts on file.</p>
                )}
              </SectionCard>

              {/* ============================================================
                  3. MEDICAL INFORMATION  (editable)
                  ============================================================ */}
              <SectionCard
                id="medical"
                ref={(el) => { sectionRefs.current["medical"] = el; }}
                title="Medical Information"
                icon={Heart}
                theme="red"
                editable
                isEditing={editingSections["medical"]}
                onEdit={() => handleSectionEdit("medical")}
                onSave={() => handleSectionSave("medical")}
                onCancel={() => handleSectionCancel("medical")}
                isSaving={savingSections["medical"]}
              >
                {medicalInfo ? (
                  <>
                    <DataGrid>
                      <DataField label="Primary Diagnosis"   value={medicalInfo.primary_diagnosis ?? "-"}   theme="red" />
                      <DataField label="Secondary Diagnosis" value={medicalInfo.secondary_diagnosis ?? "-"} theme="red" />
                      <DataField label="Medications"         value={medicalInfo.medications ?? "-"}         theme="red" />
                      <DataField label="Allergies"           value={medicalInfo.allergies ?? "-"}           theme="red" />
                      <DataField label="Medicare Number"     value={medicalInfo.medicare_number ?? "-"}     theme="red" />
                      <DataField label="Dietary Requirements" value={medicalInfo.dietary_requirements ?? "-"} theme="red" />
                    </DataGrid>

                    <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <DataField label="Mobility Needs"            value={medicalInfo.mobility_needs ?? "-"}            theme="red" />
                      <DataField label="Communication Needs"       value={medicalInfo.communication_needs ?? "-"}       theme="red" />
                      <DataField label="Sensory Sensitivities"     value={medicalInfo.sensory_sensitivities ?? "-"}     theme="red" />
                      <DataField label="Behaviour Support Needs"   value={medicalInfo.behaviour_support_needs ?? "-"}   theme="red" />
                      <DataField label="Therapy Providers"         value={medicalInfo.therapy_providers ?? "-"}         theme="red" />
                    </div>

                    {/* GP block */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-4">General Practitioner</h3>
                      <DataGrid>
                        <DataField label="GP Name"   value={medicalInfo.gp_name ?? "-"}  theme="red" />
                        <DataField label="Clinic"    value={medicalInfo.gp_clinic ?? "-"} theme="red" />
                        <DataField label="GP Phone"  value={medicalInfo.gp_phone ?? "-"}  theme="red" icon={Phone} />
                      </DataGrid>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">No medical information on file.</p>
                )}
              </SectionCard>

              {/* ============================================================
                  4. NDIS PLAN & BUDGET
                  ============================================================ */}
              <SectionCard
                id="ndis-plan"
                ref={(el) => { sectionRefs.current["ndis-plan"] = el; }}
                title="NDIS Plan & Budget"
                icon={DollarSign}
                theme="green"
              >
                {activePlan ? (
                  <>
                    <DataGrid>
                      <DataField label="Plan Number"        value={activePlan.plan_number ?? "-"}                                     theme="green" />
                      <DataField label="Plan Manager Type"  value={activePlan.plan_manager_type}                                     theme="green" />
                      <DataField label="Plan Start"         value={formatDate(activePlan.plan_start)}                                theme="green" />
                      <DataField label="Plan End"           value={formatDate(activePlan.plan_end)}                                  theme="green" />
                      <DataField label="Review Date"        value={formatDate(activePlan.plan_review_date)}                         theme="green" />
                      <DataField label="Total Budget"       value={formatCurrency(activePlan.total_budget)}                         theme="green" />
                    </DataGrid>

                    {/* Plan manager / support coordinator */}
                    {(activePlan.plan_manager_name || activePlan.support_coordinator_name) && (
                      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {activePlan.plan_manager_name && (
                          <>
                            <DataField label="Plan Manager"         value={activePlan.plan_manager_name}                          theme="green" />
                            <DataField label="Plan Manager Contact" value={activePlan.plan_manager_contact ?? activePlan.plan_manager_email ?? "-"} theme="green" />
                          </>
                        )}
                        {activePlan.support_coordinator_name && (
                          <>
                            <DataField label="Support Coordinator"         value={activePlan.support_coordinator_name}            theme="green" />
                            <DataField label="Support Coordinator Contact" value={activePlan.support_coordinator_contact ?? "-"}  theme="green" />
                          </>
                        )}
                      </div>
                    )}

                    {/* Budget summary metrics */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <ProgressBar value={budgetUsedPct} label="Budget Utilisation" />
                      <MetricGrid columns={3}>
                        <MetricCard icon={DollarSign}  value={formatCurrency(totalAllocated)}  label="Total Allocated"  theme="blue" />
                        <MetricCard icon={DollarSign}  value={formatCurrency(totalSpent)}      label="Total Spent"      theme="green" />
                        <MetricCard icon={DollarSign}  value={formatCurrency(totalCommitted)}  label="Total Committed"  theme="orange" />
                      </MetricGrid>
                    </div>

                    {/* Per-category breakdown */}
                    {budgetCategories.length > 0 && (
                      <InfoList title="Budget Breakdown" items={budgetCategoryItems} showDivider />
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">No active NDIS plan on file.</p>
                )}
              </SectionCard>

              {/* ============================================================
                  5. GOALS
                  ============================================================ */}
              <SectionCard
                id="goals"
                ref={(el) => { sectionRefs.current["goals"] = el; }}
                title="Goals"
                icon={Target}
                theme="orange"
              >
                {goals.length > 0 ? (
                  <div className="space-y-3">
                    {goals.map(g => (
                      <div key={g.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-gray-900">{g.goal_title}</p>
                            {g.goal_category && <p className="text-xs text-gray-500 mt-0.5">{g.goal_category}</p>}
                            {g.goal_description && <p className="text-sm text-gray-600 mt-1">{g.goal_description}</p>}
                            {g.progress_notes && <p className="text-sm text-gray-500 mt-1 italic">Progress: {g.progress_notes}</p>}
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${goalStatusColor(g.status)}`}>
                              {g.status ?? "Not started"}
                            </span>
                            {g.target_date && <span className="text-xs text-gray-500">Target: {formatDate(g.target_date)}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No goals on file.</p>
                )}
              </SectionCard>

              {/* ============================================================
                  6. RISK & SAFETY
                  ============================================================ */}
              <SectionCard
                id="risk"
                ref={(el) => { sectionRefs.current["risk"] = el; }}
                title="Risk & Safety"
                icon={AlertTriangle}
                theme="pink"
              >
                {riskInfo ? (
                  <>
                    {/* Boolean risk flags as StatusCards */}
                    <StatusCardList>
                      {riskFlags.map((rf) => (
                        <StatusCard
                          key={rf.label}
                          icon={AlertTriangle}
                          title={rf.label}
                          status={rf.flag ? "⚠️ Yes" : "✔️ No"}
                          description={rf.protocol ?? "No protocol on file."}
                          theme={rf.flag ? "red" : "green"}
                        />
                      ))}
                    </StatusCardList>

                    <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <DataField label="Behaviour Risks"       value={riskInfo.behaviour_risks ?? "-"}       theme="pink" />
                      <DataField label="Environmental Risks"   value={riskInfo.environmental_risks ?? "-"}   theme="pink" />
                      <DataField label="Medication Risks"      value={riskInfo.medication_risks ?? "-"}      theme="pink" />
                      <DataField label="Safety Plan"           value={riskInfo.safety_plan ?? "-"}           theme="pink" />
                      <DataField label="Risk Assessment Date"  value={formatDate(riskInfo.risk_assessment_date)} theme="pink" />
                      <DataField label="Next Review Date"      value={formatDate(riskInfo.next_review_date)}    theme="pink" />
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">No risk information on file.</p>
                )}
              </SectionCard>

              {/* ============================================================
                  7. SERVICE BOOKINGS
                  ============================================================ */}
              <SectionCard
                id="services"
                ref={(el) => { sectionRefs.current["services"] = el; }}
                title="Service Bookings"
                icon={Calendar}
                theme="indigo"
              >
                {serviceBookings.length > 0 ? (
                  <>
                    <MetricGrid columns={3}>
                      <MetricCard icon={Calendar}     value={serviceBookings.length}                                                               label="Total Bookings"  theme="blue" />
                      <MetricCard icon={Calendar}     value={serviceBookings.filter(b => b.status === "Completed").length}                        label="Completed"       theme="green" />
                      <MetricCard icon={Calendar}     value={serviceBookings.filter(b => b.status === "Scheduled").length}                        label="Upcoming"        theme="purple" />
                    </MetricGrid>
                    <InfoList items={recentBookingItems} title="Recent Bookings" />
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">No service bookings on file.</p>
                )}
              </SectionCard>

              {/* ============================================================
                  8. DOCUMENTS & CONSENTS
                  ============================================================ */}
              <SectionCard
                id="documents"
                ref={(el) => { sectionRefs.current["documents"] = el; }}
                title="Documents & Consents"
                icon={FileText}
                theme="indigo"
              >
                {documents.length > 0 && <InfoList title="Documents" items={documentItems} />}
                {consents.length > 0  && <InfoList title="Consents"  items={consentItems}  showDivider={documents.length > 0} />}
                {documents.length === 0 && consents.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No documents or consents on file.</p>
                )}
              </SectionCard>

              {/* ============================================================
                  9. SERVICE NOTES
                  ============================================================ */}
              <SectionCard
                id="notes"
                ref={(el) => { sectionRefs.current["notes"] = el; }}
                title="Service Notes"
                icon={ClipboardList}
                theme="purple"
              >
                {serviceNotes.length > 0 ? (
                  <div className="space-y-3">
                    {serviceNotes.map(note => (
                      <div key={note.id} className={`p-4 rounded-xl border ${note.is_sensitive ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            {note.is_sensitive && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold mb-1">
                                <Shield className="w-3 h-3" /> Sensitive
                              </span>
                            )}
                            <p className="text-sm text-gray-800">{note.note}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            {note.note_type && <p className="text-xs font-semibold text-gray-500">{note.note_type}</p>}
                            <p className="text-xs text-gray-400">{formatDate(note.created_at)} · {note.created_by_name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No service notes on file.</p>
                )}
              </SectionCard>

              {/* ============================================================
                  10. INCIDENT REPORTS
                  ============================================================ */}
              <SectionCard
                id="incidents"
                ref={(el) => { sectionRefs.current["incidents"] = el; }}
                title="Incident Reports"
                icon={Shield}
                theme="red"
              >
                {incidentReports.length > 0 ? (
                  <div className="space-y-3">
                    {incidentReports.map(inc => (
                      <div key={inc.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{inc.incident_type}</p>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severityColor(inc.severity)}`}>
                                {inc.severity ?? "Unknown"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{inc.description}</p>
                            {inc.action_taken && <p className="text-sm text-gray-500 mt-1 italic">Action: {inc.action_taken}</p>}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-gray-500">{formatDate(inc.incident_date)}</p>
                            {inc.resolved_date && <p className="text-xs text-green-600 font-medium">Resolved {formatDate(inc.resolved_date)}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <StatusCard
                      icon={Shield}
                      title="No Incidents"
                      status="Clean record"
                      description="No incident reports have been filed for this participant."
                      theme="green"
                    />
                  </div>
                )}
              </SectionCard>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

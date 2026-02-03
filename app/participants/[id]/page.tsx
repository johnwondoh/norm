import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ParticipantDetailClient } from "./ParticipantDetailClient";
import Loading from "@/app/participants/loading";

interface ParticipantPageProps {
  params: Promise<{ id: string }>;
}

async function ParticipantDetailData({ params }: ParticipantPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch participant + all related data in parallel
  const [
    participantRes,
    addressesRes,
    emergencyContactsRes,
    guardiansRes,
    medicalInfoRes,
    riskInfoRes,
    ndisPlansRes,
    budgetCategoriesRes,
    goalsRes,
    documentsRes,
    consentsRes,
    serviceBookingsRes,
    serviceNotesRes,
    incidentReportsRes,
  ] = await Promise.all([
    supabase.from("participants").select().eq("id", id).single(),
    supabase.from("addresses").select().eq("participant_id", id).order("is_current", { ascending: false }),
    supabase.from("emergency_contacts").select().eq("participant_id", id).order("priority_order", { ascending: true }),
    supabase.from("guardians").select().eq("participant_id", id).order("is_primary", { ascending: false }),
    supabase.from("medical_info").select().eq("participant_id", id).single(),
    supabase.from("risk_info").select().eq("participant_id", id).single(),
    supabase.from("ndis_plans").select().eq("participant_id", id).order("plan_start", { ascending: false }),
    supabase.from("budget_categories").select(),  // filtered client-side by active plan
    supabase.from("participant_goals").select().eq("participant_id", id).order("created_at", { ascending: false }),
    supabase.from("participant_documents").select().eq("participant_id", id).order("uploaded_at", { ascending: false }),
    supabase.from("consents").select().eq("participant_id", id).order("consent_date", { ascending: false }),
    supabase.from("service_bookings").select().eq("participant_id", id).order("service_date", { ascending: false }).limit(20),
    supabase.from("service_notes").select().eq("participant_id", id).order("created_at", { ascending: false }).limit(15),
    supabase.from("incident_reports").select().eq("participant_id", id).order("incident_date", { ascending: false }),
  ]);

  if (participantRes.error || !participantRes.data) {
    console.error("Error fetching participant:", participantRes.error);
    return <div className="p-8 text-red-600">Participant not found.</div>;
  }

  // Filter budget_categories to only the active plan
  const activePlan = ndisPlansRes.data?.find((p: any) => p.is_active) ?? null;
  const budgetCategories = activePlan
    ? (budgetCategoriesRes.data ?? []).filter((bc: any) => bc.plan_id === activePlan.id)
    : [];

  return (
    <ParticipantDetailClient
      participant={participantRes.data}
      addresses={addressesRes.data ?? []}
      emergencyContacts={emergencyContactsRes.data ?? []}
      guardians={guardiansRes.data ?? []}
      medicalInfo={medicalInfoRes.data ?? null}
      riskInfo={riskInfoRes.data ?? null}
      ndisPlans={ndisPlansRes.data ?? []}
      activePlan={activePlan}
      budgetCategories={budgetCategories}
      goals={goalsRes.data ?? []}
      documents={documentsRes.data ?? []}
      consents={consentsRes.data ?? []}
      serviceBookings={serviceBookingsRes.data ?? []}
      serviceNotes={serviceNotesRes.data ?? []}
      incidentReports={incidentReportsRes.data ?? []}
    />
  );
}

export default function ParticipantDetailPage({ params }: ParticipantPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <ParticipantDetailData params={params} />
    </Suspense>
  );
}

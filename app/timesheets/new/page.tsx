import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import NewTimesheetClient from "./NewTimesheetClient";

export default async function NewTimesheetPage() {
  const supabase = await createClient();

  // Fetch bookings that don't have timesheets yet
  const { data: bookings, error: bookingsError } = await supabase
    .from("service_bookings")
    .select(`
      *,
      participant:participants(id, first_name, last_name),
      staff_member:employees!service_bookings_staff_member_id_fkey(id, first_name, last_name)
    `)
    .eq("status", "Scheduled")
    .order("service_date", { ascending: false });

  // Fetch all employees
  const { data: employees, error: employeesError } = await supabase
    .from("employees")
    .select("id, first_name, last_name, employment_status")
    .eq("employment_status", "Active")
    .order("first_name");

  // Fetch all participants
  const { data: participants, error: participantsError } = await supabase
    .from("participants")
    .select("id, first_name, last_name, status")
    .eq("status", "Active")
    .order("first_name");

  if (bookingsError || employeesError || participantsError) {
    const error = bookingsError || employeesError || participantsError;
    console.error("Error fetching data:", error);
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p className="font-semibold">Error loading data</p>
          <p className="text-sm mt-1">{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        }
      >
        <NewTimesheetClient
          bookings={bookings || []}
          employees={employees || []}
          participants={participants || []}
        />
      </Suspense>
    </div>
  );
}

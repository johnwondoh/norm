import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import TimesheetsClient from "./TimesheetsClient";
import { Database } from "@/types/supabase";

type Timesheet = Database["public"]["Tables"]["timesheets"]["Row"];

export default async function TimesheetsPage() {
  const supabase = await createClient();

  const { data: timesheets, error } = await supabase
    .from("timesheets")
    .select(`
      *,
      participant:participants(id, first_name, last_name),
      employee:employees(id, first_name, last_name),
      service_booking:service_bookings(id, service_type, service_location)
    `)
    .order("scheduled_date", { ascending: false });

  if (error) {
    console.error("Error fetching timesheets:", error);
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p className="font-semibold">Error loading timesheets</p>
          <p className="text-sm mt-1">{error.message}</p>
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
        <TimesheetsClient initialTimesheets={timesheets || []} />
      </Suspense>
    </div>
  );
}

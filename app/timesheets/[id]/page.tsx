import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TimesheetDetailClient from "./TimesheetDetailClient";

export default async function TimesheetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: timesheet, error } = await supabase
    .from("timesheets")
    .select(`
      *,
      participant:participants(id, first_name, last_name, ndis_number),
      employee:employees(id, first_name, last_name, email, phone),
      service_booking:service_bookings(id, service_type, service_location, status),
      submitted_by_employee:employees!timesheets_submitted_by_fkey(id, first_name, last_name),
      approved_by_employee:employees!timesheets_approved_by_fkey(id, first_name, last_name),
      rejected_by_employee:employees!timesheets_rejected_by_fkey(id, first_name, last_name)
    `)
    .eq("id", params.id)
    .single();

  if (error || !timesheet) {
    notFound();
  }

  // Fetch attachments
  const { data: attachments } = await supabase
    .from("timesheet_attachments")
    .select("*")
    .eq("timesheet_id", params.id)
    .order("uploaded_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        }
      >
        <TimesheetDetailClient
          timesheet={timesheet}
          attachments={attachments || []}
        />
      </Suspense>
    </div>
  );
}

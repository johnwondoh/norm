import { Suspense, cache } from "react";
import { createClient } from "@/lib/supabase/server";
import NewTimesheetClient from "./NewTimesheetClient";

// Represents one employee-shift row to display in the list
export type EmployeeShift = {
  // Booking details
  bookingId: string;
  serviceDate: string;
  startTime: string | null;
  endTime: string | null;
  serviceType: string;
  serviceLocation: string | null;
  bookingNotes: string | null;
  bookingStatus: string | null;
  // Employee details
  employeeId: number;
  employeeFirstName: string;
  employeeLastName: string;
  employeeRole: "primary" | "backup";
  // Participant details
  participantId: string;
  participantFirstName: string;
  participantLastName: string;
  // Rate info from schedule
  hourlyRate: number | null;
};

const getNewTimesheetData = cache(async () => {
  const supabase = await createClient();

  // Fetch completed/past bookings with participant + schedule (for backup staff + rates)
  const { data: bookings, error: bookingsError } = await supabase
    .from("service_bookings")
    .select(`
      id,
      service_date,
      start_time,
      end_time,
      service_type,
      service_location,
      booking_notes,
      notes,
      status,
      staff_member_id,
      participant_id,
      schedule_id,
      participant:participants(id, first_name, last_name),
      schedule:service_schedules(
        id,
        preferred_staff_id,
        backup_staff_id,
        hourly_rate
      )
    `)
    .not("staff_member_id", "is", null)
    .in("status", ["Completed", "Scheduled"])
    .order("service_date", { ascending: false });

  if (bookingsError) {
    return { employeeShifts: [], employees: [], error: bookingsError };
  }

  // Fetch all employees to resolve names
  const { data: employees, error: employeesError } = await supabase
    .from("employees")
    .select("id, first_name, last_name, role")
    .order("first_name");

  if (employeesError) {
    return { employeeShifts: [], employees: [], error: employeesError };
  }

  // Fetch existing timesheets to know which (booking, employee) combos already exist
  const { data: existingTimesheets, error: timesheetsError } = await supabase
    .from("timesheets")
    .select("service_booking_id, employee_id");

  if (timesheetsError) {
    return { employeeShifts: [], employees: [], error: timesheetsError };
  }

  // Build a set of "bookingId:employeeId" that already have timesheets
  const existingSet = new Set(
    (existingTimesheets || []).map(
      (t) => `${t.service_booking_id}:${t.employee_id}`
    )
  );

  const employeeMap = new Map(employees?.map((e) => [e.id, e]) || []);

  const employeeShifts: EmployeeShift[] = [];

  for (const booking of bookings || []) {
    const participant = Array.isArray(booking.participant)
      ? booking.participant[0]
      : booking.participant;
    const schedule = Array.isArray(booking.schedule)
      ? booking.schedule[0]
      : booking.schedule;

    if (!participant) continue;

    const hourlyRate = schedule?.hourly_rate ?? null;

    // Primary staff member from the booking itself
    if (booking.staff_member_id) {
      const empId = parseInt(booking.staff_member_id);
      const emp = employeeMap.get(empId);
      if (emp && !existingSet.has(`${booking.id}:${empId}`)) {
        employeeShifts.push({
          bookingId: booking.id,
          serviceDate: booking.service_date,
          startTime: booking.start_time,
          endTime: booking.end_time,
          serviceType: booking.service_type,
          serviceLocation: booking.service_location,
          bookingNotes: booking.booking_notes || booking.notes,
          bookingStatus: booking.status,
          employeeId: empId,
          employeeFirstName: emp.first_name ?? "",
          employeeLastName: emp.last_name ?? "",
          employeeRole: "primary",
          participantId: participant.id,
          participantFirstName: participant.first_name,
          participantLastName: participant.last_name,
          hourlyRate,
        });
      }
    }

    // Backup staff from the linked schedule (if different from primary)
    if (
      schedule?.backup_staff_id &&
      schedule.backup_staff_id !== parseInt(booking.staff_member_id ?? "0")
    ) {
      const backupId = schedule.backup_staff_id;
      const backupEmp = employeeMap.get(backupId);
      if (backupEmp && !existingSet.has(`${booking.id}:${backupId}`)) {
        employeeShifts.push({
          bookingId: booking.id,
          serviceDate: booking.service_date,
          startTime: booking.start_time,
          endTime: booking.end_time,
          serviceType: booking.service_type,
          serviceLocation: booking.service_location,
          bookingNotes: booking.booking_notes || booking.notes,
          bookingStatus: booking.status,
          employeeId: backupId,
          employeeFirstName: backupEmp.first_name ?? "",
          employeeLastName: backupEmp.last_name ?? "",
          employeeRole: "backup",
          participantId: participant.id,
          participantFirstName: participant.first_name,
          participantLastName: participant.last_name,
          hourlyRate,
        });
      }
    }
  }

  return { employeeShifts, employees: employees || [], error: null };
});

async function NewTimesheetContent() {
  const { employeeShifts, employees, error } = await getNewTimesheetData();

  if (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p className="font-semibold">Error loading data</p>
          <p className="text-sm mt-1">{(error as { message?: string })?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <NewTimesheetClient
      employeeShifts={employeeShifts}
      employees={employees}
    />
  );
}

export default async function NewTimesheetPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      }
    >
      <NewTimesheetContent />
    </Suspense>
  );
}

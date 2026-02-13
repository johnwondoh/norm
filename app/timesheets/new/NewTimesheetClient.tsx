"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, AlertCircle } from "lucide-react";
import { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ServiceBooking = Database["public"]["Tables"]["service_bookings"]["Row"] & {
  participant?: { id: string; first_name: string; last_name: string } | null;
  staff_member?: { id: string; first_name: string; last_name: string } | null;
};

type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Participant = Database["public"]["Tables"]["participants"]["Row"];

interface NewTimesheetClientProps {
  bookings: ServiceBooking[];
  employees: Employee[];
  participants: Participant[];
}

export default function NewTimesheetClient({
  bookings,
  employees,
  participants,
}: NewTimesheetClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>("");
  const [serviceType, setServiceType] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledStartTime, setScheduledStartTime] = useState("");
  const [scheduledEndTime, setScheduledEndTime] = useState("");
  const [actualStartTime, setActualStartTime] = useState("");
  const [actualEndTime, setActualEndTime] = useState("");
  const [breakMinutes, setBreakMinutes] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [overtimeRate, setOvertimeRate] = useState(0);
  const [travelDistanceKm, setTravelDistanceKm] = useState<number | null>(null);
  const [mileageRatePerKm, setMileageRatePerKm] = useState<number | null>(null);
  const [serviceNotes, setServiceNotes] = useState("");
  const [tasksCompleted, setTasksCompleted] = useState("");
  const [incidentOccurred, setIncidentOccurred] = useState(false);

  // Auto-fill when booking is selected
  useEffect(() => {
    if (selectedBookingId) {
      const booking = bookings.find((b) => b.id === selectedBookingId);
      if (booking) {
        setSelectedEmployeeId(booking.staff_member_id || null);
        setSelectedParticipantId(booking.participant_id || "");
        setServiceType(booking.service_type || "");
        setServiceLocation(booking.service_location || "");
        setScheduledDate(booking.service_date || "");
        setScheduledStartTime(booking.start_time || "");
        setScheduledEndTime(booking.end_time || "");
        // Pre-fill actual times with scheduled times (can be edited)
        const startDateTime = `${booking.service_date}T${booking.start_time}`;
        const endDateTime = `${booking.service_date}T${booking.end_time}`;
        setActualStartTime(startDateTime);
        setActualEndTime(endDateTime);
      }
    }
  }, [selectedBookingId, bookings]);

  const handleSubmit = async (e: React.FormEvent, submitForApproval: boolean = false) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!selectedEmployeeId || !selectedParticipantId || !serviceType) {
        throw new Error("Please fill in all required fields");
      }

      if (!actualStartTime || !actualEndTime) {
        throw new Error("Please enter actual start and end times");
      }

      // Calculate scheduled hours
      const scheduledStart = new Date(`${scheduledDate}T${scheduledStartTime}`);
      const scheduledEnd = new Date(`${scheduledDate}T${scheduledEndTime}`);
      const scheduledHours = (scheduledEnd.getTime() - scheduledStart.getTime()) / (1000 * 60 * 60);

      const timesheetData: Database["public"]["Tables"]["timesheets"]["Insert"] = {
        organisation_id: "", // Will be set by trigger
        service_booking_id: selectedBookingId || "",
        participant_id: selectedParticipantId,
        employee_id: selectedEmployeeId,
        scheduled_date: scheduledDate,
        scheduled_start_time: scheduledStartTime,
        scheduled_end_time: scheduledEndTime,
        scheduled_hours: scheduledHours,
        actual_start_time: actualStartTime,
        actual_end_time: actualEndTime,
        break_minutes: breakMinutes,
        hourly_rate: hourlyRate,
        overtime_rate: overtimeRate || hourlyRate * 1.5,
        service_type: serviceType,
        service_location: serviceLocation || null,
        service_notes: serviceNotes || null,
        tasks_completed: tasksCompleted || null,
        incident_occurred: incidentOccurred,
        travel_distance_km: travelDistanceKm,
        mileage_rate_per_km: mileageRatePerKm,
        status: submitForApproval ? "submitted" : "draft",
      };

      const response = await fetch("/api/timesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timesheetData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create timesheet");
      }

      // If incident occurred, redirect to create incident report
      if (incidentOccurred) {
        router.push(`/incident-reports/new?timesheet_id=${result.timesheet.id}`);
      } else {
        router.push("/timesheets");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/timesheets")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Timesheets
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Timesheet</h1>
            <p className="text-sm text-gray-600 mt-1">
              Create a new timesheet entry for a service booking
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className="space-y-6">
          {/* Service Booking Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Service Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="booking">Select Service Booking (Optional)</Label>
                <select
                  id="booking"
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Manual Entry (No Booking)</option>
                  {bookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.service_date} - {booking.service_type} -{" "}
                      {booking.participant?.first_name} {booking.participant?.last_name} -{" "}
                      {booking.staff_member?.first_name} {booking.staff_member?.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employee">Employee *</Label>
                  <select
                    id="employee"
                    value={selectedEmployeeId || ""}
                    onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
                    className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="participant">Participant *</Label>
                  <select
                    id="participant"
                    value={selectedParticipantId}
                    onChange={(e) => setSelectedParticipantId(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Participant</option>
                    {participants.map((part) => (
                      <option key={part.id} value={part.id}>
                        {part.first_name} {part.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Input
                    id="serviceType"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    placeholder="e.g., Personal Care, Community Access"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="serviceLocation">Service Location</Label>
                  <Input
                    id="serviceLocation"
                    value={serviceLocation}
                    onChange={(e) => setServiceLocation(e.target.value)}
                    placeholder="Location where service was provided"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Time */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="scheduledDate">Date *</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="scheduledStartTime">Start Time *</Label>
                  <Input
                    id="scheduledStartTime"
                    type="time"
                    value={scheduledStartTime}
                    onChange={(e) => setScheduledStartTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="scheduledEndTime">End Time *</Label>
                  <Input
                    id="scheduledEndTime"
                    type="time"
                    value={scheduledEndTime}
                    onChange={(e) => setScheduledEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actual Time Worked */}
          <Card>
            <CardHeader>
              <CardTitle>Actual Time Worked</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="actualStartTime">Actual Start *</Label>
                  <Input
                    id="actualStartTime"
                    type="datetime-local"
                    value={actualStartTime}
                    onChange={(e) => setActualStartTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="actualEndTime">Actual End *</Label>
                  <Input
                    id="actualEndTime"
                    type="datetime-local"
                    value={actualEndTime}
                    onChange={(e) => setActualEndTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="breakMinutes">Break (minutes)</Label>
                  <Input
                    id="breakMinutes"
                    type="number"
                    min="0"
                    value={breakMinutes}
                    onChange={(e) => setBreakMinutes(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rates */}
          <Card>
            <CardHeader>
              <CardTitle>Rates & Travel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="overtimeRate">Overtime Rate ($)</Label>
                  <Input
                    id="overtimeRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={overtimeRate}
                    onChange={(e) => setOvertimeRate(Number(e.target.value))}
                    placeholder={`Default: ${(hourlyRate * 1.5).toFixed(2)}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="travelDistance">Travel Distance (km)</Label>
                  <Input
                    id="travelDistance"
                    type="number"
                    step="0.1"
                    min="0"
                    value={travelDistanceKm || ""}
                    onChange={(e) => setTravelDistanceKm(e.target.value ? Number(e.target.value) : null)}
                  />
                </div>

                <div>
                  <Label htmlFor="mileageRate">Mileage Rate ($/km)</Label>
                  <Input
                    id="mileageRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={mileageRatePerKm || ""}
                    onChange={(e) => setMileageRatePerKm(e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes & Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tasksCompleted">Tasks Completed</Label>
                <Textarea
                  id="tasksCompleted"
                  value={tasksCompleted}
                  onChange={(e) => setTasksCompleted(e.target.value)}
                  placeholder="List tasks that were completed during this shift"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="serviceNotes">Service Notes</Label>
                <Textarea
                  id="serviceNotes"
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  placeholder="Any additional notes about the service"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="incidentOccurred"
                  checked={incidentOccurred}
                  onCheckedChange={(checked) => setIncidentOccurred(checked as boolean)}
                />
                <Label htmlFor="incidentOccurred" className="text-sm font-normal cursor-pointer">
                  An incident occurred during this shift (you will be prompted to create an incident report)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/timesheets")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit for Approval"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

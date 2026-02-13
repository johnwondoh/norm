"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  Edit2,
  Send,
  AlertCircle,
} from "lucide-react";
import { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Timesheet = Database["public"]["Tables"]["timesheets"]["Row"] & {
  participant?: { id: string; first_name: string; last_name: string; ndis_number: string | null } | null;
  employee?: { id: string; first_name: string; last_name: string; email: string | null; phone: string | null } | null;
  service_booking?: { id: string; service_type: string; service_location: string | null; status: string | null } | null;
  submitted_by_employee?: { id: string; first_name: string; last_name: string } | null;
  approved_by_employee?: { id: string; first_name: string; last_name: string } | null;
  rejected_by_employee?: { id: string; first_name: string; last_name: string } | null;
};

type TimesheetAttachment = Database["public"]["Tables"]["timesheet_attachments"]["Row"];

interface TimesheetDetailClientProps {
  timesheet: Timesheet;
  attachments: TimesheetAttachment[];
}

export default function TimesheetDetailClient({
  timesheet,
  attachments,
}: TimesheetDetailClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string | null): string => {
    if (!timeString) return "-";
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateTime = (dateTimeString: string | null): string => {
    if (!dateTimeString) return "-";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status: string | null) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }
    > = {
      draft: { label: "Draft", variant: "secondary" },
      submitted: { label: "Submitted", variant: "info" },
      approved: { label: "Approved", variant: "success" },
      rejected: { label: "Rejected", variant: "destructive" },
      paid: { label: "Paid", variant: "success" },
    };

    const config = status ? statusConfig[status] : { label: "Unknown", variant: "outline" as const };
    return (
      <Badge variant={config.variant} className="text-sm px-3 py-1">
        {config.label}
      </Badge>
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/timesheets/${timesheet.id}/submit`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit timesheet");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/timesheets/${timesheet.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: approvalNotes }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to approve timesheet");
      }

      setShowApprovalDialog(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/timesheets/${timesheet.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reject timesheet");
      }

      setShowRejectionDialog(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const canEdit = timesheet.status === "draft" || timesheet.status === "rejected";
  const canSubmit = timesheet.status === "draft" || timesheet.status === "rejected";
  const canApprove = timesheet.status === "submitted";
  const canReject = timesheet.status === "submitted";

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/timesheets")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Timesheets
        </Button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Timesheet Details</h1>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(timesheet.scheduled_date)} - {timesheet.service_type}
              </p>
            </div>
          </div>
          <div>{getStatusBadge(timesheet.status)}</div>
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

      {timesheet.incident_occurred && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Incident Reported</p>
            <p className="text-sm mt-1">
              An incident was reported during this shift. Please review any associated incident reports.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3">
        {canEdit && (
          <Button
            variant="outline"
            onClick={() => router.push(`/timesheets/${timesheet.id}/edit`)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        {canSubmit && (
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? "Submitting..." : "Submit for Approval"}
          </Button>
        )}
        {canApprove && (
          <Button
            onClick={() => setShowApprovalDialog(true)}
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve
          </Button>
        )}
        {canReject && (
          <Button
            onClick={() => setShowRejectionDialog(true)}
            variant="destructive"
            disabled={isLoading}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* People Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                People
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Employee</p>
                  <p className="text-lg font-semibold">
                    {timesheet.employee
                      ? `${timesheet.employee.first_name} ${timesheet.employee.last_name}`
                      : "-"}
                  </p>
                  {timesheet.employee?.email && (
                    <p className="text-sm text-gray-600">{timesheet.employee.email}</p>
                  )}
                  {timesheet.employee?.phone && (
                    <p className="text-sm text-gray-600">{timesheet.employee.phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Participant</p>
                  <p className="text-lg font-semibold">
                    {timesheet.participant
                      ? `${timesheet.participant.first_name} ${timesheet.participant.last_name}`
                      : "-"}
                  </p>
                  {timesheet.participant?.ndis_number && (
                    <p className="text-sm text-gray-600">NDIS: {timesheet.participant.ndis_number}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Service Type</p>
                <p className="text-base">{timesheet.service_type}</p>
              </div>
              {timesheet.service_location && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-base">{timesheet.service_location}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Time Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Scheduled</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-base">{formatDate(timesheet.scheduled_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="text-base">
                        {timesheet.scheduled_start_time} - {timesheet.scheduled_end_time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hours</p>
                      <p className="text-base font-semibold">
                        {Number(timesheet.scheduled_hours).toFixed(2)} hrs
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Actual</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Start</p>
                      <p className="text-base">{formatDateTime(timesheet.actual_start_time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End</p>
                      <p className="text-base">{formatDateTime(timesheet.actual_end_time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Break</p>
                      <p className="text-base">{timesheet.break_minutes || 0} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Billable Hours</p>
                      <p className="text-base font-semibold text-blue-600">
                        {Number(timesheet.billable_hours || 0).toFixed(2)} hrs
                      </p>
                    </div>
                    {Number(timesheet.overtime_hours || 0) > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">Overtime Hours</p>
                        <p className="text-base font-semibold text-orange-600">
                          {Number(timesheet.overtime_hours || 0).toFixed(2)} hrs
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks and Notes */}
          {(timesheet.tasks_completed || timesheet.service_notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {timesheet.tasks_completed && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Tasks Completed</p>
                    <p className="text-base whitespace-pre-wrap">{timesheet.tasks_completed}</p>
                  </div>
                )}
                {timesheet.service_notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Service Notes</p>
                    <p className="text-base whitespace-pre-wrap">{timesheet.service_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hourly Rate:</span>
                <span className="font-semibold">${Number(timesheet.hourly_rate).toFixed(2)}</span>
              </div>
              {timesheet.overtime_rate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overtime Rate:</span>
                  <span className="font-semibold">${Number(timesheet.overtime_rate).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Regular Amount:</span>
                <span className="font-semibold">${Number(timesheet.regular_amount || 0).toFixed(2)}</span>
              </div>
              {Number(timesheet.overtime_amount || 0) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overtime Amount:</span>
                  <span className="font-semibold text-orange-600">
                    ${Number(timesheet.overtime_amount || 0).toFixed(2)}
                  </span>
                </div>
              )}
              {Number(timesheet.mileage_amount || 0) > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Travel Distance:</span>
                    <span className="font-semibold">{Number(timesheet.travel_distance_km || 0).toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mileage Amount:</span>
                    <span className="font-semibold">${Number(timesheet.mileage_amount || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold">Total Amount:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${Number(timesheet.total_amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Status */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {timesheet.submitted_at && (
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="text-sm">{formatDateTime(timesheet.submitted_at)}</p>
                  {timesheet.submitted_by_employee && (
                    <p className="text-xs text-gray-600">
                      by {timesheet.submitted_by_employee.first_name} {timesheet.submitted_by_employee.last_name}
                    </p>
                  )}
                </div>
              )}
              {timesheet.approved_at && (
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-sm">{formatDateTime(timesheet.approved_at)}</p>
                  {timesheet.approved_by_employee && (
                    <p className="text-xs text-gray-600">
                      by {timesheet.approved_by_employee.first_name} {timesheet.approved_by_employee.last_name}
                    </p>
                  )}
                  {timesheet.approval_notes && (
                    <p className="text-xs text-gray-600 mt-1 italic">"{timesheet.approval_notes}"</p>
                  )}
                </div>
              )}
              {timesheet.rejected_at && (
                <div>
                  <p className="text-sm text-gray-500">Rejected</p>
                  <p className="text-sm">{formatDateTime(timesheet.rejected_at)}</p>
                  {timesheet.rejected_by_employee && (
                    <p className="text-xs text-gray-600">
                      by {timesheet.rejected_by_employee.first_name} {timesheet.rejected_by_employee.last_name}
                    </p>
                  )}
                  {timesheet.rejection_reason && (
                    <p className="text-xs text-red-600 mt-1 italic">"{timesheet.rejection_reason}"</p>
                  )}
                </div>
              )}
              {timesheet.paid_at && (
                <div>
                  <p className="text-sm text-gray-500">Paid</p>
                  <p className="text-sm">{formatDateTime(timesheet.paid_at)}</p>
                  {timesheet.payment_reference && (
                    <p className="text-xs text-gray-600">Ref: {timesheet.payment_reference}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approval Dialog */}
      {showApprovalDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Approve Timesheet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="approvalNotes">Approval Notes (Optional)</Label>
                <Textarea
                  id="approvalNotes"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add any notes about this approval"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowApprovalDialog(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Approving..." : "Approve"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rejection Dialog */}
      {showRejectionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Reject Timesheet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this timesheet is being rejected"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectionDialog(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  disabled={isLoading}
                >
                  {isLoading ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

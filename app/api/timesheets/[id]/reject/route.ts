import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Call the reject_timesheet function
    const { data, error } = await supabase.rpc("reject_timesheet", {
      p_timesheet_id: params.id,
      p_rejector_id: 1, // TODO: Get from authenticated user
      p_reason: reason,
    });

    if (error) {
      console.error("Error rejecting timesheet:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Timesheet rejected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/timesheets/[id]/reject:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

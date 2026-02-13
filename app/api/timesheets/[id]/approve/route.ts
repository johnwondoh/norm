import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { notes } = body;

    // Call the approve_timesheet function
    const { data, error } = await supabase.rpc("approve_timesheet", {
      p_timesheet_id: params.id,
      p_approver_id: 1, // TODO: Get from authenticated user
      p_notes: notes || null,
    });

    if (error) {
      console.error("Error approving timesheet:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Timesheet approved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/timesheets/[id]/approve:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

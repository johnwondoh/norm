import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // Call the submit_timesheet function
    const { data, error } = await supabase.rpc("submit_timesheet", {
      p_timesheet_id: params.id,
      p_employee_id: 1, // TODO: Get from authenticated user
    });

    if (error) {
      console.error("Error submitting timesheet:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Timesheet submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/timesheets/[id]/submit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

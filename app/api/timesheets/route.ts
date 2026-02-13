import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

type TimesheetInsert = Database["public"]["Tables"]["timesheets"]["Insert"];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: TimesheetInsert = await request.json();

    // Insert the timesheet
    const { data: timesheet, error } = await supabase
      .from("timesheets")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error("Error creating timesheet:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { timesheet, message: "Timesheet created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/timesheets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

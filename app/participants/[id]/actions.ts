'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateParticipant(
  participantId: string,
  updates: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("participants")
      .update(updates)
      .eq("id", participantId);

    if (error) {
      console.error("Error updating participant:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/participants/${participantId}`);
    revalidatePath("/participants");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating participant:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

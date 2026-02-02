'use server'

import { createClient } from "@/lib/supabase/server";
import { Employee } from "@/types/employee";
import { revalidatePath } from "next/cache";

export async function updateEmployee(
  employeeId: number,
  updates: Partial<Employee>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', employeeId);

    if (error) {
      console.error('Error updating employee:', error);
      return { success: false, error: error.message };
    }

    // Revalidate the employee page to show updated data
    revalidatePath(`/employees/${employeeId}`);
    revalidatePath('/employees');

    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating employee:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

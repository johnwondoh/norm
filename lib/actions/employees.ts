'use server'

import { createClient } from "@/lib/supabase/server";
  // -------------------- checking ----------------------

// export default async function employeeData(){
//   const supabase = await createClient();
//     let { data: employees, error } = await supabase
//         .from('employees')
//         // .select('id')
//         .select()
//     return employees
// }

export async function getEmployees() {
  const supabase = await createClient();
  return await supabase.from('employees').select();
}

  // ----------------------------------------------------
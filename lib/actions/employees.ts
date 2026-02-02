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

export async function getEmployeeByID(inputID: Number) {
  const supabase = await createClient();
  return await supabase.from('employees').select()
  .eq('id', inputID);
}

// export async function updateEmployee(id: string, data: any) {
//   const supabase = await createClient();
//   return await supabase.from('employees').update(data).eq('id', id);
// }

// export async function deleteEmployee(id: string) {
//   const supabase = await createClient();
//   return await supabase.from('employees').delete().eq('id', id);
// }

  // ----------------------------------------------------
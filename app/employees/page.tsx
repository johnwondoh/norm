import { createClient } from "@/lib/supabase/server";
import EmployeesClient from "@/app/employees/EmployeeClient";

export default async function EmployeesPage() {
  const supabase = await createClient();
  const { data: employees, error } = await supabase
    .from('employees')
    .select();

  console.log(employees)

  return <EmployeesClient initialEmployees={employees || []} />;
}
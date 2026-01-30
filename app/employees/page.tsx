import { createClient } from "@/lib/supabase/server";
import EmployeesClient from "@/app/employees/employeeClient";

export default async function EmployeesPage() {
  const supabase = await createClient();
  const { data: employees, error } = await supabase
    .from('employees')
    .select();

  return <EmployeesClient initialEmployees={employees || []} />;
}
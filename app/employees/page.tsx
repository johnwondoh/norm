import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import EmployeesClient from "@/app/employees/EmployeeClient";
import Loading from "@/app/employees/loading";

async function EmployeesData() {
  const supabase = await createClient();
  const { data: employees, error } = await supabase
    .from('employees')
    .select();

  if (error) {
    console.error("Error fetching employees:", error);
  }

  return <EmployeesClient initialEmployees={employees || []} />;
}

export default function EmployeesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EmployeesData />
    </Suspense>
  );
}

// import { createClient } from "@/lib/supabase/server";
// import EmployeesClient from "@/app/employees/EmployeeClient";

// export default async function EmployeesPage() {
//   const supabase = await createClient();
//   const { data: employees, error } = await supabase
//     .from('employees')
//     .select();

//   console.log(employees)

//   return <EmployeesClient initialEmployees={employees || []} />;
// }
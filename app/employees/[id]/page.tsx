import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
// Import EmployeeDetailClient from
import { EmployeeDetailClient } from "./EmployeeDetailsClient";
// import EmployeesClient from "@/app/employees/EmployeeClient";
import Loading from "@/app/employees/loading";

interface EmployeePageProps {
  params: Promise<{ id: string }>;
}

async function EmployeeDetails({params}: EmployeePageProps) {
  const employeeParams = await params
  const employeeId = parseInt(employeeParams.id)
  // console.log(typeof employeeParams.id)
  // console.log(typeof employeeId)
  // const { data: employee, error } = await supabase
  //   .from('employees')
  //   .select();

  const supabase = await createClient();
  const { data: employee, error } = await supabase.from('employees').select()
    .eq('id', employeeId)
    .single();

  if (error) {
    console.error("Error fetching employees:", error);
  }

  // console.log(employee)

  return <EmployeeDetailClient employee={employee || []} />;
}

export default async function EmployeeDetailsPage({params}: EmployeePageProps) {
  const employeeDetailsParams = await params
  console.log('checking')
  console.log(employeeDetailsParams)
  console.log('checking completed')
  return (
    <Suspense fallback={<Loading />}>
      <EmployeeDetails params={params} />
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
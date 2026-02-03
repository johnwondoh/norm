import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
// import EmployeesClient from "@/app/employees/EmployeeClient";
import Loading from "@/app/employees/loading";

async function EmployeesData() {
  const supabase = await createClient();
  const { data: participants, error } = await supabase
    .from('participants')
    .select();

  if (error) {
    console.error("Error fetching employees:", error);
  }

  console.log(participants)

//   return <EmployeesClient initialEmployees={employees || []} />;
return <h1>jjjPPP</h1>
}

export default function EmployeesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EmployeesData />
    </Suspense>
  );
}


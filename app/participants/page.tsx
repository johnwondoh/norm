import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import ParticipantsClient from "@/app/participants/ParticipantClient";
import Loading from "@/app/participants/loading";

async function ParticipantsData() {
  const supabase = await createClient();
  const { data: participants, error } = await supabase
    .from("participants")
    .select();

  if (error) {
    console.error("Error fetching participants:", error);
  }

  return <ParticipantsClient initialParticipants={participants || []} />;
}

export default function ParticipantsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ParticipantsData />
    </Suspense>
  );
}

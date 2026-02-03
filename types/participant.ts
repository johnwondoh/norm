import { Database } from "./supabase";

export type Participant = Database["public"]["Tables"]["participants"]["Row"]
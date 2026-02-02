import { Database } from "./supabase";

export type Employee = Database["public"]["Tables"]["employees"]["Row"]
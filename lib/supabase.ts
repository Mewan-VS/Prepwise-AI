import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

/**
 * A single Supabase client used on both the server (Route Handlers, Server
 * Components) and the browser. We only use the public anon key, so it is safe
 * to share. Row Level Security on the `study_plans` table governs access.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type StudyPlanDay = {
  day: string;
  focus: string;
  tasks: string[];
};

export type StudyPlan = {
  id: string;
  subject: string;
  topics: string;
  exam_date: string;
  plan: StudyPlanDay[];
  created_at: string;
};

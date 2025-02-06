import { createClient } from "@supabase/supabase-js";

export const env = import.meta.env;

export const supabaseClient = createClient(
  env.VITE_SUPABASE_PROJECT_URL as string,
  env.VITE_SUPABASE_KEY as string
);


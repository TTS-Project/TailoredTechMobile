import { createClient } from '@supabase/supabase-js';

// These must be set as environment variables at build time — never hardcode.
// For Vite: define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your
// .env file (gitignored) or your CI/build environment.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly at build/start time rather than silently breaking auth later.
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — set these before running the app.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

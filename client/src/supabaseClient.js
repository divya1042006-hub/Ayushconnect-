import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wtilhekflqxcopwwxjqd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aWxoZWtmbHF4Y29wd3d4anFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MzE0OTAsImV4cCI6MjEwMzUwNzQ5MH0.u0Lym_nfElnwIYajd_cv6HP5Dtsz4IsZLiBVwKuqKxU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

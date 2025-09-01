import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export function getCurrentUser() {
  return supabase.auth.getUser();
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  created_at: string;
  image_url?: string;
}

export interface Application {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  cv_url?: string;
  created_at: string;
}
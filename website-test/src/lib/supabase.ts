import { createClient } from '@supabase/supabase-js';

// On récupère les variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// On vérifie leur présence AVANT de créer le client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERREUR: Variables Supabase manquantes dans .env.local");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
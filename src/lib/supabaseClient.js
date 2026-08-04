import { createClient } from '@supabase/supabase-js'

// Diese beiden Werte trägst du in eine .env-Datei ein (siehe .env.example).
// Du findest sie in deinem Supabase-Projekt unter Project Settings -> API.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Public project address and anon key ("Paddock back"). Both are meant to be public —
// they ship to every browser anyway; data is protected by row-level security.
// Env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) still override them.
const DEFAULT_URL = 'https://qbhunabmsvwuyftfabms.supabase.co'
const DEFAULT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiaHVuYWJtc3Z3dXlmdGZhYm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4OTM2MDksImV4cCI6MjEwMDQ2OTYwOX0.10Vb9Yyl9_X5cghG-PgRpgF1WtB9VDgNVBrRKiOv3-Q'

const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON

export const supabase: SupabaseClient | null = url && anon ? createClient(url, anon) : null

export const isSupabaseReady = Boolean(supabase)

export interface ApplicationInput {
  full_name: string
  email: string
  phone: string
  brand: string
  car: string
  reference: string
  interests: string[]
  message: string
}

export async function submitApplication(input: ApplicationInput): Promise<void> {
  if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED')
  const { error } = await supabase.from('applications').insert({
    full_name: input.full_name,
    email: input.email,
    phone: input.phone,
    brand: input.brand || null,
    car: input.car || null,
    reference: input.reference || null,
    interests: input.interests.length ? input.interests : null,
    message: input.message || null,
    source: 'paddock-club-web',
  })
  if (error) throw error
}

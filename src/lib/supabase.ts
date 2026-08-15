import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

// The backend is wired via env. Until the project keys are in place the client
// stays null and the form falls back to a mailto flow — nothing breaks.
export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null

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

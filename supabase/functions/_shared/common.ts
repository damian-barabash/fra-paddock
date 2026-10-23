import { createClient, type SupabaseClient } from 'jsr:@supabase/supabase-js@2'

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

/** Service-role client: bypasses RLS, use only after checking the caller. */
export const serviceClient = (): SupabaseClient =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

export type Caller = { id: string; role: 'admin' | 'client'; email: string; fpl_email: string | null }

/** Resolves the signed-in member behind the request (null = not a member or disabled). */
export async function getCaller(req: Request, db: SupabaseClient): Promise<Caller | null> {
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { data, error } = await db.auth.getUser(token)
  if (error || !data.user) return null
  const { data: profile } = await db
    .from('profiles')
    .select('id, role, email, fpl_email, disabled')
    .eq('id', data.user.id)
    .maybeSingle()
  if (!profile || profile.disabled) return null
  return profile as Caller
}

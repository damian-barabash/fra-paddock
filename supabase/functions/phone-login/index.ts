// Sign-in with a phone number instead of an e-mail. Public (no JWT): finds the member by the
// last 9 digits of profiles.phone and signs in with their login e-mail on the server, so the
// e-mail behind a number is never revealed. Errors are always the same generic message.
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { cors, json, phoneKey, serviceClient } from '../_shared/common.ts'

const FAIL = { error: 'invalid' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'method' }, 405)

  let b: { phone?: string; password?: string }
  try {
    b = await req.json()
  } catch {
    return json(FAIL, 400)
  }
  const key = phoneKey(b.phone)
  const password = b.password ?? ''
  if (!key || !password || password.length > 200) return json(FAIL, 400)

  const db = serviceClient()
  const { data: rows } = await db.from('profiles').select('email, phone, disabled').not('phone', 'is', null)
  const hits = (rows ?? []).filter((r) => phoneKey(r.phone) === key)
  if (hits.length !== 1 || hits[0].disabled) return json(FAIL, 400)

  const anon = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await anon.auth.signInWithPassword({ email: hits[0].email, password })
  if (error || !data.session) return json(FAIL, 400)
  return json({ access_token: data.session.access_token, refresh_token: data.session.refresh_token })
})

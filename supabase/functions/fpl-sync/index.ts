// Pulls a member's litres and history from Fastline Performance Lab.
// Secrets: FPL_API_URL (e.g. https://<domain>/api), PADDOCK_API_KEY (same value as on the FPL server).
// Body: {} = sync myself · { user_id } = admin syncs one member · { all: true } = admin syncs every client.
import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { cors, getCaller, json, serviceClient } from '../_shared/common.ts'

const FPL_API_URL = (Deno.env.get('FPL_API_URL') ?? '').replace(/\/+$/, '')
const KEY = Deno.env.get('PADDOCK_API_KEY') ?? ''

async function syncOne(db: SupabaseClient, id: string, email: string) {
  try {
    const res = await fetch(
      `${FPL_API_URL}/integrations/paddock/client?email=${encodeURIComponent(email)}`,
      { headers: { 'X-Paddock-Key': KEY, Accept: 'application/json' } },
    )
    if (!res.ok) throw new Error(`FPL ${res.status}`)
    const d = await res.json()
    const row = d.found
      ? {
          user_id: id,
          found: true,
          litres_balance: Number(d.litres?.balance ?? 0),
          litres: d.litres?.entries ?? [],
          sessions: d.sessions ?? [],
          trips: d.trips ?? [],
          synced_at: new Date().toISOString(),
          error: null,
        }
      : { user_id: id, found: false, litres_balance: 0, litres: [], sessions: [], trips: [], synced_at: new Date().toISOString(), error: null }
    await db.from('fpl_snapshots').upsert(row)
    return { id, found: !!d.found }
  } catch (e) {
    // keep the last good copy, only note the failure
    await db.from('fpl_snapshots').upsert({ user_id: id, error: String(e).slice(0, 300) }, { onConflict: 'user_id', ignoreDuplicates: false })
    return { id, error: String(e) }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'method' }, 405)

  const db = serviceClient()
  const caller = await getCaller(req, db)
  if (!caller) return json({ error: 'Brak uprawnień.' }, 403)
  if (!FPL_API_URL || !KEY) return json({ configured: false })

  let b: { user_id?: string; all?: boolean } = {}
  try {
    b = await req.json()
  } catch { /* empty body = myself */ }

  if ((b.user_id || b.all) && caller.role !== 'admin') return json({ error: 'Brak uprawnień.' }, 403)

  let q = db.from('profiles').select('id, email, fpl_email').eq('disabled', false)
  if (b.all) q = q.eq('role', 'client')
  else q = q.eq('id', b.user_id ?? caller.id)
  const { data: members } = await q

  const results = []
  for (const m of members ?? []) results.push(await syncOne(db, m.id, m.fpl_email || m.email))
  return json({ configured: true, results })
})

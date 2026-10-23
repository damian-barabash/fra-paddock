// Account management for administrators: there is no public sign-up,
// every client and admin account is created here.
import { cors, getCaller, json, serviceClient } from '../_shared/common.ts'

type Body = {
  action: 'create' | 'update' | 'set_password' | 'delete'
  id?: string
  email?: string
  password?: string
  full_name?: string
  phone?: string | null
  role?: 'admin' | 'client'
  fpl_email?: string | null
  disabled?: boolean
}

const clean = (s?: string | null) => (s ?? '').trim()

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'method' }, 405)

  const db = serviceClient()
  const caller = await getCaller(req, db)
  if (!caller || caller.role !== 'admin') return json({ error: 'Brak uprawnień.' }, 403)

  let b: Body
  try {
    b = await req.json()
  } catch {
    return json({ error: 'Nieprawidłowe dane.' }, 400)
  }

  const role = b.role === 'admin' ? 'admin' : 'client'

  if (b.action === 'create') {
    const email = clean(b.email).toLowerCase()
    const password = b.password ?? ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Podaj poprawny e-mail.' }, 400)
    if (password.length < 8) return json({ error: 'Hasło musi mieć co najmniej 8 znaków.' }, 400)
    const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true })
    if (error || !data.user) {
      const taken = /already|exists|registered/i.test(error?.message ?? '')
      return json({ error: taken ? 'Konto z tym e-mailem już istnieje.' : 'Nie udało się utworzyć konta.' }, 400)
    }
    const { error: pErr } = await db.from('profiles').insert({
      id: data.user.id,
      role,
      email,
      full_name: clean(b.full_name),
      phone: clean(b.phone) || null,
      fpl_email: clean(b.fpl_email).toLowerCase() || null,
      created_by: caller.id,
    })
    if (pErr) {
      await db.auth.admin.deleteUser(data.user.id)
      return json({ error: 'Nie udało się zapisać profilu.' }, 500)
    }
    return json({ id: data.user.id })
  }

  if (!b.id) return json({ error: 'Brak konta.' }, 400)

  // never lock the club out: keep at least one active admin
  const otherActiveAdmins = async () => {
    const { count } = await db
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin')
      .eq('disabled', false)
      .neq('id', b.id!)
    return count ?? 0
  }

  if (b.action === 'update') {
    const patch: Record<string, unknown> = {}
    if (b.full_name !== undefined) patch.full_name = clean(b.full_name)
    if (b.phone !== undefined) patch.phone = clean(b.phone) || null
    if (b.fpl_email !== undefined) patch.fpl_email = clean(b.fpl_email).toLowerCase() || null
    if (b.role !== undefined) patch.role = role
    if (b.disabled !== undefined) patch.disabled = !!b.disabled
    const demoting = (b.role !== undefined && role !== 'admin') || b.disabled === true
    if (demoting && (await otherActiveAdmins()) === 0) {
      return json({ error: 'To ostatni aktywny administrator.' }, 400)
    }
    if (b.email !== undefined) {
      const email = clean(b.email).toLowerCase()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Podaj poprawny e-mail.' }, 400)
      const { error } = await db.auth.admin.updateUserById(b.id, { email, email_confirm: true })
      if (error) return json({ error: 'Nie udało się zmienić e-maila.' }, 400)
      patch.email = email
    }
    const { error } = await db.from('profiles').update(patch).eq('id', b.id)
    if (error) return json({ error: 'Nie udało się zapisać zmian.' }, 500)
    if (b.disabled !== undefined) {
      await db.auth.admin.updateUserById(b.id, { ban_duration: b.disabled ? '876000h' : 'none' })
    }
    return json({ ok: true })
  }

  if (b.action === 'set_password') {
    if ((b.password ?? '').length < 8) return json({ error: 'Hasło musi mieć co najmniej 8 znaków.' }, 400)
    const { error } = await db.auth.admin.updateUserById(b.id, { password: b.password })
    if (error) return json({ error: 'Nie udało się zmienić hasła.' }, 400)
    return json({ ok: true })
  }

  if (b.action === 'delete') {
    if (b.id === caller.id) return json({ error: 'Nie możesz usunąć własnego konta.' }, 400)
    const { data: target } = await db.from('profiles').select('role').eq('id', b.id).maybeSingle()
    if (target?.role === 'admin' && (await otherActiveAdmins()) === 0) {
      return json({ error: 'To ostatni aktywny administrator.' }, 400)
    }
    const { error } = await db.auth.admin.deleteUser(b.id)
    if (error) return json({ error: 'Nie udało się usunąć konta.' }, 400)
    return json({ ok: true })
  }

  return json({ error: 'Nieznana akcja.' }, 400)
})

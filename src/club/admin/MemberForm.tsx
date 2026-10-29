import { useState } from 'react'
import { callFn } from '../api'
import Sheet from '../ui/Sheet'
import { makePassword } from '../ui/format'

/** New client / new admin. Shows the starting password once so it can be handed over. */
export default function MemberForm({
  open,
  role,
  onClose,
  onCreated,
}: {
  open: boolean
  role: 'client' | 'admin'
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const [f, setF] = useState({ full_name: '', email: '', phone: '', fpl_email: '', password: makePassword() })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState<{ id: string; login: string; password: string } | null>(null)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((x) => ({ ...x, [k]: e.target.value }))

  const close = () => {
    setF({ full_name: '', email: '', phone: '', fpl_email: '', password: makePassword() })
    setErr('')
    setDone(null)
    onClose()
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      const r = await callFn<{ id: string }>('admin-users', { action: 'create', role, ...f })
      const nine = f.phone.replace(/\D/g, '').slice(-9)
      const login = [f.email.trim().toLowerCase(), nine.length === 9 ? nine : ''].filter(Boolean).join(' lub ')
      setDone({ id: r.id, login, password: f.password })
      onCreated(r.id)
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const who = role === 'admin' ? 'administratora' : 'klienta'

  return (
    <Sheet open={open} onClose={close} label={`Nowe konto ${who}`}>
      {done ? (
        <div className="created">
          <span className="eyebrow-line">Konto utworzone</span>
          <h2>Dane do logowania</h2>
          <p className="muted">Przekaż je osobiście. Hasło widać tylko teraz — członek może je zmienić w profilu.</p>
          <dl className="facts">
            <div><dt>Adres strony</dt><dd>{window.location.origin + window.location.pathname}</dd></div>
            <div><dt>Login</dt><dd>{done.login}</dd></div>
            <div><dt>Hasło</dt><dd className="mono">{done.password}</dd></div>
          </dl>
          <div className="row-actions">
            <button
              type="button"
              className="btn"
              onClick={() => navigator.clipboard?.writeText(`Fastline Paddock Club\n${window.location.origin + window.location.pathname}\nLogin: ${done.login}\nHasło: ${done.password}`)}
            >
              Kopiuj dane
            </button>
            <button type="button" className="btn btn-gold" onClick={close}>Gotowe</button>
          </div>
        </div>
      ) : (
        <form className="form" onSubmit={submit}>
          <span className="eyebrow-line">Nowe konto</span>
          <h2 className="sheet-h">{role === 'admin' ? 'Administrator' : 'Klient'}</h2>
          <div className="field">
            <label htmlFor="mf-name">Imię i nazwisko</label>
            <input id="mf-name" value={f.full_name} onChange={set('full_name')} required autoFocus />
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="mf-email">E-mail (login)</label>
              <input id="mf-email" type="email" value={f.email} onChange={set('email')} required={role === 'admin' || !f.phone.trim()} placeholder={role === 'client' ? 'albo tylko telefon' : undefined} />
            </div>
            <div className="field">
              <label htmlFor="mf-phone">Telefon <small>(też login)</small></label>
              <input id="mf-phone" value={f.phone} onChange={set('phone')} inputMode="tel" />
            </div>
          </div>
          {role === 'client' && (
            <div className="field">
              <label htmlFor="mf-fpl">E-mail w Performance Lab <small>(jeśli inny niż login)</small></label>
              <input id="mf-fpl" type="email" value={f.fpl_email} onChange={set('fpl_email')} placeholder="ten sam co login" />
            </div>
          )}
          <div className="field">
            <label htmlFor="mf-pass">Hasło startowe</label>
            <div className="input-with">
              <input id="mf-pass" value={f.password} onChange={set('password')} required minLength={8} className="mono" />
              <button type="button" onClick={() => setF((x) => ({ ...x, password: makePassword() }))}>Generuj</button>
            </div>
          </div>
          {err && <p className="form-msg err">{err}</p>}
          <button className="btn btn-gold" type="submit" disabled={busy}>
            {busy ? 'Tworzenie…' : `Utwórz konto ${who}`}
          </button>
        </form>
      )}
    </Sheet>
  )
}

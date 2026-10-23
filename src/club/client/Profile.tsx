import { useState } from 'react'
import type { MemberData } from './ClientApp'
import { sb } from '../api'
import { useSession } from '../session'
import Icon from '../ui/Icon'
import { fmtDate, memberNo } from '../ui/format'
import { CONTACT_EMAIL } from '../../content'

export default function Profile({ data, onAbout }: { data: MemberData; onAbout: () => void }) {
  const { profile, signOut } = useSession()
  const p = profile!
  const [pass, setPass] = useState('')
  const [pass2, setPass2] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const changePass = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (pass.length < 8) return setMsg({ ok: false, t: 'Hasło musi mieć co najmniej 8 znaków.' })
    if (pass !== pass2) return setMsg({ ok: false, t: 'Hasła nie są takie same.' })
    setBusy(true)
    const { error } = await sb.auth.updateUser({ password: pass })
    setBusy(false)
    if (error) return setMsg({ ok: false, t: 'Nie udało się zmienić hasła.' })
    setPass('')
    setPass2('')
    setMsg({ ok: true, t: 'Hasło zostało zmienione.' })
  }

  return (
    <div className="page">
      <header className="page-head">
        <span className="eyebrow-line">Członek nr {memberNo(p.member_no)}</span>
        <h1>{p.full_name || 'Twój profil'}</h1>
      </header>

      <dl className="facts">
        <div><dt><Icon name="mail" size={16} /> E-mail</dt><dd>{p.email}</dd></div>
        {p.phone && <div><dt><Icon name="phone" size={16} /> Telefon</dt><dd>{p.phone}</dd></div>}
        <div><dt><Icon name="shield" size={16} /> Członek od</dt><dd>{fmtDate(p.member_since)}</dd></div>
        <div>
          <dt><Icon name="refresh" size={16} /> Performance Lab</dt>
          <dd>{data.snapshot?.found ? 'Konto połączone' : 'Jeszcze nie połączono'}</dd>
        </div>
      </dl>

      <div className="profile-actions">
        <button type="button" className="btn btn-gold" onClick={onAbout}>
          <Icon name="sparkle" size={16} /> O Klubie
        </button>
        <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
          <Icon name="mail" size={16} /> Napisz do Klubu
        </a>
      </div>

      <section className="block">
        <h2 className="block-h"><span>Zmiana hasła</span><i /></h2>
        <form className="form" onSubmit={changePass}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="np">Nowe hasło</label>
              <input id="np" type="password" autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="np2">Powtórz hasło</label>
              <input id="np2" type="password" autoComplete="new-password" value={pass2} onChange={(e) => setPass2(e.target.value)} />
            </div>
          </div>
          {msg && <p className={`form-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.t}</p>}
          <button className="btn" type="submit" disabled={busy || !pass}>
            {busy ? 'Zapisywanie…' : 'Zmień hasło'}
          </button>
        </form>
      </section>

      <button type="button" className="logout" onClick={signOut}>
        <Icon name="logout" size={18} /> Wyloguj
      </button>
    </div>
  )
}

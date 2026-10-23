import { useEffect, useState } from 'react'
import { sb, type Profile } from '../api'
import { useSession } from '../session'
import { href } from '../router'
import Icon from '../ui/Icon'
import { fmtShort } from '../ui/format'
import MemberForm from './MemberForm'

export default function Admins() {
  const { profile } = useSession()
  const [rows, setRows] = useState<Profile[] | null>(null)
  const [adding, setAdding] = useState(false)
  const load = async () => {
    const { data } = await sb.from('profiles').select('*').eq('role', 'admin').order('created_at')
    setRows((data as Profile[]) ?? [])
  }
  useEffect(() => {
    load()
  }, [])

  return (
    <div className="apage">
      <header className="apage-head">
        <div>
          <span className="eyebrow-line">Zespół</span>
          <h1>Administratorzy</h1>
        </div>
        <div className="apage-actions">
          <button type="button" className="btn btn-gold" onClick={() => setAdding(true)}><Icon name="plus" size={16} /> Nowy administrator</button>
        </div>
      </header>
      <p className="note">Administrator widzi wszystkich klientów, zakłada konta, publikuje treści i wysyła pop-upy.</p>
      {!rows ? <div className="skeleton" /> : (
        <ul className="alist">
          {rows.map((r) => (
            <li key={r.id}>
              <a href={href('klienci/' + r.id)} className={r.disabled ? 'off' : ''}>
                <span className="alist-no"><Icon name="shield" size={16} /></span>
                <span className="alist-main">
                  <b>{r.full_name || r.email}{r.id === profile!.id ? ' (Ty)' : ''}</b>
                  <small>{r.email}</small>
                </span>
                <span className="alist-tag">od {fmtShort(r.created_at)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <MemberForm open={adding} role="admin" onClose={() => setAdding(false)} onCreated={() => load()} />
    </div>
  )
}

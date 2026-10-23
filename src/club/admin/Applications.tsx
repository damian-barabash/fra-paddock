import { useEffect, useState } from 'react'
import { sb } from '../api'
import Icon from '../ui/Icon'
import { fmtShort } from '../ui/format'

type App = {
  id: string
  full_name: string
  email: string
  phone: string
  brand: string | null
  car: string | null
  reference: string | null
  interests: string[] | null
  message: string | null
  status: string
  created_at: string
}
const STATUS: Record<string, string> = { new: 'Nowe', contacted: 'W kontakcie', accepted: 'Przyjęte', rejected: 'Odrzucone' }

/** Applications sent from the public form. */
export default function Applications() {
  const [rows, setRows] = useState<App[] | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  useEffect(() => {
    sb.from('applications').select('*').order('created_at', { ascending: false }).then(({ data }) => setRows((data as App[]) ?? []))
  }, [])
  const setStatus = async (id: string, status: string) => {
    await sb.from('applications').update({ status }).eq('id', id)
    setRows((l) => l!.map((r) => (r.id === id ? { ...r, status } : r)))
  }
  return (
    <div className="apage">
      <header className="apage-head">
        <div>
          <span className="eyebrow-line">Formularz na stronie</span>
          <h1>Zgłoszenia {rows && <small>{rows.filter((r) => r.status === 'new').length} nowych</small>}</h1>
        </div>
      </header>
      {!rows ? <div className="skeleton" /> : rows.length ? (
        <ul className="alist apps">
          {rows.map((r) => (
            <li key={r.id} className={open === r.id ? 'open' : ''}>
              <button type="button" onClick={() => setOpen(open === r.id ? null : r.id)}>
                <span className={`alist-kind s-${r.status}`}>{STATUS[r.status] ?? r.status}</span>
                <span className="alist-main">
                  <b>{r.full_name}</b>
                  <small>{r.email} · {r.phone}</small>
                </span>
                <span className="alist-tag">{fmtShort(r.created_at)}</span>
              </button>
              {open === r.id && (
                <div className="app-detail">
                  <dl className="facts">
                    {r.brand && <div><dt>Ulubiona marka</dt><dd>{r.brand}</dd></div>}
                    {r.car && <div><dt>Samochód</dt><dd>{r.car}</dd></div>}
                    {r.reference && <div><dt>Rekomendacja</dt><dd>{r.reference}</dd></div>}
                    {r.interests?.length ? <div><dt>Interesuje</dt><dd>{r.interests.join(', ')}</dd></div> : null}
                    {r.message && <div><dt>O sobie</dt><dd>{r.message}</dd></div>}
                  </dl>
                  <div className="row-actions">
                    {Object.entries(STATUS).map(([k, v]) => (
                      <button key={k} type="button" className={`btn${r.status === k ? ' btn-gold' : ''}`} onClick={() => setStatus(r.id, k)}>{v}</button>
                    ))}
                    <a className="btn" href={`mailto:${r.email}`}><Icon name="mail" size={16} /> Napisz</a>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : <p className="empty">Brak zgłoszeń.</p>}
    </div>
  )
}

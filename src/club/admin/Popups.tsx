import { useEffect, useState } from 'react'
import { sb, type Popup } from '../api'
import { href } from '../router'
import Icon from '../ui/Icon'
import { fmtShort } from '../ui/format'

type Row = Popup & { popup_recipients: { seen_at: string | null }[] }

export default function Popups() {
  const [rows, setRows] = useState<Row[] | null>(null)
  useEffect(() => {
    sb.from('popups').select('*, popup_recipients(seen_at)').order('created_at', { ascending: false })
      .then(({ data }) => setRows((data as Row[]) ?? []))
  }, [])
  return (
    <div className="apage">
      <header className="apage-head">
        <div>
          <span className="eyebrow-line">Komunikaty</span>
          <h1>Pop-upy</h1>
        </div>
        <div className="apage-actions">
          <a className="btn btn-gold" href={href('popupy/nowy')}><Icon name="send" size={16} /> Nowy pop-up</a>
        </div>
      </header>
      <p className="note">Pop-up wyświetla się wybranym członkom przy następnym wejściu do Paddocku — jeden raz.</p>
      {!rows ? <div className="skeleton" /> : rows.length ? (
        <ul className="alist">
          {rows.map((r) => {
            const seen = r.popup_recipients.filter((x) => x.seen_at).length
            return (
              <li key={r.id}>
                <a href={href('popupy/' + r.id)}>
                  <span className="alist-no"><Icon name="bell" size={16} /></span>
                  <span className="alist-main">
                    <b>{r.title}</b>
                    <small>Wysłano {fmtShort(r.created_at)} · odbiorców {r.popup_recipients.length}</small>
                  </span>
                  <span className="alist-tag">Zobaczyło {seen}/{r.popup_recipients.length}</span>
                </a>
              </li>
            )
          })}
        </ul>
      ) : <p className="empty">Nie wysłano jeszcze żadnego pop-upu.</p>}
    </div>
  )
}

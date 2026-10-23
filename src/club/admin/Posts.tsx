import { useEffect, useState } from 'react'
import { sb, type Post, type PostKind } from '../api'
import { href } from '../router'
import Icon from '../ui/Icon'
import { fmtShort } from '../ui/format'

export const KIND_LABEL: Record<PostKind, string> = { post: 'Aktualność', invitation: 'Zaproszenie', offer: 'Oferta' }

type Row = Post & { rsvps: { status: string }[]; post_recipients: { user_id: string }[] }

export default function Posts() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [kind, setKind] = useState<PostKind | ''>('')

  useEffect(() => {
    sb.from('posts')
      .select('*, rsvps(status), post_recipients(user_id)')
      .order('published_at', { ascending: false })
      .then(({ data }) => setRows((data as Row[]) ?? []))
  }, [])

  const list = (rows ?? []).filter((r) => !kind || r.kind === kind)
  const now = Date.now()

  return (
    <div className="apage">
      <header className="apage-head">
        <div>
          <span className="eyebrow-line">Strefa członka</span>
          <h1>Treści</h1>
        </div>
        <div className="apage-actions">
          <a className="btn" href={href('tresci/nowy-post')}><Icon name="plus" size={16} /> Aktualność</a>
          <a className="btn" href={href('tresci/nowy-invitation')}><Icon name="calendar" size={16} /> Zaproszenie</a>
          <a className="btn btn-gold" href={href('tresci/nowy-offer')}><Icon name="offer" size={16} /> Oferta</a>
        </div>
      </header>

      <div className="seg">
        {(['', 'post', 'invitation', 'offer'] as const).map((k) => (
          <button key={k} type="button" className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>
            {k ? KIND_LABEL[k] : 'Wszystko'}
          </button>
        ))}
      </div>

      {!rows ? <div className="skeleton" /> : list.length ? (
        <ul className="alist">
          {list.map((r) => {
            const yes = r.rsvps.filter((x) => x.status === 'yes').length
            const no = r.rsvps.length - yes
            const scheduled = new Date(r.published_at).getTime() > now
            return (
              <li key={r.id}>
                <a href={href('tresci/' + r.id)}>
                  <span className={`alist-kind k-${r.kind}`}>{KIND_LABEL[r.kind]}</span>
                  <span className="alist-main">
                    <b>{r.title}</b>
                    <small>
                      {r.kind === 'invitation' && r.event_at ? `${fmtShort(r.event_at)} · ` : ''}
                      {r.audience === 'all' ? 'Wszyscy' : `${r.post_recipients.length} os.`}
                      {r.kind === 'invitation' ? ` · Będzie: ${yes} · Nie: ${no}` : ''}
                    </small>
                  </span>
                  <span className="alist-tag">{!r.published ? 'Szkic' : scheduled ? `Od ${fmtShort(r.published_at)}` : fmtShort(r.published_at)}</span>
                </a>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="empty">Brak treści. Zacznij od pierwszej aktualności lub zaproszenia.</p>
      )}
    </div>
  )
}

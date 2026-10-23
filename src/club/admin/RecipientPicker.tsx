import { useEffect, useMemo, useState } from 'react'
import { sb } from '../api'
import { memberNo } from '../ui/format'

type Opt = { id: string; full_name: string; email: string; member_no: number }

/** "Everyone" or a hand-picked list of clients. */
export default function RecipientPicker({
  audience,
  selected,
  onAudience,
  onSelected,
  allLabel = 'Wszyscy członkowie',
}: {
  audience: 'all' | 'selected'
  selected: string[]
  onAudience: (a: 'all' | 'selected') => void
  onSelected: (ids: string[]) => void
  allLabel?: string
}) {
  const [opts, setOpts] = useState<Opt[]>([])
  const [q, setQ] = useState('')
  useEffect(() => {
    sb.from('profiles').select('id, full_name, email, member_no').eq('role', 'client').eq('disabled', false).order('full_name')
      .then(({ data }) => setOpts((data as Opt[]) ?? []))
  }, [])
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? opts.filter((o) => `${o.full_name} ${o.email}`.toLowerCase().includes(s)) : opts
  }, [opts, q])
  const toggle = (id: string) => onSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])

  return (
    <div className="field">
      <span className="field-label">Odbiorcy</span>
      <div className="seg">
        <button type="button" className={audience === 'all' ? 'on' : ''} onClick={() => onAudience('all')}>{allLabel}</button>
        <button type="button" className={audience === 'selected' ? 'on' : ''} onClick={() => onAudience('selected')}>
          Wybrane osoby{selected.length ? ` (${selected.length})` : ''}
        </button>
      </div>
      {audience === 'selected' && (
        <div className="picker">
          <input placeholder="Szukaj klienta" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="picker-tools">
            <button type="button" onClick={() => onSelected(Array.from(new Set([...selected, ...list.map((o) => o.id)])))}>Zaznacz widocznych</button>
            <button type="button" onClick={() => onSelected([])}>Wyczyść</button>
          </div>
          <ul>
            {list.map((o) => (
              <li key={o.id}>
                <label className={selected.includes(o.id) ? 'on' : ''}>
                  <input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} />
                  <span className="picker-no">{memberNo(o.member_no)}</span>
                  <span>{o.full_name || o.email}<small>{o.email}</small></span>
                </label>
              </li>
            ))}
            {!list.length && <li className="muted">Brak klientów.</li>}
          </ul>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { EVENT_CATEGORIES, sb, type ClubEvent, type Post } from '../api'
import { useSession } from '../session'
import { go, href } from '../router'
import Icon from '../ui/Icon'
import RichEditor from '../ui/RichEditor'
import { fmtShort, fromLocalInput, toLocalInput } from '../ui/format'
import ImageField from './ImageField'

type Draft = Omit<ClubEvent, 'id' | 'created_at' | 'updated_at'>
const blank = (): Draft => ({
  title: '',
  category: '',
  lead: '',
  body_html: '',
  cover_url: null,
  starts_at: '',
  ends_at: null,
  place: '',
  cta_label: '',
  cta_url: '',
  post_id: null,
  published: true,
})

type Invite = Pick<Post, 'id' | 'title' | 'lead' | 'cover_url' | 'event_at' | 'event_end_at' | 'event_place' | 'audience'>

/** Club calendar event; route `wydarzenia/nowe` or `wydarzenia/<id>`. */
export default function EventEditor({ id }: { id: string }) {
  const { profile } = useSession()
  const isNew = id === 'nowe'
  const [d, setD] = useState<Draft | null>(isNew ? blank() : null)
  const [invites, setInvites] = useState<Invite[]>([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    sb.from('posts')
      .select('id, title, lead, cover_url, event_at, event_end_at, event_place, audience')
      .eq('kind', 'invitation')
      .order('event_at', { ascending: false })
      .then(({ data }) => setInvites((data as Invite[]) ?? []))
    if (isNew) return
    sb.from('club_events').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (!data) return setErr('Nie znaleziono wydarzenia.')
      const { id: _i, created_at: _c, updated_at: _u, ...rest } = data as ClubEvent
      setD(rest)
    })
  }, [id, isNew])

  if (!d) return <div className="apage">{err ? <p className="empty">{err}</p> : <div className="skeleton" />}</div>
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x!, [k]: v }))
  const linked = invites.find((p) => p.id === d.post_id)

  /** take what the invitation already says (only empty fields are filled) */
  const fillFromInvite = () => {
    if (!linked) return
    setD((x) => ({
      ...x!,
      title: x!.title || linked.title,
      lead: x!.lead || linked.lead || '',
      cover_url: x!.cover_url || linked.cover_url,
      starts_at: x!.starts_at || linked.event_at || '',
      ends_at: x!.ends_at || linked.event_end_at,
      place: x!.place || linked.event_place || '',
    }))
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!d.title.trim()) return setErr('Dodaj nazwę wydarzenia.')
    if (!d.starts_at) return setErr('Podaj datę i godzinę początku.')
    if (d.ends_at && d.ends_at < d.starts_at) return setErr('Koniec nie może być przed początkiem.')
    if (d.cta_url && !/^(https?:|mailto:|tel:)/i.test(d.cta_url.trim())) return setErr('Link przycisku musi zaczynać się od https://, mailto: lub tel:.')
    setBusy(true)
    const row = {
      ...d,
      title: d.title.trim(),
      category: d.category?.trim() || null,
      lead: d.lead?.trim() || null,
      place: d.place?.trim() || null,
      cta_label: d.cta_label?.trim() || null,
      cta_url: d.cta_url?.trim() || null,
      updated_at: new Date().toISOString(),
    }
    const { error } = isNew
      ? await sb.from('club_events').insert({ ...row, created_by: profile!.id })
      : await sb.from('club_events').update(row).eq('id', id)
    setBusy(false)
    if (error) return setErr('Nie udało się zapisać. Spróbuj ponownie.')
    go('wydarzenia')
  }

  const remove = async () => {
    if (!window.confirm('Usunąć to wydarzenie z kalendarza? Połączone zaproszenie zostanie.')) return
    await sb.from('club_events').delete().eq('id', id)
    go('wydarzenia')
  }

  return (
    <div className="apage">
      <a className="back" href={href('wydarzenia')}><Icon name="back" size={18} /> Wydarzenia</a>
      <header className="apage-head">
        <div>
          <span className="eyebrow-line">{isNew ? 'Nowe wydarzenie' : 'Edycja'}</span>
          <h1>{d.title || 'Wydarzenie Klubu'}</h1>
        </div>
      </header>

      <form className="form editor-form" onSubmit={save}>
        <fieldset className="fieldset">
          <legend>Zaproszenie <small>(opcjonalnie)</small></legend>
          <div className="field">
            <label htmlFor="ev-p">Połącz z zaproszeniem</label>
            <div className="select-wrap">
              <select id="ev-p" value={d.post_id ?? ''} onChange={(e) => set('post_id', e.target.value || null)}>
                <option value="">— bez zaproszenia —</option>
                {invites.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.event_at ? fmtShort(p.event_at) + ' · ' : ''}{p.title}{p.audience === 'selected' ? ' (imienne)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <small className="muted">
              Przycisk na karcie poprowadzi do zaproszenia, gdzie członek odpowie „Będę / Nie mogę”. Imienne zaproszenie widzą tylko jego goście — pozostali zobaczą szczegóły wydarzenia.
            </small>
          </div>
          {linked && (
            <button type="button" className="btn ev-fill" onClick={fillFromInvite}>
              <Icon name="refresh" size={15} /> Uzupełnij puste pola z zaproszenia
            </button>
          )}
        </fieldset>

        <div className="field">
          <label htmlFor="ev-t">Nazwa</label>
          <input id="ev-t" className="input-title" value={d.title} onChange={(e) => set('title', e.target.value)} placeholder="np. Club Track Day · Tor Poznań" />
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="ev-c">Rodzaj</label>
            <input id="ev-c" list="ev-cats" value={d.category ?? ''} onChange={(e) => set('category', e.target.value)} placeholder="Track Day, Grand Tour…" />
            <datalist id="ev-cats">{EVENT_CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div className="field">
            <label htmlFor="ev-pl">Miejsce</label>
            <input id="ev-pl" value={d.place ?? ''} onChange={(e) => set('place', e.target.value)} placeholder="np. Tor Poznań, Przeźmierowo" />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="ev-s">Początek</label>
            <input id="ev-s" type="datetime-local" value={toLocalInput(d.starts_at)} onChange={(e) => set('starts_at', fromLocalInput(e.target.value) ?? '')} />
          </div>
          <div className="field">
            <label htmlFor="ev-e">Koniec <small>(opcjonalnie, także dla wyjazdów kilkudniowych)</small></label>
            <input id="ev-e" type="datetime-local" value={toLocalInput(d.ends_at)} onChange={(e) => set('ends_at', fromLocalInput(e.target.value))} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="ev-l">Krótki opis <small>(widoczny na liście i w szczegółach)</small></label>
          <textarea id="ev-l" rows={2} value={d.lead ?? ''} onChange={(e) => set('lead', e.target.value)} />
        </div>

        <ImageField label="Zdjęcie" value={d.cover_url} onChange={(v) => set('cover_url', v)} />

        <div className="field">
          <span className="field-label">Szczegóły <small>(program, dojazd, co zabrać)</small></span>
          <RichEditor value={d.body_html} onChange={(v) => set('body_html', v)} />
        </div>

        <fieldset className="fieldset">
          <legend>Przycisk zapisu <small>(opcjonalnie)</small></legend>
          <p className="muted">Kliknięcie zapisuje członka — zgłoszenie pojawia się w „Zgłoszeniach”. Link jest opcjonalny (np. zewnętrzne zapisy); bez linku przycisk tylko zapisuje.</p>
          <div className="form-row">
            <div className="field"><label htmlFor="ev-cl">Tekst</label><input id="ev-cl" value={d.cta_label ?? ''} onChange={(e) => set('cta_label', e.target.value)} placeholder="np. Zapisz się" /></div>
            <div className="field"><label htmlFor="ev-cu">Link</label><input id="ev-cu" type="url" value={d.cta_url ?? ''} onChange={(e) => set('cta_url', e.target.value)} placeholder="https://…" /></div>
          </div>
        </fieldset>

        <label className="check"><input type="checkbox" checked={d.published} onChange={(e) => set('published', e.target.checked)} /> Widoczne dla członków</label>

        {err && <p className="form-msg err">{err}</p>}
        <div className="row-actions sticky-actions">
          <button className="btn btn-gold" type="submit" disabled={busy}>{busy ? 'Zapisywanie…' : isNew ? 'Dodaj do kalendarza' : 'Zapisz zmiany'}</button>
          {!isNew && <button type="button" className="btn btn-danger" onClick={remove}><Icon name="trash" size={16} /> Usuń</button>}
        </div>
      </form>
    </div>
  )
}

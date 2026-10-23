import { useEffect, useState } from 'react'
import { sb, type Post, type PostKind, type Profile, type Rsvp } from '../api'
import { useSession } from '../session'
import { go, href } from '../router'
import Icon from '../ui/Icon'
import RichEditor from '../ui/RichEditor'
import { fromLocalInput, toLocalInput, fmtShort } from '../ui/format'
import ImageField from './ImageField'
import RecipientPicker from './RecipientPicker'
import { KIND_LABEL } from './Posts'

type Draft = Omit<Post, 'id' | 'created_at'>
const blank = (kind: PostKind): Draft => ({
  kind,
  title: '',
  lead: '',
  body_html: '',
  cover_url: null,
  audience: kind === 'post' ? 'all' : 'selected',
  event_at: null,
  event_end_at: null,
  event_place: '',
  rsvp_until: null,
  dress_code: '',
  valid_until: null,
  cta_label: '',
  cta_url: '',
  published: true,
  pinned: false,
  published_at: new Date().toISOString(),
})

type RsvpRow = Rsvp & { profiles: Pick<Profile, 'full_name' | 'email'> | null }

/** One editor for news, invitations and offers; route `tresci/nowy-<kind>` or `tresci/<id>`. */
export default function PostEditor({ id }: { id: string }) {
  const { profile } = useSession()
  const isNew = id.startsWith('nowy-')
  const [d, setD] = useState<Draft | null>(isNew ? blank((id.slice(5) as PostKind) || 'post') : null)
  const [recipients, setRecipients] = useState<string[]>([])
  const [rsvps, setRsvps] = useState<RsvpRow[]>([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (isNew) return
    Promise.all([
      sb.from('posts').select('*').eq('id', id).maybeSingle(),
      sb.from('post_recipients').select('user_id').eq('post_id', id),
      sb.from('rsvps').select('*, profiles(full_name, email)').eq('post_id', id),
    ]).then(([p, r, v]) => {
      if (!p.data) return setErr('Nie znaleziono wpisu.')
      const { id: _i, created_at: _c, ...rest } = p.data as Post
      setD(rest)
      setRecipients(((r.data as { user_id: string }[]) ?? []).map((x) => x.user_id))
      setRsvps((v.data as RsvpRow[]) ?? [])
    })
  }, [id, isNew])

  if (!d) return <div className="apage">{err ? <p className="empty">{err}</p> : <div className="skeleton" />}</div>
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x!, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!d.title.trim()) return setErr('Dodaj tytuł.')
    if (d.audience === 'selected' && !recipients.length) return setErr('Wybierz co najmniej jedną osobę albo „Wszyscy członkowie”.')
    if (d.kind === 'invitation' && !d.event_at) return setErr('Podaj datę wydarzenia.')
    setBusy(true)
    try {
      const row = {
        ...d,
        title: d.title.trim(),
        lead: d.lead?.trim() || null,
        event_place: d.event_place?.trim() || null,
        dress_code: d.dress_code?.trim() || null,
        cta_label: d.cta_label?.trim() || null,
        cta_url: d.cta_url?.trim() || null,
        updated_at: new Date().toISOString(),
      }
      let postId = id
      if (isNew) {
        const { data, error } = await sb.from('posts').insert({ ...row, created_by: profile!.id }).select('id').single()
        if (error) throw error
        postId = data.id
      } else {
        const { error } = await sb.from('posts').update(row).eq('id', id)
        if (error) throw error
      }
      await sb.from('post_recipients').delete().eq('post_id', postId)
      if (d.audience === 'selected' && recipients.length) {
        const { error } = await sb.from('post_recipients').insert(recipients.map((u) => ({ post_id: postId, user_id: u })))
        if (error) throw error
      }
      go('tresci')
    } catch {
      setErr('Nie udało się zapisać. Spróbuj ponownie.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!window.confirm('Usunąć ten wpis razem z odpowiedziami?')) return
    await sb.from('posts').delete().eq('id', id)
    go('tresci')
  }

  const yes = rsvps.filter((r) => r.status === 'yes')
  const no = rsvps.filter((r) => r.status === 'no')

  return (
    <div className="apage">
      <a className="back" href={href('tresci')}><Icon name="back" size={18} /> Treści</a>
      <header className="apage-head">
        <div>
          <span className="eyebrow-line">{isNew ? 'Nowy wpis' : 'Edycja'}</span>
          <h1>{KIND_LABEL[d.kind]}</h1>
        </div>
      </header>

      <form className="form editor-form" onSubmit={save}>
        {isNew && (
          <div className="seg">
            {(['post', 'invitation', 'offer'] as const).map((k) => (
              <button key={k} type="button" className={d.kind === k ? 'on' : ''} onClick={() => set('kind', k)}>{KIND_LABEL[k]}</button>
            ))}
          </div>
        )}

        <div className="field">
          <label htmlFor="pe-t">Tytuł</label>
          <input id="pe-t" className="input-title" value={d.title} onChange={(e) => set('title', e.target.value)} placeholder={d.kind === 'invitation' ? 'np. Kolacja Paddock Night w Warszawie' : 'Tytuł'} />
        </div>
        <div className="field">
          <label htmlFor="pe-l">Wstęp <small>(krótko, widoczny na karcie)</small></label>
          <textarea id="pe-l" rows={2} value={d.lead ?? ''} onChange={(e) => set('lead', e.target.value)} />
        </div>

        <ImageField label="Zdjęcie główne" value={d.cover_url} onChange={(v) => set('cover_url', v)} />

        {d.kind === 'invitation' && (
          <fieldset className="fieldset">
            <legend>Wydarzenie</legend>
            <div className="form-row">
              <div className="field"><label htmlFor="pe-ea">Początek</label><input id="pe-ea" type="datetime-local" value={toLocalInput(d.event_at)} onChange={(e) => set('event_at', fromLocalInput(e.target.value))} /></div>
              <div className="field"><label htmlFor="pe-ee">Koniec <small>(opcjonalnie)</small></label><input id="pe-ee" type="datetime-local" value={toLocalInput(d.event_end_at)} onChange={(e) => set('event_end_at', fromLocalInput(e.target.value))} /></div>
            </div>
            <div className="field"><label htmlFor="pe-pl">Miejsce</label><input id="pe-pl" value={d.event_place ?? ''} onChange={(e) => set('event_place', e.target.value)} placeholder="np. Tor Poznań, Przeźmierowo" /></div>
            <div className="form-row">
              <div className="field"><label htmlFor="pe-ru">Odpowiedź do</label><input id="pe-ru" type="datetime-local" value={toLocalInput(d.rsvp_until)} onChange={(e) => set('rsvp_until', fromLocalInput(e.target.value))} /></div>
              <div className="field"><label htmlFor="pe-dc">Dress code</label><input id="pe-dc" value={d.dress_code ?? ''} onChange={(e) => set('dress_code', e.target.value)} placeholder="np. Smart casual" /></div>
            </div>
          </fieldset>
        )}

        {d.kind === 'offer' && (
          <fieldset className="fieldset">
            <legend>Oferta</legend>
            <div className="form-row">
              <div className="field"><label htmlFor="pe-vu">Ważna do</label><input id="pe-vu" type="datetime-local" value={toLocalInput(d.valid_until)} onChange={(e) => set('valid_until', fromLocalInput(e.target.value))} /></div>
              <div className="field"><label htmlFor="pe-cl">Tekst przycisku</label><input id="pe-cl" value={d.cta_label ?? ''} onChange={(e) => set('cta_label', e.target.value)} placeholder="np. Zarezerwuj" /></div>
            </div>
            <div className="field"><label htmlFor="pe-cu">Link przycisku</label><input id="pe-cu" type="url" value={d.cta_url ?? ''} onChange={(e) => set('cta_url', e.target.value)} placeholder="https://… lub mailto:…" /></div>
          </fieldset>
        )}

        <div className="field">
          <span className="field-label">Treść</span>
          <RichEditor value={d.body_html} onChange={(v) => set('body_html', v)} />
        </div>

        <RecipientPicker audience={d.audience} selected={recipients} onAudience={(a) => set('audience', a)} onSelected={setRecipients} />

        <fieldset className="fieldset">
          <legend>Publikacja</legend>
          <div className="form-row">
            <div className="field"><label htmlFor="pe-pa">Widoczne od</label><input id="pe-pa" type="datetime-local" value={toLocalInput(d.published_at)} onChange={(e) => set('published_at', fromLocalInput(e.target.value) ?? new Date().toISOString())} /></div>
            <div className="field checks">
              <label className="check"><input type="checkbox" checked={d.published} onChange={(e) => set('published', e.target.checked)} /> Opublikowane</label>
              <label className="check"><input type="checkbox" checked={d.pinned} onChange={(e) => set('pinned', e.target.checked)} /> Przypnij na górze</label>
            </div>
          </div>
        </fieldset>

        {err && <p className="form-msg err">{err}</p>}
        <div className="row-actions sticky-actions">
          <button className="btn btn-gold" type="submit" disabled={busy}>{busy ? 'Zapisywanie…' : isNew ? 'Opublikuj' : 'Zapisz zmiany'}</button>
          {!isNew && <button type="button" className="btn btn-danger" onClick={remove}><Icon name="trash" size={16} /> Usuń</button>}
        </div>
      </form>

      {d.kind === 'invitation' && !isNew && (
        <section className="apanel rsvp-panel">
          <h2>Odpowiedzi · Będzie {yes.length} · Nie może {no.length}</h2>
          {rsvps.length ? (
            <ul className="mini-list">
              {[...yes, ...no].map((r) => (
                <li key={r.user_id}>
                  <a href={href('klienci/' + r.user_id)}>{r.profiles?.full_name || r.profiles?.email}</a>
                  <b className={r.status === 'yes' ? 'yes' : 'no'}>{r.status === 'yes' ? 'Będzie' : 'Nie może'} · {fmtShort(r.responded_at)}</b>
                </li>
              ))}
            </ul>
          ) : <p className="muted">Nikt jeszcze nie odpowiedział.</p>}
        </section>
      )}
    </div>
  )
}

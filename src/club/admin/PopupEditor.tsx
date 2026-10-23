import { useEffect, useState } from 'react'
import { sb, type Popup, type Profile } from '../api'
import { useSession } from '../session'
import { go, href } from '../router'
import Icon from '../ui/Icon'
import RichEditor from '../ui/RichEditor'
import RichContent from '../ui/RichContent'
import { fmtShort } from '../ui/format'
import ImageField from './ImageField'
import RecipientPicker from './RecipientPicker'

type Rec = { user_id: string; seen_at: string | null; profiles: Pick<Profile, 'full_name' | 'email'> | null }

/** Compose and send a pop-up (`popupy/nowy`) or see who has read a sent one (`popupy/<id>`). */
export default function PopupEditor({ id }: { id: string }) {
  const { profile } = useSession()
  const isNew = id === 'nowy'
  const [p, setP] = useState({ title: '', body_html: '', image_url: null as string | null, cta_label: '', cta_url: '' })
  const [audience, setAudience] = useState<'all' | 'selected'>('selected')
  const [selected, setSelected] = useState<string[]>([])
  const [sent, setSent] = useState<Popup | null>(null)
  const [recs, setRecs] = useState<Rec[]>([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (isNew) return
    Promise.all([
      sb.from('popups').select('*').eq('id', id).maybeSingle(),
      sb.from('popup_recipients').select('user_id, seen_at, profiles(full_name, email)').eq('popup_id', id),
    ]).then(([a, b]) => {
      setSent((a.data as Popup) ?? null)
      setRecs((b.data as unknown as Rec[]) ?? [])
    })
  }, [id, isNew])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!p.title.trim()) return setErr('Dodaj tytuł.')
    if (audience === 'selected' && !selected.length) return setErr('Wybierz odbiorców.')
    setBusy(true)
    try {
      let ids = selected
      if (audience === 'all') {
        const { data } = await sb.from('profiles').select('id').eq('role', 'client').eq('disabled', false)
        ids = ((data as { id: string }[]) ?? []).map((x) => x.id)
      }
      if (!ids.length) throw new Error('Brak klientów do wysłania.')
      const { data, error } = await sb.from('popups').insert({
        title: p.title.trim(),
        body_html: p.body_html,
        image_url: p.image_url,
        cta_label: p.cta_label.trim() || null,
        cta_url: p.cta_url.trim() || null,
        created_by: profile!.id,
      }).select('id').single()
      if (error) throw error
      const { error: e2 } = await sb.from('popup_recipients').insert(ids.map((u) => ({ popup_id: data.id, user_id: u })))
      if (e2) throw e2
      go('popupy/' + data.id)
    } catch (e) {
      setErr((e as Error).message || 'Nie udało się wysłać.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!window.confirm('Usunąć pop-up? Członkowie, którzy go nie widzieli, już go nie zobaczą.')) return
    await sb.from('popups').delete().eq('id', id)
    go('popupy')
  }

  if (!isNew) {
    if (!sent) return <div className="apage"><div className="skeleton" /></div>
    const seen = recs.filter((r) => r.seen_at)
    return (
      <div className="apage">
        <a className="back" href={href('popupy')}><Icon name="back" size={18} /> Pop-upy</a>
        <header className="apage-head">
          <div>
            <span className="eyebrow-line">Wysłano {fmtShort(sent.created_at)}</span>
            <h1>{sent.title}</h1>
          </div>
          <div className="apage-actions"><button type="button" className="btn btn-danger" onClick={remove}><Icon name="trash" size={16} /> Usuń</button></div>
        </header>
        <div className="agrid">
          <section className="apanel">
            <h2>Podgląd</h2>
            {sent.image_url && <img className="club-popup-img" src={sent.image_url} alt="" />}
            <RichContent html={sent.body_html} />
            {sent.cta_url && <p className="muted">Przycisk: {sent.cta_label || 'Zobacz'} → {sent.cta_url}</p>}
          </section>
          <section className="apanel">
            <h2>Odbiorcy · zobaczyło {seen.length}/{recs.length}</h2>
            <ul className="mini-list">
              {recs.map((r) => (
                <li key={r.user_id}>
                  <a href={href('klienci/' + r.user_id)}>{r.profiles?.full_name || r.profiles?.email}</a>
                  <b className={r.seen_at ? 'yes' : ''}>{r.seen_at ? `Zobaczył(a) ${fmtShort(r.seen_at)}` : 'Jeszcze nie'}</b>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="apage">
      <a className="back" href={href('popupy')}><Icon name="back" size={18} /> Pop-upy</a>
      <header className="apage-head"><div><span className="eyebrow-line">Nowy komunikat</span><h1>Pop-up</h1></div></header>
      <form className="form editor-form" onSubmit={send}>
        <div className="field"><label htmlFor="pp-t">Tytuł</label><input id="pp-t" className="input-title" value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} /></div>
        <ImageField label="Zdjęcie" value={p.image_url} onChange={(v) => setP({ ...p, image_url: v })} />
        <div className="field"><span className="field-label">Treść</span><RichEditor value={p.body_html} onChange={(v) => setP({ ...p, body_html: v })} /></div>
        <div className="form-row">
          <div className="field"><label htmlFor="pp-cl">Przycisk <small>(opcjonalnie)</small></label><input id="pp-cl" value={p.cta_label} onChange={(e) => setP({ ...p, cta_label: e.target.value })} placeholder="np. Zobacz zaproszenie" /></div>
          <div className="field"><label htmlFor="pp-cu">Link przycisku</label><input id="pp-cu" value={p.cta_url} onChange={(e) => setP({ ...p, cta_url: e.target.value })} placeholder="https://…" /></div>
        </div>
        <RecipientPicker audience={audience} selected={selected} onAudience={setAudience} onSelected={setSelected} allLabel="Wszyscy klienci" />
        {err && <p className="form-msg err">{err}</p>}
        <div className="row-actions sticky-actions">
          <button className="btn btn-gold" type="submit" disabled={busy}><Icon name="send" size={16} /> {busy ? 'Wysyłanie…' : 'Wyślij pop-up'}</button>
        </div>
      </form>
    </div>
  )
}

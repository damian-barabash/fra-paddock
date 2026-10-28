import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { sb } from '../../api'
import { go, href } from '../../router'
import { asset } from '../../../lib/asset'
import { setPublishedTexts, TextEditContext, type TextEditor, type Texts } from '../../../lib/texts'
import E from '../../../components/E'
import Hero from '../../../components/Hero'
import About from '../../../components/About'
import Footer from '../../../components/Footer'
import { ApplyHead } from '../../../components/ApplyModal'
import ApplyForm, { ApplyThanks } from '../../../components/ApplyForm'
import Welcome, { WELCOME_TITLE_ANON } from '../../client/Welcome'
import FormatBar from './FormatBar'
import './site-editor.css'

type PageId = 'glowna' | 'formularz' | 'prezentacja'
const PAGES: { id: PageId; label: string; hint: string }[] = [
  { id: 'glowna', label: 'Strona główna', hint: 'fastlinepaddockclub.pl' },
  { id: 'formularz', label: 'Formularz aplikacji', hint: 'pop-up „Złóż aplikację”' },
  { id: 'prezentacja', label: 'Prezentacja „O Klubie”', hint: 'Strefa Członka' },
]

type Draft = Record<string, string | null>
const noop = () => undefined

/** Visual editor of the site copy. Admins only (the admin app is the only way in, RLS guards the writes). */
export default function SiteEditor({ page: pageParam }: { page?: string }) {
  const page: PageId = PAGES.some((p) => p.id === pageParam) ? (pageParam as PageId) : 'glowna'

  const [pub, setPub] = useState<Texts>({})
  const [draft, setDraft] = useState<Draft>({})
  const [local, setLocal] = useState<Draft>({})
  const [rev, setRev] = useState(0)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState<'' | 'draft' | 'publish' | 'discard'>('')
  const [toast, setToast] = useState<{ text: string; err?: boolean } | null>(null)
  const toastTimer = useRef(0)

  const say = (text: string, err = false) => {
    setToast({ text, err })
    clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), err ? 6000 : 3200)
  }

  const take = (rows: { id: string; data: Record<string, string | null> }[] | Record<string, Record<string, string | null>>) => {
    const map = Array.isArray(rows) ? Object.fromEntries(rows.map((r) => [r.id, r.data])) : rows
    const p = (map.published ?? {}) as Texts
    setPub(p)
    setDraft((map.draft ?? {}) as Draft)
    setPublishedTexts(p)
  }

  useEffect(() => {
    document.title = 'Edytor strony · Fastline Paddock Club'
    sb.from('site_content')
      .select('id, data')
      .then(({ data, error }) => {
        if (error) say('Nie udało się wczytać tekstów: ' + error.message, true)
        else take(data as { id: string; data: Record<string, string | null> }[])
        setReady(true)
        setRev((r) => r + 1)
      })
  }, [])

  // ───────── values ─────────
  const base = useCallback((k: string) => (k in draft ? draft[k] : pub[k] ?? null), [draft, pub])
  const editor = useMemo<TextEditor>(
    () => ({
      rev,
      get: (k) => (k in local ? local[k] : base(k)),
      set: (k, html, original) => {
        const target = html === null || html === original ? null : html
        setLocal((l) => {
          const next = { ...l }
          if (target === base(k)) delete next[k]
          else next[k] = target
          return next
        })
      },
    }),
    [rev, local, base],
  )

  /** what would change on the site if published now */
  const pending = useMemo(() => {
    const all: Draft = { ...draft, ...local }
    return Object.keys(all).filter((k) => {
      const v = all[k] === '' ? null : all[k]
      return v !== (pub[k] ?? null)
    })
  }, [draft, local, pub])
  const unsaved = Object.keys(local).length

  // leaving with unsaved edits
  useEffect(() => {
    if (!unsaved) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [unsaved])

  // ───────── saving ─────────
  const clean = (d: Draft): Draft => Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v === '' ? null : v]))
  const run = async (mode: 'draft' | 'publish' | 'discard', changes: Draft, ok: string) => {
    setBusy(mode)
    const { data, error } = await sb.rpc('site_content_save', { p_mode: mode, p_changes: changes })
    setBusy('')
    if (error) return say('Nie udało się zapisać: ' + error.message, true)
    take(data as Record<string, Record<string, string | null>>)
    setLocal({})
    if (mode === 'discard') setRev((r) => r + 1)
    say(ok)
  }
  const saveDraft = () => {
    if (!unsaved) return say('Brak nowych zmian do zapisania.')
    run('draft', clean(local), 'Zapisano wersję roboczą — na stronie jeszcze jej nie widać.')
  }
  const publish = () => {
    const changes = clean({ ...draft, ...local })
    if (!Object.keys(changes).length) return say('Wszystko jest już opublikowane.')
    run('publish', changes, 'Opublikowano — zmiany są już na stronie.')
  }
  const discard = () => {
    const keys = Object.keys({ ...draft, ...local })
    if (!keys.length) return
    if (!window.confirm('Odrzucić wszystkie nieopublikowane zmiany (także zapisaną wersję roboczą)?')) return
    run('discard', Object.fromEntries(keys.map((k) => [k, null])), 'Odrzucono zmiany — przywrócona opublikowana wersja.')
  }
  const leave = (to: string) => {
    if (unsaved && !window.confirm('Masz niezapisane zmiany. Wyjść bez zapisywania?')) return
    go(to)
  }

  // the page in the editor: chapters fully visible, links and buttons do nothing
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const id = window.setTimeout(() => root.current?.querySelectorAll('.reveal').forEach((el) => el.classList.add('in')), 60)
    window.scrollTo(0, 0)
    return () => clearTimeout(id)
  }, [page, ready])

  const status = unsaved
    ? { cls: 'dirty', text: `Niezapisane zmiany · ${unsaved}` }
    : pending.length
      ? { cls: 'draft', text: `Wersja robocza · ${pending.length} do publikacji` }
      : { cls: 'ok', text: 'Opublikowano' }

  return (
    <div className="se">
      <header className="se-bar">
        <a className="se-brand" href={href('')} onClick={(e) => { e.preventDefault(); leave('') }}>
          <img src={asset('assets/logo.webp')} alt="" />
          <span>Edytor strony</span>
        </a>
        <label className="se-select">
          <span className="sr-only">Strona do edycji</span>
          <select value={page} onChange={(e) => go(`strona/${e.target.value}`)}>
            {PAGES.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
        <span className={`se-status ${status.cls}`}><i />{status.text}</span>
        <span className="se-spacer" />
        {pending.length > 0 && (
          <button type="button" className="se-btn se-ghost" onClick={discard} disabled={!!busy}>Odrzuć</button>
        )}
        <button type="button" className="se-btn" onClick={saveDraft} disabled={!!busy}>
          {busy === 'draft' ? 'Zapisywanie…' : 'Zapisz wersję roboczą'}
        </button>
        <button type="button" className="se-btn se-primary" onClick={publish} disabled={!!busy}>
          {busy === 'publish' ? 'Publikowanie…' : 'Opublikuj'}
        </button>
        <button type="button" className="se-btn se-close" onClick={() => leave('')} aria-label="Zamknij edytor">✕</button>
      </header>

      <div className="se-help">
        <b>{PAGES.find((p) => p.id === page)!.label}</b> · {PAGES.find((p) => p.id === page)!.hint}
        <span>Kliknij tekst, aby go zmienić. Zaznacz fragment — pojawi się pasek formatowania. Shift+Enter = nowa linia. Puste pole przywraca tekst oryginalny.</span>
      </div>

      <TextEditContext.Provider value={editor}>
        <div
          ref={root}
          className={`se-page se-page--${page}${ready ? '' : ' loading'}`}
          key={page}
          // nothing on the page navigates or submits while editing
          onClickCapture={(e) => {
            if ((e.target as Element).closest('a, button, label')) e.preventDefault()
          }}
          onSubmitCapture={(e) => e.preventDefault()}
        >
          {ready && page === 'glowna' && (
            <>
              <Hero intro={false} onDone={noop} />
              <main>
                <About />
              </main>
              <Footer />
            </>
          )}

          {ready && page === 'formularz' && (
            <div className="se-apply">
              <p className="se-caption">Formularz</p>
              <div className="modal-card apply-modal se-card">
                <ApplyHead />
                <ApplyForm />
              </div>
              <p className="se-caption">Po wysłaniu formularza</p>
              <div className="modal-card apply-modal se-card">
                <ApplyThanks />
              </div>
              <p className="se-caption">Komunikaty</p>
              <div className="se-variants">
                <div><span>Przycisk podczas wysyłania</span><E k="apply.sending" def="Wysyłanie…" plain /></div>
              </div>
            </div>
          )}

          {ready && page === 'prezentacja' && (
            <>
              <Welcome open onClose={noop} name="{imię}" firstTime />
              <div className="se-apply">
                <p className="se-caption">Gdy członek otwiera prezentację ponownie (przycisk „O Klubie”)</p>
                <div className="se-variants">
                  <div><span>Nad tytułem</span><E k="welcome.eyebrow" def="Fastline Paddock Club" plain /></div>
                  <div><span>Przycisk zamknięcia</span><E k="welcome.close" def="Zamknij" plain /></div>
                </div>
                <p className="se-caption">Gdy w profilu nie ma imienia</p>
                <div className="se-variants">
                  <div><span>Tytuł</span><E k="welcome.titleAnon" html={WELCOME_TITLE_ANON} /></div>
                </div>
                <p className="se-note">W tytule <code>{'{imię}'}</code> zamienia się na imię członka — zostaw ten znacznik tam, gdzie ma się pojawić imię.</p>
              </div>
            </>
          )}
        </div>
      </TextEditContext.Provider>

      <FormatBar />
      {toast && <div className={`se-toast${toast.err ? ' err' : ''}`} role="status">{toast.text}</div>}
    </div>
  )
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { EVENTS_BLOCK_DEFAULT, loadEventsBlock, sb, syncFpl, type ClubEvent, type EventsBlock, type Popup, type Post, type Rsvp, type Snapshot } from '../api'
import { useSession } from '../session'
import { href, useRoute } from '../router'
import Icon, { type IconName } from '../ui/Icon'
import GoldCoin from '../ui/GoldCoin'
import { fmtNum } from '../ui/format'
import { asset } from '../../lib/asset'
import Home from './Home'
import History from './History'
import Offers from './Offers'
import Profile from './Profile'
import PostView from './PostView'
import Welcome from './Welcome'
import PopupQueue from './PopupQueue'
import { EventsPage, EventView } from './Events'
import SendOffLayer from '../ui/SendOff'

export type MemberData = {
  posts: Post[]
  rsvps: Record<string, Rsvp>
  snapshot: Snapshot | null
  events: ClubEvent[]
  eventsBlock: EventsBlock
  /** `event:<id>` / `offer:<id>` the member has already signed up for */
  signups: Set<string>
  markSigned: (kind: 'event' | 'offer', id: string) => void
  loading: boolean
  syncing: boolean
  reload: () => Promise<void>
  sync: () => Promise<void>
  answer: (postId: string, status: 'yes' | 'no') => Promise<void>
}

const SYNC_EVERY_MS = 10 * 60 * 1000

function useMemberData(userId: string, preview: boolean): MemberData {
  const [posts, setPosts] = useState<Post[]>([])
  const [rsvps, setRsvps] = useState<Record<string, Rsvp>>({})
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [events, setEvents] = useState<ClubEvent[]>([])
  const [eventsBlock, setEventsBlock] = useState<EventsBlock>(EVENTS_BLOCK_DEFAULT)
  const [signups, setSignups] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const reload = useCallback(async () => {
    const now = new Date().toISOString()
    const [p, r, s, ev, block, su] = await Promise.all([
      sb.from('posts').select('*').eq('published', true).lte('published_at', now)
        .order('pinned', { ascending: false }).order('published_at', { ascending: false }).limit(100),
      sb.from('rsvps').select('*').eq('user_id', userId),
      sb.from('fpl_snapshots').select('*').eq('user_id', userId).maybeSingle(),
      sb.from('club_events').select('*').eq('published', true).order('starts_at'),
      loadEventsBlock(),
      sb.from('signups').select('kind, event_id, post_id').eq('user_id', userId),
    ])
    let list = (p.data as Post[]) ?? []
    if (preview) list = list.filter((x) => x.audience === 'all') // admin sees what every member sees
    setPosts(list)
    setRsvps(Object.fromEntries(((r.data as Rsvp[]) ?? []).map((x) => [x.post_id, x])))
    setSnapshot((s.data as Snapshot) ?? null)
    setEvents((ev.data as ClubEvent[]) ?? [])
    setEventsBlock(block)
    setSignups(new Set(((su.data as { kind: string; event_id: string | null; post_id: string | null }[]) ?? []).map((x) => `${x.kind}:${x.event_id ?? x.post_id}`)))
    setLoading(false)
  }, [userId, preview])

  const sync = useCallback(async () => {
    setSyncing(true)
    try {
      const res = await syncFpl()
      if (res.configured) {
        const { data } = await sb.from('fpl_snapshots').select('*').eq('user_id', userId).maybeSingle()
        setSnapshot((data as Snapshot) ?? null)
      }
    } catch { /* keep the last copy */ } finally {
      setSyncing(false)
    }
  }, [userId])

  useEffect(() => {
    reload()
  }, [reload])

  // refresh litres from Performance Lab when the copy is older than 10 minutes
  useEffect(() => {
    if (loading || preview) return
    const last = snapshot?.synced_at ? new Date(snapshot.synced_at).getTime() : 0
    if (Date.now() - last > SYNC_EVERY_MS) sync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const answer = useCallback(async (postId: string, status: 'yes' | 'no') => {
    const row = { post_id: postId, user_id: userId, status, responded_at: new Date().toISOString() }
    const { error } = await sb.from('rsvps').upsert(row)
    if (error) throw new Error('Nie udało się zapisać odpowiedzi.')
    setRsvps((m) => ({ ...m, [postId]: { ...row, note: null } }))
  }, [userId])

  const markSigned = useCallback((kind: 'event' | 'offer', id: string) => setSignups((s) => new Set(s).add(`${kind}:${id}`)), [])

  return { posts, rsvps, snapshot, events, eventsBlock, signups, markSigned, loading, syncing, reload, sync, answer }
}

const tabs: { path: string; label: string; icon: IconName }[] = [
  { path: '', label: 'Paddock', icon: 'home' },
  { path: 'historia', label: 'Historia', icon: 'history' },
  { path: 'oferty', label: 'Oferty', icon: 'offer' },
  { path: 'profil', label: 'Profil', icon: 'user' },
]

export default function ClientApp({ preview = false }: { preview?: boolean }) {
  const { profile } = useSession()
  const route = useRoute()
  const base = preview ? 'podglad/' : ''
  const r = preview ? route.slice(1) : route
  const data = useMemberData(profile!.id, preview)

  const [welcome, setWelcome] = useState(!preview && !profile!.welcome_seen_at)
  const [popups, setPopups] = useState<Popup[]>([])

  useEffect(() => {
    if (preview) return
    sb.from('popup_recipients')
      .select('popup_id, popups(*)')
      .eq('user_id', profile!.id)
      .is('seen_at', null)
      .then(({ data: rows }) => {
        const list = ((rows ?? []) as unknown as { popups: Popup | null }[]).map((x) => x.popups).filter(Boolean) as Popup[]
        setPopups(list.sort((a, b) => a.created_at.localeCompare(b.created_at)))
      })
  }, [preview, profile])

  const closeWelcome = async () => {
    setWelcome(false)
    if (!profile!.welcome_seen_at) await sb.rpc('mark_welcome_seen')
  }

  const page = r[0] ?? ''
  const view = useMemo(() => {
    if (page === 'wpis' && r[1]) return <PostView id={r[1]} data={data} base={base} />
    if (page === 'wydarzenia' && r[1]) return <EventView id={r[1]} data={data} base={base} />
    if (page === 'wydarzenia') return <EventsPage data={data} base={base} />
    if (page === 'historia') return <History data={data} />
    if (page === 'oferty') return <Offers data={data} base={base} />
    if (page === 'profil') return <Profile data={data} onAbout={() => setWelcome(true)} />
    return <Home data={data} base={base} />
  }, [page, r, data, base])

  const balance = data.snapshot?.litres_balance ?? 0

  return (
    <div className="app">
      {preview && (
        <div className="preview-bar">
          <Icon name="eye" size={16} /> Podgląd strefy członka (widzisz treści dla wszystkich)
          <a href={href('')}>Wróć do panelu</a>
        </div>
      )}
      <header className="app-top">
        <a className="app-brand" href={href(base)} aria-label="Paddock">
          <img src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
        </a>
        <div className="app-top-r">
          <a className="gl-chip" href={href(base + 'historia')} aria-label={`Golden Liters: ${fmtNum(balance)}`}>
            <GoldCoin size={22} shine={false} />
            <b>{fmtNum(balance)}</b>
          </a>
          <button type="button" className="about-btn" onClick={() => setWelcome(true)}>
            <Icon name="sparkle" size={15} />
            <span>O Klubie</span>
          </button>
        </div>
      </header>

      <main className="app-main" key={page + (r[1] ?? '')}>{view}</main>

      <nav className="tabbar" aria-label="Nawigacja">
        {tabs.map((t) => {
          const active = t.path === '' ? page === '' || page === 'wpis' || page === 'wydarzenia' : page === t.path
          return (
            <a key={t.label} href={href(base + t.path)} className={active ? 'on' : ''} aria-current={active ? 'page' : undefined}>
              <Icon name={t.icon} size={23} />
              <span>{t.label}</span>
            </a>
          )
        })}
      </nav>

      <SendOffLayer />
      <Welcome open={welcome} onClose={closeWelcome} name={profile!.full_name} firstTime={!profile!.welcome_seen_at && !preview} />
      {!welcome && popups.length > 0 && (
        <PopupQueue
          popup={popups[0]}
          onClose={async () => {
            const p = popups[0]
            setPopups((l) => l.slice(1))
            await sb.rpc('mark_popup_seen', { p_popup: p.id })
          }}
        />
      )}
    </div>
  )
}

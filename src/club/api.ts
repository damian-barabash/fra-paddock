import { supabase } from '../lib/supabase'

if (!supabase) throw new Error('Supabase nie jest skonfigurowany (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).')
export const sb = supabase

// ───────── Types (mirror supabase/platform.sql) ─────────
export type Role = 'admin' | 'client'
export type Profile = {
  id: string
  role: Role
  email: string
  full_name: string
  phone: string | null
  member_no: number
  member_since: string
  fpl_email: string | null
  welcome_seen_at: string | null
  disabled: boolean
  created_at: string
}
export type PostKind = 'post' | 'invitation' | 'offer'
export type Post = {
  id: string
  kind: PostKind
  title: string
  lead: string | null
  body_html: string
  cover_url: string | null
  audience: 'all' | 'selected'
  event_at: string | null
  event_end_at: string | null
  event_place: string | null
  rsvp_until: string | null
  dress_code: string | null
  valid_until: string | null
  cta_label: string | null
  cta_url: string | null
  published: boolean
  pinned: boolean
  published_at: string
  created_at: string
}
export type Rsvp = { post_id: string; user_id: string; status: 'yes' | 'no'; note: string | null; responded_at: string }
export type Popup = {
  id: string
  title: string
  body_html: string
  image_url: string | null
  cta_label: string | null
  cta_url: string | null
  created_at: string
}
export type ClubEvent = {
  id: string
  title: string
  category: string | null
  lead: string | null
  body_html: string
  cover_url: string | null
  starts_at: string
  ends_at: string | null
  place: string | null
  cta_label: string | null
  cta_url: string | null
  post_id: string | null
  published: boolean
  created_at: string
  updated_at: string
}
export type EventsBlock = {
  enabled: boolean
  mode: 'auto' | 'manual'
  featured_id: string | null
  title: string
  all_label: string
  countdown: boolean
  show_past: boolean
}
export const EVENTS_BLOCK_DEFAULT: EventsBlock = {
  enabled: true,
  mode: 'auto',
  featured_id: null,
  title: 'Najbliższe wydarzenie',
  all_label: 'Wszystkie wydarzenia',
  countdown: true,
  show_past: true,
}
export const EVENT_CATEGORIES = ['Track Day', 'Grand Tour', 'Ice Driving', 'Paddock Night', 'Heels on the Track', 'Szkolenie', 'Spotkanie']

/** An event is over once its end (or start, when it has no end) has passed. */
export const eventEnd = (e: ClubEvent) => new Date(e.ends_at ?? e.starts_at).getTime()
export const isUpcoming = (e: ClubEvent, now = Date.now()) => eventEnd(e) >= now

/** The event shown on top: the chosen one (while it is still ahead), otherwise the nearest upcoming. */
export function featuredEvent(events: ClubEvent[], block: EventsBlock, now = Date.now()) {
  const upcoming = events.filter((e) => e.published && isUpcoming(e, now)).sort((a, b) => a.starts_at.localeCompare(b.starts_at))
  if (block.mode === 'manual' && block.featured_id) {
    const pick = upcoming.find((e) => e.id === block.featured_id)
    if (pick) return pick
  }
  return upcoming[0] ?? null
}

export async function loadEventsBlock(): Promise<EventsBlock> {
  const { data } = await sb.from('club_settings').select('value').eq('key', 'events_block').maybeSingle()
  return { ...EVENTS_BLOCK_DEFAULT, ...((data?.value as Partial<EventsBlock>) ?? {}) }
}

export type FplSession = {
  id: string
  date: string
  endsAt: string | null
  location: string
  program: string
  isHeels: boolean
  attended: boolean
  status: string
  cars: string[]
  coverImageUrl: string | null
}
export type FplTrip = {
  id: string
  title: string
  category: string
  city: string
  country: string
  startDate: string
  endDate: string
  selectedDates: string[]
  bookingStatus: string
  coverImageUrl: string | null
}
export type FplLitre = { id: string; amount: number; kind: 'PAYMENT' | 'ADJUSTMENT'; note: string | null; createdAt: string }
export type Snapshot = {
  user_id: string
  found: boolean
  litres_balance: number
  litres: FplLitre[]
  sessions: FplSession[]
  trips: FplTrip[]
  synced_at: string | null
  error: string | null
}

// ───────── Edge functions ─────────
/** Calls an edge function and turns its `{ error }` reply into a readable exception. */
export async function callFn<T = unknown>(name: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await sb.functions.invoke(name, { body })
  if (error) {
    let msg = 'Coś poszło nie tak. Spróbuj ponownie.'
    try {
      const ctx = (error as { context?: Response }).context
      const j = ctx ? await ctx.json() : null
      if (j?.error) msg = j.error
    } catch { /* keep default */ }
    throw new Error(msg)
  }
  if (data && typeof data === 'object' && 'error' in data && (data as { error?: string }).error) {
    throw new Error((data as { error: string }).error)
  }
  return data as T
}

/** Pulls fresh litres and history from Performance Lab (silently does nothing until configured). */
export async function syncFpl(opts: { user_id?: string; all?: boolean } = {}) {
  return callFn<{ configured: boolean; results?: { id: string; found?: boolean; error?: string }[] }>('fpl-sync', opts)
}

// ───────── Images ─────────
/** Downscales to max 2000 px, converts to WebP and uploads to the public `media` bucket. */
export async function uploadImage(file: File, folder = 'posts'): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob: Blob = await new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error('Nie udało się przetworzyć zdjęcia.'))), 'image/webp', 0.84),
  )
  const path = `${folder}/${crypto.randomUUID()}.webp`
  const { error } = await sb.storage.from('media').upload(path, blob, { contentType: 'image/webp', cacheControl: '31536000' })
  if (error) throw new Error('Nie udało się wgrać zdjęcia.')
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl
}

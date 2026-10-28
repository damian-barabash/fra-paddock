import { createContext, useContext, useSyncExternalStore } from 'react'
import { SUPABASE_ANON, SUPABASE_URL } from './supabase'

/**
 * Site copy overrides from Panel Klubu → „Strona” (table `site_content`, row `published`).
 * A key missing here means the original text from the code is shown.
 * The last published set is cached in the browser, so a returning visitor sees it at once.
 */
export type Texts = Record<string, string>

const CACHE = 'fpc:texts:v1'
let published: Texts = readCache()
const subs = new Set<() => void>()

function readCache(): Texts {
  try {
    return JSON.parse(localStorage.getItem(CACHE) || '{}') as Texts
  } catch {
    return {}
  }
}

export function setPublishedTexts(next: Texts) {
  published = next
  try {
    localStorage.setItem(CACHE, JSON.stringify(next))
  } catch {
    /* private mode — fine */
  }
  subs.forEach((f) => f())
}

let loading: Promise<void> | null = null
export function loadTexts() {
  loading ??= fetch(`${SUPABASE_URL}/rest/v1/site_content?id=eq.published&select=data`, {
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((rows: { data: Texts }[]) => setPublishedTexts(rows[0]?.data ?? {}))
    .catch(() => {
      /* offline or table missing — the original texts stay */
    })
  return loading
}

const subscribe = (f: () => void) => {
  subs.add(f)
  return () => subs.delete(f)
}
export const usePublishedTexts = () => useSyncExternalStore(subscribe, () => published)

/** Present only inside the visual editor. `get` returns null when the original text applies. */
export type TextEditor = {
  get: (k: string) => string | null
  set: (k: string, html: string | null, original: string) => void
  /** bumps when values change from outside (discard, page switch) so fields re-read them */
  rev: number
}
export const TextEditContext = createContext<TextEditor | null>(null)
export const useTextEditor = () => useContext(TextEditContext)
export const useEditing = () => useContext(TextEditContext) !== null

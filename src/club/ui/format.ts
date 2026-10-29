const tz = 'Europe/Warsaw'
export const fmtDate = (d?: string | null) =>
  d ? new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: tz }).format(new Date(d)) : ''
export const fmtShort = (d?: string | null) =>
  d ? new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: tz }).format(new Date(d)) : ''
export const fmtTime = (d?: string | null) =>
  d ? new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(new Date(d)) : ''
export const fmtDay = (d: string) => new Intl.DateTimeFormat('pl-PL', { day: 'numeric', timeZone: tz }).format(new Date(d))
export const fmtMonth = (d: string) => new Intl.DateTimeFormat('pl-PL', { month: 'long', timeZone: tz }).format(new Date(d))
export const fmtWeekday = (d: string) => new Intl.DateTimeFormat('pl-PL', { weekday: 'long', timeZone: tz }).format(new Date(d))
export const fmtYear = (d: string) => new Intl.DateTimeFormat('pl-PL', { year: 'numeric', timeZone: tz }).format(new Date(d))
export const fmtNum = (n: number) => new Intl.NumberFormat('pl-PL').format(n)
/** Polish plural: plural(5, 'wyprawa', 'wyprawy', 'wypraw') → 'wypraw'. */
export function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one
  const d = n % 10
  const h = n % 100
  return d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many
}
export const memberNo = (n: number) => String(n).padStart(4, '0')

/** `<input type="datetime-local">` ⇄ ISO (in the browser's time zone, which for the club is Warsaw). */
export const toLocalInput = (iso?: string | null) => {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}
export const fromLocalInput = (v: string) => (v ? new Date(v).toISOString() : null)

export const firstName = (full: string) => full.trim().split(/\s+/)[0] || ''

/** A memorable temporary password for a new member (no look-alike characters). */
/** Starting password: 10 capital letters (no I / O, so nobody confuses them with 1 / 0). */
export function makePassword() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const r = crypto.getRandomValues(new Uint32Array(10))
  return Array.from(r, (x) => a[x % a.length]).join('')
}

/** Internal login address of members who sign in only with a phone (see supabase/phone-login.sql). */
export const isPhoneLogin = (email?: string | null) => !!email && email.endsWith('@telefon.fastlinepaddockclub.pl')
/** E-mail for display: empty for phone-only members. */
export const shownEmail = (email?: string | null) => (isPhoneLogin(email) ? '' : email ?? '')

import { useState } from 'react'
import { motion } from 'framer-motion'
import { sb } from './api'
import { SUPABASE_ANON, SUPABASE_URL } from '../lib/supabase'
import { asset } from '../lib/asset'
import { home } from '../lib/links'
import { CONTACT_EMAIL } from '../content'

const ease = [0.22, 1, 0.36, 1] as const
type Result = 'ok' | 'bad' | 'error'

async function byEmail(email: string, password: string): Promise<Result> {
  const { error } = await sb.auth.signInWithPassword({ email, password })
  if (!error) return 'ok'
  return /invalid/i.test(error.message) ? 'bad' : 'error'
}

/** Phone = the last 9 digits (with or without +48, spaces, dashes); the server finds the account. */
async function byPhone(phone: string, password: string): Promise<Result> {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 9) return 'bad'
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/phone-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
      body: JSON.stringify({ phone: digits, password }),
    })
    const j = await res.json().catch(() => null)
    if (!res.ok || !j?.access_token) return j?.error === 'invalid' ? 'bad' : 'error'
    const { error } = await sb.auth.setSession({ access_token: j.access_token, refresh_token: j.refresh_token })
    return error ? 'error' : 'ok'
  } catch {
    return 'error'
  }
}

/** Members-only sign-in. There is no registration: accounts are created by the club. */
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [forgot, setForgot] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setErr('')
    setBusy(true)
    const login = email.trim()
    const r = login.includes('@') ? await byEmail(login, password) : await byPhone(login, password)
    setBusy(false)
    if (r === 'bad') setErr('Nieprawidłowy login lub hasło.')
    else if (r === 'error') setErr('Nie udało się zalogować. Spróbuj ponownie.')
  }

  return (
    <div className="auth">
      <video className="auth-film" src={asset('assets/preloader.webm')} poster={asset('assets/preloader-end.webp')} muted playsInline autoPlay aria-hidden="true" />
      <div className="auth-scrim" aria-hidden="true" />
      <motion.div className="auth-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.2 }}>
        <a href={home()} aria-label="Strona główna">
          <img className="auth-logo" src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
        </a>
        <span className="eyebrow-line">Strefa Członka</span>
        <h1>Witamy w Paddocku.</h1>
        <p className="auth-lead">Zaloguj się danymi otrzymanymi od Klubu.</p>

        <form className="form auth-form" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="login-email">E-mail lub telefon</label>
            <input id="login-email" type="text" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} autoComplete="username" placeholder="np. 600 000 000" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="login-pass">Hasło</label>
            <input id="login-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {err && <p className="form-msg err" role="alert">{err}</p>}
          <button className="btn btn-gold" type="submit" disabled={busy || !email || !password}>
            {busy ? 'Logowanie…' : 'Zaloguj'} <span className="btn-arrow">→</span>
          </button>
        </form>

        <button type="button" className="auth-link" onClick={() => setForgot((v) => !v)}>
          Nie pamiętasz hasła?
        </button>
        {forgot && (
          <p className="auth-note">
            Napisz do opiekuna Klubu na <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> — ustawimy nowe hasło.
          </p>
        )}
        <p className="auth-foot">Członkostwo wyłącznie na zaproszenie · Est. MMXXVI</p>
      </motion.div>
    </div>
  )
}

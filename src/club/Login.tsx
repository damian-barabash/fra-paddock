import { useState } from 'react'
import { motion } from 'framer-motion'
import { sb } from './api'
import { asset } from '../lib/asset'
import { home } from '../lib/links'
import { CONTACT_EMAIL } from '../content'

const ease = [0.22, 1, 0.36, 1] as const

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
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) setErr(/invalid/i.test(error.message) ? 'Nieprawidłowy e-mail lub hasło.' : 'Nie udało się zalogować. Spróbuj ponownie.')
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
            <label htmlFor="login-email">E-mail</label>
            <input id="login-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
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

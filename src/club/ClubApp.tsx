import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SessionProvider, useSession } from './session'
import Login from './Login'
import ClientApp from './client/ClientApp'
import AdminApp from './admin/AdminApp'
import { useRoute } from './router'
import { asset } from '../lib/asset'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Every screen change (splash → login → app) cross-fades instead of jumping.
 * Opacity only: a transform or filter here would break `position: fixed` inside (tab bar, pop-ups).
 */
function Screen({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <motion.div
      key={id}
      className="screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease } }}
      transition={{ duration: 0.8, ease }}
    >
      {children}
    </motion.div>
  )
}

function Gate() {
  const { session, profile, loading, signOut } = useSession()
  const route = useRoute()
  const last = useRef('')

  let id: string
  let view: React.ReactNode
  if (loading && session && last.current === 'login') {
    // just signed in: keep the login card („Logowanie…”) until the profile is in, then fade straight to the club
    id = 'login'
    view = <Login />
  } else if (loading) {
    id = 'splash'
    view = <Splash />
  } else if (!session) {
    id = 'login'
    view = <Login />
  } else if (!profile || profile.disabled) {
    id = 'no-access'
    view = (
      <div className="auth">
        <div className="auth-card">
          <img className="auth-logo" src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
          <h1>Brak dostępu</h1>
          <p className="auth-lead">To konto nie ma aktywnego członkostwa. Skontaktuj się z opiekunem Klubu.</p>
          <button className="btn" onClick={signOut}>Wyloguj</button>
        </div>
      </div>
    )
  } else if (profile.role === 'admin' && route[0] !== 'podglad') {
    // admins can preview the members' area under #/podglad
    id = 'admin'
    view = <AdminApp />
  } else {
    id = 'member'
    view = <ClientApp preview={profile.role === 'admin'} />
  }

  last.current = id
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Screen id={id} key={id}>{view}</Screen>
    </AnimatePresence>
  )
}

export function Splash() {
  return (
    <div className="splash" aria-busy="true" aria-label="Wczytywanie">
      <img src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
      <i className="splash-line" />
    </div>
  )
}

export default function ClubApp() {
  return (
    <SessionProvider>
      <Gate />
    </SessionProvider>
  )
}

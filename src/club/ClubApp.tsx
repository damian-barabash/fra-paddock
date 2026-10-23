import { SessionProvider, useSession } from './session'
import Login from './Login'
import ClientApp from './client/ClientApp'
import AdminApp from './admin/AdminApp'
import { useRoute } from './router'
import { asset } from '../lib/asset'

function Gate() {
  const { session, profile, loading, signOut } = useSession()
  const route = useRoute()

  if (loading) return <Splash />
  if (!session) return <Login />
  if (!profile || profile.disabled) {
    return (
      <div className="auth">
        <div className="auth-card">
          <img className="auth-logo" src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
          <h1>Brak dostępu</h1>
          <p className="auth-lead">To konto nie ma aktywnego członkostwa. Skontaktuj się z opiekunem Klubu.</p>
          <button className="btn" onClick={signOut}>Wyloguj</button>
        </div>
      </div>
    )
  }
  // admins can preview the members' area under #/podglad
  if (profile.role === 'admin' && route[0] !== 'podglad') return <AdminApp />
  return <ClientApp preview={profile.role === 'admin'} />
}

export function Splash() {
  return (
    <div className="splash" aria-busy="true">
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

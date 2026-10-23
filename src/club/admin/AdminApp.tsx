import { useSession } from '../session'
import { href, useRoute } from '../router'
import Icon, { type IconName } from '../ui/Icon'
import { asset } from '../../lib/asset'
import Clients from './Clients'
import ClientDetail from './ClientDetail'
import Admins from './Admins'
import Posts from './Posts'
import PostEditor from './PostEditor'
import Popups from './Popups'
import PopupEditor from './PopupEditor'
import Applications from './Applications'

const nav: { path: string; label: string; icon: IconName; mobile?: boolean }[] = [
  { path: '', label: 'Klienci', icon: 'users', mobile: true },
  { path: 'tresci', label: 'Treści', icon: 'feed', mobile: true },
  { path: 'popupy', label: 'Pop-upy', icon: 'bell', mobile: true },
  { path: 'zgloszenia', label: 'Zgłoszenia', icon: 'inbox', mobile: true },
  { path: 'admini', label: 'Administratorzy', icon: 'shield' },
  { path: 'podglad', label: 'Widok członka', icon: 'eye' },
]

export default function AdminApp() {
  const { profile, signOut } = useSession()
  const r = useRoute()
  const page = r[0] ?? ''

  let view
  if (page === 'klienci' && r[1]) view = <ClientDetail id={r[1]} />
  else if (page === 'tresci' && r[1]) view = <PostEditor id={r[1]} />
  else if (page === 'tresci') view = <Posts />
  else if (page === 'popupy' && r[1]) view = <PopupEditor id={r[1]} />
  else if (page === 'popupy') view = <Popups />
  else if (page === 'zgloszenia') view = <Applications />
  else if (page === 'admini') view = <Admins />
  else view = <Clients />

  const isOn = (p: string) => (p === '' ? page === '' || page === 'klienci' : page === p)

  return (
    <div className="admin">
      <aside className="admin-side">
        <a className="admin-brand" href={href('')}>
          <img src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
          <span>Panel Klubu</span>
        </a>
        <nav>
          {nav.map((n) => (
            <a key={n.label} href={href(n.path)} className={isOn(n.path) ? 'on' : ''}>
              <Icon name={n.icon} size={19} /> {n.label}
            </a>
          ))}
        </nav>
        <div className="admin-me">
          <span>{profile!.full_name || profile!.email}</span>
          <button type="button" onClick={signOut}><Icon name="logout" size={16} /> Wyloguj</button>
        </div>
      </aside>

      <header className="admin-top">
        <img src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
        <div>
          <a href={href('admini')} aria-label="Administratorzy"><Icon name="shield" size={20} /></a>
          <a href={href('podglad')} aria-label="Widok członka"><Icon name="eye" size={20} /></a>
          <button type="button" onClick={signOut} aria-label="Wyloguj"><Icon name="logout" size={20} /></button>
        </div>
      </header>

      <main className="admin-main" key={r.join('/')}>{view}</main>

      <nav className="tabbar admin-tabbar" aria-label="Panel">
        {nav.filter((n) => n.mobile).map((n) => (
          <a key={n.label} href={href(n.path)} className={isOn(n.path) ? 'on' : ''}>
            <Icon name={n.icon} size={22} />
            <span>{n.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}

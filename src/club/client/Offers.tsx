import type { MemberData } from './ClientApp'
import { useSession } from '../session'
import OfferCard from './OfferCard'

export default function Offers({ data, base }: { data: MemberData; base: string }) {
  const { profile } = useSession()
  const now = Date.now()
  const offers = data.posts.filter((p) => p.kind === 'offer')
  const active = offers.filter((p) => !p.valid_until || new Date(p.valid_until).getTime() > now)
  const old = offers.filter((p) => p.valid_until && new Date(p.valid_until).getTime() <= now)
  return (
    <div className="page">
      <header className="page-head">
        <span className="eyebrow-line">Oferty ekskluzywne</span>
        <h1>Przygotowane dla Członków.</h1>
      </header>
      {active.length ? (
        <div className="offer-list">{active.map((p) => <OfferCard key={p.id} post={p} base={base} name={profile!.full_name} />)}</div>
      ) : (
        <p className="empty">Nowe oferty pojawią się tutaj — damy znać.</p>
      )}
      {old.length > 0 && (
        <section className="block">
          <h2 className="block-h"><span>Zakończone</span><i /></h2>
          <div className="offer-list">{old.map((p) => <OfferCard key={p.id} post={p} base={base} />)}</div>
        </section>
      )}
    </div>
  )
}

import type { MemberData } from './ClientApp'
import { useSession } from '../session'
import MemberCard from './MemberCard'
import InvitationCard from './InvitationCard'
import OfferCard from './OfferCard'
import NewsCard from './NewsCard'
import { firstName } from '../ui/format'
import { NextEvent } from './Events'

const greeting = () => {
  const h = Number(new Intl.DateTimeFormat('pl-PL', { hour: 'numeric', hour12: false, timeZone: 'Europe/Warsaw' }).format(new Date()))
  return h >= 18 || h < 5 ? 'Dobry wieczór' : 'Dzień dobry'
}

export default function Home({ data, base }: { data: MemberData; base: string }) {
  const { profile } = useSession()
  const now = Date.now()
  const invitations = data.posts
    .filter((p) => p.kind === 'invitation' && (!p.event_at || new Date(p.event_end_at ?? p.event_at).getTime() > now - 864e5))
    .sort((a, b) => (a.event_at ?? '').localeCompare(b.event_at ?? ''))
  const offers = data.posts.filter((p) => p.kind === 'offer' && (!p.valid_until || new Date(p.valid_until).getTime() > now))
  const news = data.posts.filter((p) => p.kind === 'post')
  const fn = firstName(profile!.full_name)

  return (
    <div className="page">
      <h1 className="page-hello">
        {greeting()}{fn ? <>, <em>{fn}</em></> : null}.
      </h1>
      <MemberCard profile={profile!} snapshot={data.snapshot} syncing={data.syncing} />
      <NextEvent data={data} base={base} />

      {invitations.length > 0 && (
        <section className="block">
          <h2 className="block-h"><span>Zaproszenia</span><i /></h2>
          <div className="invite-list">
            {invitations.map((p) => (
              <InvitationCard key={p.id} post={p} name={profile!.full_name} rsvp={data.rsvps[p.id]} onAnswer={data.answer} base={base} />
            ))}
          </div>
        </section>
      )}

      {offers.length > 0 && (
        <section className="block">
          <h2 className="block-h"><span>Oferty dla Ciebie</span><i /></h2>
          <div className="offer-list">
            {offers.slice(0, 2).map((p) => <OfferCard key={p.id} post={p} base={base} name={profile!.full_name} />)}
          </div>
        </section>
      )}

      <section className="block">
        <h2 className="block-h"><span>Aktualności Klubu</span><i /></h2>
        {data.loading ? (
          <div className="skeleton" />
        ) : news.length ? (
          <div className="news-list">{news.map((p) => <NewsCard key={p.id} post={p} base={base} />)}</div>
        ) : (
          <p className="empty">Wkrótce pojawią się tu wiadomości z Klubu.</p>
        )}
      </section>
    </div>
  )
}

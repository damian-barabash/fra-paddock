import { useEffect, useState } from 'react'
import type { MemberData } from './ClientApp'
import { sb, type Post } from '../api'
import { useSession } from '../session'
import { href } from '../router'
import Icon from '../ui/Icon'
import RichContent from '../ui/RichContent'
import InvitationCard from './InvitationCard'
import { fmtDate } from '../ui/format'
import { sendOff } from '../ui/SendOff'

export default function PostView({ id, data, base }: { id: string; data: MemberData; base: string }) {
  const { profile } = useSession()
  const [post, setPost] = useState<Post | null | undefined>(() => data.posts.find((p) => p.id === id))

  useEffect(() => {
    if (post) return
    sb.from('posts').select('*').eq('id', id).maybeSingle().then(({ data: p }) => setPost((p as Post) ?? null))
  }, [id, post])

  if (post === undefined) return <div className="page"><div className="skeleton" /></div>
  if (post === null) {
    return (
      <div className="page">
        <p className="empty">Ten wpis nie jest już dostępny.</p>
        <a className="link-line" href={href(base)}>Wróć do Paddocku</a>
      </div>
    )
  }

  const back = post.kind === 'offer' ? 'oferty' : ''
  const expired = post.kind === 'offer' && post.valid_until ? new Date(post.valid_until).getTime() < Date.now() : false

  return (
    <article className="page post">
      <a className="back" href={href(base + back)}><Icon name="back" size={18} /> {post.kind === 'offer' ? 'Oferty' : 'Paddock'}</a>

      {post.kind === 'invitation' ? (
        <InvitationCard post={post} name={profile!.full_name} rsvp={data.rsvps[post.id]} onAnswer={data.answer} base={base} full />
      ) : (
        <>
          {post.cover_url && <div className="post-cover" style={{ backgroundImage: `url(${post.cover_url})` }} role="img" aria-label={post.title} />}
          <header className="post-head">
            <span className="eyebrow-line">
              {post.kind === 'offer' ? (post.audience === 'selected' ? 'Oferta imienna' : 'Oferta dla Członków') : fmtDate(post.published_at)}
            </span>
            <h1>{post.title}</h1>
            {post.lead && <p className="post-lead">{post.lead}</p>}
            {post.kind === 'offer' && post.valid_until && (
              <p className="offer-valid">{expired ? 'Oferta wygasła' : `Ważna do ${fmtDate(post.valid_until)}`}</p>
            )}
          </header>
        </>
      )}

      <RichContent html={post.body_html} className="post-body" />

      {post.kind === 'offer' && post.cta_url && !expired && (
        <a
          className="btn btn-gold post-cta"
          href={post.cta_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => sendOff(e, {
            kicker: post.audience === 'selected' ? 'Oferta imienna' : 'Oferta dla Członków',
            title: post.title,
            meta: post.valid_until ? `Ważna do ${fmtDate(post.valid_until)}` : undefined,
            name: profile!.full_name,
            memberNo: profile!.member_no,
            url: post.cta_url!,
            kind: 'offer',
            ref: post.id,
          })}
        >
          {post.cta_label || 'Skorzystaj'} <span className="btn-arrow">→</span>
        </a>
      )}
    </article>
  )
}

import type { Post } from '../api'
import Icon from '../ui/Icon'
import { fmtDate } from '../ui/format'
import { href } from '../router'

/** Exclusive offer — gold-edged card, marked "Tylko dla Ciebie" when addressed personally. */
export default function OfferCard({ post, base, name }: { post: Post; base: string; name?: string }) {
  const expired = post.valid_until ? new Date(post.valid_until).getTime() < Date.now() : false
  return (
    <article className={`offer${expired ? ' offer--expired' : ''}`}>
      {post.cover_url && <div className="offer-cover" style={{ backgroundImage: `url(${post.cover_url})` }} role="img" aria-label={post.title} />}
      <div className="offer-body">
        <span className="offer-kicker">
          <Icon name="offer" size={14} /> {post.audience === 'selected' ? 'Oferta imienna' : 'Oferta dla Członków'}
        </span>
        {post.audience === 'selected' && name && <p className="offer-for">Imiennie: <em>{name}</em></p>}
        <h3><a href={href(base + 'wpis/' + post.id)}>{post.title}</a></h3>
        {post.lead && <p className="offer-lead">{post.lead}</p>}
        <div className="offer-foot">
          {post.valid_until && (
            <span className="offer-valid">{expired ? 'Oferta wygasła' : `Ważna do ${fmtDate(post.valid_until)}`}</span>
          )}
          <a className="link-line" href={href(base + 'wpis/' + post.id)}>
            Szczegóły <span className="btn-arrow">→</span>
          </a>
        </div>
      </div>
    </article>
  )
}

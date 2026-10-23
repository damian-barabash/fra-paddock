import type { Post } from '../api'
import { fmtDate } from '../ui/format'
import { href } from '../router'

/** A feed entry: news from the club. */
export default function NewsCard({ post, base }: { post: Post; base: string }) {
  return (
    <article className="news">
      <a className="news-link" href={href(base + 'wpis/' + post.id)}>
        {post.cover_url && <div className="news-cover" style={{ backgroundImage: `url(${post.cover_url})` }} role="img" aria-label={post.title} />}
        <div className="news-body">
          <span className="news-meta">
            {post.pinned && <b>Przypięte · </b>}
            {fmtDate(post.published_at)}
          </span>
          <h3>{post.title}</h3>
          {post.lead && <p>{post.lead}</p>}
          <span className="link-line">Czytaj <span className="btn-arrow">→</span></span>
        </div>
      </a>
    </article>
  )
}

import { useReveal } from '../lib/hooks'
import { comparison } from '../content'

function Cell({ v }: { v: string }) {
  if (v === '✓')
    return (
      <span className="cmp-yes" aria-label="tak">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    )
  if (v === '—') return <span className="cmp-no" aria-label="niedostępne">—</span>
  return <span className="cmp-val">{v}</span>
}

export default function Comparison() {
  const head = useReveal<HTMLDivElement>()
  const wrap = useReveal<HTMLDivElement>()
  return (
    <section className="section comparison" id="zakres">
      <div className="wrap">
        <div className="section-head reveal" ref={head}>
          <span className="eyebrow">Zakres członkostwa</span>
          <h2>Co obejmuje każdy z poziomów.</h2>
        </div>

        <div className="cmp reveal" ref={wrap}>
          <div className="cmp-scroll">
            <table className="cmp-table">
              <thead>
                <tr>
                  <th className="cmp-feature-h">Przywilej</th>
                  {comparison.cols.map((c) => (
                    <th key={c} className={c === 'VIP' ? 'cmp-col-featured' : ''}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((r) => (
                  <tr key={r[0]}>
                    <td className="cmp-feature">{r[0]}</td>
                    <td><Cell v={r[1]} /></td>
                    <td className="cmp-col-featured"><Cell v={r[2]} /></td>
                    <td><Cell v={r[3]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

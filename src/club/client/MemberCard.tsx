import { useEffect, useRef, useState } from 'react'
import type { Profile, Snapshot } from '../api'
import GoldCoin from '../ui/GoldCoin'
import { fmtNum, fmtShort, memberNo } from '../ui/format'
import { asset } from '../../lib/asset'
import { prefersReducedMotion } from '../../lib/hooks'

/** Counts up to the balance once, with an ease-out. */
function useCount(target: number) {
  const [v, setV] = useState(prefersReducedMotion() ? target : 0)
  const from = useRef(0)
  useEffect(() => {
    if (prefersReducedMotion()) return setV(target)
    const start = performance.now()
    const a = from.current
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1600)
      setV(Math.round(a + (target - a) * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return v
}

/** The member's card on top of the Paddock: identity + Golden Liters balance. */
export default function MemberCard({ profile, snapshot, syncing }: { profile: Profile; snapshot: Snapshot | null; syncing: boolean }) {
  const balance = snapshot?.litres_balance ?? 0
  const shown = useCount(balance)
  const card = useRef<HTMLDivElement>(null)

  // subtle tilt + light sweep following the pointer (desktop)
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion()) return
    const r = card.current!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    card.current!.style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`)
    card.current!.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`)
    card.current!.style.setProperty('--lx', `${((x + 0.5) * 100).toFixed(1)}%`)
  }
  const onLeave = () => {
    card.current?.style.setProperty('--rx', '0deg')
    card.current?.style.setProperty('--ry', '0deg')
  }

  return (
    <section className="member" aria-label="Karta członka">
      <div className="member-card" ref={card} onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="member-glare" aria-hidden="true" />
        <div className="member-row">
          <img className="member-crest" src={asset('assets/logo.webp')} alt="" aria-hidden="true" />
          <span className="member-chip" aria-hidden="true"><i /><i /><i /></span>
        </div>

        <div className="member-balance">
          <GoldCoin size={64} />
          <div>
            <span className="member-k">Golden Liters</span>
            <b className="member-gl">{fmtNum(shown)}</b>
          </div>
        </div>

        <div className="member-row member-id">
          <div>
            <span className="member-k">Członek</span>
            <span className="member-name">{profile.full_name || profile.email}</span>
          </div>
          <div className="member-no">
            <span className="member-k">Nr</span>
            <span>{memberNo(profile.member_no)}</span>
          </div>
        </div>
      </div>
      <p className="member-sync">
        {syncing
          ? 'Aktualizacja z Performance Lab…'
          : snapshot?.synced_at
            ? `Saldo z Performance Lab · ${fmtShort(snapshot.synced_at)}`
            : `Członek od ${fmtShort(profile.member_since)}`}
      </p>
    </section>
  )
}

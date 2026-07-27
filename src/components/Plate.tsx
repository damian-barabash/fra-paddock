import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'

/** Engraved medallion divider — the collection plate with the top-down supercar. */
export default function Plate() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="plate reveal" ref={ref} aria-label="Fastline Supercars">
      <div className="plate-ring">
        <img src={asset('assets/car.webp')} alt="" aria-hidden="true" data-parallax="-40" />
      </div>
      <div className="plate-cap">
        <span className="cap-main">Fastline Supercars</span>
        <span className="cap-sub">Świat Fastline</span>
      </div>
    </section>
  )
}

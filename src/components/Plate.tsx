import E from './E'
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
        <E className="cap-main" k="plate.main" def="Fastline Supercars" plain />
        <E className="cap-sub" k="plate.sub" def="Świat Fastline" plain />
      </div>
    </section>
  )
}

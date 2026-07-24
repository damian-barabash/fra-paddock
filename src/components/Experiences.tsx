import { useReveal } from '../lib/hooks'

const rows = [
  {
    place: 'Riwiera Francuska',
    name: 'Monaco Grand Prix',
    desc: 'Weekend w cieniu barier F1. Trybuna, padok i wieczór, o którym się nie opowiada.',
    tag: 'Rajd',
  },
  {
    place: 'Koło podbiegunowe',
    name: 'Laponia Ice',
    desc: 'Drift na zamarzniętym jeziorze pod zorzą. Kolce, kontrola poślizgu i cisza.',
    tag: 'Ice Driving',
  },
  {
    place: 'Tor wyścigowy',
    name: 'Driver2Racer',
    desc: 'Od pierwszego okrążenia do licencji wyścigowej. Program prowadzony przez Fastline.',
    tag: 'Tor',
  },
  {
    place: 'Alpy Włoskie',
    name: 'Dolomity Sunrise',
    desc: 'Przełęcze o świcie, śniadanie na dwóch tysiącach metrów, serpentyny bez ruchu.',
    tag: 'Rajd',
  },
]

export default function Experiences() {
  const head = useReveal<HTMLDivElement>()
  const list = useReveal<HTMLDivElement>()
  return (
    <section className="section exp" id="doswiadczenia">
      <div className="wrap">
        <div className="section-head reveal" ref={head}>
          <span className="eyebrow">Doświadczenia</span>
          <h2>Kalendarz, którego nie ma nigdzie indziej.</h2>
          <p>
            Kilka razy w roku Klub znika z radaru. To wtedy dzieje się to,
            po co się do niego wchodzi.
          </p>
        </div>

        <div className="exp-list reveal" ref={list}>
          {rows.map((r, i) => (
            <div className="exp-row" key={r.name}>
              <span className="exp-num data">/ {String(i + 1).padStart(2, '0')}</span>
              <div className="exp-name">
                {r.name}
                <span className="place">{r.place}</span>
              </div>
              <p className="exp-desc">{r.desc}</p>
              <span className="exp-tag">{r.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

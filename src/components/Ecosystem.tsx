import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'

export default function Ecosystem() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="section ecosystem" id="swiat">
      <div className="wrap reveal" ref={ref}>
        <div className="eco-grid">
          <div
            className="eco-photo"
            style={{ backgroundImage: `url(${asset('assets/meet-2.webp')})` }}
            role="img"
            aria-label="Członkowie Fastline Paddock Club podczas zlotu supersamochodów"
          />
          <div className="eco-copy">
            <span className="eyebrow">Świat doświadczeń Fastline</span>
            <h2>Członkostwo jako część całego ekosystemu.</h2>
            <p>
              Fastline Paddock Club łączy wszystkie projekty, wydarzenia i aktywności
              realizowane przez Fastline Racing Academy. Dzięki temu członkostwo staje
              się naturalnym elementem świata Fastline, a nie tylko dodatkiem do
              pojedynczych usług.
            </p>
            <p className="eco-soft">
              Każdy kolejny wyjazd, trening czy projekt wzmacnia wartość członkostwa,
              otwierając dostęp do doświadczeń niedostępnych dla osób spoza Klubu.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useReveal } from '../lib/hooks'

const items = [
  {
    t: 'Dostęp do padoku',
    d: 'Strefa, do której nie kupisz biletu. Boksy, pit-lane i garaże zespołów — na Twoich warunkach.',
  },
  {
    t: 'Dni torowe na wyłączność',
    d: 'Tor zamknięty wyłącznie dla Klubu. Bez limitu okrążeń, z instruktorem u boku.',
  },
  {
    t: 'Rajdy supersamochodów',
    d: 'Zamknięte trasy przez Alpy, Dolomity i Riwierę. Konwój, który zatrzymuje ruch.',
  },
  {
    t: 'Concierge motorsport',
    d: 'Transport auta, rezerwacje, bilety na wyścigi. Jeden telefon załatwia wszystko.',
  },
  {
    t: 'Garaż i przechowanie',
    d: 'Klimatyzowane miejsce dla kolekcji, serwis i detailing pod jednym adresem.',
  },
  {
    t: 'Loża na wydarzeniach',
    d: 'Priorytet i strefa VIP na każdym evencie w ekosystemie Fastline.',
  },
]

export default function Privileges() {
  const head = useReveal<HTMLDivElement>()
  const grid = useReveal<HTMLDivElement>()
  return (
    <section className="section" id="przywileje">
      <div className="wrap">
        <div className="section-head reveal" ref={head}>
          <span className="eyebrow">Przywileje</span>
          <h2>Sześć powodów, dla których bariera znika.</h2>
          <p>
            Członkostwo nie jest listą zniżek. To zestaw drzwi, które otwierają się
            tylko od środka.
          </p>
        </div>

        <div className="priv-grid reveal" ref={grid}>
          {items.map((it, i) => (
            <article className="priv-card" key={it.t}>
              <span className="priv-idx">{String(i + 1).padStart(2, '0')}</span>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

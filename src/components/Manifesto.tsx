import { useReveal } from '../lib/hooks'

export default function Manifesto() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="manifesto" id="klub">
      <div className="wrap reveal" ref={ref}>
        <div className="manifesto-mark">
          Manifest<br />№ 01
        </div>
        <div className="manifesto-body">
          <p>
            Prędkość jest <span className="hl gold-text">demokratyczna</span>.
            Dostęp — już nie. Paddock Club powstał dla wąskiego grona właścicieli,
            dla których samochód nie jest środkiem transportu, lecz&nbsp;deklaracją.
          </p>
          <p className="sig">
            Nie sprzedajemy członkostwa — zapraszamy do niego. Każde zgłoszenie
            rozpatrujemy indywidualnie. Liczy się nie to, czym jeździsz, lecz to,
            jak żyjesz między zakrętami. Kiedy już jesteś w środku, bariera padoku
            przestaje istnieć.
          </p>
        </div>
      </div>
    </section>
  )
}

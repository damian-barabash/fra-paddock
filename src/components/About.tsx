import { useReveal } from '../lib/hooks'

export default function About() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="section about" id="klub">
      <div className="wrap reveal" ref={ref}>
        <div className="about-grid">
          <div className="about-mark">
            <span className="eyebrow">O Klubie</span>
          </div>
          <div className="about-body">
            <p className="about-lead">
              Fastline Paddock Club powstał z myślą o tych, którzy od motoryzacji
              oczekują <span className="gold-text">czegoś więcej</span> niż samych
              emocji za kierownicą.
            </p>
            <p>
              To miejsce, w którym wspólna pasja staje się początkiem wartościowych
              relacji, inspirujących podróży i wyjątkowych doświadczeń — tworzonych
              wyłącznie dla Członków Klubu. Członkostwo otwiera dostęp do starannie
              przygotowanych przywilejów, w tym preferencyjnych warunków korzystania
              z oferty Fastline oraz Partnerów Klubu.
            </p>
            <p>
              Członków wyróżnia chęć ciągłego rozwoju, otwartość na nowe doświadczenia
              oraz przekonanie, że pasja nabiera prawdziwej wartości, gdy można dzielić
              ją z innymi.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useReveal } from '../lib/hooks'

export default function Standards() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="section standards" id="standardy">
      <div className="wrap reveal" ref={ref}>
        <span className="eyebrow center">Standardy Klubu</span>
        <blockquote className="standards-quote">
          Wierzymy, że prawdziwy prestiż nie wynika wyłącznie z samochodów, lecz przede
          wszystkim z <span className="gold-text">ludzi</span>, którzy zasiadają za ich
          kierownicą.
        </blockquote>
        <p className="standards-body">
          Członkowie tworzą społeczność opartą na wzajemnym szacunku, dyskrecji oraz
          kulturze współpracy. Każde wydarzenie Fastline pozostawia po sobie nie tylko
          wyjątkowe wspomnienia, ale również poczucie przynależności do społeczności
          reprezentującej najwyższe standardy.
        </p>
      </div>
    </section>
  )
}

import { useReveal } from '../lib/hooks'
import { copy } from '../content'

export default function About() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="section about" id="klub">
      <div className="wrap reveal" ref={ref}>
        <div className="about-grid">
          <div className="about-mark">
            <span className="eyebrow">O Klubie</span>
          </div>
          <div className="about-body" data-parallax="-34">
            <p className="about-lead">{copy.about[0]}</p>
            <p>{copy.about[1]}</p>
            <p>{copy.about[2]}</p>
            <p>{copy.about[3]}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

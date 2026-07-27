import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import { copy } from '../content'

export default function About() {
  const lead = useReveal<HTMLParagraphElement>()
  const cols = useReveal<HTMLDivElement>()
  return (
    <section className="section about" id="klub">
      <div className="wrap about-wrap">
        <img
          className="about-car"
          src={asset('assets/car.webp')}
          alt=""
          aria-hidden="true"
          data-parallax="-140"
        />
        <Chapter no="I" label="O Klubie" />
        <p className="about-lead reveal" ref={lead}>{copy.about[0]}</p>
        <div className="about-cols reveal" ref={cols}>
          <p>{copy.about[1]}</p>
          <p>{copy.about[2]}</p>
          <p>{copy.about[3]}</p>
        </div>
      </div>
    </section>
  )
}

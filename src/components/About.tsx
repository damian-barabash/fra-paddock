import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import { copy } from '../content'

export default function About() {
  const lead = useReveal<HTMLParagraphElement>()
  const photo = useReveal<HTMLDivElement>()
  const cols = useReveal<HTMLDivElement>()
  return (
    <section className="section about" id="klub">
      <div className="wrap">
        <Chapter no="I" label="O Klubie" />
        <div className="about-top">
          <p className="about-lead reveal" ref={lead}>{copy.about[0]}</p>
          <figure>
            <div className="frame about-photo" ref={photo}>
              <div
                className="frame-photo"
                data-parallax="60"
                style={{ backgroundImage: `url(${asset('assets/about-int.webp')})` }}
                role="img"
                aria-label="Wnętrze hypercara nocą — złote zegary, karbon i światła miasta"
              />
            </div>
            <figcaption className="photo-cap">Styl życia · Detal wnętrza</figcaption>
          </figure>
        </div>
        <div className="about-cols reveal" ref={cols}>
          <p>{copy.about[1]}</p>
          <p>{copy.about[2]}</p>
          <p>{copy.about[3]}</p>
        </div>
      </div>
    </section>
  )
}

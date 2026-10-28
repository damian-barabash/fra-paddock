import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import E from './E'
import { copy } from '../content'

export default function About() {
  const lead = useReveal<HTMLParagraphElement>()
  const photo = useReveal<HTMLDivElement>()
  const cols = useReveal<HTMLDivElement>()
  return (
    <section className="section about" id="klub">
      <div className="wrap">
        <Chapter no="I" k="about.ch" label="O Klubie" />
        <div className="about-top">
          <E as="p" className="about-lead reveal" ref={lead} k="about.lead" def={copy.about[0]} />
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
            <E as="figcaption" className="photo-cap" k="about.cap" def="Styl życia · Detal wnętrza" plain />
          </figure>
        </div>
        <div className="about-cols reveal" ref={cols}>
          <E as="p" k="about.p1" def={copy.about[1]} />
          <E as="p" k="about.p2" def={copy.about[2]} />
        </div>
      </div>
    </section>
  )
}

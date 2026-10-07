import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { goldenLiters, copy } from '../content'

export default function Program() {
  const lead = useReveal<HTMLParagraphElement>()
  const cols = useReveal<HTMLDivElement>()
  return (
    <section className="section program" id="program">
      <div className="wrap">
        <Chapter no="VI" label={copy.refuelTitle} title={copy.refuelH2} />
        <p className="eco-after reveal" ref={lead} style={{ marginTop: '2.2rem' }}>
          {copy.refuelLead}
        </p>

        <div className="program-cols reveal" ref={cols}>
          <div className="prog-panel prog-copy">
            <p>{copy.refuelCopy[0]}</p>
            <p>{copy.refuelCopy[1]}</p>
          </div>

          <div className="prog-panel">
            <h3 className="prog-title">{copy.refuelPanelTitle}</h3>
            <table className="prog-table">
              <tbody>
                {goldenLiters.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td className="prog-pts gold-text data">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="prog-foot">{copy.refuelFoot}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useReveal } from '../lib/hooks'
import { statusPoints, balance, copy } from '../content'

export default function Program() {
  const head = useReveal<HTMLDivElement>()
  const cols = useReveal<HTMLDivElement>()
  return (
    <section className="section program carbon" id="program">
      <div className="wrap">
        <div className="section-head reveal" ref={head}>
          <span className="eyebrow">{copy.statusTitle}</span>
          <p className="lead">{copy.statusLead[0]}</p>
          <p className="lead-soft">{copy.statusLead[1]}</p>
        </div>

        <div className="program-cols reveal" ref={cols}>
          <div className="prog-panel">
            <h3 className="prog-title">Model naliczania</h3>
            <table className="prog-table">
              <tbody>
                {statusPoints.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td className="prog-pts gold-text data">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prog-panel">
            <h3 className="prog-title">Bilans korzyści</h3>
            <table className="prog-table balance-table">
              <thead>
                <tr>
                  <th>Zakupy</th>
                  <th>Przywileje</th>
                  <th>Składka</th>
                  <th className="bal-net-h">Bilans</th>
                </tr>
              </thead>
              <tbody>
                {balance.map((row) => (
                  <tr key={row[0]}>
                    <td className="data">{row[0]}</td>
                    <td className="data">{row[1]}</td>
                    <td className="data">{row[2]}</td>
                    <td className="bal-net data">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="prog-foot">{copy.balanceNote}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

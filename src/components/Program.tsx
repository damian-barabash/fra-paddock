import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { statusPoints, balance, copy } from '../content'

export default function Program() {
  const lead = useReveal<HTMLParagraphElement>()
  const cols = useReveal<HTMLDivElement>()
  return (
    <section className="section program" id="program">
      <div className="wrap">
        <Chapter no="VII" label={copy.statusTitle} title={copy.statusLead[0]} />
        <p className="eco-after reveal" ref={lead} style={{ marginTop: '2.2rem' }}>
          {copy.statusLead[1]}
        </p>

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

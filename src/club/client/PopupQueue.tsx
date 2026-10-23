import type { Popup } from '../api'
import Sheet from '../ui/Sheet'
import RichContent from '../ui/RichContent'

/** Messages the club sent to this member — one at a time, marked as seen on close. */
export default function PopupQueue({ popup, onClose }: { popup: Popup; onClose: () => void }) {
  return (
    <Sheet open onClose={onClose} label={popup.title}>
      <div className="club-popup" key={popup.id}>
        {popup.image_url && <img className="club-popup-img" src={popup.image_url} alt="" />}
        <span className="eyebrow-line">Wiadomość od Klubu</span>
        <h2>{popup.title}</h2>
        <RichContent html={popup.body_html} />
        <div className="club-popup-actions">
          {popup.cta_url && (
            <a className="btn btn-gold" href={popup.cta_url} target="_blank" rel="noopener noreferrer" onClick={onClose}>
              {popup.cta_label || 'Zobacz'} <span className="btn-arrow">→</span>
            </a>
          )}
          <button type="button" className="btn" onClick={onClose}>Zamknij</button>
        </div>
      </div>
    </Sheet>
  )
}

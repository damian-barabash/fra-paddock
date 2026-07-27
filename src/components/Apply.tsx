import { useState } from 'react'
import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { submitApplication, isSupabaseReady, type ApplicationInput } from '../lib/supabase'

const CONTACT_EMAIL = 'klub@fastlineracingacademy.pl'

const empty: ApplicationInput = { full_name: '', email: '', phone: '', car: '', tier: 'Paddock Club', message: '' }

export default function Apply() {
  const intro = useReveal<HTMLDivElement>()
  const formWrap = useReveal<HTMLDivElement>()
  const [data, setData] = useState<ApplicationInput>(empty)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [err, setErr] = useState('')

  const set = (k: keyof ApplicationInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setData((d) => ({ ...d, [k]: e.target.value }))

  const mailtoFallback = () => {
    const body = encodeURIComponent(
      `Imię i nazwisko: ${data.full_name}\nE-mail: ${data.email}\nTelefon: ${data.phone}\nPoziom: ${data.tier}\nSamochód: ${data.car}\n\n${data.message}`,
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Zgłoszenie — Paddock Club')}&body=${body}`
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setErr('')
    if (!isSupabaseReady) {
      mailtoFallback()
      setStatus('done')
      return
    }
    setStatus('sending')
    try {
      await submitApplication(data)
      setStatus('done')
    } catch (e) {
      console.error(e)
      setStatus('error')
      setErr('Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub napisz na ' + CONTACT_EMAIL + '.')
    }
  }

  return (
    <section className="section apply" id="aplikuj">
      <div className="wrap">
        <div className="apply-head reveal" ref={intro}>
          <Chapter no="XI" label="Aplikacja" center />
          <h2>Dołącz do Fastline Paddock Club.</h2>
          <p>
            Wypełnij wniosek. Odpowiadamy w ciągu 48 godzin — każdą aplikację czyta
            człowiek, nie algorytm.
          </p>
          <div className="apply-meta">
            <span>Rozpatrzenie 48h</span>
            <span>Miejsca limitowane</span>
            <span>{CONTACT_EMAIL}</span>
          </div>
        </div>

        <div className="reveal" ref={formWrap} id="aplikuj-form">
          {status === 'done' ? (
            <div className="form-success" role="status">
              <div className="mark" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Zgłoszenie przyjęte</h3>
              <p>
                Dziękujemy. Skontaktujemy się z Tobą w ciągu 48 godzin pod podanym
                adresem. Do zobaczenia w Klubie.
              </p>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="fn">Imię i nazwisko <span className="req">*</span></label>
                  <input id="fn" required value={data.full_name} onChange={set('full_name')} placeholder="Jan Kowalski" autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="ph">Telefon <span className="req">*</span></label>
                  <input id="ph" required value={data.phone} onChange={set('phone')} placeholder="+48 600 000 000" inputMode="tel" autoComplete="tel" />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="em">E-mail <span className="req">*</span></label>
                  <input id="em" type="email" required value={data.email} onChange={set('email')} placeholder="jan@domena.pl" autoComplete="email" />
                </div>
                <div className="field">
                  <label htmlFor="tier">Interesujący poziom</label>
                  <div className="select-wrap">
                    <select id="tier" value={data.tier} onChange={set('tier')}>
                      <option>Paddock Club</option>
                      <option>Paddock Club VIP</option>
                      <option>Jeszcze nie wiem</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label htmlFor="car">Samochód</label>
                <input id="car" value={data.car} onChange={set('car')} placeholder="Maserati MC20" />
              </div>
              <div className="field">
                <label htmlFor="msg">Kilka słów o sobie</label>
                <textarea id="msg" value={data.message} onChange={set('message')} placeholder="Co Cię łączy z motoryzacją?" />
              </div>
              <div className="form-actions">
                <button className="btn btn-gold" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Wysyłanie…' : 'Wyślij zgłoszenie'} <span className="btn-arrow">→</span>
                </button>
                {status === 'error' && <span className="form-msg err">{err}</span>}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

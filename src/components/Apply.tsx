import { useState } from 'react'
import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import { submitApplication, isSupabaseReady, type ApplicationInput } from '../lib/supabase'
import { copy, interestOptions, CONTACT_EMAIL } from '../content'

const empty: ApplicationInput = {
  full_name: '',
  email: '',
  phone: '',
  brand: '',
  car: '',
  reference: '',
  interests: [],
  message: '',
}

export default function Apply() {
  const intro = useReveal<HTMLDivElement>()
  const band = useReveal<HTMLElement>({ threshold: 0.2 })
  const formWrap = useReveal<HTMLDivElement>()
  const [data, setData] = useState<ApplicationInput>(empty)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [err, setErr] = useState('')

  const set = (k: keyof ApplicationInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setData((d) => ({ ...d, [k]: e.target.value }))

  const toggleInterest = (v: string) =>
    setData((d) => ({
      ...d,
      interests: d.interests.includes(v)
        ? d.interests.filter((x) => x !== v)
        : [...d.interests, v],
    }))

  const mailtoFallback = () => {
    const body = encodeURIComponent(
      `Imię i nazwisko: ${data.full_name}\nE-mail: ${data.email}\nTelefon: ${data.phone}\nUlubiona marka: ${data.brand}\nSamochód: ${data.car}\nRekomendacja: ${data.reference}\nInteresuje: ${data.interests.join(', ')}\n\n${data.message}`,
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Aplikacja — Fastline Paddock Club')}&body=${body}`
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
      setErr('Nie udało się wysłać aplikacji. Spróbuj ponownie lub napisz na ' + CONTACT_EMAIL + '.')
    }
  }

  return (
    <section className="section apply" id="aplikuj">
      <figure className="eco-band apply-band" ref={band}>
        <div
          className="eco-photo"
          data-parallax="45"
          style={{ backgroundImage: `url(${asset('assets/road-fastline.webp')})`, backgroundPosition: 'center 76%' }}
          role="img"
          aria-label="Zielony supersamochód na Plaza de España w Sewilli o zachodzie słońca"
        />
        <figcaption>
          <div className="wrap">
            <span>Sewilla · Plaza de España</span>
          </div>
        </figcaption>
      </figure>
      <div className="wrap">
        <div className="apply-head reveal" ref={intro}>
          <Chapter no="XII" label={copy.applyTitle} center />
          <h2>{copy.applyH2}</h2>
          <p>{copy.applyLead}</p>
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
              <h3>{copy.thanksTitle}</h3>
              <p>{copy.applyNote}</p>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="fn">Imię i nazwisko <span className="req">*</span></label>
                  <input id="fn" required value={data.full_name} onChange={set('full_name')} placeholder="Jan Kowalski" autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="em">E-mail <span className="req">*</span></label>
                  <input id="em" type="email" required value={data.email} onChange={set('email')} placeholder="jan@domena.pl" autoComplete="email" />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="ph">Telefon <span className="req">*</span></label>
                  <input id="ph" required value={data.phone} onChange={set('phone')} placeholder="+48 600 000 000" inputMode="tel" autoComplete="tel" />
                </div>
                <div className="field">
                  <label htmlFor="brand">Ulubiona marka motoryzacyjna</label>
                  <input id="brand" value={data.brand} onChange={set('brand')} placeholder="Porsche" />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="car">Samochód, który posiadasz</label>
                  <input id="car" value={data.car} onChange={set('car')} placeholder="Maserati MC20" />
                </div>
                <div className="field">
                  <label htmlFor="ref">
                    Kto Cię rekomenduje <small>(Klubowicz FPC lub udział w wydarzeniach Fastline)</small>
                  </label>
                  <input id="ref" value={data.reference} onChange={set('reference')} placeholder="Imię i nazwisko / wydarzenie" />
                </div>
              </div>
              <div className="field">
                <span className="field-label" id="int-label">Co najbardziej Cię interesuje</span>
                <div className="chips" role="group" aria-labelledby="int-label">
                  {interestOptions.map((opt) => (
                    <label className="chip" key={opt}>
                      <input
                        type="checkbox"
                        checked={data.interests.includes(opt)}
                        onChange={() => toggleInterest(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="field">
                <label htmlFor="msg">Krótko o sobie <small>(opcjonalne)</small></label>
                <textarea id="msg" value={data.message} onChange={set('message')} placeholder="Co Cię łączy z motoryzacją?" />
              </div>
              <div className="form-actions">
                <button className="btn btn-gold" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Wysyłanie…' : 'Złóż aplikację'} <span className="btn-arrow">→</span>
                </button>
                {status === 'error' && <span className="form-msg err">{err}</span>}
                <p className="form-note">{copy.applyNote}</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

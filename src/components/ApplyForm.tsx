import { useState } from 'react'
import { submitApplication, isSupabaseReady, type ApplicationInput } from '../lib/supabase'
import { copy, interestOptions, CONTACT_EMAIL } from '../content'
import { useEditing } from '../lib/texts'
import E, { usePlaceholder, useText } from './E'

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

/** Membership application form (Fastline Paddock Pass) with its thank-you state. */
export default function ApplyForm() {
  const editing = useEditing()
  // chip labels are also the stored answers, so an edited label is what lands in the application
  const labels = [useText('apply.interest0', interestOptions[0]), useText('apply.interest1', interestOptions[1]), useText('apply.interest2', interestOptions[2]), useText('apply.interest3', interestOptions[3])]
  const submit = useText('apply.submit', 'Złóż aplikację')
  const sending = useText('apply.sending', 'Wysyłanie…')
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
    if (editing || status === 'sending') return
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

  const Lab = editing ? 'span' : 'label'
  const fid = (id: string) => (editing ? undefined : id)

  return (
    <>
    {status === 'done' ? (
      <ApplyThanks />
    ) : (
      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="form-row">
          <div className="field">
            <label htmlFor={fid('fn')}><E k="apply.f.name" def="Imię i nazwisko" plain /> <span className="req">*</span></label>
            <input id="fn" required value={data.full_name} onChange={set('full_name')} autoComplete="name" {...usePlaceholder('apply.ph.name', 'Jan Kowalski')} />
          </div>
          <div className="field">
            <label htmlFor={fid('em')}><E k="apply.f.email" def="E-mail" plain /> <span className="req">*</span></label>
            <input id="em" type={editing ? 'text' : 'email'} required value={data.email} onChange={set('email')} autoComplete="email" {...usePlaceholder('apply.ph.email', 'jan@domena.pl')} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor={fid('ph')}><E k="apply.f.phone" def="Telefon" plain /> <span className="req">*</span></label>
            <input id="ph" required value={data.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" {...usePlaceholder('apply.ph.phone', '+48 600 000 000')} />
          </div>
          <div className="field">
            <label htmlFor={fid('brand')}><E k="apply.f.brand" def="Ulubiona marka motoryzacyjna" plain /></label>
            <input id="brand" value={data.brand} onChange={set('brand')} {...usePlaceholder('apply.ph.brand', 'Porsche')} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor={fid('car')}><E k="apply.f.car" def="Samochód, który posiadasz" plain /></label>
            <input id="car" value={data.car} onChange={set('car')} {...usePlaceholder('apply.ph.car', 'Maserati MC20')} />
          </div>
          <div className="field">
            <label htmlFor={fid('ref')}>
              <E k="apply.f.ref" def="Kto Cię rekomenduje" plain />{' '}
              <E as="small" k="apply.f.refHint" def="(Członek Klubu lub udział w wydarzeniach Fastline)" plain />
            </label>
            <input id="ref" value={data.reference} onChange={set('reference')} {...usePlaceholder('apply.ph.ref', 'Imię i nazwisko / wydarzenie')} />
          </div>
        </div>
        <div className="field">
          <E className="field-label" id="int-label" k="apply.f.interests" def="Co najbardziej Cię interesuje" plain />
          <div className="chips" role="group" aria-labelledby="int-label">
            {interestOptions.map((opt, i) => (
              <Lab className="chip" key={opt}>
                <input
                  type="checkbox"
                  checked={data.interests.includes(labels[i])}
                  onChange={() => toggleInterest(labels[i])}
                  tabIndex={editing ? -1 : undefined}
                />
                <E k={`apply.interest${i}`} def={opt} plain />
              </Lab>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor={fid('msg')}>
            <E k="apply.f.msg" def="Krótko o sobie" plain /> <E as="small" k="apply.f.msgHint" def="(opcjonalne)" plain />
          </label>
          <textarea id="msg" value={data.message} onChange={set('message')} {...usePlaceholder('apply.ph.msg', 'Co Cię łączy z motoryzacją?')} />
        </div>
        <div className="form-actions">
          {editing ? (
            <span className="btn btn-gold">
              <E k="apply.submit" def="Złóż aplikację" plain /> <span className="btn-arrow">→</span>
            </span>
          ) : (
            <button className="btn btn-gold" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? sending : submit} <span className="btn-arrow">→</span>
            </button>
          )}
          {status === 'error' && <span className="form-msg err">{err}</span>}
          <E as="p" className="form-note" k="apply.note" def={copy.applyNote} />
        </div>
      </form>
    )}
    </>
  )
}

/** The thank-you state after sending (also shown on its own in the editor). */
export function ApplyThanks() {
  return (
    <div className="form-success" role="status">
      <div className="mark" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <E as="h3" k="apply.thanks.title" def={copy.thanksTitle} />
      <E as="p" k="apply.thanks.text" def={copy.applyNote} />
    </div>
  )
}

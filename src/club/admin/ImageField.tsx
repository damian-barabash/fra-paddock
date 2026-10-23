import { useRef, useState } from 'react'
import { uploadImage } from '../api'
import Icon from '../ui/Icon'

/** Cover photo picker: uploads to storage and shows a preview. */
export default function ImageField({ label, value, onChange }: { label: string; value: string | null; onChange: (url: string | null) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const pick = async (f?: File) => {
    if (!f) return
    setErr('')
    setBusy(true)
    try {
      onChange(await uploadImage(f, 'covers'))
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className={`imgfield${value ? ' has' : ''}`} style={value ? { backgroundImage: `url(${value})` } : undefined}>
        <button type="button" onClick={() => input.current?.click()} disabled={busy}>
          <Icon name="image" size={18} /> {busy ? 'Wgrywanie…' : value ? 'Zmień zdjęcie' : 'Dodaj zdjęcie'}
        </button>
        {value && !busy && (
          <button type="button" onClick={() => onChange(null)}><Icon name="trash" size={16} /> Usuń</button>
        )}
      </div>
      {err && <p className="form-msg err">{err}</p>}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  )
}

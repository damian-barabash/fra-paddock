import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { APPLY_EVENT } from '../lib/links'
import { copy, CONTACT_EMAIL } from '../content'
import ApplyForm from './ApplyForm'
import E from './E'

const ease = [0.22, 1, 0.36, 1] as const

/** The application form as a pop-up — opened by every „Złóż aplikację” button. */
export default function ApplyModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener(APPLY_EVENT, show)
    return () => window.removeEventListener(APPLY_EVENT, show)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('modal-open')
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          data-lenis-prevent
        >
          <motion.div
            className="modal-card apply-modal"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.6, ease }}
          >
            <button type="button" className="modal-close" aria-label="Zamknij" onClick={() => setOpen(false)}>
              <i /><i />
            </button>
            <ApplyHead />
            <ApplyForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Heading of the application card (shared with the editor). */
export function ApplyHead() {
  return (
    <div className="apply-head">
      <E className="eyebrow-line" k="apply.eyebrow" def={copy.applyTitle} plain />
      <E as="h2" id="apply-title" k="apply.title" def={copy.applyH2} />
      <E as="p" k="apply.lead" def={copy.applyLead} />
      <div className="apply-meta">
        <E k="apply.meta1" def="Rozpatrzenie 48h" plain />
        <E k="apply.meta2" def="Miejsca limitowane" plain />
        <E k="apply.meta3" def={CONTACT_EMAIL} plain />
      </div>
    </div>
  )
}

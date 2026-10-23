import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { APPLY_EVENT } from '../lib/links'
import { copy, CONTACT_EMAIL } from '../content'
import ApplyForm from './ApplyForm'

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
            <div className="apply-head">
              <span className="eyebrow-line">{copy.applyTitle}</span>
              <h2 id="apply-title">{copy.applyH2}</h2>
              <p>{copy.applyLead}</p>
              <div className="apply-meta">
                <span>Rozpatrzenie 48h</span>
                <span>Miejsca limitowane</span>
                <span>{CONTACT_EMAIL}</span>
              </div>
            </div>
            <ApplyForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

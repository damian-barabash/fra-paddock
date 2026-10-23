import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

/** Pop-up card on desktop, full-height sheet on phones. Escape / backdrop closes it. */
export default function Sheet({
  open,
  onClose,
  children,
  wide = false,
  label,
  closable = true,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  wide?: boolean
  label?: string
  closable?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closable && onClose()
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('modal-open')
    }
  }, [open, onClose, closable])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          onClick={(e) => closable && e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className={`modal-card${wide ? ' modal-card--wide' : ''}`}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.55, ease }}
          >
            {closable && (
              <button type="button" className="modal-close" aria-label="Zamknij" onClick={onClose}>
                <i /><i />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

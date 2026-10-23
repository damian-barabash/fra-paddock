import DOMPurify from 'dompurify'
import { useMemo } from 'react'

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

/** Renders admin-written rich text safely (scripts, handlers and unknown tags are stripped). */
export default function RichContent({ html, className = '' }: { html: string; className?: string }) {
  const clean = useMemo(
    () => DOMPurify.sanitize(html, { ADD_ATTR: ['target'], FORBID_TAGS: ['style', 'iframe', 'form', 'input'] }),
    [html],
  )
  if (!clean.trim()) return null
  return <div className={`rich ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />
}

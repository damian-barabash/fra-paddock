import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type ElementType,
  type HTMLAttributes,
  type ChangeEvent,
} from 'react'
import { cleanHtml, escapeHtml, toPlain } from '../lib/richtext'
import { usePublishedTexts, useTextEditor } from '../lib/texts'

type Props = Omit<HTMLAttributes<HTMLElement>, 'children' | 'dangerouslySetInnerHTML'> & {
  /** text key, e.g. `home.hero.claim` */
  k: string
  /** original plain text */
  def?: string
  /** original as inline HTML (when it carries <em>, <strong> …) */
  html?: string
  as?: ElementType
  /** labels and buttons: no formatting, no line breaks */
  plain?: boolean
  /** `{imię}` → value, outside the editor only */
  vars?: Record<string, string>
}

const fill = (html: string, vars?: Record<string, string>) =>
  vars ? html.replace(/\{([^}]+)\}/g, (m, name) => (name in vars ? escapeHtml(vars[name]) : m)) : html

/**
 * A piece of site copy that admins can rewrite in Panel Klubu → „Strona”.
 * On the site it renders the published text (or the original); in the editor it becomes contentEditable.
 */
const E = forwardRef<HTMLElement, Props>(function E({ k, def, html, as: Tag = 'span', plain, vars, className, ...rest }, outer) {
  const ed = useTextEditor()
  const texts = usePublishedTexts()
  const original = html ?? escapeHtml(def ?? '')

  const own = useRef<HTMLElement | null>(null)
  const setRef = useCallback(
    (el: HTMLElement | null) => {
      own.current = el
      if (typeof outer === 'function') outer(el)
      else if (outer) outer.current = el
    },
    [outer],
  )

  // editor: the DOM is filled once (and again when values change from outside) — never on each keystroke
  const editValue = ed ? ed.get(k) : null
  useLayoutEffect(() => {
    if (ed && own.current) own.current.innerHTML = editValue ?? original
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ed?.rev, k])

  const stored = texts[k]
  const shown = useMemo(() => (stored == null ? null : cleanHtml(stored)), [stored])

  if (!ed) {
    if (shown != null || html || vars) {
      return <Tag ref={setRef} className={className} {...rest} dangerouslySetInnerHTML={{ __html: fill(shown ?? original, vars) }} />
    }
    return <Tag ref={setRef} className={className} {...rest}>{def}</Tag>
  }

  const commit = (el: HTMLElement) => {
    const v = plain ? escapeHtml((el.textContent ?? '').replace(/\s+/g, ' ').trim()) : cleanHtml(el.innerHTML)
    ed.set(k, v, original)
  }

  return (
    <Tag
      ref={setRef}
      className={`${className ? className + ' ' : ''}cms-field`}
      {...rest}
      data-cms={k}
      data-plain={plain ? '' : undefined}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      onInput={(e: React.FormEvent<HTMLElement>) => commit(e.currentTarget)}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const el = e.currentTarget
        // an emptied field brings the original back instead of erasing the text
        if (!(el.textContent ?? '').trim()) {
          ed.set(k, null, original)
          el.innerHTML = original
        }
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          if (!plain && e.shiftKey) document.execCommand('insertLineBreak')
        }
        if (plain && (e.metaKey || e.ctrlKey) && /^[biu]$/i.test(e.key)) e.preventDefault()
      }}
      onPaste={(e: React.ClipboardEvent<HTMLElement>) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain').replace(/\s*\n\s*/g, ' ')
        document.execCommand('insertText', false, text)
      }}
    />
  )
})

export default E

/** Plain text of a key — for values that end up outside HTML (stored form answers, aria). */
export function useText(k: string, def: string) {
  const ed = useTextEditor()
  const texts = usePublishedTexts()
  const v = ed ? ed.get(k) : texts[k]
  return v == null ? def : toPlain(v)
}

/**
 * Input placeholder from the CMS. In the editor the input itself edits its placeholder:
 * the admin types the hint straight into the empty field.
 */
export function usePlaceholder(k: string, def: string) {
  const ed = useTextEditor()
  const texts = usePublishedTexts()
  if (!ed) {
    const v = texts[k]
    return { placeholder: v == null ? def : toPlain(v) }
  }
  const v = ed.get(k)
  return {
    value: v == null ? def : toPlain(v),
    placeholder: def,
    'data-cms': k,
    className: 'cms-ph',
    // an empty field stays empty while typing; leaving it empty brings the original back
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => ed.set(k, escapeHtml(e.target.value), escapeHtml(def)),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!e.target.value.trim()) ed.set(k, null, escapeHtml(def))
    },
  }
}

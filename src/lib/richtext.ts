/**
 * Inline rich text for site copy edited in Panel Klubu → „Strona”.
 * Only a small set of inline tags survives; everything else is unwrapped to its text.
 */

const KEEP = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'BR', 'SPAN', 'A', 'SMALL', 'SUP', 'SUB'])
const RENAME: Record<string, string> = { STRIKE: 'S', DEL: 'S', INS: 'U', MARK: 'SPAN', FONT: 'SPAN' }

/** CSS properties a fragment may carry (no url(), no positioning). */
const STYLE_OK = new Set([
  'color', 'background-color', 'font-size', 'font-weight', 'font-style', 'font-family',
  'letter-spacing', 'word-spacing', 'text-transform', 'text-decoration', 'text-decoration-color',
  'text-shadow', 'opacity', 'line-height', 'font-variant', 'font-variant-caps', 'padding',
  'border', 'border-bottom', 'border-radius', 'white-space',
])

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const STYLE_PREFIX = ['text-decoration', 'border', 'padding', 'font-variant']

/** Keeps the declarations as written (shorthands included), dropping anything not on the list. */
function cleanStyle(style: string) {
  const out: string[] = []
  for (const decl of style.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const prop = decl.slice(0, i).trim().toLowerCase()
    const val = decl.slice(i + 1).trim()
    if (!val || /url\s*\(|expression|javascript:|[<>{}]/i.test(val)) continue
    if (!STYLE_OK.has(prop) && !STYLE_PREFIX.some((p) => prop.startsWith(p))) continue
    out.push(`${prop}: ${val}`)
  }
  return out.join('; ')
}

function safeHref(href: string) {
  const h = href.trim()
  return /^(https?:|mailto:|tel:|#|\/|\.{0,2}\/)/i.test(h) || /^[\w-]+(\/|\.html|$)/.test(h) ? h : ''
}

function walk(node: Node, doc: Document): Node[] {
  if (node.nodeType === Node.TEXT_NODE) return [doc.createTextNode(node.textContent ?? '')]
  if (node.nodeType !== Node.ELEMENT_NODE) return []
  const el = node as HTMLElement
  let tag = el.tagName
  const kids = () => Array.from(el.childNodes).flatMap((c) => walk(c, doc))

  // block wrappers the browser sneaks in (Enter, paste) become line breaks
  if (tag === 'DIV' || tag === 'P' || tag === 'LI') {
    const inner = kids()
    return inner.length ? [...inner, doc.createElement('br')] : []
  }
  if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'IFRAME' || tag === 'OBJECT') return []
  if (RENAME[tag]) tag = RENAME[tag]
  if (!KEEP.has(tag)) return kids()

  const out = doc.createElement(tag.toLowerCase())
  if (tag === 'A') {
    const href = safeHref(el.getAttribute('href') ?? '')
    if (!href) return kids()
    out.setAttribute('href', href)
    if (/^https?:/i.test(href)) {
      out.setAttribute('target', '_blank')
      out.setAttribute('rel', 'noopener noreferrer')
    }
  }
  let style = el.getAttribute('style') ? cleanStyle(el.getAttribute('style')!) : ''
  if (el.tagName === 'FONT' && el.getAttribute('color')) style = `color: ${el.getAttribute('color')}${style ? '; ' + style : ''}`
  if (el.tagName === 'MARK') style = `background-color: rgba(198, 161, 91, 0.28)${style ? '; ' + style : ''}`
  if (style && tag !== 'BR') out.setAttribute('style', style)
  if (tag === 'SPAN' && !style) return kids() // bare span = noise
  kids().forEach((k) => out.appendChild(k))
  if (tag !== 'BR' && !out.childNodes.length) return []
  return [out]
}

/** Whitelist-clean inline HTML (browser only). */
export function cleanHtml(html: string): string {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const box = doc.createElement('div')
  Array.from(doc.body.childNodes).flatMap((n) => walk(n, doc)).forEach((n) => box.appendChild(n))
  // no trailing line breaks
  while (box.lastChild && (box.lastChild as Element).tagName === 'BR') box.lastChild.remove()
  return box.innerHTML.trim()
}

/** Plain text of a stored value (for attributes such as placeholders, or stored form values). */
export function toPlain(html: string): string {
  if (!/[<&]/.test(html)) return html
  const doc = new DOMParser().parseFromString(`<body>${html.replace(/<br\s*\/?>/gi, '\n')}</body>`, 'text/html')
  return (doc.body.textContent ?? '').trim()
}

/** True when the value carries any markup (otherwise it can be stored as plain text). */
export const hasMarkup = (html: string) => /<[a-z]/i.test(html)

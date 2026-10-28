import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Floating toolbar over selected text in a `[data-cms]` field (same idea as the InfinitiQ editor):
 * B I U S · gold · capitals · A− A+ · colour / size / link / CSS panels · clear.
 * The selection is remembered on show, because clicking into a panel input takes it away.
 */

type Panel = 'color' | 'size' | 'link' | 'css'

const PANELS: Record<Panel, { lab: string; ph: string; hint: string; presets: [string, string][] }> = {
  color: {
    lab: 'Kolor fragmentu',
    ph: 'np. #c6a15b lub var(--gold)',
    hint: 'Puste pole usuwa kolor.',
    presets: [
      ['Złoto', 'var(--gold)'],
      ['Jasne złoto', 'var(--gold-bright)'],
      ['Szampan', 'var(--champagne)'],
      ['Biel', '#f4f2ec'],
      ['Przygaszony', '#aeaca6'],
    ],
  },
  size: {
    lab: 'Rozmiar fragmentu',
    ph: 'np. 1.2em lub 18px',
    hint: 'Sama liczba = em (względem tekstu obok). Puste pole przywraca rozmiar.',
    presets: [
      ['Mniejszy', '0.8em'],
      ['Odrobinę mniejszy', '0.9em'],
      ['Większy', '1.15em'],
      ['Duży', '1.35em'],
      ['Bardzo duży', '1.6em'],
    ],
  },
  link: {
    lab: 'Link',
    ph: 'https://… lub mailto:…',
    hint: 'Puste pole usuwa link. Linki zewnętrzne otwierają się w nowej karcie.',
    presets: [
      ['Fastline Racing Academy', 'https://fastlineracingacademy.pl'],
      ['E-mail Klubu', 'mailto:paddock@fastlineracingacademy.pl'],
    ],
  },
  css: {
    lab: 'Własny CSS fragmentu',
    ph: 'np. letter-spacing: 0.2em; opacity: 0.8',
    hint: 'Deklaracje rozdzielone średnikiem. Puste pole usuwa styl fragmentu.',
    presets: [
      ['Odstępy liter', 'letter-spacing: 0.18em'],
      ['Kapitaliki', 'font-variant-caps: all-small-caps; letter-spacing: 0.06em'],
      ['Szeryf kursywą', "font-family: 'Fraunces', Georgia, serif; font-style: italic"],
      ['Grotesk', "font-family: 'Manrope', system-ui, sans-serif"],
      ['Złota poświata', 'text-shadow: 0 0 18px rgba(198, 161, 91, 0.55)'],
      ['Złote podkreślenie', 'text-decoration: underline; text-decoration-color: var(--gold); text-underline-offset: 0.2em'],
      ['Przygaszony', 'opacity: 0.7'],
    ],
  },
}

const hostOf = (n: Node | null) => {
  const el = n && (n.nodeType === Node.ELEMENT_NODE ? (n as Element) : n.parentElement)
  const h = el?.closest('[data-cms][contenteditable]') as HTMLElement | null
  return h && !h.hasAttribute('data-plain') ? h : null
}

export default function FormatBar() {
  const bar = useRef<HTMLDivElement>(null)
  const range = useRef<Range | null>(null)
  const host = useRef<HTMLElement | null>(null)
  const [show, setShow] = useState(false)
  const [panel, setPanel] = useState<Panel | null>(null)
  const [value, setValue] = useState('')
  const [on, setOn] = useState({ bold: false, italic: false, underline: false, strike: false })
  const input = useRef<HTMLInputElement>(null)
  const panelRef = useRef<Panel | null>(null)
  panelRef.current = panel

  const place = useCallback(() => {
    const b = bar.current
    const r = range.current
    if (!b || !r) return
    const rect = r.getBoundingClientRect()
    if (!rect.width && !rect.height) return
    const w = b.offsetWidth
    const h = b.offsetHeight
    const cx = rect.left + rect.width / 2
    const left = Math.max(8, Math.min(cx - w / 2, window.innerWidth - w - 8))
    let top = rect.top - h - 12
    const below = top < 70 // under the editor bar
    if (below) top = rect.bottom + 12
    b.style.left = `${left}px`
    b.style.top = `${top}px`
    b.style.setProperty('--ax', `${Math.max(14, Math.min(cx - left, w - 14))}px`)
    b.classList.toggle('below', below)
  }, [])

  const syncState = () =>
    setOn({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strike: document.queryCommandState('strikeThrough'),
    })

  const hide = useCallback(() => {
    setShow(false)
    setPanel(null)
    range.current = null
    host.current = null
  }, [])

  // follow the selection
  useEffect(() => {
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (panelRef.current || (bar.current && bar.current.contains(document.activeElement))) return
        const sel = window.getSelection()
        if (!sel || !sel.rangeCount || sel.isCollapsed) return hide()
        const r = sel.getRangeAt(0)
        const h = hostOf(r.commonAncestorContainer)
        if (!h) return hide()
        range.current = r.cloneRange()
        host.current = h
        setShow(true)
        syncState()
        requestAnimationFrame(place)
      })
    }
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (bar.current?.contains(t)) return
      if (panelRef.current && !hostOf(t)) hide()
    }
    const onMove = () => range.current && place()
    document.addEventListener('selectionchange', update)
    document.addEventListener('mouseup', update)
    document.addEventListener('keyup', update)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('resize', onMove)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('selectionchange', update)
      document.removeEventListener('mouseup', update)
      document.removeEventListener('keyup', update)
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('scroll', onMove)
      window.removeEventListener('resize', onMove)
    }
  }, [hide, place])

  useEffect(() => {
    if (show) place()
  }, [show, panel, place])

  // ───────── editing helpers ─────────
  const restore = () => {
    const sel = window.getSelection()
    if (!sel || !range.current) return false
    // a panel input may hold the focus — commands only work inside the focused field
    if (host.current && document.activeElement !== host.current) host.current.focus({ preventScroll: true })
    sel.removeAllRanges()
    sel.addRange(range.current)
    return true
  }
  const remember = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount) range.current = sel.getRangeAt(0).cloneRange()
  }
  /** tell the field (React onInput) that its HTML changed */
  const commit = () => {
    host.current?.dispatchEvent(new Event('input', { bubbles: true }))
    syncState()
    place()
  }
  const selectNode = (n: Node) => {
    const r = document.createRange()
    r.selectNodeContents(n)
    const sel = window.getSelection()!
    sel.removeAllRanges()
    sel.addRange(r)
    range.current = r.cloneRange()
  }
  /** the styled span the selection covers exactly — edit it instead of nesting a new one */
  const wholeSpan = (): HTMLElement | null => {
    const r = range.current
    if (!r || !host.current) return null
    const text = r.toString()
    let n: Node | null = r.commonAncestorContainer
    while (n && n !== host.current) {
      if (n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName === 'SPAN' && (n as Element).hasAttribute('style')) {
        return (n as HTMLElement).textContent === text ? (n as HTMLElement) : null
      }
      if (n.nodeType === Node.ELEMENT_NODE && (n as Element).textContent !== text) break
      n = n.parentNode
    }
    // the range may start/end just outside the span (selectNodeContents of the parent)
    const frag = r.cloneContents()
    if (frag.childNodes.length === 1 && (frag.firstChild as Element)?.tagName === 'SPAN') {
      const c = r.commonAncestorContainer as Element
      const match = c.nodeType === Node.ELEMENT_NODE
        ? Array.from(c.querySelectorAll('span[style]')).find((s) => s.textContent === text && r.intersectsNode(s))
        : null
      return (match as HTMLElement) ?? null
    }
    return null
  }
  const unwrapIfBare = (sp: HTMLElement) => {
    if (sp.getAttribute('style')?.trim()) return sp
    const parent = sp.parentNode!
    const first = sp.firstChild
    const last = sp.lastChild
    while (sp.firstChild) parent.insertBefore(sp.firstChild, sp)
    sp.remove()
    if (first && last) {
      const r = document.createRange()
      r.setStartBefore(first)
      r.setEndAfter(last)
      const sel = window.getSelection()!
      sel.removeAllRanges()
      sel.addRange(r)
      range.current = r.cloneRange()
    }
    return null
  }
  /** set (or with value '' remove) CSS properties on the selection */
  const style = (props: Record<string, string>) => {
    if (!restore()) return
    let sp = wholeSpan()
    if (!sp) {
      const r = range.current!
      if (r.collapsed) return
      sp = document.createElement('span')
      sp.appendChild(r.extractContents())
      r.insertNode(sp)
      selectNode(sp)
    }
    Object.entries(props).forEach(([p, v]) => (v ? sp!.style.setProperty(p, v) : sp!.style.removeProperty(p)))
    unwrapIfBare(sp)
    host.current?.normalize()
    commit()
  }
  const exec = (cmd: string, arg?: string) => {
    if (!restore()) return
    document.execCommand('styleWithCSS', false, 'false')
    document.execCommand(cmd, false, arg)
    remember()
    commit()
  }

  const quick: Record<string, () => void> = {
    bold: () => exec('bold'),
    italic: () => exec('italic'),
    underline: () => exec('underline'),
    strike: () => exec('strikeThrough'),
    gold: () => {
      const sp = wholeSpan()
      style({ color: sp && sp.style.color === 'var(--gold)' ? '' : 'var(--gold)' })
    },
    upper: () => {
      const sp = wholeSpan()
      const isUp = sp?.style.textTransform === 'uppercase'
      style({ 'text-transform': isUp ? '' : 'uppercase', 'letter-spacing': isUp ? '' : '0.12em' })
    },
    small: () => scale(0.88),
    big: () => scale(1.14),
    clear: () => {
      const h = host.current
      if (!h || !restore()) return
      const sp = wholeSpan()
      const r = range.current!
      const text = r.toString()
      if (sp) sp.replaceWith(document.createTextNode(sp.textContent ?? ''))
      else {
        r.deleteContents()
        r.insertNode(document.createTextNode(text))
      }
      h.normalize()
      h.dispatchEvent(new Event('input', { bubbles: true }))
      hide()
    },
  }
  function scale(k: number) {
    const sp = wholeSpan()
    const cur = sp?.style.fontSize.endsWith('em') ? parseFloat(sp.style.fontSize) : 1
    const next = Math.round(cur * k * 100) / 100
    style({ 'font-size': Math.abs(next - 1) < 0.02 ? '' : `${next}em` })
  }

  const openPanel = (p: Panel) => {
    if (panel === p) return setPanel(null)
    const sp = wholeSpan()
    let v = ''
    if (p === 'color') v = sp?.style.color ?? ''
    if (p === 'size') v = sp?.style.fontSize ?? ''
    if (p === 'css') v = sp?.getAttribute('style') ?? ''
    if (p === 'link' && range.current) {
      const c = range.current.commonAncestorContainer
      const a = (c.nodeType === Node.ELEMENT_NODE ? (c as Element) : c.parentElement)?.closest('a')
      if (a && host.current?.contains(a)) v = a.getAttribute('href') ?? ''
    }
    setValue(v)
    setPanel(p)
    setTimeout(() => input.current?.focus(), 20)
  }
  /** presets add to the fragment's style; typing replaces it (the field starts with the current style) */
  const applyPanel = (raw = value, preset = false) => {
    let v = raw.trim()
    if (preset && panel === 'css') {
      const cur = wholeSpan()?.getAttribute('style')?.trim().replace(/;$/, '')
      if (cur) v = `${cur}; ${v}`
    }
    const p = panel
    setPanel(null)
    if (p === 'color') style({ color: v })
    if (p === 'size') style({ 'font-size': /^\d*\.?\d+$/.test(v) ? `${v}em` : v })
    if (p === 'link') exec(v ? 'createLink' : 'unlink', v || undefined)
    if (p === 'css') {
      if (!restore()) return
      let sp = wholeSpan()
      if (!sp && v) {
        const r = range.current!
        sp = document.createElement('span')
        sp.appendChild(r.extractContents())
        r.insertNode(sp)
        selectNode(sp)
      }
      if (sp) {
        sp.setAttribute('style', v)
        unwrapIfBare(sp)
      }
      host.current?.normalize()
      commit()
    }
  }

  const P = panel ? PANELS[panel] : null
  const btn = (key: string, label: React.ReactNode, title: string, cls = '', active = false) => (
    <button type="button" className={`fmt-btn ${cls}${active ? ' on' : ''}`} title={title} aria-label={title} onClick={() => quick[key]()}>
      {label}
    </button>
  )
  const pbtn = (p: Panel, label: string, title: string) => (
    <button type="button" className={`fmt-btn fmt-w${panel === p ? ' on' : ''}`} title={title} onClick={() => openPanel(p)}>
      {label}
    </button>
  )

  return (
    <div
      ref={bar}
      className={`fmt${show ? ' show' : ''}`}
      role="toolbar"
      aria-label="Formatowanie zaznaczenia"
      aria-hidden={!show}
      // keep the text selection when pressing toolbar buttons
      onMouseDown={(e) => {
        if ((e.target as Element).closest('button, .fmt-chip')) e.preventDefault()
      }}
    >
      <div className="fmt-row">
        {btn('bold', <b>B</b>, 'Pogrubienie (Ctrl+B)', '', on.bold)}
        {btn('italic', <i>I</i>, 'Kursywa (Ctrl+I)', 'fmt-i', on.italic)}
        {btn('underline', <u>U</u>, 'Podkreślenie (Ctrl+U)', '', on.underline)}
        {btn('strike', <s>S</s>, 'Przekreślenie', '', on.strike)}
        <span className="fmt-sep" />
        {btn('gold', <span className="fmt-dot" />, 'Złoty kolor', 'fmt-gold')}
        {btn('upper', 'AA', 'Wielkie litery')}
        {btn('small', 'A−', 'Mniejszy tekst')}
        {btn('big', 'A+', 'Większy tekst')}
        <span className="fmt-sep" />
        {pbtn('color', 'Kolor', 'Dowolny kolor')}
        {pbtn('size', 'Rozmiar', 'Dowolny rozmiar')}
        {pbtn('link', 'Link', 'Link')}
        {pbtn('css', 'CSS', 'Własny CSS dla zaznaczenia')}
        <span className="fmt-sep" />
        {btn('clear', '✕', 'Wyczyść formatowanie', 'fmt-del')}
      </div>
      {P && (
        <div className="fmt-panel">
          <div className="fmt-lab">{P.lab}</div>
          <div className="fmt-presets">
            {P.presets.map(([label, v]) => (
              <span key={label} className="fmt-chip" title={v} onClick={() => applyPanel(v, true)}>
                {panel === 'color' && <i style={{ background: v }} />}
                {label}
              </span>
            ))}
          </div>
          <div className="fmt-inrow">
            <input
              ref={input}
              className="fmt-input"
              value={value}
              placeholder={P.ph}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  applyPanel()
                }
                if (e.key === 'Escape') {
                  e.preventDefault()
                  setPanel(null)
                  restore()
                }
              }}
            />
            <button type="button" className="fmt-apply" onClick={() => applyPanel()}>Zastosuj</button>
          </div>
          <div className="fmt-hint">{P.hint}</div>
        </div>
      )}
    </div>
  )
}

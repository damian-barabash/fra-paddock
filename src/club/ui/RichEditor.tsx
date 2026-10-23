import { useRef, useState } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Placeholder } from '@tiptap/extensions'
import { uploadImage } from '../api'
import Icon, { type IconName } from './Icon'

/** Rich text editor for posts, invitations, offers and pop-ups — headings, lists, quotes, links, photos. */
export default function RichEditor({
  value,
  onChange,
  placeholder = 'Napisz treść…',
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const file = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
    editorProps: { attributes: { class: 'rich rich-editor-area' } },
  })

  const st = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            h2: e.isActive('heading', { level: 2 }),
            h3: e.isActive('heading', { level: 3 }),
            bold: e.isActive('bold'),
            italic: e.isActive('italic'),
            underline: e.isActive('underline'),
            bullet: e.isActive('bulletList'),
            ordered: e.isActive('orderedList'),
            quote: e.isActive('blockquote'),
            link: e.isActive('link'),
            center: e.isActive({ textAlign: 'center' }),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null,
  })

  if (!editor || !st) return null
  const c = () => editor.chain().focus()

  const addLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Adres linku (puste = usuń link)', prev ?? 'https://')
    if (url === null) return
    if (!url.trim()) c().extendMarkRange('link').unsetLink().run()
    else c().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const onFile = async (f?: File) => {
    if (!f) return
    setErr('')
    setBusy(true)
    try {
      const src = await uploadImage(f, 'posts')
      c().setImage({ src, alt: '' }).run()
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
      if (file.current) file.current.value = ''
    }
  }

  const B = ({ icon, label, on, active, disabled, text }: { icon?: IconName; label: string; on: () => void; active?: boolean; disabled?: boolean; text?: string }) => (
    <button
      type="button"
      className={`rt-btn${active ? ' on' : ''}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
    >
      {icon ? <Icon name={icon} size={17} /> : <span className="rt-txt">{text}</span>}
    </button>
  )

  return (
    <div className="rich-editor">
      <div className="rt-bar" role="toolbar" aria-label="Formatowanie">
        <B text="H2" label="Nagłówek" active={st.h2} on={() => c().toggleHeading({ level: 2 }).run()} />
        <B text="H3" label="Podtytuł" active={st.h3} on={() => c().toggleHeading({ level: 3 }).run()} />
        <i className="rt-sep" />
        <B icon="bold" label="Pogrubienie" active={st.bold} on={() => c().toggleBold().run()} />
        <B icon="italic" label="Kursywa" active={st.italic} on={() => c().toggleItalic().run()} />
        <B icon="underline" label="Podkreślenie" active={st.underline} on={() => c().toggleUnderline().run()} />
        <i className="rt-sep" />
        <B icon="list" label="Lista" active={st.bullet} on={() => c().toggleBulletList().run()} />
        <B icon="olist" label="Lista numerowana" active={st.ordered} on={() => c().toggleOrderedList().run()} />
        <B icon="quote" label="Cytat" active={st.quote} on={() => c().toggleBlockquote().run()} />
        <B icon="alignCenter" label="Wyśrodkuj" active={st.center} on={() => (st.center ? c().setTextAlign('left').run() : c().setTextAlign('center').run())} />
        <B icon="rule" label="Linia" on={() => c().setHorizontalRule().run()} />
        <i className="rt-sep" />
        <B icon="link" label="Link" active={st.link} on={addLink} />
        <B icon="image" label={busy ? 'Wgrywanie…' : 'Zdjęcie'} disabled={busy} on={() => file.current?.click()} />
        <i className="rt-sep" />
        <B icon="undo" label="Cofnij" disabled={!st.canUndo} on={() => c().undo().run()} />
        <B icon="redo" label="Ponów" disabled={!st.canRedo} on={() => c().redo().run()} />
      </div>
      <EditorContent editor={editor} />
      {(busy || err) && <p className={`rt-status${err ? ' err' : ''}`}>{err || 'Wgrywanie zdjęcia…'}</p>}
      <input ref={file} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  )
}

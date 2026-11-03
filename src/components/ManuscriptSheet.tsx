import { useEffect, useRef } from 'react'
import { ManuscriptBody } from '../content/ManuscriptBody.tsx'

interface Props {
  open: boolean
  onClose: () => void
}

const FOCUSABLE = 'button, [href], [tabindex]:not([tabindex="-1"])'

export function ManuscriptSheet({ open, onClose }: Props) {
  const sheetRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const returnTo = document.activeElement as HTMLElement | null
    const root = document.documentElement
    root.classList.add('sheet-locked')
    // Everything behind the sheet leaves the tab order and the accessibility tree.
    const behind = Array.from(document.querySelectorAll<HTMLElement>('#masthead, #viewport, .skip-link'))
    behind.forEach((el) => (el.inert = true))
    const id = requestAnimationFrame(() => closeRef.current?.focus())

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !sheetRef.current) return
      const items = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('keydown', onKey)
      root.classList.remove('sheet-locked')
      behind.forEach((el) => (el.inert = false))
      returnTo?.focus({ preventScroll: true })
    }
  }, [open, onClose])

  return (
    <>
      <div id="sheet-backdrop" className={open ? 'is-open' : ''} onClick={onClose} aria-hidden="true" />
      <aside
        id="manuscript-sheet"
        ref={sheetRef}
        className={open ? 'is-open' : ''}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        inert={!open}
      >
        <div className="sheet-header">
          <h2 id="sheet-title">The Mechanics of Belief: Tradition &amp; the Mind</h2>
          <button type="button" ref={closeRef} className="sheet-close" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="sheet-content" tabIndex={0} role="region" aria-label="Manuscript text">
          <ManuscriptBody />
        </div>
      </aside>
    </>
  )
}

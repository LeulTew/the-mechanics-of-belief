import { LightingButton, ZemaButton } from './Toggles.tsx'

interface Props {
  vellum: boolean
  onToggleVellum: () => void
  zema: boolean
  onToggleZema: () => void
  sheetOpen: boolean
  onOpenSheet: () => void
  onHome: () => void
}

export function Masthead({ vellum, onToggleVellum, zema, onToggleZema, sheetOpen, onOpenSheet, onHome }: Props) {
  return (
    <header id="masthead">
      <a
        href="#top"
        className="masthead-brand"
        onClick={(e) => {
          e.preventDefault()
          onHome()
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 2v20M2 12h20M7 4.5h10M7 19.5h10M4.5 7v10M19.5 7v10M8.5 8.5l7 7M15.5 8.5l-7 7" />
        </svg>
        <span>The Mechanics of Belief</span>
      </a>
      <div className="masthead-actions">
        <LightingButton className="masthead-btn wide-only" vellum={vellum} onToggle={onToggleVellum} />
        <ZemaButton className="masthead-btn wide-only" playing={zema} onToggle={onToggleZema} />
        <button
          type="button"
          className="masthead-btn"
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={onOpenSheet}
        >
          <span>
            <span className="desktop-only">Complete </span>Manuscript
          </span>
        </button>
      </div>
    </header>
  )
}

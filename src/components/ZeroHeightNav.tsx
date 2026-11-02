import React from 'react'
import { ThemeMode } from '../types.ts'

interface ZeroHeightNavProps {
  onOpenSheet: () => void
  isSheetOpen: boolean
  isAudioPlaying: boolean
  onToggleAudio: () => void
  theme: ThemeMode
  onToggleTheme: () => void
}

export const ZeroHeightNav: React.FC<ZeroHeightNavProps> = ({
  onOpenSheet,
  isSheetOpen,
  isAudioPlaying,
  onToggleAudio,
  theme,
  onToggleTheme
}) => {
  return (
    <header id="masthead">
      <a href="#top" id="btn-reset-top" className="masthead-brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v20M2 12h20M7 4.5h10M7 19.5h10M4.5 7v10M19.5 7v10M8.5 8.5l7 7M15.5 8.5l-7 7" />
        </svg>
        <span>The Mechanics of Belief</span>
      </a>
      <div className="masthead-actions">
        <button
          type="button"
          id="btn-lighting-mode"
          className="masthead-btn"
          aria-pressed={theme === 'vellum'}
          aria-label="Toggle Subterranean Torchlight vs. Parchment Daylight"
          title="Toggle Subterranean Torchlight vs. Parchment Daylight"
          onClick={onToggleTheme}
        >
          <span id="lighting-label">
            {theme === 'sanctuary' ? 'Torchlit Sanctuary' : 'Parchment Daylight'}
          </span>
        </button>
        <button
          type="button"
          id="btn-zema-audio"
          className="masthead-btn"
          aria-pressed={isAudioPlaying}
          aria-label="Toggle St. Yared Zema Liturgical Resonance"
          title="Toggle St. Yared Zema Liturgical Resonance"
          onClick={onToggleAudio}
        >
          <span id="zema-dot" className={`zema-dot ${isAudioPlaying ? 'is-playing' : ''}`} />
          <span id="zema-label">
            ዜማ<span className="desktop-only"> · Zema Resonance</span>
          </span>
        </button>
        <button
          type="button"
          id="btn-open-sheet"
          className="masthead-btn"
          aria-haspopup="dialog"
          aria-expanded={isSheetOpen}
          aria-label="Open complete verbatim manuscript"
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

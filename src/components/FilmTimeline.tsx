import React, { useRef } from 'react'
import { ACTS } from '../data/actsData.ts'

interface FilmTimelineProps {
  progress: number
  activeActIndex: number
  onSelectAct: (actIdx: number) => void
}

export const FilmTimeline: React.FC<FilmTimelineProps> = ({
  progress,
  activeActIndex,
  onSelectAct
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (e: React.KeyboardEvent, currentIdx: number) => {
    let nextIdx = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIdx = (currentIdx + 1) % ACTS.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIdx = (currentIdx - 1 + ACTS.length) % ACTS.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIdx = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIdx = ACTS.length - 1
    }

    if (nextIdx !== -1) {
      onSelectAct(nextIdx)
      tabRefs.current[nextIdx]?.focus()
    }
  }

  return (
    <nav
      id="film-timeline"
      aria-label="Sanctuary Act Timeline"
      className="fixed bottom-6 right-6 z-[20] flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 shadow-2xl"
    >
      {/* 8 Ge'ez Numeral Tabs with ARIA tablist */}
      <div
        role="tablist"
        aria-label="Sanctuary acts"
        className="flex items-center gap-1 sm:gap-1.5"
      >
        {ACTS.map((act, idx) => {
          const isActive = idx === activeActIndex
          return (
            <button
              key={idx}
              ref={(el) => { tabRefs.current[idx] = el }}
              role="tab"
              id={`act-tab-${idx}`}
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              aria-controls={`act-panel-${idx}`}
              type="button"
              onClick={() => onSelectAct(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright rounded-full"
              title={`Act ${act.geez}: ${act.name}`}
              aria-label={`Act ${act.geez}: ${act.name}`}
            >
              <span
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-serif text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-bright text-neutral-950 font-bold shadow-[0_0_14px_rgba(226,198,150,0.8)] scale-110'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {act.geez}
              </span>
            </button>
          )
        })}
      </div>

      {/* Progress Indicator Line with ARIA progressbar */}
      <div
        role="progressbar"
        aria-label="Sanctuary orbital traversal progress"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-16 sm:w-24 h-1.5 bg-white/10 rounded-full overflow-hidden ml-1 hidden sm:block"
      >
        <div
          className="h-full bg-gold-bright transition-transform duration-75 origin-left"
          style={{ transform: `scaleX(${Math.max(0.02, progress)})` }}
        />
      </div>
    </nav>
  )
}

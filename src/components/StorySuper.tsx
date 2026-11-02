import React from 'react'
import { ACTS } from '../data/actsData.ts'

interface StorySuperProps {
  activeActIndex: number
  activeMomentIndex: number
  onOpenSheet: () => void
  onSelectMoment?: (momentIdx: number) => void
}

export const StorySuper: React.FC<StorySuperProps> = ({
  activeActIndex,
  activeMomentIndex,
  onOpenSheet,
  onSelectMoment
}) => {
  const act = ACTS[activeActIndex] || ACTS[0]
  const moment = act.moments[activeMomentIndex] || act.moments[0]

  const posClass = moment.textPos || 'pos-left'

  return (
    <section
      id="story-super"
      className={posClass}
      aria-label="Monograph Narrative Stage"
    >
      <div id="a11y-live-story" className="sr-only" aria-live="polite" aria-atomic="true">
        {moment.headline} {moment.lead}
      </div>

      {/* Restrained Monograph Chapter Trigger */}
      <div
        id="ui-chapter-trigger"
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={false}
        aria-label="Open complete manuscript drawer"
        title="Click to open complete manuscript"
        onClick={onOpenSheet}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpenSheet()
          }
        }}
        className="chapter-whisper"
      >
        <span className="geez-num" id="ui-geez">
          {act.geez}
        </span>
        <span className="chapter-rule" aria-hidden="true" />
        <span className="chapter-name" id="ui-act-name">
          {act.name}
        </span>
      </div>

      <div id="super-text-stage" className="super-text-stage" aria-hidden="true">
        {/* High-Contrast Editorial Display Serif */}
        <h1
          key={`h1-${activeActIndex}-${activeMomentIndex}`}
          className="super-headline"
          id="ui-headline"
        >
          {moment.headline}
        </h1>

        {/* Clean Humanist Sans Body Copy */}
        <p
          key={`p-${activeActIndex}-${activeMomentIndex}`}
          className="super-body"
          id="ui-lead"
        >
          {moment.lead}
        </p>
      </div>

      {/* Subbeat Chapter Switcher — Minimalist Editorial Hairlines */}
      <div className="subbeat-nav" id="ui-subbeats" role="tablist" aria-label="Chapter Moments">
        {act.moments.map((mom, mIdx) => (
          <button
            key={mIdx}
            type="button"
            className={`subbeat-node ${mIdx === activeMomentIndex ? 'is-current' : ''}`}
            role="tab"
            aria-selected={mIdx === activeMomentIndex}
            onClick={() => onSelectMoment?.(mIdx)}
          >
            {mom.label}
          </button>
        ))}
      </div>
    </section>
  )
}

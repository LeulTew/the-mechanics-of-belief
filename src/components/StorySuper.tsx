import React from 'react'
import { ACTS } from '../data/actsData.ts'

interface StorySuperProps {
  activeActIndex: number
  activeMomentIndex: number
}

export const StorySuper: React.FC<StorySuperProps> = ({
  activeActIndex,
  activeMomentIndex
}) => {
  const act = ACTS[activeActIndex] || ACTS[0]
  const moment = act.moments[activeMomentIndex] || act.moments[0]

  const posClass = moment.textPos || 'pos-left'

  return (
    <section
      id="story-super"
      className={posClass}
      aria-live="polite"
    >
      {/* Restrained Monograph Chapter Index */}
      <div className="chapter-whisper">
        <span className="geez-num">ምዕራፍ {act.geez}</span>
        <span className="chapter-rule" aria-hidden="true" />
        <span className="chapter-title">{act.name}</span>
      </div>

      <div className="super-text-stage">
        {/* High-Contrast Editorial Display Serif */}
        <h1
          key={`h1-${activeActIndex}-${activeMomentIndex}`}
          className="super-headline"
        >
          {moment.headline}
        </h1>

        {/* Clean Humanist Sans Body Copy */}
        <p
          key={`p-${activeActIndex}-${activeMomentIndex}`}
          className="super-body"
        >
          {moment.lead}
        </p>
      </div>
    </section>
  )
}

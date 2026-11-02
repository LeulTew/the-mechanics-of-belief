import React from 'react'
import { ACTS } from '../data/actsData.ts'

interface StorySuperProps {
  activeActIndex: number
  activeMomentIndex: number
}

// Fluid choreographed layout positions
const POS_STYLES: Record<string, string> = {
  'pos-left': 'items-start text-left left-6 sm:left-14 right-auto max-w-2xl',
  'pos-right': 'items-end text-right right-6 sm:right-14 left-auto max-w-2xl ml-auto',
  'pos-center-bottom': 'items-center text-center inset-x-6 sm:inset-x-14 max-w-3xl mx-auto',
  'pos-top-left': 'items-start text-left left-6 sm:left-14 top-28 bottom-auto max-w-2xl'
}

export const StorySuper: React.FC<StorySuperProps> = ({
  activeActIndex,
  activeMomentIndex
}) => {
  const act = ACTS[activeActIndex] || ACTS[0]
  const moment = act.moments[activeMomentIndex] || act.moments[0]

  const posClass = POS_STYLES[moment.textPos] || POS_STYLES['pos-left']

  return (
    <div
      id="story-super"
      className={`fixed bottom-24 sm:bottom-28 z-[10] pointer-events-none px-4 sm:px-8 transition-all duration-700 ease-out flex flex-col ${posClass}`}
    >
      {/* Authentic Cultural Chapter Header */}
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="font-fidel text-gold-bright text-sm sm:text-base font-normal tracking-wide">
          ምዕራፍ {act.geez}
        </span>
        <span className="text-zinc-600 text-xs">/</span>
        <span className="font-sans text-[11px] sm:text-xs font-medium tracking-[0.22em] text-zinc-300 uppercase">
          {act.name}
        </span>
      </div>

      {/* Poster-Scale Monograph Headline */}
      <h1
        key={`h1-${activeActIndex}-${activeMomentIndex}`}
        className="text-poster-headline font-serif font-normal leading-[1.12] tracking-tight mb-3.5 transition-all duration-500 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
        style={{ color: 'var(--ink)' }}
      >
        {moment.headline}
      </h1>

      {/* Refined Editorial Lead Text */}
      <p
        key={`p-${activeActIndex}-${activeMomentIndex}`}
        className="text-editorial-lead font-sans font-normal max-w-2xl leading-relaxed transition-all duration-500 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        style={{ color: 'var(--ink-secondary)' }}
      >
        {moment.lead}
      </p>
    </div>
  )
}

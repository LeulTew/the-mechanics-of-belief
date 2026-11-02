import React, { useEffect, useState } from 'react'
import { ACTS } from '../data/actsData.ts'

interface StorySuperProps {
  activeActIndex: number
  activeMomentIndex: number
}

// Authentic Ge'ez Fidel syllabary and liturgical punctuation pool
const GEEZ_FIDEL_POOL = 'ሀለሐመሠረሰሸቀበተኀነአከወዐዘየደገጠጰጸፀፈፐ፩፪፫፬፭፮፯፰፱፲፳፴፵፶፷፸፹፺፻።፡፤'

// Choreographed layout positions from actsData.ts
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

  const [cipherText, setCipherText] = useState('')
  const [headlineWords, setHeadlineWords] = useState<string[]>([])

  // ScrambleText cipher effect using authentic Ge'ez Fidel
  useEffect(() => {
    let iteration = 0
    const target = `ክፍል ${act.geez} // ${moment.label.toUpperCase()}`

    const interval = setInterval(() => {
      setCipherText(
        target
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '/' || index < iteration) {
              return target[index]
            }
            return GEEZ_FIDEL_POOL[Math.floor(Math.random() * GEEZ_FIDEL_POOL.length)]
          })
          .join('')
      )

      if (iteration >= target.length) {
        clearInterval(interval)
      }
      iteration += 1 / 2
    }, 28)

    return () => clearInterval(interval)
  }, [act.geez, moment.label])

  // Word-stagger animation on moment change
  useEffect(() => {
    // Strip HTML tags for word breakdown
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = moment.headline
    const words = tempDiv.textContent?.split(' ') || []
    setHeadlineWords(words)
  }, [moment.headline])

  const posClass = POS_STYLES[moment.textPos] || POS_STYLES['pos-left']

  return (
    <div
      id="story-super"
      className={`fixed bottom-24 sm:bottom-28 z-[10] pointer-events-none px-4 sm:px-8 transition-all duration-700 ease-out flex flex-col ${posClass}`}
    >
      {/* Sacred Ge'ez Chapter Cipher Pill */}
      <div className="flex items-center gap-3 mb-3">
        <span className="px-3.5 py-1 rounded-full bg-black/60 border border-gold-bright/40 backdrop-blur-md text-xs font-mono text-gold-bright flex items-center gap-2 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-bright animate-pulse" />
          <span className="font-fidel">{cipherText}</span>
        </span>
        <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase hidden sm:inline-block">
          {moment.motionType}
        </span>
      </div>

      {/* Poster-Scale Monograph Headline with Fluid Typography */}
      <h1
        className="text-poster-headline font-normal leading-tight tracking-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] transition-opacity duration-500"
        style={{ color: 'var(--ink)' }}
        dangerouslySetInnerHTML={{ __html: moment.headline }}
      />

      {/* Crisp Editorial Lead Text */}
      <p
        className="text-editorial-lead max-w-2xl leading-relaxed drop-shadow-md opacity-90 transition-opacity duration-500"
        style={{ color: 'var(--ink-secondary)' }}
      >
        {moment.lead}
      </p>
    </div>
  )
}

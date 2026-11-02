import { Fragment, useLayoutEffect, useRef } from 'react'
import { ACTS } from '../data/acts.ts'

interface Props {
  act: number
  beat: number
  reducedMotion: boolean
  onOpenSheet: () => void
  onSelectBeat: (beat: number) => void
}

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'

export function StorySuper({ act, beat, reducedMotion, onOpenSheet, onSelectBeat }: Props) {
  const a = ACTS[act]
  const b = a.beats[beat]
  const headRef = useRef<HTMLHeadingElement>(null)
  const leadRef = useRef<HTMLParagraphElement>(null)
  const words = b.headline.split(' ')

  // Words rise in one after another; the lead follows as a single line of motion.
  useLayoutEffect(() => {
    if (reducedMotion) return
    const anims: Animation[] = []
    headRef.current?.querySelectorAll<HTMLElement>('.rb-word').forEach((w, i) => {
      anims.push(
        w.animate(
          [
            { opacity: 0, transform: 'translate3d(0, 10px, 0) scale(0.97)', filter: 'blur(2.5px)' },
            { opacity: 1, transform: 'none', filter: 'blur(0)' }
          ],
          { duration: 420, delay: i * 22, easing: EASE, fill: 'backwards' }
        )
      )
    })
    if (leadRef.current) {
      anims.push(
        leadRef.current.animate(
          [
            { opacity: 0, transform: 'translate3d(0, 8px, 0)', filter: 'blur(2px)' },
            { opacity: 1, transform: 'none', filter: 'blur(0)' }
          ],
          { duration: 380, delay: 60, easing: EASE, fill: 'backwards' }
        )
      )
    }
    return () => anims.forEach((x) => x.cancel())
  }, [act, beat, reducedMotion])

  return (
    <section id="story-super" className={b.textPos} aria-labelledby="ui-headline">
      <p className="sr-only" aria-live="polite">
        Chapter {act + 1}, {a.name}: {b.headline}
      </p>
      <button type="button" className="chapter-whisper" aria-haspopup="dialog" title="Read the full manuscript" onClick={onOpenSheet}>
        <span className="geez-num" lang="am" aria-hidden="true">{a.geez}</span>
        <span className="chapter-rule" aria-hidden="true" />
        <span className="chapter-name">
          <span className="sr-only">Chapter {act + 1}: </span>
          {a.name}
        </span>
      </button>

      <div className="super-text-stage">
        <h1 className="super-headline" id="ui-headline" ref={headRef} key={`h${act}-${beat}`}>
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className="rb-word">{w}</span>
              {i < words.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </h1>
        <p className="super-body" ref={leadRef} key={`p${act}-${beat}`}>
          {b.lead}
        </p>
      </div>

      <div className="subbeat-nav" aria-label="Moments in this chapter" role="group">
        {a.beats.map((m, i) => (
          <button
            key={i}
            type="button"
            className={`subbeat-node${i === beat ? ' is-current' : ''}`}
            aria-current={i === beat ? 'step' : undefined}
            onClick={() => onSelectBeat(i)}
          >
            {m.label}
          </button>
        ))}
      </div>
    </section>
  )
}

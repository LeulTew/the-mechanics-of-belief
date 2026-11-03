import { useEffect, useState } from 'react'

interface Props {
  ready: boolean
  reducedMotion: boolean
}

// A held breath before the cliff appears: title, a hairline that fills, then lift.
export function Intro({ ready, reducedMotion }: Props) {
  const [minDone, setMinDone] = useState(false)
  const [gone, setGone] = useState(false)
  const out = ready && minDone

  useEffect(() => {
    const t = window.setTimeout(() => setMinDone(true), reducedMotion ? 250 : 1700)
    return () => window.clearTimeout(t)
  }, [reducedMotion])

  useEffect(() => {
    if (!out) return
    const t = window.setTimeout(() => setGone(true), reducedMotion ? 0 : 1100)
    return () => window.clearTimeout(t)
  }, [out, reducedMotion])

  useEffect(() => {
    document.documentElement.classList.toggle('intro-locked', !gone)
    return () => document.documentElement.classList.remove('intro-locked')
  }, [gone])

  if (gone) return null
  return (
    <div className={`intro${out ? ' is-out' : ''}`} aria-hidden={out} role="status" aria-label="Loading">
      <div className="intro-inner">
        <span className="intro-geez" lang="am">
          ፩ ፪ ፫ ፬ ፭ ፮ ፯ ፰
        </span>
        <p className="intro-title">The Mechanics of Belief</p>
        <p className="intro-sub">Tradition &amp; the Mind</p>
        <span className="intro-line" aria-hidden="true">
          <span />
        </span>
      </div>
    </div>
  )
}

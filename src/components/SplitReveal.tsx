import { createElement, useEffect, useRef } from 'react'

// Word-by-word blur-in, started when the text scrolls into view.
interface Props {
  text: string
  as?: 'h1' | 'h2' | 'p' | 'span'
  className?: string
  delay?: number
  stagger?: number
  reducedMotion: boolean
}

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'

export function SplitReveal({ text, as = 'h2', className, delay = 0, stagger = 55, reducedMotion }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || reducedMotion) return
    const words = Array.from(root.querySelectorAll<HTMLElement>('.rb-word'))
    words.forEach((w) => (w.style.opacity = '0'))
    let anims: Animation[] = []
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        anims = words.map((w, i) => {
          const a = w.animate(
            [
              { opacity: 0, transform: 'translate3d(0, 0.35em, 0)', filter: 'blur(6px)' },
              { opacity: 1, transform: 'none', filter: 'blur(0)' }
            ],
            { duration: 900, delay: delay + i * stagger, easing: EASE, fill: 'both' }
          )
          a.onfinish = () => {
            w.style.opacity = ''
            a.cancel()
          }
          return a
        })
      },
      { threshold: 0.35 }
    )
    io.observe(root)
    return () => {
      io.disconnect()
      anims.forEach((a) => a.cancel())
      words.forEach((w) => (w.style.opacity = ''))
    }
  }, [text, delay, stagger, reducedMotion])

  const words = text.split(' ')
  return createElement(
    as,
    { ref, className },
    words.map((w, i) => (
      <span key={i}>
        <span className="rb-word">{w}</span>
        {i < words.length - 1 ? ' ' : null}
      </span>
    ))
  )
}

import { useEffect, useRef, useState } from 'react'
import { ManuscriptBody } from '../content/ManuscriptBody.tsx'
import { SplitReveal } from './SplitReveal.tsx'

interface Props {
  reducedMotion: boolean
  onHome: () => void
}

const SECTIONS = [
  'Before Judging the Perspective',
  'What Does Your Belief Actually Do to Your Mind?',
  'Why Genuine Belief Actually Works',
  'Where It Fails Most People',
  'Comparative Analytical Framework'
]
const NUMERALS = ['፩', '፪', '፫', '፬', '፭']

// The closing page: the whole essay set for reading, below the sanctuary.
export function Reading({ reducedMotion, onHome }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const proseRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

  // Reveal blocks as they enter; mark the section being read.
  useEffect(() => {
    const prose = proseRef.current
    if (!prose) return
    const heads = Array.from(prose.querySelectorAll<HTMLElement>('h3'))
    const blocks = Array.from(prose.querySelectorAll<HTMLElement>('p:not(.sheet-dek), li, .sheet-table-wrap'))
    const all = blocks.concat(heads)
    if (!reducedMotion) all.forEach((b) => b.classList.add('rv'))
    const revealer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            revealer.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    all.forEach((b) => revealer.observe(b))

    const marker = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(heads.indexOf(e.target as HTMLElement))
        }),
      { rootMargin: '-20% 0px -70% 0px' }
    )
    heads.forEach((h) => marker.observe(h))
    return () => {
      revealer.disconnect()
      marker.disconnect()
      all.forEach((b) => b.classList.remove('rv', 'is-in'))
    }
  }, [reducedMotion])

  // Reading progress, written straight to a CSS transform.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = rootRef.current
      const bar = barRef.current
      if (!el || !bar) return
      const r = el.getBoundingClientRect()
      const p = -r.top / Math.max(1, r.height - window.innerHeight)
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p)).toFixed(4)})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const jump = (i: number) => {
    const h = proseRef.current?.querySelectorAll('h3')[i]
    h?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <article id="manuscript" className="reading" ref={rootRef} aria-labelledby="reading-title">
      <div className="reading-progress" aria-hidden="true">
        <div ref={barRef} />
      </div>

      <header className="reading-head">
        <p className="reading-eyebrow">
          <span lang="am">፩ — ፰</span>
          <span className="chapter-rule" aria-hidden="true" />
          The complete manuscript
        </p>
        <h2 id="reading-title" className="sr-only">
          The Mechanics of Belief: Tradition and the Mind
        </h2>
        <SplitReveal as="p" className="reading-title" text="The Mechanics of Belief" reducedMotion={reducedMotion} />
        <p className="reading-sub" aria-hidden="true">
          Tradition and the Mind
        </p>
      </header>

      <div className="reading-body">
        <nav className="reading-index" aria-label="Sections of the manuscript">
          <ol>
            {SECTIONS.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  className={i === current ? 'is-current' : ''}
                  aria-current={i === current ? 'true' : undefined}
                  onClick={() => jump(i)}
                >
                  <span lang="am" aria-hidden="true">
                    {NUMERALS[i]}
                  </span>
                  <span>{s}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="reading-prose" ref={proseRef}>
          <ManuscriptBody />
        </div>
      </div>

      <footer className="reading-foot">
        <SplitReveal as="p" className="reading-epigraph" text="Be still, and know that I am God." reducedMotion={reducedMotion} stagger={90} />
        <button type="button" className="reading-return" onClick={onHome}>
          <span>Return to the beginning</span>
          <span className="reading-return-rule" aria-hidden="true" />
        </button>
        <p className="reading-colophon">Set in Cormorant Garamond, Plus Jakarta Sans and Noto Serif Ethiopic.</p>
      </footer>
    </article>
  )
}

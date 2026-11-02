import { useCallback, useEffect, useRef, useState } from 'react'
import { progressFor } from './data/acts.ts'
import { SanctuaryEngine } from './engine/SanctuaryEngine.ts'
import { useZema } from './engine/zema.ts'
import { Masthead } from './components/Masthead.tsx'
import { StorySuper } from './components/StorySuper.tsx'
import { LensControls } from './components/LensControls.tsx'
import { FilmTimeline } from './components/FilmTimeline.tsx'
import { ManuscriptSheet } from './components/ManuscriptSheet.tsx'
import { Shrines } from './components/Shrines.tsx'

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function scrollToProgress(p: number) {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  window.scrollTo({ top: p * max, behavior: reducedMotion ? 'auto' : 'smooth' })
}

export function App() {
  const [beat, setBeat] = useState({ act: 0, beat: 0 })
  const [vellum, setVellum] = useState(false)
  const [macro, setMacro] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const zema = useZema()

  const viewportRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rigRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const shrineRefs = useRef<HTMLElement[]>([])
  const engine = useRef<SanctuaryEngine | null>(null)

  useEffect(() => {
    const e = new SanctuaryEngine(
      {
        viewport: viewportRef.current!,
        canvas: canvasRef.current!,
        rig: rigRef.current!,
        world: worldRef.current!,
        shrines: shrineRefs.current,
        progressBar: progressRef.current!
      },
      {
        reducedMotion,
        onBeat: (act, b) => setBeat((prev) => (prev.act === act && prev.beat === b ? prev : { act, beat: b }))
      }
    )
    engine.current = e
    if (import.meta.env.DEV) (window as unknown as { __sanctuary: SanctuaryEngine }).__sanctuary = e
    return () => {
      e.destroy()
      engine.current = null
    }
  }, [])

  useEffect(() => {
    engine.current?.setVellum(vellum)
    document.body.classList.toggle('theme-vellum', vellum)
  }, [vellum])

  useEffect(() => engine.current?.setMacro(macro), [macro])
  useEffect(() => engine.current?.setPaused(sheetOpen), [sheetOpen])

  const openSheet = useCallback(() => setSheetOpen(true), [])
  const closeSheet = useCallback(() => setSheetOpen(false), [])
  const toggleVellum = useCallback(() => setVellum((v) => !v), [])

  return (
    <>
      <a className="skip-link" href="#film-timeline">
        Skip to chapters
      </a>

      <Masthead
        vellum={vellum}
        onToggleVellum={toggleVellum}
        zema={zema.playing}
        onToggleZema={zema.toggle}
        sheetOpen={sheetOpen}
        onOpenSheet={openSheet}
        onHome={() => scrollToProgress(0)}
      />

      <main id="viewport" ref={viewportRef}>
        <canvas id="canvas-3d-world" ref={canvasRef} aria-hidden="true" />

        <div id="camera-rig-3d" ref={rigRef}>
          <div id="world-3d" ref={worldRef}>
            <Shrines nodes={shrineRefs} />
          </div>
        </div>

        <StorySuper
          act={beat.act}
          beat={beat.beat}
          reducedMotion={reducedMotion}
          onOpenSheet={openSheet}
          onSelectBeat={(b) => scrollToProgress(progressFor(beat.act, b))}
        />

        <LensControls
          macro={macro}
          onToggleMacro={() => setMacro((m) => !m)}
          onReset={() => engine.current?.resetView()}
          vellum={vellum}
          onToggleVellum={toggleVellum}
          zema={zema.playing}
          onToggleZema={zema.toggle}
        />

        <FilmTimeline act={beat.act} progressRef={progressRef} onSelectAct={(i) => scrollToProgress(progressFor(i))} />
      </main>

      <div id="scroll-runway" aria-hidden="true" />

      <ManuscriptSheet open={sheetOpen} onClose={closeSheet} />
    </>
  )
}

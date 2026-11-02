import React, { useState, Suspense, lazy } from 'react'
import './style.css'
import { ZeroHeightNav } from './components/ZeroHeightNav.tsx'
import { ArchitecturalGrid } from './components/ArchitecturalGrid.tsx'
import { SplitText, ScrambleText, ScrollReveal } from './components/TextMotion.tsx'
import { WorkShowcase } from './components/WorkShowcase.tsx'
import { InteractiveLab } from './components/InteractiveLab.tsx'
import { PhilosophySection } from './components/PhilosophySection.tsx'
import { ContactSection } from './components/ContactSection.tsx'
import { VisualMode, WebGLMetrics } from './types.ts'
import heroFallbackStill from './assets/hero.png'

// Lazy-load Three.js WebGL scene to decouple heavy 3D shaders from initial critical paint
const HeroScene = lazy(() =>
  import('./components/HeroScene.tsx').then((module) => ({ default: module.HeroScene }))
)

export function App() {
  const [visualMode, setVisualMode] = useState<VisualMode>('crystal')
  const [metrics, setMetrics] = useState<WebGLMetrics>({
    fps: 60,
    drawCalls: 2,
    triangles: 8192,
    particleCount: 900
  })

  return (
    <div className="min-h-screen bg-[#07080d] text-[#f4f4f7] relative selection:bg-indigo-500/40 selection:text-white">
      {/* Zero-Height Top Wayfinding & Navigation */}
      <ZeroHeightNav />

      {/* Hardware-Accelerated Architectural Coordinate Grid */}
      <ArchitecturalGrid />

      {/* Main Content Area */}
      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-5 sm:px-8 max-w-7xl mx-auto">
          {/* Subtle Radial Glow */}
          <div className="absolute inset-0 hero-glow pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Editorial Copy */}
            <div className="lg:col-span-7 flex flex-col justify-center z-10">
              {/* Monogram Badge & Cipher */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-indigo-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  LEUL TEWODROS // CREATIVE 3D
                </span>
                <ScrambleText
                  text="[0.00 CLS · < 38ms LCP]"
                  className="text-xs text-zinc-400 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] font-mono"
                />
              </div>

              {/* Poster-Scale Typography with Accessible SplitText */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
                <SplitText>HIGH-END 3D</SplitText> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-amber-200">
                  <SplitText>EXPERIENCES.</SplitText>
                </span>
              </h1>

              {/* Quiet, Crisp Subtitle with ScrollReveal */}
              <ScrollReveal className="text-zinc-300 text-sm sm:text-lg max-w-xl font-sans leading-relaxed mb-8">
                Bespoke WebGL engineering, 1-pixel still-to-live Blender PBR handoffs, and
                high-performance creative architectures built without template slop.
              </ScrollReveal>

              {/* Visual Mode Selector Pills with Accessible Touch Targets */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-xs font-mono text-zinc-400 mr-2">Render Mode:</span>
                {(['crystal', 'gaussian', 'wireframe', 'chrome'] as VisualMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setVisualMode(mode)}
                    aria-pressed={visualMode === mode}
                    className={`min-h-[44px] sm:min-h-0 px-4 py-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-mono transition-all capitalize cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                      visualMode === mode
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Action CTAs (Strict word budget <= 3 words & >= 44px touch targets) */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#work"
                  className="min-h-[44px] px-6 py-3 rounded-full bg-white text-black font-semibold text-xs sm:text-sm tracking-wide hover:bg-zinc-200 transition-all no-underline shadow-lg shadow-white/10 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  Explore Work ↓
                </a>
                <a
                  href="#lab"
                  className="min-h-[44px] px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white text-xs sm:text-sm font-mono tracking-wide transition-all no-underline flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  Inspect Lab ⚙
                </a>
              </div>
            </div>

            {/* Hero 3D Stage Column */}
            <div className="lg:col-span-5 h-[380px] sm:h-[480px] lg:h-[580px] relative rounded-3xl bg-[#090a12]/60 border border-white/[0.06] overflow-hidden flex items-center justify-center shadow-2xl shadow-indigo-950/20">
              <Suspense
                fallback={
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={heroFallbackStill}
                      alt="3D Iridescent Monolith Artwork"
                      className="w-full h-full object-contain max-w-[420px] max-h-[420px] filter drop-shadow-[0_15px_30px_rgba(99,102,241,0.25)]"
                      loading="eager"
                    />
                  </div>
                }
              >
                <HeroScene mode={visualMode} onMetricsUpdate={setMetrics} />
              </Suspense>

              {/* Floating WebGL Telemetry Chip */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2 rounded-xl bg-black/60 border border-white/[0.08] backdrop-blur-md text-[11px] font-mono text-zinc-400 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-zinc-200">{metrics.fps} FPS</span>
                </div>
                <span>{metrics.particleCount} Splats</span>
                <span className="text-indigo-400 uppercase">{visualMode}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 01 // SELECTED WORK SHOWCASE */}
        <WorkShowcase />

        {/* 02 // INTERACTIVE 3D LAB */}
        <InteractiveLab
          currentMode={visualMode}
          onModeChange={setVisualMode}
          metrics={metrics}
        />

        {/* 03 // PHILOSOPHY & THESIS */}
        <PhilosophySection />
      </main>

      {/* 04 // CONTACT & TERMINAL */}
      <ContactSection />
    </div>
  )
}

export default App

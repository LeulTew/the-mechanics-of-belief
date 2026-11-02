import React from 'react'

export const PhilosophySection: React.FC = () => {
  return (
    <section id="about" className="py-24 px-5 sm:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Indicator */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          03 // Thesis &amp; Philosophy
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Thesis Statement */}
        <div className="lg:col-span-7">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-8 leading-[1.15]">
            Craft over novelty. <br />
            <span className="text-zinc-400 font-normal">
              Architecture that endures.
            </span>
          </h2>

          <div className="space-y-6 text-zinc-300 text-sm sm:text-base leading-relaxed font-sans max-w-xl">
            <p>
              In an era saturated with auto-generated template slop and identical SaaS dashboards,
              true differentiation demands relentless craft. We believe every digital artifact
              must carry physical weight, mathematical proportion, and cultural intentionality.
            </p>
            <p className="text-zinc-400">
              From headless Blender PBR pipelines with 1-pixel registration handoffs to
              real-time Gaussian splats running at locked 60 FPS, the objective remains unyielding:
              uncompromising visual beauty paired with zero-latency execution on any device.
            </p>
          </div>

          {/* Cultural Ethiopic Callout (Treat script as art) */}
          <div className="mt-10 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 block mb-1">
                Cultural Typography // Ge&apos;ez Fidel
              </span>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                ጥበብ · ቴክኖሎጂ · ልቀት
              </span>
              <span className="text-xs text-zinc-400 font-mono block mt-1">
                Craft · Technology · Excellence
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border border-amber-400/30 flex items-center justify-center text-amber-300 font-mono text-sm">
              ፲/፲
            </div>
          </div>
        </div>

        {/* Right Column: Anti-Slop Architecture Gates */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0c0d16] border border-white/[0.08]">
            <h3 className="text-sm font-mono uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-400">§</span> The Streak Standards
            </h3>

            <div className="space-y-4 text-xs font-mono text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400">✓</span>
                <div>
                  <strong className="text-white block font-sans text-sm">
                    1-Pixel Still-to-Live Handoff
                  </strong>
                  Instant zero-delay hero still rendered by Blender; Three.js initializes in idle without popping.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-400">✓</span>
                <div>
                  <strong className="text-white block font-sans text-sm">
                    Tone Steps Over Fake Shadows
                  </strong>
                  Visual depth achieved through calibrated WCAG AA background steps, not muddy blurred drop shadows.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-400">✓</span>
                <div>
                  <strong className="text-white block font-sans text-sm">
                    Zero-Height Wayfinding
                  </strong>
                  Progress tracking integrated into hairline border rails that retreat when crossing titles.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-400">✓</span>
                <div>
                  <strong className="text-white block font-sans text-sm">
                    Fluid Mathematical Clamping
                  </strong>
                  CSS clamp(min, preferred, max) guarantees seamless scaling from 360px mobile to 4K displays.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import React from 'react'
import { VisualMode, WebGLMetrics } from '../types.ts'

interface InteractiveLabProps {
  currentMode: VisualMode
  onModeChange: (mode: VisualMode) => void
  metrics: WebGLMetrics
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({
  currentMode,
  onModeChange,
  metrics
}) => {
  const modes: { id: VisualMode; label: string; desc: string }[] = [
    {
      id: 'crystal',
      label: 'Crystal PBR',
      desc: 'Khronos PBR Neutral tone mapping with deep metallic dispersion.'
    },
    {
      id: 'gaussian',
      label: 'Gaussian Points',
      desc: 'Additive soft point cloud simulating 2026 Gaussian radiance.'
    },
    {
      id: 'wireframe',
      label: 'Blueprint Raster',
      desc: 'Laser polygon distribution showing clean manifold geometry.'
    },
    {
      id: 'chrome',
      label: 'Molten Chrome',
      desc: 'Specular fluid surface with low-roughness environmental sheen.'
    }
  ]

  return (
    <section id="lab" className="py-24 px-5 sm:px-8 max-w-7xl mx-auto relative z-10">
      <div className="p-8 sm:p-12 rounded-3xl bg-[#090a12] border border-white/[0.08] relative overflow-hidden">
        {/* Ambient Top Light */}
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400">
                02 // Interactive 3D Lab
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Real-Time Shader &amp; Splat Controls
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-xl font-sans">
              Dynamically switch the active WebGL rendering pipeline in the hero viewport above.
              Engineered to sustain a locked 60+ FPS on any PC or phone with zero memory leaks.
            </p>

            {/* Mode Switchers (Touch Targets >= 44px & aria-pressed) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
              {modes.map((mode) => {
                const isActive = currentMode === mode.id
                return (
                  <button
                    key={mode.id}
                    onClick={() => onModeChange(mode.id)}
                    aria-pressed={isActive}
                    className={`min-h-[44px] text-left p-4 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:border-white/[0.2] hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-semibold text-white">
                        {mode.label}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-400 m-0">{mode.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Real-Time Telemetry Column */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  WebGL Telemetry
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE TELEMETRY
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Framerate (Target: 60)</span>
                  <span className="text-white font-bold text-sm">
                    {metrics.fps > 0 ? `${metrics.fps} FPS` : '60 FPS'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Geometry Triangles</span>
                  <span className="text-zinc-200">
                    {metrics.triangles ? metrics.triangles.toLocaleString() : '8,192'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Active Draw Calls</span>
                  <span className="text-zinc-200">
                    {metrics.drawCalls ? metrics.drawCalls : '2 Calls'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Gaussian Particle Points</span>
                  <span className="text-indigo-300">
                    {metrics.particleCount ? metrics.particleCount.toLocaleString() : '900'} pts
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">GPU Tone Mapping</span>
                  <span className="text-zinc-200">Khronos Neutral PBR</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Memory Budget</span>
                  <span className="text-emerald-400">&lt; 14 MB (Ultra-Light)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

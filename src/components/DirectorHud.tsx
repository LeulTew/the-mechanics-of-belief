import React from 'react'
import { ZemaMode, WebGLMetrics } from '../types.ts'

interface DirectorHudProps {
  deepZoom: boolean
  onToggleDeepZoom: () => void
  onResetLook: () => void
  lookYaw: number
  lookPitch: number
  walkX: number
  walkZ: number
  currentZemaMode: ZemaMode
  onSelectZemaMode: (mode: ZemaMode) => void
  metrics: WebGLMetrics
}

export const DirectorHud: React.FC<DirectorHudProps> = ({
  deepZoom,
  onToggleDeepZoom,
  onResetLook,
  lookYaw,
  lookPitch,
  walkX,
  walkZ,
  currentZemaMode,
  onSelectZemaMode,
  metrics
}) => {
  return (
    <aside
      id="director-hud"
      aria-label="Director Controls"
      className="fixed bottom-6 left-6 z-[20] hidden md:flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 text-xs font-mono text-zinc-300 shadow-xl"
    >
      {/* 35mm vs 85mm Lens Toggle */}
      <button
        type="button"
        onClick={onToggleDeepZoom}
        className={`px-3 py-1 rounded-full transition-all cursor-pointer border ${
          deepZoom
            ? 'bg-gold-bright/20 border-gold-bright text-gold-bright shadow-sm'
            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
        }`}
        title="Toggle Camera Focal Length"
      >
        {deepZoom ? '85mm Macro' : '35mm Wide'}
      </button>

      {/* 360 Orientation Reset */}
      <button
        type="button"
        onClick={onResetLook}
        className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
        title="Reset 360 Free-Look Orientation"
      >
        Reset Camera
      </button>

      {/* Liturgical Mode Selector */}
      <div className="flex items-center gap-1 border-l border-white/10 pl-3">
        {(['geez', 'ezel', 'araray'] as ZemaMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onSelectZemaMode(mode)}
            className={`px-2 py-0.5 rounded capitalize text-[10px] transition-all cursor-pointer ${
              currentZemaMode === mode
                ? 'bg-gold-bright text-black font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Real-Time Telemetry Monitor */}
      <div className="flex items-center gap-3 border-l border-white/10 pl-3 text-[10px] text-zinc-400">
        <span>YAW: {lookYaw.toFixed(1)}°</span>
        <span>PITCH: {lookPitch.toFixed(1)}°</span>
        <span>FPS: {metrics.fps}</span>
        <span className="text-gold-bright">DRS: {(metrics.drsResolution * 100).toFixed(0)}%</span>
      </div>
    </aside>
  )
}

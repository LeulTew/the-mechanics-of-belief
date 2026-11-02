import React from 'react'
import { ThemeMode } from '../types.ts'

interface ZeroHeightNavProps {
  onOpenSheet: () => void
  isAudioPlaying: boolean
  onToggleAudio: () => void
  theme: ThemeMode
  onToggleTheme: () => void
  onToggleBlenderModal: () => void
}

export const ZeroHeightNav: React.FC<ZeroHeightNavProps> = ({
  onOpenSheet,
  isAudioPlaying,
  onToggleAudio,
  theme,
  onToggleTheme,
  onToggleBlenderModal
}) => {
  return (
    <header
      id="masthead"
      className="fixed top-0 inset-x-0 z-[30] pointer-events-none p-4 sm:p-6 flex items-center justify-between"
    >
      {/* Monogram Brand Mark */}
      <div className="pointer-events-auto flex items-center gap-3">
        <a
          href="#"
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-serif tracking-wide text-xs sm:text-sm no-underline shadow-lg hover:border-gold-bright/40 transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-gold-bright" />
          <span className="font-semibold">The Mechanics of Belief</span>
          <span className="text-zinc-500 font-mono text-[10px] hidden sm:inline-block">
            // 3D SANCTUARY
          </span>
        </a>
      </div>

      {/* Top Right Controls Rail */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Blender 3D Specimen Viewer Button */}
        <button
          type="button"
          onClick={onToggleBlenderModal}
          className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:border-gold-bright/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          title="Open Blender 5.2 3D Specimen Viewer"
        >
          <span className="text-gold-bright">◈</span>
          <span className="hidden sm:inline">Blender 3D</span>
        </button>

        {/* Liturgical Zema Audio Toggle */}
        <button
          type="button"
          onClick={onToggleAudio}
          className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-mono transition-all flex items-center gap-2 cursor-pointer shadow-md ${
            isAudioPlaying
              ? 'bg-gold-bright/20 border-gold-bright text-gold-bright'
              : 'bg-black/60 border-white/10 text-zinc-400 hover:text-white'
          }`}
          title="Toggle St. Yared Liturgical Zema Soundscape"
          aria-pressed={isAudioPlaying}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isAudioPlaying ? 'bg-gold-bright animate-ping' : 'bg-zinc-600'
            }`}
          />
          <span>ዜማ {isAudioPlaying ? 'Active' : 'Sound'}</span>
        </button>

        {/* Theme Mode Toggle (Dark Sanctuary vs Vellum) */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md"
          title={`Switch to ${theme === 'sanctuary' ? 'Vellum' : 'Sanctuary'} Theme`}
        >
          {theme === 'sanctuary' ? '☼' : '☾'}
        </button>

        {/* Complete Monograph Drawer Button */}
        <button
          type="button"
          onClick={onOpenSheet}
          className="px-3.5 py-1.5 rounded-full bg-gold-bright text-black font-semibold text-xs font-serif tracking-wide hover:bg-gold-bright/90 transition-all cursor-pointer shadow-lg shadow-gold-bright/20"
        >
          Read Monograph ⇲
        </button>
      </div>
    </header>
  )
}

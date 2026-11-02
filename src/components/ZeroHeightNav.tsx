import React from 'react'
import { ThemeMode, ZemaMode } from '../types.ts'

interface ZeroHeightNavProps {
  onOpenSheet: () => void
  isAudioPlaying: boolean
  onToggleAudio: () => void
  currentZemaMode: ZemaMode
  onSelectZemaMode: (mode: ZemaMode) => void
  theme: ThemeMode
  onToggleTheme: () => void
}

export const ZeroHeightNav: React.FC<ZeroHeightNavProps> = ({
  onOpenSheet,
  isAudioPlaying,
  onToggleAudio,
  currentZemaMode,
  onSelectZemaMode,
  theme,
  onToggleTheme
}) => {
  const zemaModes: { id: ZemaMode; label: string; geez: string }[] = [
    { id: 'geez', label: "Ge'ez", geez: 'ግዕዝ' },
    { id: 'ezel', label: 'Ezel', geez: 'ዕዝል' },
    { id: 'araray', label: 'Araray', geez: 'አራራይ' }
  ]

  return (
    <header
      id="masthead"
      className="fixed top-0 inset-x-0 z-[30] pointer-events-none p-4 sm:p-6 flex items-center justify-between"
    >
      {/* Monogram Brand Mark */}
      <div className="pointer-events-auto flex items-center gap-3">
        <a
          href="#"
          className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white font-serif tracking-wide text-xs sm:text-sm no-underline shadow-xl hover:border-gold-bright/40 transition-all"
        >
          <span className="font-fidel text-gold-bright text-base leading-none">፩</span>
          <span className="font-medium tracking-wide">The Mechanics of Belief</span>
          <span className="text-zinc-500 font-sans text-[10px] tracking-widest uppercase hidden md:inline-block">
            Sanctuary Monograph
          </span>
        </a>
      </div>

      {/* Top Controls Rail */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5">
        {/* Zema Chant Audio & Liturgical Mode Selector */}
        <div className="flex items-center rounded-full bg-black/70 backdrop-blur-md border border-white/10 p-1 shadow-xl">
          <button
            type="button"
            onClick={onToggleAudio}
            aria-label={isAudioPlaying ? 'Mute liturgical chant' : 'Play liturgical chant'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-gold-bright/20 text-gold-bright font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {/* Elegant Audio Wave Icon */}
            <svg
              className={`w-3.5 h-3.5 ${isAudioPlaying ? 'text-gold-bright' : 'text-zinc-500'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              {isAudioPlaying ? (
                <>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              ) : (
                <line x1="23" y1="9" x2="17" y2="15" />
              )}
            </svg>
            <span className="font-fidel text-sm">ዜማ</span>
          </button>

          {/* Liturgical Mode Tabs (Ge'ez, Ezel, Araray) */}
          <div className="hidden sm:flex items-center gap-1 border-l border-white/10 pl-1.5 pr-1">
            {zemaModes.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectZemaMode(m.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-sans transition-all cursor-pointer ${
                  currentZemaMode === m.id
                    ? 'bg-gold-bright text-neutral-950 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                title={`St. Yared Mode: ${m.label} (${m.geez})`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Mode Toggle (Sanctuary Dark vs Vellum) */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'sanctuary' ? 'Vellum' : 'Sanctuary'} theme`}
          className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-gold-bright/40 transition-all cursor-pointer shadow-xl"
        >
          {theme === 'sanctuary' ? (
            /* Sun Icon */
            <svg className="w-4 h-4 text-gold-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon Icon */
            <svg className="w-4 h-4 text-amber-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Complete Monograph Drawer Button */}
        <button
          type="button"
          onClick={onOpenSheet}
          className="px-4 py-2 rounded-full bg-gold-bright hover:bg-gold-bright/90 text-neutral-950 font-serif font-semibold text-xs sm:text-sm tracking-wide transition-all cursor-pointer shadow-xl shadow-gold-bright/15"
        >
          Monograph
        </button>
      </div>
    </header>
  )
}

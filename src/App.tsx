import React, { useState, useEffect } from 'react'
import { SanctuaryViewport } from './components/SanctuaryViewport.tsx'
import { CameraRig3D } from './components/CameraRig3D.tsx'
import { SacredGeometryStage } from './components/SacredGeometryStage.tsx'
import { StorySuper } from './components/StorySuper.tsx'
import { DirectorHUD } from './components/DirectorHUD.tsx'
import { FilmTimeline } from './components/FilmTimeline.tsx'
import { ManuscriptSheet } from './components/ManuscriptSheet.tsx'
import { ZeroHeightNav } from './components/ZeroHeightNav.tsx'
import { useSpringScroll } from './hooks/useSpringScroll.ts'
import { useZemaAudio } from './hooks/useZemaAudio.ts'
import { ThemeMode } from './types.ts'
import { ACTS } from './data/actsData.ts'

export function App() {
  const [theme, setTheme] = useState<ThemeMode>('sanctuary')
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Sync theme with document.body class for global CSS variables
  useEffect(() => {
    document.body.classList.toggle('theme-vellum', theme === 'vellum')
  }, [theme])

  const {
    progress,
    activeActIndex,
    activeMomentIndex,
    lookYaw,
    lookPitch,
    walkX,
    walkZ,
    deepZoom,
    onPointerDown,
    resetLook,
    toggleDeepZoom,
    scrollToAct,
    scrollToMoment
  } = useSpringScroll()

  const {
    isPlaying: isAudioPlaying,
    togglePlay: toggleAudio,
    playSistrumChime
  } = useZemaAudio()

  // Chime sistrum when act changes
  useEffect(() => {
    if (activeActIndex > 0) {
      playSistrumChime()
    }
  }, [activeActIndex, playSistrumChime])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'sanctuary' ? 'vellum' : 'sanctuary'))
  }

  return (
    <div
      className={`min-h-screen relative select-none overflow-x-hidden ${
        theme === 'vellum' ? 'bg-[#EAE2D0] text-[#181411]' : 'bg-[#0C0907] text-[#F5F0E6]'
      }`}
      onPointerDown={onPointerDown}
    >
      {/* Accessible Skip Link */}
      <a
        href="#film-timeline"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#E2C696] focus:text-neutral-950 focus:font-sans focus:font-medium focus:text-xs focus:rounded-md focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        Skip to navigation and timeline
      </a>

      {/* Museum-Grade Architectural Navigation Masthead */}
      <ZeroHeightNav
        onOpenSheet={() => setIsSheetOpen(true)}
        isSheetOpen={isSheetOpen}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={toggleAudio}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* WebGL 3D Raymarching & Volumetric Cavern Viewport */}
      <SanctuaryViewport
        progress={progress}
        lookYaw={lookYaw}
        lookPitch={lookPitch}
        walkX={walkX}
        walkZ={walkZ}
        deepZoom={deepZoom}
        theme={theme}
      />

      {/* 3D Perspective CSS Camera Rig with Architectural Bays */}
      <CameraRig3D
        progress={progress}
        lookYaw={lookYaw}
        lookPitch={lookPitch}
        walkX={walkX}
        walkZ={walkZ}
        deepZoom={deepZoom}
      />

      {/* Sacred Geometry Stage (Anime.js + SVG) */}
      <SacredGeometryStage activeActIndex={activeActIndex} progress={progress} />

      {/* Authentic Cultural Typography & Monograph Moments */}
      <StorySuper
        activeActIndex={activeActIndex}
        activeMomentIndex={activeMomentIndex}
        onOpenSheet={() => setIsSheetOpen(true)}
        onSelectMoment={(mIdx) => scrollToMoment(activeActIndex, mIdx)}
      />

      {/* Discreet Camera Lens Controls (Reset View & 35mm Wide / 85mm Macro) */}
      <DirectorHUD
        onResetLook={resetLook}
        deepZoom={deepZoom}
        onToggleDeepZoom={toggleDeepZoom}
      />

      {/* Full-Width Bottom Continuous Film Timeline Bar */}
      <FilmTimeline
        progress={progress}
        activeActIndex={activeActIndex}
        onSelectAct={scrollToAct}
      />

      {/* Complete Verbatim Monograph Slide-Over Drawer (Authentic Ethiopian Vellum Manuscript) */}
      <ManuscriptSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />

      {/* Native Continuous Scroll Spacer (8 Acts * 100vh = 800vh) */}
      <div className="relative pointer-events-none w-full" style={{ height: `${ACTS.length * 100}vh` }}>
        {ACTS.map((act, idx) => (
          <section
            key={idx}
            id={`act-panel-${idx}`}
            className="h-screen w-full flex items-center justify-center pointer-events-none"
            aria-label={`Act ${act.geez}: ${act.name}`}
          />
        ))}
      </div>
    </div>
  )
}

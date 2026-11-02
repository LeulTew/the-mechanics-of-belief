import React, { useEffect, useState } from 'react'

export const ZeroHeightNav: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100)
      }
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Zero-Height Hairline Progress Tracker */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-white/5"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#08080d]/85 backdrop-blur-md border-b border-white/[0.06] py-2 sm:py-3 shadow-2xl shadow-black/50'
            : 'bg-transparent py-3 sm:py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo & Identity (Touch Target >= 44px) */}
          <a
            href="#"
            className="group min-h-[44px] flex items-center gap-2.5 sm:gap-3 text-white no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg pr-2"
            aria-label="Leul Tewodros Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              ል
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-xs sm:text-sm text-white group-hover:text-indigo-300 transition-colors whitespace-nowrap">
                LEUL TEWODROS
              </span>
              <span className="text-[9px] sm:text-[10px] text-zinc-400 font-mono tracking-wider uppercase hidden xs:inline">
                Creative Technologist
              </span>
            </div>
          </a>

          {/* Status Beacon & Navigation */}
          <div className="flex items-center gap-3 sm:gap-7">
            {/* Desktop Telemetry Beacon */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>PBR 3D ACTIVE</span>
            </div>

            <nav
              className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm font-medium tracking-wide"
              aria-label="Main navigation"
            >
              <a
                href="#work"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center px-2 sm:px-3 text-zinc-300 hover:text-white transition-colors no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg"
              >
                Work
              </a>
              <a
                href="#lab"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center px-2 sm:px-3 text-zinc-300 hover:text-white transition-colors no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg"
              >
                3D Lab
              </a>
              <a
                href="#about"
                className="hidden sm:flex min-h-[44px] min-w-[44px] items-center justify-center px-2 sm:px-3 text-zinc-300 hover:text-white transition-colors no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg"
              >
                Thesis
              </a>
              <a
                href="#contact"
                className="min-h-[44px] flex items-center justify-center px-3.5 sm:px-4 py-2 rounded-full bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-medium transition-all duration-200 no-underline hover:border-indigo-400 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Connect
              </a>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}

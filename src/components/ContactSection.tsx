import React, { useState } from 'react'

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const email = '107800362+LeulTew@users.noreply.github.com'

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <footer id="contact" className="py-24 px-5 sm:px-8 border-t border-white/[0.08] relative z-10 bg-[#06070a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                04 // Ready for Dialogue
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Let&apos;s build the benchmark.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg font-sans">
              Available for high-stakes 3D WebGL experiences, creative engineering architectures,
              and award-level design-build engagements.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-end">
            {/* Copy Email Button */}
            <button
              onClick={handleCopyEmail}
              className="px-6 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white text-xs sm:text-sm font-mono tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <span>{copied ? '✓ Copied to Clipboard' : 'Copy Primary Email'}</span>
              <span className="text-zinc-400 font-sans">⎘</span>
            </button>

            {/* GitHub Profile Button */}
            <a
              href="https://github.com/LeulTew"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-mono tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 no-underline shadow-lg shadow-indigo-600/20"
            >
              <span>GitHub Profile</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-400 gap-4">
          <div className="flex items-center gap-3">
            <span>© 2026 Leul Tewodros</span>
            <span>//</span>
            <span className="text-zinc-300">All rights reserved</span>
          </div>

          <div className="flex items-center gap-5">
            <span>React 19</span>
            <span>Three.js PBR</span>
            <span>GSAP 3.15</span>
            <span>Anime.js</span>
            <span className="text-emerald-400">10/10 Streak</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

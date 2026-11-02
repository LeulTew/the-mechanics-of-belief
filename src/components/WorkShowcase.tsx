import React, { useState, useEffect, useRef } from 'react'
import { ProjectItem } from '../types.ts'

const PROJECTS: ProjectItem[] = [
  {
    id: 'sunchips',
    title: 'SunChips Ethiopia',
    subtitle: 'Whole-Canvas Themed 3D Flavour Worlds',
    category: 'Interactive 3D Experience',
    year: '2026',
    description:
      'A bespoke WebGL brand flagship site featuring whole-canvas flavour worlds, 1-pixel still-to-live 3D registration handoff with Khronos PBR Neutral tone mapping, and script-safe bilingual Amharic and English typography.',
    details: [
      'Whole-canvas [data-flavour] design tokens with measured WCAG AA contrast per world.',
      '1-pixel still-to-live handoff from transparent headless Blender render to interactive Three.js.',
      'Tactile packaging crimp dividers and physical controls with zero-FOUC render-blocking intro.',
      'Full bilingual localization treating Ethiopic Fidel typography as primary art.'
    ],
    tags: ['Three.js', 'Blender PBR', 'GSAP ScrollTrigger', 'TypeScript', 'Astro'],
    metrics: [
      { label: 'Render Latency', value: '< 38ms LCP' },
      { label: 'Contrast Ratio', value: 'WCAG AA' },
      { label: 'Lighthouse', value: '100 / 100' }
    ],
    accentColor: '#f59e0b',
    githubUrl: 'https://github.com/LeulTew/SunChips'
  },
  {
    id: 'agi-readiness',
    title: 'AGI Readiness Studio',
    subtitle: 'Persistent Particle Specimen Morphing Engine',
    category: 'Editorial & Kinetic Systems',
    year: '2026',
    description:
      'A deep editorial exploration into machine intelligence, featuring seeded Three.js particle clouds that morph between thematic specimens on scroll, paired with sentence-by-sentence kinetic typography.',
    details: [
      'Persistent visual agent motif: Blender-modeled geometry sampled into seeded Three.js point clouds.',
      'Variable-font kinetic typography using Mona Sans weight and width axes.',
      'Sentence-by-sentence text motion with rock-steady quiet body copy.',
      'Completely responsive fallback architecture for mobile and low-power hardware.'
    ],
    tags: ['Three.js Points', 'Variable Fonts', 'GSAP 3.15', 'Lenis', 'Vite'],
    metrics: [
      { label: 'Particle Count', value: '1,200+' },
      { label: 'Framerate', value: '60 FPS' },
      { label: 'Layout Shift', value: '0.00 CLS' }
    ],
    accentColor: '#818cf8',
    githubUrl: 'https://github.com/LeulTew/agi-readiness',
    liveUrl: 'https://leultew.github.io/agi-readiness/'
  },
  {
    id: 'mmcy',
    title: 'MMCY Concept Studio',
    subtitle: 'High-Craft Corporate Editorial & Zero-Slop UX',
    category: 'Brand Architecture',
    year: '2026',
    description:
      'A radical departure from generic agency templates. Built on an explicit 150-word thesis contract, word budgets, anti-slop ban-list linting, and hairline zero-height wayfinding rails.',
    details: [
      '150-word thesis contract: explicit definition of World, Story, and Signature Still.',
      'Strict ban-list: zero gratuitous drop-shadows, zero generic cards-inside-cards.',
      'Hairline zero-height wayfinding progress that retreats gracefully when overlapping headlines.',
      'Fluid mathematical typography clamp(min, preferred, max) across 360px to 1600px.'
    ],
    tags: ['Editorial IA', 'Anti-Slop Linting', 'CSS Clamp', 'Nunjucks', 'GSAP'],
    metrics: [
      { label: 'Axe Violations', value: '0' },
      { label: 'Speed Index', value: '0.7s' },
      { label: 'First Input', value: '< 16ms' }
    ],
    accentColor: '#a855f7',
    githubUrl: 'https://github.com/LeulTew/mmcy-landing-page'
  },
  {
    id: 'dreamlux',
    title: 'DreamLux & Koti ERP',
    subtitle: 'High-Throughput Enterprise Operations Engine',
    category: 'Enterprise Platform',
    year: '2026',
    description:
      'A native Bun and React 19 enterprise resource system powering mission-critical operations, automated kitchen inventory reconciliation, and real-time dispatching.',
    details: [
      'Engineered natively with Bun, React 19, and PostgreSQL without virtualization overhead.',
      'Real-time culinary dispatching and inventory tracking with sub-10ms query execution.',
      'Full keyboard-flow accessibility and zero-latency transaction management.',
      'Custom dark chromatic design tokens engineered for long-shift visual comfort.'
    ],
    tags: ['React 19', 'Bun Native', 'PostgreSQL', 'TypeScript', 'Tailwind'],
    metrics: [
      { label: 'Query Latency', value: '< 10ms' },
      { label: 'Uptime SLA', value: '99.98%' },
      { label: 'Test Suite', value: '98% Unit' }
    ],
    accentColor: '#38bdf8',
    githubUrl: 'https://github.com/LeulTew/dreamlux-erp'
  }
]

export const WorkShowcase: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const lastActiveElementRef = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  // Accessible Escape key listener and focus management
  useEffect(() => {
    if (!selectedProject) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      lastActiveElementRef.current?.focus()
    }
  }, [selectedProject])

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
  }

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }

  const openProject = (project: ProjectItem, el: HTMLElement) => {
    lastActiveElementRef.current = el
    setSelectedProject(project)
  }

  return (
    <section id="work" className="py-24 px-5 sm:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              01 // Selected Archives
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white m-0">
            Engineered Craft
          </h2>
        </div>
        <p className="mt-4 md:mt-0 text-zinc-400 text-sm max-w-md font-sans leading-relaxed">
          Benchmark web engineering: 3D PBR handoffs, kinetic particle systems, and zero-slop architecture.
        </p>
      </div>

      {/* Bento Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            onClick={(e) => openProject(project, e.currentTarget)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openProject(project, e.currentTarget)
              }
            }}
            className="group relative p-7 sm:p-8 rounded-2xl bg-[#0c0d16] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[380px] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            style={{
              transition: 'transform 0.15s ease-out, border-color 0.3s ease'
            }}
          >
            {/* Subtle Gradient Glow Accent */}
            <div
              className="absolute -right-20 -top-20 w-52 h-52 rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: project.accentColor }}
            />

            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-5">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider bg-white/[0.05] border border-white/[0.08] text-zinc-300">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-zinc-400">{project.year}</span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-200 transition-colors">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-zinc-400 mb-5">
                {project.subtitle}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans line-clamp-3 mb-6">
                {project.description}
              </p>
            </div>

            {/* Footer: Tech Tags & Metrics */}
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-5">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="flex flex-col">
                      <span className="text-[10px] uppercase font-mono text-zinc-400">
                        {m.label}
                      </span>
                      <span className="text-xs font-mono font-semibold text-white">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                <span className="text-xs font-mono text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Inspect // →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-dialog-title"
        >
          <div
            className="relative w-full max-w-2xl bg-[#10111d] border border-white/[0.15] rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-xs font-mono text-indigo-400 tracking-wider uppercase mb-1 block">
                  {selectedProject.category} // {selectedProject.year}
                </span>
                <h3 id="project-dialog-title" className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {selectedProject.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  {selectedProject.subtitle}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={() => setSelectedProject(null)}
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-sm text-zinc-300">
              <p className="leading-relaxed">{selectedProject.description}</p>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                  Architecture Specifications
                </h4>
                <ul className="space-y-2 list-none p-0 m-0">
                  {selectedProject.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <span className="text-indigo-400 font-mono">▸</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Verified Performance Benchmarks
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {selectedProject.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-center"
                    >
                      <div className="text-xs text-zinc-400 font-mono mb-1">{m.label}</div>
                      <div className="text-base font-bold text-white font-mono">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.1] flex items-center justify-end gap-3 flex-wrap">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] px-5 py-2.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-mono transition-colors no-underline flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    View Source Repository ↗
                  </a>
                )}
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono transition-colors no-underline flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    Live Deployment ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

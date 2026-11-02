import React, { useEffect, useRef } from 'react'

interface ManuscriptSheetProps {
  isOpen: boolean
  onClose: () => void
}

export const ManuscriptSheet: React.FC<ManuscriptSheetProps> = ({
  isOpen,
  onClose
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Focus management & Escape key handler
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // Focus close button on open
      requestAnimationFrame(() => {
        closeBtnRef.current?.focus()
      })

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
          return
        }

        // Focus trap
        if (e.key === 'Tab' && dialogRef.current) {
          const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          if (focusables.length === 0) return

          const firstEl = focusables[0]
          const lastEl = focusables[focusables.length - 1]

          if (e.shiftKey && document.activeElement === firstEl) {
            e.preventDefault()
            lastEl.focus()
          } else if (!e.shiftKey && document.activeElement === lastEl) {
            e.preventDefault()
            firstEl.focus()
          }
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        previousFocusRef.current?.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[50] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Over Manuscript Sheet */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manuscript-title"
        className="relative w-full max-w-2xl bg-[#0f0c09] text-[#f5f0e6] border-l border-gold-bright/30 shadow-2xl h-full flex flex-col z-10 overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/50 backdrop-blur-sm">
          <div>
            <span className="text-[11px] font-sans font-medium tracking-[0.2em] text-gold-bright uppercase">
              ETHIOPIAN CONTEMPLATIVE ARCHITECTURE
            </span>
            <h2 id="manuscript-title" className="font-serif text-xl sm:text-2xl text-white font-normal mt-0.5">
              The Mechanics of Belief: Tradition &amp; the Mind
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close manuscript monograph"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-sans text-zinc-300 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-bright"
          >
            Close ✕
          </button>
        </div>

        {/* Content Body */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Monograph reading text"
          className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-6 text-sm sm:text-base font-serif leading-relaxed text-zinc-300 focus:outline-none focus:ring-1 focus:ring-gold-bright/40"
          style={{ overscrollBehavior: 'contain' }}
        >
          <section>
            <h3 className="text-gold-bright font-serif text-lg font-semibold mb-3">
              Before Judging the Perspective
            </h3>
            <p className="mb-4">
              This is not an argument against Christ, Christianity, or the Ethiopian Orthodox Tewahedo tradition. It is an invitation to look at them from a different angle.
            </p>
            <p className="mb-4">
              A person can believe every doctrine, know every prayer, follow every fast, attend every liturgy, and still never stop long enough to notice what is happening inside their own mind. And the opposite can also be true: a person can step outside the religious framework they were raised in and still recognize something profound in the experiences that religion has been pointing toward for centuries.
            </p>
            <p className="p-4 rounded-xl bg-white/[0.03] border-l-2 border-gold-bright text-white font-medium my-4">
              The crucial distinction is between the conceptual map and the direct experience.
            </p>
            <p className="mb-4">
              For a believer, Christ is not merely an idea to be analyzed. Prayer is not merely a collection of words. Fasting (<em>Tsom</em>) is not merely a rule. Prostration (<em>Sigdet</em>) is not merely physical motion. Chant (<em>Zema</em>) is not merely music. These practices can become ways of completely changing how a person relates to their own thoughts, desires, fears, and sense of self.
            </p>
          </section>

          <section className="pt-4 border-t border-white/10">
            <h3 className="text-gold-bright font-serif text-lg font-semibold mb-3">
              What Does Your Belief Actually Do to Your Mind?
            </h3>
            <p className="mb-3">
              The question is not simply, “Do you believe?” The deeper question is: What does your belief actually do to the way you experience your own mind?
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4 font-sans text-xs sm:text-sm text-zinc-300">
              <li>Does it make you more present or more anxious?</li>
              <li>Does prayer become a place where you genuinely surrender, or another activity performed out of fear?</li>
              <li>Does fasting loosen attachment to impulses, or become a legalistic competition?</li>
              <li>Does devotion soften the ego, or give religious identity something new to defend?</li>
              <li>Does the tradition lead you toward love, humility, silence, and stillness, or become an intellectual burden?</li>
            </ul>
            <p className="italic text-zinc-400">
              The tradition can be the doorway. But a doorway is not the destination.
            </p>
          </section>

          <section className="pt-4 border-t border-white/10">
            <h3 className="text-gold-bright font-serif text-lg font-semibold mb-3">
              Why Genuine Belief Actually Works (The Shortcut)
            </h3>
            <p className="mb-3">
              <strong>Surrender bypasses the ego:</strong> Trying to force your own mind to be quiet usually fails because the mind fights itself. Genuine devotion to Christ uses a completely different mechanism: surrender. When someone truly lets go of control (“not my will, but Yours”), the defensive ego steps out of the way naturally.
            </p>
            <p className="mb-3">
              <strong>Embodied practice shuts down the prediction machine:</strong> Ethiopian Orthodoxy is built around sensory immersion: long fasts (<em>Tsom</em>), prostrations (<em>Sigdet</em>), frankincense (<em>Etan</em>), and St. Yared’s liturgical frequencies (<em>Zema</em>). This immersion quietens the internal narrator, dropping the believer straight into wordless presence.
            </p>
            <p className="mb-4">
              <strong>The mystical root is unity:</strong> The word <em>Tewahedo</em> means “made one.” At the deepest contemplative level (practiced by desert hermits or <em>Bahtawiyan</em>), the goal is <em>Theosis</em> (union with the divine) and silent prayer of the heart, resting in undivided stillness.
            </p>
          </section>

          <section className="pt-4 border-t border-white/10">
            <h3 className="text-gold-bright font-serif text-lg font-semibold mb-3">
              Comparative Analytical Framework
            </h3>
            <div
              tabIndex={0}
              role="region"
              aria-label="Comparative framework table"
              className="overflow-x-auto my-4 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-bright/40"
            >
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 text-gold-bright border-b border-white/10">
                    <th className="p-3">Dimension</th>
                    <th className="p-3">Transformative Shortcut (Theosis)</th>
                    <th className="p-3">Mental Trap (Dogmatic Conditioning)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-white">Primary Drive</td>
                    <td className="p-3 text-zinc-300">Surrender and union (“Made One”)</td>
                    <td className="p-3 text-zinc-400">Transactional fear and compliance</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Sensory Engagement</td>
                    <td className="p-3 text-zinc-300">Embodied presence (Zema, Sigdet, Tsom)</td>
                    <td className="p-3 text-zinc-400">Automatic rote repetition without reflection</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Locus of the Divine</td>
                    <td className="p-3 text-zinc-300">Internal stillness (“Kingdom is within”)</td>
                    <td className="p-3 text-zinc-400">Externalized symbols, titles, and policing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

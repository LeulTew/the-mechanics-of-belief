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
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        id="sheet-backdrop"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Over Manuscript Drawer (Authentic Ethiopian Vellum Parchment) */}
      <aside
        id="manuscript-sheet"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manuscript-title"
        className="relative w-full max-w-2xl lg:max-w-3xl bg-[#F5F0E6] text-[#181411] border-l border-[#181411]/15 shadow-2xl h-full flex flex-col z-10 overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Header (Illuminated Parchment Masthead) */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-[#181411]/10 bg-[#ECE5D5]">
          <div>
            <span className="text-[11px] font-sans font-semibold tracking-[0.2em] text-[#7A4B2A] uppercase">
              ETHIOPIAN CONTEMPLATIVE ARCHITECTURE
            </span>
            <h2 id="manuscript-title" className="font-serif text-xl sm:text-2xl text-[#181411] font-normal mt-0.5">
              The Mechanics of Belief: Tradition &amp; the Mind
            </h2>
            <p className="font-serif text-xs text-[#5C5346] italic mt-0.5 hidden sm:block">
              An Analytical Inquiry into Surrender, Sensory Immersion, and Psychological Traps
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close manuscript monograph"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center px-4 py-1.5 rounded-full border border-[#181411]/25 bg-white/40 hover:bg-white text-xs font-sans text-[#181411] transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7A4B2A]"
          >
            Close ✕
          </button>
        </div>

        {/* Verbatim Monograph Content (Full 4-Page Text) */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Complete Monograph Text"
          className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-6 font-serif text-[1.125rem] sm:text-[1.2rem] leading-[1.76] text-[#26201B] focus:outline-none"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Section 1 */}
          <section>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#181411] tracking-tight mb-4">
              Before Judging the Perspective
            </h3>
            <p className="mb-4">
              This is not an argument against Christ, Christianity, or the Ethiopian Orthodox Tewahedo tradition. It is an invitation to look at them from a different angle.
            </p>
            <p className="mb-4">
              A person can believe every doctrine, know every prayer, follow every fast, attend every liturgy, and still never stop long enough to notice what is happening inside their own mind. And the opposite can also be true: a person can step outside the religious framework they were raised in and still recognize something profound in the experiences that religion has been pointing toward for centuries.
            </p>
            
            <div className="p-5 my-6 rounded-xl bg-[#EDE5D5] border-l-4 border-[#C89B54] text-[#181411] font-serif text-lg italic shadow-sm">
              The crucial distinction is between the conceptual map and the direct experience.
            </div>

            <p className="mb-4">
              For a believer, Christ is not merely an idea to be analyzed. Prayer is not merely a collection of words. Fasting (<em>Tsom</em>) is not merely a rule. Prostration (<em>Sigdet</em>) is not merely a physical movement. Chant (<em>Zema</em>) is not merely music. These practices can become ways of completely changing the way a person relates to their own thoughts, desires, fears, and sense of self.
            </p>
            <p className="mb-4">
              That possibility deserves attention even before deciding what philosophical or theological explanation should be placed around it.
            </p>
            <p className="mb-4">
              Imagine, for a moment, a person who enters a church not because they are trying to prove anything, but because they genuinely love Christ. They stop trying to control every thought. They stop rehearsing yesterday and predicting tomorrow. They surrender the need to be the center of everything. They pray without trying to manufacture a particular experience.
            </p>
            <p className="mb-4">
              Something can change.
            </p>
            <p className="mb-4">
              The mind can become quieter. Attention can become more stable. The constant commentary about oneself can weaken. The distinction between “me thinking about God” and simply being completely absorbed in devotion can begin to feel different.
            </p>
            <p className="mb-4">
              A believer may understand this as the presence of God. Someone outside that belief system may describe the same experience in psychological or contemplative language. Those interpretations do not have to be settled before the experience itself can be taken seriously.
            </p>
          </section>

          {/* Section 2 */}
          <section className="pt-6 border-t border-[#181411]/10">
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#181411] tracking-tight mb-4">
              What Does Your Belief Actually Do to Your Mind?
            </h3>
            <p className="mb-4">
              And this is where the perspective becomes useful for the believer rather than threatening to the believer.
            </p>
            <p className="mb-4 font-medium text-[#181411]">
              The question is not simply, “Do you believe?” The deeper question is: What does your belief actually do to the way you experience your own mind?
            </p>

            {/* Five Mirrors of Inquiry Card */}
            <div className="p-6 my-6 rounded-xl bg-[#EDE5D5] border border-[#181411]/10 space-y-3.5 shadow-sm">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7A4B2A] mb-2">
                Five Mirrors of Contemplative Inquiry
              </h4>
              <ul className="space-y-3 font-serif text-[1.05rem] text-[#26201B] list-none pl-0">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C89B54] font-bold">፩</span>
                  <span>Does it make you more present or more anxious?</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C89B54] font-bold">፪</span>
                  <span>Does prayer become a place where you genuinely surrender, or another activity you perform because you are afraid of what happens if you do not?</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C89B54] font-bold">፫</span>
                  <span>Does fasting loosen your attachment to your impulses, or does it become a competition over who is following the rules correctly?</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C89B54] font-bold">፬</span>
                  <span>Does devotion make the ego softer, or does religious identity give the ego something new to defend?</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C89B54] font-bold">፭</span>
                  <span>Does the tradition lead you toward love, humility, silence, and direct experience, or does it eventually become another collection of things you must think about?</span>
                </li>
              </ul>
            </div>

            <p className="mb-4">
              These questions do not require abandoning Orthodoxy. In fact, they may be a way of taking its deepest claims more seriously.
            </p>
            <p className="mb-4">
              If Christ is real, then the point cannot merely be winning arguments about Christ. If prayer is real, then the point cannot merely be saying the correct words. If the Kingdom of God is truly something encountered within, then eventually there has to be some willingness to become quiet enough to notice what is happening within.
            </p>
            <p className="p-4 rounded-lg bg-[#ECE5D5] border-l-2 border-[#7A4B2A] font-medium text-[#181411] my-4">
              The tradition can be the doorway. But a doorway is not the destination.
            </p>
            <p className="mb-4">
              This is also why an outsider can sometimes notice something that a lifelong believer has stopped noticing. The outsider may not possess the believer’s theology, history, or vocabulary, but they can still recognize patterns in human attention, fear, identity, attachment, surrender, and awareness. That does not prove or disprove the existence of God. It simply creates another question worth asking: What if some of the practices preserved by the tradition are valuable not only because we are told what they mean, but because of what they actually do to a human being when they are practiced sincerely?
            </p>
            <p className="italic text-[#181411] font-medium">
              That is the perspective explored here. Not “leave your faith.” Not “your tradition is false.” Rather: Go deeper than the automatic version of it.
            </p>
          </section>

          {/* Section 3 */}
          <section className="pt-6 border-t border-[#181411]/10">
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#181411] tracking-tight mb-4">
              Why Genuine Belief Actually Works (The Shortcut)
            </h3>
            <p className="mb-4">
              Genuine belief in Christ and the Ethiopian Orthodox Tewahedo tradition can either act as a powerful shortcut past the thinking mind, or become one of the heaviest mental traps, depending entirely on how a person holds it.
            </p>

            <div className="space-y-4 my-4">
              <div className="p-4 rounded-lg bg-[#EDE5D5] border-l-3 border-[#C89B54]">
                <h4 className="font-serif font-semibold text-base text-[#181411] mb-1">
                  Surrender Bypasses the Ego
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-[#26201B]">
                  Trying to force your own mind to be quiet usually fails because the mind fights itself. Genuine devotion to Christ uses a completely different mechanism: surrender. When someone truly lets go of control (“not my will, but Yours”), the defensive ego steps out of the way naturally. Total love and awe quiet the internal narrator much faster than dry mental discipline.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#EDE5D5] border-l-3 border-[#C89B54]">
                <h4 className="font-serif font-semibold text-base text-[#181411] mb-1">
                  Embodied Practice Shuts Down the Prediction Machine
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-[#26201B]">
                  Ethiopian Orthodoxy is not built around intellectual debate; it is built around intense physical and sensory immersion. Long fasts (<em>Tsom</em>), endless prostrations (<em>Sigdet</em>), the smell of frankincense (<em>Etan</em>), and the ancient frequencies of St. Yared's chants (<em>Zema</em>) are designed to exhaust the restless physical body and overwhelm the analytical brain. For a sincere believer standing in quiet devotion, that sensory immersion stops the automatic stream of everyday thoughts and drops them straight into raw, wordless presence.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#EDE5D5] border-l-3 border-[#C89B54]">
                <h4 className="font-serif font-semibold text-base text-[#181411] mb-1">
                  The Mystical Root is Unity
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-[#26201B]">
                  The very word <em>Tewahedo</em> means “made one.” At the deepest level of Orthodox mysticism (practiced by the desert fathers and genuine <em>Bahtawiyan</em> or hermits), the goal is <em>Theosis</em> (union with the divine) and silent prayer of the heart, where words eventually stop and the believer rests in pure, undivided stillness.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="pt-6 border-t border-[#181411]/10">
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#181411] tracking-tight mb-4">
              Where It Fails Most People (The Unfiltered Reality)
            </h3>
            
            <div className="space-y-4 my-4">
              <div className="p-4 rounded-lg bg-[#ECE3D2] border-l-3 border-[#A64B2A]">
                <h4 className="font-serif font-semibold text-base text-[#181411] mb-1">
                  Cultural Autocomplete
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-[#26201B]">
                  Just as human words come from parents and culture, the vast majority of people inherit their faith as automatic conditioning. They memorize prayers, kiss the church walls, and repeat phrases out of habit without ever pausing to experience the silent truth behind them. It becomes human autocomplete.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#ECE3D2] border-l-3 border-[#A64B2A]">
                <h4 className="font-serif font-semibold text-base text-[#181411] mb-1">
                  Transactional Fear
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-[#26201B]">
                  Because the predictive mind is always obsessed with what comes next, dogmatic religion hijacks people through fear of hell and the promise of a future heaven. People end up fasting and praying like they are paying a tax to avoid punishment, which actually increases anxiety and mental noise instead of bringing peace.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#ECE3D2] border-l-3 border-[#A64B2A]">
                <h4 className="font-serif font-semibold text-base text-[#181411] mb-1">
                  Spiritual Ego and Division
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-[#26201B]">
                  When the heavy structure of Ethiopian Orthodoxy becomes an identity rather than a doorway, it breeds pride and judgment. People get obsessed with policing who is fasting properly, who is dressed right, or whose denomination is correct. They defend the map with anger while completely missing the love and stillness the map points toward.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#ECE3D2] border-l-3 border-[#A64B2A]">
                <h4 className="font-serif font-semibold text-base text-[#181411] mb-1">
                  Looking Outside Instead of Within
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-[#26201B]">
                  Many believers project all the holiness onto external symbols, icons, or historical texts, acting as if God is a distant figure locked inside a book or a building. Just like the engineer who thought life was inside the machine's words rather than recognizing his own awareness, dogmatic believers forget Christ's own direct words: <em>“The Kingdom of God is within you,”</em> and <em>“Be still, and know that I am God.”</em>
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Comparative Framework Table */}
          <section className="pt-6 border-t border-[#181411]/10">
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#181411] tracking-tight mb-2">
              Comparative Analytical Framework
            </h3>
            <p className="font-serif text-sm text-[#5C5346] italic mb-4">
              Contrasting the transformative experiential core of Tewahedo tradition against dogmatic or conditioned pitfalls.
            </p>

            <div
              tabIndex={0}
              role="region"
              aria-label="Comparative framework table"
              className="overflow-x-auto my-4 border border-[#181411]/15 rounded-xl shadow-sm bg-[#FAF6EE]"
            >
              <table className="w-full text-left font-sans text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[#E8DFCC] text-[#181411] border-b border-[#181411]/15">
                    <th className="p-3.5 font-semibold">Dimension</th>
                    <th className="p-3.5 font-semibold text-[#663D1F]">Transformative Shortcut (Theosis)</th>
                    <th className="p-3.5 font-semibold text-[#8C331E]">Mental Trap (Dogmatic Conditioning)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181411]/10 text-[#26201B]">
                  <tr className="hover:bg-[#F2ECE0]/70 transition-colors">
                    <td className="p-3.5 font-semibold text-[#181411]">Primary Drive</td>
                    <td className="p-3.5 text-[#2E2419]">Surrender and union (“Made One”)</td>
                    <td className="p-3.5 text-[#5C5346]">Transactional fear and compliance</td>
                  </tr>
                  <tr className="hover:bg-[#F2ECE0]/70 transition-colors">
                    <td className="p-3.5 font-semibold text-[#181411]">Sensory Engagement</td>
                    <td className="p-3.5 text-[#2E2419]">Embodied presence (Zema, Sigdet, Tsom)</td>
                    <td className="p-3.5 text-[#5C5346]">Automatic rote repetition without reflection</td>
                  </tr>
                  <tr className="hover:bg-[#F2ECE0]/70 transition-colors">
                    <td className="p-3.5 font-semibold text-[#181411]">Locus of the Divine</td>
                    <td className="p-3.5 text-[#2E2419]">Internal stillness (“Kingdom is within”)</td>
                    <td className="p-3.5 text-[#5C5346]">Externalized symbols, titles, and policing</td>
                  </tr>
                  <tr className="hover:bg-[#F2ECE0]/70 transition-colors">
                    <td className="p-3.5 font-semibold text-[#181411]">Cognitive State</td>
                    <td className="p-3.5 text-[#2E2419]">Wordless awareness and quietude</td>
                    <td className="p-3.5 text-[#5C5346]">Heightened predictive anxiety and ego division</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: Contemplative Benediction */}
          <section className="pt-6 pb-4 border-t border-[#181411]/10 text-center">
            <p className="font-serif italic text-lg sm:text-xl text-[#181411]">
              “Be still, and know that I am God.”
            </p>
            <p className="font-sans text-xs tracking-widest uppercase text-[#7A4B2A] mt-2">
              The Kingdom Within
            </p>
          </section>
        </div>
      </aside>
    </div>
  )
}

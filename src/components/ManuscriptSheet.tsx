import React, { useEffect, useRef } from 'react'

interface ManuscriptSheetProps {
  isOpen: boolean
  onClose: () => void
}

export const ManuscriptSheet: React.FC<ManuscriptSheetProps> = ({
  isOpen,
  onClose
}) => {
  const dialogRef = useRef<HTMLElement | null>(null)
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

  return (
    <>
      {/* Dimming and blurring backdrop */}
      <div
        id="sheet-backdrop"
        className={isOpen ? 'is-open' : ''}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Verbatim Monograph Slide-Over Drawer */}
      <aside
        id="manuscript-sheet"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manuscript-title"
        aria-hidden={!isOpen}
        tabIndex={-1}
        className={isOpen ? 'is-open' : ''}
      >
        <div className="sheet-header">
          <h2 id="manuscript-title">The Mechanics of Belief: Tradition &amp; the Mind</h2>
          <button
            ref={closeBtnRef}
            type="button"
            id="btn-close-sheet"
            className="sheet-close"
            onClick={onClose}
            aria-label="Close manuscript dialog"
          >
            Close
          </button>
        </div>

        <div className="sheet-content">
          <h3>Before Judging the Perspective</h3>
          <p>
            This is not an argument against Christ, Christianity, or the Ethiopian Orthodox Tewahedo tradition. It is an invitation to look at them from a different angle.
          </p>
          <p>
            A person can believe every doctrine, know every prayer, follow every fast, attend every liturgy, and still never stop long enough to notice what is happening inside their own mind. And the opposite can also be true: a person can step outside the religious framework they were raised in and still recognize something profound in the experiences that religion has been pointing toward for centuries.
          </p>
          <p>
            <strong>The important distinction is between the map and the experience.</strong>
          </p>
          <p>
            For a believer, Christ is not merely an idea to be analyzed. Prayer is not merely a collection of words. Fasting is not merely a rule. Prostration is not merely a physical movement. Chant is not merely music. These practices can become ways of completely changing the way a person relates to their own thoughts, desires, fears, and sense of self.
          </p>
          <p>
            That possibility deserves attention even before deciding what philosophical or theological explanation should be placed around it.
          </p>
          <p>
            Imagine, for a moment, a person who enters a church not because they are trying to prove anything, but because they genuinely love Christ. They stop trying to control every thought. They stop rehearsing yesterday and predicting tomorrow. They surrender the need to be the center of everything. They pray without trying to manufacture a particular experience.
          </p>
          <p>
            <strong>Something can change.</strong>
          </p>
          <p>
            The mind can become quieter. Attention can become more stable. The constant commentary about oneself can weaken. The distinction between “me thinking about God” and simply being completely absorbed in devotion can begin to feel different.
          </p>
          <p>
            A believer may understand this as the presence of God. Someone outside that belief system may describe the same experience in psychological or contemplative language. Those interpretations do not have to be settled before the experience itself can be taken seriously.
          </p>

          <h3>What Does Your Belief Actually Do to Your Mind?</h3>
          <p>
            And this is where the perspective becomes useful for the believer rather than threatening to the believer. The question is not simply, “Do you believe?” The deeper question is: What does your belief actually do to the way you experience your own mind?
          </p>
          <ul>
            <li>Does it make you more present or more anxious?</li>
            <li>Does prayer become a place where you genuinely surrender, or another activity you perform because you are afraid of what happens if you do not?</li>
            <li>Does fasting loosen your attachment to your impulses, or does it become a competition over who is following the rules correctly?</li>
            <li>Does devotion make the ego softer, or does religious identity give the ego something new to defend?</li>
            <li>Does the tradition lead you toward love, humility, silence, and direct experience, or does it eventually become another collection of things you must think about?</li>
          </ul>
          <p>
            These questions do not require abandoning Orthodoxy. In fact, they may be a way of taking its deepest claims more seriously.
          </p>
          <p>
            If Christ is real, then the point cannot merely be winning arguments about Christ. If prayer is real, then the point cannot merely be saying the correct words. If the Kingdom of God is truly something encountered within, then eventually there has to be some willingness to become quiet enough to notice what is happening within.
          </p>
          <p>
            <strong>The tradition can be the doorway. But a doorway is not the destination.</strong>
          </p>
          <p>
            This is also why an outsider can sometimes notice something that a lifelong believer has stopped noticing. The outsider may not possess the believer’s theology, history, or vocabulary, but they can still recognize patterns in human attention, fear, identity, attachment, surrender, and awareness. That does not prove or disprove the existence of God.
          </p>
          <p>
            It simply creates another question worth asking: What if some of the practices preserved by the tradition are valuable not only because we are told what they mean, but because of what they actually do to a human being when they are practiced sincerely?
          </p>
          <p>
            <strong>That is the perspective explored here. Not “leave your faith.” Not “your tradition is false.” Rather: Go deeper than the automatic version of it.</strong>
          </p>

          <h3>Why Genuine Belief Actually Works (The Shortcut)</h3>
          <p>
            Genuine belief in Christ and the Ethiopian Orthodox Tewahedo tradition can either act as a powerful shortcut past the thinking mind, or become one of the heaviest mental traps, depending entirely on how a person holds it.
          </p>
          <p>
            <strong>Surrender bypasses the ego:</strong> Earlier we saw that trying to force your own mind to be quiet usually fails because the mind fights itself. Genuine devotion to Christ uses a completely different mechanism: surrender. When someone truly lets go of control (“not my will, but Yours”), the defensive ego steps out of the way naturally. Total love and awe quiet the internal narrator much faster than dry mental discipline.
          </p>
          <p>
            <strong>Embodied practice shuts down the prediction machine:</strong> Ethiopian Orthodoxy is not built around intellectual debate; it is built around intense physical and sensory immersion. Long fasts (<em>Tsom</em>), endless prostrations (<em>Sigdet</em>), the smell of frankincense (<em>Etan</em>), and the ancient frequencies of St. Yared’s chants (<em>Zema</em>) are designed to exhaust the restless physical body and overwhelm the analytical brain. For a sincere believer standing in quiet devotion, that sensory immersion stops the automatic stream of everyday thoughts and drops them straight into raw, wordless presence.
          </p>
          <p>
            <strong>The mystical root is unity:</strong> The very word <em>Tewahedo</em> means “made one.” At the deepest level of Orthodox mysticism (practiced by the desert fathers and genuine <em>Bahtawiyan</em> or hermits), the goal is <em>Theosis</em> (union with the divine) and silent prayer of the heart, where words eventually stop and the believer rests in pure, undivided stillness.
          </p>

          <h3>Where It Fails Most People (The Unfiltered Reality)</h3>
          <p>
            <strong>Cultural autocomplete:</strong> Just as human words come from parents and culture, the vast majority of people inherit their faith as automatic conditioning. They memorize prayers, kiss the church walls, and repeat phrases out of habit without ever pausing to experience the silent truth behind them. It becomes human autocomplete.
          </p>
          <p>
            <strong>Transactional fear:</strong> Because the predictive mind is always obsessed with what comes next, dogmatic religion hijacks people through fear of hell and the promise of a future heaven. People end up fasting and praying like they are paying a tax to avoid punishment, which actually increases anxiety and mental noise instead of bringing peace.
          </p>
          <p>
            <strong>Spiritual ego and division:</strong> When the heavy structure of Ethiopian Orthodoxy becomes an identity rather than a doorway, it breeds pride and judgment. People get obsessed with policing who is fasting properly, who is dressed right, or whose denomination is correct. They defend the map with anger while completely missing the love and stillness the map points toward.
          </p>
          <p>
            <strong>Looking outside instead of within:</strong> Many believers project all the holiness onto external symbols, icons, or historical texts, acting as if God is a distant figure locked inside a book or a building. Just like the engineer who thought life was inside the machine’s words rather than recognizing his own awareness, dogmatic believers forget Christ’s own direct words: “The Kingdom of God is within you,” and “Be still, and know that I am God.”
          </p>

          <h3>Comparative Analytical Framework</h3>
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>Transformative Shortcut (Theosis)</th>
                <th>Mental Trap (Dogmatic Conditioning)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Primary Drive</strong></td>
                <td>Surrender and union (“Made One”)</td>
                <td>Transactional fear and compliance</td>
              </tr>
              <tr>
                <td><strong>Sensory Engagement</strong></td>
                <td>Embodied presence (Zema, Sigdet, Tsom)</td>
                <td>Automatic rote repetition without reflection</td>
              </tr>
              <tr>
                <td><strong>Locus of the Divine</strong></td>
                <td>Internal stillness (“Kingdom is within”)</td>
                <td>Externalized symbols, titles, and policing</td>
              </tr>
              <tr>
                <td><strong>Cognitive State</strong></td>
                <td>Wordless awareness and quietude</td>
                <td>Heightened predictive anxiety and ego division</td>
              </tr>
            </tbody>
          </table>
        </div>
      </aside>
    </>
  )
}

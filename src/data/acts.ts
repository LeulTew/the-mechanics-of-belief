// Eight acts, two beats each. Every beat is a camera keyframe in the sanctuary
// (world units, CSS y-down) plus the copy shown beside it.

export type TextPos = 'pos-left' | 'pos-right' | 'pos-center-bottom' | 'pos-top-left'

export interface Beat {
  label: string
  headline: string
  lead: string
  textPos: TextPos
  cam: { x: number; y: number; z: number; yaw: number; pitch: number; roll: number }
}

export interface Act {
  geez: string
  name: string
  short: string
  trap: boolean
  beats: [Beat, Beat]
}

export const ACTS: Act[] = [
  {
    geez: '፩',
    name: 'The Map & the Experience',
    short: 'Doorway',
    trap: false,
    beats: [
      {
        label: 'The Conceptual Map',
        headline: 'A person can know every doctrine and still never pause within.',
        lead: 'You can memorize every prayer, follow every fast, and attend every liturgy while remaining trapped inside the noisy commentary of your own mind.',
        textPos: 'pos-left',
        cam: { x: -15, y: -12, z: 380, yaw: -7, pitch: 7, roll: 0 }
      },
      {
        label: 'The Open Threshold',
        headline: 'The tradition is the doorway, not the destination.',
        lead: 'The crucial distinction is between the conceptual map and the direct experience—stepping through the stone threshold into living stillness.',
        textPos: 'pos-center-bottom',
        cam: { x: 90, y: 4, z: 300, yaw: -6, pitch: -2, roll: 0 }
      }
    ]
  },
  {
    geez: '፪',
    name: 'Living Liturgical Practice',
    short: 'Practices',
    trap: false,
    beats: [
      {
        label: 'Beyond Mere Rules',
        headline: 'Christ is a living center of surrender, not merely an idea.',
        lead: 'For a sincere believer, prayer is not merely words, fasting (Tsom) is not merely a dietary rule, and prostration (Sigdet) is not merely physical motion.',
        textPos: 'pos-right',
        cam: { x: -25, y: 0, z: -700, yaw: 9, pitch: 0, roll: 0.8 }
      },
      {
        label: 'Resonant Instruments',
        headline: 'Chant and rhythm reshape how you relate to fear and self.',
        lead: 'The bronze Tsenatsel sistrum, Meqwamiya prayer staff, and Kebero drum become instruments for transforming thoughts, desires, and the demanding ego.',
        textPos: 'pos-right',
        cam: { x: -110, y: 8, z: -790, yaw: 8, pitch: 1, roll: -0.6 }
      }
    ]
  },
  {
    geez: '፫',
    name: 'The Inner Sanctuary',
    short: 'Sanctuary',
    trap: false,
    beats: [
      {
        label: 'Entering in Love',
        headline: 'When you stop trying to prove anything, something changes.',
        lead: 'Entering a sanctuary out of love rather than self-validation, you stop rehearsing yesterday, stop predicting tomorrow, and let go of controlling every thought.',
        textPos: 'pos-top-left',
        cam: { x: 20, y: 25, z: -1640, yaw: -8, pitch: -2, roll: 0 }
      },
      {
        label: 'Absorbed Devotion',
        headline: 'From “me thinking about God” to absorbed stillness.',
        lead: 'The internal commentary weakens and attention stabilizes—a profound shift in awareness that deserves attention before any philosophical debate.',
        textPos: 'pos-left',
        cam: { x: 60, y: 48, z: -1750, yaw: -8, pitch: 1, roll: 0.6 }
      }
    ]
  },
  {
    geez: '፬',
    name: 'The Five Mirrors of Inquiry',
    short: 'Mirrors',
    trap: false,
    beats: [
      {
        label: 'Presence & Motive',
        headline: 'What does your belief actually do to your own mind?',
        lead: 'Does it make you more present or more anxious? Is prayer genuine surrender, or performed out of fear? Does fasting loosen impulses or fuel rule-competition?',
        textPos: 'pos-right',
        cam: { x: -35, y: 12, z: -2590, yaw: 9, pitch: -1, roll: -0.8 }
      },
      {
        label: 'Softening the Ego',
        headline: 'Does devotion soften the ego, or armor your identity?',
        lead: 'Taking Orthodoxy’s deepest claims seriously means asking whether tradition leads you to love, humility, and silence—or just more mental clutter to defend.',
        textPos: 'pos-right',
        cam: { x: -110, y: 18, z: -2690, yaw: 8, pitch: 1, roll: 0.8 }
      }
    ]
  },
  {
    geez: '፭',
    name: 'Surrender & Tewahedo',
    short: 'Tewahedo',
    trap: false,
    beats: [
      {
        label: 'Bypassing the Ego',
        headline: 'Surrender quiets the mind without fighting itself.',
        lead: 'Forcing your own mind to be silent fails because the mind fights itself. Letting go (“not my will, but Yours”) steps the defensive ego out of the way naturally.',
        textPos: 'pos-left',
        cam: { x: -90, y: 4, z: -3400, yaw: -7, pitch: 1, roll: 0 }
      },
      {
        label: 'Made One (Theosis)',
        headline: 'The very word Tewahedo means “Made One.”',
        lead: 'Practiced by the desert fathers and Bahtawiyan hermits, the mystical root is Theosis and silent prayer of the heart—where words stop in undivided stillness.',
        textPos: 'pos-center-bottom',
        cam: { x: 0, y: 8, z: -3480, yaw: 0, pitch: -3, roll: 0 }
      }
    ]
  },
  {
    geez: '፮',
    name: 'Sensory Immersion',
    short: 'Senses',
    trap: false,
    beats: [
      {
        label: 'Frankincense & Fast',
        headline: 'Embodied practice shuts down the prediction machine.',
        lead: 'Long fasts (Tsom), endless prostrations (Sigdet), and rising clouds of frankincense (Etan) exhaust physical restlessness and anchor awareness in the breath.',
        textPos: 'pos-left',
        cam: { x: 35, y: 0, z: -4490, yaw: -9, pitch: 1, roll: -0.8 }
      },
      {
        label: 'St. Yared’s Zema',
        headline: 'Ancient frequencies drop the mind into wordless presence.',
        lead: 'The sacred modes of St. Yared’s chants (Zema—Ge’ez, Ezel, and Araray) overwhelm the analytical brain and halt the automatic stream of everyday thoughts.',
        textPos: 'pos-top-left',
        cam: { x: 65, y: 5, z: -4600, yaw: -8, pitch: 1, roll: 0.8 }
      }
    ]
  },
  {
    geez: '፯',
    name: 'Where It Fails Most People',
    short: 'Traps',
    trap: true,
    beats: [
      {
        label: 'Autocomplete & Fear',
        headline: 'When held as habit or fear, the doorway becomes a cage.',
        lead: 'Inherited as cultural autocomplete or a fearful tax to avoid punishment and buy heaven, mechanical religion amplifies anxiety and mental noise.',
        textPos: 'pos-right',
        cam: { x: -35, y: 14, z: -5440, yaw: 9, pitch: -1, roll: 1.8 }
      },
      {
        label: 'Spiritual Ego',
        headline: 'Defending the map with anger while missing its love.',
        lead: 'Obsessed with policing who fasts or dresses right, or projecting God only onto distant books and buildings, dogmatic ego forgets that the Kingdom is within.',
        textPos: 'pos-right',
        cam: { x: -110, y: 18, z: -5540, yaw: 8, pitch: 1, roll: -1.8 }
      }
    ]
  },
  {
    geez: '፰',
    name: 'The Kingdom Within',
    short: 'Synthesis',
    trap: false,
    beats: [
      {
        label: 'Theosis vs. Trap',
        headline: 'Surrender and inward stillness over fearful compliance.',
        lead: 'Across primary drive, sensory engagement, locus of the divine, and cognitive state, the shortcut awakens presence while conditioning breeds division.',
        textPos: 'pos-left',
        cam: { x: -90, y: 4, z: -6300, yaw: -7, pitch: 0, roll: 0 }
      },
      {
        label: 'Be Still and Know',
        headline: '“The Kingdom of God is within you.”',
        lead: 'Not “leave your faith.” Not “your tradition is false.” Go deeper than the automatic version of it—into the living silence it has pointed toward for centuries.',
        textPos: 'pos-center-bottom',
        cam: { x: 0, y: 14, z: -6380, yaw: 0, pitch: -1, roll: 0 }
      }
    ]
  }
]

// Scroll progress (0..1) <-> act/beat. The second beat starts at 46% of an act.
export const BEAT_SPLIT = 0.46

export function beatAt(progress: number): { act: number; beat: number } {
  const f = Math.max(0, Math.min(1, progress)) * (ACTS.length - 0.0001)
  const act = Math.min(ACTS.length - 1, Math.floor(f))
  return { act, beat: f - act < BEAT_SPLIT ? 0 : 1 }
}

export function progressFor(act: number, beat = 0): number {
  if (act === 0 && beat === 0) return 0
  return Math.min(0.992, (act + (beat === 0 ? 0.16 : 0.63)) / ACTS.length)
}

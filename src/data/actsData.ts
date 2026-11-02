// The Mechanics of Belief — 3D Sanctuary & Monograph Act Data
export interface MomentItem {
  label: string;
  headline: string;
  lead: string;
  textPos: string;
  svgX: number;
  svgY: number;
  camX: number;
  camY: number;
  camZ: number;
  camYaw: number;
  camPitch: number;
  camRoll: number;
  motionType: string;
  motionDir: string;
  lobes: number;
  amp: number;
  gap: number;
}

export interface ActItem {
  geez: string;
  name: string;
  trapTheme: boolean;
  moments: MomentItem[];
}

export const ACTS: ActItem[] = [
        {
          geez: '፩',
          name: 'The Map & the Experience',
          trapTheme: false,
          moments: [
            {
              label: 'The Conceptual Map',
              headline: 'A person can know every doctrine and still never  within.',
              lead: 'You can memorize every prayer, follow every fast, and attend every liturgy while remaining trapped inside the noisy commentary of your own mind.',
              textPos: 'pos-left',
              svgX: 68, svgY: 48,
              // OUTSIDE in the Sunlit Ethiopian Highland Cliff Trench looking at Shrine 0 (210, 10, -400) & Cave Mouth Portal (z=-640)
              camX: -15, camY: -12, camZ: 240, camYaw: -7, camPitch: -1, camRoll: 0,
              motionType: 'OUTSIDE · HIGHLAND CLIFF CANYON',
              motionDir: 'vertical',
              lobes: 8, amp: 20, gap: 58
            },
            {
              label: 'The Open Threshold',
              headline: 'The tradition is the , not the destination.',
              lead: 'The crucial distinction is between the conceptual map and the direct experience—stepping through the stone threshold into living stillness.',
              textPos: 'pos-center-bottom',
              svgX: 50, svgY: 38,
              // Descending the sunlit stone trench steps right up to Shrine 0 and the gaping Monolithic Cave Entrance at z=-640
              camX: 85, camY: 4, camZ: -65, camYaw: -8, camPitch: 1, camRoll: 0,
              motionType: 'CAVE MOUTH THRESHOLD',
              motionDir: 'vertical',
              lobes: 12, amp: 12, gap: 22
            }
          ]
        },
        {
          geez: '፪',
          name: 'Living Liturgical Practice',
          trapTheme: false,
          moments: [
            {
              label: 'Beyond Mere Rules',
              headline: 'Christ is a living center of surrender, not merely an .',
              lead: 'For a sincere believer, prayer is not merely words, fasting (Tsom) is not merely a dietary rule, and prostration (Sigdet) is not merely physical motion.',
              textPos: 'pos-right',
              svgX: 30, svgY: 48,
              // Flying physically THROUGH the carved cliff portal (z=-640) into the torchlit Outer Subterranean Cavern toward Shrine 1 (-205, 15, -1350)
              camX: -25, camY: 0, camZ: -780, camYaw: 9, camPitch: 0, camRoll: 0.8,
              motionType: 'INTO CAVE · OUTER CAVERN',
              motionDir: 'horizontal',
              lobes: 10, amp: 16, gap: 38
            },
            {
              label: 'Resonant Instruments',
              headline: 'Chant and rhythm reshape how you relate to  and self.',
              lead: 'The bronze Tsenatsel sistrum, Meqwamiya prayer staff, and Kebero drum become instruments for transforming thoughts, desires, and the demanding ego.',
              textPos: 'pos-right',
              svgX: 32, svgY: 49,
              camX: -65, camY: 8, camZ: -955, camYaw: 8, camPitch: 1, camRoll: -0.6,
              motionType: 'CAVE CHAMBER · SISTRUM SHRINE',
              motionDir: 'horizontal',
              lobes: 18, amp: 24, gap: 14
            }
          ]
        },
        {
          geez: '፫',
          name: 'The Inner Sanctuary',
          trapTheme: false,
          moments: [
            {
              label: 'Entering in Love',
              headline: 'When you stop trying to  anything, something changes.',
              lead: 'Entering a sanctuary out of love rather than self-validation, you stop rehearsing yesterday, stop predicting tomorrow, and let go of controlling every thought.',
              textPos: 'pos-top-left',
              svgX: 66, svgY: 54,
              // Subterranean Skylight Sinkhole & Cistern Water Pool framing Shrine 2 (205, 65, -2300)
              camX: 20, camY: 25, camZ: -1730, camYaw: -8, camPitch: -2, camRoll: 0,
              motionType: 'CAVE SKYLIGHT & WATER POOL',
              motionDir: 'vertical',
              lobes: 12, amp: 14, gap: 26
            },
            {
              label: 'Absorbed Devotion',
              headline: 'From “me thinking about God” to  stillness.',
              lead: 'The internal commentary weakens and attention stabilizes—a profound shift in awareness that deserves attention before any philosophical debate.',
              textPos: 'pos-left',
              svgX: 66, svgY: 48,
              camX: 65, camY: 48, camZ: -1900, camYaw: -8, camPitch: 1, camRoll: 0.6,
              motionType: 'SUNKEN POOL SANCTUARY',
              motionDir: 'horizontal',
              lobes: 16, amp: 9, gap: 8
            }
          ]
        },
        {
          geez: '፬',
          name: 'The Five Mirrors of Inquiry',
          trapTheme: false,
          moments: [
            {
              label: 'Presence & Motive',
              headline: 'What does your belief actually do to your own ?',
              lead: 'Does it make you more present or more anxious? Is prayer genuine surrender, or performed out of fear? Does fasting loosen impulses or fuel rule-competition?',
              textPos: 'pos-right',
              svgX: 32, svgY: 48,
              // Framing Shrine 3 (-205, 25, -3250) on the left while story-super is pos-right
              camX: -35, camY: 12, camZ: -2690, camYaw: 9, camPitch: -1, camRoll: -0.8,
              motionType: 'DEEP CAVE · PILLAR GALLERY',
              motionDir: 'horizontal',
              lobes: 10, amp: 22, gap: 42
            },
            {
              label: 'Softening the Ego',
              headline: 'Does devotion soften the ego, or  your identity?',
              lead: 'Taking Orthodoxy’s deepest claims seriously means asking whether tradition leads you to love, humility, and silence—or just more mental clutter to defend.',
              textPos: 'pos-right',
              svgX: 31, svgY: 50,
              camX: -65, camY: 18, camZ: -2860, camYaw: 8, camPitch: 1, camRoll: 0.8,
              motionType: 'OBSIDIAN MIRROR CAVERN',
              motionDir: 'horizontal',
              lobes: 20, amp: 10, gap: 10
            }
          ]
        },
        {
          geez: '፭',
          name: 'Surrender & Tewahedo',
          trapTheme: false,
          moments: [
            {
              label: 'Bypassing the Ego',
              headline: 'Surrender quiets the mind without  itself.',
              lead: 'Forcing your own mind to be silent fails because the mind fights itself. Letting go (“not my will, but Yours”) steps the defensive ego out of the way naturally.',
              textPos: 'pos-left',
              svgX: 64, svgY: 50,
              // Framing Shrine 4 (0, 15, -4200)
              camX: -95, camY: 4, camZ: -3640, camYaw: -7, camPitch: 1, camRoll: 0,
              motionType: 'BAHTAWI HERMITAGE CAVE',
              motionDir: 'horizontal',
              lobes: 14, amp: 18, gap: 56
            },
            {
              label: 'Made One (Theosis)',
              headline: 'The very word  means “Made One.”',
              lead: 'Practiced by the desert fathers and Bahtawiyan hermits, the mystical root is Theosis and silent prayer of the heart—where words stop in undivided stillness.',
              textPos: 'pos-center-bottom',
              svgX: 50, svgY: 38,
              camX: 0, camY: 8, camZ: -3810, camYaw: 0, camPitch: 2, camRoll: 0,
              motionType: 'STALACTITE GROTTO · TEWAHEDO',
              motionDir: 'vertical',
              lobes: 24, amp: 6, gap: 0
            }
          ]
        },
        {
          geez: '፮',
          name: 'Sensory Immersion',
          trapTheme: false,
          moments: [
            {
              label: 'Frankincense & Fast',
              headline: 'Embodied practice shuts down the  machine.',
              lead: 'Long fasts (Tsom), endless prostrations (Sigdet), and rising clouds of frankincense (Etan) exhaust physical restlessness and anchor awareness in the breath.',
              textPos: 'pos-left',
              svgX: 67, svgY: 52,
              // Framing Shrine 5 (205, 10, -5150) on its carved stone incense altar on the right
              camX: 35, camY: 0, camZ: -4580, camYaw: -9, camPitch: 1, camRoll: -0.8,
              motionType: 'SUBTERRANEAN INCENSE DOME',
              motionDir: 'vertical',
              lobes: 16, amp: 20, gap: 18
            },
            {
              label: 'St. Yared’s Zema',
              headline: 'Ancient frequencies drop the mind into  presence.',
              lead: 'The sacred modes of St. Yared’s chants (Zema—Ge’ez, Ezel, and Araray) overwhelm the analytical brain and halt the automatic stream of everyday thoughts.',
              textPos: 'pos-top-left',
              svgX: 66, svgY: 46,
              camX: 70, camY: 5, camZ: -4755, camYaw: -8, camPitch: 1, camRoll: 0.8,
              motionType: 'ACOUSTIC CAVERN ZENITH',
              motionDir: 'vertical',
              lobes: 24, amp: 28, gap: 6
            }
          ]
        },
        {
          geez: '፯',
          name: 'Where It Fails Most People',
          trapTheme: true,
          moments: [
            {
              label: 'Autocomplete & Fear',
              headline: 'When held as habit or fear, the doorway becomes a .',
              lead: 'Inherited as cultural autocomplete or a fearful tax to avoid punishment and buy heaven, mechanical religion amplifies anxiety and mental noise.',
              textPos: 'pos-right',
              svgX: 31, svgY: 49,
              // Framing Shrine 6 (-205, 25, -6100) on the left while story-super is pos-right
              camX: -35, camY: 14, camZ: -5530, camYaw: 9, camPitch: -1, camRoll: 1.8,
              motionType: 'FRACTURED BASALT CRYPT',
              motionDir: 'horizontal',
              lobes: 7, amp: 40, gap: 82
            },
            {
              label: 'Spiritual Ego',
              headline: 'Defending the map with  while missing its love.',
              lead: 'Obsessed with policing who fasts or dresses right, or projecting God only onto distant books and buildings, dogmatic ego forgets that the Kingdom is within.',
              textPos: 'pos-right',
              svgX: 32, svgY: 49,
              camX: -65, camY: 18, camZ: -5710, camYaw: 8, camPitch: 1, camRoll: -1.8,
              motionType: 'CRIMSON FAULT RECKONING',
              motionDir: 'horizontal',
              lobes: 9, amp: 46, gap: 96
            }
          ]
        },
        {
          geez: '፰',
          name: 'The Kingdom Within',
          trapTheme: false,
          moments: [
            {
              label: 'Theosis vs. Trap',
              headline: 'Surrender and inward stillness over  compliance.',
              lead: 'Across primary drive, sensory engagement, locus of the divine, and cognitive state, the shortcut awakens presence while conditioning breeds division.',
              textPos: 'pos-left',
              svgX: 67, svgY: 49,
              // Framing Shrine 7 (0, 10, -7100) and the Golden Lalibela Cross Apse (-7365)
              camX: -95, camY: 4, camZ: -6500, camYaw: -7, camPitch: 0, camRoll: 0,
              motionType: 'INNER CAVE · HOLY OF HOLIES',
              motionDir: 'horizontal',
              lobes: 16, amp: 14, gap: 12
            },
            {
              label: 'Be Still and Know',
              headline: '“The Kingdom of God is  you.”',
              lead: 'Not “leave your faith.” Not “your tradition is false.” Go deeper than the automatic version of it—into the living silence it has pointed toward for centuries.',
              textPos: 'pos-center-bottom',
              svgX: 50, svgY: 38,
              camX: 0, camY: 14, camZ: -6710, camYaw: 0, camPitch: 2, camRoll: 0,
              motionType: 'MEKDES SANCTUARY EPIPHANY',
              motionDir: 'vertical',
              lobes: 24, amp: 7, gap: 0
            }
          ]
        }
      ];

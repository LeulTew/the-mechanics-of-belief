// The lighting and zema toggles sit in the masthead on wide screens and move
// down beside the lens control on phones, so both places share these.

interface LightingProps {
  className: string
  vellum: boolean
  onToggle: () => void
}

export function LightingButton({ className, vellum, onToggle }: LightingProps) {
  return (
    <button
      type="button"
      className={className}
      aria-pressed={vellum}
      title="Switch between torchlight and daylight"
      onClick={onToggle}
    >
      <span className="desktop-only">{vellum ? 'Parchment Daylight' : 'Torchlit Sanctuary'}</span>
      <span className="compact-only">{vellum ? 'Daylight' : 'Torchlight'}</span>
    </button>
  )
}

interface ZemaProps {
  className: string
  playing: boolean
  onToggle: () => void
}

export function ZemaButton({ className, playing, onToggle }: ZemaProps) {
  return (
    <button
      type="button"
      className={className}
      aria-pressed={playing}
      aria-label="Zema Resonance"
      title={playing ? 'Stop the zema drone' : 'Play a quiet zema drone'}
      onClick={onToggle}
    >
      <span className={`zema-dot${playing ? ' is-playing' : ''}`} aria-hidden="true" />
      <span aria-hidden="true">
        <span lang="am">ዜማ</span>
        <span className="desktop-only"> · Zema Resonance</span>
      </span>
    </button>
  )
}

import { LightingButton, ZemaButton } from './Toggles.tsx'

interface Props {
  macro: boolean
  onToggleMacro: () => void
  onReset: () => void
  vellum: boolean
  onToggleVellum: () => void
  zema: boolean
  onToggleZema: () => void
}

export function LensControls({ macro, onToggleMacro, onReset, vellum, onToggleVellum, zema, onToggleZema }: Props) {
  return (
    <div id="director-hud" role="group" aria-label="View">
      <ZemaButton className="hud-lens-btn compact-only" playing={zema} onToggle={onToggleZema} />
      <LightingButton className="hud-lens-btn compact-only" vellum={vellum} onToggle={onToggleVellum} />
      <button type="button" className="hud-lens-btn wide-only" title="Return the camera to its resting angle" onClick={onReset}>
        Reset View
      </button>
      <button
        type="button"
        className={`hud-lens-btn${macro ? ' is-active' : ''}`}
        aria-pressed={macro}
        title="Switch between a wide and a close lens"
        onClick={onToggleMacro}
      >
        {macro ? '85mm Macro' : '35mm Wide'}
      </button>
    </div>
  )
}

import React from 'react'

interface DirectorHUDProps {
  onResetLook: () => void
  deepZoom: boolean
  onToggleDeepZoom: () => void
}

export const DirectorHUD: React.FC<DirectorHUDProps> = ({
  onResetLook,
  deepZoom,
  onToggleDeepZoom
}) => {
  return (
    <div id="director-hud" aria-label="3D Camera Controls">
      <button
        type="button"
        id="btn-reset-look"
        className="hud-lens-btn"
        aria-label="Reset 360° Free-Look Camera Angle"
        title="Reset 360° Free-Look Camera Angle"
        onClick={onResetLook}
      >
        <span>Reset View</span>
      </button>
      <button
        type="button"
        id="btn-deep-zoom"
        className={`hud-lens-btn ${deepZoom ? 'is-active' : ''}`}
        aria-pressed={deepZoom}
        aria-label="Toggle Deep 3D Shrine Macro Zoom (85mm Lens)"
        title="Toggle Deep 3D Shrine Macro Zoom (85mm Lens)"
        onClick={onToggleDeepZoom}
      >
        <span id="lens-label">{deepZoom ? '85mm Macro' : '35mm Wide'}</span>
      </button>
    </div>
  )
}

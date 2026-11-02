import React from 'react'
import { ACTS } from '../data/actsData.ts'

interface CameraRig3DProps {
  progress: number
  lookYaw: number
  lookPitch: number
  walkX: number
  walkZ: number
  deepZoom: boolean
}

export const CameraRig3D: React.FC<CameraRig3DProps> = ({
  progress,
  lookYaw,
  lookPitch,
  walkX,
  walkZ,
  deepZoom
}) => {
  const totalActs = ACTS.length
  const actFloat = progress * (totalActs - 1)
  const actIdx = Math.max(0, Math.min(totalActs - 1, Math.floor(actFloat)))
  const actLocal = actFloat - actIdx
  const act = ACTS[actIdx]
  const momentIdx = actLocal < 0.46 ? 0 : 1
  const moment = act.moments[momentIdx] || act.moments[0]

  const totalYawDeg = moment.camYaw - lookYaw
  const totalPitchDeg = moment.camPitch + lookPitch
  const totalRollDeg = moment.camRoll

  const camX = moment.camX + walkX
  const camY = moment.camY
  const camZ = moment.camZ + walkZ - (deepZoom ? 165 : 0)

  const perspPx = deepZoom ? 1450 : 1100

  // 3D CSS perspective transform for camera rig
  const rigTransform = `translateZ(${perspPx}px) rotateZ(${-totalRollDeg.toFixed(2)}deg) rotateX(${totalPitchDeg.toFixed(2)}deg) rotateY(${-totalYawDeg.toFixed(2)}deg) translate3d(${-camX.toFixed(1)}px, ${camY.toFixed(1)}px, ${-camZ.toFixed(1)}px)`

  return (
    <div
      id="viewport"
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      style={{ perspective: `${perspPx}px` }}
    >
      <div
        id="camera-rig-3d"
        className="w-full h-full relative preserve-3d transition-transform duration-75 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: rigTransform
        }}
      >
        <div id="world-3d" className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* Architectural Stone Bays providing spatial depth */}
          {[0, -440, -880, -1320, -1760, -2200].map((bayZ) => (
            <div
              key={bayZ}
              className="arch-bay-3d absolute inset-0 pointer-events-none"
              style={{
                transformStyle: 'preserve-3d',
                transform: `translate3d(0px, 0px, ${bayZ}px)`
              }}
            >
              <div
                className="bay-floor absolute w-[900px] h-[480px] -left-[450px] top-[140px] bg-stone-warm/25 border-t border-hairline/40"
                style={{ transform: 'rotateX(90deg)' }}
              />
              <div
                className="bay-ceiling absolute w-[900px] h-[480px] -left-[450px] -top-[340px] bg-stone-warm/15 border-b border-hairline/40"
                style={{ transform: 'rotateX(-90deg)' }}
              />
              {/* Left & Right Monolithic Pillars */}
              <div
                className="absolute w-[70px] h-[480px] -left-[320px] -top-[120px] bg-stone-lit/30 border border-hairline/30"
                style={{ transform: 'translateZ(-100px)' }}
              />
              <div
                className="absolute w-[70px] h-[480px] left-[250px] -top-[120px] bg-stone-lit/30 border border-hairline/30"
                style={{ transform: 'translateZ(-100px)' }}
              />
              {/* Lintel Arch */}
              <div
                className="absolute w-[640px] h-[50px] -left-[320px] -top-[120px] bg-stone-warm/40 border-b border-gold-bright/15"
                style={{ transform: 'translateZ(-95px)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

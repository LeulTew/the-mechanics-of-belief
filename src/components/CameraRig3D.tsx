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

  // 3D CSS transform for camera rig
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
          {/* 3D Architectural Stone Bays */}
          {[0, -440, -880, -1320, -1760, -2200].map((bayZ, idx) => (
            <div
              key={bayZ}
              className="arch-bay-3d absolute inset-0 pointer-events-none"
              style={{
                transformStyle: 'preserve-3d',
                transform: `translate3d(0px, 0px, ${bayZ}px)`
              }}
            >
              <div
                className="bay-floor absolute w-[900px] h-[480px] -left-[450px] top-[140px] bg-stone-warm/30 border-t border-hairline"
                style={{ transform: 'rotateX(90deg)' }}
              />
              <div
                className="bay-ceiling absolute w-[900px] h-[480px] -left-[450px] -top-[340px] bg-stone-warm/20 border-b border-hairline"
                style={{ transform: 'rotateX(-90deg)' }}
              />
              {/* Left & Right Monolithic Pillars */}
              <div
                className="absolute w-[80px] h-[480px] -left-[320px] -top-[120px] bg-stone-lit/40 border border-hairline"
                style={{ transform: 'translateZ(-100px)' }}
              />
              <div
                className="absolute w-[80px] h-[480px] left-[240px] -top-[120px] bg-stone-lit/40 border border-hairline"
                style={{ transform: 'translateZ(-100px)' }}
              />
              {/* Lintel Arch */}
              <div
                className="absolute w-[640px] h-[60px] -left-[320px] -top-[120px] bg-stone-warm/50 border-b border-gold-bright/20"
                style={{ transform: 'translateZ(-95px)' }}
              />
            </div>
          ))}

          {/* 8 Shrine Orbital Monuments */}
          {ACTS.map((a, i) => {
            const m = a.moments[0]
            const isCurrent = i === actIdx
            return (
              <div
                key={i}
                id={`shrine-orbit-${i}`}
                className={`shrine-card-3d absolute w-[340px] h-[380px] -left-[170px] -top-[190px] rounded-2xl border transition-all duration-300 pointer-events-none ${
                  isCurrent
                    ? 'border-gold-bright/60 bg-black/60 shadow-[0_0_50px_rgba(226,198,150,0.18)]'
                    : 'border-white/10 bg-black/30'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translate3d(${m.camX + 60}px, ${m.camY + 20}px, ${m.camZ - 200}px) rotateY(${m.camYaw}deg)`
                }}
              >
                <div className="p-6 flex flex-col justify-between h-full text-center">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-serif text-2xl text-gold-bright">{a.geez}</span>
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                      SHRINE {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white font-semibold mb-2">{a.name}</h3>
                    <p className="text-xs text-zinc-300 font-sans line-clamp-3 leading-relaxed">
                      {m.lead}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-bright/80 animate-ping" />
                    <span className="text-[10px] font-mono text-gold-bright/80 tracking-wider">
                      {m.motionType}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

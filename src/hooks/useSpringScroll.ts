import { useState, useEffect, useRef, useCallback } from 'react'
import { ACTS } from '../data/actsData.ts'

export function useSpringScroll() {
  const [progress, setProgress] = useState(0)
  const [activeActIndex, setActiveActIndex] = useState(0)
  const [activeMomentIndex, setActiveMomentIndex] = useState(0)
  const [deepZoom, setDeepZoom] = useState(false)
  const [lookState, setLookState] = useState({ yaw: 0, pitch: 0 })
  const [walkCoords, setWalkCoords] = useState({ x: 0, z: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    velocityX: 0,
    velocityY: 0,
    lastTime: 0,
    isDown: false,
    hasMovedPastThreshold: false,
    targetYaw: 0,
    targetPitch: 0
  })

  const targetProgressRef = useRef(0)
  const currentProgressRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const p = Math.max(0, Math.min(1, window.scrollY / maxScroll))
      targetProgressRef.current = p
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Spring animation loop with inertia physics
  useEffect(() => {
    let lastTime = performance.now()

    const updateLoop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000)
      lastTime = now

      // Spring-damper interpolation for scroll progress
      const diff = targetProgressRef.current - currentProgressRef.current
      currentProgressRef.current += diff * Math.min(1, dt * 10)
      const p = currentProgressRef.current
      setProgress(p)

      // Calculate active Act and Moment
      const totalActs = ACTS.length
      const actFloat = p * (totalActs - 1)
      const actIdx = Math.max(0, Math.min(totalActs - 1, Math.floor(actFloat)))
      const actFrac = actFloat - actIdx
      const momentsCount = ACTS[actIdx].moments.length
      const momentIdx = Math.max(0, Math.min(momentsCount - 1, Math.floor(actFrac * momentsCount)))

      setActiveActIndex(actIdx)
      setActiveMomentIndex(momentIdx)

      // Fling inertia decay when pointer is released
      const d = dragRef.current
      if (!d.isDown && (Math.abs(d.velocityX) > 0.05 || Math.abs(d.velocityY) > 0.05)) {
        d.targetYaw = Math.max(-75, Math.min(75, d.targetYaw + d.velocityX * dt * 60))
        d.targetPitch = Math.max(-40, Math.min(40, d.targetPitch + d.velocityY * dt * 60))
        d.velocityX *= 0.92
        d.velocityY *= 0.92
      }

      // Smooth look yaw/pitch
      setLookState((prev) => ({
        yaw: prev.yaw + (d.targetYaw - prev.yaw) * Math.min(1, dt * 9),
        pitch: prev.pitch + (d.targetPitch - prev.pitch) * Math.min(1, dt * 9)
      }))

      rafIdRef.current = requestAnimationFrame(updateLoop)
    }

    rafIdRef.current = requestAnimationFrame(updateLoop)
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  // Pointer drag 360 look with 8px intent deadzone
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement
    if (
      target.closest(
        'button, a, input, [role="button"], [role="dialog"], #story-super, #film-timeline, #director-hud, #manuscript-sheet'
      )
    ) {
      return
    }
    const d = dragRef.current
    d.isDown = true
    d.hasMovedPastThreshold = false
    d.startX = e.clientX
    d.startY = e.clientY
    d.lastX = e.clientX
    d.lastY = e.clientY
    d.lastTime = performance.now()
    d.velocityX = 0
    d.velocityY = 0
  }, [])

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current
      if (!d.isDown) return

      const deltaX = e.clientX - d.startX
      const deltaY = e.clientY - d.startY
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // 8px deadzone: ignore micro-movements to allow vertical scrolling
      if (!d.hasMovedPastThreshold) {
        if (dist > 8) {
          d.hasMovedPastThreshold = true
          setIsDragging(true)
        } else {
          return
        }
      }

      // Track velocity for fling inertia
      const now = performance.now()
      const timeDelta = Math.max(1, now - d.lastTime)
      d.velocityX = ((e.clientX - d.lastX) / timeDelta) * 1.5
      d.velocityY = ((e.clientY - d.lastY) / timeDelta) * 1.5
      d.lastX = e.clientX
      d.lastY = e.clientY
      d.lastTime = now

      d.targetYaw = Math.max(-75, Math.min(75, d.targetYaw + (e.clientX - d.lastX) * 0.4))
      d.targetPitch = Math.max(-40, Math.min(40, d.targetPitch + (e.clientY - d.lastY) * 0.4))
    }

    const onPointerUp = () => {
      dragRef.current.isDown = false
      setIsDragging(false)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  // Keyboard navigation with modal check (WCAG 2.1.4)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      // Guard: do not process if any modal dialog is currently open
      if (document.querySelector('[role="dialog"]')) return

      if (e.key === 'w' || e.key === 'W') {
        setWalkCoords((prev) => ({ ...prev, z: prev.z - 80 }))
      } else if (e.key === 's' || e.key === 'S') {
        setWalkCoords((prev) => ({ ...prev, z: prev.z + 80 }))
      } else if (e.key === 'a' || e.key === 'A') {
        setWalkCoords((prev) => ({ ...prev, x: prev.x - 60 }))
      } else if (e.key === 'd' || e.key === 'D') {
        setWalkCoords((prev) => ({ ...prev, x: prev.x + 60 }))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const resetLook = useCallback(() => {
    dragRef.current.targetYaw = 0
    dragRef.current.targetPitch = 0
    dragRef.current.velocityX = 0
    dragRef.current.velocityY = 0
    setWalkCoords({ x: 0, z: 0 })
  }, [])

  const toggleDeepZoom = useCallback(() => {
    setDeepZoom((prev) => !prev)
  }, [])

  const scrollToAct = useCallback((actIdx: number) => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const targetP = actIdx / (ACTS.length - 1)
    window.scrollTo({
      top: targetP * maxScroll,
      behavior: 'smooth'
    })
  }, [])

  return {
    progress,
    activeActIndex,
    activeMomentIndex,
    lookYaw: lookState.yaw,
    lookPitch: lookState.pitch,
    walkX: walkCoords.x,
    walkZ: walkCoords.z,
    deepZoom,
    isDragging,
    onPointerDown,
    resetLook,
    toggleDeepZoom,
    scrollToAct
  }
}

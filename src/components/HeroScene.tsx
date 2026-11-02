import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { VisualMode, WebGLMetrics } from '../types.ts'
import heroFallbackStill from '../assets/hero.png'

interface HeroSceneProps {
  mode: VisualMode
  onMetricsUpdate?: (metrics: WebGLMetrics) => void
}

// Generate a soft radial Gaussian point sprite texture
function createGaussianTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(168, 85, 247, 0.8)')
    gradient.addColorStop(0.7, 'rgba(99, 102, 241, 0.25)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export const HeroScene: React.FC<HeroSceneProps> = ({ mode, onMetricsUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    mesh: THREE.Mesh
    pointsMesh?: THREE.Points
    gaussianTexture?: THREE.Texture
    lights: THREE.Light[]
    dispose: () => void
  } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // If reduced-motion is requested, hold the lossless fallback still and skip WebGL
    if (isReducedMotion) {
      return
    }

    const width = container.clientWidth
    const height = container.clientHeight
    const isMobile = window.innerWidth < 768

    // 1. Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 38)

    // 2. Renderer with Khronos PBR Neutral tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'default' // power-efficient across iGPU/dGPU
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.domElement.setAttribute('aria-hidden', 'true')
    container.appendChild(renderer.domElement)

    // 3. Responsive geometry segments
    const tubularSegments = isMobile ? 64 : 128
    const radialSegments = isMobile ? 16 : 32
    const geometry = new THREE.TorusKnotGeometry(9, 2.7, tubularSegments, radialSegments, 2, 3)

    // 4. Primary PBR Material
    const material = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.16,
      metalness: 0.88,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.4
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = 0.3
    mesh.rotation.y = 0.5
    scene.add(mesh)

    // 5. Gaussian Splat / Particle specimen cloud with circular soft alpha texture
    const particleCount = isMobile ? 450 : 900
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 14 + Math.random() * 8

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      const t = Math.random()
      if (t < 0.6) {
        colors[i * 3] = 0.38 + t * 0.2
        colors[i * 3 + 1] = 0.4 + t * 0.2
        colors[i * 3 + 2] = 0.95
      } else {
        colors[i * 3] = 0.95
        colors[i * 3 + 1] = 0.6 + (t - 0.6) * 0.5
        colors[i * 3 + 2] = 0.2
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const gaussianTexture = createGaussianTexture()
    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.75 : 0.95,
      map: gaussianTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const pointsMesh = new THREE.Points(particleGeo, particleMat)
    scene.add(pointsMesh)

    // 6. Lighting rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0x818cf8, 2.8)
    keyLight.position.set(25, 30, 25)
    scene.add(keyLight)

    const rimLight = new THREE.PointLight(0xf59e0b, 3.2, 80)
    rimLight.position.set(-25, -20, -15)
    scene.add(rimLight)

    const fillLight = new THREE.PointLight(0xa855f7, 2.0, 70)
    fillLight.position.set(0, -25, 20)
    scene.add(fillLight)

    // 7. Scoped Mouse & Touch Parallax tracking
    let targetRotX = 0
    let targetRotY = 0

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotY = Math.max(-0.6, Math.min(0.6, mouseX * 0.45))
      targetRotX = Math.max(-0.5, Math.min(0.5, mouseY * 0.35))
    }

    let touchStartX = 0
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const dx = e.touches[0].clientX - touchStartX
        const dy = e.touches[0].clientY - touchStartY
        targetRotY = Math.max(-0.6, Math.min(0.6, targetRotY + dx * 0.003))
        targetRotX = Math.max(-0.5, Math.min(0.5, targetRotX + dy * 0.003))
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      }
    }

    container.addEventListener('mousemove', onPointerMove, { passive: true })
    container.addEventListener('touchstart', onTouchStart, { passive: true })
    container.addEventListener('touchmove', onTouchMove, { passive: true })

    // 8. Intersection & Visibility Observers (Halt rendering when offscreen or tab hidden)
    let isVisible = true
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    intersectionObserver.observe(container)

    const onVisibilityChange = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // 9. Delta-Time Frame-Rate Independent Animation loop
    let frameId: number
    let lastTime = performance.now()
    let frameCount = 0
    let lastFpsUpdate = performance.now()

    const animate = (currentTime: number) => {
      frameId = requestAnimationFrame(animate)

      if (!isVisible) {
        lastTime = currentTime
        return
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1)
      lastTime = currentTime

      // Frame-rate independent rotation (radians per second)
      mesh.rotation.y += 0.35 * dt
      mesh.rotation.x += 0.2 * dt
      mesh.rotation.y += (targetRotY - mesh.rotation.y * 0.1) * (2.5 * dt)
      mesh.rotation.x += (targetRotX - mesh.rotation.x * 0.1) * (2.5 * dt)

      // Particle cloud counter-spin
      pointsMesh.rotation.y -= 0.12 * dt
      pointsMesh.rotation.z += 0.06 * dt

      // Orbiting key light
      keyLight.position.x = 25 * Math.cos(currentTime * 0.0006)
      keyLight.position.z = 25 * Math.sin(currentTime * 0.0006)

      renderer.render(scene, camera)

      // Rolling FPS tracking
      frameCount++
      if (currentTime - lastFpsUpdate >= 500) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastFpsUpdate))
        frameCount = 0
        lastFpsUpdate = currentTime

        if (onMetricsUpdate) {
          onMetricsUpdate({
            fps,
            drawCalls: renderer.info.render.calls,
            triangles: renderer.info.render.triangles,
            particleCount
          })
        }
      }

      if (!isLoaded) {
        setIsLoaded(true)
      }
    }

    animate(performance.now())

    // 10. Resize observer
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', onResize)

    sceneRef.current = {
      renderer,
      scene,
      camera,
      mesh,
      pointsMesh,
      gaussianTexture,
      lights: [ambientLight, keyLight, rimLight, fillLight],
      dispose: () => {
        container.removeEventListener('mousemove', onPointerMove)
        container.removeEventListener('touchstart', onTouchStart)
        container.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('resize', onResize)
        document.removeEventListener('visibilitychange', onVisibilityChange)
        intersectionObserver.disconnect()
        cancelAnimationFrame(frameId)

        // Force WebGL context eviction to avoid browser limits
        renderer.forceContextLoss()
        renderer.dispose()
        geometry.dispose()
        material.dispose()
        particleGeo.dispose()
        particleMat.dispose()
        gaussianTexture.dispose()
        scene.clear()

        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
      }
    }

    return () => {
      sceneRef.current?.dispose()
    }
  }, [isReducedMotion])

  // Dynamic visual mode changes with mat.needsUpdate & scale reset
  useEffect(() => {
    if (!sceneRef.current) return
    const { mesh, pointsMesh } = sceneRef.current
    const mat = mesh.material as THREE.MeshStandardMaterial

    // Reset pointsMesh scale whenever switching modes
    if (pointsMesh) {
      if (mode === 'gaussian') {
        pointsMesh.scale.set(1.4, 1.4, 1.4)
        pointsMesh.visible = true
      } else {
        pointsMesh.scale.set(1.0, 1.0, 1.0)
      }
    }

    if (mode === 'crystal') {
      mat.wireframe = false
      mat.color.setHex(0x6366f1)
      mat.metalness = 0.88
      mat.roughness = 0.16
      mat.emissive.setHex(0x1e1b4b)
      mesh.visible = true
      if (pointsMesh) pointsMesh.visible = true
    } else if (mode === 'gaussian') {
      mat.wireframe = false
      mesh.visible = false
    } else if (mode === 'wireframe') {
      mesh.visible = true
      mat.wireframe = true
      mat.color.setHex(0x38bdf8)
      mat.emissive.setHex(0x0369a1)
      if (pointsMesh) pointsMesh.visible = false
    } else if (mode === 'chrome') {
      mesh.visible = true
      mat.wireframe = false
      mat.color.setHex(0xf3f4f6)
      mat.metalness = 0.98
      mat.roughness = 0.05
      mat.emissive.setHex(0x374151)
      if (pointsMesh) pointsMesh.visible = true
    }

    mat.needsUpdate = true
  }, [mode])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[560px] flex items-center justify-center overflow-hidden"
    >
      {/* 1-Pixel Registration Fallback Still (Zero-Layout Shift & Reduced-Motion Hero) */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 pointer-events-none select-none ${
          isLoaded && !isReducedMotion ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden={isLoaded && !isReducedMotion ? 'true' : 'false'}
      >
        <img
          src={heroFallbackStill}
          alt="3D Iridescent Monolith Artwork"
          className="w-full h-full object-contain max-w-[420px] max-h-[420px] filter drop-shadow-[0_15px_30px_rgba(99,102,241,0.25)]"
          loading="eager"
        />
      </div>
    </div>
  )
}

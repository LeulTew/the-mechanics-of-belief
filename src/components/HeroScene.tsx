import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { VisualMode, WebGLMetrics } from '../types.ts'

interface HeroSceneProps {
  mode: VisualMode
  onMetricsUpdate?: (metrics: WebGLMetrics) => void
}

export const HeroScene: React.FC<HeroSceneProps> = ({ mode, onMetricsUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    mesh: THREE.Mesh
    pointsMesh?: THREE.Points
    lights: THREE.Light[]
    dispose: () => void
  } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

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
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // 3. Geometry based on viewport
    const tubularSegments = isMobile ? 64 : 128
    const radialSegments = isMobile ? 16 : 32
    const geometry = new THREE.TorusKnotGeometry(9, 2.7, tubularSegments, radialSegments, 2, 3)

    // 4. Primary Material
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

    // 5. Gaussian / Particle specimen cloud
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

      // Gradient from cobalt to violet to ember
      const t = Math.random()
      if (t < 0.6) {
        colors[i * 3] = 0.38 + t * 0.2 // R
        colors[i * 3 + 1] = 0.4 + t * 0.2 // G
        colors[i * 3 + 2] = 0.95 // B
      } else {
        colors[i * 3] = 0.95
        colors[i * 3 + 1] = 0.6 + (t - 0.6) * 0.5
        colors[i * 3 + 2] = 0.2
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.35 : 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
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

    // 7. Mouse & Touch Parallax tracking
    let targetRotX = 0
    let targetRotY = 0
    let mouseX = 0
    let mouseY = 0

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotY = mouseX * 0.45
      targetRotX = mouseY * 0.35
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
        targetRotY += dx * 0.005
        targetRotX += dy * 0.005
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      }
    }

    window.addEventListener('mousemove', onPointerMove, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    // 8. Animation loop & FPS counting
    let frameId: number
    let lastTime = performance.now()
    let frameCount = 0
    let lastFpsUpdate = performance.now()

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate)

      // Inertia smoothing
      mesh.rotation.y += 0.005
      mesh.rotation.x += 0.003
      mesh.rotation.y += (targetRotY - mesh.rotation.y * 0.1) * 0.05
      mesh.rotation.x += (targetRotX - mesh.rotation.x * 0.1) * 0.05

      // Particle cloud counter-spin
      pointsMesh.rotation.y -= 0.002
      pointsMesh.rotation.z += 0.001

      // Dynamic light orbit
      keyLight.position.x = 25 * Math.cos(time * 0.0006)
      keyLight.position.z = 25 * Math.sin(time * 0.0006)

      renderer.render(scene, camera)

      // FPS tracking
      frameCount++
      if (time - lastFpsUpdate >= 500) {
        const fps = Math.round((frameCount * 1000) / (time - lastFpsUpdate))
        frameCount = 0
        lastFpsUpdate = time

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

    // 9. Resize observer
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
      lights: [ambientLight, keyLight, rimLight, fillLight],
      dispose: () => {
        window.removeEventListener('mousemove', onPointerMove)
        window.removeEventListener('touchstart', onTouchStart)
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(frameId)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
        particleGeo.dispose()
        particleMat.dispose()
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
      }
    }

    return () => {
      sceneRef.current?.dispose()
    }
  }, [])

  // Dynamic visual mode changes
  useEffect(() => {
    if (!sceneRef.current) return
    const { mesh, pointsMesh } = sceneRef.current
    const mat = mesh.material as THREE.MeshStandardMaterial

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
      if (pointsMesh) {
        pointsMesh.visible = true
        pointsMesh.scale.set(1.4, 1.4, 1.4)
      }
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
  }, [mode])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[440px] md:min-h-[560px] flex items-center justify-center overflow-hidden"
    >
      {/* 1-Pixel Registration Fallback Still */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
        }}
      >
        <div className="w-48 h-48 rounded-full border border-indigo-500/30 animate-pulse flex items-center justify-center">
          <span className="text-xs font-mono text-indigo-300">Initializing WebGL...</span>
        </div>
      </div>
    </div>
  )
}

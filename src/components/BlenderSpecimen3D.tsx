import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface BlenderSpecimen3DProps {
  isOpen: boolean
  onClose: () => void
}

export const BlenderSpecimen3D: React.FC<BlenderSpecimen3DProps> = ({ isOpen, onClose }) => {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [wireframe, setWireframe] = useState<boolean>(false)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const glbModelRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    if (!isOpen || !mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0c0907)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1.5, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.9)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xe2c696, 2.5)
    dirLight1.position.set(5, 8, 5)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0x7090b0, 1.0)
    dirLight2.position.set(-5, -2, -5)
    scene.add(dirLight2)

    // Load Blender 5.2 GLB Model
    const loader = new GLTFLoader()
    const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
    loader.load(
      `${baseUrl}models/sanctuary_specimens.glb`,
      (gltf) => {
        const model = gltf.scene
        model.scale.set(1.2, 1.2, 1.2)
        model.position.set(0, -0.5, 0)
        scene.add(model)
        glbModelRef.current = model
      },
      undefined,
      (err) => {
        console.warn('Failed to load GLB model:', err)
      }
    )

    let reqId: number
    let angle = 0

    const animateLoop = () => {
      reqId = requestAnimationFrame(animateLoop)
      angle += 0.007
      if (glbModelRef.current) {
        glbModelRef.current.rotation.y = angle
      }
      renderer.render(scene, camera)
    }
    animateLoop()

    const handleResize = () => {
      if (!mountRef.current) return
      const w = mountRef.current.clientWidth
      const h = mountRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [isOpen])

  // Toggle wireframe mode
  useEffect(() => {
    if (!glbModelRef.current) return
    glbModelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (m) m.wireframe = wireframe
      }
    })
  }, [wireframe])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[80vh] bg-[#0c0907] border border-gold-bright/30 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-fidel text-gold-bright text-xs">ቅርሶች</span>
              <span className="text-zinc-600 text-xs">·</span>
              <span className="text-[11px] font-sans font-medium text-gold-bright tracking-[0.2em] uppercase">
                Sacred Monolithic Reliquaries
              </span>
            </div>
            <h3 className="font-serif text-xl text-white font-normal">
              Architectural Specimens of Faith
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-sans text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            Close ✕
          </button>
        </div>

        {/* 3D Canvas Mount */}
        <div ref={mountRef} className="flex-1 w-full relative cursor-grab active:cursor-grabbing" />

        {/* Footer Controls */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-black/50 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-zinc-400">
          <div className="flex items-center gap-2.5">
            <span className="text-zinc-500 text-xs">View:</span>
            <button
              type="button"
              onClick={() => setWireframe(!wireframe)}
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                wireframe
                  ? 'bg-gold-bright text-neutral-950 border-gold-bright font-semibold'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {wireframe ? 'Wireframe Mesh' : 'PBR Stone Surface'}
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs font-serif text-zinc-300">
            <span>Bet Giyorgis Cross</span>
            <span className="text-zinc-600">·</span>
            <span>Aksumite Stele</span>
            <span className="text-zinc-600">·</span>
            <span className="text-gold-bright">Bronze Sistrum</span>
          </div>
        </div>
      </div>
    </div>
  )
}

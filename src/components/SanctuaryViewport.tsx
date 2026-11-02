import React, { useEffect, useRef } from 'react'
import { RAYMARCH_VS, RAYMARCH_FS, PARTICLES_VS, PARTICLES_FS } from '../utils/shaders.ts'
import { ACTS } from '../data/actsData.ts'
import { ThemeMode, WebGLMetrics } from '../types.ts'

interface SanctuaryViewportProps {
  progress: number
  lookYaw: number
  lookPitch: number
  walkX: number
  walkZ: number
  deepZoom: boolean
  theme: ThemeMode
  onMetricsUpdate?: (metrics: WebGLMetrics) => void
}

export const SanctuaryViewport: React.FC<SanctuaryViewportProps> = ({
  progress,
  lookYaw,
  lookPitch,
  walkX,
  walkZ,
  deepZoom,
  theme,
  onMetricsUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)

  // Mutable props ref to prevent stale closures inside requestAnimationFrame
  const propsRef = useRef({
    progress,
    lookYaw,
    lookPitch,
    walkX,
    walkZ,
    deepZoom,
    theme
  })

  useEffect(() => {
    propsRef.current = {
      progress,
      lookYaw,
      lookPitch,
      walkX,
      walkZ,
      deepZoom,
      theme
    }
  }, [progress, lookYaw, lookPitch, walkX, walkZ, deepZoom, theme])

  const stateRef = useRef({
    camX: -15,
    camY: -12,
    camZ: 240,
    camYaw: -7,
    camPitch: -1,
    camRoll: 0,
    targetCamX: -15,
    targetCamY: -12,
    targetCamZ: 240,
    targetCamYaw: -7,
    targetCamPitch: -1,
    targetCamRoll: 0,
    smoothLookYaw: 0,
    smoothLookPitch: 0,
    drsScale: 1.0,
    emaDt: 0.016,
    drsCooldown: 0,
    lastFrameTime: performance.now(),
    frameCount: 0,
    fpsCalcTime: performance.now(),
    currentTrap: 0.0
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    })
    if (!gl) {
      console.error('WebGL not supported')
      return
    }
    glRef.current = gl

    // Compile helper
    const compileShader = (type: number, src: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader compile failed:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const createProgram = (vsSrc: string, fsSrc: string) => {
      const vs = compileShader(gl.VERTEX_SHADER, vsSrc)
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSrc)
      if (!vs || !fs) return null
      const prog = gl.createProgram()
      if (!prog) return null
      gl.attachShader(prog, vs)
      gl.attachShader(prog, fs)
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.warn('Program link failed:', gl.getProgramInfoLog(prog))
        return null
      }
      return prog
    }

    // Textures with procedural instant seed
    const createSeamlessTexture = (dataUri: string, baseR: number, baseG: number, baseB: number) => {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      const sz = 64
      const seed = new Uint8Array(sz * sz * 4)
      for (let y = 0; y < sz; y++) {
        for (let x = 0; x < sz; x++) {
          const idx = (y * sz + x) * 4
          const v = Math.sin(x * 0.39) * Math.cos(y * 0.39) * 18 + Math.sin((x + y) * 0.78) * 10
          seed[idx + 0] = Math.max(0, Math.min(255, baseR + v))
          seed[idx + 1] = Math.max(0, Math.min(255, baseG + v * 0.7))
          seed[idx + 2] = Math.max(0, Math.min(255, baseB + v * 0.5))
          seed[idx + 3] = 255
        }
      }
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sz, sz, 0, gl.RGBA, gl.UNSIGNED_BYTE, seed)
      gl.generateMipmap(gl.TEXTURE_2D)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

      if (dataUri) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          if (!glRef.current) return
          gl.bindTexture(gl.TEXTURE_2D, tex)
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
          gl.generateMipmap(gl.TEXTURE_2D)
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
        }
        img.src = dataUri
      }
      return tex
    }

    const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
    const texCliff = createSeamlessTexture(`${baseUrl}textures/cliff.webp`, 138, 102, 74)
    const texCavern = createSeamlessTexture(`${baseUrl}textures/cavern.webp`, 52, 38, 28)

    const rayProg = createProgram(RAYMARCH_VS, RAYMARCH_FS)
    const partProg = createProgram(PARTICLES_VS, PARTICLES_FS)

    // Cached Uniform & Attribute Locations
    const rayLocs = rayProg
      ? {
          aCorner: gl.getAttribLocation(rayProg, 'aCorner'),
          uTexCliff: gl.getUniformLocation(rayProg, 'uTexCliff'),
          uTexCavern: gl.getUniformLocation(rayProg, 'uTexCavern'),
          uCamPos: gl.getUniformLocation(rayProg, 'uCamPos'),
          uCamAngles: gl.getUniformLocation(rayProg, 'uCamAngles'),
          uAspectFov: gl.getUniformLocation(rayProg, 'uAspectFov'),
          uTime: gl.getUniformLocation(rayProg, 'uTime'),
          uVellum: gl.getUniformLocation(rayProg, 'uVellum'),
          uTrap: gl.getUniformLocation(rayProg, 'uTrap')
        }
      : null

    const partLocs = partProg
      ? {
          aPos: gl.getAttribLocation(partProg, 'aPos'),
          aPhase: gl.getAttribLocation(partProg, 'aPhase'),
          aSpeed: gl.getAttribLocation(partProg, 'aSpeed'),
          aType: gl.getAttribLocation(partProg, 'aType'),
          uCamPos: gl.getUniformLocation(partProg, 'uCamPos'),
          uCamAngles: gl.getUniformLocation(partProg, 'uCamAngles'),
          uProjScale: gl.getUniformLocation(partProg, 'uProjScale'),
          uDpr: gl.getUniformLocation(partProg, 'uDpr'),
          uTime: gl.getUniformLocation(partProg, 'uTime')
        }
      : null

    // Screen quad buffer
    const quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    // Particle motes buffer (2026 Gaussian radiance motes)
    const PARTICLE_COUNT = 920
    const particleData = new Float32Array(PARTICLE_COUNT * 6)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 6
      particleData[idx + 0] = (Math.random() - 0.5) * 520
      particleData[idx + 1] = (Math.random() - 0.5) * 220
      particleData[idx + 2] = -Math.random() * 2600 + 100
      particleData[idx + 3] = Math.random() * Math.PI * 2
      particleData[idx + 4] = 0.4 + Math.random() * 0.8
      particleData[idx + 5] = Math.random() < 0.35 ? 1.0 : 0.0
    }
    const partBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, partBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.STATIC_DRAW)

    let animationFrameId: number
    let elapsed = 0

    // Render loop
    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render)
      const st = stateRef.current
      const currentProps = propsRef.current

      const dt = Math.min(0.05, (now - st.lastFrameTime) / 1000)
      st.lastFrameTime = now
      elapsed += dt

      // Exponential Moving Average for frame delta
      st.emaDt = st.emaDt * 0.9 + dt * 0.1

      // Dynamic Resolution Scaling (DRS) with hysteresis
      st.drsCooldown = Math.max(0, st.drsCooldown - 1)
      if (st.drsCooldown === 0) {
        if (st.emaDt > 0.020 && st.drsScale > 0.65) {
          st.drsScale = Math.max(0.65, st.drsScale - 0.1)
          st.drsCooldown = 40 // Wait 40 frames before downscaling again
        } else if (st.emaDt < 0.015 && st.drsScale < 1.0) {
          st.drsScale = Math.min(1.0, st.drsScale + 0.05)
          st.drsCooldown = 90 // Wait 90 frames before upscaling
        }
      }

      // FPS Calculation
      st.frameCount++
      if (now - st.fpsCalcTime > 1000) {
        const fps = Math.round((st.frameCount * 1000) / (now - st.fpsCalcTime))
        st.frameCount = 0
        st.fpsCalcTime = now
        onMetricsUpdate?.({
          fps,
          drsResolution: parseFloat(st.drsScale.toFixed(2)),
          drawCalls: 2,
          triangles: 8192,
          particleCount: PARTICLE_COUNT
        })
      }

      // Resize canvas only when necessary to prevent framebuffer thrashing
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const targetW = Math.floor(window.innerWidth * dpr * st.drsScale)
      const targetH = Math.floor(window.innerHeight * dpr * st.drsScale)
      if (Math.abs(canvas.width - targetW) > 24 || Math.abs(canvas.height - targetH) > 24) {
        canvas.width = targetW
        canvas.height = targetH
        gl.viewport(0, 0, canvas.width, canvas.height)
      }

      // Camera lerp using live propsRef values
      const camLerp = 0.058
      st.smoothLookYaw += (currentProps.lookYaw - st.smoothLookYaw) * 0.12
      st.smoothLookPitch += (currentProps.lookPitch - st.smoothLookPitch) * 0.12

      const targetZ = st.targetCamZ + currentProps.walkZ - (currentProps.deepZoom ? 165 : 0)
      const targetX = st.targetCamX + currentProps.walkX

      st.camX += (targetX - st.camX) * camLerp
      st.camY += (st.targetCamY - st.camY) * camLerp
      st.camZ += (targetZ - st.camZ) * camLerp
      st.camYaw += (st.targetCamYaw - st.camYaw) * camLerp
      st.camPitch += (st.targetCamPitch - st.camPitch) * camLerp
      st.camRoll += (st.targetCamRoll - st.camRoll) * camLerp

      const totalYawDeg = st.camYaw - st.smoothLookYaw
      const totalPitchDeg = st.camPitch + st.smoothLookPitch
      const totalRollDeg = st.camRoll

      const yawRad = (totalYawDeg * Math.PI) / 180
      const pitchRad = (totalPitchDeg * Math.PI) / 180
      const rollRad = (totalRollDeg * Math.PI) / 180

      const aspect = canvas.width / canvas.height
      const fovVal = currentProps.deepZoom ? 0.38 : 0.65
      const aspectFovX = aspect * fovVal
      const aspectFovY = fovVal

      const isVellum = currentProps.theme === 'vellum' ? 1.0 : 0.0

      // Render Raymarch
      if (rayProg && rayLocs) {
        gl.disable(gl.BLEND)
        gl.useProgram(rayProg)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texCliff)
        gl.uniform1i(rayLocs.uTexCliff, 0)

        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, texCavern)
        gl.uniform1i(rayLocs.uTexCavern, 1)

        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
        gl.enableVertexAttribArray(rayLocs.aCorner)
        gl.vertexAttribPointer(rayLocs.aCorner, 2, gl.FLOAT, false, 0, 0)

        gl.uniform3f(rayLocs.uCamPos, st.camX, st.camY, st.camZ)
        gl.uniform3f(rayLocs.uCamAngles, yawRad, pitchRad, rollRad)
        gl.uniform2f(rayLocs.uAspectFov, aspectFovX, aspectFovY)
        gl.uniform1f(rayLocs.uTime, elapsed)
        gl.uniform1f(rayLocs.uVellum, isVellum)
        gl.uniform1f(rayLocs.uTrap, st.currentTrap)

        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      // Render Particles with Correct Uniforms (Fixing Subagent 1 Finding)
      if (partProg && partLocs) {
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.ONE, gl.ONE)
        gl.useProgram(partProg)
        gl.bindBuffer(gl.ARRAY_BUFFER, partBuffer)

        const pStride = 6 * 4
        gl.enableVertexAttribArray(partLocs.aPos)
        gl.vertexAttribPointer(partLocs.aPos, 3, gl.FLOAT, false, pStride, 0)
        gl.enableVertexAttribArray(partLocs.aPhase)
        gl.vertexAttribPointer(partLocs.aPhase, 1, gl.FLOAT, false, pStride, 12)
        gl.enableVertexAttribArray(partLocs.aSpeed)
        gl.vertexAttribPointer(partLocs.aSpeed, 1, gl.FLOAT, false, pStride, 16)
        gl.enableVertexAttribArray(partLocs.aType)
        gl.vertexAttribPointer(partLocs.aType, 1, gl.FLOAT, false, pStride, 20)

        gl.uniform3f(partLocs.uCamPos, st.camX, st.camY, st.camZ)
        gl.uniform3f(partLocs.uCamAngles, yawRad, pitchRad, rollRad)
        // Correct uProjScale and uDpr bindings
        gl.uniform2f(partLocs.uProjScale, 1.0 / aspectFovX, 1.0 / aspectFovY)
        gl.uniform1f(partLocs.uDpr, dpr)
        gl.uniform1f(partLocs.uTime, elapsed)

        gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT)
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (gl) {
        gl.deleteProgram(rayProg)
        gl.deleteProgram(partProg)
        gl.deleteTexture(texCliff)
        gl.deleteTexture(texCavern)
        gl.deleteBuffer(quadBuffer)
        gl.deleteBuffer(partBuffer)
      }
    }
  }, [onMetricsUpdate])

  // Update target camera based on scroll progress
  useEffect(() => {
    const totalActs = ACTS.length
    const actFloat = progress * (totalActs - 1)
    const actIdx = Math.max(0, Math.min(totalActs - 1, Math.floor(actFloat)))
    const actLocal = actFloat - actIdx
    const act = ACTS[actIdx]
    const momentIdx = actLocal < 0.46 ? 0 : 1
    const moment = act.moments[momentIdx] || act.moments[0]

    const st = stateRef.current
    st.targetCamX = moment.camX
    st.targetCamY = moment.camY
    st.targetCamZ = moment.camZ
    st.targetCamYaw = moment.camYaw
    st.targetCamPitch = moment.camPitch
    st.targetCamRoll = moment.camRoll
    st.currentTrap = act.trapTheme ? 1.0 : 0.0
  }, [progress])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        id="canvas-3d-world"
        className="w-full h-full block"
        style={{
          transform: 'translateZ(0)',
          imageRendering: 'auto'
        }}
      />
    </div>
  )
}

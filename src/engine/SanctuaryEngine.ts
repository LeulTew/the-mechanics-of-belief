import { ACTS, beatAt } from '../data/acts.ts'
import { SHRINES } from '../data/shrines.ts'
import { RAY_VS, RAY_FS, PART_VS, PART_FS } from './shaders.ts'

// One render loop drives everything that moves every frame: the raymarched
// world, the CSS3D relic layer, the timeline bar and the scroll spring.
// React only hears about it when the act or beat changes.

export interface EngineElements {
  viewport: HTMLElement
  canvas: HTMLCanvasElement
  rig: HTMLElement
  world: HTMLElement
  shrines: HTMLElement[]
  progressBar: HTMLElement
}

export interface EngineOptions {
  onBeat: (act: number, beat: number) => void
  reducedMotion: boolean
}

const PERSPECTIVE = 1100
const PERSPECTIVE_MACRO = 1450
const MACRO_DOLLY = 165
const PARTICLE_COUNT = 820

const DPR_CAP = 1.5
const SCALE_MIN = 0.5
const FRAME_BUDGET = 1 / 50

type Locs = Record<string, WebGLUniformLocation | null>

export class SanctuaryEngine {
  private el: EngineElements
  private opts: EngineOptions
  private gl: WebGLRenderingContext | null = null
  private ray: WebGLProgram | null = null
  private part: WebGLProgram | null = null
  private rayU: Locs = {}
  private partU: Locs = {}
  private rayA = -1
  private partA = { pos: -1, phase: -1, speed: -1, type: -1 }
  private quad: WebGLBuffer | null = null
  private particles: WebGLBuffer | null = null
  private texCliff: WebGLTexture | null = null
  private texCavern: WebGLTexture | null = null

  private raf = 0
  private disposed = false
  private last = 0
  private elapsed = 0
  private paused = false
  private hidden = false

  // Resolution scale adapts to keep frames under budget; decisions are
  // spaced in time, not frames, so a slow device reacts within a second.
  private renderScale = 1
  private frameAvg = FRAME_BUDGET
  private nextScaleCheck = 0

  private scroll = { target: 0, value: 0, velocity: 0 }
  private beat = { act: -1, beat: -1 }
  private cam = { x: -15, y: -12, z: 240, yaw: -7, pitch: -1, roll: 0 }
  private camTarget = { ...this.cam }
  private pointer = { x: 0, y: 0, sx: 0, sy: 0, fine: false }
  private look = { yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0 }
  private drag = { active: false, id: -1, startX: 0, startY: 0 }
  private walk = { x: 0, z: 0 }
  private vellum = false
  private macro = false
  private trap = false

  constructor(el: EngineElements, opts: EngineOptions) {
    this.el = el
    this.opts = opts
    this.initGL()
    this.bind()
    this.readScroll()
    this.scroll.value = this.scroll.target
    this.applyBeat(true)
    this.cam = { ...this.camTarget }
    this.raf = requestAnimationFrame(this.tick)
  }

  setVellum(on: boolean) { this.vellum = on }
  setPaused(on: boolean) { this.paused = on }

  setMacro(on: boolean) {
    this.macro = on
  }

  // Focal length in CSS px; portrait screens get a wider lens so relics fit across.
  private focal() {
    return (this.macro ? PERSPECTIVE_MACRO : PERSPECTIVE) * (this.portrait ? 0.62 : 1)
  }

  resetView() {
    this.look.targetYaw = 0
    this.look.targetPitch = 0
    this.walk.x = 0
    this.walk.z = 0
  }

  /** Jump straight to the scroll target. Used for deep links and tests. */
  snap() {
    this.readScroll()
    this.scroll.value = this.scroll.target
    this.scroll.velocity = 0
    this.applyBeat(false)
    const t = this.camTarget
    this.cam = { x: t.x + this.walk.x, y: t.y, z: t.z + this.walk.z - (this.macro ? MACRO_DOLLY : 0), yaw: t.yaw, pitch: t.pitch, roll: t.roll }
  }

  /** Render n frames back to back and return the mean GPU+CPU time in ms. */
  benchmark(n = 30) {
    const gl = this.gl
    if (!gl) return -1
    this.draw()
    gl.finish()
    const t0 = performance.now()
    for (let i = 0; i < n; i++) this.draw()
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4))
    return (performance.now() - t0) / n
  }

  destroy() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.unbind()
    const gl = this.gl
    if (gl) {
      gl.deleteProgram(this.ray)
      gl.deleteProgram(this.part)
      gl.deleteBuffer(this.quad)
      gl.deleteBuffer(this.particles)
      gl.deleteTexture(this.texCliff)
      gl.deleteTexture(this.texCavern)
    }
  }

  // ---------------------------------------------------------------- input

  private onScroll = () => this.readScroll()

  private readScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    this.scroll.target = Math.min(1, Math.max(0, window.scrollY / max))
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    if ((e.target as Element).closest('button, a, #story-super')) return
    this.drag.active = true
    this.drag.id = e.pointerId
    this.drag.startX = e.clientX - this.look.targetYaw * 5
    this.drag.startY = e.clientY - this.look.targetPitch * 5
    this.el.viewport.classList.add('is-dragging')
  }

  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    this.pointer.fine = true
    this.pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
    this.pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
    if (this.drag.active && e.pointerId === this.drag.id) {
      this.look.targetYaw = clamp((e.clientX - this.drag.startX) / 5, -75, 75)
      this.look.targetPitch = clamp((e.clientY - this.drag.startY) / 5, -40, 40)
    }
  }

  private onPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== this.drag.id) return
    this.drag.active = false
    this.drag.id = -1
    this.el.viewport.classList.remove('is-dragging')
  }

  private onKey = (e: KeyboardEvent) => {
    if (this.paused || e.metaKey || e.ctrlKey || e.altKey) return
    const t = e.target as HTMLElement | null
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
    const k = e.key.toLowerCase()
    if (k === 'w') this.walk.z -= 90
    else if (k === 's') this.walk.z += 90
    else if (k === 'a') this.walk.x -= 65
    else if (k === 'd') this.walk.x += 65
  }

  private onVisibility = () => {
    this.hidden = document.hidden
    this.last = performance.now()
  }

  private onResize = () => {
    this.readScroll()
    this.applyBeat(true)
  }

  private bind() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize)
    this.el.viewport.addEventListener('pointerdown', this.onPointerDown)
    window.addEventListener('pointermove', this.onPointerMove, { passive: true })
    window.addEventListener('pointerup', this.onPointerUp)
    window.addEventListener('pointercancel', this.onPointerUp)
    window.addEventListener('keydown', this.onKey)
    document.addEventListener('visibilitychange', this.onVisibility)
  }

  private unbind() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
    this.el.viewport.removeEventListener('pointerdown', this.onPointerDown)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.onPointerUp)
    window.removeEventListener('pointercancel', this.onPointerUp)
    window.removeEventListener('keydown', this.onKey)
    document.removeEventListener('visibilitychange', this.onVisibility)
  }

  // ---------------------------------------------------------------- frame

  private tick = (now: number) => {
    this.raf = requestAnimationFrame(this.tick)
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 1 / 60
    this.last = now
    if (this.hidden) return
    this.elapsed += dt

    this.stepScroll(dt)
    this.applyBeat(false)
    this.stepCamera(dt)
    this.placeShrines()

    if (!this.paused) {
      this.adaptResolution(now, dt)
      this.draw()
    }
  }

  private stepScroll(dt: number) {
    const s = this.scroll
    if (this.opts.reducedMotion) {
      s.value = s.target
    } else {
      // Critically damped-ish spring: smooth, no overshoot on short hops.
      s.velocity += (-110 * (s.value - s.target) - 20 * s.velocity) * dt
      s.value += s.velocity * dt
    }
    const p = clamp(s.value, 0, 1)
    this.el.progressBar.style.transform = `scaleX(${Math.max(0.015, p).toFixed(4)})`
  }

  private portrait = false

  private applyBeat(initial: boolean) {
    const { act, beat } = beatAt(this.scroll.value)
    const portrait = window.innerWidth / window.innerHeight < 0.85
    if (!initial && act === this.beat.act && beat === this.beat.beat && portrait === this.portrait) return
    this.beat = { act, beat }
    this.portrait = portrait
    const c = ACTS[act].beats[beat].cam
    this.camTarget = { ...c }
    if (portrait) {
      // Phones: copy sits on top, so swing toward the act's relic and look slightly
      // up to set it in the lower half of the frame.
      const s = SHRINES[act]
      this.camTarget.x = c.x + (s.x - c.x) * 0.85
      this.camTarget.yaw = c.yaw * 0.25
      this.camTarget.pitch = c.pitch + 6
    }
    this.trap = ACTS[act].trap
    this.walk.x *= 0.25
    this.walk.z *= 0.25
    this.opts.onBeat(act, beat)
  }

  private stepCamera(dt: number) {
    const rm = this.opts.reducedMotion
    // Frame-rate independent versions of the original per-frame lerps.
    const k = rm ? 1 : 1 - Math.pow(1 - 0.058, dt * 60)
    const kp = 1 - Math.pow(1 - 0.08, dt * 60)
    const kl = 1 - Math.pow(1 - 0.1, dt * 60)

    const ptr = this.pointer
    const parallax = ptr.fine && !rm ? 1 : 0
    ptr.sx += (ptr.x * parallax - ptr.sx) * kp
    ptr.sy += (ptr.y * parallax - ptr.sy) * kp
    this.look.yaw += (this.look.targetYaw - this.look.yaw) * kl
    this.look.pitch += (this.look.targetPitch - this.look.pitch) * kl

    const t = this.camTarget
    const c = this.cam
    c.x += (t.x + this.walk.x - c.x) * k
    c.y += (t.y - c.y) * k
    c.z += (t.z + this.walk.z - (this.macro ? MACRO_DOLLY : 0) - c.z) * k
    c.yaw += (t.yaw - c.yaw) * k
    c.pitch += (t.pitch - c.pitch) * k
    c.roll += (t.roll - c.roll) * k

    const yaw = c.yaw - ptr.sx * 8 - this.look.yaw
    const pitch = c.pitch - ptr.sy * 6 + this.look.pitch
    const persp = this.focal()
    if (persp !== this.view.persp) this.el.viewport.style.perspective = `${persp}px`

    // CSS3D is y-down with z toward the viewer, so these signs mirror the raymarcher's.
    this.el.rig.style.transform =
      `translateZ(${persp}px) rotateZ(${(-c.roll).toFixed(3)}deg) ` +
      `rotateX(${pitch.toFixed(3)}deg) rotateY(${yaw.toFixed(3)}deg)`
    this.el.world.style.transform =
      `translate3d(${(-c.x).toFixed(2)}px, ${(-c.y).toFixed(2)}px, ${(-c.z).toFixed(2)}px)`

    this.view = { yaw: rad(yaw), pitch: rad(pitch), roll: rad(c.roll), persp }
  }

  private view = { yaw: 0, pitch: 0, roll: 0, persp: PERSPECTIVE }

  private placeShrines() {
    const bob = this.opts.reducedMotion ? 0 : Math.sin(this.elapsed * 1.35) * 4
    const c = this.cam
    for (let i = 0; i < SHRINES.length; i++) {
      const s = SHRINES[i]
      const node = this.el.shrines[i]
      if (!node) continue
      const dx = s.x - c.x
      const dy = s.y - c.y
      const dz = s.z - c.z
      const dist = Math.hypot(dx, dy, dz)
      if (dist > 2900 || dz > 260) {
        if (node.style.visibility !== 'hidden') node.style.visibility = 'hidden'
        continue
      }
      node.style.visibility = 'visible'
      // Sink into the dark the way the raymarched fog does; only fade out at the far edge
      // so distant relics read as solid objects in shadow, not translucent ghosts.
      const light = dist < 700 ? 1 : Math.max(0.12, Math.exp(-(dist - 700) * 0.0011))
      const fade = clamp(1 - (dist - 2300) / 600, 0, 1)
      node.style.opacity = fade.toFixed(3)
      node.style.filter = light < 0.995 ? `brightness(${light.toFixed(3)})` : ''
      node.style.transform =
        `translate3d(${s.x}px, ${(s.y + bob).toFixed(2)}px, ${s.z}px) rotateY(${s.rotY}deg)`
    }
  }

  // ---------------------------------------------------------------- WebGL

  private adaptResolution(now: number, dt: number) {
    const gl = this.gl
    if (!gl) return
    this.frameAvg += (dt - this.frameAvg) * 0.1
    if (now >= this.nextScaleCheck) {
      if (this.frameAvg > FRAME_BUDGET * 1.12 && this.renderScale > SCALE_MIN) {
        this.renderScale = Math.max(SCALE_MIN, this.renderScale - 0.1)
        this.nextScaleCheck = now + 500
      } else if (this.frameAvg < FRAME_BUDGET * 0.7 && this.renderScale < 1) {
        this.renderScale = Math.min(1, this.renderScale + 0.05)
        this.nextScaleCheck = now + 2500
      }
    }
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP) * this.renderScale
    const w = Math.max(1, Math.round(window.innerWidth * dpr))
    const h = Math.max(1, Math.round(window.innerHeight * dpr))
    const canvas = this.el.canvas
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }
  }

  private draw() {
    const gl = this.gl
    if (!gl || !this.ray) return
    const { yaw, pitch, roll, persp } = this.view
    const c = this.cam
    const cw = window.innerWidth
    const ch = window.innerHeight

    gl.disable(gl.BLEND)
    gl.useProgram(this.ray)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texCliff)
    gl.uniform1i(this.rayU.uTexCliff, 0)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.texCavern)
    gl.uniform1i(this.rayU.uTexCavern, 1)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad)
    gl.enableVertexAttribArray(this.rayA)
    gl.vertexAttribPointer(this.rayA, 2, gl.FLOAT, false, 0, 0)
    gl.uniform3f(this.rayU.uCamPos, c.x, -c.y, c.z)
    gl.uniform3f(this.rayU.uCamAngles, yaw, pitch, roll)
    gl.uniform2f(this.rayU.uAspectFov, (cw * 0.5) / persp, (ch * 0.5) / persp)
    gl.uniform1f(this.rayU.uTime, this.elapsed)
    gl.uniform1f(this.rayU.uVellum, this.vellum ? 1 : 0)
    gl.uniform1f(this.rayU.uTrap, this.trap ? 1 : 0)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    gl.disableVertexAttribArray(this.rayA)

    if (!this.part) return
    const a = this.partA
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.useProgram(this.part)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.particles)
    const stride = 24
    gl.enableVertexAttribArray(a.pos)
    gl.vertexAttribPointer(a.pos, 3, gl.FLOAT, false, stride, 0)
    gl.enableVertexAttribArray(a.phase)
    gl.vertexAttribPointer(a.phase, 1, gl.FLOAT, false, stride, 12)
    gl.enableVertexAttribArray(a.speed)
    gl.vertexAttribPointer(a.speed, 1, gl.FLOAT, false, stride, 16)
    gl.enableVertexAttribArray(a.type)
    gl.vertexAttribPointer(a.type, 1, gl.FLOAT, false, stride, 20)
    gl.uniform3f(this.partU.uCamPos, c.x, c.y, c.z)
    gl.uniform3f(this.partU.uCamAngles, yaw, pitch, roll)
    gl.uniform2f(this.partU.uProjScale, (2 * persp) / cw, (2 * persp) / ch)
    gl.uniform1f(this.partU.uTime, this.elapsed)
    gl.uniform1f(this.partU.uDpr, this.el.canvas.width / cw)
    gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT)
    for (const loc of [a.pos, a.phase, a.speed, a.type]) gl.disableVertexAttribArray(loc)
  }

  private initGL() {
    const canvas = this.el.canvas
    const attrs: WebGLContextAttributes = { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' }
    const gl = (canvas.getContext('webgl2', attrs) || canvas.getContext('webgl', attrs)) as WebGLRenderingContext | null
    if (!gl) {
      this.el.viewport.classList.add('no-webgl')
      return
    }
    this.gl = gl
    canvas.addEventListener('webglcontextlost', (e) => e.preventDefault())

    this.ray = program(gl, RAY_VS, RAY_FS)
    this.part = program(gl, PART_VS, PART_FS)
    if (this.ray) {
      this.rayA = gl.getAttribLocation(this.ray, 'aCorner')
      this.rayU = uniforms(gl, this.ray, ['uCamPos', 'uCamAngles', 'uAspectFov', 'uTime', 'uVellum', 'uTrap', 'uTexCliff', 'uTexCavern'])
    }
    if (this.part) {
      this.partA = {
        pos: gl.getAttribLocation(this.part, 'aPos'),
        phase: gl.getAttribLocation(this.part, 'aPhase'),
        speed: gl.getAttribLocation(this.part, 'aSpeed'),
        type: gl.getAttribLocation(this.part, 'aType')
      }
      this.partU = uniforms(gl, this.part, ['uCamPos', 'uCamAngles', 'uProjScale', 'uTime', 'uDpr'])
    }

    this.quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

    // Dust outside, incense and embers inside the cave.
    const data = new Float32Array(PARTICLE_COUNT * 6)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const outside = i < 240
      data[i * 6] = (Math.random() - 0.5) * (outside ? 680 : 880)
      data[i * 6 + 1] = 285 - Math.random() * (outside ? 760 : 660)
      data[i * 6 + 2] = outside ? 550 - Math.random() * 1190 : -640 - Math.random() * 6750
      data[i * 6 + 3] = Math.random() * Math.PI * 2
      data[i * 6 + 4] = 10 + Math.random() * 22
      data[i * 6 + 5] = outside ? 0 : i % 3 === 0 ? 2 : 1
    }
    this.particles = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.particles)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    const base = import.meta.env.BASE_URL
    const alive = () => !this.disposed
    this.texCliff = texture(gl, `${base}textures/cliff.webp`, [118, 62, 46], alive)
    this.texCavern = texture(gl, `${base}textures/cavern.webp`, [68, 42, 34], alive)
  }
}

// ------------------------------------------------------------------ helpers

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

function rad(deg: number) {
  return (deg * Math.PI) / 180
}

function shader(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = shader(gl, gl.VERTEX_SHADER, vs)
  const f = shader(gl, gl.FRAGMENT_SHADER, fs)
  if (!v || !f) return null
  const p = gl.createProgram()
  if (!p) return null
  gl.attachShader(p, v)
  gl.attachShader(p, f)
  gl.linkProgram(p)
  gl.deleteShader(v)
  gl.deleteShader(f)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(p))
    return null
  }
  return p
}

function uniforms(gl: WebGLRenderingContext, p: WebGLProgram, names: string[]): Locs {
  const out: Locs = {}
  for (const n of names) out[n] = gl.getUniformLocation(p, n)
  return out
}

// Starts as a flat tone so the first frame is never black, then swaps in the photo.
function texture(gl: WebGLRenderingContext, url: string, tone: [number, number, number], alive: () => boolean) {
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([...tone, 255]))
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  const img = new Image()
  img.decoding = 'async'
  img.onload = () => {
    if (!alive() || gl.isContextLost()) return
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    const aniso =
      gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
    if (aniso) {
      const max = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number
      gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, max))
    }
  }
  img.src = url
  return tex
}

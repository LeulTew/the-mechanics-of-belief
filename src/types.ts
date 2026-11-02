// Types for The Mechanics of Belief 3D Sanctuary & Monograph

export type VisualMode = 'sanctuary' | 'cave' | 'specimen' | 'particles'
export type ZemaMode = 'geez' | 'ezel' | 'araray'
export type ThemeMode = 'sanctuary' | 'vellum'

export interface CameraState {
  x: number
  y: number
  z: number
  yaw: number
  pitch: number
  roll: number
  fov: number
}

export interface WebGLMetrics {
  fps: number
  drsResolution: number
  drawCalls: number
  triangles: number
  particleCount: number
}

export interface MomentItem {
  label: string
  headline: string
  lead: string
  textPos: string
  svgX: number
  svgY: number
  camX: number
  camY: number
  camZ: number
  camYaw: number
  camPitch: number
  camRoll: number
  motionType: string
  motionDir: string
  lobes: number
  amp: number
  gap: number
}

export interface ActItem {
  geez: string
  name: string
  trapTheme: boolean
  moments: MomentItem[]
}

export type VisualMode = 'crystal' | 'gaussian' | 'wireframe' | 'chrome'

export interface ProjectItem {
  id: string
  title: string
  subtitle: string
  category: string
  year: string
  description: string
  details: string[]
  tags: string[]
  metrics: { label: string; value: string }[]
  accentColor: string
  githubUrl?: string
  liveUrl?: string
}

export interface WebGLMetrics {
  fps: number
  drawCalls: number
  triangles: number
  particleCount: number
}

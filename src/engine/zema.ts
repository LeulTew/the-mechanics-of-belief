import { useCallback, useEffect, useRef, useState } from 'react'

// A quiet drone on a fifth (216 + 324 Hz) with a low octave underneath and a
// slow swell, so it breathes instead of humming. Built on first click only.

interface Voice {
  ctx: AudioContext
  master: GainNode
}

const LEVEL = 0.032

function build(): Voice {
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new Ctor()

  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // Swell: gain oscillates 0.5..1.0 roughly once every eight seconds.
  const swell = ctx.createGain()
  swell.gain.value = 0.75
  swell.connect(master)
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.125
  const depth = ctx.createGain()
  depth.gain.value = 0.25
  lfo.connect(depth).connect(swell.gain)
  lfo.start()

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1400
  filter.Q.value = 0.4
  filter.connect(swell)

  const partials: [OscillatorType, number, number][] = [
    ['sine', 108, 0.45],
    ['sine', 216, 1],
    ['triangle', 324, 0.55]
  ]
  for (const [type, freq, gain] of partials) {
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.value = freq
    const g = ctx.createGain()
    g.gain.value = gain
    osc.connect(g).connect(filter)
    osc.start()
  }

  return { ctx, master }
}

export function useZema() {
  const [playing, setPlaying] = useState(false)
  const voice = useRef<Voice | null>(null)
  const on = useRef(false)
  const idle = useRef(0)

  const toggle = useCallback(() => {
    try {
      if (!voice.current) voice.current = build()
      const { ctx, master } = voice.current
      if (ctx.state === 'suspended') void ctx.resume()
      on.current = !on.current
      window.clearTimeout(idle.current)
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.setTargetAtTime(on.current ? LEVEL : 0, now, on.current ? 0.6 : 0.25)
      setPlaying(on.current)
      // Once faded out, stop the clock so silent oscillators cost nothing.
      if (!on.current) idle.current = window.setTimeout(() => void ctx.suspend(), 1500)
    } catch {
      on.current = false
      setPlaying(false)
    }
  }, [])

  // Go quiet with the tab; pick back up when it returns.
  useEffect(() => {
    const onVis = () => {
      const v = voice.current
      if (!v) return
      if (document.hidden) void v.ctx.suspend()
      else if (on.current) void v.ctx.resume()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.clearTimeout(idle.current)
      void voice.current?.ctx.close()
      voice.current = null
      on.current = false
    }
  }, [])

  return { playing, toggle }
}

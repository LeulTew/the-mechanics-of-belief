import { useState, useRef, useEffect, useCallback } from 'react'
import { ZemaMode } from '../types.ts'

interface ZemaAcousticProfile {
  rootFreq: number
  modalFreqs: number[] // Modal harmonic ratios relative to root
  formant1: number     // Vowel formant F1 (Hz)
  formant2: number     // Vowel formant F2 (Hz)
  q1: number
  q2: number
}

// Ethnomusicologically calibrated Aksumite Zema modal frequencies (A=432Hz base)
const ZEMA_PROFILES: Record<ZemaMode, ZemaAcousticProfile> = {
  // Ge'ez: Foundation, majesty, open fifth & natural fourth (1, 4/3, 3/2, 2/1)
  geez: {
    rootFreq: 216,
    modalFreqs: [216 * 1.333, 216 * 1.5, 216 * 2.0],
    formant1: 620,
    formant2: 1240,
    q1: 2.8,
    q2: 2.2
  },
  // Ezel: Solemn, Great Lent, sorrowful minor 3rd & deep sub-octave (0.5, 6/5, 3/2)
  ezel: {
    rootFreq: 162,
    modalFreqs: [162 * 0.5, 162 * 1.2, 162 * 1.5],
    formant1: 380,
    formant2: 850,
    q1: 3.5,
    q2: 2.8
  },
  // Araray: Soaring, tearful contemplation, ecstatic major 3rd & tritone shimmer (1.25, 1.414, 1.875)
  araray: {
    rootFreq: 270,
    modalFreqs: [270 * 1.25, 270 * 1.414, 270 * 1.875],
    formant1: 1050,
    formant2: 2350,
    q1: 2.0,
    q2: 1.6
  }
}

export function useZemaAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMode, setCurrentMode] = useState<ZemaMode>('geez')

  const audioCtxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const droneNodesRef = useRef<{
    rootOsc: OscillatorNode
    detunedOsc: OscillatorNode
    modalOscs: OscillatorNode[]
    f1: BiquadFilterNode
    f2: BiquadFilterNode
  } | null>(null)

  // Ensure AudioContext is valid and active
  const getOrCreateContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null

    let ctx = audioCtxRef.current
    if (!ctx || ctx.state === 'closed') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtxClass) return null
      ctx = new AudioCtxClass()
      audioCtxRef.current = ctx
    }

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {
        // Handled silently until next direct user gesture
      })
    }
    return ctx
  }, [])

  // Initialize continuous drone graph
  const ensureDroneGraph = useCallback((ctx: AudioContext, modeKey: ZemaMode) => {
    if (droneNodesRef.current && masterGainRef.current) return

    const now = ctx.currentTime
    const profile = ZEMA_PROFILES[modeKey]

    // Master Gain (de-clicked)
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.0001, now)
    masterGain.connect(ctx.destination)
    masterGainRef.current = masterGain

    // Vocal Formant Filters in Parallel
    const f1 = ctx.createBiquadFilter()
    f1.type = 'bandpass'
    f1.frequency.setValueAtTime(profile.formant1, now)
    f1.Q.setValueAtTime(profile.q1, now)

    const f2 = ctx.createBiquadFilter()
    f2.type = 'bandpass'
    f2.frequency.setValueAtTime(profile.formant2, now)
    f2.Q.setValueAtTime(profile.q2, now)

    f1.connect(masterGain)
    f2.connect(masterGain)

    // Root Oscillator + Micro-Detuned Vocal Chorus Oscillator
    const rootOsc = ctx.createOscillator()
    rootOsc.type = 'triangle'
    rootOsc.frequency.setValueAtTime(profile.rootFreq, now)

    const detunedOsc = ctx.createOscillator()
    detunedOsc.type = 'sine'
    detunedOsc.frequency.setValueAtTime(profile.rootFreq, now)
    detunedOsc.detune.setValueAtTime(4.5, now) // +4.5 cents natural chorusing

    rootOsc.connect(f1)
    rootOsc.connect(f2)
    detunedOsc.connect(f1)
    detunedOsc.connect(f2)

    // Modal Harmonic Layer Oscillators
    const modalOscs = profile.modalFreqs.map((freq) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      osc.connect(f1)
      osc.connect(f2)
      osc.start(now)
      return osc
    })

    rootOsc.start(now)
    detunedOsc.start(now)

    droneNodesRef.current = { rootOsc, detunedOsc, modalOscs, f1, f2 }
  }, [])

  // Authentic Tsenatsel Bronze Sistrum Chime Synthesis
  const playSistrumChime = useCallback(() => {
    const ctx = getOrCreateContext()
    if (!ctx) return

    const now = ctx.currentTime

    // 1. Physical Bronze Collision Noise Transient
    const bufferSize = Math.floor(ctx.sampleRate * 0.035) // 35ms impact
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
    }
    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = noiseBuffer

    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'highpass'
    noiseFilter.frequency.setValueAtTime(4500, now)

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.04, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)

    // 2. Dual-Frequency True Ring-Modulated Bronze Resonance
    const carrier = ctx.createOscillator()
    const modulator = ctx.createOscillator()
    const ringGain = ctx.createGain()

    carrier.type = 'triangle'
    carrier.frequency.setValueAtTime(2850, now)

    modulator.type = 'sine'
    modulator.frequency.setValueAtTime(4030.5, now) // Inharmonic ratio ~ 1.4142

    ringGain.gain.setValueAtTime(0, now)
    modulator.connect(ringGain.gain) // Ring modulation: modulator drives carrier gain
    carrier.connect(ringGain)

    // Parallel Dual-Peak Bronze Resonators
    const resFilter1 = ctx.createBiquadFilter()
    resFilter1.type = 'bandpass'
    resFilter1.frequency.setValueAtTime(3200, now)
    resFilter1.Q.setValueAtTime(8.5, now)

    const resFilter2 = ctx.createBiquadFilter()
    resFilter2.type = 'bandpass'
    resFilter2.frequency.setValueAtTime(7400, now)
    resFilter2.Q.setValueAtTime(10.0, now)

    const chimeEnv = ctx.createGain()
    chimeEnv.gain.setValueAtTime(0.035, now)
    chimeEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.65)

    ringGain.connect(resFilter1)
    ringGain.connect(resFilter2)
    resFilter1.connect(chimeEnv)
    resFilter2.connect(chimeEnv)
    chimeEnv.connect(ctx.destination)

    // Execution & Clean Resource Disposal
    carrier.start(now)
    modulator.start(now)
    noiseSource.start(now)

    carrier.stop(now + 0.7)
    modulator.stop(now + 0.7)

    carrier.onended = () => {
      carrier.disconnect()
      modulator.disconnect()
      ringGain.disconnect()
      resFilter1.disconnect()
      resFilter2.disconnect()
      chimeEnv.disconnect()
      noiseSource.disconnect()
      noiseFilter.disconnect()
      noiseGain.disconnect()
    }
  }, [getOrCreateContext])

  // Seamless, Click-Free Soundscape Toggle
  const togglePlay = useCallback(() => {
    const ctx = getOrCreateContext()
    if (!ctx) return

    ensureDroneGraph(ctx, currentMode)
    const masterGain = masterGainRef.current
    if (!masterGain) return

    const now = ctx.currentTime
    const nextState = !isPlaying
    setIsPlaying(nextState)

    // Robust de-clicking via cancelAndHoldAtTime or cancelScheduledValues
    const gainParam = masterGain.gain as AudioParam & { cancelAndHoldAtTime?: (time: number) => AudioParam }
    if (typeof gainParam.cancelAndHoldAtTime === 'function') {
      gainParam.cancelAndHoldAtTime(now)
    } else {
      masterGain.gain.cancelScheduledValues(now)
    }

    if (nextState) {
      masterGain.gain.setTargetAtTime(0.038, now, 0.08)
      playSistrumChime()
    } else {
      masterGain.gain.setTargetAtTime(0.0001, now, 0.06)
    }
  }, [getOrCreateContext, ensureDroneGraph, currentMode, isPlaying, playSistrumChime])

  // Smooth Mode Gliding (Portamento & Formant Morphing)
  const setMode = useCallback(
    (mode: ZemaMode) => {
      setCurrentMode(mode)
      const ctx = audioCtxRef.current
      const nodes = droneNodesRef.current
      if (!ctx || !nodes || ctx.state === 'closed') return

      const now = ctx.currentTime
      const profile = ZEMA_PROFILES[mode]

      nodes.rootOsc.frequency.setTargetAtTime(profile.rootFreq, now, 0.35)
      nodes.detunedOsc.frequency.setTargetAtTime(profile.rootFreq, now, 0.35)

      nodes.modalOscs.forEach((osc, idx) => {
        const targetFreq = profile.modalFreqs[idx] ?? profile.rootFreq
        osc.frequency.setTargetAtTime(targetFreq, now, 0.35)
      })

      nodes.f1.frequency.setTargetAtTime(profile.formant1, now, 0.35)
      nodes.f1.Q.setTargetAtTime(profile.q1, now, 0.35)
      nodes.f2.frequency.setTargetAtTime(profile.formant2, now, 0.35)
      nodes.f2.Q.setTargetAtTime(profile.q2, now, 0.35)

      if (isPlaying) {
        playSistrumChime()
      }
    },
    [isPlaying, playSistrumChime]
  )

  // Complete Lifecycle Teardown & React 18 StrictMode Safety
  useEffect(() => {
    return () => {
      if (droneNodesRef.current) {
        try {
          droneNodesRef.current.rootOsc.stop()
          droneNodesRef.current.detunedOsc.stop()
          droneNodesRef.current.modalOscs.forEach((o) => o.stop())
          droneNodesRef.current.rootOsc.disconnect()
          droneNodesRef.current.detunedOsc.disconnect()
          droneNodesRef.current.modalOscs.forEach((o) => o.disconnect())
          droneNodesRef.current.f1.disconnect()
          droneNodesRef.current.f2.disconnect()
        } catch {}
        droneNodesRef.current = null
      }

      if (masterGainRef.current) {
        try {
          masterGainRef.current.disconnect()
        } catch {}
        masterGainRef.current = null
      }

      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {})
      }
      audioCtxRef.current = null // Crucial: clear ref to prevent React 18 closed-context deadlocks
    }
  }, [])

  return {
    isPlaying,
    currentMode,
    togglePlay,
    setMode,
    playSistrumChime
  }
}

import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'

interface SplitTextProps {
  children: string
  className?: string
  staggerDelay?: number
  duration?: number
}

export const SplitText: React.FC<SplitTextProps> = ({
  children,
  className = '',
  staggerDelay = 0.03,
  duration = 0.8
}) => {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const chars = containerRef.current.querySelectorAll('.split-char')
    gsap.fromTo(
      chars,
      { y: 30, opacity: 0, rotateX: -45 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: staggerDelay,
        duration: duration,
        ease: 'power3.out'
      }
    )
  }, [children, staggerDelay, duration])

  return (
    <span ref={containerRef} className={`split-text-root ${className}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="split-visual-wrapper">
        {children.split('').map((char, index) => (
          <span
            key={index}
            className="split-char inline-block will-change-transform"
            style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </span>
  )
}

interface ScrambleTextProps {
  text: string
  className?: string
  duration?: number
  scrambleChars?: string
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  duration = 1000,
  scrambleChars = '0123456789ABCDEF!<>-_\\/[]{}—=+*^?#________'
}) => {
  const [displayText, setDisplayText] = useState(text)
  const isHoveredRef = useRef(false)

  const triggerScramble = () => {
    if (isHoveredRef.current) return
    isHoveredRef.current = true
    const startTime = performance.now()
    const length = text.length

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const scrambled = text
        .split('')
        .map((char, i) => {
          if (char === ' ' || char === ':' || char === '[' || char === ']') return char
          if (i / length < progress) return text[i]
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        })
        .join('')

      setDisplayText(scrambled)

      if (progress >= 1) {
        clearInterval(interval)
        setDisplayText(text)
        isHoveredRef.current = false
      }
    }, 35)
  }

  useEffect(() => {
    triggerScramble()
  }, [text])

  return (
    <span
      className={`font-mono inline-block cursor-default select-none ${className}`}
      onMouseEnter={triggerScramble}
      title="Interactive cipher"
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{displayText}</span>
    </span>
  )
}

interface ScrollRevealProps {
  children: string
  className?: string
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = '' }) => {
  const words = children.split(' ')

  return (
    <p className={`scroll-reveal-text ${className}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className="reveal-word inline-block mr-1.5 transition-opacity duration-300">
            {word}
          </span>
        ))}
      </span>
    </p>
  )
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const GlitchText = ({
  text,
  className = '',
  glitchOnHover = true,
  glitchInterval = 3000,
  intensity = 'medium' // low, medium, high
}) => {
  const [isGlitching, setIsGlitching] = useState(false)
  const [randomChars, setRandomChars] = useState('')
  const intervalRef = useRef(null)

  // Generate random glitch characters
  const generateRandomChars = useCallback(() => {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'
    let result = ''
    for (let i = 0; i < text.length; i++) {
      result += Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : text[i]
    }
    return result
  }, [text])

  useEffect(() => {
    if (glitchOnHover) return

    const triggerGlitch = () => {
      setIsGlitching(true)
      // Multiple glitch pulses during active state
      let pulseCount = 0
      const maxPulses = 3 + Math.floor(Math.random() * 3)

      const pulseInterval = setInterval(() => {
        setRandomChars(generateRandomChars())
        pulseCount++
        if (pulseCount >= maxPulses) {
          clearInterval(pulseInterval)
          setIsGlitching(false)
          setRandomChars('')
        }
      }, 50 + Math.random() * 100)
    }

    intervalRef.current = setInterval(() => {
      triggerGlitch()
    }, glitchInterval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [glitchOnHover, glitchInterval, generateRandomChars])

  const glitchIntensity = {
    low: { translate: 3, skew: 3 },
    medium: { translate: 6, skew: 8 },
    high: { translate: 12, skew: 15 }
  }

  const { translate, skew } = glitchIntensity[intensity]

  // Generate random clip paths for more chaotic effect
  const getRandomClipPath = () => {
    const sections = 3 + Math.floor(Math.random() * 4)
    let clipPath = 'inset('
    for (let i = 0; i < sections; i++) {
      const top = Math.random() * 80
      const bottom = top + 10 + Math.random() * 30
      clipPath += `${top}% 0 ${100 - bottom}% 0`
      if (i < sections - 1) clipPath += ', '
    }
    clipPath += ')'
    return clipPath
  }

  return (
    <motion.span
      className={`glitch-text ${className}`}
      onMouseEnter={() => {
        if (glitchOnHover) {
          setIsGlitching(true)
          // Trigger character scramble on hover
          let scrambleCount = 0
          const scrambleInterval = setInterval(() => {
            setRandomChars(generateRandomChars())
            scrambleCount++
            if (scrambleCount > 8) {
              clearInterval(scrambleInterval)
              setRandomChars('')
            }
          }, 40)
        }
      }}
      onMouseLeave={() => glitchOnHover && setIsGlitching(false)}
      animate={isGlitching ? {
        x: [
          0,
          -translate * 1.5,
          translate * 1.2,
          -translate * 0.8,
          translate * 1.1,
          -translate * 0.5,
          0
        ],
        skewX: [
          0,
          skew,
          -skew * 0.8,
          skew * 0.6,
          -skew * 0.4,
          0
        ],
        opacity: [
          1,
          0.7,
          1,
          0.8,
          1,
          0.9,
          1
        ]
      } : {}}
      transition={{
        duration: 0.4,
        ease: 'steps(8)'
      }}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: glitchOnHover ? 'pointer' : 'default'
      }}
    >
      {/* Random character layer - appears during glitch */}
      {randomChars && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            color: '#00ff00',
            opacity: 0.8,
            pointerEvents: 'none',
            fontWeight: 'bold',
            textShadow: '2px 0 #ff0000, -2px 0 #00ffff'
          }}
          aria-hidden="true"
        >
          {randomChars}
        </span>
      )}

      {text}

      {/* Primary glitch layer - Cyan offset (top) */}
      {isGlitching && (
        <>
          <span
            className="glitch-layer glitch-layer-1"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: '#00ffff',
              clipPath: getRandomClipPath(),
              transform: `translate(-${translate}px, -2px)`,
              opacity: 0.9,
              pointerEvents: 'none',
              textShadow: '3px 0 rgba(0, 255, 255, 0.5)'
            }}
          >
            {text}
          </span>
          <span
            className="glitch-layer glitch-layer-2"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: '#ff0000',
              clipPath: getRandomClipPath(),
              transform: `translate(${translate}px, 2px)`,
              opacity: 0.9,
              pointerEvents: 'none',
              textShadow: '-3px 0 rgba(255, 0, 0, 0.5)'
            }}
          >
            {text}
          </span>
          {/* Purple/magenta tertiary layer */}
          <span
            className="glitch-layer glitch-layer-3"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: '#ff00ff',
              clipPath: `inset(${Math.random() * 50}% 0 ${Math.random() * 50}% 0)`,
              transform: `translate(${Math.random() > 0.5 ? translate : -translate}px)`,
              opacity: 0.7,
              pointerEvents: 'none',
              mixBlendMode: 'difference'
            }}
          >
            {text}
          </span>
          {/* Scanline interference */}
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)',
              pointerEvents: 'none',
              opacity: 0.3
            }}
          />
        </>
      )}
    </motion.span>
  )
}

export default GlitchText

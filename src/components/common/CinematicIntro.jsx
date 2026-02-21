import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

// Flickering light component
const FlickeringLight = ({ onFlickerComplete }) => {
  const lightRef = useRef(null)
  const onFlickerCompleteRef = useRef(onFlickerComplete)
  const hasCompletedRef = useRef(false)

  // Keep ref updated
  useEffect(() => {
    onFlickerCompleteRef.current = onFlickerComplete
  }, [onFlickerComplete])

  useEffect(() => {
    const element = lightRef.current
    if (!element) return

    let elapsed = 0
    const totalDuration = 500 // 0.5 seconds for faster intro
    let animationFrame

    const animate = () => {
      elapsed += 16 // roughly 60fps

      // Create flickering effect
      const progress = elapsed / totalDuration
      let opacity

      if (progress < 0.3) {
        // Initial fade in
        opacity = progress * 3.3 * 0.4
      } else if (progress < 0.7) {
        // Flickering phase
        opacity = 0.3 + Math.random() * 0.4
      } else {
        // Final stable state
        opacity = 0.6 + (progress - 0.7) * 3.3 * 0.2
      }

      element.style.opacity = Math.min(opacity, 0.8)

      if (elapsed < totalDuration) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        // Animation complete
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true
          onFlickerCompleteRef.current()
        }
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div
      ref={lightRef}
      style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '400px',
        background: 'radial-gradient(ellipse at top, rgba(254, 243, 199, 0.15) 0%, rgba(254, 240, 138, 0.05) 40%, transparent 70%)',
        clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
        pointerEvents: 'none',
        opacity: 0
      }}
    />
  )
}

// Typewriter text component
const TypewriterText = ({ text, onComplete }) => {
  const containerRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  // Keep ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const chars = text.split('')
    containerRef.current.innerHTML = ''

    chars.forEach((char, _index) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      span.style.transform = 'translateY(10px)'
      containerRef.current.appendChild(span)
    })

    const spans = containerRef.current.querySelectorAll('span')

    gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.05,
      stagger: 0.08,
      ease: 'power2.out',
      onComplete: () => onCompleteRef.current && onCompleteRef.current()
    })

    return () => {
      gsap.killTweensOf(spans)
    }
  }, [text])

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 'clamp(1.2rem, 4vw, 2rem)',
        color: '#dc2626',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.4)',
        letterSpacing: '0.1em',
        padding: '0 20px'
      }}
    />
  )
}

// VHS Glitch overlay component - optimized
const VHSGlitchOverlay = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Scanlines - static */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.05) 2px, rgba(0, 0, 0, 0.05) 4px)',
          opacity: 0.3
        }}
      />

      {/* Subtle flicker */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.02) 50%)',
          backgroundSize: '100% 4px',
          animation: 'vhsFlicker 0.2s infinite',
          willChange: 'opacity'
        }}
      />

      <style>{`
        @keyframes vhsFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.98; }
        }
      `}</style>
    </div>
  )
}

// Main Cinematic Intro component
const CinematicIntro = ({ onComplete }) => {
  const [stage, setStage] = useState(0) // 0: initial, 1: light flicker, 2: rain, 3: text, 4: done
  const [showIntro, setShowIntro] = useState(true)
  const [userInteracted, setUserInteracted] = useState(false)
  const [rainDrops, setRainDrops] = useState([])
  const rainAudioRef = useRef(null)
  const backgroundAudioRef = useRef(null)

  // Generate rain drops once on mount
  useEffect(() => {
    const drops = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      duration: 1 + Math.random() * 2,
      delay: Math.random() * 2
    }))
    setRainDrops(drops)
  }, [])

  // Handle user interaction to start/unlock audio
  const handleUserInteraction = useCallback(() => {
    if (!userInteracted) {
      setUserInteracted(true)

      // Start rain audio
      if (rainAudioRef.current) {
        rainAudioRef.current.volume = 0.3
        rainAudioRef.current.play().catch(() => { })
      }

      // Start background audio after short delay
      setTimeout(() => {
        if (backgroundAudioRef.current) {
          backgroundAudioRef.current.volume = 0.2
          backgroundAudioRef.current.play().catch(() => { })
        }
      }, 2000)
    }
  }, [userInteracted])

  useEffect(() => {
    // Start with light flicker
    const lightTimer = setTimeout(() => {
      setStage(1)
    }, 100)

    // Auto-advance after flicker
    const flickerCompleteTimer = setTimeout(() => {
      setStage(2)
    }, 800)

    // Auto-complete intro (total ~2 seconds)
    const introCompleteTimer = setTimeout(() => {
      setShowIntro(false)
      onComplete && onComplete()
    }, 2000)

    return () => {
      clearTimeout(lightTimer)
      clearTimeout(flickerCompleteTimer)
      clearTimeout(introCompleteTimer)
    }
  }, [onComplete])

  if (!showIntro) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#0a0a0a',
        zIndex: 10001,
        overflow: 'hidden'
      }}
      onClick={handleUserInteraction}
      onKeyDown={handleUserInteraction}
    >
      {/* VHS Glitch overlay - runs throughout */}
      <VHSGlitchOverlay />
    </motion.div>
  )
}

export default CinematicIntro


import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useTransitionAnimations from '../../hooks/useTransitionAnimations'

// Import luxury easing system for premium page transitions
import {
  ELEGANT_ENTER,
  PREMIUM_EXIT,
  SILK_SMOOTH,
  LUXURY_SNAP,
  TIMING
} from '../../utils/luxuryEasing'

// Pre-defined particle data for deterministic rendering (reduced for performance)
const TRANSITION_PARTICLES = [...Array(10)].map((_, i) => ({
  id: i,
  left: (i * 10 + Math.random() * 5) % 100,
  delay: (i * 0.2) % 2,
  duration: 2.5 + (i * 0.3) % 3,
  size: i % 3 === 0 ? 'large' : i % 2 === 0 ? 'small' : 'medium'
}))

/**
 * SophisticatedPageTransition Component
 * Provides comprehensive page transitions with:
 * - Cubic-bezier easing curves
 * - Exit animations (400-800ms)
 * - Motion blur during transitions
 * - Parallax layers for depth
 * - Energy pulse synchronization
 * - Micro-polish details
 */
const SophisticatedPageTransition = ({
  children,
  location,
  className = '',
  enableParallax = true,
  enableEnergyPulse = false,
}) => {
  const {
    isTransitioning,
    parallaxOffset,
    getPageVariants,
  } = useTransitionAnimations()

  const [motionBlurActive, setMotionBlurActive] = useState(false)
  const [showEnergyPulse, setShowEnergyPulse] = useState(false)

  // Use refs to prevent race conditions and double animations
  const motionBlurTimerRef = useRef(null)
  const pulseTimerRef = useRef(null)
  const fadeTimerRef = useRef(null)
  const hasShownEnergyPulseRef = useRef(false)
  const isMountedRef = useRef(true)

  // Trigger motion blur during fast transitions
  useEffect(() => {
    if (!isMountedRef.current) return

    if (isTransitioning) {
      setMotionBlurActive(true)

      // Clear any existing timer
      if (motionBlurTimerRef.current) {
        clearTimeout(motionBlurTimerRef.current)
      }

      motionBlurTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setMotionBlurActive(false)
        }
      }, 300)
    }

    return () => {
      if (motionBlurTimerRef.current) {
        clearTimeout(motionBlurTimerRef.current)
      }
    }
  }, [isTransitioning])

  // Handle energy pulse on homepage load
  // Only trigger once on initial mount to avoid repeated animations
  useEffect(() => {
    if (!isMountedRef.current) return
    if (!enableEnergyPulse || location?.pathname !== '/') return

    // Skip if we've already shown the pulse
    if (hasShownEnergyPulseRef.current) return
    hasShownEnergyPulseRef.current = true

    pulseTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setShowEnergyPulse(true)
      }
    }, 600)

    fadeTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setShowEnergyPulse(false)
      }
    }, 3000)

    return () => {
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current)
      }
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current)
      }
    }
  }, [enableEnergyPulse, location])

  // Parallax effect on mouse move
  useEffect(() => {
    if (!enableParallax) return

    const handleMouseMove = () => {
      // Parallax tracking active
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enableParallax])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (motionBlurTimerRef.current) clearTimeout(motionBlurTimerRef.current)
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [])

  const pageVariants = getPageVariants('forward')

  return (
    <div
      className={`transition-wrapper ${className}`}
      style={{
        '--parallax-x': `${parallaxOffset.x}px`,
        '--parallax-y': `${parallaxOffset.y}px`,
        overflow: 'hidden',
      }}
    >
      {/* Energy Pulse Overlay */}
      <AnimatePresence>
        {showEnergyPulse && (
          <>
            {/* Phase 1: Scan pulse from origin */}
            <motion.div
              className="energy-pulse-origin"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212,175,55,0.8) 0%, transparent 70%)',
                zIndex: 9999,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              // Luxury entrance - smooth deceleration
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]  // PREMIUM_EXIT for smooth departure
              }}
            />

            {/* Phase 2: Expanding ripple */}
            <motion.div
              className="energy-ripple"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                border: '2px solid rgba(212,175,55,0.6)',
                zIndex: 9998,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              // Energy ripple with momentum preservation
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],  // SILK_SMOOTH
                delay: 0.2
              }}
            />

            {/* Phase 3: Full screen glow */}
            <motion.div
              className="fullscreen-glow"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, transparent 70%)',
                zIndex: 9997,
                pointerEvents: 'none',
              }}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0 }}
              // Cinematic fade with elegant ease
              transition={{
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],  // SILK_SMOOTH
                delay: 0.4
              }}
            />

            {/* Phase 4: Fade to homepage atmosphere */}
            <motion.div
              className="home-glow-fade"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0) 50%, rgba(10,10,15,0.5) 100%)',
                zIndex: 9996,
                pointerEvents: 'none',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // Atmospheric fade with silky smooth ease
              transition={{
                duration: 1.5,
                ease: [0.25, 0.46, 0.45, 0.94],  // SILK_SMOOTH
                delay: 0.8
              }}
            />

            {/* Atmospheric Fog Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showEnergyPulse ? 0.6 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9995,
                pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 20% 80%, rgba(100,100,120,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(80,60,100,0.1) 0%, transparent 40%)',
              }}
            />

            {/* Moving Fog Animation */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 9994, pointerEvents: 'none', overflow: 'hidden' }}>
              <motion.div
                initial={{ x: '-10%', opacity: 0 }}
                animate={showEnergyPulse ? { x: '10%', opacity: 0.4 } : {}}
                exit={{ opacity: 0 }}
                transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: 0,
                  width: '200%',
                  height: '60%',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(80,80,100,0.08) 30%, rgba(100,80,120,0.06) 50%, rgba(80,80,100,0.08) 70%, transparent 100%)',
                  filter: 'blur(30px)',
                }}
              />
              <motion.div
                initial={{ x: '10%', opacity: 0 }}
                animate={showEnergyPulse ? { x: '-10%', opacity: 0.3 } : {}}
                exit={{ opacity: 0 }}
                transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', delay: 2 }}
                style={{
                  position: 'absolute',
                  top: '40%',
                  right: 0,
                  width: '180%',
                  height: '50%',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(60,40,80,0.06) 30%, rgba(80,60,100,0.05) 50%, rgba(60,40,80,0.06) 70%, transparent 100%)',
                  filter: 'blur(40px)',
                }}
              />
            </div>

            {/* Drifting Particles */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 9993, pointerEvents: 'none', overflow: 'hidden' }}>
              {TRANSITION_PARTICLES.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ opacity: 0, y: '110%' }}
                  animate={showEnergyPulse ? {
                    opacity: [0, 0.6, 0.3],
                    y: ['110%', '-10%'],
                    x: [0, (particle.id % 2 === 0 ? 30 : -30)]
                  } : {}}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  style={{
                    position: 'absolute',
                    left: `${particle.left}%`,
                    width: particle.size === 'large' ? 3 : particle.size === 'small' ? 1 : 2,
                    height: particle.size === 'large' ? 3 : particle.size === 'small' ? 1 : 2,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(200,200,220,0.6) 0%, transparent 70%)',
                    boxShadow: '0 0 6px rgba(200,200,220,0.4)',
                  }}
                />
              ))}
            </div>

            {/* Digital Glitch Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={showEnergyPulse ? {
                opacity: [0, 0.03, 0.01, 0.04, 0],
              } : {}}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, times: [0, 0.3, 0.5, 0.7, 1] }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9992,
                pointerEvents: 'none',
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(100,100,150,0.03) 2px, rgba(100,100,150,0.03) 4px)',
                mixBlendMode: 'overlay',
              }}
            />

            {/* Scanline Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={showEnergyPulse ? {
                opacity: [0, 0.05, 0],
                y: ['-100%', '200%'],
              } : {}}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '100px',
                zIndex: 9991,
                pointerEvents: 'none',
                background: 'linear-gradient(180deg, transparent 0%, rgba(150,150,200,0.05) 50%, transparent 100%)',
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Content with Motion Blur */}
      <div
        className={`transition-content ${motionBlurActive ? 'motion-blur-filter active' : ''}`}
        style={{ willChange: 'transform, opacity' }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={location?.pathname || 'default'}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="page-content"
            style={{
              willChange: 'transform, opacity',
              position: 'relative'
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Staggered Animation Container
 * Applies 0.1s staggered delay between each child element
 */
export const StaggeredContainer = ({
  children,
  className = '',
  staggerDelay: customStaggerDelay = 100,
  animate = true,
}) => {
  const childArray = Array.isArray(children) ? children : [children]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: customStaggerDelay / 1000,
        delayChildren: 0,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 25,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        mass: 1,
      },
    },
  }

  if (!animate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {childArray.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

/**
 * Floating UI Element
 * Fade in while floating upward with subtle lift
 */
export const FloatingUI = ({
  children,
  className = '',
  delay = 0,
  floatDistance = 30,
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: floatDistance,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay / 1000,
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

/**
 * Scale Overshoot Component
 * Professional polish with 1.03 → 1.00 scale animation
 */
export const ScaleOvershoot = ({
  children,
  className = '',
  delay = 0,
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: delay / 1000,
        ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // overshoot easing
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

/**
 * Parallax Layer Component
 * Background shifts backward with zoom out for spatial depth
 */
export const ParallaxLayer = ({
  children,
  className = '',
  depth = 'mid', // far, mid, near
}) => {
  const { getParallaxVariants } = useTransitionAnimations()
  const parallaxVariants = getParallaxVariants()

  const layerVariant = parallaxVariants[depth] || parallaxVariants.mid

  return (
    <motion.div
      className={className}
      variants={layerVariant}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  )
}

/**
 * Motion Blur Wrapper
 * Applies motion blur effect during fast transitions
 */
export const MotionBlurWrapper = ({
  children,
  className = '',
  blurAmount = 2,
}) => {
  const [isBlurred, setIsBlurred] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsBlurred(true)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return (
    <motion.div
      className={className}
      style={{
        filter: isBlurred ? `blur(${blurAmount}px)` : 'blur(0px)',
        transition: 'filter 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      {children}
    </motion.div>
  )
}

export default SophisticatedPageTransition


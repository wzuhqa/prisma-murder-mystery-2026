import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Sophisticated Transition Animation Hook
 * Provides comprehensive transition management with:
 * - Cubic-bezier easing curves
 * - Exit animations (400-800ms)
 * - Motion blur effects
 * - Parallax layers
 * - Energy pulse synchronization
 * - Micro-polish details
 */
export const useTransitionAnimations = () => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState('idle') // idle, exiting, entering, complete
  const [energyPulseActive, setEnergyPulseActive] = useState(false)
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 })
  const transitionTimeoutRef = useRef(null)
  const energyPulseTimeoutRef = useRef(null)

  // Cubic-bezier easing curves
  const easingCurves = {
    smoothDecel: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    momentum: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    softOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  }

  // Animation durations
  const durations = {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 400,
    slower: 500,
    slowest: 600,
    exitMin: 400,
    exitMax: 800,
  }

  // Stagger delay constant
  const staggerDelay = 100 // 0.1s between each element

  /**
   * Calculate staggered delay for cascading effect
   */
  const getStaggerDelay = useCallback((index) => {
    return index * staggerDelay
  }, [staggerDelay])

  /**
   * Start page exit animation
   */
  const startExit = useCallback((onComplete) => {
    setTransitionPhase('exiting')
    setIsTransitioning(true)

    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    // Exit duration between 400-800ms for optimal perception
    const exitDuration = durations.exitMax // 800ms

    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false)
      setTransitionPhase('entering')
      if (onComplete) onComplete()
    }, exitDuration)
  }, [durations.exitMax])

  /**
   * Trigger energy pulse synchronization effect
   * - Final scan pulse expands outward from origin
   * - Transforms into full-screen glow
   * - Fades into homepage lighting atmosphere
   */
  const triggerEnergyPulse = useCallback((onPulseComplete) => {
    setEnergyPulseActive(true)

    // Phase 1: Scan pulse expands (0-400ms)
    // Phase 2: Full-screen glow (400-800ms)  
    // Phase 3: Fade to homepage atmosphere (800-2000ms)

    if (energyPulseTimeoutRef.current) {
      clearTimeout(energyPulseTimeoutRef.current)
    }

    energyPulseTimeoutRef.current = setTimeout(() => {
      if (onPulseComplete) onPulseComplete()
    }, 2000)

    return () => {
      setEnergyPulseActive(false)
    }
  }, [])

  /**
   * Update parallax offset based on scroll/mouse position
   */
  const updateParallax = useCallback((x, y, depth = 'medium') => {
    const depthMultiplier = {
      far: 0.1,
      medium: 0.05,
      near: 0.02,
    }
    const multiplier = depthMultiplier[depth] || depthMultiplier.medium
    setParallaxOffset({
      x: x * multiplier,
      y: y * multiplier,
    })
  }, [])

  /**
   * Generate animation variants for Framer Motion
   */
  const getPageVariants = useCallback((direction = 'forward') => {
    return {
      initial: {
        opacity: 0,
        scale: 0.98,
        y: 20,
      },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: easingCurves.softOut,
          staggerChildren: staggerDelay / 1000,
        },
      },
      exit: {
        opacity: 1, // Keep fully visible - no vanishing
        scale: 1,
        y: 0,
        transition: {
          duration: 0.1,
          ease: easingCurves.exit,
        },
      },
    }
  }, [easingCurves, staggerDelay])

  /**
   * Get stagger children variants
   */
  const getStaggerChildren = useCallback(() => ({
    initial: {
      opacity: 0,
      y: 25,
      scale: 0.95,
    },
    animate: {
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
  }), [])

  /**
   * Get scale overshoot variant for professional polish
   */
  const getScaleOvershootVariant = useCallback(() => ({
    initial: {
      opacity: 0,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: easingCurves.overshoot,
      },
    },
  }), [easingCurves.overshoot])

  /**
   * Get float up with lift variant for UI elements
   */
  const getFloatUpVariant = useCallback(() => ({
    initial: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easingCurves.softOut,
      },
    },
  }), [easingCurves.softOut])

  /**
   * Get parallax layer variants for depth and flow
   */
  const getParallaxVariants = useCallback(() => ({
    background: {
      initial: { scale: 1 },
      animate: {
        scale: 0.92,
        transition: { duration: 0.8, ease: easingCurves.smoothDecel }
      },
    },
    far: {
      initial: { y: 0, x: 0, scale: 1 },
      animate: {
        y: 40,
        x: -10,
        scale: 0.9,
        transition: { duration: 1, ease: easingCurves.smoothDecel }
      },
    },
    mid: {
      initial: { y: 0, x: 0, scale: 1 },
      animate: {
        y: 20,
        x: -5,
        scale: 0.95,
        transition: { duration: 0.8, ease: easingCurves.smoothDecel }
      },
    },
    near: {
      initial: { y: 0, scale: 1 },
      animate: {
        y: 10,
        scale: 0.98,
        transition: { duration: 0.6, ease: easingCurves.smoothDecel }
      },
    },
  }), [easingCurves])

  /**
   * Get motion blur transition for velocity
   */
  const getMotionBlurTransition = useCallback(() => ({
    duration: 0.3,
    ease: easingCurves.momentum,
    onUpdate: (latest) => {
      // Apply motion blur effect based on velocity
      const velocity = Math.abs(latest.velocity || 0)
      const blurAmount = Math.min(velocity * 0.01, 3)
      return { filter: `blur(${blurAmount}px)` }
    },
  }), [easingCurves.momentum])

  /**
   * Clean up timeouts on unmount
   */
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
      if (energyPulseTimeoutRef.current) {
        clearTimeout(energyPulseTimeoutRef.current)
      }
    }
  }, [])

  return {
    // State
    isTransitioning,
    transitionPhase,
    energyPulseActive,
    parallaxOffset,

    // Easing curves
    easingCurves,

    // Durations
    durations,

    // Stagger
    staggerDelay,
    getStaggerDelay,

    // Methods
    startExit,
    triggerEnergyPulse,
    updateParallax,

    // Framer Motion variants
    getPageVariants,
    getStaggerChildren,
    getScaleOvershootVariant,
    getFloatUpVariant,
    getParallaxVariants,
    getMotionBlurTransition,
  }
}

export default useTransitionAnimations


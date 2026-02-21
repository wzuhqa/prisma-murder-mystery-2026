import { useCallback, useMemo } from 'react'
import {
  LUXURY_EASE,
  ELEGANT_ENTER,
  PREMIUM_EXIT,
  CINEMATIC,
  LUXURY_SNAP,
  SILK_SMOOTH,
  MOMENTUM,
  DRAMATIC,
  FORENSIC_SCAN,
  BLOOD_DRIP,
  EASING_PRESETS,
  TIMING,
  MOTION_TRANSITIONS,
  CUSTOM_CURVES
} from '../utils/luxuryEasing'

/**
 * useLuxuryEasing Hook
 * ====================
 * 
 * Provides consistent, premium easing across all animations in the application.
 * This hook ensures that every animation follows luxury design principles
 * without requiring developers to remember specific curve values.
 * 
 * WHY USE THIS HOOK:
 * - Ensures consistency across all animations
 * - Makes timing decisions automatic
 * - Provides Framer Motion ready configurations
 * - Documents animation patterns in one place
 * 
 * USAGE:
 * const { ease, duration } = useLuxuryEasing('page')
 * 
 * <motion.div
 *   initial={{ opacity: 0, y: 20 }}
 *   animate={{ opacity: 1, y: 0 }}
 *   transition={{ duration: ease.duration, ease: ease.curve }}
 * />
 */

export const useLuxuryEasing = (context = 'page') => {
  // Get preset for the requested context
  const preset = useMemo(() => {
    const easingContext = EASING_PRESETS[context]
    if (!easingContext) {
      console.warn(`Unknown context: ${context}, using 'page' preset`)
      return EASING_PRESETS.page
    }
    return easingContext
  }, [context])

  // Get the appropriate curve based on direction
  const enter = useCallback(() => preset.enter || LUXURY_EASE, [preset])
  const exit = useCallback(() => preset.exit || PREMIUM_EXIT, [preset])
  const hover = useCallback(() => preset.hover || LUXURY_SNAP, [preset])
  const active = useCallback(() => preset.active || LUXURY_SNAP, [preset])

  // Duration helpers
  const duration = useCallback((type = 'enter') => {
    if (typeof preset.duration === 'number') return preset.duration
    if (typeof preset.duration === 'object') return preset.duration[type] || TIMING.normal
    return TIMING.normal
  }, [preset])

  // Framer Motion transition object
  const transition = useCallback((type = 'enter') => {
    const motionKey = `${context}${type.charAt(0).toUpperCase() + type.slice(1)}`
    return MOTION_TRANSITIONS[motionKey] || MOTION_TRANSITIONS.pageEnter
  }, [context])

  // Stagger configuration for lists
  const stagger = useCallback((index, baseDelay = TIMING.staggerDelay) => {
    return {
      delay: index * baseDelay,
      ease: LUXURY_EASE,
      duration: 0.4
    }
  }, [])

  // Scroll reveal configuration
  const scrollReveal = useCallback((index = 0) => {
    return {
      duration: 0.8,
      delay: index * 0.1,
      ease: [0.22, 1, 0.36, 1], // ELEGANT_ENTER
      opacity: { duration: 0.5 }
    }
  }, [])

  // Return comprehensive easing API
  return {
    // Curves
    enter,
    exit,
    hover,
    active,
    
    // Preset curves (direct access)
    curve: {
      luxury: LUXURY_EASE,
      elegant: ELEGANT_ENTER,
      premium: PREMIUM_EXIT,
      cinematic: CINEMATIC,
      snap: LUXURY_SNAP,
      silk: SILK_SMOOTH,
      momentum: MOMENTUM,
      dramatic: DRAMATIC,
      forensic: FORENSIC_SCAN,
      blood: BLOOD_DRIP,
      ...CUSTOM_CURVES
    },
    
    // Duration
    duration,
    timing: TIMING,
    
    // Pre-built transitions
    transition,
    stagger,
    scrollReveal,
    
    // Context info
    context,
    preset
  }
}

/**
 * Specialized hooks for common animation patterns
 */

// Page transitions with enter/exit
export const usePageTransition = () => {
  const { enter, exit, duration, transition, stagger } = useLuxuryEasing('page')
  
  return {
    enter,
    exit,
    duration,
    transition,
    stagger,
    // Common page variants
    variants: {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      },
      exit: { 
        opacity: 0, 
        y: -10,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      }
    }
  }
}

// Modal animations
export const useModalAnimation = () => {
  const { enter, exit, duration, transition } = useLuxuryEasing('modal')
  
  return {
    enter,
    exit,
    duration,
    transition,
    variants: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }
      },
      exit: { 
        opacity: 0, 
        scale: 0.95,
        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
      }
    }
  }
}

// Micro-interactions (buttons, hovers)
export const useMicroInteraction = () => {
  const { hover, active, duration, curve } = useLuxuryEasing('micro')
  
  return {
    hover,
    active,
    duration,
    curve,
    // Button press effect
    press: {
      scale: 0.97,
      transition: { duration: 0.15, ease: LUXURY_SNAP }
    },
    // Hover effect
    hoverEffect: {
      scale: 1.02,
      transition: { duration: 0.2, ease: LUXURY_SNAP }
    }
  }
}

// Loading animations
export const useLoadingAnimation = () => {
  const { enter, duration, transition } = useLuxuryEasing('loading')
  
  return {
    enter,
    duration,
    transition,
    // Spinner rotation with momentum
    spinner: {
      rotate: { duration: 1.5, ease: "linear", repeat: Infinity }
    },
    // Pulse effect
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: { duration: 1, ease: SILK_SMOOTH, repeat: Infinity }
    }
  }
}

// List animations with stagger
export const useStaggerAnimation = () => {
  const { stagger, staggerDelay } = useLuxuryEasing('stagger')
  
  return {
    stagger,
    staggerDelay,
    // Container variants for AnimatePresence
    containerVariants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: TIMING.staggerDelay,
          delayChildren: 0.1
        }
      }
    },
    // Item variants
    itemVariants: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
      }
    }
  }
}

// Scroll-triggered animations
export const useScrollAnimation = () => {
  const { enter, exit, duration, scrollReveal } = useLuxuryEasing('scroll')
  
  return {
    enter,
    exit,
    duration,
    scrollReveal,
    // Standard scroll reveal variants
    revealVariants: {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
      }
    }
  }
}

// Special effects (blood, cinematic, etc.)
export const useSpecialEffects = () => {
  const { timing } = useLuxuryEasing('effects')
  
  return {
    blood: {
      fall: {
        y: [0, 200],
        opacity: [1, 0],
        transition: { 
          duration: 0.8, 
          ease: [0.55, 0.055, 0.675, 0.19] // BLOOD_DRIP
        }
      },
      splatter: {
        scale: [0, 1.2, 1],
        opacity: [0, 1, 1],
        transition: {
          duration: 0.4,
          ease: LUXURY_SNAP
        }
      }
    },
    cinematic: {
      fadeIn: {
        opacity: { duration: 1.2, ease: CINEMATIC },
        y: { duration: 1.2, ease: CINEMATIC }
      }
    },
    forensic: {
      scan: {
        width: [0, '100%'],
        transition: { duration: 2, ease: FORENSIC_SCAN }
      },
      reveal: {
        opacity: { duration: 0.5 },
        y: { duration: 0.5, ease: ELEGANT_ENTER }
      }
    },
    timing
  }
}

export default useLuxuryEasing


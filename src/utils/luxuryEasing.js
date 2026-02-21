/**
 * Luxury Easing System
 * ====================
 * 
 * WHY EASING IS CRITICAL FOR PREMIUM USER EXPERIENCES
 * -----------------------------------------------------
 * 
 * Easing is the secret sauce that separates amateur animations from professional,
 * luxurious interfaces. Here's why it's critical:
 * 
 * 1. PHYSICAL REALISM
 *    - Real-world objects don't move linearly; they accelerate and decelerate
 *    - A luxury car doesn't start/stop instantly - it has weight and momentum
 *    - Proper easing mimics this natural physics, creating subconscious trust
 * 
 * 2. PERCEIVED PERFORMANCE
 *    - Well-eased animations feel faster even at the same duration
 *    - Users perceive 300ms with good easing as "snappy"
 *    - Linear 300ms feels "cheap" and "robotic"
 * 
 * 3. EMOTIONAL CONNECTION
 *    - Luxury = Effortlessness
 *    - Smooth, elegant motion suggests sophistication
 *    - Janky animations create subconscious unease
 * 
 * WHY IMPROPER EASING FEELS CHEAP
 * -------------------------------
 * 
 * LINEAR (no easing):
 * - Feels robotic and mechanical
 * - Creates visual fatigue faster
 * - Suggests low budget/quality
 * - Users focus on the animation instead of content
 * 
 * OVERLY BOUNCY:
 * - Seems amateurish
 * - Distracts from functionality
 * - Feels "cheap" like cartoon animations
 * - Can cause motion sickness
 * 
 * WRONG DURATION + EASING:
 * - Too fast + easing = jarring snap
 * - Too slow + easing = sluggish, unresponsive feel
 * - Mismatch between element importance and timing
 * 
 * ========================================================================
 * 
 * LUXURY EASING CURVES - MATHEMATICAL FOUNDATION
 * ===============================================
 * 
 * Cubic-bezier curves use 4 control points (x1, y1, x2, y2):
 * - x values (0-1) represent time progression
 * - y values can exceed 0-1 for overshoot effects
 * 
 * The luxury curves below are carefully crafted for:
 * - Proper acceleration phase (ease-in)
 * - Maintained momentum (ease-out dominant)
 * - Smooth deceleration without jarring stops
 * - Natural motion that feels intentional
 */

// ============================================================================
// LUXURY BEZIER CURVES - Premium Motion Presets
// ============================================================================

/**
 * Primary luxury easing - The "Apple Effect"
 * Perfect balance of elegance and responsiveness
 * Best for: Hero elements, modal opens, primary interactions
 */
export const LUXURY_EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

/**
 * Sophisticated entrance - Elegant deceleration
 * Starts quickly, ends with refined grace
 * Best for: Page elements entering view, cards appearing
 */
export const ELEGANT_ENTER = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * Premium exit - Controlled departure
 * Maintains presence until the very end
 * Best for: Closing modals, removing elements, navigation away
 */
export const PREMIUM_EXIT = 'cubic-bezier(0.4, 0, 0.2, 1)'

/**
 * Cinematic motion - Hollywood-level polish
 * Slow build, smooth sustain, graceful exit
 * Best for: Hero sequences, dramatic reveals, loading intros
 */
export const CINEMATIC = 'cubic-bezier(0.4, 0, 0.2, 1)'

/**
 * Luxury snap - Precise with subtle weight
 * Feels premium without being slow
 * Best for: Button hovers, small interactions, toggle switches
 */
export const LUXURY_SNAP = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

/**
 * Silk smooth - Ultra-refined movement
 * Maximum elegance for minimal motion
 * Best for: Scroll-linked animations, parallax effects
 */
export const SILK_SMOOTH = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

/**
 * Momentum preserve - Physics-based feel
 * Maintains user's mental model of momentum
 * Best for: Drag interactions, swipe gestures
 */
export const MOMENTUM = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

/**
 * Dramatic reveal - Theatrical entrance
 * Builds anticipation, delivers impact
 * Best for: Major reveals, case file openings, evidence discoveries
 */
export const DRAMATIC = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * Forensic scan - Technical precision
 * Feels like sophisticated technology
 * Best for: Scanner effects, data reveals, analysis animations
 */
export const FORENSIC_SCAN = 'cubic-bezier(0.4, 0, 0.2, 1)'

/**
 * Blood drip - Organic horror feel
 * Gravity-aware, natural falling motion
 * Best for: Blood effects, liquid animations
 */
export const BLOOD_DRIP = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'

// ============================================================================
// EASING PRESETS BY ANIMATION TYPE
// ============================================================================

export const EASING_PRESETS = {
  // Page-level transitions
  page: {
    enter: ELEGANT_ENTER,
    exit: PREMIUM_EXIT,
    duration: { enter: 600, exit: 400 }
  },
  
  // Modal and overlay animations
  modal: {
    open: LUXURY_EASE,
    close: PREMIUM_EXIT,
    duration: { open: 450, close: 350 }
  },
  
  // Micro-interactions (buttons, hovers)
  micro: {
    hover: LUXURY_SNAP,
    press: LUXURY_SNAP,
    duration: { hover: 200, press: 150 }
  },
  
  // Loading states
  loading: {
    pulse: SILK_SMOOTH,
    spinner: MOMENTUM,
    reveal: ELEGANT_ENTER,
    duration: { pulse: 1000, spinner: 1500, reveal: 800 }
  },
  
  // Staggered list animations
  stagger: {
    container: ELEGANT_ENTER,
    item: LUXURY_EASE,
    duration: { container: 600, item: 400 }
  },
  
  // Scroll-triggered animations
  scroll: {
    reveal: ELEGANT_ENTER,
    hide: PREMIUM_EXIT,
    duration: { reveal: 800, hide: 600 }
  },
  
  // Special effects
  effects: {
    blood: BLOOD_DRIP,
    cinematic: CINEMATIC,
    forensic: FORENSIC_SCAN,
    dramatic: DRAMATIC
  }
}

// ============================================================================
// TIMING RECOMMENDATIONS FOR LUXURY EXPERIENCE
// ============================================================================

/**
 * Duration Guidelines (in milliseconds):
 * 
 * INSTANT (0-100ms):
 * - Cursor changes, tooltip appearance
 * - Anything faster feels like a glitch
 * 
 * FAST (150-250ms):
 * - Button hover states
 * - Toggle switches
 * - Small scale changes
 * - Feels: Responsive, premium
 * 
 * NORMAL (300-450ms):
 * - Card appearances
 * - Modal opens/closes
 * - Dropdown menus
 * - Feels: Smooth, intentional
 * 
 * SLOW (500-700ms):
 * - Page transitions
 * - Hero animations
 * - Major reveals
 * - Feels: Dramatic, cinematic
 * 
 * EXTRA SLOW (800-1200ms):
 * - Full-page reveals
 * - Dramatic sequences
 * - Loading experiences
 * - Feels: Luxurious, special
 * 
 * CRITICAL RULE:
 * - Duration must match animation importance
 * - More important = slightly slower (but never slow!)
 * - Micro-interactions MUST be fast
 * - Overly slow animations feel like the app is broken
 */

export const TIMING = {
  instant: 100,
  fast: 200,
  normal: 350,
  slow: 500,
  slower: 700,
  slowest: 1000,
  
  // Specialized timings
  pageTransition: { enter: 600, exit: 400 },
  modalTransition: { open: 450, close: 350 },
  staggerDelay: 80,
  minimumVisible: 150 // Minimum time before animation completes
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get easing curve for specific animation context
 */
export const getEasingForContext = (context) => {
  const presets = EASING_PRESETS[context]
  if (!presets) {
    console.warn(`Unknown easing context: ${context}, falling back to LUXURY_EASE`)
    return LUXURY_EASE
  }
  return presets.enter || presets
}

/**
 * Get duration for specific animation context
 */
export const getDurationForContext = (context) => {
  const presets = EASING_PRESETS[context]
  if (!presets) return TIMING.normal
  return presets.duration || TIMING.normal
}

/**
 * Create custom bezier curve
 * @param {number} x1 - Control point 1 x (0-1)
 * @param {number} y1 - Control point 1 y (can exceed bounds for overshoot)
 * @param {number} x2 - Control point 2 x (0-1)
 * @param {number} y2 - Control point 2 y (can exceed bounds for overshoot)
 */
export const createCustomBezier = (x1, y1, x2, y2) => {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`
}

/**
 * Pre-defined custom curves for special effects
 */
export const CUSTOM_CURVES = {
  // Overshoot for emphasis (slight bounce)
  gentleOvershoot: createCustomBezier(0.34, 1.56, 0.64, 1),
  
  // Deep ease-in for mysterious feel
  mysterious: createCustomBezier(0.42, 0, 0.58, 1),
  
  // Exponential ease for dramatic acceleration
  exponential: createCustomBezier(0.19, 1, 0.22, 1),
  
  // Quartic for heavy, substantial motion
  substantial: createCustomBezier(0.22, 1, 0.36, 1),
  
  // Sine-based for soft, organic feel
  organic: createCustomBezier(0.37, 0, 0.63, 1)
}

// ============================================================================
// FRAMER MOTION TRANSITIONS
// ============================================================================

/**
 * Pre-configured Framer Motion transition objects
 * for instant luxury feel without configuration
 */
export const MOTION_TRANSITIONS = {
  // Page enter - Elegant, confident
  pageEnter: {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1], // Matches ELEGANT_ENTER
    opacity: { duration: 0.4 }
  },
  
  // Page exit - Quick, clean departure
  pageExit: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1], // Matches PREMIUM_EXIT
    opacity: { duration: 0.25 }
  },
  
  // Modal open - Dramatic but controlled
  modalOpen: {
    duration: 0.45,
    ease: [0.25, 0.1, 0.25, 1], // Matches LUXURY_EASE
    opacity: { duration: 0.3 },
    scale: { duration: 0.45 }
  },
  
  // Modal close - Swift, unobtrusive
  modalClose: {
    duration: 0.35,
    ease: [0.4, 0, 0.2, 1],
    opacity: { duration: 0.2 },
    scale: { duration: 0.35 }
  },
  
  // Micro-interaction - Snappy, precise
  microInteraction: {
    duration: 0.2,
    ease: [0.34, 1.56, 0.64, 1] // Matches LUXURY_SNAP with overshoot
  },
  
  // List item stagger
  listItem: {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1],
    opacity: { duration: 0.3 }
  },
  
  // Scroll reveal
  scrollReveal: {
    duration: 0.8,
    ease: [0.22, 1, 0.36, 1],
    opacity: { duration: 0.5 }
  },
  
  // Loading reveal
  loadingReveal: {
    duration: 1.0,
    ease: [0.4, 0, 0.2, 1],
    opacity: { duration: 0.6 }
  }
}

// ============================================================================
// EXPORT DEFAULT FOR CONVENIENCE
// ============================================================================

export default {
  // Curves
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
  
  // Presets
  EASING_PRESETS,
  TIMING,
  MOTION_TRANSITIONS,
  
  // Utilities
  getEasingForContext,
  getDurationForContext,
  createCustomBezier,
  CUSTOM_CURVES
}


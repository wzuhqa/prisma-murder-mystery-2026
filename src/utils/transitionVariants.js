/**
 * Optimized Transition Variants
 * Centralized, performance-optimized page transition configurations
 * Designed for smooth 60fps animations with GPU acceleration
 */

// Fast, smooth page transitions (300-400ms total)
export const pageTransitionVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94], // Smooth deceleration
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.99,
        transition: {
            duration: 0.25,
            ease: [0.4, 0, 1, 1], // Quick exit
        },
    },
}

// Fade-only transition (fastest, most subtle)
export const fadeTransitionVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: 'easeIn',
        },
    },
}

// Slide transition (directional)
export const slideTransitionVariants = (direction = 'right') => {
    const xOffset = direction === 'right' ? 30 : -30

    return {
        initial: {
            opacity: 0,
            x: xOffset,
        },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1],
            },
        },
        exit: {
            opacity: 0,
            x: -xOffset,
            transition: {
                duration: 0.2,
                ease: [0.4, 0, 1, 1],
            },
        },
    }
}

// Scale transition (zoom effect)
export const scaleTransitionVariants = {
    initial: {
        opacity: 0,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1], // Overshoot for premium feel
        },
    },
    exit: {
        opacity: 0,
        scale: 1.02,
        transition: {
            duration: 0.25,
            ease: [0.4, 0, 1, 1],
        },
    },
}

// Stagger container for child elements
export const staggerContainerVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
}

// Child item for stagger animations
export const staggerItemVariants = {
    initial: {
        opacity: 0,
        y: 15,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.2,
        },
    },
}

export default {
    pageTransitionVariants,
    fadeTransitionVariants,
    slideTransitionVariants,
    scaleTransitionVariants,
    staggerContainerVariants,
    staggerItemVariants,
}

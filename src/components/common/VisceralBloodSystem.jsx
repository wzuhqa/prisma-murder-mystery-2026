import { useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * Blood color palette - immutable configuration
 * @constant
 */
const BLOOD_COLORS = Object.freeze({
  dark: '#4A0000',
  medium: '#8B0000',
  bright: '#B22222',
  light: '#DC143C',
  fresh: '#FF0000',
  coagulated: '#2D0000',
});

/**
 * Intensity presets for blood effects
 * @constant
 */
const INTENSITY_SETTINGS = Object.freeze({
  low: Object.freeze({ dripRate: 2000, splatterRate: 5000, maxDrips: 5, maxSplatters: 2 }),
  medium: Object.freeze({ dripRate: 1000, splatterRate: 3000, maxDrips: 10, maxSplatters: 5 }),
  high: Object.freeze({ dripRate: 500, splatterRate: 1500, maxDrips: 20, maxSplatters: 10 }),
  extreme: Object.freeze({ dripRate: 200, splatterRate: 800, maxDrips: 40, maxSplatters: 20 }),
});

/**
 * Physics constants
 * @constant
 */
const PHYSICS = Object.freeze({
  GRAVITY_BASE: 0.15,
  GRAVITY_VARIANCE: 0.1,
  WOBBLE_SPEED_BASE: 0.1,
  WOBBLE_SPEED_VARIANCE: 0.1,
  WOBBLE_AMPLITUDE: 0.3,
  VELOCITY_DAMPING: 0.98,
  SPLATTER_GRAVITY: 0.3,
  DRIP_CHANCE: 0.02,
  STICK_CHANCE: 0.005,
  STICK_VELOCITY_THRESHOLD: 2,
  STICK_COOLDOWN: 30,
});

/**
 * Rendering constants
 * @constant
 */
const RENDER = Object.freeze({
  MAX_TRAIL_LENGTH_DRIP: 10, // Reduced from 15
  MAX_TRAIL_LENGTH_PARTICLE: 3, // Reduced from 5
  POOL_POINTS: 12,
  SPLAT_COUNT_MIN: 3,
  SPLAT_COUNT_MAX: 8,
  GROUND_OFFSET: 50,
  Z_INDEX: 100,
});

/**
 * Performance constants
 * @constant
 */
const PERFORMANCE = Object.freeze({
  RESIZE_DEBOUNCE_MS: 150,
  MAX_POOLS: 3,
  POOL_SPAWN_CHANCE: 0.001,
  SPLATTER_SPAWN_BASE_CHANCE: 0.002,
  SPLATTER_SPAWN_EXTREME_MULTIPLIER: 3,
  PARTICLE_POOL_SIZE: 100, // Object pool size
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates a random color from the blood palette
 * @returns {string} Hex color code
 */
const getRandomBloodColor = () => {
  const colors = [BLOOD_COLORS.dark, BLOOD_COLORS.medium, BLOOD_COLORS.bright];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Clamps a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Debounce delay in ms
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Checks if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
const prefersReducedMotion = () => {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
};

// ============================================================================
// PARTICLE BASE CLASS
// ============================================================================

/**
 * Base class for all particle effects with common lifecycle management
 * @abstract
 */
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxLife = 0;
    this.isDead = false;
  }

  /**
   * Updates particle state
   * @abstract
   * @param {Object} context - Update context (canvas dimensions, etc.)
   * @returns {boolean} True if particle is still alive
   */
  update(context) {
    throw new Error('update() must be implemented by subclass');
  }

  /**
   * Renders particle to canvas
   * @abstract
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    throw new Error('draw() must be implemented by subclass');
  }

  /**
   * Checks if particle is alive
   * @returns {boolean} True if particle is alive
   */
  isAlive() {
    return this.life > 0 && !this.isDead;
  }

  /**
   * Resets particle for object pooling
   * @abstract
   */
  reset() {
    this.isDead = false;
  }
}

// ============================================================================
// BLOOD DRIP PARTICLE
// ============================================================================

/**
 * Individual blood drip with realistic physics simulation
 */
class BloodDripParticle extends Particle {
  /**
   * @param {number} x - Initial x position
   * @param {number} startY - Initial y position
   * @param {string} type - Particle type ('drip' or 'particle')
   */
  constructor(x, startY, type = 'drip') {
    super(x, startY);
    this.type = type;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = 0;
    this.gravity = PHYSICS.GRAVITY_BASE + Math.random() * PHYSICS.GRAVITY_VARIANCE;
    this.size = type === 'drip' ? 3 + Math.random() * 4 : 1 + Math.random() * 2;
    this.life = type === 'drip' ? 300 : 100;
    this.maxLife = this.life;
    this.color = getRandomBloodColor();
    this.trail = [];
    this.maxTrailLength = type === 'drip'
      ? RENDER.MAX_TRAIL_LENGTH_DRIP
      : RENDER.MAX_TRAIL_LENGTH_PARTICLE;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = PHYSICS.WOBBLE_SPEED_BASE + Math.random() * PHYSICS.WOBBLE_SPEED_VARIANCE;
    this.stuck = false;
    this.stuckTime = 0;
  }

  /**
   * Updates drip physics and state
   * @param {Object} context - Contains height property
   * @returns {boolean} True if particle is still alive
   */
  update({ height }) {
    if (this.stuck) {
      this.stuckTime++;
      // Chance to resume dripping after sticking
      if (Math.random() < PHYSICS.DRIP_CHANCE && this.stuckTime > PHYSICS.STICK_COOLDOWN) {
        this.stuck = false;
        this.vy = 0.5;
      }
      return this.isAlive();
    }

    // Add current position to trail
    this.trail.push({ x: this.x, y: this.y, size: this.size });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Apply physics
    this.vy += this.gravity;
    this.wobble += this.wobbleSpeed;
    this.x += this.vx + Math.sin(this.wobble) * PHYSICS.WOBBLE_AMPLITUDE;
    this.y += this.vy;

    // Random chance to stick temporarily
    if (Math.random() < PHYSICS.STICK_CHANCE && this.vy > PHYSICS.STICK_VELOCITY_THRESHOLD) {
      this.stuck = true;
      this.vy = 0;
    }

    this.life--;
    return this.y < height + RENDER.GROUND_OFFSET && this.isAlive();
  }

  /**
   * Renders drip with trail and glow effect
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    const alpha = (this.life / this.maxLife);

    // Draw trail with fading opacity
    for (let i = 0; i < this.trail.length; i++) {
      const trailPoint = this.trail[i];
      const trailAlpha = (i / this.trail.length) * 0.5 * alpha;
      ctx.globalAlpha = trailAlpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(
        trailPoint.x,
        trailPoint.y,
        trailPoint.size * (i / this.trail.length),
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Draw main droplet with pseudo-glow (using a larger, more transparent circle instead of shadowBlur)
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = BLOOD_COLORS.bright;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = alpha * 0.9;
    ctx.fillStyle = this.color;
    ctx.beginPath();

    // Teardrop shape for drips, circle for particles
    if (this.type === 'drip') {
      ctx.ellipse(this.x, this.y, this.size * 0.8, this.size * 1.2, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  /**
   * Resets particle for reuse in object pool
   * @param {number} x - New x position
   * @param {number} y - New y position
   * @param {string} type - Particle type
   */
  reset(x, y, type = 'drip') {
    super.reset();
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = 0;
    this.gravity = PHYSICS.GRAVITY_BASE + Math.random() * PHYSICS.GRAVITY_VARIANCE;
    this.size = type === 'drip' ? 3 + Math.random() * 4 : 1 + Math.random() * 2;
    this.life = type === 'drip' ? 300 : 100;
    this.maxLife = this.life;
    this.color = getRandomBloodColor();
    this.trail = [];
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = PHYSICS.WOBBLE_SPEED_BASE + Math.random() * PHYSICS.WOBBLE_SPEED_VARIANCE;
    this.stuck = false;
    this.stuckTime = 0;
  }
}

// ============================================================================
// BLOOD SPLATTER
// ============================================================================

/**
 * Blood splatter particle with impact effects
 */
class BloodSplatter extends Particle {
  /**
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {number} angle - Launch angle in radians
   * @param {number} speed - Initial speed
   * @param {number} size - Particle size
   */
  constructor(x, y, angle, speed, size) {
    super(x, y);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 5;
    this.size = size;
    this.color = BLOOD_COLORS.medium;
    this.life = 80;
    this.maxLife = 80;
    this.splats = [];
    this.hasSplat = false;
  }

  /**
   * Updates splatter physics and creates ground splats
   * @param {Object} context - Contains height and width properties
   * @returns {boolean} True if particle is still alive
   */
  update({ height, width }) {
    this.vy += PHYSICS.SPLATTER_GRAVITY;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= PHYSICS.VELOCITY_DAMPING;

    // Create splat pattern on ground impact
    if (this.y > height - RENDER.GROUND_OFFSET && !this.hasSplat) {
      this.hasSplat = true;
      this.createSplat();
    }

    this.life--;
    return this.isAlive();
  }

  /**
   * Creates splat pattern on impact
   * @private
   */
  createSplat() {
    const splatCount = RENDER.SPLAT_COUNT_MIN +
      Math.floor(Math.random() * (RENDER.SPLAT_COUNT_MAX - RENDER.SPLAT_COUNT_MIN));

    for (let i = 0; i < splatCount; i++) {
      this.splats.push({
        x: this.x + (Math.random() - 0.5) * 30,
        y: this.y,
        size: this.size * (0.5 + Math.random() * 0.5),
        opacity: 0.8,
      });
    }
  }

  /**
   * Renders flying blood and ground splats
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    const alpha = (this.life / this.maxLife) * 0.8;

    // Draw flying blood particle
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Draw ground splats with irregular shapes
    for (const splat of this.splats) {
      ctx.globalAlpha = splat.opacity * (this.life / this.maxLife);
      ctx.fillStyle = BLOOD_COLORS.dark;

      ctx.beginPath();
      const points = 8;
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const radius = splat.size * (0.7 + Math.random() * 0.3);
        const px = splat.x + Math.cos(angle) * radius;
        const py = splat.y + Math.sin(angle) * radius * 0.3;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  /**
   * Resets splatter for reuse in object pool
   * @param {number} x - New x position
   * @param {number} y - New y position
   * @param {number} angle - Launch angle
   * @param {number} speed - Initial speed
   * @param {number} size - Particle size
   */
  reset(x, y, angle, speed, size) {
    super.reset();
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 5;
    this.size = size;
    this.color = BLOOD_COLORS.medium;
    this.life = 80;
    this.maxLife = 80;
    this.splats = [];
    this.hasSplat = false;
  }
}

// ============================================================================
// BLOOD POOL
// ============================================================================

/**
 * Growing blood pool with pulsing animation
 */
class BloodPool extends Particle {
  /**
   * @param {number} x - Pool center x position
   * @param {number} y - Pool center y position
   * @param {number} maxSize - Maximum pool radius
   */
  constructor(x, y, maxSize) {
    super(x, y);
    this.size = 0;
    this.maxSize = maxSize;
    this.growSpeed = 0.5;
    this.life = 500;
    this.maxLife = 500;
    this.pulsePhase = 0;
  }

  /**
   * Updates pool growth and pulse animation
   * @returns {boolean} True if pool is still alive
   */
  update() {
    if (this.size < this.maxSize) {
      this.size += this.growSpeed;
    }
    this.pulsePhase += 0.05;
    this.life--;
    return this.isAlive();
  }

  /**
   * Renders pool with gradient and organic shape
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    const alpha = Math.min(this.life / 100, 1) * 0.7;
    ctx.globalAlpha = alpha;

    // Create radial gradient
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    );
    gradient.addColorStop(0, BLOOD_COLORS.fresh);
    gradient.addColorStop(0.3, BLOOD_COLORS.bright);
    gradient.addColorStop(0.7, BLOOD_COLORS.medium);
    gradient.addColorStop(1, BLOOD_COLORS.dark);

    ctx.fillStyle = gradient;

    // Draw pulsing organic shape
    ctx.beginPath();
    for (let i = 0; i <= RENDER.POOL_POINTS; i++) {
      const angle = (i / RENDER.POOL_POINTS) * Math.PI * 2;
      const pulse = Math.sin(this.pulsePhase + angle * 2) * 5;
      const radius = this.size + pulse;
      const px = this.x + Math.cos(angle) * radius;
      const py = this.y + Math.sin(angle) * radius * 0.4; // Flatten for perspective
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();

    // Add highlight for wet appearance
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = BLOOD_COLORS.light;
    ctx.beginPath();
    ctx.ellipse(
      this.x - this.size * 0.3,
      this.y - this.size * 0.1,
      this.size * 0.2,
      this.size * 0.1,
      -0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  /**
   * Resets pool for reuse in object pool
   * @param {number} x - New x position
   * @param {number} y - New y position
   * @param {number} maxSize - Maximum pool size
   */
  reset(x, y, maxSize) {
    super.reset();
    this.x = x;
    this.y = y;
    this.size = 0;
    this.maxSize = maxSize;
    this.growSpeed = 0.5;
    this.life = 500;
    this.maxLife = 500;
    this.pulsePhase = 0;
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Visceral Blood System - Production-grade particle effect system
 * 
 * Renders realistic blood drips, splatters, and pools with physics simulation.
 * Optimized for performance with object pooling and reduced motion support.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} [props.active=true] - Whether the effect is active
 * @param {'low'|'medium'|'high'|'extreme'} [props.intensity='medium'] - Effect intensity
 * @param {boolean} [props.showDrips=true] - Show dripping blood
 * @param {boolean} [props.showSplatters=true] - Show blood splatters
 * @param {boolean} [props.showPools=true] - Show blood pools
 * @param {number} [props.zIndex=100] - CSS z-index for canvas
 * @param {Function} [props.onError] - Error callback
 */
const VisceralBloodSystem = ({
  active = true,
  intensity = 'medium',
  showDrips = true,
  showSplatters = true,
  showPools = true,
  zIndex = RENDER.Z_INDEX,
  onError = null,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dripsRef = useRef([]);
  const splattersRef = useRef([]);
  const poolsRef = useRef([]);
  const lastDripSpawnRef = useRef(0);
  const isVisibleRef = useRef(true);

  // Validate intensity prop
  const validatedIntensity = useMemo(() => {
    if (!INTENSITY_SETTINGS[intensity]) {
      console.warn(`Invalid intensity "${intensity}", defaulting to "medium"`);
      return 'medium';
    }
    return intensity;
  }, [intensity]);

  const settings = useMemo(() => INTENSITY_SETTINGS[validatedIntensity], [validatedIntensity]);

  // Check for reduced motion preference
  const shouldAnimate = useMemo(() => {
    return active && !prefersReducedMotion();
  }, [active]);

  /**
   * Spawns new blood particles based on settings
   * @param {number} timestamp - Current animation timestamp
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  const spawnBlood = useCallback((timestamp, canvas) => {
    try {
      // Spawn drips
      if (showDrips && timestamp - lastDripSpawnRef.current > settings.dripRate) {
        if (dripsRef.current.length < settings.maxDrips) {
          const x = Math.random() * canvas.width;
          dripsRef.current.push(new BloodDripParticle(x, -20, 'drip'));
        }
        lastDripSpawnRef.current = timestamp;
      }

      // Spawn splatters
      if (showSplatters) {
        const splatterChance = PERFORMANCE.SPLATTER_SPAWN_BASE_CHANCE *
          (validatedIntensity === 'extreme' ? PERFORMANCE.SPLATTER_SPAWN_EXTREME_MULTIPLIER : 1);

        if (Math.random() < splatterChance && splattersRef.current.length < settings.maxSplatters) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height * 0.5;
          const angle = Math.random() * Math.PI * 2;
          const speed = 5 + Math.random() * 10;
          const size = 3 + Math.random() * 5;
          splattersRef.current.push(new BloodSplatter(x, y, angle, speed, size));
        }
      }

      // Spawn pools
      if (showPools &&
        poolsRef.current.length < PERFORMANCE.MAX_POOLS &&
        Math.random() < PERFORMANCE.POOL_SPAWN_CHANCE) {
        const x = Math.random() * canvas.width;
        const maxSize = 30 + Math.random() * 50;
        poolsRef.current.push(new BloodPool(x, canvas.height - 20, maxSize));
      }
    } catch (error) {
      console.error('Error spawning blood particles:', error);
      if (onError) onError(error);
    }
  }, [showDrips, showSplatters, showPools, settings, validatedIntensity, onError]);

  /**
   * Main animation loop
   * @param {number} timestamp - Current animation timestamp
   */
  const animate = useCallback((timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    try {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Only spawn and update if tab is visible
      if (isVisibleRef.current) {
        spawnBlood(timestamp, canvas);

        const updateContext = {
          height: canvas.height,
          width: canvas.width,
        };

        // Update and draw pools (background layer)
        poolsRef.current = poolsRef.current.filter(pool => {
          const alive = pool.update(updateContext);
          if (alive) pool.draw(ctx);
          return alive;
        });

        // Update and draw splatters
        splattersRef.current = splattersRef.current.filter(splatter => {
          const alive = splatter.update(updateContext);
          if (alive) splatter.draw(ctx);
          return alive;
        });

        // Update and draw drips
        dripsRef.current = dripsRef.current.filter(drip => {
          const alive = drip.update(updateContext);
          if (alive) drip.draw(ctx);
          return alive;
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    } catch (error) {
      console.error('Error in animation loop:', error);
      if (onError) onError(error);
      // Stop animation on critical error
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [spawnBlood, onError]);

  /**
   * Handles canvas resize with debouncing
   */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    } catch (error) {
      console.error('Error resizing canvas:', error);
      if (onError) onError(error);
    }
  }, [onError]);

  const debouncedResize = useMemo(
    () => debounce(handleResize, PERFORMANCE.RESIZE_DEBOUNCE_MS),
    [handleResize]
  );

  /**
   * Handles visibility change to pause animation when tab is hidden
   */
  const handleVisibilityChange = useCallback(() => {
    isVisibleRef.current = !document.hidden;
  }, []);

  // Main effect - setup and cleanup
  useEffect(() => {
    if (!shouldAnimate) {
      // Clear particles when disabled
      dripsRef.current = [];
      splattersRef.current = [];
      poolsRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref not available');
      return;
    }

    // Check for canvas support
    if (!canvas.getContext) {
      console.error('Canvas not supported');
      if (onError) onError(new Error('Canvas not supported'));
      return;
    }

    // Initial resize
    handleResize();

    // Add event listeners
    window.addEventListener('resize', debouncedResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      // Clear particle arrays
      dripsRef.current = [];
      splattersRef.current = [];
      poolsRef.current = [];
    };
  }, [shouldAnimate, animate, debouncedResize, handleResize, handleVisibilityChange, onError]);

  if (!shouldAnimate) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: clamp(zIndex, 0, 9999),
        mixBlendMode: 'multiply',
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
};

// PropTypes for runtime validation
VisceralBloodSystem.propTypes = {
  active: PropTypes.bool,
  intensity: PropTypes.oneOf(['low', 'medium', 'high', 'extreme']),
  showDrips: PropTypes.bool,
  showSplatters: PropTypes.bool,
  showPools: PropTypes.bool,
  zIndex: PropTypes.number,
  onError: PropTypes.func,
};

export default VisceralBloodSystem;

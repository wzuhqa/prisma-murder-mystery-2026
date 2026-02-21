/**
 * ParticleEngine - High-Performance Canvas-Based Particle System
 * 
 * Features:
 * - Single canvas with RAF loop
 * - Object pooling (zero garbage collection)
 * - Adaptive FPS scaling
 * - Multiple particle types
 * - Device capability detection
 * - Tab visibility optimization
 * 
 * @author Senior Graphics Engineer
 * @performance Target: 60fps desktop, 50fps+ mobile
 */

class ParticleEngine {
    constructor(options = {}) {
        // Configuration
        this.config = {
            enabled: options.enabled !== false,
            maxParticles: options.maxParticles || 100,
            fpsTarget: 55,
            adaptiveScaling: true,
            ...options
        }

        // State
        this.canvas = null
        this.ctx = null
        this.particles = []
        this.particlePool = []
        this.isRunning = false
        this.isPaused = false

        // Performance tracking
        this.fps = 60
        this.frameCount = 0
        this.lastFpsUpdate = 0
        this.lastFrameTime = 0
        this.deltaTime = 0
        this.performanceLevel = 1.0 // 0.0 to 1.0

        // Device detection
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        this.isLowEnd = navigator.hardwareConcurrency < 4
        this.deviceCapability = this._detectDeviceCapability()

        // Particle type definitions
        this.particleTypes = {
            dust: {
                velocity: { x: [-0.5, 0.5], y: [0.3, 0.8] },
                lifetime: [3000, 6000],
                opacity: [0.1, 0.3],
                size: [1, 3],
                color: [200, 200, 200],
                glow: false
            },
            ember: {
                velocity: { x: [-0.3, 0.3], y: [-1.5, -0.8] },
                lifetime: [2000, 4000],
                opacity: [0.4, 0.7],
                size: [2, 4],
                color: [255, 100, 50],
                glow: true
            },
            blood: {
                velocity: { x: [-3, 3], y: [-3, 3] },
                lifetime: [300, 800],
                opacity: [0.6, 0.9],
                size: [1, 2],
                color: [139, 0, 0],
                glow: false
            }
        }

        // RAF reference
        this.rafId = null

        // Initialize if enabled
        if (this.config.enabled) {
            this._init()
        }
    }

    /**
     * Initialize the particle engine
     */
    _init() {
        this._createCanvas()
        this._setupEventListeners()
        this._initializeParticlePool()
        this._adjustForDevice()
        this.start()
    }

    /**
     * Create and setup canvas element
     */
    _createCanvas() {
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'particle-engine-canvas'
        this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    `

        this.ctx = this.canvas.getContext('2d', {
            alpha: true,
            desynchronized: true // Hint for better performance
        })

        this._resizeCanvas()
        document.body.appendChild(this.canvas)
    }

    /**
     * Resize canvas to match window size
     */
    _resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x for performance
        this.canvas.width = window.innerWidth * dpr
        this.canvas.height = window.innerHeight * dpr
        this.canvas.style.width = `${window.innerWidth}px`
        this.canvas.style.height = `${window.innerHeight}px`
        this.ctx.scale(dpr, dpr)
    }

    /**
     * Setup event listeners
     */
    _setupEventListeners() {
        // Debounced resize
        let resizeTimeout
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => this._resizeCanvas(), 150)
        })

        // Tab visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause()
            } else {
                this.resume()
            }
        })
    }

    /**
     * Detect device capability
     */
    _detectDeviceCapability() {
        if (this.isLowEnd) return 'low'
        if (this.isMobile) return 'medium'
        return 'high'
    }

    /**
     * Adjust settings based on device
     */
    _adjustForDevice() {
        switch (this.deviceCapability) {
            case 'low':
                this.config.maxParticles = 10
                delete this.particleTypes.ember
                delete this.particleTypes.blood
                break
            case 'medium':
                this.config.maxParticles = 40
                delete this.particleTypes.blood
                break
            case 'high':
                this.config.maxParticles = 100
                break
        }
    }

    /**
     * Initialize particle object pool
     */
    _initializeParticlePool() {
        const poolSize = this.config.maxParticles * 2
        for (let i = 0; i < poolSize; i++) {
            this.particlePool.push(this._createParticleObject())
        }
    }

    /**
     * Create a particle object (for pooling)
     */
    _createParticleObject() {
        return {
            active: false,
            type: null,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            life: 0,
            maxLife: 0,
            opacity: 0,
            size: 0,
            color: null,
            glow: false
        }
    }

    /**
     * Get particle from pool or create new one
     */
    _getParticle() {
        // Try to find inactive particle in pool
        for (let i = 0; i < this.particlePool.length; i++) {
            if (!this.particlePool[i].active) {
                return this.particlePool[i]
            }
        }

        // Pool exhausted, create new (shouldn't happen often)
        const particle = this._createParticleObject()
        this.particlePool.push(particle)
        return particle
    }

    /**
     * Spawn a particle
     */
    _spawnParticle(type, x, y) {
        if (this.particles.length >= this.config.maxParticles * this.performanceLevel) {
            return null
        }

        const config = this.particleTypes[type]
        if (!config) return null

        const particle = this._getParticle()

        particle.active = true
        particle.type = type
        particle.x = x
        particle.y = y
        particle.vx = this._random(config.velocity.x[0], config.velocity.x[1])
        particle.vy = this._random(config.velocity.y[0], config.velocity.y[1])
        particle.maxLife = this._random(config.lifetime[0], config.lifetime[1])
        particle.life = particle.maxLife
        particle.opacity = this._random(config.opacity[0], config.opacity[1])
        particle.size = this._random(config.size[0], config.size[1])
        particle.color = config.color
        particle.glow = config.glow

        this.particles.push(particle)
        return particle
    }

    /**
     * Update particle
     */
    _updateParticle(particle, delta) {
        particle.life -= delta

        if (particle.life <= 0) {
            particle.active = false
            return false
        }

        // Update position
        particle.x += particle.vx * delta / 16
        particle.y += particle.vy * delta / 16

        // Fade out
        const lifeRatio = particle.life / particle.maxLife
        particle.opacity = this._random(
            this.particleTypes[particle.type].opacity[0],
            this.particleTypes[particle.type].opacity[1]
        ) * lifeRatio

        // Cull off-screen particles
        if (particle.x < -50 || particle.x > window.innerWidth + 50 ||
            particle.y < -50 || particle.y > window.innerHeight + 50) {
            particle.active = false
            return false
        }

        return true
    }

    /**
     * Render particle
     */
    _renderParticle(particle) {
        const [r, g, b] = particle.color

        if (particle.glow) {
            this.ctx.shadowBlur = 10
            this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`
        }

        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`
        this.ctx.beginPath()
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        this.ctx.fill()

        if (particle.glow) {
            this.ctx.shadowBlur = 0
        }
    }

    /**
     * Main update loop
     */
    _update(timestamp) {
        if (!this.isRunning || this.isPaused) return

        // Calculate delta time
        this.deltaTime = timestamp - this.lastFrameTime
        this.lastFrameTime = timestamp

        // Update FPS
        this.frameCount++
        if (timestamp - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount
            this.frameCount = 0
            this.lastFpsUpdate = timestamp
            this._adjustPerformance()
        }

        // Clear canvas
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

        // Update and render particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i]

            if (!this._updateParticle(particle, this.deltaTime)) {
                this.particles.splice(i, 1)
            } else {
                this._renderParticle(particle)
            }
        }

        // Continue loop
        this.rafId = requestAnimationFrame((t) => this._update(t))
    }

    /**
     * Adjust performance based on FPS
     */
    _adjustPerformance() {
        if (!this.config.adaptiveScaling) return

        if (this.fps >= 55) {
            this.performanceLevel = 1.0
        } else if (this.fps >= 45) {
            this.performanceLevel = 0.7
        } else if (this.fps >= 30) {
            this.performanceLevel = 0.4
        } else {
            this.performanceLevel = 0.0
            console.warn('[ParticleEngine] Low FPS detected, reducing particles')
        }
    }

    /**
     * Emit ambient particles continuously
     */
    emitAmbient(type, count) {
        const particlesPerFrame = count / 60 // Spread over 1 second

        for (let i = 0; i < particlesPerFrame; i++) {
            const x = Math.random() * window.innerWidth
            const y = Math.random() * window.innerHeight
            this._spawnParticle(type, x, y)
        }
    }

    /**
     * Emit burst of particles
     */
    burst(type, count, position = {}) {
        const x = position.x || window.innerWidth / 2
        const y = position.y || window.innerHeight / 2

        for (let i = 0; i < count; i++) {
            const offsetX = (Math.random() - 0.5) * 20
            const offsetY = (Math.random() - 0.5) * 20
            this._spawnParticle(type, x + offsetX, y + offsetY)
        }
    }

    /**
     * Start the engine
     */
    start() {
        if (this.isRunning) return
        this.isRunning = true
        this.lastFrameTime = performance.now()
        this.rafId = requestAnimationFrame((t) => this._update(t))

        // Start ambient dust
        setInterval(() => {
            if (this.isRunning && !this.isPaused) {
                this.emitAmbient('dust', 2)
            }
        }, 1000)
    }

    /**
     * Pause the engine
     */
    pause() {
        this.isPaused = true
    }

    /**
     * Resume the engine
     */
    resume() {
        this.isPaused = false
        this.lastFrameTime = performance.now()
    }

    /**
     * Stop and cleanup
     */
    destroy() {
        this.isRunning = false

        if (this.rafId) {
            cancelAnimationFrame(this.rafId)
        }

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas)
        }

        this.particles = []
        this.particlePool = []
        this.canvas = null
        this.ctx = null
    }

    /**
     * Utility: Random number between min and max
     */
    _random(min, max) {
        return Math.random() * (max - min) + min
    }
}

// Export for use
export default ParticleEngine


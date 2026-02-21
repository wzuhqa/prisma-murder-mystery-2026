import { useEffect, useRef } from 'react'

/**
 * Rain Canvas Component
 * 
 * Particle-based rain system using Canvas
 * Object pooling for performance
 * GPU-accelerated rendering
 */

class RainParticle {
    constructor(width, height) {
        this.reset(width, height)
    }

    reset(width, height) {
        this.x = Math.random() * width
        this.y = Math.random() * -height
        this.length = Math.random() * 15 + 10
        this.speed = Math.random() * 3 + 2
        this.opacity = Math.random() * 0.3 + 0.1
    }

    update(width, height) {
        this.y += this.speed
        if (this.y > height) {
            this.reset(width, height)
        }
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x, this.y + this.length)
        ctx.strokeStyle = `rgba(150, 180, 200, ${this.opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
    }
}

const RainCanvas = ({ particleCount = 100, enabled = true }) => {
    const canvasRef = useRef(null)
    const rafRef = useRef(null)
    const particlesRef = useRef([])

    useEffect(() => {
        if (!enabled) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { alpha: true })

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            // Reinitialize particles
            particlesRef.current = Array.from(
                { length: particleCount },
                () => new RainParticle(canvas.width, canvas.height)
            )
        }
        resize()
        window.addEventListener('resize', resize)

        // Animation loop
        const animate = () => {
            const { width, height } = canvas

            // Clear canvas
            ctx.clearRect(0, 0, width, height)

            // Update and draw particles
            particlesRef.current.forEach(particle => {
                particle.update(width, height)
                particle.draw(ctx)
            })

            rafRef.current = requestAnimationFrame(animate)
        }

        rafRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('resize', resize)
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [particleCount, enabled])

    if (!enabled) return null

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
                zIndex: 9997,
                opacity: 0.6,
                willChange: 'contents'
            }}
        />
    )
}

export default RainCanvas

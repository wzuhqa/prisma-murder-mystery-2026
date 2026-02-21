import { useEffect, useRef } from 'react'

/**
 * Film Grain Canvas Component
 * 
 * Procedural film grain using Canvas API
 * Optimized to 30fps (imperceptible vs 60fps)
 * GPU-accelerated rendering
 */

const FilmGrainCanvas = ({ intensity = 0.05, opacity = 0.15 }) => {
    const canvasRef = useRef(null)
    const rafRef = useRef(null)
    const lastFrameTimeRef = useRef(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { alpha: true })
        const fps = 30
        const frameInterval = 1000 / fps

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // Generate grain
        const renderGrain = (timestamp) => {
            // Throttle to 30fps
            if (timestamp - lastFrameTimeRef.current < frameInterval) {
                rafRef.current = requestAnimationFrame(renderGrain)
                return
            }
            lastFrameTimeRef.current = timestamp

            const { width, height } = canvas
            const imageData = ctx.createImageData(width, height)
            const data = imageData.data

            // Generate noise
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * intensity * 255
                data[i] = noise     // R
                data[i + 1] = noise // G
                data[i + 2] = noise // B
                data[i + 3] = opacity * 255 // A
            }

            ctx.putImageData(imageData, 0, 0)
            rafRef.current = requestAnimationFrame(renderGrain)
        }

        rafRef.current = requestAnimationFrame(renderGrain)

        return () => {
            window.removeEventListener('resize', resize)
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [intensity, opacity])

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
                zIndex: 9998,
                mixBlendMode: 'overlay',
                willChange: 'contents'
            }}
        />
    )
}

export default FilmGrainCanvas

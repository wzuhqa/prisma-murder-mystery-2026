/**
 * GlobalParticles - React Wrapper for ParticleEngine
 * 
 * Usage:
 * <GlobalParticles 
 *   enabled={true}
 *   intensity="medium"
 *   types={['dust', 'ember']}
 * />
 */

import { useEffect, useRef } from 'react'
import ParticleEngine from '../../utils/ParticleEngine'

const GlobalParticles = ({
    enabled = true,
    intensity = 'medium',
    _types = ['dust', 'ember']
}) => {
    const engineRef = useRef(null)

    useEffect(() => {
        if (!enabled) return

        // Determine max particles based on intensity (reduced for performance)
        const intensityMap = {
            low: 15,
            medium: 30,
            high: 50
        }

        // Initialize engine
        engineRef.current = new ParticleEngine({
            enabled: true,
            maxParticles: intensityMap[intensity] || 60,
            adaptiveScaling: true
        })

        // Expose to window for external access (GSAP, etc.)
        window.particleEngine = engineRef.current

        // Cleanup on unmount
        return () => {
            if (engineRef.current) {
                engineRef.current.destroy()
                engineRef.current = null
                window.particleEngine = null
            }
        }
    }, [enabled, intensity])

    // No DOM rendering needed - canvas is created by engine
    return null
}

export default GlobalParticles


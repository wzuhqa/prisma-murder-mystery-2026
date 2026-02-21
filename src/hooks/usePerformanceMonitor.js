import { useEffect, useRef, useState } from 'react'

/**
 * Performance monitoring hook
 * Detects low-end devices and provides performance metrics
 */
const usePerformanceMonitor = () => {
    const [isLowEndDevice, setIsLowEndDevice] = useState(false)
    const [fps, setFps] = useState(60)
    const frameCountRef = useRef(0)
    const lastTimeRef = useRef(performance.now())

    useEffect(() => {
        // Detect low-end device based on hardware concurrency and device memory
        const detectLowEndDevice = () => {
            const cores = navigator.hardwareConcurrency || 2
            const memory = navigator.deviceMemory || 4 // GB

            // Consider low-end if < 4 cores or < 4GB RAM
            return cores < 4 || memory < 4
        }

        setIsLowEndDevice(detectLowEndDevice())

        // FPS monitoring
        let rafId
        const measureFPS = () => {
            frameCountRef.current++
            const currentTime = performance.now()
            const elapsed = currentTime - lastTimeRef.current

            // Update FPS every second
            if (elapsed >= 1000) {
                const currentFps = Math.round((frameCountRef.current * 1000) / elapsed)
                setFps(currentFps)
                frameCountRef.current = 0
                lastTimeRef.current = currentTime

                // If FPS drops below 30, consider it a low-end device
                if (currentFps < 30) {
                    setIsLowEndDevice(true)
                }
            }

            rafId = requestAnimationFrame(measureFPS)
        }

        rafId = requestAnimationFrame(measureFPS)

        return () => {
            if (rafId) {
                cancelAnimationFrame(rafId)
            }
        }
    }, [])

    return {
        isLowEndDevice,
        fps,
        shouldReduceAnimations: isLowEndDevice || fps < 30
    }
}

export default usePerformanceMonitor

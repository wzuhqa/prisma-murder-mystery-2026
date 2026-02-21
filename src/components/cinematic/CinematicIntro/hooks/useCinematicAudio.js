import { useRef, useCallback, useEffect, useState } from 'react'

/**
 * Cinematic Audio Hook
 * 
 * Manages audio playback with:
 * - User interaction unlock
 * - Gradual fade-in/out
 * - Scene-triggered sounds
 * - Proper cleanup
 */

const useCinematicAudio = ({ enabled = true }) => {
    const [isUnlocked, setIsUnlocked] = useState(false)
    const audioContextRef = useRef(null)
    const audioElementsRef = useRef({})
    const gainNodesRef = useRef({})

    // Initialize audio context on user interaction
    const unlock = useCallback(() => {
        if (isUnlocked || !enabled) return

        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext
            audioContextRef.current = new AudioContext()
            setIsUnlocked(true)
        } catch (error) {
            console.warn('Audio context creation failed:', error)
        }
    }, [isUnlocked, enabled])

    // Play audio with fade-in
    const play = useCallback((key, { loop = false, volume = 1, fadeIn = 1000 } = {}) => {
        if (!isUnlocked || !enabled) return

        const audio = audioElementsRef.current[key]
        if (!audio) return

        try {
            audio.loop = loop
            audio.volume = 0

            audio.play().then(() => {
                // Fade in
                const startTime = Date.now()
                const fadeInterval = setInterval(() => {
                    const elapsed = Date.now() - startTime
                    const progress = Math.min(elapsed / fadeIn, 1)
                    audio.volume = progress * volume

                    if (progress >= 1) {
                        clearInterval(fadeInterval)
                    }
                }, 16)
            }).catch(err => {
                console.warn(`Audio playback failed for ${key}:`, err)
            })
        } catch (error) {
            console.warn(`Error playing ${key}:`, error)
        }
    }, [isUnlocked, enabled])

    // Stop audio with fade-out
    const stop = useCallback((key, { fadeOut = 500 } = {}) => {
        const audio = audioElementsRef.current[key]
        if (!audio) return

        const startVolume = audio.volume
        const startTime = Date.now()

        const fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / fadeOut, 1)
            audio.volume = startVolume * (1 - progress)

            if (progress >= 1) {
                clearInterval(fadeInterval)
                audio.pause()
                audio.currentTime = 0
            }
        }, 16)
    }, [])

    // Stop all audio
    const stopAll = useCallback(({ fadeOut = 500 } = {}) => {
        Object.keys(audioElementsRef.current).forEach(key => {
            stop(key, { fadeOut })
        })
    }, [stop])

    // Register audio element
    const register = useCallback((key, src) => {
        if (audioElementsRef.current[key]) return

        const audio = new Audio(src)
        audio.preload = 'auto'
        audioElementsRef.current[key] = audio
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Stop and cleanup all audio
            Object.values(audioElementsRef.current).forEach(audio => {
                audio.pause()
                audio.src = ''
            })
            audioElementsRef.current = {}

            // Close audio context
            if (audioContextRef.current) {
                audioContextRef.current.close()
            }
        }
    }, [])

    return {
        unlock,
        play,
        stop,
        stopAll,
        register,
        isUnlocked
    }
}

export default useCinematicAudio

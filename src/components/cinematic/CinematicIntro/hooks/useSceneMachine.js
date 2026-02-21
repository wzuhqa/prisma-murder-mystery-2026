import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Scene State Machine for Cinematic Intro
 * 
 * Manages scene progression with clean state transitions.
 * No scattered timeouts - all timing is controlled here.
 * 
 * States: DARKNESS → LIGHT → CASE_FILE → FILE_OPEN → TITLE → COMPLETE
 */

const SCENES = {
    DARKNESS: 'DARKNESS',
    LIGHT: 'LIGHT',
    CASE_FILE: 'CASE_FILE',
    FILE_OPEN: 'FILE_OPEN',
    TITLE: 'TITLE',
    COMPLETE: 'COMPLETE'
}

const SCENE_DURATIONS = {
    [SCENES.DARKNESS]: 1500,
    [SCENES.LIGHT]: 2000,
    [SCENES.CASE_FILE]: 2500,
    [SCENES.FILE_OPEN]: 3000,
    [SCENES.TITLE]: 3000
}

const useSceneMachine = ({ onComplete, autoStart = true }) => {
    const [currentScene, setCurrentScene] = useState(SCENES.DARKNESS)
    const [isPlaying, setIsPlaying] = useState(false)
    const timeoutRef = useRef(null)
    const startTimeRef = useRef(null)

    // Advance to next scene
    const advanceScene = useCallback(() => {
        setCurrentScene(current => {
            switch (current) {
                case SCENES.DARKNESS:
                    return SCENES.LIGHT
                case SCENES.LIGHT:
                    return SCENES.CASE_FILE
                case SCENES.CASE_FILE:
                    return SCENES.FILE_OPEN
                case SCENES.FILE_OPEN:
                    return SCENES.TITLE
                case SCENES.TITLE:
                    return SCENES.COMPLETE
                default:
                    return current
            }
        })
    }, [])

    // Skip to end
    const skip = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setCurrentScene(SCENES.COMPLETE)
        setIsPlaying(false)
        onComplete?.()
    }, [onComplete])

    // Start the sequence
    const start = useCallback(() => {
        setIsPlaying(true)
        startTimeRef.current = Date.now()
    }, [])

    // Scene progression effect
    useEffect(() => {
        if (!isPlaying) return
        if (currentScene === SCENES.COMPLETE) {
            onComplete?.()
            setIsPlaying(false)
            return
        }

        const duration = SCENE_DURATIONS[currentScene]
        if (duration) {
            timeoutRef.current = setTimeout(() => {
                advanceScene()
            }, duration)
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [currentScene, isPlaying, advanceScene, onComplete])

    // Auto-start if enabled
    useEffect(() => {
        if (autoStart) {
            start()
        }
    }, [autoStart, start])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return {
        currentScene,
        isPlaying,
        start,
        skip,
        SCENES
    }
}

export default useSceneMachine

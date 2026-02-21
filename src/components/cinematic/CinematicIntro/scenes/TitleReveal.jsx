import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from '../CinematicIntro.module.css'

/**
 * Scene 5: Title Reveal
 * 
 * Typewriter effect with realistic timing
 * Ink bleed on each letter
 * Glitch on random characters
 * Camera push-in
 */

const TitleReveal = ({ isActive, onComplete }) => {
    const sceneRef = useRef(null)
    const titleRef = useRef(null)
    const timelineRef = useRef(null)

    useEffect(() => {
        if (!isActive) return

        const title = "THE HOLLOW ROOM"
        const chars = title.split('')

        // Create character spans
        if (titleRef.current) {
            titleRef.current.innerHTML = chars.map((char, i) =>
                `<span class="${styles.titleChar}" data-index="${i}">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('')
        }

        const charElements = titleRef.current.querySelectorAll(`.${styles.titleChar}`)
        const tl = gsap.timeline({
            onComplete: () => onComplete?.()
        })

        // Camera push-in
        tl.to(sceneRef.current, {
            scale: 1.1,
            duration: 3,
            ease: 'power1.inOut'
        }, 0)

        // Typewriter effect with variable timing
        chars.forEach((char, i) => {
            const delay = i * 0.08 + Math.random() * 0.04
            const duration = 0.05 + Math.random() * 0.03

            tl.to(charElements[i], {
                opacity: 1,
                duration: duration,
                ease: 'steps(1)'
            }, delay)

            // Random glitch on some characters
            if (Math.random() < 0.15) {
                tl.add(() => {
                    charElements[i].classList.add(styles.titleGlitch)
                    setTimeout(() => {
                        charElements[i].classList.remove(styles.titleGlitch)
                    }, 300)
                }, delay + 0.1)
            }
        })

        // Brief flicker before stabilizing
        tl.to(titleRef.current, {
            opacity: 0.7,
            duration: 0.05,
            ease: 'steps(1)'
        }, 2.5)
            .to(titleRef.current, {
                opacity: 1,
                duration: 0.1,
                ease: 'power2.out'
            })

        timelineRef.current = tl

        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill()
            }
        }
    }, [isActive, onComplete])

    if (!isActive) return null

    return (
        <div ref={sceneRef} className={`${styles.scene} ${styles.titleScene}`}>
            <h1 ref={titleRef} className={styles.title}></h1>
        </div>
    )
}

export default TitleReveal

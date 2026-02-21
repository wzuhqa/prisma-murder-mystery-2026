import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from '../CinematicIntro.module.css'

/**
 * Scene 2: Overhead Light Flicker
 * 
 * Realistic fluorescent light flicker using GSAP timeline
 * Camera shake on ignition
 * Dust particles in light beam
 */

const LightFlickerScene = ({ isActive, onComplete }) => {
    const sceneRef = useRef(null)
    const lightRef = useRef(null)
    const timelineRef = useRef(null)

    useEffect(() => {
        if (!isActive) return

        const tl = gsap.timeline({
            onComplete: () => onComplete?.()
        })

        // Realistic flicker sequence
        tl.to(lightRef.current, {
            opacity: 0.3,
            duration: 0.05,
            ease: 'steps(1)'
        })
            .to(lightRef.current, {
                opacity: 0,
                duration: 0.05,
                ease: 'steps(1)'
            })
            .to(lightRef.current, {
                opacity: 0.6,
                duration: 0.1,
                ease: 'steps(1)'
            })
            .to(lightRef.current, {
                opacity: 0.2,
                duration: 0.05,
                ease: 'steps(1)'
            })
            .to(lightRef.current, {
                opacity: 0.8,
                duration: 0.15,
                ease: 'power2.out'
            })
            .to(lightRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            })

        // Camera shake on ignition
        tl.to(sceneRef.current, {
            x: -2,
            y: 2,
            duration: 0.05,
            ease: 'steps(1)'
        }, 0.5)
            .to(sceneRef.current, {
                x: 2,
                y: -2,
                duration: 0.05,
                ease: 'steps(1)'
            })
            .to(sceneRef.current, {
                x: 0,
                y: 0,
                duration: 0.1,
                ease: 'power2.out'
            })

        // Dust particles animation
        const particles = sceneRef.current.querySelectorAll(`.${styles.dustParticle}`)
        particles.forEach((particle, i) => {
            tl.to(particle, {
                y: Math.random() * 200 + 100,
                x: (Math.random() - 0.5) * 50,
                opacity: 0,
                duration: 2,
                ease: 'power1.out'
            }, 0.6 + i * 0.1)
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
        <div ref={sceneRef} className={`${styles.scene} ${styles.lightScene}`}>
            {/* Light beam */}
            <div ref={lightRef} className={styles.lightBeam} style={{ opacity: 0 }} />

            {/* Dust particles */}
            <div className={styles.dustParticles}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className={styles.dustParticle}
                        style={{
                            left: `${40 + Math.random() * 20}%`,
                            top: `${Math.random() * 30}%`
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default LightFlickerScene

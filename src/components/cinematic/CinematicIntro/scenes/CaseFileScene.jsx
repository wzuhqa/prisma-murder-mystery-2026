import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from '../CinematicIntro.module.css'

/**
 * Scene 3: Case File Slam
 * 
 * Desk impact with camera shake
 * Red stamp with ink bleed animation
 * Paper dust particles
 */

const CaseFileScene = ({ isActive, onComplete, onStampImpact }) => {
    const sceneRef = useRef(null)
    const caseFileRef = useRef(null)
    const stampRef = useRef(null)
    const inkBleedRef = useRef(null)
    const timelineRef = useRef(null)

    useEffect(() => {
        if (!isActive) return

        const tl = gsap.timeline({
            onComplete: () => onComplete?.()
        })

        // Case file slams down
        tl.fromTo(caseFileRef.current,
            {
                y: -500,
                rotation: -10,
                scale: 0.8
            },
            {
                y: 0,
                rotation: 0,
                scale: 1,
                duration: 0.4,
                ease: 'power3.out',
                onStart: () => onStampImpact?.()
            }
        )

        // Camera shake on impact
        tl.to(sceneRef.current, {
            x: -8,
            y: 4,
            duration: 0.05,
            ease: 'steps(1)'
        }, 0.4)
            .to(sceneRef.current, {
                x: 8,
                y: -4,
                duration: 0.05,
                ease: 'steps(1)'
            })
            .to(sceneRef.current, {
                x: -4,
                y: 2,
                duration: 0.05,
                ease: 'steps(1)'
            })
            .to(sceneRef.current, {
                x: 0,
                y: 0,
                duration: 0.2,
                ease: 'power2.out'
            })

        // Stamp appears with overshoot
        tl.fromTo(stampRef.current,
            {
                scale: 0,
                rotation: -20,
                opacity: 0
            },
            {
                scale: 1.1,
                rotation: -15,
                opacity: 1,
                duration: 0.3,
                ease: 'back.out(2)'
            },
            0.6
        )
            .to(stampRef.current, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            })

        // Ink bleed effect
        tl.to(inkBleedRef.current, {
            opacity: 0.6,
            duration: 0.5,
            ease: 'power2.out'
        }, 0.7)
            .to(inkBleedRef.current, {
                scale: 1.2,
                opacity: 0.3,
                duration: 0.8,
                ease: 'power1.out'
            })

        timelineRef.current = tl

        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill()
            }
        }
    }, [isActive, onComplete, onStampImpact])

    if (!isActive) return null

    return (
        <div ref={sceneRef} className={`${styles.scene} ${styles.caseFileScene}`}>
            <div ref={caseFileRef} className={styles.caseFile}>
                <div ref={stampRef} className={styles.stamp}>
                    <div ref={inkBleedRef} className={styles.inkBleed} />
                    <span className={styles.stampText}>CASE FILE #0472</span>
                    <span className={styles.stampText}>CONFIDENTIAL</span>
                    <span className={styles.stampText}>UNSOLVED</span>
                </div>
            </div>
        </div>
    )
}

export default CaseFileScene

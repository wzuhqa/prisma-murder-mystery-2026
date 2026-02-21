import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from '../CinematicIntro.module.css'

/**
 * Scene 4: File Opens
 * 
 * Dramatic page flip
 * Evidence photos slide in
 * Brief VHS glitch distortion
 */

const FileOpenScene = ({ isActive, onComplete }) => {
    const sceneRef = useRef(null)
    const timelineRef = useRef(null)

    useEffect(() => {
        if (!isActive) return

        const tl = gsap.timeline({
            onComplete: () => onComplete?.()
        })

        const photos = sceneRef.current.querySelectorAll(`.${styles.evidencePhoto}`)

        // Evidence photos slide in with stagger
        photos.forEach((photo, i) => {
            tl.fromTo(photo,
                {
                    y: 100,
                    opacity: 0,
                    rotation: (Math.random() - 0.5) * 10
                },
                {
                    y: 0,
                    opacity: 1,
                    rotation: (Math.random() - 0.5) * 5,
                    duration: 0.6,
                    ease: 'power3.out'
                },
                i * 0.15
            )
        })

        // VHS glitch moment
        tl.add(() => {
            sceneRef.current.classList.add(styles.vhsGlitch)
            setTimeout(() => {
                sceneRef.current.classList.remove(styles.vhsGlitch)
            }, 300)
        }, 1.5)

        timelineRef.current = tl

        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill()
            }
        }
    }, [isActive, onComplete])

    if (!isActive) return null

    const evidenceItems = [
        'EVIDENCE A',
        'EVIDENCE B',
        'EVIDENCE C',
        'WITNESS STMT',
        'CRIME SCENE',
        'AUTOPSY RPT'
    ]

    return (
        <div ref={sceneRef} className={`${styles.scene} ${styles.fileOpenScene}`}>
            <div className={styles.evidenceGrid}>
                {evidenceItems.map((label, i) => (
                    <div key={i} className={styles.evidencePhoto}>
                        <div className={styles.polaroidLabel}>{label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FileOpenScene

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import styles from '../CinematicIntro.module.css'

gsap.registerPlugin(TextPlugin)

/**
 * Scene 1: Darkness
 * 
 * Black screen with breathing vignette
 * Subtle frame jitter
 * Sets the mood
 */

const DarknessScene = ({ isActive }) => {
    const sceneRef = useRef(null)
    const textRef = useRef(null)
    const timelineRef = useRef(null)

    useEffect(() => {
        if (!isActive) return

        const tl = gsap.timeline()
        const textElement = textRef.current

        // Initial 
        if (textElement) {
            gsap.set(textElement, { opacity: 0, textContent: "" })

            // Sequence: Accessing -> Identity -> Verification
            tl.to(textElement, { opacity: 1, duration: 0.5, text: "ACCESSING CASE FILE..." })
                .to(textElement, { opacity: 0, duration: 0.3, delay: 1.5 })
                .set(textElement, { text: "IDENTITY VERIFICATION REQUIRED", color: "#c41e3a" })
                .to(textElement, { opacity: 1, duration: 0.3 })
                .to(textElement, { opacity: 0, duration: 0.5, delay: 1.5 })
        }

        // Subtle breathing effect
        if (sceneRef.current) {
            gsap.to(sceneRef.current, {
                opacity: 0.95,
                duration: 2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            })
        }

        timelineRef.current = tl

        return () => {
            tl.kill()
        }
    }, [isActive])

    if (!isActive) return null

    return (
        <div
            ref={sceneRef}
            className={`${styles.scene} ${styles.darknessScene} ${styles.frameJitter}`}
        >
            <div ref={textRef} className={styles.introText} style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: "'Courier New', monospace",
                fontSize: "clamp(0.8rem, 2vw, 1.2rem)",
                letterSpacing: "0.2em",
                color: "#e8e0d0",
                textAlign: "center",
                width: "100%",
                textShadow: "0 0 10px currentColor"
            }}></div>
        </div>
    )
}

export default DarknessScene

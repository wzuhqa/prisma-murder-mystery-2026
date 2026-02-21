import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function CameraFlashTransition() {
    const location = useLocation();
    const [isFlashing, setIsFlashing] = useState(false);
    const [prevPath, setPrevPath] = useState(location.pathname);

    useEffect(() => {
        if (location.pathname !== prevPath) {
            setPrevPath(location.pathname);
            setIsFlashing(true);

            // Simple Camera Flash / TV Glitch Effect using gsap
            const tl = gsap.timeline({
                onComplete: () => setIsFlashing(false),
            });

            tl.to('.global-transition-overlay', {
                opacity: 1,
                duration: 0.05,
                ease: "power4.in"
            })
                .to('.global-transition-overlay', {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
        }
    }, [location.pathname, prevPath]);

    if (!isFlashing) return null;

    return (
        <div
            className="global-transition-overlay"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#E5E5E5', // Bright white flash
                zIndex: 99999, // Above everything
                pointerEvents: 'none',
                opacity: 0,
                mixBlendMode: 'screen'
            }}
        />
    );
}

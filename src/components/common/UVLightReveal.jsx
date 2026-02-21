import React, { useState, useEffect } from 'react';

const UVLightReveal = () => {
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[40] mix-blend-screen transition-opacity duration-300"
            style={{
                background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 240, 255, 0.15) 0%, rgba(0, 150, 255, 0.05) 40%, transparent 80%)`
            }}
        >
            {/* Global UV CSS definitions that child clues can hook into */}
            <style>
                {`
                    .uv-clue {
                        color: #00f0ff;
                        text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        font-family: var(--nav-mono);
                        letter-spacing: 0.1em;
                        pointer-events: none;
                        user-select: none;
                    }

                    /* When the UV light (mouse) is near, we can use a clever trick if we wanted pure CSS, 
                       but since UV is just a screen blend layer globally, we actually need the clues 
                       to be somewhat visible ONLY when the blue light hits them. */

                    .uv-clue-container {
                        mix-blend-mode: color-dodge;
                        opacity: 0.7;
                    }
                `}
            </style>
        </div>
    );
};

export default UVLightReveal;

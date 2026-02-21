import React, { useState, useEffect } from 'react';
import './VHSHorrorGlitch.css';

/**
 * VHSHorrorGlitch Component
 * Creates an aggressive VHS tape distortion glitch effect for a name heading.
 * 
 * @param {string} text - The text to display and glitch.
 * @param {string} className - Additional CSS classes for the container.
 */
const VHSHorrorGlitch = ({ text, className = '' }) => {
    const [glitchState, setGlitchState] = useState('normal'); // 'normal', 'glitch', 'mega'
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const triggerGlitch = () => {
            // 10% chance for a mega glitch
            const isMega = Math.random() < 0.10;

            setGlitchState(isMega ? 'mega' : 'glitch');
            setIsGlitching(true);

            // Glitch duration: 400–600ms
            const duration = 400 + Math.random() * 200;

            setTimeout(() => {
                setIsGlitching(false);
                setGlitchState('normal');
            }, duration);
        };

        // Trigger glitch every 2000ms
        const interval = setInterval(triggerGlitch, 2000);

        return () => clearInterval(interval);
    }, []);

    const containerClasses = [
        'vhs-container',
        isGlitching ? 'vhs-glitch-active' : '',
        glitchState === 'mega' ? 'vhs-mega-glitch' : '',
        className
    ].join(' ').trim();

    return (
        <div className={containerClasses}>
            {/* Base flickering text */}
            <span className="vhs-text" data-text={text}>
                {text}
            </span>

            {/* RGB Separation Layers - only visible during glitch */}
            <span className="vhs-layer vhs-layer-red" aria-hidden="true">
                {text}
            </span>
            <span className="vhs-layer vhs-layer-cyan" aria-hidden="true">
                {text}
            </span>

            {/* Decorative Overlays */}
            <div className="vhs-scanlines" aria-hidden="true" />
            <div className="vhs-noise" aria-hidden="true" />

            {/* Mega Glitch Flash */}
            {glitchState === 'mega' && isGlitching && (
                <div className="vhs-red-flash" aria-hidden="true" />
            )}
        </div>
    );
};

export default VHSHorrorGlitch;


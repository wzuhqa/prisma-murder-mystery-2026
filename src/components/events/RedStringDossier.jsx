import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const RedStringDossier = ({ categoryRefs }) => {
    const [lineCoords, setLineCoords] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        const updateCoords = () => {
            if (!containerRef.current || categoryRefs.length < 2) return;

            const containerRect = containerRef.current.getBoundingClientRect();

            // Calculate coordinates for the folder tabs of each dossier
            const coords = categoryRefs.map(ref => {
                const el = ref.current;
                if (!el) return null;

                // Pin point: Find the folder tab
                const pin = el.querySelector('.folder-tab');
                if (!pin) return null;

                const rect = pin.getBoundingClientRect();
                return {
                    x: rect.left - containerRect.left + (rect.width * 0.15), // Offset slightly left for pin look
                    y: rect.top - containerRect.top + (rect.height * 0.5)
                };
            }).filter(c => c !== null);

            const segments = [];
            for (let i = 0; i < coords.length - 1; i++) {
                segments.push({
                    start: coords[i],
                    end: coords[i + 1]
                });
            }
            setLineCoords(segments);
        };

        // Update on mount, resize, and scroll (to handle sticky elements if any)
        const observer = new IntersectionObserver(updateCoords, { threshold: [0, 1] });
        categoryRefs.forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        updateCoords();
        window.addEventListener('resize', updateCoords);

        return () => {
            window.removeEventListener('resize', updateCoords);
            observer.disconnect();
        };
    }, [categoryRefs]);

    return (
        <div className="absolute inset-0 pointer-events-none z-[5] overflow-visible" ref={containerRef}>
            <svg className="w-full h-full overflow-visible">
                <defs>
                    <filter id="string-glow-noir" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.76  0 0 0 0 0.12  0 0 0 0 0.23  0 0 0 0.8 0" />
                        <feComposite in="SourceGraphic" operator="over" />
                    </filter>
                </defs>
                {lineCoords.map((segment, index) => (
                    <g key={index}>
                        {/* String Shadow */}
                        <motion.line
                            x1={segment.start.x} y1={segment.start.y}
                            x2={segment.end.x} y2={segment.end.y}
                            stroke="rgba(0,0,0,0.5)"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 1 + (index * 0.3) }}
                            transform="translate(2, 2)"
                        />
                        {/* Main Red String */}
                        <motion.line
                            x1={segment.start.x} y1={segment.start.y}
                            x2={segment.end.x} y2={segment.end.y}
                            stroke="#c41e3a"
                            strokeWidth="1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 1 + (index * 0.3) }}
                            filter="url(#string-glow-noir)"
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default RedStringDossier;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRedString } from '../../context/RedStringContext';
import './RedStringBreadcrumb.css';

const MAX_THICKNESS = 6;
const MIN_THICKNESS = 2;

// Simple Web Audio API synthesizer for a "paper crinkle/thud" sound
const playCrinkleSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        // Noise buffer
        const bufferSize = ctx.sampleRate * 0.1; // 100ms
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        // Filter to make it sound more like paper/thud than pure static
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

        // Envelope
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
    } catch (e) {
        // Ignore AudioContext errors (e.g., if user hasn't interacted yet)
    }
};

const RedStringBreadcrumb = () => {
    const navigate = useNavigate();
    const { visitedPages: history } = useRedString();

    // Track previous history length to know when to play sound
    const prevHistoryLengthRef = useRef(history?.length || 0);

    const containerRef = useRef(null);
    const [lineCoords, setLineCoords] = useState([]);

    // Play sound when a new node is added
    useEffect(() => {
        if (history && history.length > prevHistoryLengthRef.current) {
            playCrinkleSound();
        }
        prevHistoryLengthRef.current = history?.length || 0;
    }, [history]);


    // Calculate coordinates for the red string SVG lines
    useEffect(() => {
        if (!containerRef.current || !history || history.length < 2) {
            setLineCoords([]);
            return;
        }

        // Small delay to ensure DOM nodes are fully rendered before measuring
        const timeoutId = setTimeout(() => {
            if (!containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const nodeElements = Array.from(containerRef.current.querySelectorAll('.breadcrumb-node'));

            const coords = nodeElements.map(el => {
                const rect = el.getBoundingClientRect();
                return {
                    // Center of the node relative to the container
                    x: rect.left - containerRect.left + rect.width / 2,
                    y: rect.top - containerRect.top + rect.height / 2
                };
            });

            // Create line segments between consecutive nodes
            const segments = [];
            for (let i = 0; i < coords.length - 1; i++) {
                segments.push({
                    start: coords[i],
                    end: coords[i + 1]
                });
            }
            setLineCoords(segments);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [history]);

    if (history.length === 0) return null;

    return (
        <div className="breadcrumb-trail-container" ref={containerRef}>

            {/* SVG canvas for drawing the red strings */}
            {lineCoords.length > 0 && (
                <svg className="red-string-canvas">
                    <defs>
                        <filter id="string-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    <AnimatePresence>
                        {lineCoords.map((segment, index) => {
                            // Dynamic thickness based on how far along the history we are.
                            // The more nodes, the thicker the most recent string.
                            const baseThickness = Math.min(MIN_THICKNESS + (history.length * 0.5), MAX_THICKNESS);

                            return (
                                <g key={`segment-${index}`}>
                                    {/* Shadow Trail Route */}
                                    <motion.line
                                        x1={segment.start.x} y1={segment.start.y}
                                        x2={segment.end.x} y2={segment.end.y}
                                        className="red-string-shadow"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 0.4 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                    {/* Main Thread */}
                                    <motion.line
                                        x1={segment.start.x} y1={segment.start.y}
                                        x2={segment.end.x} y2={segment.end.y}
                                        className="red-string"
                                        strokeWidth={baseThickness}
                                        filter="url(#string-glow)"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                                        transition={{
                                            // Tension/Spring effect when string is drawn
                                            pathLength: { type: "spring", stiffness: 50, damping: 15 },
                                            opacity: { duration: 0.2 }
                                        }}
                                    />
                                    {/* Frayed Edge Overlay */}
                                    <motion.line
                                        x1={segment.start.x} y1={segment.start.y}
                                        x2={segment.end.x} y2={segment.end.y}
                                        className="red-string-fray"
                                        strokeWidth={baseThickness * 0.8}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 0.7 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            pathLength: { type: "spring", stiffness: 50, damping: 15, delay: 0.1 },
                                        }}
                                    />
                                </g>
                            );
                        })}
                    </AnimatePresence>
                </svg>
            )}

            {/* Breadcrumb Nodes */}
            <div className="breadcrumb-nodes-wrapper">
                <AnimatePresence mode="popLayout">
                    {history.map((node, index) => {
                        const isCurrent = index === history.length - 1;

                        // Generate a slight random rotation and offset for the "messy pinboard" look
                        // Using a deterministic approach based on the node ID so it doesn't change on re-renders
                        const _seed = node.id;
                        const randomRotation = (Math.sin(_seed) * 10).toFixed(1);
                        const randomYOffset = (Math.cos(_seed) * 15).toFixed(1);

                        return (
                            <motion.div
                                key={node.id}
                                className={`breadcrumb-node ${isCurrent ? 'is-current' : ''}`}
                                style={{
                                    '--rand-rot': `${randomRotation}deg`,
                                    '--rand-y': `${randomYOffset}px`
                                }}
                                initial={{ scale: 0, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                onClick={() => !isCurrent && navigate(node.path)}
                            >
                                {/* Visual "Pin" indicator */}
                                <div className="board-pin"></div>

                                {/* Node Label (Polaroid/Scrap paper style) */}
                                <div className="node-label">
                                    <span className="node-text">{node.label}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RedStringBreadcrumb;

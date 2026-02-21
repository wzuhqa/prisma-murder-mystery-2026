/**
 * Encrypted Stage Hero Section
 * Cinematic horror-tech festival hero featuring dark encrypted stage environment
 * with aggressive glitch effects, spotlight, smoke, and cyberpunk horror aesthetic
 */

import { useState, useEffect } from 'react'

const EncryptedStageHero = ({ className = '' }) => {
  const [glitchIntensity, setGlitchIntensity] = useState(0)
  const [lightningFlash, setLightningFlash] = useState(false)
  const [vhsTear, setVhsTear] = useState(false)

  // Random glitch spikes
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchIntensity(Math.random() * 0.5 + 0.3)
        setTimeout(() => setGlitchIntensity(0), 100 + Math.random() * 200)
      }
    }, 2000)
    return () => clearInterval(glitchInterval)
  }, [])

  // Random lightning flashes
  useEffect(() => {
    const lightningInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setLightningFlash(true)
        setTimeout(() => setLightningFlash(false), 50 + Math.random() * 100)
      }
    }, 8000)
    return () => clearInterval(lightningInterval)
  }, [])

  // VHS tear effect
  useEffect(() => {
    const vhsInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setVhsTear(true)
        setTimeout(() => setVhsTear(false), 80 + Math.random() * 150)
      }
    }, 12000)
    return () => clearInterval(vhsInterval)
  }, [])

  return (
    <div className={`encrypted-stage ${className}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');

        .encrypted-stage {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 700px;
          overflow: hidden;
          background: linear-gradient(180deg, #000000 0%, #020210 30%, #0a0a1a 60%, #050515 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* ===== BASE ATMOSPHERE ===== */
        .encrypted-stage::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 30% 20%, rgba(20, 0, 40, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(40, 0, 20, 0.3) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, rgba(5, 5, 20, 0.5) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        /* ===== STAGE FLOOR ===== */
        .stage-floor {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 35%;
          background: 
            linear-gradient(180deg, transparent 0%, rgba(10, 10, 20, 0.8) 30%, #0a0a12 100%),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 48px,
              rgba(30, 30, 50, 0.3) 48px,
              rgba(30, 30, 50, 0.3) 50px
            );
          transform: perspective(500px) rotateX(60deg);
          transform-origin: bottom center;
          z-index: 2;
        }

        .stage-floor::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.9) 0%,
            transparent 100%
          );
        }

        /* Metal grating texture */
        .metal-grating {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 25%;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(40, 40, 60, 0.15) 2px,
              rgba(40, 40, 60, 0.15) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 8px,
              rgba(30, 30, 50, 0.2) 8px,
              rgba(30, 30, 50, 0.2) 10px
            );
          z-index: 3;
        }

        /* ===== VOLUMETRIC SPOTLIGHT ===== */
        .spotlight-container {
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 150%;
          z-index: 4;
          pointer-events: none;
        }

        .spotlight-beam {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 300px;
          height: 100%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.08) 40%,
            rgba(255, 255, 255, 0.02) 100%
          );
          clip-path: polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%);
          filter: blur(2px);
          animation: spotlightPulse 4s ease-in-out infinite alternate;
        }

        @keyframes spotlightPulse {
          0% { opacity: 0.8; filter: blur(2px); }
          100% { opacity: 1; filter: blur(1px); }
        }

        /* God rays */
        .god-rays {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          height: 100%;
          background: 
            conic-gradient(
              from 270deg at 50% 0%,
              transparent 0deg,
              rgba(255, 255, 255, 0.03) 10deg,
              transparent 20deg,
              rgba(255, 255, 255, 0.02) 30deg,
              transparent 40deg
            );
          animation: godRayRotate 20s linear infinite;
        }

        @keyframes godRayRotate {
          0% { transform: translateX(-50%) rotate(0deg); }
          100% { transform: translateX(-50%) rotate(360deg); }
        }

        /* ===== SMOKE & HAZE ===== */
        .smoke-layer {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          overflow: hidden;
        }

        .smoke {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80%;
          background: 
            radial-gradient(ellipse at 50% 100%, rgba(20, 20, 40, 0.6) 0%, transparent 60%),
            radial-gradient(ellipse at 30% 80%, rgba(30, 20, 40, 0.3) 0%, transparent 40%),
            radial-gradient(ellipse at 70% 70%, rgba(20, 30, 40, 0.25) 0%, transparent 45%);
          animation: smokeDrift 15s ease-in-out infinite;
        }

        @keyframes smokeDrift {
          0%, 100% { transform: translateX(0) translateY(0); opacity: 0.7; }
          50% { transform: translateX(30px) translateY(-20px); opacity: 0.9; }
        }

        /* ===== DUST PARTICLES ===== */
        .dust-particles {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
        }

        .dust-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: dustFloat linear infinite;
        }

        .dust-particle:nth-child(1) { left: 45%; top: 30%; animation-duration: 8s; animation-delay: 0s; }
        .dust-particle:nth-child(2) { left: 52%; top: 45%; animation-duration: 12s; animation-delay: 2s; }
        .dust-particle:nth-child(3) { left: 48%; top: 55%; animation-duration: 10s; animation-delay: 4s; }
        .dust-particle:nth-child(4) { left: 55%; top: 35%; animation-duration: 9s; animation-delay: 1s; }
        .dust-particle:nth-child(5) { left: 50%; top: 60%; animation-duration: 11s; animation-delay: 3s; }
        .dust-particle:nth-child(6) { left: 47%; top: 40%; animation-duration: 7s; animation-delay: 5s; }
        .dust-particle:nth-child(7) { left: 53%; top: 50%; animation-duration: 13s; animation-delay: 2.5s; }
        .dust-particle:nth-child(8) { left: 49%; top: 65%; animation-duration: 8s; animation-delay: 1.5s; }

        @keyframes dustFloat {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-200px) translateX(30px); opacity: 0; }
        }

        /* ===== PERFORMER SILHOUETTE ===== */
        .performer-container {
          position: absolute;
          bottom: 25%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 7;
          pointer-events: none;
        }

        .performer-silhouette {
          position: relative;
          width: 180px;
          height: 350px;
          filter: brightness(0.3) contrast(1.2);
          animation: silhouetteBreath 6s ease-in-out infinite;
        }

        @keyframes silhouetteBreath {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .performer-silhouette::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(20, 20, 30, 0.9) 0%,
            rgba(10, 10, 20, 0.95) 50%,
            rgba(5, 5, 15, 1) 100%
          );
          clip-path: polygon(35% 0%, 65% 0%, 70% 15%, 75% 30%, 80% 100%, 20% 100%, 25% 30%, 30% 15%);
        }

        /* RGB Chromatic Split */
        .chromatic-layer {
          position: absolute;
          inset: 0;
          z-index: 8;
          mix-blend-mode: screen;
          opacity: 0.5;
          animation: chromaticSplit 3s ease-in-out infinite;
        }

        .chromatic-layer::before,
        .chromatic-layer::after {
          content: '';
          position: absolute;
          inset: 0;
          clip-path: polygon(35% 0%, 65% 0%, 70% 15%, 75% 30%, 80% 100%, 20% 100%, 25% 30%, 30% 15%);
        }

        .chromatic-layer::before {
          background: rgba(255, 0, 0, 0.3);
          transform: translateX(-4px);
          animation: chromaticRed 2s ease-in-out infinite;
        }

        .chromatic-layer::after {
          background: rgba(0, 255, 255, 0.2);
          transform: translateX(4px);
          animation: chromaticBlue 2s ease-in-out infinite;
        }

        @keyframes chromaticSplit {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes chromaticRed {
          0%, 100% { transform: translateX(-3px); }
          50% { transform: translateX(-6px); }
        }

        @keyframes chromaticBlue {
          0%, 100% { transform: translateX(3px); }
          50% { transform: translateX(6px); }
        }

        /* ===== GLITCH EFFECTS ===== */
        .glitch-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          opacity: ${glitchIntensity};
          transition: opacity 0.05s;
        }

        .glitch-overlay::before,
        .glitch-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: inherit;
        }

        .glitch-overlay::before {
          clip-path: inset(20% 0 60% 0);
          transform: translateX(${glitchIntensity * -20}px);
          background: rgba(255, 0, 0, 0.3);
          mix-blend-mode: screen;
        }

        .glitch-overlay::after {
          clip-path: inset(60% 0 20% 0);
          transform: translateX(${glitchIntensity * 20}px);
          background: rgba(0, 255, 255, 0.2);
          mix-blend-mode: screen;
        }

        /* Block displacement */
        .block-displacement {
          position: absolute;
          inset: 0;
          z-index: 11;
          pointer-events: none;
          opacity: ${glitchIntensity > 0.2 ? 1 : 0};
          transition: opacity 0.05s;
        }

        .block-displacement::before {
          content: '';
          position: absolute;
          top: 30%;
          left: 40%;
          width: 25%;
          height: 15%;
          background: rgba(0, 0, 0, 0.8);
          transform: translateX(${glitchIntensity * 50}px);
          box-shadow: 
            ${glitchIntensity * 30}px 0 0 rgba(255, 0, 0, 0.4),
            ${glitchIntensity * -30}px 0 0 rgba(0, 255, 255, 0.3);
        }

        /* Wave distortion */
        .wave-distortion {
          position: absolute;
          inset: 0;
          z-index: 12;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            rgba(255, 0, 0, 0.03) 1px,
            transparent 2px
          );
          animation: waveDistort 0.1s linear infinite;
          opacity: ${glitchIntensity};
        }

        @keyframes waveDistort {
          0% { transform: translateY(0); }
          100% { transform: translateY(3px); }
        }

        /* ===== TV STATIC / NOISE ===== */
        .static-noise {
          position: absolute;
          inset: 0;
          z-index: 13;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.05;
          animation: staticFlicker 0.1s steps(3) infinite;
          mix-blend-mode: overlay;
        }

        @keyframes staticFlicker {
          0% { opacity: 0.03; }
          50% { opacity: 0.08; }
          100% { opacity: 0.05; }
        }

        /* ===== SCAN LINES ===== */
        .scanlines {
          position: absolute;
          inset: 0;
          z-index: 14;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(139, 0, 0, 0.02) 2px,
            rgba(139, 0, 0, 0.02) 4px
          );
          animation: scanlineMove 0.1s linear infinite;
        }

        @keyframes scanlineMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        /* ===== FILM GRAIN ===== */
        .film-grain {
          position: absolute;
          inset: 0;
          z-index: 15;
          pointer-events: none;
          opacity: 0.08;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E");
          animation: grainShift 0.5s steps(10) infinite;
        }

        @keyframes grainShift {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(2%, 2%); }
          30% { transform: translate(-1%, 2%); }
          40% { transform: translate(2%, -1%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(1%, -2%); }
          70% { transform: translate(-1%, -1%); }
          80% { transform: translate(2%, 1%); }
          90% { transform: translate(-2%, 2%); }
          100% { transform: translate(0, 0); }
        }

        /* ===== VHS TEAR EFFECT ===== */
        .vhs-tear {
          position: absolute;
          inset: 0;
          z-index: 16;
          pointer-events: none;
          opacity: ${vhsTear ? 1 : 0};
          transition: opacity 0.05s;
          background: 
            linear-gradient(90deg, 
              transparent 0%, 
              rgba(255, 255, 255, 0.1) 5%, 
              transparent 10%,
              transparent 90%,
              rgba(255, 255, 255, 0.1) 95%,
              transparent 100%
            );
          animation: vhsTearAnim 0.15s linear;
        }

        .vhs-tear::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.15), transparent);
          transform: translateY(${vhsTear ? '0' : '-100%'});
          animation: vhsTearLine 0.15s linear;
        }

        @keyframes vhsTearAnim {
          0% { transform: skewX(-5deg); }
          50% { transform: skewX(5deg); }
          100% { transform: skewX(0); }
        }

        @keyframes vhsTearLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(0); }
        }

        /* ===== LIGHTNING FLASH ===== */
        .lightning-flash {
          position: absolute;
          inset: 0;
          z-index: 17;
          pointer-events: none;
          background: rgba(255, 255, 255, ${lightningFlash ? 0.3 : 0});
          transition: background 0.02s;
          z-index: 100;
        }

        .lightning-bolt {
          position: absolute;
          top: 0;
          left: 45%;
          width: 3px;
          height: 40%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(200, 200, 255, 0.6) 50%,
            transparent 100%
          );
          transform: rotate(5deg);
          opacity: 0;
          filter: blur(1px);
          z-index: 101;
        }

        /* ===== VIGNETTE ===== */
        .vignette {
          position: absolute;
          inset: 0;
          z-index: 18;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            transparent 20%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.7) 75%,
            rgba(0, 0, 0, 0.95) 100%
          );
        }

        /* ===== MAIN CONTENT ===== */
        .hero-content {
          position: relative;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 20px;
        }

        /* Main Title - SCHEDULED */
        .main-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(3rem, 10vw, 8rem);
          font-weight: 900;
          color: #8B0000;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          position: relative;
          text-shadow: 
            0 0 20px rgba(139, 0, 0, 0.8),
            0 0 40px rgba(139, 0, 0, 0.5),
            0 0 60px rgba(139, 0, 0, 0.3),
            0 0 80px rgba(139, 0, 0, 0.2);
          animation: titlePulse 3s ease-in-out infinite alternate;
          margin-bottom: 10px;
        }

        /* LED glow effect */
        .main-title::before {
          content: 'SCHEDULED';
          position: absolute;
          inset: 0;
          color: rgba(139, 0, 0, 0.3);
          text-shadow: 
            0 0 10px rgba(255, 0, 0, 0.8),
            0 0 20px rgba(255, 0, 0, 0.6),
            0 0 40px rgba(255, 0, 0, 0.4);
          animation: ledFlicker 0.15s infinite;
        }

        @keyframes titlePulse {
          0% { opacity: 0.9; }
          100% { opacity: 1; }
        }

        @keyframes ledFlicker {
          0%, 90%, 100% { opacity: 1; }
          92% { opacity: 0.8; }
          94% { opacity: 1; }
          96% { opacity: 0.7; }
          98% { opacity: 1; }
        }

        /* Subtitle - ARTIST IDENTITY ENCRYPTED */
        .subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(0.6rem, 2vw, 0.9rem);
          font-weight: 400;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: #D4AF37;
          position: relative;
          display: flex;
          align-items: center;
          gap: 15px;
          animation: subtitleGlitch 8s ease-in-out infinite;
        }

        .subtitle::before,
        .subtitle::after {
          content: '';
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
        }

        @keyframes subtitleGlitch {
          0%, 88%, 100% { opacity: 1; transform: translateX(0); }
          89% { opacity: 0.8; transform: translateX(2px); }
          90% { opacity: 1; transform: translateX(-2px); }
          91% { opacity: 0.9; }
          92% { transform: translateX(0); }
        }

        /* Circuit board decoration */
        .circuit-line {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200%;
          height: 200%;
          pointer-events: none;
          opacity: 0.05;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 49px,
              #D4AF37 49px,
              #D4AF37 51px,
              transparent 51px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 49px,
              #D4AF37 49px,
              #D4AF37 51px,
              transparent 51px
            );
          z-index: -1;
        }

        /* ===== UI LABELS ===== */
        .ui-labels {
          position: absolute;
          inset: 0;
          z-index: 60;
          pointer-events: none;
          padding: 30px;
        }

        .ui-label {
          position: absolute;
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(0.55rem, 1.5vw, 0.7rem);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ui-label.access {
          top: 30px;
          left: 30px;
          color: #8B0000;
          animation: accessFlicker 4s ease-in-out infinite;
        }

        .ui-label.signal {
          top: 30px;
          right: 30px;
          color: #FFB454;
          animation: signalFlicker 3s ease-in-out infinite;
        }

        .ui-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: dotBlink 1s ease-in-out infinite;
        }

        .ui-label.access .ui-dot {
          background: #8B0000;
          box-shadow: 0 0 10px rgba(139, 0, 0, 0.8);
        }

        .ui-label.signal .ui-dot {
          background: #FFB454;
          box-shadow: 0 0 10px rgba(255, 180, 84, 0.8);
          animation: dotBlinkWarning 0.8s ease-in-out infinite;
        }

        @keyframes accessFlicker {
          0%, 90%, 100% { opacity: 1; }
          91% { opacity: 0.6; }
          92% { opacity: 1; }
          93% { opacity: 0.4; }
          94% { opacity: 1; }
        }

        @keyframes signalFlicker {
          0%, 80%, 100% { opacity: 1; }
          81% { opacity: 0.7; }
          82% { opacity: 1; }
          85% { opacity: 0.5; }
          86% { opacity: 1; }
        }

        @keyframes dotBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes dotBlinkWarning {
          0%, 40%, 100% { opacity: 1; }
          20% { opacity: 0.3; }
        }

        /* ===== BUTTONS ===== */
        .hero-buttons {
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 70;
          display: flex;
          gap: 25px;
        }

        .hero-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(0.65rem, 1.8vw, 0.8rem);
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 15px 35px;
          border: none;
          cursor: pointer;
          position: relative;
          background: transparent;
          transition: all 0.3s ease;
        }

        /* Decrypt Lineup Button */
        .btn-decrypt {
          color: #8B0000;
          border: 1.5px solid rgba(139, 0, 0, 0.6);
        }

        .btn-decrypt::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(139, 0, 0, 0.1);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-decrypt:hover::before {
          opacity: 1;
        }

        .btn-decrypt::after {
          content: '';
          position: absolute;
          inset: -2px;
          border: 1.5px solid rgba(139, 0, 0, 0.3);
          opacity: 0;
          animation: neonPulse 2s ease-in-out infinite;
        }

        .btn-decrypt:hover::after {
          opacity: 1;
        }

        @keyframes neonPulse {
          0%, 100% { 
            box-shadow: 
              0 0 5px rgba(139, 0, 0, 0.5),
              0 0 10px rgba(139, 0, 0, 0.3),
              inset 0 0 5px rgba(139, 0, 0, 0.1);
            opacity: 0.5;
          }
          50% { 
            box-shadow: 
              0 0 15px rgba(139, 0, 0, 0.8),
              0 0 30px rgba(139, 0, 0, 0.5),
              inset 0 0 10px rgba(139, 0, 0, 0.2);
            opacity: 1;
          }
        }

        /* Register Access Button */
        .btn-register {
          color: #D4AF37;
          border: 1.5px solid rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), transparent);
        }

        .btn-register:hover {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
          box-shadow: 
            0 0 20px rgba(212, 175, 55, 0.2),
            inset 0 0 20px rgba(212, 175, 55, 0.1);
        }

        /* ===== ANAMORPHIC LENS FLARE ===== */
        .lens-flare {
          position: absolute;
          top: 15%;
          left: 20%;
          width: 200px;
          height: 8px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 200, 150, 0.1) 30%,
            rgba(255, 200, 150, 0.3) 50%,
            rgba(255, 200, 150, 0.1) 70%,
            transparent 100%
          );
          transform: rotate(-15deg);
          filter: blur(2px);
          z-index: 19;
          pointer-events: none;
        }

        .lens-flare::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -100px;
          width: 150px;
          height: 150px;
          background: radial-gradient(
            circle,
            rgba(255, 200, 150, 0.1) 0%,
            transparent 70%
          );
          transform: translateY(-50%);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .hero-buttons {
            flex-direction: column;
            gap: 15px;
            bottom: 40px;
          }

          .ui-labels {
            padding: 15px;
          }

          .ui-label {
            font-size: 0.6rem;
          }

          .circuit-line {
            display: none;
          }

          .performer-container {
            bottom: 30%;
          }

          .performer-silhouette {
            width: 120px;
            height: 250px;
          }
        }
      `}</style>

      {/* Lightning Flash */}
      <div className="lightning-flash">
        <div className="lightning-bolt"></div>
      </div>

      {/* Stage Floor */}
      <div className="stage-floor"></div>
      <div className="metal-grating"></div>

      {/* Spotlight */}
      <div className="spotlight-container">
        <div className="spotlight-beam"></div>
        <div className="god-rays"></div>
      </div>

      {/* Smoke */}
      <div className="smoke-layer">
        <div className="smoke"></div>
      </div>

      {/* Dust Particles */}
      <div className="dust-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="dust-particle"></div>
        ))}
      </div>

      {/* Performer Silhouette */}
      <div className="performer-container">
        <div className="performer-silhouette">
          <div className="chromatic-layer"></div>
        </div>
      </div>

      {/* Glitch Effects */}
      <div className="glitch-overlay"></div>
      <div className="block-displacement"></div>
      <div className="wave-distortion"></div>

      {/* Static Noise */}
      <div className="static-noise"></div>

      {/* Scan Lines */}
      <div className="scanlines"></div>

      {/* Film Grain */}
      <div className="film-grain"></div>

      {/* VHS Tear */}
      <div className="vhs-tear"></div>

      {/* Lens Flare */}
      <div className="lens-flare"></div>

      {/* Vignette */}
      <div className="vignette"></div>

      {/* UI Labels */}
      <div className="ui-labels">
        <div className="ui-label access">
          <span className="ui-dot"></span>
          Access Level: Restricted
        </div>
        <div className="ui-label signal">
          <span className="ui-dot"></span>
          Signal Status: Unstable
        </div>
      </div>

      {/* Main Content */}
      <div className="hero-content">
        <div className="circuit-line"></div>
        <h1 className="main-title">SCHEDULED</h1>
        <p className="subtitle">
          Artist Identity Encrypted
        </p>
      </div>

      {/* Buttons */}
      <div className="hero-buttons">
        <button className="hero-btn btn-decrypt">
          Decrypt Lineup
        </button>
        <button className="hero-btn btn-register">
          Register Access
        </button>
      </div>
    </div>
  )
}

export default EncryptedStageHero


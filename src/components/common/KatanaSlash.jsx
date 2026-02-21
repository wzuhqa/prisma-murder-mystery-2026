import { useEffect, useRef, useState, useCallback } from 'react'

// Particle class for slash particle spray
class SlashParticle {
  constructor(x, y, angle) {
    this.x = x
    this.y = y
    this.vx = Math.cos(angle) * (Math.random() * 8 + 4)
    this.vy = Math.sin(angle) * (Math.random() * 8 + 4)
    this.size = Math.random() * 3 + 1
    this.life = 30
    this.maxLife = 30
    this.color = Math.random() > 0.5 ? '#dc2626' : '#ef4444'
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vx *= 0.95
    this.vy *= 0.95
    this.life--
    return this.life > 0
  }

  draw(ctx) {
    const alpha = (this.life / this.maxLife) * 0.8
    ctx.globalAlpha = alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

const KatanaSlash = ({ isActive, onComplete }) => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)
  const [phase, setPhase] = useState('idle') // idle, slash, slice, fade
  const [reducedMotion, setReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handler = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Create particles along slash path
  const createParticles = useCallback((width, height) => {
    const particleCount = 30
    
    for (let i = 0; i < particleCount; i++) {
      // Particles along the diagonal slash path
      const progress = Math.random()
      const x = progress * width
      const y = progress * height
      const angle = Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 2
      
      particlesRef.current.push(new SlashParticle(x, y, angle))
    }
  }, [])

  // Animate particles
  useEffect(() => {
    if (!isActive || reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current = particlesRef.current.filter(p => {
        const alive = p.update()
        if (alive) p.draw(ctx)
        return alive
      })

      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    
    // Start animation if there are particles
    if (particlesRef.current.length > 0) {
      animate()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, reducedMotion])

  // Main animation sequence
  useEffect(() => {
    if (!isActive) {
      setPhase('idle')
      particlesRef.current = []
      return
    }

    if (reducedMotion) {
      // Skip directly to fade for reduced motion
      setPhase('fade')
      setTimeout(() => {
        onComplete?.()
      }, 300)
      return
    }

    // Full animation sequence
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Phase 1: Slash (150-200ms)
    setPhase('slash')
    createParticles(window.innerWidth, window.innerHeight)
    
    // Screen shake
    document.body.style.animation = 'none'
    document.body.offsetHeight // Trigger reflow
    document.body.style.animation = 'screenShake 0.15s ease-out'

    // Phase 2: Slice effect (after slash)
    const slashTimer = setTimeout(() => {
      setPhase('slice')
    }, 180)

    // Phase 3: Fade to new content
    const sliceTimer = setTimeout(() => {
      setPhase('fade')
    }, 350)

    // Complete
    const completeTimer = setTimeout(() => {
      document.body.style.animation = ''
      onComplete?.()
    }, 600)

    return () => {
      clearTimeout(slashTimer)
      clearTimeout(sliceTimer)
      clearTimeout(completeTimer)
      document.body.style.animation = ''
    }
  }, [isActive, reducedMotion, createParticles, onComplete])

  if (!isActive) return null

  return (
    <div className="katana-slash-container">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="katana-particle-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />

      {/* Dark overlay */}
      <div 
        className={`katana-overlay ${phase === 'slash' || phase === 'slice' ? 'active' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          opacity: phase === 'slash' || phase === 'slice' ? 1 : 0,
          transition: 'opacity 0.15s ease-out',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />

      {/* Katana slash line */}
      {phase === 'slash' && !reducedMotion && (
        <div className="katana-slash-line" />
      )}

      {/* Slice effect - content split */}
      {phase === 'slice' && !reducedMotion && (
        <>
          <div className="katana-slice-top" />
          <div className="katana-slice-bottom" />
        </>
      )}

      <style>{`
        .katana-slash-line {
          position: fixed;
          top: 0;
          left: 0;
          width: 200%;
          height: 4px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            #dc2626 10%, 
            #ef4444 30%, 
            #fff 50%, 
            #ef4444 70%, 
            #dc2626 90%, 
            transparent 100%
          );
          transform-origin: top left;
          transform: rotate(45deg) translateX(-50%);
          animation: slashDraw 0.18s ease-out forwards;
          box-shadow: 
            0 0 20px #ef4444,
            0 0 40px #dc2626,
            0 0 60px rgba(239, 68, 68, 0.5);
          z-index: 10000;
          pointer-events: none;
        }

        .katana-slice-top {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to bottom, rgba(10, 10, 15, 0.9), transparent);
          animation: sliceUp 0.3s ease-out forwards;
          z-index: 9997;
          pointer-events: none;
        }

        .katana-slice-bottom {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to top, rgba(10, 10, 15, 0.9), transparent);
          animation: sliceDown 0.3s ease-out forwards;
          z-index: 9997;
          pointer-events: none;
        }

        @keyframes slashDraw {
          0% {
            transform: rotate(45deg) translateX(-100%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: rotate(45deg) translateX(0%);
            opacity: 1;
          }
        }

        @keyframes sliceUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes sliceDown {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes screenShake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5px, -3px); }
          20% { transform: translate(5px, 3px); }
          30% { transform: translate(-4px, 2px); }
          40% { transform: translate(4px, -2px); }
          50% { transform: translate(-3px, 3px); }
          60% { transform: translate(3px, -3px); }
          70% { transform: translate(-2px, 2px); }
          80% { transform: translate(2px, -1px); }
          90% { transform: translate(-1px, 1px); }
        }
      `}</style>
    </div>
  )
}

export default KatanaSlash

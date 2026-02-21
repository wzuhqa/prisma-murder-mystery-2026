import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Ticket, ChevronDown } from 'lucide-react'

const CinematicHero = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    
    // Generate floating dust particles - reduced count for performance
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)

    // Random micro flicker every 3-4 seconds
    const flickerInterval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 150)
    }, 3500 + Math.random() * 500)

    return () => clearInterval(flickerInterval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0d0d1a] to-[#050508]" />
      
      {/* Animated film grain texture overlay - optimized with will-change */}
      <div 
        className="absolute inset-0 pointer-events-none animate-grain opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          willChange: 'transform',
        }}
      />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />
      
      {/* Red ambient rim light behind text with enhanced glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-blood/10 rounded-full blur-[150px] animate-pulse-glow" />
      </div>

      {/* Floating dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              animation: `floatParticle ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Light sweep animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-[-50%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
          style={{
            animation: 'lightSweep 8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Sharp L-shaped corner accents - 1px precise borders */}
      <div className="absolute top-5 left-5 w-10 h-10 border-l border-blood/60 border-t border-blood/60" />
      <div className="absolute top-5 right-5 w-10 h-10 border-r border-blood/60 border-t border-blood/60" />
      <div className="absolute bottom-5 left-5 w-10 h-10 border-l border-blood/60 border-b border-blood/60" />
      <div className="absolute bottom-5 right-5 w-10 h-10 border-r border-blood/60 border-b border-blood/60" />

      {/* Main content */}
      <div 
        className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Top label - pill-shaped with full rounded corners */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-gold/30 text-gold font-mono text-xs tracking-[3px] uppercase">
            <span className="w-1.5 h-1.5 bg-blood rounded-full animate-pulse" />
            SRM University Delhi-NCR
          </span>
        </div>

        {/* Main title with glow and glitch effects */}
        <div className="relative mb-4">
          {/* Crimson glow behind title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[100%] bg-blood/20 rounded-full blur-[40px] pointer-events-none animate-pulse-glow" />
          
          {/* Scanline effect */}
          <div className="scanline-effect" />
          
          <h1 
            className={`font-serif text-7xl md:text-9xl lg:text-[10rem] font-bold tracking-[0.15em] text-blood relative ${isGlitching ? 'glitch-active' : ''}`}
            style={{
              textShadow: '0 0 80px rgba(180, 20, 30, 0.4), 0 0 120px rgba(180, 20, 30, 0.2)',
            }}
            data-text="PRISMA"
          >
            PRISMA
            
            {/* RGB Chromatic aberration layers */}
            <span className="absolute top-0 left-0 text-red-500/40 opacity-0 animate-chromatic-r pointer-events-none" aria-hidden="true">
              PRISMA
            </span>
            <span className="absolute top-0 left-0 text-cyan-400/40 opacity-0 animate-chromatic-l pointer-events-none" aria-hidden="true">
              PRISMA
            </span>
          </h1>
          
          {/* Micro flicker effect overlay */}
          <div className={`absolute inset-0 bg-blood/10 pointer-events-none ${isGlitching ? 'opacity-100' : 'opacity-0'} transition-opacity duration-75`} />
        </div>

        {/* Subtitle */}
        <div className="mb-3">
          <span className="font-sans text-lg md:text-xl text-chalk/60 tracking-[6px] uppercase">
            Annual Tech & Cultural Fest
          </span>
        </div>

        {/* Hashtag */}
        <p className="font-serif text-xl md:text-2xl text-gold italic mb-6">
          #TheMysteryUnfolds
        </p>

        {/* Date */}
        <p className="font-mono text-sm text-chalk/40 tracking-wider mb-12">
          28 February to 1 March 2026
        </p>

        {/* CTA Buttons - 6px radius */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            to="/events"
            className="group flex items-center gap-3 px-8 py-4 rounded-md bg-transparent border border-blood/40 text-chalk hover:bg-blood/10 hover:border-blood/60 transition-all duration-300"
            style={{
              boxShadow: '0 0 20px rgba(180, 20, 30, 0.1)',
            }}
          >
            <Search size={18} className="text-blood" />
            <span className="font-medium">Investigate Events</span>
            <span className="text-blood group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/register"
            className="group flex items-center gap-3 px-8 py-4 rounded-md bg-transparent border border-gold/40 text-chalk hover:bg-gold/10 hover:border-gold/60 transition-all duration-300"
            style={{
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)',
            }}
          >
            <Ticket size={18} className="text-gold" />
            <span className="font-medium">Grab Your Passes</span>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="w-6 h-10 rounded-full border border-chalk/20 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 bg-chalk/60 rounded-full animate-bounce" />
        </div>
        <span className="font-mono text-[10px] text-chalk/40 tracking-[4px] uppercase">Scroll</span>
      </div>

      <style>{`
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }

        @keyframes lightSweep {
          0%, 100% {
            transform: translateX(-50%) skewX(12deg);
          }
          50% {
            transform: translateX(50%) skewX(12deg);
          }
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes chromatic-r {
          0%, 100% {
            clip-path: inset(50% 0 30% 0);
            transform: translate(2px, 0);
            opacity: 0;
          }
          20% {
            clip-path: inset(20% 0 60% 0);
            transform: translate(-2px, 0);
            opacity: 0.3;
          }
          40% {
            clip-path: inset(60% 0 10% 0);
            transform: translate(2px, 0);
            opacity: 0;
          }
          60% {
            clip-path: inset(10% 0 70% 0);
            transform: translate(-2px, 0);
            opacity: 0.2;
          }
          80% {
            clip-path: inset(40% 0 30% 0);
            transform: translate(2px, 0);
            opacity: 0;
          }
        }

        @keyframes chromatic-l {
          0%, 100% {
            clip-path: inset(50% 0 30% 0);
            transform: translate(-2px, 0);
            opacity: 0;
          }
          20% {
            clip-path: inset(20% 0 60% 0);
            transform: translate(2px, 0);
            opacity: 0.3;
          }
          40% {
            clip-path: inset(60% 0 10% 0);
            transform: translate(-2px, 0);
            opacity: 0;
          }
          60% {
            clip-path: inset(10% 0 70% 0);
            transform: translate(2px, 0);
            opacity: 0.2;
          }
          80% {
            clip-path: inset(40% 0 30% 0);
            transform: translate(-2px, 0);
            opacity: 0;
          }
        }

        .animate-grain {
          animation: grain 0.5s steps(10) infinite;
          will-change: transform;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
          will-change: opacity;
        }

        .animate-chromatic-r {
          animation: chromatic-r 3.5s linear infinite;
          will-change: transform, opacity;
        }

        .animate-chromatic-l {
          animation: chromatic-l 3.5s linear infinite;
          animation-delay: 0.1s;
          will-change: transform, opacity;
        }

        .bg-radial-gradient {
          background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
        }

        /* Scanline effect */
        .scanline-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(180, 20, 30, 0.4) 50%,
            transparent 100%
          );
          animation: scanline-move 4s linear infinite;
          opacity: 0.5;
          pointer-events: none;
          will-change: transform, opacity;
        }

        @keyframes scanline-move {
          0% {
            top: -2px;
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        /* Glitch active state */
        .glitch-active {
          animation: glitch-shake 0.15s ease-in-out;
        }

        @keyframes glitch-shake {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }

        @media (max-width: 768px) {
          .scanline-effect {
            height: 1px;
          }
        }
      `}</style>
    </section>
  )
}

export default CinematicHero


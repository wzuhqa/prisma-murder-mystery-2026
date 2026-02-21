import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Deterministic grid timing (no Math.random during render)
const GRID_LINES = (() => {
  const horizontal = []
  const vertical = []
  for (let i = 0; i < 20; i++) {
    horizontal.push({
      id: `h-${i}`,
      top: `${i * 5}%`,
      duration: 2.1 + (i % 5) * 0.35,
      delay: ((i * 0.17) % 20) / 10, // 0..2
    })
    vertical.push({
      id: `v-${i}`,
      left: `${i * 5}%`,
      duration: 2.4 + (i % 6) * 0.28,
      delay: ((i * 0.23) % 20) / 10, // 0..2
    })
  }
  return { horizontal, vertical }
})()

// Typewriter effect component for boot text
const TypewriterText = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed + Math.random() * 30)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className="font-mono">
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-2 h-4 bg-red-500 ml-1 align-middle"
      />
    </span>
  )
}

// Flickering grid lines background
const GridBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines */}
      {GRID_LINES.horizontal.map((line) => (
        <motion.div
          key={line.id}
          className="absolute w-full h-px bg-red-500/10"
          style={{ top: line.top }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scaleX: [0.8, 1, 0.8]
          }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            delay: line.delay
          }}
        />
      ))}
      {/* Vertical lines */}
      {GRID_LINES.vertical.map((line) => (
        <motion.div
          key={line.id}
          className="absolute h-full w-px bg-red-500/10"
          style={{ left: line.left }}
          animate={{
            opacity: [0.05, 0.12, 0.05],
            scaleY: [0.9, 1, 0.9]
          }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            delay: line.delay
          }}
        />
      ))}
    </div>
  )
}

// Glitch effect component
const GlitchText = ({ text, className = '' }) => {
  const glitchChars = ['█', '▓', '▒', '░', '█', '?', '!', '@', '#', '$']

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      {/* Red glitch layer */}
      <motion.span
        className="absolute top-0 left-0 text-red-500/80 z-20 overflow-hidden"
        animate={{
          opacity: [0, 0.8, 0],
          x: [-3, 3, -2, 2, 0]
        }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
      >
        {text.split('').map((char, i) => (
          <span key={i}>{glitchChars[i % glitchChars.length]}</span>
        ))}
      </motion.span>
      {/* Cyan glitch layer */}
      <motion.span
        className="absolute top-0 left-0 text-cyan-500/60 z-20 overflow-hidden"
        animate={{
          opacity: [0, 0.6, 0],
          x: [3, -3, 2, -2, 0]
        }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3.2 }}
      >
        {text.split('').map((char, i) => (
          <span key={i}>{glitchChars[(i + 3) % glitchChars.length]}</span>
        ))}
      </motion.span>
    </span>
  )
}

// Scanning progress bar
const ScanProgressBar = ({ progress }) => {
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-xs text-red-500/80 tracking-widest">SCANNING DATABASE</span>
        <span className="font-mono text-sm text-red-400">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="relative h-2 bg-red-900/30 rounded overflow-hidden border border-red-500/20">
        {/* Scan line effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Progress fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress glow */}
          <div className="h-full bg-gradient-to-r from-transparent via-red-300/50 to-transparent" />
        </motion.div>
        {/* Scan line */}
        <motion.div
          className="absolute top-0 h-full w-1 bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
          animate={{ left: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  )
}

// Data decoding animation (scrolling terminal text)
const DataDecoder = () => {
  const dataLines = useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz@#$%^&*()[]{}|;:,.<>?/\\'
    const lines = []
    for (let i = 0; i < 50; i++) {
      let line = ''
      for (let j = 0; j < 80; j++) {
        const randomIndex = Math.floor((Math.sin(i * 80 + j) * 0.5 + 0.5) * chars.length)
        line += chars[randomIndex % chars.length]
      }
      lines.push(line)
    }
    return lines
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      <motion.div
        className="font-mono text-[8px] leading-tight text-red-500/60"
        animate={{ y: [0, -1000] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {dataLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </motion.div>
      <motion.div
        className="font-mono text-[8px] leading-tight text-red-500/60"
        animate={{ y: [0, -1000] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
          delay: -20
        }}
      >
        {dataLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </motion.div>
    </div>
  )
}

// System status lines
const SystemStatus = ({ isActive }) => {
  const statuses = useMemo(() => [
    { text: 'INITIALIZING SECURITY PROTOCOLS...', delay: 0, duration: 800 },
    { text: 'LOADING CRIMINAL DATABASE...', delay: 1, duration: 600 },
    { text: 'CONNECTING TO NCIC ARCHIVES...', delay: 2, duration: 700 },
    { text: 'DECRYPTING EVIDENCE FILES...', delay: 3, duration: 900 },
    { text: 'VERIFYING BIOMETRIC DATA...', delay: 4, duration: 500 },
    { text: 'ACCESSING CASE FILES...', delay: 5, duration: 600 },
    { text: 'SYSTEM READY', delay: 6, duration: 1000, isSuccess: true },
  ], [])

  const [completedStatuses, setCompletedStatuses] = useState([])

  useEffect(() => {
    if (!isActive) return

    const timers = statuses.map((status, index) => {
      return setTimeout(() => {
        setCompletedStatuses(prev => [...prev, index])
      }, status.delay * 800 + 500)
    })

    return () => timers.forEach(clearTimeout)
  }, [isActive, statuses])

  return (
    <div className="space-y-1 mt-6">
      {statuses.map((status, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{
            opacity: completedStatuses.includes(index) ? 1 : 0,
            x: completedStatuses.includes(index) ? 0 : -20
          }}
          transition={{ duration: 0.3 }}
          className="font-mono text-xs flex items-center gap-2"
        >
          <span className={`w-2 h-2 rounded-full ${status.isSuccess ? 'bg-green-500' : 'bg-red-500/60'}`}
            style={{
              boxShadow: status.isSuccess
                ? '0 0 6px rgba(34,197,94,0.8)'
                : '0 0 6px rgba(239,68,68,0.6)',
              animation: 'pulse 1s ease-in-out infinite'
            }}
          />
          <span className={status.isSuccess ? 'text-green-400' : 'text-red-500/70'}>
            {status.text}
          </span>
          {status.isSuccess && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-green-400"
            >
              █
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Main Forensic Database Boot Sequence
const ForensicDatabaseLoader = ({ onComplete }) => {
  const [phase, setPhase] = useState('boot') // boot, scan, complete
  const [progress, setProgress] = useState(0)
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [showGlitch, setShowGlitch] = useState(false)
  const [isFading, setIsFading] = useState(false)

  // Boot text typing
  const bootText = "FORENSIC DATABASE INITIALIZING..."

  // Progress simulation
  useEffect(() => {
    if (phase === 'boot' || phase === 'scan') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 100
          }
          // Accelerate as we progress
          const increment = prev < 30 ? 0.8 : prev < 60 ? 1.2 : prev < 80 ? 1.8 : 2.5
          return prev + increment + Math.random() * 0.5
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [phase])

  // Phase transitions
  useEffect(() => {
    if (isTypingComplete && phase === 'boot') {
      const timer = setTimeout(() => {
        setPhase('scan')
        setShowGlitch(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isTypingComplete, phase])

  useEffect(() => {
    if (progress >= 95 && phase === 'scan') {
      const timer = setTimeout(() => {
        setPhase('complete')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [progress, phase])

  useEffect(() => {
    if (phase === 'complete') {
      const timer = setTimeout(() => {
        setIsFading(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [phase])

  useEffect(() => {
    if (isFading) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [isFading, onComplete])

  const handleSkip = () => {
    setIsFading(true)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFading ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Scan lines overlay */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-scanlines opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.15) 2px,
                rgba(0,0,0,0.15) 4px
              )`
            }}
          />
        </div>

        {/* CRT flicker effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 bg-red-500/5"
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 0.1, repeat: Infinity }}
        />

        {/* Grid background */}
        <GridBackground />

        {/* Data decoder scrolling */}
        <DataDecoder />

        {/* Main content */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-8">

          {/* Header decoration */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 left-8 right-8"
          >
            <div className="flex items-center justify-between border-b border-red-500/30 pb-2">
              <div className="font-mono text-xs text-red-500/60 tracking-widest">
                ◆ FORENSIC ANALYSIS SYSTEM v2.47
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-red-500/40">
                  SECURE CONNECTION
                </span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                  style={{ boxShadow: '0 0 8px rgba(34,197,94,0.8)' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Boot text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="font-mono text-2xl md:text-3xl text-red-500 tracking-wider">
              <TypewriterText
                text={bootText}
                speed={40}
                onComplete={() => setIsTypingComplete(true)}
              />
            </h1>
          </motion.div>

          {/* Glitch transition */}
          {showGlitch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <GlitchText
                text="// DATABASE BREACH DETECTED"
                className="font-mono text-lg text-red-400"
              />
            </motion.div>
          )}

          {/* Progress bar */}
          <ScanProgressBar progress={Math.min(progress, 100)} isComplete={progress >= 100} />

          {/* System status */}
          <SystemStatus isActive={phase !== 'boot'} />

          {/* Complete message */}
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 text-center"
            >
              <GlitchText
                text="◆ ACCESS GRANTED ◆"
                className="font-mono text-xl text-green-500"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-mono text-sm text-red-500/60 mt-4"
              >
                LOADING MAIN INTERFACE...
              </motion.p>
            </motion.div>
          )}

          {/* Corner decorations */}
          <div className="absolute top-20 left-8 w-16 h-16 pointer-events-none">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <path d="M0 15 L0 0 L15 0" stroke="currentColor" strokeWidth="1" fill="none" className="text-red-500/40" />
              <path d="M0 45 L0 60 L15 60" stroke="currentColor" strokeWidth="1" fill="none" className="text-red-500/20" />
            </svg>
          </div>
          <div className="absolute top-20 right-8 w-16 h-16 pointer-events-none">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <path d="M60 15 L60 0 L45 0" stroke="currentColor" strokeWidth="1" fill="none" className="text-red-500/40" />
              <path d="M60 45 L60 60 L45 60" stroke="currentColor" strokeWidth="1" fill="none" className="text-red-500/20" />
            </svg>
          </div>

          {/* Bottom info bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-8 right-8"
          >
            <div className="flex justify-between items-center border-t border-red-500/20 pt-2">
              <div className="font-mono text-xs text-red-500/40">
                CASE ID: PRISMA-2024 | CLASSIFIED
              </div>
              <div className="font-mono text-xs text-red-500/40">
                {new Date().toLocaleTimeString('en-US', { hour12: false })} UTC
              </div>
            </div>
          </motion.div>

          {/* Skip button */}
          {phase !== 'complete' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 px-6 py-2 bg-red-900/20 border border-red-500/30 text-red-500/60 font-mono text-xs tracking-widest hover:border-red-500/60 hover:text-red-400 transition-all cursor-pointer"
              onClick={handleSkip}
            >
              [ SKIP ]
            </motion.button>
          )}
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-15"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)'
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default ForensicDatabaseLoader


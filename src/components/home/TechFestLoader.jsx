import { useState, useEffect } from 'react'

// Typewriter effect
const TypewriterText = ({ text, speed = 40, onComplete, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-0.5 h-5 ml-0.5 align-middle"
        style={{ backgroundColor: '#00FFFF', boxShadow: '0 0 10px #00FFFF' }}
      />
    </span>
  )
}

// Data flicker effect
const DataFlicker = ({ children, className = '' }) => {
  return (
    <motion.span
      className={className}
      animate={{ opacity: [1, 0.88, 1, 0.92, 1] }}
      transition={{ 
        duration: 0.15, 
        repeat: Infinity, 
        repeatDelay: 2.5 
      }}
    >
      {children}
    </motion.span>
  )
}

// Radar scanner with continuous rotation
const RadarScanner = () => {
  return (
    <div className="relative w-72 h-72">
      {/* Grid background */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '18px 18px'
        }}
      />
      
      {/* Concentric circles */}
      {[0.3, 0.5, 0.7, 1].map((scale, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            left: `${(1 - scale) * 50}%`,
            top: `${(1 - scale) * 50}%`,
            borderColor: 'rgba(0,255,255,0.15)',
            borderWidth: '1px'
          }}
        />
      ))}
      
      {/* Rotating scan line */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-1/2 h-0.5 origin-left"
        style={{
          background: 'linear-gradient(90deg, #00FFFF, rgba(0,255,255,0.2), transparent)',
          boxShadow: '0 0 15px #00FFFF, 0 0 30px rgba(0,255,255,0.5)'
        }}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      />
      
      {/* Center dot */}
      <div 
        className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: '#00FFFF',
          boxShadow: '0 0 20px #00FFFF, 0 0 40px rgba(0,255,255,0.5)'
        }}
      />
    </div>
  )
}

// Holographic panel at different depths
const HoloPanel = ({ label, icon, isRevealed, delay, depth = 0 }) => {
  const zDepths = [10, 20, 15, 25]
  
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ zIndex: zDepths[depth] }}
      initial={{ opacity: 0, scale: 0.5, filter: 'blur(8px)', y: 30 }}
      animate={{ 
        opacity: isRevealed ? 1 : 0.25, 
        scale: isRevealed ? 1 : 0.7,
        filter: isRevealed ? 'blur(0px)' : 'blur(4px)',
        y: 0
      }}
      transition={{ duration: 0.25, delay: delay / 1000, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Panel base */}
      <div className="relative p-4 bg-gray-900/85 backdrop-blur-md border rounded-lg"
        style={{ 
          borderColor: isRevealed ? '#00FFFF' : 'rgba(0,255,255,0.2)',
          boxShadow: isRevealed 
            ? '0 0 30px rgba(0,255,255,0.35), inset 0 0 25px rgba(0,255,255,0.08)' 
            : 'none',
          transform: `rotate(${-2 + depth}deg)`
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 rounded-tl" 
          style={{ borderColor: '#00FFFF' }} />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 rounded-tr" 
          style={{ borderColor: '#00FFFF' }} />
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 rounded-bl" 
          style={{ borderColor: '#00FFFF' }} />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 rounded-br" 
          style={{ borderColor: '#00FFFF' }} />
        
        {/* Content */}
        <div className="text-center">
          <div className="text-3xl mb-2">{icon}</div>
          <div className="font-mono text-sm tracking-wider" style={{ color: '#00FFFF' }}>
            {label}
          </div>
        </div>
      </div>
      
      {/* Holographic ripple */}
      {isRevealed && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 pointer-events-none"
          style={{ borderColor: 'rgba(0,255,255,0.25)' }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}

// Scanning reticle cursor
const ScanReticle = ({ x, y, isActive }) => {
  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{ 
        left: x - 60, 
        top: y - 60,
        mixBlendMode: 'difference'
      }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ 
        opacity: isActive ? 1 : 0, 
        scale: isActive ? 1 : 0.3 
      }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Outer ring */}
        <circle 
          cx="60" cy="60" r="54" 
          fill="none" 
          stroke="#FF073A" 
          strokeWidth="2.5"
          strokeDasharray="15 8"
        />
        
        {/* Inner ring */}
        <circle 
          cx="60" cy="60" r="38" 
          fill="none" 
          stroke="#FF073A" 
          strokeWidth="1"
          opacity="0.5"
        />
        
        {/* Crosshairs */}
        <line x1="60" y1="8" x2="60" y2="25" stroke="#FF073A" strokeWidth="2.5" />
        <line x1="60" y1="95" x2="60" y2="112" stroke="#FF073A" strokeWidth="2.5" />
        <line x1="8" y1="60" x2="25" y2="60" stroke="#FF073A" strokeWidth="2.5" />
        <line x1="95" y1="60" x2="112" y2="60" stroke="#FF073A" strokeWidth="2.5" />
        
        {/* Center */}
        <circle cx="60" cy="60" r="5" fill="#FF073A">
          <animate attributeName="opacity" values="1;0.3;1" dur="0.6s" repeatCount="indefinite" />
        </circle>
        
        {/* Corner brackets */}
        <path d="M30 18 L18 18 L18 30" fill="none" stroke="#FF073A" strokeWidth="2.5" />
        <path d="M90 18 L102 18 L102 30" fill="none" stroke="#FF073A" strokeWidth="2.5" />
        <path d="M30 102 L18 102 L18 90" fill="none" stroke="#FF073A" strokeWidth="2.5" />
        <path d="M90 102 L102 102 L102 90" fill="none" stroke="#FF073A" strokeWidth="2.5" />
      </svg>
      
      {/* Expanding spotlight */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          width: '200px',
          height: '200px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,7,58,0.15) 0%, transparent 70%)',
        }}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  )
}

// Logo slam effect
const LogoSlam = ({ isActive, children }) => {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 2, opacity: 0, y: -50 }}
      animate={isActive ? { 
        scale: [2.5, 0.9, 1.1, 1], 
        opacity: 1,
        y: 0
      } : {}}
      transition={{ 
        duration: 0.6, 
        times: [0, 0.6, 0.8, 1],
        ease: [0.4, 0, 0.2, 1] 
      }}
    >
      {/* Slam impact rings */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: '3px solid #FF073A',
              transform: 'scale(1)'
            }}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid #00FFFF',
              transform: 'scale(1)'
            }}
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
        </>
      )}
      
      {/* Main logo */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

// Pulsing glow effect
const PulseGlow = ({ children, color = '#00FFFF', isActive = true }) => {
  return (
    <motion.div
      animate={isActive ? {
        boxShadow: [
          `0 0 15px ${color}40`,
          `0 0 30px ${color}60`,
          `0 0 15px ${color}40`
        ]
      } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {children}
    </motion.div>
  )
}

// Main Tech Fest Loader
const TechFestLoader = ({ isLoading = true, onComplete }) => {
  const [phase, setPhase] = useState('boot')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [typingComplete, setTypingComplete] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [revealedPanels, setRevealedPanels] = useState([])
  const [isFading, setIsFading] = useState(false)

  const messages = [
    { text: "Accessing innovation database", delay: 0 },
    { text: "Authenticating user", delay: 2200 },
  ]

  const panels = [
    { id: 'ai', label: 'AI', icon: '🤖', position: 'top-16 left-[15%]', depth: 0 },
    { id: 'robotics', label: 'Robotics', icon: '⚙️', position: 'top-10 right-[18%]', depth: 1 },
    { id: 'cybersecurity', label: 'Cybersecurity', icon: '🔐', position: 'bottom-20 left-[25%]', depth: 2 },
    { id: 'hackathon', label: 'Hackathon', icon: '💻', position: 'bottom-16 right-[20%]', depth: 3 },
  ]

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Message progression
  useEffect(() => {
    if (phase === 'boot' && currentMessage < messages.length) {
      const timer = setTimeout(() => {
        if (currentMessage < messages.length - 1) {
          setCurrentMessage(prev => prev + 1)
        } else {
          setTypingComplete(true)
        }
      }, messages[currentMessage].delay + 1500)
      return () => clearTimeout(timer)
    }
  }, [phase, currentMessage])

  // Phase transitions
  useEffect(() => {
    if (typingComplete) {
      const timer = setTimeout(() => {
        setPhase('scan')
        
        // Sequential panel reveals
        panels.forEach((panel, index) => {
          setTimeout(() => {
            setRevealedPanels(prev => [...prev, panel.id])
          }, index * 500)
        })
        
        // Complete after all panels
        setTimeout(() => {
          setPhase('complete')
        }, panels.length * 500 + 1800)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [typingComplete])

  // Fade out
  useEffect(() => {
    if (phase === 'complete') {
      const timer = setTimeout(() => {
        setIsFading(true)
        setTimeout(() => {
          onComplete?.()
        }, 1500)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [phase, onComplete])

  // Don't render if not loading
  if (!isLoading) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 overflow-hidden"
        style={{ backgroundColor: '#0a0a0f' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isFading ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Grid background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '35px 35px'
          }}
        />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 25% 25%, rgba(0,255,255,0.08) 0%, transparent 50%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 75% 75%, rgba(255,7,58,0.06) 0%, transparent 50%)'
        }} />

        {/* Spotlight following mouse */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle 220px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0,0,0,0.75) 100%)`
          }}
        />

        {/* Scanning reticle */}
        <ScanReticle 
          x={mousePosition.x} 
          y={mousePosition.y} 
          isActive={phase !== 'complete'} 
        />

        {/* Main content */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-6 left-6 right-6"
          >
            <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,7,58,0.25)' }}>
              <div className="font-mono text-xs tracking-widest" style={{ color: '#FF073A' }}>
                ◆ CLASSIFIED INNOVATION SYSTEM v3.0
              </div>
              <div className="flex items-center gap-2">
                <DataFlicker className="font-mono text-xs" style={{ color: 'rgba(0,255,255,0.6)' }}>
                  SECURE CONNECTION
                </DataFlicker>
                <span className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: '#00FF00', boxShadow: '0 0 10px #00FF00' }} 
                />
              </div>
            </div>
          </motion.div>

          {/* Boot phase */}
          {phase === 'boot' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center w-full max-w-xl"
            >
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ 
                      opacity: index <= currentMessage ? 1 : 0.2, 
                      x: 0 
                    }}
                    transition={{ duration: 0.25, delay: index * 0.1 }}
                    className="font-mono text-lg"
                    style={{ 
                      color: index <= currentMessage ? '#00FFFF' : 'rgba(0,255,255,0.4)'
                    }}
                  >
                    {index <= currentMessage ? (
                      <DataFlicker>
                        <TypewriterText 
                          text={msg.text} 
                          speed={40}
                          className="inline"
                        />
                      </DataFlicker>
                    ) : (
                      <span className="opacity-30">○ {msg.text}</span>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Loading indicator */}
              <PulseGlow color="#00FFFF">
                <div className="mt-10 w-64 mx-auto">
                  <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,255,255,0.1)' }}>
                    <motion.div
                      className="h-full"
                      style={{ 
                        backgroundColor: '#00FFFF',
                        boxShadow: '0 0 12px #00FFFF'
                      }}
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </div>
                </div>
              </PulseGlow>
            </motion.div>
          )}

          {/* Scanning phase */}
          {phase === 'scan' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center w-full"
            >
              {/* Radar */}
              <PulseGlow color="#00FFFF">
                <div className="mb-12">
                  <RadarScanner isActive={true} />
                </div>
              </PulseGlow>
              
              {/* Panels at different depths */}
              <div className="relative w-full max-w-2xl h-64 mx-auto">
                {panels.map((panel) => (
                  <div key={panel.id} className={`absolute ${panel.position}`}>
                    <HoloPanel
                      label={panel.label}
                      icon={panel.icon}
                      isRevealed={revealedPanels.includes(panel.id)}
                      delay={revealedPanels.indexOf(panel.id) * 500}
                      depth={panel.depth}
                    />
                  </div>
                ))}
              </div>
              
              {/* Scanning text */}
              <motion.div
                className="font-mono text-sm mt-8"
                style={{ color: '#00FFFF' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                SCANNING SECTOR...
              </motion.div>
            </motion.div>
          )}

          {/* Complete phase */}
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              {/* Logo with slam */}
              <LogoSlam isActive={true}>
                <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tight">
                  <span 
                    className="text-transparent bg-clip-text"
                    style={{ 
                      backgroundImage: 'linear-gradient(135deg, #00FFFF, #0088FF, #00FFFF)',
                      WebkitTextStroke: '2px rgba(0,255,255,0.4)',
                      textShadow: '0 0 40px rgba(0,255,255,0.6)',
                      filter: 'drop-shadow(0 0 20px rgba(0,255,255,0.5))'
                    }}
                  >
                    PRISMA
                  </span>
                </h1>
              </LogoSlam>
              
              {/* System unlocked */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="mt-10"
              >
                <span 
                  className="font-mono text-2xl tracking-[0.3em]"
                  style={{ 
                    color: '#00FF00',
                    textShadow: '0 0 25px rgba(0,255,0,0.8)',
                    animation: 'pulse 0.8s ease-in-out infinite'
                  }}
                >
                  SYSTEM UNLOCKED
                </span>
              </motion.div>
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="font-mono text-sm mt-6"
                style={{ color: 'rgba(0,255,255,0.7)' }}
              >
                WELCOME TO THE FUTURE OF INNOVATION
              </motion.p>
            </motion.div>
          )}

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-6 left-6 right-6"
          >
            <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid rgba(0,255,255,0.15)' }}>
              <div className="font-mono text-xs" style={{ color: 'rgba(0,255,255,0.35)' }}>
                TECH FEST 2024 | INNOVATION DETECTIVE
              </div>
              <div className="font-mono text-xs" style={{ color: 'rgba(0,255,255,0.35)' }}>
                {new Date().toLocaleTimeString('en-US', { hour12: false })} UTC
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scan lines overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.08) 2px,
              rgba(0,0,0,0.08) 4px
            )`
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default TechFestLoader


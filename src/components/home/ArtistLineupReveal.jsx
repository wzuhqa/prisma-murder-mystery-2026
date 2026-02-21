import { useState, useEffect, useCallback, useRef } from 'react'
import './ArtistLineupReveal.css'

// Pre-defined particle data for deterministic rendering
const PARTICLE_DATA = [...Array(20)].map((_, i) => ({
  id: i,
  left: (i * 5 + Math.random() * 3) % 100,
  delay: (i * 0.3 + Math.random() * 0.5) % 8,
  duration: 4 + (i * 0.2) % 5,
  size: i % 4 === 0 ? 'fast' : i % 2 === 0 ? 'slow' : 'medium',
  opacity: 0.3 + (i % 3) * 0.2
}))

// Silhouette data for background atmosphere
const SILHOUETTE_DATA = [...Array(5)].map((_, i) => ({
  id: i,
  width: 80 + (i * 30) % 100,
  height: 200 + (i * 50) % 150,
  left: -10 + (i * 25) % 100,
  opacity: 0.03 + (i * 0.01) % 0.03,
  animationDelay: i * 2
}))

const ArtistLineupReveal = ({ 
  artists = [],
  delayPerArtist = 3000,
  typewriterSpeed = 80,
  enableSound = false,
  showStage = true,
  onComplete 
}) => {
  const [revealedArtists, setRevealedArtists] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [currentTypedText, setCurrentTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showFinalImpact, setShowFinalImpact] = useState(false)
  const [glitchIndex, setGlitchIndex] = useState(null)
  const [typingCharIndex, setTypingCharIndex] = useState(-1)
  const [smokeBurst, setSmokeBurst] = useState(false)
  const [shadowTrail, setShadowTrail] = useState(false)
  const audioContextRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Play sound effect
  const playSound = useCallback((type) => {
    if (!enableSound || !audioContextRef.current) return
    
    try {
      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      if (type === 'type') {
        // Soft tick for each character
        oscillator.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime)
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
      } else if (type === 'reveal') {
        // Rising tone for full reveal
        oscillator.frequency.setValueAtTime(300, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15)
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      } else if (type === 'heartbeat') {
        // Low thud heartbeat
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.frequency.setValueAtTime(60, ctx.currentTime)
        osc2.type = 'sine'
        gain2.gain.setValueAtTime(0.1, ctx.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
        osc2.start(ctx.currentTime)
        osc2.stop(ctx.currentTime + 0.15)
        
        oscillator.frequency.setValueAtTime(50, ctx.currentTime + 0.1)
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      } else if (type === 'final') {
        // Dramatic final impact
        oscillator.frequency.setValueAtTime(100, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.8)
        oscillator.type = 'sawtooth'
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
        
        // Add sub-bass rumble
        const subOsc = ctx.createOscillator()
        const subGain = ctx.createGain()
        subOsc.connect(subGain)
        subGain.connect(ctx.destination)
        subOsc.frequency.setValueAtTime(40, ctx.currentTime)
        subOsc.type = 'sine'
        subGain.gain.setValueAtTime(0.15, ctx.currentTime)
        subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
        subOsc.start(ctx.currentTime)
        subOsc.stop(ctx.currentTime + 1)
      } else if (type === 'tension') {
        // Rising tension tone
        oscillator.frequency.setValueAtTime(200, ctx.currentTime)
        oscillator.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3)
        oscillator.type = 'triangle'
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      }
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + (type === 'final' ? 1.5 : type === 'heartbeat' ? 0.25 : 0.4))
    } catch {
      // Audio not supported
    }
  }, [enableSound])

  // Initialize audio context
  useEffect(() => {
    if (enableSound) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      } catch {
        // Audio not supported
      }
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [enableSound])

  // Typewriter effect for current artist
  useEffect(() => {
    if (currentIndex === -1 || currentIndex >= artists.length) return
    
    // Start typing after a brief delay
    const startTypingDelay = setTimeout(() => {
      setIsTyping(true)
      setCurrentTypedText('')
      setTypingCharIndex(-1)
      
      // Play heartbeat for tension
      if (enableSound && currentIndex > 0) {
        playSound('heartbeat')
      }
    }, 300)

    return () => {
      clearTimeout(startTypingDelay)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [currentIndex, artists, enableSound, playSound])

  // Individual character typing with glitch effect
  useEffect(() => {
    if (!isTyping || currentIndex === -1 || currentIndex >= artists.length) return
    
    const currentArtistName = artists[currentIndex]
    
    if (typingCharIndex < currentArtistName.length - 1) {
      // Randomize typing speed for glitchy feel
      const charDelay = typewriterSpeed + (Math.random() * 40 - 20)
      
      typingTimeoutRef.current = setTimeout(() => {
        const nextCharIndex = typingCharIndex + 1
        setTypingCharIndex(nextCharIndex)
        setCurrentTypedText(currentArtistName.substring(0, nextCharIndex + 1))
        
        // Play typing sound
        if (enableSound) {
          playSound('type')
        }
        
        // Trigger character glitch
        setGlitchIndex(currentIndex * 100 + nextCharIndex)
        setTimeout(() => setGlitchIndex(null), 150)
        
      }, charDelay)
      
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
      }
    } else {
      // Finished typing this artist
      setIsTyping(false)
      
      // Add to revealed list
      setRevealedArtists(prev => [...prev, currentArtistName])
      
      // Play reveal sound
      playSound('reveal')
      
      // Trigger smoke burst
      setSmokeBurst(true)
      setTimeout(() => setSmokeBurst(false), 600)
      
      // Trigger shadow trail
      setShadowTrail(true)
      setTimeout(() => setShadowTrail(false), 800)
      
      // Check if final artist
      if (currentIndex === artists.length - 1) {
        setTimeout(() => {
          setShowFinalImpact(true)
          playSound('final')
          onComplete?.()
        }, 1000)
      } else {
        // Play tension sound before next reveal
        if (enableSound) {
          setTimeout(() => playSound('tension'), 500)
        }
        
        // Move to next artist
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1)
        }, delayPerArtist - 1000)
      }
    }
  }, [isTyping, typingCharIndex, currentIndex, artists, typewriterSpeed, delayPerArtist, enableSound, playSound, onComplete])

  // Initial state
  useEffect(() => {
    if (artists.length > 0 && currentIndex === -1) {
      // Initial delay before starting
      setTimeout(() => {
        setCurrentIndex(0)
      }, 500)
    }
  }, [artists, currentIndex])

  // Final impact animation
  if (showFinalImpact) {
    return (
      <div className="artist-lineup-wrapper" role="region" aria-label="Artist lineup reveal">
        <div className="final-artist-flash" />
        <div className="lineup-fog-container">
          <div className="lineup-fog lineup-fog-1" />
          <div className="lineup-fog lineup-fog-2" />
        </div>
        <div className="lineup-content">
          <div className="artist-list">
            {revealedArtists.map((artist, index) => (
              <div 
                key={index} 
                className={`artist-item ${index === revealedArtists.length - 1 ? 'final-artist' : ''}`}
              >
                <div className="artist-name-container">
                  <div className="artist-mist active" />
                  <div className="artist-slash active" />
                  <div className="final-artist-glow" />
                  <h3 className="artist-name revealed emphasis">
                    {artist}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        {showStage && <div className="lineup-stage" />}
      </div>
    )
  }

  return (
    <div className="artist-lineup-wrapper" role="region" aria-label="Artist lineup reveal">
      {/* Fog layers */}
      <div className="lineup-fog-container" aria-hidden="true">
        <div className="lineup-fog lineup-fog-1" />
        <div className="lineup-fog lineup-fog-2" />
      </div>
      
      {/* Particles */}
      <div className="lineup-particles" aria-hidden="true">
        {PARTICLE_DATA.map((particle) => (
          <div
            key={particle.id}
            className={`lineup-particle ${particle.size}`}
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              opacity: particle.opacity
            }}
          />
        ))}
      </div>
      
      {/* Silhouettes */}
      <div className="lineup-silhouettes" aria-hidden="true">
        {SILHOUETTE_DATA.map((sil) => (
          <div
            key={sil.id}
            className="lineup-silhouette"
            style={{
              width: `${sil.width}px`,
              height: `${sil.height}px`,
              left: `${sil.left}%`,
              opacity: sil.opacity,
              animationDelay: `${sil.animationDelay}s`
            }}
          />
        ))}
      </div>
      
      {/* Flickering lights */}
      <div className="flickering-lights" aria-hidden="true">
        <div className="flicker-light flicker-light-1" />
        <div className="flicker-light flicker-light-2" />
        <div className="flicker-light flicker-light-3" />
        <div className="flicker-light flicker-light-4" />
      </div>
      
      {/* Smoke burst effect */}
      <div className={`smoke-burst ${smokeBurst ? 'active' : ''}`} aria-hidden="true" />
      
      {/* Shadow trail effect */}
      <div className={`shadow-trail ${shadowTrail ? 'active' : ''}`} aria-hidden="true" />
      
      {/* Shadows */}
      <div className="lineup-shadows" aria-hidden="true">
        <div className="lineup-shadow lineup-shadow-1" />
        <div className="lineup-shadow lineup-shadow-2" />
        <div className="lineup-shadow lineup-shadow-3" />
      </div>
      
      {/* Main content */}
      <div className="lineup-content">
        {/* Header */}
        <div className="lineup-header">
          <h2 className="lineup-title">FEATURED ARTISTS</h2>
          <p className="lineup-subtitle">The mystery unfolds...</p>
        </div>
        
        {/* Artist list */}
        <div className="artist-list" role="list">
          {artists.map((artist, index) => {
            const isRevealed = revealedArtists.includes(artist)
            const isCurrentTyping = currentIndex === index && isTyping
            const isFinal = index === artists.length - 1
            
            return (
              <div 
                key={index} 
                className={`artist-item ${isFinal && isRevealed ? 'final-artist' : ''} ${isCurrentTyping ? 'typing' : ''}`}
                role="listitem"
              >
                <div className="artist-name-container">
                  {/* Mist effect */}
                  <div className={`artist-mist ${isRevealed ? 'active' : ''}`} />
                  
                  {/* Slash streak */}
                  <div className={`artist-slash ${isRevealed ? 'active' : ''}`} />
                  
                  {/* Current typing indicator */}
                  {isCurrentTyping && (
                    <span className="typing-cursor">|</span>
                  )}
                  
                  {/* Artist name */}
                  <h3 
                    className={`artist-name ${isRevealed ? 'revealed' : isCurrentTyping ? 'typing-text' : 'hidden'} ${glitchIndex === index || (glitchIndex >= index * 100 && glitchIndex < (index + 1) * 100) ? 'glitch' : ''} ${isRevealed && isFinal ? 'emphasis' : ''}`}
                  >
                    {isCurrentTyping ? currentTypedText : artist}
                  </h3>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Progress dots */}
        {artists.length > 0 && (
          <div className="lineup-progress" aria-hidden="true">
            {artists.map((_, index) => (
              <div 
                key={index}
                className={`progress-dot ${
                  revealedArtists.length > index 
                    ? 'revealed' 
                    : index === currentIndex 
                      ? 'current' 
                      : ''
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Stage/backdrop */}
      {showStage && <div className="lineup-stage" />}
    </div>
  )
}

export default ArtistLineupReveal


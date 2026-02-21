import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/common/Footer'
import './Team.css'

const Team = () => {
  // Intro sequence states
  const [introComplete, setIntroComplete] = useState(false)
  const [showScanLine, setShowScanLine] = useState(false)
  const [terminalLines, setTerminalLines] = useState([])
  const [currentTyping, setCurrentTyping] = useState('')
  const [showBiometricScan, setShowBiometricScan] = useState(false)
  const [scanStatus, setScanStatus] = useState('') // 'scanning', 'success', 'failure'
  const [scanAttempt, setScanAttempt] = useState(0)
  const [showDepthReveal, setShowDepthReveal] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Entry animation states (kept for compatibility)
  const [showEntry, setShowEntry] = useState(true)
  const [showPage, setShowPage] = useState(false)
  const [showIdleMessage, setShowIdleMessage] = useState(false)

  // Clearance system states
  const [clearanceLevel, setClearanceLevel] = useState(0)
  const [isRevoked, setIsRevoked] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)
  const [biometricMessage, setBiometricMessage] = useState([])
  const [showSlash, setShowSlash] = useState(false)
  const [systemMessage, setSystemMessage] = useState('')
  const [showSystemMessage, setShowSystemMessage] = useState(false)

  // Conditions
  const [level2Condition, setLevel2Condition] = useState(false)
  const [visitedSealed, setVisitedSealed] = useState(false)

  // Refs
  const keyBufferRef = useRef('')
  const hoverStartRef = useRef(null)
  const hoverDurationRef = useRef(0)
  const inactivityTimerRef = useRef(null)
  const decayTimerRef = useRef(null)
  const lastActivityRef = useRef(Date.now())


  // Check if intro should be skipped
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('team_intro_seen')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (hasSeenIntro || prefersReducedMotion) {
      setIntroComplete(true)
      setShowEntry(false)
      setShowPage(true)
      setTimeout(() => setShowIdleMessage(true), 2000)
      initializeClearanceSystem()
      return
    }

    // Start intro sequence
    startIntroSequence()
  }, [])

  const startIntroSequence = () => {
    // Step 1: Scan line
    setTimeout(() => setShowScanLine(true), 500)

    // Step 2: Terminal boot
    setTimeout(() => {
      typeTerminalLines()
    }, 1500)
  }

  const typeTerminalLines = () => {
    const lines = [
      'ACCESSING ARCHIVE…',
      'Loading Personnel Database…',
      'Decrypting File: AK-01',
      'Initiating Biometric Verification…'
    ]

    let lineIndex = 0
    let charIndex = 0

    const typeNextChar = () => {
      if (lineIndex >= lines.length) {
        // Terminal complete, start biometric scan
        setTimeout(() => startBiometricScan(), 500)
        return
      }

      const currentLine = lines[lineIndex]

      if (charIndex <= currentLine.length) {
        setCurrentTyping(currentLine.substring(0, charIndex))
        charIndex++
        setTimeout(typeNextChar, 30)
      } else {
        setTerminalLines(prev => [...prev, currentLine])
        setCurrentTyping('')
        lineIndex++
        charIndex = 0
        setTimeout(typeNextChar, 200)
      }
    }

    typeNextChar()
  }

  const startBiometricScan = () => {
    setShowBiometricScan(true)
    setScanStatus('scanning')

    setTimeout(() => {
      // 50% random outcome
      const isSuccess = scanAttempt > 0 || Math.random() >= 0.5

      if (isSuccess) {
        setScanStatus('success')
        setTimeout(() => {
          sessionStorage.setItem('team_intro_seen', 'true')
          startDepthReveal()
        }, 2000)
      } else {
        setScanStatus('failure')
        setTimeout(() => {
          // Retry automatically
          setScanAttempt(1)
          setScanStatus('scanning')
          setTimeout(() => {
            setScanStatus('success')
            setTimeout(() => {
              sessionStorage.setItem('team_intro_seen', 'true')
              startDepthReveal()
            }, 2000)
          }, 1500)
        }, 2000)
      }
    }, 3000)
  }

  const startDepthReveal = () => {
    setShowDepthReveal(true)
    setTimeout(() => {
      setIntroComplete(true)
      setShowEntry(false)
      setShowPage(true)
      setTimeout(() => setShowIdleMessage(true), 3000)
      initializeClearanceSystem()
    }, 1000)
  }

  const skipIntro = () => {
    sessionStorage.setItem('team_intro_seen', 'true')
    setIntroComplete(true)
    setShowEntry(false)
    setShowPage(true)
    setTimeout(() => setShowIdleMessage(true), 1000)
    initializeClearanceSystem()
  }

  // Skip intro on ESC or click
  useEffect(() => {
    if (introComplete) return

    const handleSkip = (e) => {
      if (e.type === 'keydown' && e.key !== 'Escape') return
      skipIntro()
    }

    window.addEventListener('keydown', handleSkip)
    window.addEventListener('click', handleSkip)

    return () => {
      window.removeEventListener('keydown', handleSkip)
      window.removeEventListener('click', handleSkip)
    }
  }, [introComplete])

  // Mouse parallax effect with debouncing
  useEffect(() => {
    if (!showPage) return

    let rafId = null
    const handleMouseMove = (e) => {
      if (rafId) return

      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20
        const y = (e.clientY / window.innerHeight - 0.5) * 20
        setMousePosition({ x, y })
        rafId = null
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [showPage])

  const initializeClearanceSystem = () => {

    // Load saved state
    const savedLevel = parseInt(localStorage.getItem('clearanceLevel')) || 0
    const savedActivity = parseInt(localStorage.getItem('lastActivityTimestamp')) || Date.now()
    const sealed = localStorage.getItem('sealed_record_unlocked') === 'true'

    setVisitedSealed(sealed)
    lastActivityRef.current = savedActivity

    // Check for decay
    checkDecay(savedLevel, savedActivity)

    // Start activity tracking
    startInactivityTracking()
  }


  // Decay check
  const checkDecay = (level, lastActivity) => {
    const now = Date.now()
    const elapsed = now - lastActivity

    if (elapsed > 15 * 60 * 1000) {
      setClearanceLevel(0)
      localStorage.setItem('clearanceLevel', 0)
    } else if (elapsed > 5 * 60 * 1000) {
      const decayLevels = Math.floor(elapsed / (5 * 60 * 1000))
      const newLevel = Math.max(0, level - decayLevels)
      setClearanceLevel(newLevel)
      localStorage.setItem('clearanceLevel', newLevel)
    } else {
      setClearanceLevel(level)
    }
  }

  // Activity tracking
  const updateActivity = () => {
    const now = Date.now()
    lastActivityRef.current = now
    localStorage.setItem('lastActivityTimestamp', now)
    resetInactivityTimer()
  }

  const startInactivityTracking = () => {
    resetInactivityTimer()
  }

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimerRef.current)
    clearTimeout(decayTimerRef.current)

    // 5 minute decay
    decayTimerRef.current = setTimeout(() => {
      setClearanceLevel(prev => {
        const newLevel = Math.max(0, prev - 1)
        localStorage.setItem('clearanceLevel', newLevel)
        showMessage('Clearance integrity degraded.')
        return newLevel
      })
    }, 5 * 60 * 1000)

    // 15 minute reset
    inactivityTimerRef.current = setTimeout(() => {
      setClearanceLevel(0)
      localStorage.setItem('clearanceLevel', 0)
      showMessage('Clearance integrity degraded.')
    }, 15 * 60 * 1000)
  }

  useEffect(() => {
    const handleActivity = () => updateActivity()
    document.addEventListener('mousemove', handleActivity)
    document.addEventListener('click', handleActivity)

    return () => {
      document.removeEventListener('mousemove', handleActivity)
      document.removeEventListener('click', handleActivity)
    }
  }, [])

  // Unlock level
  const unlockLevel = (level) => {
    if (clearanceLevel < level) {
      setClearanceLevel(level)
      localStorage.setItem('clearanceLevel', level)
      updateActivity()
    }
  }

  // Show biometric scan
  const triggerBiometric = (success, message = '') => {
    setBiometricMessage([
      'Scanning identity…',
      'Matching behavioral pattern…',
      success ? 'Clearance Approved.' : (message || 'Insufficient authorization.')
    ])
    setShowBiometric(true)
    setTimeout(() => setShowBiometric(false), 2500)
  }

  // Show slash effect
  const triggerSlash = () => {
    setShowSlash(true)
    setTimeout(() => setShowSlash(false), 600)
  }

  // Show system message
  const showMessage = (msg) => {
    setSystemMessage(msg)
    setShowSystemMessage(true)
    setTimeout(() => setShowSystemMessage(false), 3000)
  }

  // Keyboard handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Revoked state - restore
      if (isRevoked) {
        const key = e.key.toLowerCase()
        if (['r', 'e', 's', 't', 'o'].includes(key)) {
          keyBufferRef.current += key
          if (keyBufferRef.current.includes('restore')) {
            setIsRevoked(false)
            keyBufferRef.current = ''
            showMessage('Access restored.')
          }
        }
        return
      }

      keyBufferRef.current += e.key.toLowerCase()
      keyBufferRef.current = keyBufferRef.current.slice(-20)

      // Level 1: "structure"
      if (keyBufferRef.current.includes('structure') && clearanceLevel < 1) {
        triggerSlash()
        setTimeout(() => {
          triggerBiometric(true)
          setTimeout(() => unlockLevel(1), 2500)
        }, 600)
      }

      // Level 2: "intentional" (with hover condition)
      if (keyBufferRef.current.includes('intentional') && level2Condition && clearanceLevel < 2) {
        triggerBiometric(true)
        setTimeout(() => unlockLevel(2), 2500)
      }

      // Level 3: "architect"
      if (keyBufferRef.current.includes('architect') && clearanceLevel < 3) {
        triggerBiometric(true)
        setTimeout(() => unlockLevel(3), 2500)
      }

      // Level 4: "root" (requires sealed record)
      if (keyBufferRef.current.includes('root') && clearanceLevel < 4) {
        if (visitedSealed) {
          triggerBiometric(true)
          setTimeout(() => unlockLevel(4), 2500)
        } else {
          triggerBiometric(false, 'External file required.')
        }
      }

      // Override: revoke
      if (keyBufferRef.current.includes('override')) {
        setIsRevoked(true)
        keyBufferRef.current = ''
      }

      updateActivity()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [clearanceLevel, level2Condition, visitedSealed, isRevoked])

  // Hover tracking for Level 2
  const handleNameHover = (entering) => {
    if (entering) {
      hoverStartRef.current = Date.now()
    } else {
      if (hoverStartRef.current) {
        hoverDurationRef.current += Date.now() - hoverStartRef.current
        if (hoverDurationRef.current >= 6000) {
          setLevel2Condition(true)
        }
        hoverStartRef.current = null
      }
    }
  }

  // Lock click handler
  const handleLockClick = (level) => {
    if (clearanceLevel < level) {
      triggerBiometric(false, 'Partial match.')
    }
  }

  return (
    <div className="team-page">
      {/* Intro Sequence */}
      {!introComplete && (
        <div className="intro-overlay">
          {/* Scan Line */}
          {showScanLine && <div className="intro-scan-line" />}

          {/* Terminal Boot */}
          {terminalLines.length > 0 && (
            <div className="terminal-boot">
              {terminalLines.map((line, i) => (
                <div key={i} className="terminal-line">{line}</div>
              ))}
              {currentTyping && (
                <div className="terminal-line typing">
                  {currentTyping}<span className="terminal-cursor">_</span>
                </div>
              )}
            </div>
          )}

          {/* Biometric Scan */}
          {showBiometricScan && (
            <div className="biometric-scan-intro">
              <div className="scan-circle">
                <div className="scan-pulse" />
                <div className="scan-horizontal-line" />
              </div>

              <div className="scan-messages">
                {scanStatus === 'scanning' && (
                  <>
                    <div className="scan-msg" style={{ animationDelay: '0s' }}>Scanning identity…</div>
                    {scanAttempt === 0 && (
                      <div className="scan-msg" style={{ animationDelay: '1s' }}>
                        {Math.random() >= 0.5 ? 'Matching behavioral signature…' : 'Behavioral pattern mismatch.'}
                      </div>
                    )}
                    {scanAttempt > 0 && (
                      <div className="scan-msg" style={{ animationDelay: '0.5s' }}>Matching behavioral signature…</div>
                    )}
                  </>
                )}

                {scanStatus === 'failure' && (
                  <>
                    <div className="scan-msg failure">Behavioral pattern mismatch.</div>
                    <div className="scan-msg failure" style={{ animationDelay: '0.5s' }}>Clearance denied.</div>
                    <div className="scan-msg" style={{ animationDelay: '1.5s' }}>Reattempt required.</div>
                  </>
                )}

                {scanStatus === 'success' && (
                  <>
                    <div className="scan-msg success">Clearance integrity confirmed.</div>
                    <div className="scan-msg success" style={{ animationDelay: '0.5s' }}>Status: LIMITED ACCESS</div>
                    <div className="scan-msg success" style={{ animationDelay: '1s' }}>Match confirmed.</div>
                  </>
                )}
              </div>

              {scanStatus === 'success' && (
                <div className="progress-bar">
                  <div className="progress-fill" />
                </div>
              )}
            </div>
          )}

          {/* Depth Reveal Slash */}
          {showDepthReveal && <div className="depth-reveal-slash" />}
        </div>
      )}

      {/* Main Page Content */}
      {showPage && (
        <>
          <div
            className={`team-content ${showDepthReveal ? 'depth-reveal' : ''}`}
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
            }}
          >
            {/* Idle background message */}
            <div className={`idle-message ${showIdleMessage ? 'visible' : ''}`}>
              The archive was never random.
            </div>

            {/* Glass Dossier Panel */}
            <div className="dossier-section">
              <header className="dossier-header">
                <div className="header-title">PERSONNEL FILE</div>
                <h1
                  className={`personnel-name ${clearanceLevel >= 2 ? 'mirror' : ''}`}
                  onMouseEnter={() => handleNameHover(true)}
                  onMouseLeave={() => handleNameHover(false)}
                >
                  AKUL
                </h1>
                <div className="personnel-title">ARCHIVE ARCHITECT</div>
                <div className={`clearance-level ${isRevoked ? 'revoked' : ''}`}>
                  CLEARANCE LEVEL: {clearanceLevel}
                </div>
              </header>

              <section className="base-info">
                <div className="info-row">
                  <div className="info-label">NAME:</div>
                  <div className="info-value">AKUL</div>
                </div>
                <div className="info-row">
                  <div className="info-label">TITLE:</div>
                  <div className="info-value">Archive Architect</div>
                </div>
                <div className="info-row">
                  <div className="info-label">STATUS:</div>
                  <div className={`info-value ${isRevoked ? 'revoked' : ''}`}>
                    {isRevoked ? 'Suspended' : 'Active'}
                  </div>
                </div>

                <div className="tagline">
                  "Structure is never accidental."
                </div>
              </section>

              <section className="restricted-section">
                <h2 className="section-title">RESTRICTED DATA</h2>

                {/* Level 1 */}
                <div
                  className={`clearance-lock ${clearanceLevel >= 1 ? 'unlocked' : ''}`}
                  onClick={() => handleLockClick(1)}
                >
                  [ LEVEL 1 {clearanceLevel >= 1 ? 'UNLOCKED' : 'LOCKED'} ]
                </div>
                <div className={`hidden-content ${clearanceLevel >= 1 ? 'revealed' : ''}`}>
                  <div className="content-block">
                    <h3>STATE: OPERATIONAL</h3>
                    <p>Akul operates at the intersection of narrative architecture and systematic design. Every element within this archive reflects a deliberate choice—structure engineered to guide, conceal, and reveal. The precision is not performative. It is foundational. This is not documentation. This is deployment.</p>
                  </div>
                </div>

                {/* Level 2 */}
                <div
                  className={`clearance-lock ${clearanceLevel >= 2 ? 'unlocked' : ''}`}
                  onClick={() => handleLockClick(2)}
                >
                  [ LEVEL 2 {clearanceLevel >= 2 ? 'UNLOCKED' : 'LOCKED'} ]
                </div>
                <div className={`hidden-content ${clearanceLevel >= 2 ? 'revealed' : ''}`}>
                  <div className="content-block">
                    <h3>CORE STRENGTHS</h3>
                    <ul>
                      <li>Narrative Systems Design</li>
                      <li>Psychological UX Architecture</li>
                      <li>Structural Worldbuilding</li>
                      <li>ARG Engineering</li>
                    </ul>
                  </div>
                </div>

                {/* Level 3 */}
                <div
                  className={`clearance-lock ${clearanceLevel >= 3 ? 'unlocked' : ''}`}
                  onClick={() => handleLockClick(3)}
                >
                  [ LEVEL 3 {clearanceLevel >= 3 ? 'UNLOCKED' : 'LOCKED'} ]
                </div>
                <div className={`hidden-content ${clearanceLevel >= 3 ? 'revealed' : ''}`}>
                  <div className="reveal-message">
                    This archive was never reactive.<br />
                    It was designed.<br />
                    Every flicker.<br />
                    Every silence.<br />
                    Intentional.
                  </div>
                  <div className="architect-signature">AKUL<br />PRIMARY ARCHITECT</div>
                </div>

                {/* Level 4 */}
                <div
                  className={`clearance-lock ${clearanceLevel >= 4 ? 'unlocked' : ''}`}
                  onClick={() => handleLockClick(4)}
                >
                  [ LEVEL 4 {clearanceLevel >= 4 ? 'UNLOCKED' : 'LOCKED'} ]
                </div>
                <div className={`hidden-content ${clearanceLevel >= 4 ? 'revealed' : ''}`}>
                  <div className="content-block">
                    <h3>ROOT ACCESS LOG</h3>
                    <p>
                      Akul initiated the archive.<br />
                      The system was not discovered.<br />
                      It was deployed.
                    </p>
                  </div>
                </div>
              </section>
            </div>
            <Footer />
          </div>
        </>
      )}

      {/* Biometric Overlay */}
      <AnimatePresence>
        {showBiometric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="biometric-overlay"
          >
            <div className="scan-container">
              <div className="scan-line" />
              <div className="fingerprint" />
            </div>
            <div className="scan-text">
              {biometricMessage.map((msg, i) => (
                <div key={i} style={{ animationDelay: `${i * 0.5 + 0.3}s` }}>{msg}</div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slash Effect */}
      {showSlash && <div className="slash-effect animate" />}

      {/* System Message */}
      <div className={`system-message ${showSystemMessage ? 'show' : ''}`}>
        {systemMessage}
      </div>

      {/* Revoked Overlay */}
      <AnimatePresence>
        {isRevoked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="revoked-overlay"
          >
            <div className="revoked-text">
              CLEARANCE REVOKED<br /><br />
              Architect access suspended.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level 4 background shift */}
      {clearanceLevel >= 4 && <div className="level4-background" />}
    </div>
  )
}

export default Team

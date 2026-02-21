import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Import luxury easing system
import { LUXURY_EASE, ELEGANT_ENTER, SILK_SMOOTH } from '../../utils/luxuryEasing'

const TextReveal = ({ 
  text, 
  className = '',
  delay = 0,
  speed = 0.05, // seconds per character
  style = 'typewriter' // typewriter, fade, slide
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let currentIndex = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex))
          currentIndex++
        } else {
          setIsComplete(true)
          clearInterval(interval)
        }
      }, speed * 1000)

      return () => clearInterval(interval)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [text, delay, speed])

  if (style === 'typewriter') {
    return (
      <span className={`text-reveal-typewriter ${className}`}>
        {displayedText}
        {!isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ borderLeft: '2px solid currentColor', marginLeft: '2px' }}
          >
            &nbsp;
          </motion.span>
        )}
      </span>
    )
  }

  if (style === 'fade') {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        // Elegant text reveal
        transition={{ 
          duration: 0.8, 
          delay,
          ease: [0.22, 1, 0.36, 1]  // ELEGANT_ENTER
        }}
        className={className}
      >
        {text}
      </motion.span>
    )
  }

  if (style === 'slide') {
    return (
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // Luxury slide - already using LUXURY_EASE
        transition={{ 
          duration: 0.6, 
          delay, 
          ease: [0.25, 0.1, 0.25, 1]  // LUXURY_EASE
        }}
        className={className}
        style={{ display: 'inline-block' }}
      >
        {text}
      </motion.span>
    )
  }

  return <span className={className}>{text}</span>
}

// Word-by-word reveal component
export const WordReveal = ({ 
  text, 
  className = '',
  delay = 0,
  stagger = 0.1
}) => {
  const words = text.split(' ')

  return (
    <span className={className} style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: delay + index * stagger,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// Letter-by-letter reveal with random glitch
export const GlitchReveal = ({ 
  text, 
  className = '',
  delay = 0,
  glitchChance = 0.1
}) => {
  const [glitchLetters, setGlitchLetters] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      const newGlitch = {}
      text.split('').forEach((_, i) => {
        if (Math.random() < glitchChance) {
          newGlitch[i] = String.fromCharCode(33 + Math.floor(Math.random() * 94))
        }
      })
      setGlitchLetters(newGlitch)
      setTimeout(() => setGlitchLetters({}), 100)
    }, 200)

    return () => clearInterval(interval)
  }, [text, glitchChance])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + index * 0.03 }}
          style={{ display: 'inline-block' }}
        >
          {glitchLetters[index] || char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default TextReveal

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const TypewriterText = ({ 
  text = '', 
  speed = 50, 
  delay = 0,
  showCursor = true,
  className = '',
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeout
    
    const startTyping = () => {
      let currentIndex = 0
      
      const typeChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
          timeout = setTimeout(typeChar, speed + Math.random() * 30)
        } else {
          setIsComplete(true)
          if (onComplete) onComplete()
        }
      }
      
      typeChar()
    }
    
    const delayTimeout = setTimeout(startTyping, delay)
    
    return () => {
      clearTimeout(timeout)
      clearTimeout(delayTimeout)
    }
  }, [text, speed, delay, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-amber-500 ml-0.5 align-middle"
        />
      )}
      {showCursor && isComplete && (
        <span className="inline-block w-0.5 h-4 bg-amber-500 ml-0.5 align-middle" />
      )}
    </span>
  )
}

export default TypewriterText


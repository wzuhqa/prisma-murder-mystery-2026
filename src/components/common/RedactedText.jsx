import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

const RedactedText = ({ 
  text = 'CLASSIFIED INFORMATION',
  revealText = '',
  isRedacted = true,
  className = ''
}) => {
  const [isRevealed, setIsRevealed] = useState(!isRedacted)

  const toggleReveal = () => {
    setIsRevealed(!isRevealed)
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {isRevealed ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-sm text-amber-100 bg-amber-900/30 px-1"
        >
          {revealText || text}
        </motion.span>
      ) : (
        <div className="relative inline-flex items-center gap-2">
          {/* Redaction bars */}
          <span className="font-mono text-sm bg-stone-900 px-2 py-0.5 tracking-widest">
            {'█'.repeat(Math.max(text.length, 10))}
          </span>
          
          {/* Stamped effect */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50"
            style={{ transform: 'rotate(-15deg)' }}
          >
            <span className="font-serif text-xs text-red-700 border-2 border-red-700 px-2 py-0.5 uppercase tracking-widest">
              {isRevealed ? 'DECLASSIFIED' : 'REDACTED'}
            </span>
          </div>
        </div>
      )}
      
      <button
        onClick={toggleReveal}
        className="ml-2 text-stone-500 hover:text-stone-300 transition-colors"
        aria-label={isRevealed ? 'Hide information' : 'Reveal information'}
      >
        {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  )
}

export default RedactedText


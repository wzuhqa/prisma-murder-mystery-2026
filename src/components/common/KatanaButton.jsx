import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'

const KatanaButton = ({
    children,
    onClick,
    type = 'button',
    className = '',
    disabled = false,
    loading = false,
    variant = 'primary' // primary, ghost
}) => {
    const [isHovered, setIsHovered] = useState(false)

    // Katana slash sound effect could be added here

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
        relative group overflow-hidden px-8 py-4 blood-hover-drip
        font-heading font-bold uppercase tracking-widest text-sm
        transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
        >
            {/* Background with clip-path for katana shape */}
            <div className={`
        absolute inset-0 
        ${variant === 'primary' ? 'bg-blood/90' : 'bg-transparent border border-white/20'}
        transform skew-x-[-12deg]
        transition-all duration-300
        group-hover:bg-blood
        group-hover:scale-105
        group-active:scale-95
      `} />

            {/* Shine effect */}
            <div className="absolute inset-0 transform skew-x-[-12deg] overflow-hidden">
                <div className={`
          absolute top-0 left-[-100%] w-[50%] h-full 
          bg-gradient-to-r from-transparent via-white/40 to-transparent
          transition-all duration-700 ease-in-out
          ${isHovered ? 'left-[200%]' : ''}
        `} />
            </div>

            {/* Slash line overlay */}
            <AnimatePresence>
                {isHovered && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: 1, pathLength: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 pointer-events-none"
                    >
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line
                                x1="0" y1="100" x2="100" y2="0"
                                stroke="white"
                                strokeWidth="2"
                                strokeOpacity="0.5"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <div className={`
        relative z-10 flex items-center justify-center gap-2
        ${variant === 'primary' ? 'text-white' : 'text-chalk group-hover:text-white'}
      `}>
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                        Processing...
                    </span>
                ) : (
                    <>
                        {children}
                        {variant === 'primary' && <Send size={16} className={`
              transform transition-transform duration-300
              ${isHovered ? 'translate-x-1 -translate-y-1' : ''}
            `} />}
                    </>
                )}
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
        </button>
    )
}

export default KatanaButton

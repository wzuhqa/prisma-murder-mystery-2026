import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Staggered animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

// Glassmorphism Panel Component
export const ForensicPanel = ({
  children,
  className = '',
  glowColor = 'red',
  delay = 0
}) => {
  const glowColors = {
    red: 'rgba(239,68,68,',
    cyan: 'rgba(6,182,212,',
    none: 'transparent'
  }

  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-gray-900/20 backdrop-blur-xl
        border border-${glowColor}-500/30
        rounded-lg
        ${className}
      `}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      style={{ transitionDelay: `${delay}ms` }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Frosted glass overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
          backdropFilter: 'blur(20px)'
        }}
      />

      {/* Red accent border glow */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          boxShadow: `inset 0 0 20px ${glowColors[glowColor]}0.1), inset 0 0 1px ${glowColors[glowColor]}0.3)`
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

// Button Component with red accent
export const ForensicButton = ({
  children,
  variant = 'primary',
  icon,
  className = '',
  onClick,
  disabled = false,
  delay = 0
}) => {
  const baseClasses = `
    relative px-6 py-3 font-mono text-sm tracking-wider
    border transition-all duration-250 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variants = {
    primary: `
      bg-red-500/20 border-red-500/50 text-red-400
      hover:bg-red-500/30 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
      focus:ring-red-500
    `,
    secondary: `
      bg-cyan-500/20 border-cyan-500/50 text-cyan-400
      hover:bg-cyan-500/30 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]
      focus:ring-cyan-500
    `,
    ghost: `
      bg-transparent border-gray-600/50 text-gray-300
      hover:bg-gray-800/50 hover:border-gray-500 hover:text-white
      focus:ring-gray-500
    `
  }

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.3 }}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  )
}

// Input Component
export const ForensicInput = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon,
  className = '',
  delay = 0
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.3 }}
    >
      {label && (
        <label className="block text-xs font-mono text-gray-400 mb-2 tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full bg-gray-900/40 border border-gray-700/50 
            rounded px-4 py-3 text-gray-100 font-mono text-sm
            placeholder-gray-600
            focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]
            transition-all duration-250 ease-out
            ${icon ? 'pl-10' : ''}
          `}
        />
      </div>
    </motion.div>
  )
}

// Progress Indicator with cyan accent
export const ForensicProgress = ({
  value = 0,
  max = 100,
  label,
  showValue = true,
  variant = 'default',
  delay = 0
}) => {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
    >
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-gray-400 tracking-wider">{label}</span>
          {showValue && (
            <span className="text-xs font-mono text-cyan-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/30">
        <motion.div
          className={`h-full rounded-full ${variant === 'success'
            ? 'bg-gradient-to-r from-green-600 to-green-400'
            : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
            }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            boxShadow: '0 0 10px rgba(6,182,212,0.5)'
          }}
        />
      </div>
    </motion.div>
  )
}

// Floating Data Tag
export const DataTag = ({
  children,
  type = 'info',
  rotation = 0,
  delay = 0
}) => {
  const typeStyles = {
    info: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    warning: 'border-red-500/40 bg-red-500/10 text-red-300',
    success: 'border-green-500/40 bg-green-500/10 text-green-300',
    neutral: 'border-gray-500/40 bg-gray-500/10 text-gray-300'
  }

  return (
    <motion.div
      className={`
        relative px-3 py-2 
        border rounded
        font-mono text-xs
        ${typeStyles[type]}
        transform-gpu
      `}
      style={{
        transform: `rotate(${rotation}deg)`,
        boxShadow: '0 4px 15px rgba(0,0,0,0.4), 0 0 20px rgba(0,0,0,0.2)'
      }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: delay / 1000,
        duration: 0.4,
        ease: 'easeOut'
      }}
      whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)' }}
    >
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current rounded-tl" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current rounded-tr" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current rounded-bl" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current rounded-br" />

      {children}
    </motion.div>
  )
}

// Radar Sweep Effect Component
export const RadarSweep = ({ size = 300, position = 'center' }) => {
  return (
    <div
      className={`relative ${position === 'center' ? 'mx-auto' : ''}`}
      style={{ width: size, height: size }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 rounded-full border border-gray-700/30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,100,100,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,100,100,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Concentric circles */}
      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-gray-600/20"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            left: `${(1 - scale) * 50}%`,
            top: `${(1 - scale) * 50}%`
          }}
        />
      ))}

      {/* Sweep line */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-1/2 h-0.5 origin-left"
        style={{
          background: 'linear-gradient(90deg, rgba(6,182,212,0.8), transparent)',
          boxShadow: '0 0 10px rgba(6,182,212,0.8), 0 0 20px rgba(6,182,212,0.4)'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Center dot */}
      <div
        className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'rgba(6,182,212,0.8)',
          boxShadow: '0 0 15px rgba(6,182,212,0.8), 0 0 30px rgba(6,182,212,0.4)'
        }}
      />
    </div>
  )
}

// Grid Background Pattern
export const GridBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,116,139,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,116,139,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridPulse 4s ease-in-out infinite'
        }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Glitch Text Component
export const GlitchText = ({
  children,
  className = '',
  color = 'red'
}) => {
  const colors = {
    red: 'text-red-500',
    cyan: 'text-cyan-500',
    white: 'text-white'
  }

  return (
    <span className={`relative inline-block ${colors[color]} ${className}`}>
      <span className="relative z-10">{children}</span>

      {/* Glitch layers */}
      <motion.span
        className="absolute inset-0 overflow-hidden"
        animate={{ opacity: [1, 0.8, 1] }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: 2.5,
          times: [0, 0.5, 1]
        }}
      >
        <span className="absolute text-red-400 left-px">{children}</span>
      </motion.span>
      <motion.span
        className="absolute inset-0 overflow-hidden"
        animate={{ opacity: [1, 0.85, 1] }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: 3.5,
          times: [0, 0.5, 1]
        }}
      >
        <span className="absolute text-cyan-400 -left-px">{children}</span>
      </motion.span>
    </span>
  )
}

// Evidence Card Component
export const EvidenceCard = ({
  title,
  description,
  timestamp,
  relevance = 0,
  status = 'analyzed',
  onClick,
  delay = 0
}) => {
  const statusColors = {
    analyzed: 'border-cyan-500/40 bg-cyan-500/5',
    pending: 'border-yellow-500/40 bg-yellow-500/5',
    flagged: 'border-red-500/40 bg-red-500/5'
  }

  const statusLabels = {
    analyzed: 'ANALYZED',
    pending: 'PENDING',
    flagged: 'FLAGGED'
  }

  return (
    <motion.div
      className={`
        relative p-4 
        border rounded-lg cursor-pointer
        bg-gray-900/30 backdrop-blur-sm
        ${statusColors[status]}
        hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]
        transition-all duration-250 ease-out
      `}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Status indicator */}
      <div className="absolute top-3 right-3">
        <span className="text-xs font-mono px-2 py-1 rounded bg-gray-800/50 border border-gray-600/30 text-gray-400">
          {statusLabels[status]}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-100 mb-2 pr-20">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-3">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-gray-500">
          {timestamp}
        </span>

        {/* Relevance score */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">RELEVANCE</span>
          <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${relevance}%` }}
              transition={{ delay: delay / 1000 + 0.3, duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Navigation Component
export const ForensicNav = ({ items, activeItem, onChange }) => {
  return (
    <motion.nav
      className="flex items-center gap-1 p-1 bg-gray-900/40 backdrop-blur-md rounded-lg border border-gray-800/50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`
            relative px-4 py-2 text-sm font-mono tracking-wider
            transition-all duration-250 ease-out
            ${activeItem === item.id
              ? 'text-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
            }
          `}
        >
          {activeItem === item.id && (
            <motion.div
              className="absolute inset-0 bg-cyan-500/10 rounded border border-cyan-500/30"
              layoutId="activeNav"
              transition={{ duration: 0.25 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
        </button>
      ))}
    </motion.nav>
  )
}

// Stats Card
export const StatCard = ({
  label,
  value,
  icon,
  trend,
  delay = 0
}) => {
  const isPositive = trend >= 0

  return (
    <motion.div
      className="p-4 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800/50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay / 1000, duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-gray-500 text-xs font-mono tracking-wider">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>

      <div className="text-2xl font-bold text-white mb-1">{value}</div>

      {trend !== undefined && (
        <div className={`text-xs font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </motion.div>
  )
}

// Tab Component
export const ForensicTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex border-b border-gray-800/50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            relative px-6 py-3 text-sm font-mono tracking-wider
            transition-all duration-250 ease-out
            ${activeTab === tab.id
              ? 'text-cyan-400'
              : 'text-gray-500 hover:text-gray-300'
            }
          `}
        >
          {activeTab === tab.id && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
              layoutId="activeTab"
              transition={{ duration: 0.25 }}
            />
          )}
          <span className="flex items-center gap-2">
            {tab.icon}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}

// Badge Component
export const ForensicBadge = ({
  children,
  variant = 'default',
  pulse = false
}) => {
  const variants = {
    default: 'bg-gray-800/50 text-gray-400 border-gray-700/50',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  }

  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 
      text-xs font-mono rounded border
      ${variants[variant]}
    `}>
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      )}
      {children}
    </span>
  )
}

// Main Layout Wrapper
export const ForensicLayout = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative min-h-screen bg-gray-950">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(71,85,105,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(71,85,105,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 20% 20%, rgba(6,182,212,0.08) 0%, transparent 50%)'
      }} />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 80% 80%, rgba(239,68,68,0.06) 0%, transparent 50%)'
      }} />

      {/* Content with fade-in */}
      <motion.div
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
        variants={staggerContainer}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  )
}

// Button Component with red accent


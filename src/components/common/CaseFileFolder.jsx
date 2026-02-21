import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Lock, Unlock } from 'lucide-react'

const CaseFileFolder = ({ 
  title = 'CASE FILE', 
  caseNumber = 'CF-2024-001',
  status = 'CONFIDENTIAL',
  children,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const folderVariants = {
    closed: {
      rotateX: 0,
      transition: { duration: 0.4, ease: 'easeInOut' }
    },
    open: {
      rotateX: -15,
      transition: { duration: 0.4, ease: 'easeInOut' }
    }
  }

  const contentVariants = {
    closed: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: 0.1 }
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Folder back */}
      <div 
        className="relative bg-gradient-to-b from-amber-900 to-amber-950 rounded-lg shadow-2xl"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* Paper texture overlay */}
        <div 
          className="absolute inset-0 opacity-10 rounded-lg"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Folder tab */}
        <div 
          className="absolute -top-4 left-6 w-24 h-4 bg-gradient-to-b from-amber-800 to-amber-900 rounded-t-md"
        />

        {/* Folder front (lid) */}
        <motion.div
          className="relative bg-gradient-to-b from-amber-700 to-amber-900 rounded-lg p-4 cursor-pointer overflow-hidden"
          variants={folderVariants}
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          onClick={() => setIsOpen(!isOpen)}
          style={{ transformOrigin: 'top center' }}
        >
          {/* Paper texture */}
          <div 
            className="absolute inset-0 opacity-5 rounded-lg"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Burned edges effect */}
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), inset 0 0 10px rgba(139,69,19,0.3)',
            }}
          />

          {/* Folder header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {isOpen ? <Unlock size={16} className="text-amber-300" /> : <Lock size={16} className="text-amber-400" />}
              <span className="font-mono text-xs text-amber-200 tracking-wider">{caseNumber}</span>
            </div>
            <div className="px-2 py-0.5 bg-red-900/60 border border-red-800 rotate-2">
              <span className="font-serif text-xs text-red-300 tracking-widest uppercase">{status}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg text-amber-100 flex items-center gap-2">
            <FileText size={18} />
            {title}
          </h3>

          {/* Open/Close indicator */}
          <div className="absolute bottom-2 right-2 text-amber-400/50 text-xs font-mono">
            {isOpen ? '▼ EXPOSED' : '▶ CLASSIFIED'}
          </div>
        </motion.div>

        {/* Folder content (revealed when open) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-amber-100 rounded-b-lg p-4 mt-1 shadow-inner"
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{
                transform: 'rotateX(-5deg)',
                transformOrigin: 'top center'
              }}
            >
              {/* Aged paper texture */}
              <div 
                className="absolute inset-0 opacity-20 rounded"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />
              
              <div className="relative z-10 text-amber-950">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CaseFileFolder


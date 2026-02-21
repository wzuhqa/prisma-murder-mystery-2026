import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal, ChevronRight, Loader2 } from 'lucide-react'

const TerminalInput = ({ 
  placeholder = 'Enter command...',
  onSubmit,
  prefix = 'user@terminal:~$',
  className = ''
}) => {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [history, setHistory] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsProcessing(true)
    setHistory(prev => [...prev, { command: input, output: null }])

    if (onSubmit) {
      try {
        const result = await onSubmit(input)
        setHistory(prev => [...prev.slice(0, -1), { command: input, output: result }])
      } catch {
        setHistory(prev => [...prev.slice(0, -1), { command: input, output: 'Error: Command failed' }])
      }
    }

    setInput('')
    setIsProcessing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className={`bg-stone-950 rounded-lg overflow-hidden shadow-2xl ${className}`}>
      {/* Terminal header */}
      <div className="bg-stone-800 px-4 py-2 flex items-center gap-2 border-b border-stone-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 text-center">
          <span className="font-mono text-xs text-stone-400 flex items-center justify-center gap-1">
            <Terminal size={12} />
            TERMINAL v2.0.1
          </span>
        </div>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-sm max-h-64 overflow-y-auto">
        {/* Previous commands */}
        {history.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-start gap-2">
              <span className="text-green-500 shrink-0">{prefix}</span>
              <span className="text-stone-200">{item.command}</span>
            </div>
            {item.output && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-4 mt-1 text-amber-500"
              >
                {item.output}
              </motion.div>
            )}
          </div>
        ))}

        {/* Current input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-green-500 shrink-0">{prefix}</span>
          <div className="flex-1 flex items-center gap-1">
            <ChevronRight size={14} className="text-stone-500" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isProcessing}
              className="flex-1 bg-transparent border-none outline-none text-stone-200 placeholder-stone-600"
              autoFocus
            />
            {isProcessing && <Loader2 size={14} className="text-amber-500 animate-spin" />}
          </div>
        </form>
      </div>

      {/* Blinking cursor effect */}
      <style jsx>{`
        input:focus {
          caret-color: #22c55e;
        }
      `}</style>
    </div>
  )
}

export default TerminalInput


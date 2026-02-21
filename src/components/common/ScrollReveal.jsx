import { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

const ScrollReveal = ({ 
  children, 
  direction = 'up', // up, down, left, right
  delay = 0,
  duration = 0.6,
  distance = 60,
  once = true,
  className = ''
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-50px' })
  const controls = useAnimation()

  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  }

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1]
        }
      })
    }
  }, [isInView, controls, delay, duration])

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MapPin, Phone, Mail, Instagram, User, AlertCircle } from 'lucide-react'
import KatanaButton from '../components/common/KatanaButton'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [focusedField, setFocusedField] = useState(null)
  const [formStatus, setFormStatus] = useState('idle') // idle, submitting, success, error

  // Ambient particle effect logic
  useEffect(() => {
    const container = document.querySelector('.contact-container')
    const particleCount = 20

    // Create floating particles dynamically
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'ambient-particle'
      particle.style.left = `${Math.random() * 100}%`
      particle.style.width = `${Math.random() * 4 + 1}px`
      particle.style.height = particle.style.width
      particle.style.animationDuration = `${Math.random() * 10 + 10}s`
      particle.style.animationDelay = `${Math.random() * 5}s`
      container?.appendChild(particle)
    }

    return () => {
      // Cleanup particles on unmount
      const particles = document.querySelectorAll('.ambient-particle')
      particles.forEach(p => p.remove())
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormStatus('submitting')

    // Simulate API call
    setTimeout(() => {
      setFormStatus('success')
      // Reset form after success message
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' })
        setFormStatus('idle')
      }, 3000)
    }, 1500)
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="contact-container relative min-h-screen pt-20 pb-12"
    >
      {/* Cinematic Effects */}
      <div className="vignette z-10" />
      <div className="film-grain z-0 opacity-10 mix-blend-overlay pointer-events-none absolute inset-0" />

      {/* Background ambient glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-blood/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">

        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16 md:mb-24 mt-8">
          <motion.div
            initial={{ w: 0 }}
            animate={{ w: "100%" }}
            className="h-px bg-gradient-to-r from-transparent via-blood to-transparent w-full max-w-lg mx-auto mb-8 opacity-50"
          />

          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-2xl">
            CONTACT
          </h1>

          <p className="font-mono text-blood tracking-[0.2em] text-sm md:text-base mt-4 uppercase">
            Every secret leaves a trace
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Contact Form - Left Side */}
          <motion.div variants={itemVariants} className="lg:col-span-7 relative">
            <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />

            <div className="backdrop-blur-sm bg-noir/40 p-1 rounded-2xl border border-white/5 shadow-2xl">
              <div className="bg-noir/60 rounded-xl p-8 md:p-10 relative overflow-hidden">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/10 rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/10 rounded-br-xl" />

                <h2 className="font-heading text-3xl text-white mb-2 flex items-center gap-3">
                  <span className="w-1 h-8 bg-blood block" />
                  Submit Evidence
                </h2>
                <p className="text-gray-400 mb-8 font-mono text-sm ml-4">
                  Secure channel established. Encryption active.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name Input */}
                    <div className="input-group relative">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder=" "
                        className="glass-input w-full px-4 py-4 rounded-lg text-white font-mono text-sm"
                      />
                      <label
                        htmlFor="name"
                        className={`floating-label ${focusedField === 'name' || formData.name ? 'active' : ''
                          }`}
                      >
                        <User size={14} className="inline mr-2" />
                        Identity
                      </label>
                      <div className={`input-line ${focusedField === 'name' ? 'w-full' : 'w-0'}`} />
                    </div>

                    {/* Email Input */}
                    <div className="input-group relative">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder=" "
                        className="glass-input w-full px-4 py-4 rounded-lg text-white font-mono text-sm"
                      />
                      <label
                        htmlFor="email"
                        className={`floating-label ${focusedField === 'email' || formData.email ? 'active' : ''
                          }`}
                      >
                        <Mail size={14} className="inline mr-2" />
                        Comms Link
                      </label>
                      <div className={`input-line ${focusedField === 'email' ? 'w-full' : 'w-0'}`} />
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="input-group relative">
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder=" "
                      className="glass-input w-full px-4 py-4 rounded-lg text-white font-mono text-sm"
                    />
                    <label
                      htmlFor="subject"
                      className={`floating-label ${focusedField === 'subject' || formData.subject ? 'active' : ''
                        }`}
                    >
                      <AlertCircle size={14} className="inline mr-2" />
                      Case Subject
                    </label>
                    <div className={`input-line ${focusedField === 'subject' ? 'w-full' : 'w-0'}`} />
                  </div>

                  {/* Message Input */}
                  <div className="input-group relative">
                    <textarea
                      name="message"
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={5}
                      placeholder=" "
                      className="glass-input w-full px-4 py-4 rounded-lg text-white font-mono text-sm resize-none"
                    />
                    <label
                      htmlFor="message"
                      className={`floating-label ${focusedField === 'message' || formData.message ? 'active' : ''
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>Witness Statement</span>
                      </div>
                    </label>
                    <div className={`input-line ${focusedField === 'message' ? 'w-full' : 'w-0'}`} />
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-xs font-mono text-gray-500 hidden md:block">
                        // SECURE CONNECTION
                      <span className="block text-[10px] opacity-50">ver 2.0.4 encrypt</span>
                    </div>

                    <KatanaButton
                      type="submit"
                      loading={formStatus === 'submitting'}
                      disabled={formStatus === 'success'}
                      className="w-full md:w-auto"
                    >
                      {formStatus === 'success' ? 'Statement Filed' : 'Transmit Data'}
                    </KatanaButton>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Contact Details - Right Side */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-8 relative">

            {/* Main Headquarters Info */}
            <div className="bg-noir/40 backdrop-blur-md p-8 rounded-2xl border-l-2 border-blood/50 hover:border-blood transition-colors group">
              <h3 className="font-heading text-2xl text-white mb-6 group-hover:text-blood transition-colors">
                Headquarters
              </h3>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-blood">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-1">Coordinates</span>
                    <p className="text-gray-300 leading-relaxed font-light">
                      SRM University, Delhi-NCR<br />
                      Sonepat, Haryana 131029
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-blood/80">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-1">Digital Link</span>
                    <a href="mailto:prisma@srmuh.in" className="text-gray-300 hover:text-white transition-colors">
                      prisma@srmuh.in
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-pink-600/80">
                    <Instagram size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-1">Social Feed</span>
                    <a href="https://instagram.com/prisma.srmuh" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                      @prisma.srmuh
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Key Personnel Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Lakshay Card */}
              <div className="bg-gradient-to-br from-noir/80 to-noir/40 p-6 rounded-xl border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blood/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blood/20 transition-all" />

                <div className="relative z-10">
                  <span className="text-xs font-mono text-blood mb-2 block tracking-widest uppercase">General Secretary</span>
                  <h4 className="font-heading text-xl text-white mb-2">Lakshay</h4>
                  <div className="flex items-center gap-2 mt-4 text-gray-400 group-hover:text-white transition-colors">
                    <Phone size={14} className="text-blood" />
                    <span className="font-mono text-sm">+91 93060 23815</span>
                  </div>
                </div>
              </div>

              {/* Kartik Card */}
              <div className="bg-gradient-to-br from-noir/80 to-noir/40 p-6 rounded-xl border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blood/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blood/20 transition-all" />

                <div className="relative z-10">
                  <span className="text-xs font-mono text-blood mb-2 block tracking-widest uppercase">Lead Detective</span>
                  <h4 className="font-heading text-xl text-white mb-2">Kartik</h4>
                  <div className="flex items-center gap-2 mt-4 text-gray-400 group-hover:text-white transition-colors">
                    <Phone size={14} className="text-blood" />
                    <span className="font-mono text-sm">+91 88274 25114</span>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </motion.main>
  )
}

export default Contact

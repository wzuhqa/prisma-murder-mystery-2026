import { useState } from 'react'
import Footer from '../components/common/Footer'

const Register = () => {
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    email: '',
    phone: '',
    college: '',
    teamSize: 4,
    events: [],
    category: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [caseRef, setCaseRef] = useState('')

  const categories = [
    'Technical',
    'Cultural',
    'Management',
    'Gaming',
    'Literary',
    'Arts & Crafts',
    'Photography',
    'Music',
    'Dance'
  ]

  const eventOptions = [
    'Code Debug',
    'Hackathon',
    'Quiz Bowl',
    'Treasure Hunt',
    'Battle of Bands',
    'Dance Off',
    'Marketing Maze',
    'Gaming Tournament',
    'Debate',
    'Art Exhibition'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEventToggle = (event) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setCaseRef(`PRISMA-${Date.now().toString(36).toUpperCase()}`)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-blood/20 flex items-center justify-center border-2 border-blood">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-chalk mb-4">
            Registration <span className="text-gradient-blood">Complete</span>
          </h1>
          <p className="text-fog-light text-lg mb-8">
            Your team has been registered. A confirmation email has been sent to {formData.email}.
          </p>
          <div className="p-6 bg-noir/50 border border-blood/30">
            <p className="font-mono text-sm text-fog-light">
              Case File Reference: {caseRef}
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 px-6 py-3 bg-blood/20 border border-blood text-blood hover:bg-blood/30 transition-colors"
          >
            Register Another Team
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="px-3 py-1 text-xs font-mono tracking-wider uppercase bg-blood/20 text-blood border border-blood/30">
              Join the Investigation
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-chalk mb-4">
            Register Your <span className="text-gradient-blood">Team</span>
          </h1>
          <p className="text-fog-light text-lg max-w-2xl mx-auto">
            Become a part of the mystery. Register now to participate in PRISMA 2026.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Team Information */}
          <div className="p-6 bg-noir/50 border border-white/10">
            <h2 className="font-heading text-xl font-bold text-chalk mb-6 flex items-center gap-2">
              <span className="text-blood">01</span> Team Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono text-fog-light mb-2">Team Name *</label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-midnight/50 border border-white/20 text-chalk focus:border-blood focus:outline-none transition-colors"
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-fog-light mb-2">Team Leader Name *</label>
                <input
                  type="text"
                  name="leaderName"
                  value={formData.leaderName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-midnight/50 border border-white/20 text-chalk focus:border-blood focus:outline-none transition-colors"
                  placeholder="Team leader's name"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-fog-light mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-midnight/50 border border-white/20 text-chalk focus:border-blood focus:outline-none transition-colors"
                  placeholder="team@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-fog-light mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-midnight/50 border border-white/20 text-chalk focus:border-blood focus:outline-none transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-fog-light mb-2">College/Institution *</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-midnight/50 border border-white/20 text-chalk focus:border-blood focus:outline-none transition-colors"
                  placeholder="Your college name"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-fog-light mb-2">Team Size *</label>
                <select
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-midnight/50 border border-white/20 text-chalk focus:border-blood focus:outline-none transition-colors"
                >
                  {[2, 3, 4, 5, 6].map(size => (
                    <option key={size} value={size}>{size} Members</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="p-6 bg-noir/50 border border-white/10">
            <h2 className="font-heading text-xl font-bold text-chalk mb-6 flex items-center gap-2">
              <span className="text-blood">02</span> Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                  className={`
                    p-3 text-sm font-mono uppercase tracking-wider transition-all
                    ${formData.category === cat
                      ? 'bg-blood text-white shadow-lg shadow-blood/30'
                      : 'bg-midnight/50 text-fog-light border border-white/10 hover:border-blood/50'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Selection */}
          <div className="p-6 bg-noir/50 border border-white/10">
            <h2 className="font-heading text-xl font-bold text-chalk mb-6 flex items-center gap-2">
              <span className="text-blood">03</span> Events (Select up to 5)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {eventOptions.map(event => (
                <button
                  key={event}
                  type="button"
                  onClick={() => handleEventToggle(event)}
                  disabled={!formData.events.includes(event) && formData.events.length >= 5}
                  className={`
                    p-3 text-sm font-mono transition-all
                    ${formData.events.includes(event)
                      ? 'bg-blood/20 text-blood border border-blood'
                      : 'bg-midnight/50 text-fog-light border border-white/10 hover:border-blood/50 disabled:opacity-50 disabled:cursor-not-allowed'
                    }
                  `}
                >
                  {event}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-fog-light">
              Selected: {formData.events.length}/5 events
            </p>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-12 py-4 font-heading text-lg font-bold uppercase tracking-wider transition-all
                ${isSubmitting
                  ? 'bg-blood/50 text-white/50 cursor-not-allowed'
                  : 'bg-blood text-white hover:bg-blood/90 shadow-lg hover:shadow-xl hover:shadow-blood/30'
                }
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                'Submit Registration'
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-12 p-6 border border-gold/30 bg-gold/5">
          <div className="flex items-start gap-4">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-heading text-lg font-bold text-gold mb-2">
                Registration Guidelines
              </h3>
              <ul className="text-fog-light text-sm space-y-2">
                <li>• Each team can have 2-6 members</li>
                <li>• Registration is free for all participants</li>
                Bring college <li>• ID cards for verification</li>
                <li>• Payment for events to be done on-site</li>
                <li>• Last date to register: February 25, 2026</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default Register

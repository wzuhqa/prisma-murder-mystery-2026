import { useState, useEffect } from 'react'
import './HorrorEventsShowcase.css'
import eventsData from '../../data/events.json'

/**
 * Horror Noir Events Showcase
 * Ultra-dark cinematic event showcase with:
 * - Deep black textured background with rolling smoke
 * - Dramatic red rim lighting
 * - Dripping blood-red title
 * - Category panels with neon underglow
 * - Horror styling throughout
 */
const HorrorEventsShowcase = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const categories = eventsData.categories

  return (
    <div 
      className={`horror-events-wrapper ${isMounted ? 'mounted' : ''}`}
      role="region"
      aria-label="Events showcase"
    >
      {/* Thick rolling smoke layers */}
      <div className="smoke-container" aria-hidden="true">
        <div className="smoke-layer smoke-layer-1" />
        <div className="smoke-layer smoke-layer-2" />
        <div className="smoke-layer smoke-layer-3" />
      </div>

      {/* Red fog at bottom */}
      <div className="red-fog-bottom" aria-hidden="true" />

      {/* Dramatic spotlights */}
      <div className="spotlight spotlight-1" aria-hidden="true" />
      <div className="spotlight spotlight-2" aria-hidden="true" />
      <div className="spotlight spotlight-3" aria-hidden="true" />
      <div className="spotlight spotlight-4" aria-hidden="true" />
      <div className="spotlight spotlight-5" aria-hidden="true" />

      {/* Blood splatter details */}
      <div className="blood-splatters" aria-hidden="true">
        <div className="blood-splatter blood-splatter-1" />
        <div className="blood-splatter blood-splatter-2" />
        <div className="blood-splatter blood-splatter-3" />
        <div className="blood-splatter blood-splatter-4" />
      </div>

      {/* Scratch marks */}
      <div className="scratch-marks" aria-hidden="true">
        <div className="scratch scratch-1" />
        <div className="scratch scratch-2" />
        <div className="scratch scratch-3" />
      </div>

      {/* Main content */}
      <div className="horror-events-content">
        {/* Massive horror title */}
        <div className="horror-title-container">
          <h1 className="horror-main-title">
            PRISMA EVENTS
            <span className="title-blood-drip title-blood-drip-1" />
            <span className="title-blood-drip title-blood-drip-2" />
            <span className="title-blood-drip title-blood-drip-3" />
          </h1>
        </div>

        {/* Broken jagged divider */}
        <div className="horror-divider" aria-hidden="true">
          <div className="horror-divider-segment" />
          <div className="horror-divider-segment" />
        </div>

        {/* Category panels grid */}
        <div className="horror-categories-grid" role="list">
          {categories.map((category, index) => (
            <article 
              key={category.id} 
              className="horror-category-panel"
              role="listitem"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Panel edge glitch effect */}
              <div className="panel-edge-glitch" />

              {/* Blood drip accent */}
              <div className="blood-drip-accent" />

              {/* Category title */}
              <h2 className="horror-category-title">
                {category.name}
              </h2>

              {/* Event subsections */}
              {Object.entries(category.events).map(([subsection, events]) => (
                <div key={subsection} className="horror-subsection">
                  <h3 className="horror-subsection-label">
                    {subsection}
                  </h3>
                  <ul className="horror-event-list">
                    {events.map((event, eventIndex) => (
                      <li 
                        key={eventIndex} 
                        className="horror-event-item"
                      >
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HorrorEventsShowcase


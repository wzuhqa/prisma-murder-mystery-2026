import { motion } from 'framer-motion';
import { Trophy, Zap, Users, Code, Palette, Mic } from 'lucide-react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import './EventHighlights.css';

const EventHighlights = () => {
  const [ref, , hasIntersected] = useIntersectionObserver({ threshold: 0.2 });

  const highlights = [
    {
      id: 1,
      icon: Code,
      title: 'Hackathon',
      description: '24-hour coding marathon',
      prize: '₹50,000',
      category: 'Technical',
      participants: '100+ teams'
    },
    {
      id: 2,
      icon: Palette,
      title: 'Design Sprint',
      description: 'UI/UX design challenge',
      prize: '₹30,000',
      category: 'Creative',
      participants: '50+ designers'
    },
    {
      id: 3,
      icon: Mic,
      title: 'Battle of Bands',
      description: 'Live music competition',
      prize: '₹40,000',
      category: 'Cultural',
      participants: '20+ bands'
    },
    {
      id: 4,
      icon: Trophy,
      title: 'Gaming Arena',
      description: 'Esports tournament',
      prize: '₹35,000',
      category: 'Gaming',
      participants: '200+ gamers'
    },
    {
      id: 5,
      icon: Users,
      title: 'Startup Pitch',
      description: 'Entrepreneurship showcase',
      prize: '₹60,000',
      category: 'Business',
      participants: '30+ startups'
    },
    {
      id: 6,
      icon: Zap,
      title: 'Robo Wars',
      description: 'Robot combat competition',
      prize: '₹45,000',
      category: 'Technical',
      participants: '40+ robots'
    }
  ];

  return (
    <section ref={ref} className="event-highlights-section">
      {/* Background Effects */}
      <div className="highlights-bg-gradient" />
      <div className="highlights-grain" />
      <div className="highlights-scanlines" />

      <div className="highlights-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="highlights-header"
        >
          <div className="highlights-label">
            <span className="label-line" />
            <span className="label-text">CASE FILES: MAJOR EVENTS</span>
            <span className="label-line" />
          </div>
          <h2 className="highlights-title scratched-text-heavy">
            Featured Investigations
          </h2>
          <p className="highlights-subtitle">
            High-priority cases requiring immediate attention
          </p>
        </motion.div>

        {/* Highlights Grid */}
        <div className="highlights-grid">
          {highlights.map((highlight, index) => (
            <HighlightCard
              key={highlight.id}
              highlight={highlight}
              index={index}
              hasIntersected={hasIntersected}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={hasIntersected ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="highlights-cta"
        >
          <a href="/events" className="highlights-cta-button">
            <span className="cta-icon">⌕</span>
            <span className="cta-text">View All Cases</span>
            <div className="cta-glow" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const HighlightCard = ({ highlight, index, hasIntersected }) => {
  const Icon = highlight.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      animate={hasIntersected ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="highlight-card"
    >
      {/* Card Background */}
      <div className="card-paper-texture" />
      <div className="card-corner-fold" />

      {/* Evidence Tag */}
      <div className="evidence-tag">
        <span className="tag-label">CASE</span>
        <span className="tag-id">#{String(index + 1).padStart(3, '0')}</span>
      </div>

      {/* Category Badge */}
      <div className="category-badge">{highlight.category}</div>

      {/* Icon Container */}
      <div className="icon-container">
        <div className="icon-glow" />
        <Icon className="highlight-icon" size={32} />
      </div>

      {/* Content */}
      <div className="card-content">
        <h3 className="card-title scratched-text">{highlight.title}</h3>
        <p className="card-description">{highlight.description}</p>

        <div className="card-meta">
          <div className="meta-row">
            <span className="meta-label">REWARD:</span>
            <span className="meta-value prize-value">{highlight.prize}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">SUSPECTS:</span>
            <span className="meta-value">{highlight.participants}</span>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="status-indicator">
        <span className="status-dot" />
        <span className="status-text">ACTIVE</span>
      </div>

      {/* Hover Effects */}
      <div className="card-hover-glow" />
      <div className="card-scanline" />
    </motion.div>
  );
};

export default EventHighlights;

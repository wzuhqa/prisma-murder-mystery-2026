import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Calendar, Star } from 'lucide-react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import './StatsCounter.css';

const StatsCounter = () => {
    const [ref, , hasIntersected] = useIntersectionObserver({ threshold: 0.3 });

    const stats = [
        {
            id: 1,
            icon: Users,
            value: 500,
            suffix: '+',
            label: 'Participants',
            description: 'Expected attendees'
        },
        {
            id: 2,
            icon: Trophy,
            value: 50,
            suffix: '+',
            label: 'Events',
            description: 'Across categories'
        },
        {
            id: 3,
            icon: Star,
            value: 5,
            suffix: 'L+',
            label: 'Prize Pool',
            description: 'Worth of prizes'
        },
        {
            id: 4,
            icon: Calendar,
            value: 3,
            suffix: '',
            label: 'Days',
            description: 'Of celebration'
        }
    ];

    return (
        <section ref={ref} className="stats-section">
            {/* Background Effects */}
            <div className="stats-bg-gradient" />
            <div className="stats-grain" />

            <div className="stats-container">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <StatItem
                            key={stat.id}
                            stat={stat}
                            index={index}
                            hasIntersected={hasIntersected}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StatItem = ({ stat, index, hasIntersected }) => {
    const Icon = stat.icon;
    const [count, setCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!hasIntersected) return;

        setIsAnimating(true);
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = stat.value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= stat.value) {
                setCount(stat.value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [hasIntersected, stat.value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="stat-item"
        >
            {/* Background Effect */}
            <div className="stat-bg-effect" />

            {/* Icon */}
            <div className="stat-icon-container">
                <Icon className="stat-icon" size={28} />
                <div className="stat-icon-glow" />
            </div>

            {/* Counter */}
            <div className="stat-value-container">
                <span className="stat-value">
                    {count}
                    <span className="stat-suffix">{stat.suffix}</span>
                </span>
            </div>

            {/* Label */}
            <div className="stat-label">{stat.label}</div>

            {/* Description */}
            <div className="stat-description">{stat.description}</div>

            {/* Corner Accent */}
            <div className="stat-corner stat-corner-tl" />
            <div className="stat-corner stat-corner-br" />
        </motion.div>
    );
};

export default StatsCounter;

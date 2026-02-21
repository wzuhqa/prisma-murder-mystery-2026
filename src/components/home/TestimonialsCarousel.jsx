import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import './TestimonialsCarousel.css';

const TestimonialsCarousel = () => {
    const [ref, , hasIntersected] = useIntersectionObserver({ threshold: 0.2 });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: 'Arjun Mehta',
            role: 'Hackathon Winner 2025',
            university: 'IIT Delhi',
            image: '👨‍💻',
            quote: 'PRISMA was an incredible experience. The 24-hour hackathon pushed us to our limits, and the noir theme made it unforgettable. Won ₹50,000 and made lifelong connections!',
            rating: 5,
            event: 'Hackathon'
        },
        {
            id: 2,
            name: 'Priya Sharma',
            role: 'Design Sprint Champion',
            university: 'NID Ahmedabad',
            image: '👩‍🎨',
            quote: 'The design challenge was perfectly organized. The mystery theme added a unique twist to UI/UX design. Highly recommend for creative minds!',
            rating: 5,
            event: 'Design Sprint'
        },
        {
            id: 3,
            name: 'Rahul Verma',
            role: 'Band Lead - The Echoes',
            university: 'Delhi University',
            image: '🎸',
            quote: 'Battle of Bands at PRISMA was epic! The stage setup, sound quality, and audience energy were phenomenal. Best college fest performance ever!',
            rating: 5,
            event: 'Battle of Bands'
        },
        {
            id: 4,
            name: 'Sneha Patel',
            role: 'Startup Pitch Finalist',
            university: 'IIM Bangalore',
            image: '💼',
            quote: 'PRISMA provided the perfect platform to pitch our startup. The judges were industry experts, and the networking opportunities were invaluable.',
            rating: 5,
            event: 'Startup Pitch'
        },
        {
            id: 5,
            name: 'Vikram Singh',
            role: 'Gaming Champion',
            university: 'Manipal University',
            image: '🎮',
            quote: 'The esports tournament was professionally organized with top-tier equipment. Intense competition and amazing prizes. A gamer\'s paradise!',
            rating: 5,
            event: 'Gaming Arena'
        }
    ];

    const nextTestimonial = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-advance every 5 seconds
    useEffect(() => {
        const timer = setInterval(nextTestimonial, 5000);
        return () => clearInterval(timer);
    }, []);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <section ref={ref} className="testimonials-section">
            {/* Background Effects */}
            <div className="testimonials-bg-gradient" />
            <div className="testimonials-grain" />
            <div className="testimonials-scanlines" />

            <div className="testimonials-container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="testimonials-header"
                >
                    <div className="testimonials-label">
                        <span className="label-line" />
                        <span className="label-text">WITNESS TESTIMONIES</span>
                        <span className="label-line" />
                    </div>
                    <h2 className="testimonials-title scratched-text-heavy">
                        Evidence from Past Investigators
                    </h2>
                    <p className="testimonials-subtitle">
                        Documented accounts from previous case participants
                    </p>
                </motion.div>

                {/* Carousel Container */}
                <div className="carousel-wrapper">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevTestimonial}
                        className="carousel-nav carousel-nav-prev"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={nextTestimonial}
                        className="carousel-nav carousel-nav-next"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Testimonial Card */}
                    <div className="carousel-track">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: 'spring', stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="testimonial-card"
                            >
                                {/* Card Background */}
                                <div className="card-paper-texture" />
                                <div className="card-corner-fold" />

                                {/* Quote Icon */}
                                <div className="quote-icon-container">
                                    <Quote className="quote-icon" size={40} />
                                </div>

                                {/* Evidence Tag */}
                                <div className="evidence-tag">
                                    <span className="tag-label">TESTIMONY</span>
                                    <span className="tag-id">#{String(testimonials[currentIndex].id).padStart(3, '0')}</span>
                                </div>

                                {/* Event Badge */}
                                <div className="event-badge">{testimonials[currentIndex].event}</div>

                                {/* Avatar */}
                                <div className="avatar-container">
                                    <div className="avatar-glow" />
                                    <div className="avatar">{testimonials[currentIndex].image}</div>
                                </div>

                                {/* Content */}
                                <div className="testimonial-content">
                                    <p className="testimonial-quote">"{testimonials[currentIndex].quote}"</p>

                                    <div className="testimonial-meta">
                                        <h3 className="witness-name scratched-text">{testimonials[currentIndex].name}</h3>
                                        <p className="witness-role">{testimonials[currentIndex].role}</p>
                                        <p className="witness-university">{testimonials[currentIndex].university}</p>
                                    </div>

                                    {/* Rating */}
                                    <div className="rating-container">
                                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                            <span key={i} className="rating-star">★</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Classified Stamp */}
                                <div className="classified-stamp">VERIFIED</div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Indicators */}
                    <div className="carousel-indicators">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 1 : -1);
                                    setCurrentIndex(index);
                                }}
                                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="testimonials-stats"
                >
                    <div className="stat-item">
                        <div className="stat-value">500+</div>
                        <div className="stat-label">Participants</div>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <div className="stat-value">50+</div>
                        <div className="stat-label">Events</div>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <div className="stat-value">₹5L+</div>
                        <div className="stat-label">Prize Pool</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialsCarousel;

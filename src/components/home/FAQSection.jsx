import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileQuestion, Lock, Clock, Users, Ticket, MapPin, Mail } from 'lucide-react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import './FAQSection.css';

const FAQSection = () => {
    const [ref, , hasIntersected] = useIntersectionObserver({ threshold: 0.2 });
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            id: 1,
            icon: Ticket,
            question: 'How do I register for PRISMA 2026?',
            answer: 'Registration is open through our secure portal. Click the "Register" button on the navigation or scroll to the bottom of this page. Fill in your details, select your events, and you\'ll receive a confirmation email with your unique case file ID.'
        },
        {
            id: 2,
            icon: Clock,
            question: 'What are the important dates?',
            answer: 'PRISMA 2026 takes place from February 28th to March 1st, 2026. Registration deadline is February 25th, 2026. The opening ceremony begins at 10:00 AM on February 28th at SRM University Delhi-NCR.'
        },
        {
            id: 3,
            icon: Users,
            question: 'Who can participate in PRISMA?',
            answer: 'PRISMA is open to all college and university students across India. Each participant must carry a valid college ID. Teams can have 2-5 members depending on the event. Individual participation is also allowed for most events.'
        },
        {
            id: 4,
            icon: Lock,
            question: 'Is there a registration fee?',
            answer: 'Registration is completely FREE! You only pay for the events you participate in (typically ₹100-500 per event). Some events have early bird discounts. Top performers receive cash prizes and goodies worth over ₹5 Lakhs.'
        },
        {
            id: 5,
            icon: MapPin,
            question: 'Where is PRISMA 2026 being held?',
            answer: 'PRISMA 2026 will be held at SRM University Delhi-NCR, Sonipat Road, Modinagar, Ghaziabad, Uttar Pradesh - 201204. Accommodation can be arranged for outstation participants.'
        },
        {
            id: 6,
            icon: FileQuestion,
            question: 'What events can I participate in?',
            answer: 'PRISMA features 50+ events across Technical (Hackathon, Coding, Robo Wars), Cultural (Battle of Bands, Dance, Drama), Creative (Design Sprint, Photography), Business (Startup Pitch, Marketing), and Gaming (Esports) categories.'
        },
        {
            id: 7,
            icon: Mail,
            question: 'How can I contact the organizing team?',
            answer: 'You can reach us via the Contact page, email us at prisma@srmuniversity.ac.in, or follow us on social media @prisma2026. Our team is available 24/7 to answer your queries.'
        }
    ];

    return (
        <section ref={ref} className="faq-section">
            {/* Background Effects */}
            <div className="faq-bg-gradient" />
            <div className="faq-grain" />
            <div className="faq-scanlines" />

            <div className="faq-container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="faq-header"
                >
                    <div className="faq-label">
                        <span className="label-line" />
                        <span className="label-text">CLASSIFIED FILES</span>
                        <span className="label-line" />
                    </div>
                    <h2 className="faq-title scratched-text-heavy">
                        Frequently Asked Questions
                    </h2>
                    <p className="faq-subtitle">
                        Common inquiries from prospective investigators
                    </p>
                </motion.div>

                {/* FAQ Grid */}
                <div className="faq-grid">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={faq.id}
                            faq={faq}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                            hasIntersected={hasIntersected}
                        />
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="faq-contact"
                >
                    <p className="faq-contact-text">
                        Still have questions?
                    </p>
                    <a href="/contact" className="faq-contact-button">
                        <span className="btn-icon">⌕</span>
                        <span className="btn-text">Access Case File</span>
                        <div className="btn-glow" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

const FAQItem = ({ faq, index, isOpen, onToggle, hasIntersected }) => {
    const Icon = faq.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`faq-item ${isOpen ? 'open' : ''}`}
        >
            {/* Evidence Tag */}
            <div className="evidence-tag">
                <span className="tag-label">FILE</span>
                <span className="tag-id">#{String(faq.id).padStart(3, '0')}</span>
            </div>

            {/* Question Header */}
            <button
                onClick={onToggle}
                className="faq-question"
                aria-expanded={isOpen}
            >
                <div className="question-icon">
                    <Icon size={20} />
                </div>
                <h3 className="question-text">{faq.question}</h3>
                <div className={`question-chevron ${isOpen ? 'open' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </button>

            {/* Answer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="faq-answer"
                    >
                        <div className="answer-content">
                            <p>{faq.answer}</p>
                        </div>
                        <div className="answer-glow" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Corner Markers */}
            <div className="corner-marker corner-tl" />
            <div className="corner-marker corner-br" />
        </motion.div>
    );
};

export default FAQSection;

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import EventAccordion from './EventAccordion.jsx'

const CategorySection = forwardRef(({ title, description, tagline, sections, index }, ref) => {
    return (
        <motion.section
            ref={ref}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`folder-case ${index === 0 ? 'high-clearance' : ''}`}
        >
            <div className="folder-texture" />
            <div className="high-clearance-glitch" />

            {/* Folder Tab at the top */}
            <div className="folder-tab">
                <span className="opacity-50">FILE NO.</span>
                <span>PR-{2026}-{(index + 1).toString().padStart(3, '0')}</span>
            </div>

            <div className="dossier-header relative z-10">
                <div className="dossier-label">PRIMARY CASE FILE</div>
                <div className="dossier-stamp">CONFIDENTIAL</div>
            </div>

            <div className="relative z-10 p-6 md:p-8">
                <div className="mb-10 flex flex-col items-center text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="category-title"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="category-description"
                    >
                        {description}
                    </motion.p>
                    {tagline && (
                        <p className="category-tagline">
                            {tagline}
                        </p>
                    )}
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-sm overflow-hidden shadow-2xl">
                    {sections.map((section, idx) => (
                        <EventAccordion
                            key={idx}
                            type={section.type}
                            events={section.events}
                            isOpen={idx === 0} // Open the first section by default
                        />
                    ))}
                </div>
            </div>
        </motion.section>
    )
})

CategorySection.displayName = 'CategorySection'

export default CategorySection

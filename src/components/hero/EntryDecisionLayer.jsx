import { memo, createElement } from 'react'
import { Link } from 'react-router-dom'
import { Search, Ticket } from 'lucide-react'

const ChoiceLink = memo(function ChoiceLink({ to, icon: Icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className={[
        'group relative block w-full rounded-2xl border border-[#5A0E0E]/40 bg-[#0A0A0B]/40 px-6 py-5',
        'transition-[transform,box-shadow,border-color] duration-200 will-change-transform',
        'hover:scale-[1.02] hover:border-[#5A0E0E]/70',
        'hover:shadow-[0_0_18px_rgba(90,14,14,0.22)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A0E0E]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B]',
      ].join(' ')}
    >
      {/* Subtle red pulse via radial gradient opacity (no animation) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(80% 60% at 50% 10%, rgba(90,14,14,0.35) 0%, rgba(10,10,11,0) 70%)',
        }}
      />

      <div className="relative flex items-start gap-4">
        <span
          className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#5A0E0E]/35 bg-[#0A0A0B]/60 text-[#D8D3C4]/85"
          aria-hidden="true"
        >
          {createElement(Icon, { size: 18 })}
        </span>
        <div className="min-w-0">
          <div className="font-heading text-sm sm:text-base uppercase tracking-[0.28em] text-[#D8D3C4]">
            {title}
          </div>
          <div className="mt-2 text-xs sm:text-sm leading-relaxed text-[#D8D3C4]/70">
            {subtitle}
          </div>
        </div>
      </div>
    </Link>
  )
})

const EntryDecisionLayer = memo(function EntryDecisionLayer() {
  return (
    <section aria-label="Entry decisions" className="w-full">
      <p className="text-center font-mono text-[11px] sm:text-xs uppercase tracking-[0.46em] text-[#D8D3C4]/60">
        Choose your rite
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChoiceLink
          to="/events"
          icon={Search}
          title="Initiate Inquiry"
          subtitle="Enter the archive. Examine the program. Follow the trace."
        />
        <ChoiceLink
          to="/register"
          icon={Ticket}
          title="Seal Entry"
          subtitle="Claim passage. Confirm identity. Mark your attendance."
        />
      </div>
    </section>
  )
})

export default EntryDecisionLayer



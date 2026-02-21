import { memo } from 'react'

const InvocationLayer = memo(function InvocationLayer() {
  return (
    <section aria-label="Invocation" className="text-center">
      <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.42em] text-[#D8D3C4]/70">
        Invocation Record • Classified Dossier
      </p>
      <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-[#D8D3C4]/80">
        By sealed decree, the gathering is convened. Observe without spectacle. Speak without name.
      </p>
    </section>
  )
})

export default InvocationLayer



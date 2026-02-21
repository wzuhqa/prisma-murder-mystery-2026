import { memo } from 'react'

const TemporalSealLayer = memo(function TemporalSealLayer() {
  return (
    <section aria-label="Temporal seal" className="text-center">
      <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.46em] text-[#D8D3C4]/60">
        Temporal Seal
      </p>
      <time
        dateTime="2026-02-28"
        className="mt-3 block font-heading text-lg sm:text-xl tracking-[0.28em] text-[#D8D3C4]"
      >
        28 FEB — 01 MAR 2026
      </time>
      <p className="mt-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.38em] text-[#D8D3C4]/55">
        Marked occurrence • SRM University Delhi‑NCR
      </p>
    </section>
  )
})

export default TemporalSealLayer



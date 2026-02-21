import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './Landing.css'

// ── Config ────────────────────────────────────────────────────────────────────
const EVENT_DATE = new Date('2026-03-15T09:00:00+05:30')

const LOADING_LINES = [
    'INITIALIZING PRISMA ARCHIVE…',
    'Verifying Structural Integrity…',
    'Architect Signature: AK-01',
    'System Status: STABLE'
]

// ── Countdown hook ────────────────────────────────────────────────────────────
const useCountdown = () => {
    const [t, setT] = useState({})
    useEffect(() => {
        const calc = () => {
            const diff = EVENT_DATE - new Date()
            if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 })
            setT({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000)
            })
        }
        calc()
        const id = setInterval(calc, 1000)
        return () => clearInterval(id)
    }, [])
    return t
}

// ── Tick unit ─────────────────────────────────────────────────────────────────
const Tick = ({ value, label }) => (
    <div className="lp-tick">
        <span className="lp-tick__value">{String(value ?? '00').padStart(2, '0')}</span>
        <span className="lp-tick__label">{label}</span>
    </div>
)

// ── Main ──────────────────────────────────────────────────────────────────────
const Landing = () => {
    const navigate = useNavigate()
    const countdown = useCountdown()
    const keyBufferRef = useRef('')

    const [phase, setPhase] = useState('boot')   // boot | slash | main
    const [currentLine, setCurrentLine] = useState(0)
    const [typedText, setTypedText] = useState('')
    const [visible, setVisible] = useState(false)
    const [pulseActive, setPulseActive] = useState(false)
    const [letters, setLetters] = useState('PRISMA'.split(''))
    const [glitching, setGlitching] = useState(false)

    const CHARS = '!@#$%&<>?'

    // ── Boot typewriter ───────────────────────────────────────────────────────
    useEffect(() => {
        if (phase !== 'boot') return
        if (currentLine >= LOADING_LINES.length) {
            setTimeout(() => {
                setPhase('slash')
                setTimeout(() => {
                    setPhase('main')
                    setTimeout(() => setVisible(true), 200)
                }, 700)
            }, 400)
            return
        }
        const line = LOADING_LINES[currentLine]
        let i = 0
        const id = setInterval(() => {
            if (i <= line.length) { setTypedText(line.slice(0, i)); i++ }
            else {
                clearInterval(id)
                setTimeout(() => { setCurrentLine(p => p + 1); setTypedText('') }, 350)
            }
        }, 40)
        return () => clearInterval(id)
    }, [currentLine, phase])

    // ── Keyword easter egg ────────────────────────────────────────────────────
    useEffect(() => {
        const fn = (e) => {
            keyBufferRef.current = (keyBufferRef.current + e.key.toLowerCase()).slice(-20)
            if (keyBufferRef.current.includes('archive')) {
                setPulseActive(true)
                setTimeout(() => setPulseActive(false), 800)
                keyBufferRef.current = ''
            }
        }
        window.addEventListener('keypress', fn)
        return () => window.removeEventListener('keypress', fn)
    }, [])

    // ── Periodic title glitch (very rare, ~30s) ───────────────────────────────
    const runGlitch = useCallback(() => {
        const orig = 'PRISMA'.split('')
        let frame = 0
        const total = 16
        const tick = () => {
            const resolved = Math.floor((frame / total) * orig.length)
            setLetters(orig.map((ch, i) =>
                i < resolved ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
            ))
            if (++frame <= total) requestAnimationFrame(tick)
            else { setLetters(orig); setGlitching(false) }
        }
        setGlitching(true)
        requestAnimationFrame(tick)
    }, [])

    useEffect(() => {
        if (phase !== 'main') return
        const id = setInterval(() => { if (Math.random() > 0.5) runGlitch() }, 30000)
        return () => clearInterval(id)
    }, [phase, runGlitch])

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="lp">

            {/* ── Layer 0: Premium background ── */}
            <div className="lp__bg-grain" />
            <div className="lp__bg-vignette" />
            <div className="lp__bg-beam" />
            <div className="lp__bg-parallax-shadow" />
            {pulseActive && <div className="lp__arg-pulse" />}

            {/* ── Corner accents ── */}
            <div className="lp__corner lp__corner--tl" />
            <div className="lp__corner lp__corner--tr" />
            <div className="lp__corner lp__corner--bl" />
            <div className="lp__corner lp__corner--br" />

            {/* ── BOOT PHASE ── */}
            {phase === 'boot' && (
                <div className="lp__boot">
                    <div className="lp__terminal">
                        {LOADING_LINES.slice(0, currentLine).map((line, i) => (
                            <div key={i} className="lp__terminal-line lp__terminal-line--done">
                                <span className="lp__terminal-tick">✓</span>{line}
                            </div>
                        ))}
                        {currentLine < LOADING_LINES.length && (
                            <div className="lp__terminal-line">
                                <span className="lp__terminal-tick lp__terminal-tick--active">›</span>
                                {typedText}<span className="lp__cursor">_</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── SLASH TRANSITION ── */}
            {phase === 'slash' && <div className="lp__slash" />}

            {/* ── MAIN PHASE ── */}
            {phase === 'main' && (
                <div className="lp__scene">

                    {/* ───────────────────────────────────────────────────────────
                        LEVEL 1 — PRIMARY FOCUS
                        PRISMA title + single primary CTA
                    ─────────────────────────────────────────────────────────── */}
                    <div className={`lp__hero ${visible ? 'lp__hero--visible' : ''}`}>

                        {/* Eyebrow */}
                        <p className="lp__eyebrow">SRM UNIVERSITY DELHI-NCR // EST. 2026</p>

                        {/* PRISMA — largest, highest contrast element */}
                        <h1 className={`lp__title ${glitching ? 'lp__title--glitch' : ''}`}>
                            {letters.map((ch, i) => (
                                <span key={i} className="lp__title-letter" style={{ '--i': i }}>{ch}</span>
                            ))}
                        </h1>

                        {/* Tagline */}
                        <p className="lp__tagline">
                            <span className="lp__tagline-rule" />
                            SOLVE THE MYSTERY. CLAIM YOUR LEGACY.
                            <span className="lp__tagline-rule" />
                        </p>

                        {/* Primary CTA — single most important action */}
                        <button
                            className="lp__cta-primary"
                            onClick={() => navigate('/register')}
                        >
                            <span className="lp__cta-primary__label">REGISTER NOW</span>
                            <span className="lp__cta-primary__sub">Enlist as an investigator</span>
                            <span className="lp__cta-primary__arrow">→</span>
                        </button>
                    </div>

                    {/* ───────────────────────────────────────────────────────────
                        LEVEL 2 — GLASS PANEL: secondary info
                        Countdown + secondary CTA
                    ─────────────────────────────────────────────────────────── */}
                    <div className={`lp__glass-panel ${visible ? 'lp__glass-panel--visible' : ''}`}>

                        {/* Countdown */}
                        <div className="lp__panel-section">
                            <p className="lp__panel-label">CASE CLOSES IN</p>
                            <div className="lp__clock">
                                <Tick value={countdown.d} label="DAYS" />
                                <span className="lp__clock-sep">:</span>
                                <Tick value={countdown.h} label="HRS" />
                                <span className="lp__clock-sep">:</span>
                                <Tick value={countdown.m} label="MIN" />
                                <span className="lp__clock-sep">:</span>
                                <Tick value={countdown.s} label="SEC" />
                            </div>
                        </div>

                        <div className="lp__panel-divider" />

                        {/* Secondary CTA */}
                        <button
                            className="lp__cta-secondary"
                            onClick={() => navigate('/events')}
                        >
                            VIEW EVENTS →
                        </button>

                        {/* Investigation meta */}
                        <div className="lp__panel-section lp__panel-meta">
                            <span>CASE #PR-2026-X</span>
                            <span>CLEARANCE: RESTRICTED</span>
                        </div>
                    </div>

                    {/* ───────────────────────────────────────────────────────────
                        LEVEL 3 — Whisper: barely visible background text
                    ─────────────────────────────────────────────────────────── */}
                    <div className={`lp__whisper ${visible ? 'lp__whisper--visible' : ''}`}>
                        MONITORING IN PROGRESS // ALL VISITORS RECORDED // CASE #PR-2026-X
                    </div>

                </div>
            )}
        </div>
    )
}

export default Landing

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const RainAudio = () => {
  const [volume, setVolume] = useState(0.15)
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    // Create audio element with rain sound
    const audio = new Audio()
    audio.loop = true
    audio.volume = 0
    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 15px',
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '30px',
        border: '1px solid rgba(220, 38, 38, 0.3)',
        backdropFilter: 'blur(10px)',
        pointerEvents: 'auto'
      }}
    >
      <button
        onClick={toggleMute}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: isMuted ? '#ef4444' : '#fca5a5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '5px',
          transition: 'color 0.3s'
        }}
        aria-label={isMuted ? 'Unmute rain' : 'Mute rain'}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
        style={{
          width: '80px',
          height: '4px',
          cursor: 'pointer',
          accentColor: '#dc2626',
          background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`,
          borderRadius: '2px',
          appearance: 'none'
        }}
      />
      
      <span
        style={{
          color: '#fca5a5',
          fontSize: '12px',
          fontFamily: 'monospace',
          letterSpacing: '1px'
        }}
      >
        🌧️
      </span>
    </div>
  )
}

export default RainAudio


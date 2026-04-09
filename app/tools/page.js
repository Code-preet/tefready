'use client'
import { useState, useRef, useEffect } from 'react'

// ─── NUMBER TO FRENCH CONVERTER ───────────────────────────────
function numberToFrench(n) {
  if (isNaN(n) || n < 0 || n > 999999999) return 'Nombre invalide (0–999,999,999)'
  if (n === 0) return 'zéro'

  const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf']
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante']

  function belowHundred(n) {
    if (n < 20) return ones[n]
    if (n < 70) {
      const t = Math.floor(n / 10)
      const o = n % 10
      return tens[t] + (o === 1 ? ' et un' : o > 0 ? '-' + ones[o] : '')
    }
    if (n < 80) {
      const o = n - 60
      return 'soixante' + (o === 1 ? ' et onze' : '-' + belowHundred(o))
    }
    if (n < 100) {
      const o = n - 80
      return 'quatre-vingts' + (o === 0 ? '' : (o > 0 ? '-' : '') + belowHundred(o)).replace('quatre-vingts-', 'quatre-vingt-')
    }
  }

  function belowThousand(n) {
    if (n < 100) return belowHundred(n)
    const h = Math.floor(n / 100)
    const r = n % 100
    const hundredPart = (h === 1 ? 'cent' : ones[h] + ' cent') + (r === 0 && h > 1 ? 's' : '')
    return hundredPart + (r > 0 ? ' ' + belowHundred(r) : '')
  }

  if (n < 1000) return belowThousand(n)

  if (n < 1000000) {
    const thousands = Math.floor(n / 1000)
    const remainder = n % 1000
    const thousandPart = thousands === 1 ? 'mille' : belowThousand(thousands) + ' mille'
    return thousandPart + (remainder > 0 ? ' ' + belowThousand(remainder) : '')
  }

  const millions = Math.floor(n / 1000000)
  const remainder = n % 1000000
  const millionPart = millions === 1 ? 'un million' : belowThousand(millions) + ' millions'
  return millionPart + (remainder > 0 ? ' ' + belowThousand(remainder) : '')
}

function getOrdinal(n) {
  if (n === 1) return 'premier / première'
  const fr = numberToFrench(n)
  if (fr.endsWith('e')) return fr + 'ième'
  return fr + 'ième'
}

// ─── INTERACTIVE CLOCK ────────────────────────────────────────
function timeToFrench(hours, minutes) {
  const h = hours % 12 || 12
  const h24 = hours

  let spoken = ''
  if (hours === 0 && minutes === 0) spoken = 'minuit'
  else if (hours === 12 && minutes === 0) spoken = 'midi'
  else if (minutes === 0) spoken = `Il est ${numberToFrench(h)} heure${h > 1 ? 's' : ''}`
  else if (minutes === 15) spoken = `Il est ${numberToFrench(h)} heure${h > 1 ? 's' : ''} et quart`
  else if (minutes === 30) spoken = `Il est ${numberToFrench(h)} heure${h > 1 ? 's' : ''} et demie`
  else if (minutes === 45) spoken = `Il est ${numberToFrench(h === 12 ? 1 : h + 1)} heure${(h + 1) > 1 ? 's' : ''} moins le quart`
  else if (minutes < 30) spoken = `Il est ${numberToFrench(h)} heure${h > 1 ? 's' : ''} ${numberToFrench(minutes)}`
  else spoken = `Il est ${numberToFrench(h === 12 ? 1 : h + 1)} heure${(h + 1) > 1 ? 's' : ''} moins ${numberToFrench(60 - minutes)}`

  const period = hours < 12 ? 'du matin' : hours < 18 ? 'de l\'après-midi' : 'du soir'
  const official = `${String(h24).padStart(2, '0')}h${String(minutes).padStart(2, '0')} (${numberToFrench(h24)} heures ${minutes > 0 ? numberToFrench(minutes) : ''})`

  return { spoken, period, official }
}

function Clock({ hours, minutes, onTimeChange }) {
  const canvasRef = useRef(null)
  const [dragging, setDragging] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const cx = 150, cy = 150, r = 130

    ctx.clearRect(0, 0, 300, 300)

    // Clock face
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    ctx.fillStyle = '#FFFEF5'
    ctx.fill()
    ctx.strokeStyle = '#0A2540'
    ctx.lineWidth = 3
    ctx.stroke()

    // Hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * Math.PI / 180
      const x1 = cx + (r - 10) * Math.cos(angle)
      const y1 = cy + (r - 10) * Math.sin(angle)
      const x2 = cx + (r - 20) * Math.cos(angle)
      const y2 = cy + (r - 20) * Math.sin(angle)
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = '#0A2540'
      ctx.lineWidth = i % 3 === 0 ? 3 : 1
      ctx.stroke()
    }

    // Hour numbers
    ctx.fillStyle = '#0A2540'
    ctx.font = 'bold 14px Outfit, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * Math.PI / 180
      const x = cx + (r - 35) * Math.cos(angle)
      const y = cy + (r - 35) * Math.sin(angle)
      ctx.fillText(i, x, y)
    }

    // Hour hand
    const hourAngle = ((hours % 12) * 30 + minutes * 0.5 - 90) * Math.PI / 180
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + 70 * Math.cos(hourAngle), cy + 70 * Math.sin(hourAngle))
    ctx.strokeStyle = '#0A2540'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.stroke()

    // Minute hand
    const minAngle = (minutes * 6 - 90) * Math.PI / 180
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + 100 * Math.cos(minAngle), cy + 100 * Math.sin(minAngle))
    ctx.strokeStyle = '#E8A020'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.stroke()

    // Center dot
    ctx.beginPath()
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI)
    ctx.fillStyle = '#0A2540'
    ctx.fill()
  }, [hours, minutes])

  const getAngle = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const x = clientX - rect.left - 150
    const y = clientY - rect.top - 150
    return Math.atan2(y, x)
  }

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current
    const angle = getAngle(e, canvas) * 180 / Math.PI + 90
    const normAngle = (angle + 360) % 360
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const dist = Math.sqrt((clientX - rect.left - 150) ** 2 + (clientY - rect.top - 150) ** 2)
    if (dist < 40) return
    const hourAngle = ((hours % 12) * 30 + minutes * 0.5 + 360) % 360
    const minAngle = (minutes * 6 + 360) % 360
    const hourDiff = Math.abs(normAngle - hourAngle)
    const minDiff = Math.abs(normAngle - minAngle)
    setDragging(hourDiff < minDiff ? 'hour' : 'minute')
  }

  const handleMouseMove = (e) => {
    if (!dragging) return
    const canvas = canvasRef.current
    const angle = getAngle(e, canvas) * 180 / Math.PI + 90
    const normAngle = (angle + 360) % 360
    if (dragging === 'hour') {
      const newHour = Math.round(normAngle / 30) % 12
      onTimeChange(newHour + (hours >= 12 ? 12 : 0), minutes)
    } else {
      const newMin = Math.round(normAngle / 6) % 60
      onTimeChange(hours, newMin)
    }
  }

  const handleMouseUp = () => setDragging(null)

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      style={{ cursor: 'grab', borderRadius: '50%', boxShadow: '0 4px 24px rgba(10,37,64,0.15)' }}
    />
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────
export default function ToolsPage() {
  const [number, setNumber] = useState('')
  const [hours, setHours] = useState(10)
  const [minutes, setMinutes] = useState(10)
  const [ampm, setAmpm] = useState('am')

  const actualHours = ampm === 'pm' && hours !== 12 ? hours + 12 : ampm === 'am' && hours === 12 ? 0 : hours
  const frenchTime = timeToFrench(actualHours, minutes)
  const numValue = parseInt(number)
  const frenchNum = number !== '' && !isNaN(numValue) ? numberToFrench(numValue) : null

  return (
    <div style={{ minHeight: '100vh', background: '#FFFEF5', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '2rem 1rem 6rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
            🛠️ French Learning Tools
          </h1>
          <p style={{ color: '#718096', margin: 0 }}>Interactive tools to master French numbers and time</p>
        </div>

        {/* NUMBER CONVERTER */}
        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', marginBottom: '2rem', border: '1.5px solid #E8F0FB', boxShadow: '0 4px 20px rgba(10,37,64,0.06)' }}>
          <h2 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
            🔢 Number → French Converter
          </h2>
          <p style={{ color: '#718096', fontSize: '0.875rem', margin: '0 0 1.5rem' }}>
            Type any number (0–999,999,999) and see it in French instantly
          </p>

          <input
            type="number"
            value={number}
            onChange={e => setNumber(e.target.value)}
            placeholder="Enter any number..."
            min="0"
            max="999999999"
            style={{
              width: '100%', padding: '1rem 1.25rem', borderRadius: '0.75rem',
              border: '2px solid #E2E8F0', fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif",
              color: '#0A2540', background: '#FAFBFF', outline: 'none', boxSizing: 'border-box',
              marginBottom: '1rem'
            }}
          />

          {frenchNum && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: '#0A2540', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>French (Cardinal)</p>
                <p style={{ color: '#E8A020', fontSize: '1.6rem', fontWeight: 800, margin: '0', fontFamily: "'Outfit', sans-serif" }}>{frenchNum}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: '#F0FDF4', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center', border: '1px solid #86EFAC' }}>
                  <p style={{ color: '#065F46', fontSize: '0.75rem', margin: '0 0 0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>Ordinal</p>
                  <p style={{ color: '#065F46', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{numValue > 0 ? getOrdinal(numValue) : '—'}</p>
                </div>
                <div style={{ background: '#FFF8EC', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center', border: '1px solid #F6D07A' }}>
                  <p style={{ color: '#92400E', fontSize: '0.75rem', margin: '0 0 0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>Pronunciation tip</p>
                  <p style={{ color: '#92400E', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>
                    {numValue >= 70 && numValue < 80 ? '70s = soixante + ten' :
                     numValue >= 80 && numValue < 90 ? '80s = quatre-vingts' :
                     numValue >= 90 && numValue < 100 ? '90s = quatre-vingt-dix' :
                     numValue >= 1000000 ? 'million(s) + remainder' :
                     numValue >= 1000 ? 'mille is invariable' : 'Read digit by digit'}
                  </p>
                </div>
              </div>

              {/* Quick examples */}
              <div style={{ background: '#F7F9FC', borderRadius: '0.75rem', padding: '1rem' }}>
                <p style={{ color: '#0A2540', fontWeight: 700, fontSize: '0.85rem', margin: '0 0 0.5rem' }}>📚 In a sentence:</p>
                <p style={{ color: '#4A5568', fontSize: '0.875rem', margin: 0, fontStyle: 'italic' }}>
                  "Il y a {frenchNum} {numValue === 1 ? 'personne' : 'personnes'} ici."
                </p>
                <p style={{ color: '#4A5568', fontSize: '0.875rem', margin: '0.25rem 0 0', fontStyle: 'italic' }}>
                  "J'ai {frenchNum} {numValue === 1 ? 'dollar' : 'dollars'} dans mon portefeuille."
                </p>
              </div>
            </div>
          )}

          {/* Quick number buttons */}
          <div style={{ marginTop: '1rem' }}>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>Quick examples:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {[17, 71, 80, 92, 100, 1000, 1500, 1000000].map(n => (
                <button key={n} onClick={() => setNumber(String(n))} style={{
                  background: number === String(n) ? '#0A2540' : '#F1F5F9',
                  color: number === String(n) ? 'white' : '#0A2540',
                  border: 'none', borderRadius: '0.5rem', padding: '0.4rem 0.8rem',
                  fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600
                }}>{n.toLocaleString()}</button>
              ))}
            </div>
          </div>
        </div>

        {/* INTERACTIVE CLOCK */}
        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', border: '1.5px solid #E8F0FB', boxShadow: '0 4px 20px rgba(10,37,64,0.06)' }}>
          <h2 style={{ color: '#0A2540', fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
            🕐 Interactive French Clock
          </h2>
          <p style={{ color: '#718096', fontSize: '0.875rem', margin: '0 0 1.5rem' }}>
            Drag the clock hands to set the time and learn how to say it in French
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <Clock hours={actualHours} minutes={minutes} onTimeChange={(h, m) => {
              const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
              setHours(displayH)
              setMinutes(m)
              setAmpm(h >= 12 ? 'pm' : 'am')
            }} />

            {/* Manual controls */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', fontSize: '0.75rem', margin: '0 0 0.3rem', textTransform: 'uppercase' }}>Hour</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => setHours(h => h === 1 ? 12 : h - 1)} style={btnStyle}>−</button>
                  <span style={{ color: '#0A2540', fontWeight: 800, fontSize: '1.5rem', minWidth: '2rem', textAlign: 'center' }}>{hours}</span>
                  <button onClick={() => setHours(h => h === 12 ? 1 : h + 1)} style={btnStyle}>+</button>
                </div>
              </div>
              <span style={{ color: '#0A2540', fontSize: '2rem', fontWeight: 800, marginTop: '1rem' }}>:</span>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', fontSize: '0.75rem', margin: '0 0 0.3rem', textTransform: 'uppercase' }}>Minute</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => setMinutes(m => m === 0 ? 59 : m - 1)} style={btnStyle}>−</button>
                  <span style={{ color: '#0A2540', fontWeight: 800, fontSize: '1.5rem', minWidth: '2rem', textAlign: 'center' }}>{String(minutes).padStart(2, '0')}</span>
                  <button onClick={() => setMinutes(m => m === 59 ? 0 : m + 1)} style={btnStyle}>+</button>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', fontSize: '0.75rem', margin: '0 0 0.3rem', textTransform: 'uppercase' }}>AM/PM</p>
                <button onClick={() => setAmpm(a => a === 'am' ? 'pm' : 'am')} style={{
                  background: '#0A2540', color: 'white', border: 'none', borderRadius: '0.5rem',
                  padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', marginTop: '0.3rem'
                }}>{ampm.toUpperCase()}</button>
              </div>
            </div>

            {/* Time display */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: '#0A2540', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', fontSize: '0.75rem', margin: '0 0 0.4rem', textTransform: 'uppercase' }}>Spoken French (12h)</p>
                <p style={{ color: '#E8A020', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.25rem', fontFamily: "'Outfit', sans-serif" }}>
                  {frenchTime.spoken}
                </p>
                {frenchTime.spoken !== 'midi' && frenchTime.spoken !== 'minuit' && (
                  <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>{frenchTime.period}</p>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: '#F7F9FC', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                  <p style={{ color: '#64748B', fontSize: '0.75rem', margin: '0 0 0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>Digital</p>
                  <p style={{ color: '#0A2540', fontSize: '1.5rem', fontWeight: 800, margin: 0, fontFamily: 'monospace' }}>
                    {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')} {ampm.toUpperCase()}
                  </p>
                </div>
                <div style={{ background: '#F7F9FC', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                  <p style={{ color: '#64748B', fontSize: '0.75rem', margin: '0 0 0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>24h (Official)</p>
                  <p style={{ color: '#0A2540', fontSize: '1.5rem', fontWeight: 800, margin: 0, fontFamily: 'monospace' }}>
                    {String(actualHours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
                  </p>
                </div>
              </div>

              {/* All ways to say it */}
              <div style={{ background: '#FFF8EC', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #F6D07A' }}>
                <p style={{ color: '#92400E', fontWeight: 700, fontSize: '0.85rem', margin: '0 0 0.5rem' }}>💡 All ways to say this time:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <p style={{ color: '#78350F', fontSize: '0.85rem', margin: 0 }}>
                    📢 Informal: {frenchTime.spoken}
                    {frenchTime.spoken !== 'midi' && frenchTime.spoken !== 'minuit' && ` ${frenchTime.period}`}
                  </p>
                  <p style={{ color: '#78350F', fontSize: '0.85rem', margin: 0 }}>
                    📋 Official: Il est {numberToFrench(actualHours)} heures {minutes > 0 ? numberToFrench(minutes) : ''}
                  </p>
                  <p style={{ color: '#78350F', fontSize: '0.85rem', margin: 0 }}>
                    ❓ Question: Quelle heure est-il ? — Il est {frenchTime.spoken}.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick time buttons */}
            <div style={{ width: '100%' }}>
              <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>Quick times:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  { h: 12, m: 0, label: 'Midi' },
                  { h: 0, m: 0, label: 'Minuit' },
                  { h: 8, m: 15, label: '8h15' },
                  { h: 9, m: 30, label: '9h30' },
                  { h: 10, m: 45, label: '10h45' },
                  { h: 13, m: 0, label: '13h00' },
                  { h: 17, m: 30, label: '17h30' },
                ].map(t => (
                  <button key={t.label} onClick={() => {
                    const displayH = t.h > 12 ? t.h - 12 : t.h === 0 ? 12 : t.h
                    setHours(displayH)
                    setMinutes(t.m)
                    setAmpm(t.h >= 12 ? 'pm' : 'am')
                  }} style={{
                    background: '#F1F5F9', color: '#0A2540', border: 'none',
                    borderRadius: '0.5rem', padding: '0.4rem 0.8rem',
                    fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600
                  }}>{t.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const btnStyle = {
  background: '#F1F5F9', color: '#0A2540', border: 'none',
  borderRadius: '0.5rem', width: '32px', height: '32px',
  fontSize: '1.1rem', cursor: 'pointer', fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
}
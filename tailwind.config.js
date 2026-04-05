/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FFFEF5',
        navy: { DEFAULT: '#0A2540', light: '#1a3a5c', 50: '#e8f0f8' },
        gold:  { DEFAULT: '#E8A020', light: '#FEF3C7', muted: '#92400E' },
        a1:    { DEFAULT: '#7C3AED', bg: '#F5F3FF', text: '#5B21B6' },
        a2:    { DEFAULT: '#0D9488', bg: '#F0FDFA', text: '#0F766E' },
        b1:    { DEFAULT: '#D97706', bg: '#FFFBEB', text: '#B45309' },
        b2:    { DEFAULT: '#DC2626', bg: '#FEF2F2', text: '#B91C1C' },
        tef:   { DEFAULT: '#BE185D', bg: '#FDF2F8', text: '#9D174D' },
        forest:{ DEFAULT: '#15803D', bg: '#F0FDF4' },
        slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 400: '#94a3b8', 600: '#475569', 800: '#1e293b' },
      },
      fontFamily: {
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.25rem', '4xl': '1.5rem' },
      boxShadow: {
        card: '0 1px 3px rgba(10,37,64,0.06), 0 1px 2px rgba(10,37,64,0.04)',
        lift: '0 4px 12px rgba(10,37,64,0.10), 0 2px 4px rgba(10,37,64,0.06)',
        glow: '0 0 0 3px rgba(232,160,32,0.25)',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pop:     { '0%': { transform: 'scale(0.95)' }, '60%': { transform: 'scale(1.03)' }, '100%': { transform: 'scale(1)' } },
        celebrate: { '0%,100%': { transform: 'rotate(-3deg) scale(1)' }, '50%': { transform: 'rotate(3deg) scale(1.1)' } },
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pop':      'pop 0.35s ease-out',
        'celebrate':'celebrate 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
}

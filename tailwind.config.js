/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Surfaces ──────────────────────────────────────────────────────────
        ivory: '#EFF6FF',          // soft sky-blue page background (replaces cream)
        surface: '#FFFFFF',        // card / panel surface

        // ── Primary — rich blue ───────────────────────────────────────────────
        navy: {
          DEFAULT: '#1D4ED8',      // blue-700  (was dark navy #0A2540)
          light:   '#3B82F6',      // blue-500
          dark:    '#1E3A8A',      // blue-900  (deep headings)
          50:      '#EFF6FF',      // blue-50   (tints / hover)
          100:     '#DBEAFE',      // blue-100
        },
        primary: {
          DEFAULT: '#2563EB',      // blue-600  — main CTA blue
          light:   '#DBEAFE',      // blue-100
          dark:    '#1D4ED8',      // blue-700
          hover:   '#1E40AF',      // blue-800  hover
        },

        // ── Accent — purple ───────────────────────────────────────────────────
        accent: {
          DEFAULT: '#7C3AED',      // violet-600
          light:   '#EDE9FE',      // violet-100
          muted:   '#DDD6FE',      // violet-200
          dark:    '#6D28D9',      // violet-700
        },

        // ── Semantic ──────────────────────────────────────────────────────────
        success: { DEFAULT: '#16A34A', light: '#DCFCE7', dark: '#15803D' },  // green
        warning: { DEFAULT: '#EA580C', light: '#FFF7ED', dark: '#C2410C' },  // orange
        danger:  { DEFAULT: '#DC2626', light: '#FEF2F2', dark: '#B91C1C' },  // red
        info:    { DEFAULT: '#0891B2', light: '#E0F2FE', dark: '#0E7490' },  // cyan

        // ── Gold / XP ─────────────────────────────────────────────────────────
        gold:  { DEFAULT: '#D97706', light: '#FEF9C3', muted: '#92400E' },

        // ── Module colours ────────────────────────────────────────────────────
        a1:  { DEFAULT: '#7C3AED', bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
        a2:  { DEFAULT: '#0891B2', bg: '#E0F2FE', text: '#0E7490', border: '#BAE6FD' },
        b1:  { DEFAULT: '#D97706', bg: '#FEF9C3', text: '#B45309', border: '#FDE68A' },
        b2:  { DEFAULT: '#2563EB', bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' },
        tef: { DEFAULT: '#7C3AED', bg: '#EDE9FE', text: '#6D28D9', border: '#C4B5FD' },

        forest: { DEFAULT: '#16A34A', bg: '#DCFCE7' },

        // ── Greys ─────────────────────────────────────────────────────────────
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },

      fontFamily: {
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Bigger, clearer hierarchy for long study sessions
        'hero':  ['2.25rem', { lineHeight: '1.15', fontWeight: '800', letterSpacing: '-0.02em' }],
        'h1':    ['1.875rem',{ lineHeight: '1.2',  fontWeight: '700' }],
        'h2':    ['1.5rem',  { lineHeight: '1.3',  fontWeight: '700' }],
        'h3':    ['1.25rem', { lineHeight: '1.35', fontWeight: '600' }],
        'h4':    ['1.125rem',{ lineHeight: '1.4',  fontWeight: '600' }],
        'body':  ['1rem',    { lineHeight: '1.65' }],
        'body-sm':['0.9375rem',{ lineHeight: '1.6' }],
        'caption':['0.8125rem',{ lineHeight: '1.5' }],
      },

      borderRadius: {
        'sm':  '0.375rem',
        'md':  '0.5rem',
        'lg':  '0.75rem',
        'xl':  '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        'full':'9999px',
      },

      boxShadow: {
        // Blue-tinted shadows feel softer and on-brand
        'xs':   '0 1px 3px rgba(37,99,235,0.07)',
        'card': '0 2px 10px rgba(37,99,235,0.08), 0 1px 3px rgba(37,99,235,0.05)',
        'lift': '0 8px 28px rgba(37,99,235,0.14), 0 2px 8px rgba(37,99,235,0.07)',
        'float':'0 16px 48px rgba(37,99,235,0.16), 0 4px 12px rgba(37,99,235,0.08)',
        'glow': '0 0 0 3px rgba(37,99,235,0.22)',
        'glow-purple':'0 0 0 3px rgba(124,58,237,0.22)',
        'glow-green': '0 0 0 3px rgba(22,163,74,0.22)',
        'inner-blue': 'inset 0 1px 3px rgba(37,99,235,0.10)',
      },

      keyframes: {
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn:  { from: { opacity: '0', transform: 'translateX(-12px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pop:      { '0%': { transform: 'scale(0.92)', opacity:'0' }, '60%': { transform: 'scale(1.04)' }, '100%': { transform: 'scale(1)', opacity:'1' } },
        celebrate:{ '0%,100%': { transform: 'rotate(-4deg) scale(1)' }, '50%': { transform: 'rotate(4deg) scale(1.12)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseRing:{ '0%': { transform: 'scale(1)', opacity:'0.6' }, '100%': { transform: 'scale(1.55)', opacity:'0' } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        'fade-in':    'fadeIn 0.25s ease-out',
        'slide-up':   'slideUp 0.32s ease-out',
        'slide-in':   'slideIn 0.28s ease-out',
        'pop':        'pop 0.38s cubic-bezier(0.175,0.885,0.32,1.275)',
        'pop-in':     'pop 0.38s cubic-bezier(0.175,0.885,0.32,1.275)',
        'celebrate':  'celebrate 0.65s ease-in-out',
        'shimmer':    'shimmer 2s linear infinite',
        'pulse-ring': 'pulseRing 1.2s ease-out infinite',
        'float':      'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

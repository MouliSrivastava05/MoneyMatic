/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',   // primary teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
          start: '#14b8a6',
          end: '#0d9488',
        },
        accent: {
          purple: '#8b5cf6',
          indigo: '#6366f1',
          blue: '#3b82f6',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
        ink: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#172033',
          900: '#0f172a',
          950: '#070c18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Apple Color Emoji', 'Segoe UI Emoji'],
        display: ['Plus Jakarta Sans', 'Poppins', 'Inter', 'system-ui'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft':     '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'card':     '0 4px 24px -4px rgba(15,23,42,0.12), 0 2px 8px -2px rgba(15,23,42,0.08)',
        'elevated': '0 20px 60px -15px rgba(15,23,42,0.3)',
        'glow-sm':  '0 0 20px -5px rgba(20,184,166,0.3)',
        'glow':     '0 0 40px -10px rgba(20,184,166,0.4)',
        'glow-lg':  '0 0 80px -20px rgba(20,184,166,0.5)',
        'brand':    '0 8px 30px -8px rgba(20,184,166,0.5)',
        'inner-sm': 'inset 0 1px 2px rgba(0,0,0,0.06)',
        'glass':    '0 8px 32px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-brand': 'radial-gradient(at 40% 20%, rgba(20,184,166,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(99,102,241,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(20,184,166,0.08) 0px, transparent 50%)',
      },
      keyframes: {
        subtleIn: {
          '0%':   { opacity: 0, transform: 'translateY(8px) scale(.97)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        slideInRight: {
          '0%':   { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%':      { opacity: .6 },
        },
        shimmer: {
          '100%': { backgroundPosition: '-200% 0' },
        },
        heroGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%':      { opacity: 0.9, transform: 'scale(1.08)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        spinSlow: {
          'from': { transform: 'rotate(0deg)' },
          'to':   { transform: 'rotate(360deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        moneyGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(20,184,166,0.4), 0 0 24px rgba(20,184,166,0.2)' },
          '50%':      { boxShadow: '0 0 24px rgba(20,184,166,0.7), 0 0 40px rgba(20,184,166,0.4)' },
        },
        fadeIn: {
          'from': { opacity: 0, transform: 'translateY(12px)' },
          'to':   { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          'from': { opacity: 0, transform: 'scale(0.95)' },
          'to':   { opacity: 1, transform: 'scale(1)' },
        },
        gradientShift: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        subtleIn:           'subtleIn .5s cubic-bezier(0.16,1,0.3,1) both',
        'subtleIn-delay':   'subtleIn .5s cubic-bezier(0.16,1,0.3,1) .12s both',
        'subtleIn-delay2':  'subtleIn .5s cubic-bezier(0.16,1,0.3,1) .22s both',
        slideInRight:       'slideInRight .4s cubic-bezier(0.16,1,0.3,1) both',
        pulseSoft:          'pulseSoft 2.5s ease-in-out infinite',
        shimmer:            'shimmer 1.5s infinite linear',
        heroGlow:           'heroGlow 8s ease-in-out infinite',
        float:              'float 6s ease-in-out infinite',
        'spin-slow':        'spinSlow 8s linear infinite',
        'bounce-slow':      'bounceSoft 2s ease-in-out infinite',
        'money-glow':       'moneyGlow 2.5s ease-in-out infinite',
        'fade-in':          'fadeIn .6s cubic-bezier(0.16,1,0.3,1)',
        'scale-in':         'scaleIn .35s cubic-bezier(0.16,1,0.3,1)',
        gradientShift:      'gradientShift 15s ease infinite',
      },
    },
  },
  plugins: [],
};
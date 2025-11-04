/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional, finance-leaning palette
        brand: {
          50:  '#f2fbf9',
          100: '#e6f6f2',
          200: '#c4eae0',
          300: '#9fdccc',
          400: '#5fc0a3',
          500: '#2ea889',   // primary
          600: '#238671',
          700: '#1c6a5b',
          800: '#174f45',
          900: '#113a33',
        },
        ink: {
          50:  '#f7f7f8',
          100: '#efeff1',
          200: '#dcdcdf',
          300: '#b8b9c0',
          400: '#8f91a1',
          500: '#6a6d83',
          600: '#515367',
          700: '#3e4050',
          800: '#2d2f3c',
          900: '#1f202a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Apple Color Emoji', 'Segoe UI Emoji'],
        display: ['Poppins', 'Inter', 'system-ui'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0,0,0,0.15)',
        card: '0 12px 40px -20px rgba(0,0,0,0.25)',
        glow: '0 0 0 6px rgba(46,168,137,0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        subtleIn: {
          '0%': { opacity: 0, transform: 'translateY(6px) scale(.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .6 },
        },
      },
      animation: {
        subtleIn: 'subtleIn .5s ease-out both',
        'subtleIn-delay': 'subtleIn .5s ease-out .1s both',
        pulseSoft: 'pulseSoft 2.5s ease-in-out infinite',
      },
      gradientColorStops: {
        'brand-start': '#2ea889',
        'brand-end': '#5fc0a3',
      },
    },
  },
  plugins: [],
};
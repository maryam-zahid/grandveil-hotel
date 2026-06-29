/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf9f0',
          100: '#f9edcc',
          200: '#f0d48a',
          300: '#e8bd5e',
          400: '#d4a432',
          500: '#c5a028',
          600: '#a07c1e',
          700: '#7a5d16',
          800: '#5a440f',
          900: '#3d2e0a',
        },
        stone: {
          850: '#1c1a17',
          950: '#0d0c09',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideLeft: { '0%': { opacity: 0, transform: 'translateX(24px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #c5a028 0%, #e8bd5e 50%, #c5a028 100%)',
        'shimmer-gold': 'linear-gradient(90deg, transparent 0%, rgba(197,160,40,0.4) 50%, transparent 100%)',
      }
    },
  },
  plugins: [],
}
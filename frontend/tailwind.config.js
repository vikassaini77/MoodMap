/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
          400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1',
          800: '#075985', 900: '#0c4a6e',
        },
        cream: { 50: '#fffbf0', 100: '#fff8e1', 200: '#ffecb3', 300: '#ffe082', 400: '#ffd54f' },
        mint: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e' },
        coral: { 50: '#fff5f5', 100: '#ffe4e1', 200: '#ffc5bc', 300: '#ff9a8b', 400: '#ff6b6b', 500: '#ff4444' },
        peach: { 50: '#fff8f5', 100: '#ffeee8', 200: '#ffd5c2', 300: '#ffb494', 400: '#ff8c5a', 500: '#ff6b2b' },
        warm: { 50: '#fffaf5', 100: '#fff3e0', 200: '#ffe0b2', 300: '#ffcc80', 400: '#ffa726', 500: '#ff9800' },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        breathe: 'breathe 4s ease-in-out infinite',
        drift: 'drift 20s linear infinite',
        'drift-slow': 'drift 35s linear infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        bounce_soft: 'bounce_soft 2s ease-in-out infinite',
        wave: 'wave 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        pulse_soft: 'pulse_soft 3s ease-in-out infinite',
        rain: 'rain 1.5s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(1deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        drift: {
          '0%': { transform: 'translateX(-120px)' },
          '100%': { transform: 'translateX(calc(100vw + 120px))' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        bounce_soft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(20deg)' },
          '75%': { transform: 'rotate(-10deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse_soft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        rain: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100px)', opacity: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.06)',
        glow: '0 0 30px rgba(14, 165, 233, 0.3)',
        'glow-green': '0 0 30px rgba(34, 197, 94, 0.3)',
        'glow-coral': '0 0 30px rgba(255, 107, 107, 0.3)',
        float: '0 20px 60px rgba(0,0,0,0.1)',
        card: '0 8px 32px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

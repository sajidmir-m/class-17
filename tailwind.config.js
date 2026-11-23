/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          950: '#08080a',
          900: '#0e0e11',
          850: '#131317',
          800: '#18181d',
          700: '#232329',
          600: '#2e2e36',
        },
        gold: {
          100: '#faf3dc',
          200: '#f3e3b0',
          300: '#ebd18a',
          400: '#e0bb5c',
          500: '#c9a03f',
          600: '#a8832f',
          700: '#7f6223',
        },
      },
      keyframes: {
        'kenburns-in': {
          '0%': { transform: 'scale(1.04) translate3d(0, 0, 0)' },
          '100%': { transform: 'scale(1.18) translate3d(-2%, -1.5%, 0)' },
        },
        'kenburns-out': {
          '0%': { transform: 'scale(1.18) translate3d(2%, 1.5%, 0)' },
          '100%': { transform: 'scale(1.04) translate3d(0, 0, 0)' },
        },
        progress: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'kenburns-in': 'kenburns-in 7s ease-out forwards',
        'kenburns-out': 'kenburns-out 7s ease-out forwards',
        progress: 'progress linear forwards',
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
}

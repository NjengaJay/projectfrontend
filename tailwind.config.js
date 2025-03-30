/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          dark: '#5A52D9',
        },
        dark: {
          DEFAULT: '#1A1A1A',
          lighter: '#2A2A2A',
          card: '#242424',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.5s ease-out',
        'slide-out': 'slideOut 0.5s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}

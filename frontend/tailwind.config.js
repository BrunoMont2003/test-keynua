/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          500: '#2563eb',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        danger: {
          600: '#ef4444',
          700: '#dc2626',
        },
        warning: '#ff9800',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.3s ease',
        fadeIn: 'fadeIn 0.2s ease',
        scaleIn: 'scaleIn 0.5s ease',
      },
    },
  },
  plugins: [],
}

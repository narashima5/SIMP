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
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          glow: 'rgba(99, 102, 241, 0.15)',
        },
        secondary: {
          DEFAULT: '#a855f7',
          glow: 'rgba(168, 85, 247, 0.15)',
        },
        accent: {
          DEFAULT: '#14b8a6',
          glow: 'rgba(20, 184, 166, 0.15)',
        },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d0f14',
        card: '#111520',
        card2: '#1a1d2a',
        border: '#1e2130',
        border2: '#2e3155',
        bull: '#4ade80',
        bear: '#f87171',
        accent: '#a5b4fc',
        accent2: '#6366f1',
        demo: '#facc15',
        muted: '#555555',
        muted2: '#3a3a3c',
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

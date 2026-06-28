/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        whatsapp: {
          light: '#25D366',
          dark: '#075E54',
          teal: '#128C7E',
          blue: '#34B7F1',
          bg: '#ECE5DD',
          chatBg: '#0b141a',
          bubbleOut: '#005c4b',
          bubbleIn: '#202c33',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

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
        dark: {
          bg: '#0b0f19',
          card: '#111827',
          surface: '#1f2937',
          border: '#374151',
          hover: '#1e293b'
        },
        life: {
          green: '#10b981',
          greenLight: '#34d399',
          greenDark: '#059669',
          amber: '#f59e0b',
          amberLight: '#fbbf24',
          cyan: '#06b6d4',
          blue: '#3b82f6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}

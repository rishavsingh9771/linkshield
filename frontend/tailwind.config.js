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
        cyber: {
          black: '#030712',
          deep: '#060c1c',
          navy: '#0b152d',
          card: '#0d1b3e',
          cardHover: '#11224f',
          border: 'rgba(0, 245, 212, 0.18)',
          borderHover: 'rgba(0, 245, 212, 0.45)',
          cyan: '#00f5d4',
          cyanGlow: '#00b4d8',
          blue: '#3b82f6',
          safe: '#10b981',
          warning: '#f59e0b',
          high: '#f97316',
          danger: '#ef4444',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 245, 212, 0.35)',
        'neon-blue': '0 0 25px rgba(59, 130, 246, 0.4)',
        'neon-danger': '0 0 25px rgba(239, 68, 68, 0.4)',
        'neon-safe': '0 0 25px rgba(16, 185, 129, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'radar-sweep': 'radarSweep 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}

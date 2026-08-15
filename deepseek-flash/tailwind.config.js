/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07070f',
          900: '#0b0b18',
          800: '#121222',
          700: '#1a1a2e',
        },
        brand: {
          cyan: '#22d3ee',
          violet: '#a78bfa',
          amber: '#fbbf24',
          rose: '#fb7185',
          emerald: '#34d399',
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans SC"',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        display: [
          '"Noto Serif SC"',
          '"Songti SC"',
          '"SimSun"',
          'Georgia',
          'serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 24px -4px rgba(34, 211, 238, 0.45)',
        'glow-violet': '0 0 24px -4px rgba(167, 139, 250, 0.45)',
        'glow-amber': '0 0 24px -4px rgba(251, 191, 36, 0.4)',
        'panel': '0 12px 48px -12px rgba(0, 0, 0, 0.6)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.6s ease-in-out infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
        'shimmer': 'shimmer 6s linear infinite',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(120deg, #22d3ee, #a78bfa, #fb7185, #fbbf24)',
        'radial-fade':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,211,238,0.10), transparent 60%)',
      },
    },
  },
  plugins: [],
}

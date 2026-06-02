import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // App surfaces
        'app-bg': '#F8F7F4',
        surface: {
          DEFAULT: '#FFFFFF',
          2: '#F3F2EF',
          3: '#ECEAE5',
        },
        // Text hierarchy
        ink: {
          DEFAULT: '#1A1A1A',
          2: '#6B6868',
          3: '#A8A5A2',
        },
        // Signature accent
        accent: {
          DEFAULT: '#E8472A',
          light: '#FFF1EE',
          dark: '#C73A1F',
        },
        // Borders
        'app-border': '#E8E8E4',
        // Place type palette
        'type-restaurant': '#E8472A',
        'type-bar': '#6D28D9',
        'type-cafe': '#B45309',
        'type-other': '#0369A1',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        'display': ['2rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '800' }],
        'title': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '700' }],
        'headline': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0,0,0,0.06)',
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'sheet': '0 -8px 48px rgba(0,0,0,0.12)',
        'float': '0 8px 32px rgba(0,0,0,0.16)',
        'accent': '0 6px 24px rgba(232,71,42,0.4)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.94)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'skeleton': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        'bounce-marker': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.38s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fade-in 0.22s ease-out',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'skeleton': 'skeleton 1.4s ease-in-out infinite',
        'bounce-marker': 'bounce-marker 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

export default config

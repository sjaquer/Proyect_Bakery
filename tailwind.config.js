/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9f5f2',
          100: '#f3ebe5',
          200: '#e7d7ca',
          300: '#d9bea8',
          400: '#c39c7d',
          500: '#b38460',
          600: '#a07050',
          700: '#8B4513', // Main primary
          800: '#6b3a20',
          900: '#5a331f',
          950: '#2e1a10',
        },
        secondary: {
          50: '#fffffb',
          100: '#fffff7',
          200: '#FFFDD0', // Main secondary
          300: '#fefcaa',
          400: '#fbf77e',
          500: '#f6ef52',
          600: '#e3d845',
          700: '#c5b932',
          800: '#a4992c',
          900: '#877e2a',
          950: '#484114',
        },
        accent: {
          300: '#fff4cc',
          400: '#ffe799',
          500: '#FFD700', // Main accent
          600: '#e6c200',
          700: '#b39700',
          800: '#806c00',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
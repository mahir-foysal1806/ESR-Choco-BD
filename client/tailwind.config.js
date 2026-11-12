/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: { 50: '#f8f1ed', 100: '#efdfd5', 200: '#dfc1af', 300: '#c99a7d', 400: '#ae7657', 500: '#89543b', 600: '#70412e', 700: '#5a3326', 800: '#48291f', 900: '#321b15' },
        honey: { 50: '#fff8ed', 100: '#fbe9cf', 200: '#f4d3a3', 300: '#e9b873', 400: '#d99a43', 500: '#bd7a2d', 600: '#9a5d21', 700: '#78451d' },
        earth: { 50: '#faf6f1', 100: '#f1e8dc', 200: '#e2d0b8', 300: '#cfb08c', 400: '#bb8f64', 500: '#a8764a', 600: '#8f5f3d', 700: '#744b34', 800: '#5f3f2e', 900: '#4f3528' },
        cream: '#fbf7f2',
      },
      fontFamily: {
        sans: ['"Hind Siliguri"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', '"Hind Siliguri"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -6px rgba(65,35,24,.16)',
        lift: '0 16px 40px -14px rgba(65,35,24,.28)',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        rise: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: { marquee: 'marquee 30s linear infinite', rise: 'rise .35s ease both' },
    },
  },
  plugins: [],
};

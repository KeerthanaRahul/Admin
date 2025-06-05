/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/index.css', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          'cafe-brown': {
            50: '#f5f0e8',
            100: '#e6d5bd',
            200: '#d0a87d',
            300: '#c18648',
            400: '#a06a35',
            500: '#8B5A2B',
            600: '#774e25',
            700: '#63401e',
            800: '#4e3217',
            900: '#3a250f',
          },
          'cafe-orange': {
            50: '#fff8ed',
            100: '#feefd5',
            200: '#fcd8a4',
            300: '#fbc172',
            400: '#faa147',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
          'cafe-green': {
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
        },
        fontFamily: {
          sans: ['var(--font-sans)'],
          serif: ['var(--font-serif)'],
        },
        boxShadow: {
          card: '0 4px 10px rgba(0, 0, 0, 0.05)',
        },
        animation: {
          'fade-in': 'fadeIn 0.3s ease-in-out',
        },
      },
    },
    plugins: [],
  };
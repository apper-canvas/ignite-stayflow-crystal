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
          50: '#f5f7fa',
          100: '#eaeff5',
          200: '#d0dde8',
          300: '#a7bfd2',
          400: '#779bb9',
          500: '#547ca2',
          600: '#426289',
          700: '#384f6f',
          800: '#31435c',
          900: '#2c3e50',
        },
        bronze: {
          50: '#faf9f7',
          100: '#f3f1ed',
          200: '#e6e1d7',
          300: '#d4cab9',
          400: '#bda994',
          500: '#8b7355',
          600: '#7d6448',
          700: '#6a523d',
          800: '#584435',
          900: '#4a392e',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#3498db',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
      colors: {
        fb: {
          blue: '#065F46', // Emerald 850 (Custom Dark Green)
          gray: '#F0F2F5',
          dark: '#242526',
          hover: '#F2F2F2',
          text: '#050505',
          textGray: '#65676B'
        }
      }
    },
  },
  plugins: [],
}

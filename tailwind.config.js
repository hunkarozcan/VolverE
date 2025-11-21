/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: '#fdfbf7',
          surface: '#ffffff',
          primary: '#b5b9ff',
          secondary: '#ffb7b2',
          accent: '#a0e7e5',
          text: '#4a4a4a',
          navy: '#2d2b42',
        }
      }
    },
  },
  plugins: [],
}

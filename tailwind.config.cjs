/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary-color) / <alpha-value>)',
        accent: 'rgb(var(--accent-color) / <alpha-value>)',
        highlight: 'rgb(var(--highlight-color) / <alpha-value>)',
      },
      screens: {
        'xxs': '260px',
        'xs': '320px',
      }
    }
  },
  plugins: []
}

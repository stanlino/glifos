/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-primary': 'var(--primary-color)',
        'custom-text': 'var(--text-color)'
      }
    }
  },
  plugins: []
}

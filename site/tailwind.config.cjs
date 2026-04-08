module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,md}'],
  theme: {
    extend: {
      colors: {
        primary: '#6EE7B7', // gentle mint accent
        accent: '#7C3AED'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // customize typography for dark mode
    function ({ addBase, theme }) {
      addBase({
        '.prose': {
          color: theme('colors.gray.800')
        },
        '.dark .prose': {
          color: theme('colors.gray.200')
        }
      })
    }
  ],
}

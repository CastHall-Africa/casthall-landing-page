/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        'casthall-blue-700': '#0866C4'
      },

      fontFamily: {
        Sora: ['Sora', 'sans-serif']
      }
    }
  },

  plugins: []
}
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'black': '#12130F',
        'gray-1': '#353535',
        'gray-2': '#212121',
        'main': '#00A399',
        'accent': '#F5B82E',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'permanent-marker': ['"Permanent Marker"', 'cursive']
      },
    },
  },
  plugins: [],
} satisfies Config


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7f9',
          100: '#e9eff3',
          200: '#c9d9e5',
          300: '#a9c3d7',
          400: '#6b97bb',
          500: '#2d6aa0',
          600: '#265b86',
          700: '#1f4b6d',
          800: '#173a54',
          900: '#102b3f'
        }
      }
    },
  },
  plugins: [],
};

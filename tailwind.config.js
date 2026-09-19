/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nursery: {
          50: '#f2f9f4',
          100: '#e1f2e6',
          200: '#c5e5cf',
          300: '#99d1ab',
          400: '#66b681',
          500: '#419a5f',
          600: '#2f7c4a',
          700: '#26623d',
          800: '#224e33',
          900: '#1d412b',
          950: '#0c2416',
        },
      },
    },
  },
  plugins: [],
}

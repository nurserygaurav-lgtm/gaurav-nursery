/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f1f8ef',
          100: '#dcedd8',
          500: '#4f9b45',
          600: '#3d7d36',
          700: '#315f2e',
          900: '#183317'
        },
        soil: '#7a5230'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 45px rgba(24, 51, 23, 0.08)'
      }
    }
  },
  plugins: []
};

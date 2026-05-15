/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f1f8ef',
          100: '#dcedd8',
          200: '#c4dfbd',
          300: '#9bc991',
          400: '#72ae68',
          500: '#4f9b45',
          600: '#3d7d36',
          700: '#315f2e',
          800: '#254a24',
          900: '#183317',
          950: '#0d1f0e'
        },
        soil: '#7a5230',
        cream: '#fbf8f0',
        sage: '#eef5e8'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 45px rgba(24, 51, 23, 0.08)',
        card: '0 22px 60px rgba(24, 51, 23, 0.12)',
        button: '0 14px 30px rgba(49, 95, 46, 0.22)'
      }
    }
  },
  plugins: []
};

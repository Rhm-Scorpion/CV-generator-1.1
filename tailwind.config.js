export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'app-bg': '#f5f0e8',
        'card-bg': '#ffffff',
        'accent': '#3d5a3e',
        'accent-gold': '#8b7355',
        'input-bg': '#f0ece4',
        'border-card': '#e0d8cc',
        'border-dashed-cv': '#c8bfb0',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '"Source Sans Pro"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

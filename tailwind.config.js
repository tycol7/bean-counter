module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      'white': '#FFFFFF',
      'blue': {
        light: '#878CFF',
        DEFAULT: '#2129DD',
        dark: '#000585',
      },
      'gray': {
        lightest: '#DFE0EC',
        light: '#6E7099',
        DEFAULT: '#4A4B66',
        dark: '#191A22',
      },
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

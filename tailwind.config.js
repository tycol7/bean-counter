module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      'white': '#FFFFFF',
      'blue': {
        lighter: '#878CFF',
        light: '#242DF2',
        DEFAULT: '#2129DD',
        dark: '#000585',
      },
      'gray': {
        lightest: '#DFE0EC',
        lighter: '#8183B2',
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

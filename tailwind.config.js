/** @type {import('tailwindcss').Config} */
const colors = {
  brand: {
    primary: '#3f3d56',
    secondary: '#605bae',
    accent: '#ff6584',
    dark:'#1d1c28',
    gray: '#d9d9d9',
    lightGray:'#cfcfd1'
  },
  success: '#2e7d5d',
  warning: '#FF9800',
  text: {
    primary: '#19181f',
    white: '#ececec',
    soft: '#727272',
  },
};

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        brand: {
          primary: colors.brand.primary,
          secondary: colors.brand.secondary,
          accent: colors.brand.accent,
          dark: colors.brand.dark,
          gray: colors.brand.gray,
          lightGray: colors.brand.lightGray,
        },
        success: colors.success,
        warning: colors.warning,
        text: {
          primary: colors.text.primary,
          white: colors.text.white,
          soft: colors.text.soft,
        },
      },
    },
  },
  plugins: [],
};

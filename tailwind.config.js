/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",


  ],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      satoshi: ["Satoshi", "sans-serif"],
    },
    screens: {
      "2xsm": "375px",
      xsm: "425px",
      "3xl": "2000px",
      ...defaultTheme.screens,
    },
    extend: {
      textColors: {
        primaryOrange: '#FF840C',
        primaryNavy: '#002B5A',
        primaryGreen: '#E2FA49',
        primaryWhite: '#fbfafa',
        primaryBlack: '#141414',
        primaryBlue: '#2AA8E1',
        secondaryBlue: '#2C3E50 ',
        tertiaryBlue: '#F5F5F5',
        aksen1: '#FFE66D',
        aksen2: '#FF6B6B',
      },
      fontFamily: {
        Geometric: ['Geometric', 'sans-serif'],
        Inter: ['Inter', 'sans-serif'],
        Gil: ['Gil', 'sans-serif'],
      },
      backgroundColor: {
        primaryOrange: '#FF840C',
        primaryBlue: '#20BEC6',
        secondaryBlue: '#2C3E50 ',
        tertiaryBlue: '#F5F5F5',
        aksen1: '#FFE66D',
        aksen2: '#FF6B6B',
        primaryNavy: '#002B5A',
        primaryGreen: '#E2FA49',
        primaryWhite: '#fbfafa',
        primaryBlack: '#141414'
      },
      borderColor: {
        primaryOrange: '#FF840C',
        primaryBlue: '#20BEC6',
        secondaryBlue: '#2C3E50 ',
        tertiaryBlue: '#F5F5F5',
        aksen1: '#FFE66D',
        aksen2: '#FF6B6B',
        primaryNavy: '#002B5A',
        primaryGreen: '#E2FA49'
      },
      colors: {
        primaryOrange: '#FF840C',
        // primaryBlue: '#20BEC6',
        primaryNavy: '#002B5A',
        primaryWhite: '#fbfafa',
        primaryBlack: '#141414',
        primaryGreen: '#E2FA49',
        primaryBlue: '#20BEC6',
        secondaryBlue: '#2C3E50 ',
        tertiaryBlue: '#F5F5F5',
        aksen1: '#FFE66D',
        aksen2: '#FF6B6B',
      }
    },
  },
  plugins: [],
}

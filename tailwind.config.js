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
        primaryBlue: '#40D8D4',
        primaryGreen: '#E2FA49',
        primaryWhite: '#fbfafa',
        primaryBlack: '#141414'
      },
      fontFamily: {
        Geometric: ['Geometric', 'sans-serif'],
        Inter: ['Inter', 'sans-serif'],
        Gil: ['Gil', 'sans-serif'],
      },
      backgroundColor: {
        primaryOrange: '#FF840C',
        primaryBlue: '#40D8D4',
        primaryGreen: '#E2FA49',
        primaryWhite: '#fbfafa',
        primaryBlack: '#141414'
      },
      borderColor: {
        primaryOrange: '#FF840C',
        primaryBlue: '#40D8D4',
        primaryGreen: '#E2FA49'
      },
      colors: {
        primaryOrange: '#FF840C',
        primaryBlue: '#40D8D4',
        primaryWhite: '#fbfafa',
        primaryBlack: '#141414',
        primaryGreen: '#E2FA49'
      }
    },
  },
  plugins: [],
}

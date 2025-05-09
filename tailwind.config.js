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
        primary: '#020E22',
        secondary: '#1B1E28',
        blueCustom: '#1C3BA4'
      },
      fontFamily: {
        Geometric: ['Geometric', 'sans-serif'],
        Inter: ['Inter', 'sans-serif'],
        Gil: ['Gil', 'sans-serif'],
      },
      backgroundColor: {
        primary: '#020E22',
        light: '#F7F7F9',
        blueCustom: '#1C3BA4'
      },
      borderColor: {
        primary: '#020E22',
      },
      colors: {
        primary: '#020E22',
        secondary: '#1B1E28',
        blueCustom: '#1C3BA4'
      }
    },
  },
  plugins: [],
}

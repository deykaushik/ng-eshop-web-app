/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        "brown-pro": ['"Brown-Pro"', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        cart: "url('./assets/icons/shopping-cart-2-line.svg')",
        "cart-black": "url('./assets/icons/shopping-cart-2-line.svg')",
      },
    },
  },
  plugins: [],
};

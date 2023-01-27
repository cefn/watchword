/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // local code
    "./src/**/*.{html,js,jsx,ts,tsx}",
    // advised by react-daisyui
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};

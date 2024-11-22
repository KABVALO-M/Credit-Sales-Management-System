/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // "./**/*.{html,js,ejs}",
    "./public/**/*.{svg,png,jpg,gif,js,css}",
    "./views/**/*.{ejs, html, js, pub}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff0000', // Red
        secondary: '#0000ff', // Blue
        accent: '#ffff00', // Yellow
      },
    },
  },
  plugins: [],
}

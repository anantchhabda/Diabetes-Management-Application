/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./public/**/*.{html,js}", 
    "./public/js/**/*.js" 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
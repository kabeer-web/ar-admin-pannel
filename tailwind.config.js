/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // YAHAN CHECK KARO: 'class' hona chahiye, 'media' nahi!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
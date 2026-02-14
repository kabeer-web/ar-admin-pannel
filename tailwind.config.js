/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Ye sabse important line hai dark mode ke liye
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Tum chaho toh custom colors yahan add kar sakte ho
    },
  },
  plugins: [],
}
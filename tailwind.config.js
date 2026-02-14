/** @type {import('tailwindcss').Config} */
export default {
  // 'class' mode enable karne se hi Sidebar wala toggle kaam karega
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Optional: Custom premium dark colors
        dark: {
          bg: '#020617',
          card: '#0f172a',
          border: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}
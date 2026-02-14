// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      template: {
        compilerOptions: {
          // React ko batana ki ye tag custom hai, error mat dena
          isCustomElement: (tag) => tag.includes('model-viewer')
        }
      }
    })
  ]
})
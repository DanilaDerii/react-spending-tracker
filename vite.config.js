// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  base: './',           // ← make all URLs relative
  plugins: [react(), tailwindcss(),
],
  build: {
    outDir: 'docs'      // ← ensure build lands in docs/
  }
})

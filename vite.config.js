// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',           // ← make all URLs relative
  plugins: [react()],
  build: {
    outDir: 'docs'      // ← ensure build lands in docs/
  }
})

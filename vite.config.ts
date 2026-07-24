import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works both on a GitHub Pages project path
// and on a custom domain root (e.g. paddock.fastlineracingacademy.pl).
export default defineConfig({
  base: './',
  plugins: [react()],
})

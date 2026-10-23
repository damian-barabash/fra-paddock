import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works both on a GitHub Pages project path
// and on a custom domain root (e.g. paddock.fastlineracingacademy.pl).
// Two pages: the home page and /aplikacja/.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        aplikacja: fileURLToPath(new URL('aplikacja/index.html', import.meta.url)),
      },
    },
  },
})

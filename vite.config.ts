import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works both on a GitHub Pages project path
// and on a custom domain root (e.g. fastlinepaddockclub.pl).
// Two pages: the public home page and the members' platform /klub/.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        klub: fileURLToPath(new URL('klub/index.html', import.meta.url)),
      },
    },
  },
})

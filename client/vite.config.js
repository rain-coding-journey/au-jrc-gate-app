import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/au-jrc-gate-app/',
  build: {
    sourcemap: false, // Prevents inline eval generation in production bundle
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/images': "http://localhost:5174",
    }
  },
  base: "/",
  plugins: [react()],
})

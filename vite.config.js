import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/images': "https://keyol.vercel.app/",
    }
  },
  base: "/Keyol",
  plugins: [react()],
})

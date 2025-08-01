import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  server: {
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'https://api.yenumax.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

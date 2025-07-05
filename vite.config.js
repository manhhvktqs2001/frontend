import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.20.85:5000', // Đúng port backend FastAPI của bạn
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

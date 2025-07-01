// File: vite.config.js
// Updated Vite configuration with proper proxy setup for EDR backend

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Proxy API calls to EDR backend server
      '/api': {
        target: 'http://192.168.20.85:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy WebSocket connections for real-time updates
      '/ws': {
        target: 'ws://192.168.20.85:5000',
        ws: true,
        changeOrigin: true,
      }
    },
    // Disable HMR for better stability during development
    hmr: {
      overlay: false
    },
    // CORS configuration
    cors: {
      origin: true,
      credentials: true
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          icons: ['@heroicons/react']
        }
      }
    }
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://192.168.20.85:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
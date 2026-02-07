import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' });

export default defineConfig({
  server: {
    // allowedHosts: ['admin.thientruc.vn'],
    proxy: {
      '/api/admin': {
        target: process.env.VITE_API_URL || 'http://localhost:8080', // API backend server
        changeOrigin: true,
      }
    },
    host: '0.0.0.0', // expose ra bên ngoài container
    port: 3000      // hoặc port bạn muốn
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

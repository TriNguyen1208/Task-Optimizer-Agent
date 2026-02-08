import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' });

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_GATEWAY || 'http://localhost:8080',
        changeOrigin: true,
      }
    }
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

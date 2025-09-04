import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port:5173, host:true,
    proxy: {
      '/api': { target: process.env.VITE_PROXY_TARGET || 'http://localhost:8000', changeOrigin: true },
      '/ws': { target: process.env.VITE_PROXY_TARGET || 'http://localhost:8000', ws: true, changeOrigin: true }
    }
  }
})

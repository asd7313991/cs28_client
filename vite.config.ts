import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  // 读取 .env / .env.production 里的变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8000',
          changeOrigin: true,
        },
        '/ws': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8000',
          ws: true,
          changeOrigin: true,
        },
        '/lotto': {
          target: 'https://cs00.vip',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/lotto/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
    base: '/', // 生产环境部署在根域名 index.cs28.org
  }
})

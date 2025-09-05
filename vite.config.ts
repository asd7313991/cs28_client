import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  // 读取 .env.development / .env.production
  const env = loadEnv(mode, process.cwd(), '')

  const isDev = mode === 'development'

  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
      port: 5173,
      host: true,
      proxy: isDev
        ? {
            // 开发环境：把 /api 转发到本机 FastAPI
            '/api': {
              target: env.VITE_PROXY_TARGET || 'http://localhost:8000',
              changeOrigin: true,
            },
            // 开发环境：WS 代理
            '/ws': {
              target: env.VITE_PROXY_TARGET || 'http://localhost:8000',
              ws: true,
              changeOrigin: true,
            },
            // 你保留的远端采集代理
            '/lotto': {
              target: 'https://cs00.vip',
              changeOrigin: true,
              rewrite: (p) => p.replace(/^\/lotto/, ''),
            },
          }
        : undefined, // 生产环境不需要本地代理
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
    // 生产部署在根域名
    base: '/',
  }
})

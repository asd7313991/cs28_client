import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = mode === 'development'

  // 把 env 里的 localhost 归一到 127.0.0.1，避免解析成 ::1
  const rawTarget = env.VITE_PROXY_TARGET || 'http://localhost:8000'
  const target =
    rawTarget.replace('localhost', '127.0.0.1') // ✅ 关键：IPv4

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
            // 后端已挂 /api 前缀：/api/lottery/last
            '/api': {
              target,            // e.g. http://127.0.0.1:8000
              changeOrigin: true,
              // 如果你的后端没有 /api 前缀，取消注释下一行：
              // rewrite: (p) => p.replace(/^\/api/, ''),
            },
            '/ws': {
              target: target.replace('http', 'ws'), // ws://127.0.0.1:8000
              ws: true,
              changeOrigin: true,
            },
            '/lotto': {
              target: 'https://cs00.vip',
              changeOrigin: true,
              rewrite: (p) => p.replace(/^\/lotto/, ''),
            },
          }
        : undefined,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
    base: '/',
  }
})

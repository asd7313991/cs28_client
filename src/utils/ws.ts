// 简单 WS 工具：开发使用相对路径 /ws（走代理），生产使用 VITE_WS_BASE
export function createWs(path = ''): WebSocket {
  const base = (import.meta.env.VITE_WS_BASE as string) || '/ws'
  // path 可传诸如 '/ws?room=202' 或 '?room=202'
  if (path) {
    if (path.startsWith('/')) return new WebSocket(`${base}${path}`)
    if (path.startsWith('?')) return new WebSocket(`${base}${path}`)
  }
  return new WebSocket(base)
}

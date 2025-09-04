let ws: WebSocket | null = null
let heartbeatTimer: number | null = null
export function connectWS(base = import.meta.env.VITE_WS_BASE) {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return ws
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
  const url = `${protocol}://${location.host}${base}`
  ws = new WebSocket(url)
  ws.onopen = () => { startHeartbeat() }
  ws.onmessage = (ev) => { const data = safeParse(ev.data); window.dispatchEvent(new CustomEvent('ws-message', { detail: data })) }
  ws.onclose = () => { stopHeartbeat(); setTimeout(() => connectWS(base), 1500) }
  return ws
}
export function send(payload:any){ if (!ws || ws.readyState !== WebSocket.OPEN) return; ws.send(JSON.stringify(payload)) }
function startHeartbeat(){ stopHeartbeat(); heartbeatTimer = window.setInterval(() => { send({ type:'ping', ts: Date.now() }) }, 5000) }
function stopHeartbeat(){ if (heartbeatTimer){ clearInterval(heartbeatTimer); heartbeatTimer = null } }
function safeParse(s:string){ try{ return JSON.parse(s) } catch { return s } }

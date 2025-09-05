import http from '@/app/api/http'

export interface BetItemIn { play: string; amount: number }
export function placeBet(params: { code: string; issue: number; items: BetItemIn[] }) {
  return http.post('/api/bet/place', params)
}
export function betHistory(limit = 20) {
  return http.get('/api/bet/history', { params: { limit } })
}

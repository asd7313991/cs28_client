import http from '@/app/api/http'

export interface BetItemIn { play: string; amount: number }

export function placeBet(params: { code: string; issue: number; items: BetItemIn[] }) {
  return http.post('/bet/place', params).then(res => res.data)
}

export function betHistory(limit = 20) {
  return http.get('/bet/history', { params: { limit } }).then(res => res.data)
}

/** 获取赔率 */
export interface OddsItem {
  key: string
  name: string
  odds: number
  status: number
}
export function odds(code: string): Promise<OddsItem[]> {
  return http.get<OddsItem[]>('/lottery/odds', { params: { code } }).then(res => res.data)
}

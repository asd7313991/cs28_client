// src/app/api/bet.ts
import http from '@/app/api/http'

/** 下单入参（和后端 BetPlaceIn 对齐） */
export interface BetItemIn {
  /** 玩法：可以是中文名（大/小/单/双/0..27）或你的玩法编码，后端会 normalize */
  play: string | number
  /** 金额 */
  amount: number
}
export interface PlaceBetIn {
  code: string            // 彩种，如 'jnd28'
  issue: string | number  // 期号，前端可传 number，最终会被转成字符串处理
  items: BetItemIn[]
}

export interface PlaceBetOut {
  order_id: number
  total_amount: number
  status: number          // PENDING/0 等
}

/** POST /api/bet/place */
export function placeBet(payload: PlaceBetIn) {
  return http.post<PlaceBetOut>('/orders/place', payload).then(res => res.data)
}

/** 历史记录：保持你原来的路径，如果服务端是 /api/orders/history 就改这里 */
export function betHistory(limit = 20) {
  return http.get('/orders/history', { params: { limit } }).then(res => res.data)
}

/** 赔率：仍用你现有接口（若服务端是 /api/lottery/odds?code=） */
export interface OddsItem {
  name: string;
  odds: number;
  status: number;
}

export function odds(code: string): Promise<OddsItem[]> {
  return http.get<OddsItem[]>('/lottery/odds', { params: { code } }).then(res => res.data)
}
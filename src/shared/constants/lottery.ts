/**
 * 彩票相关常量
 */

// 期间时间（毫秒）
export const PERIOD_MS = 210000 // 3.5分钟

// 封盘时间（毫秒）
export const SEAL_MS = 30000 // 30秒

// 玩法映射
export const PLAY_TYPE_MAP = {
  1: '大',
  2: '小',
  3: '单',
  4: '双',
  5: '大单',
  6: '大双',
  7: '小单',
  8: '小双'
} as const

export type PlayType = keyof typeof PLAY_TYPE_MAP

// 结果类型
export interface LotteryResult {
  period: number
  numbers: number[]
  sum: number
  big: boolean
  small: boolean
  odd: boolean
  even: boolean
}

// 房间状态
export type RoomStatus = 'waiting' | 'open' | 'sealed' | 'drawing'

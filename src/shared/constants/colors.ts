/**
 * 颜色常量
 */
export const COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3'
} as const

export type ColorKey = keyof typeof COLORS

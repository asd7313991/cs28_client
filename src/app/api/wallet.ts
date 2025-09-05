import http from '@/app/api/http'

// 统一返回结构示例：{ balance: number; frozen?: number; currency?: string }
export async function fetchWallet() {
  // 优先尝试 /api/wallet
  try {
    const { data } = await http.get('/wallet')
    const d = data?.data || data
    return {
      balance: Number(d?.balance ?? d?.available ?? 0),
      frozen: Number(d?.frozen ?? 0),
      currency: String(d?.currency ?? 'CNY'),
    }
  } catch {
    // 兼容一些服务端把钱包挂在 /api/user/wallet
    const { data } = await http.get('/user/wallet')
    const d = data?.data || data
    return {
      balance: Number(d?.balance ?? d?.available ?? 0),
      frozen: Number(d?.frozen ?? 0),
      currency: String(d?.currency ?? 'CNY'),
    }
  }
}

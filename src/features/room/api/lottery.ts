import request from '@/shared/api/http'

/** 当前期信息 */
export async function getCurrent(code: string) {
  // 原来写 const { data } = await request.get(...) 会拿不到
  return await request.get('/lottery/current', { params: { code } })
}

/** 最新开奖 */
export async function getLast(code: string) {
  return await request.get('/lottery/last', { params: { code } })
}

/** 历史记录 */
export type HistoryRow = {
  issue: number
  time: string
  a: number
  b: number
  c: number
  sum: number
  label: string
}

function _label(sum: number) {
  return `${sum >= 14 ? '大' : '小'}${sum % 2 === 0 ? '双' : '单'}`
}

export async function getHistory(code: string, limit = 10): Promise<HistoryRow[]> {
  try {
    const res: any = await request.get('/lottery/history', { params: { code, limit } })
    const rawList = Array.isArray(res) ? res : (res?.list ?? [])
    const rows: HistoryRow[] = rawList.map((x: any) => {
      const a = Number(x?.n1 ?? x?.a ?? 0)
      const b = Number(x?.n2 ?? x?.b ?? 0)
      const c = Number(x?.n3 ?? x?.c ?? 0)
      const sum = Number(x?.sum_value ?? x?.sum ?? (a + b + c))
      return {
        issue: Number(x?.issue_code ?? x?.issue ?? 0),
        time: String(x?.open_time ?? x?.time ?? ''),
        a, b, c, sum,
        label: _label(sum),
      }
    })
    console.debug('[getHistory] size=', rows.length)
    return rows
  } catch (e) {
    console.warn('getHistory error:', e)
    return []
  }
}

/** 心跳 */
export async function getPing() {
  return await request.get('/ping')
}

export interface QuickBetItem { play: string; amount: number }
const aliasMap: Record<string, string> = { '大':'DA','小':'X','单':'D','双':'S','极大':'JDA','极小':'JX','大小单双':'DXDS' }
export function parseQuickBet(input: string): QuickBetItem[] {
  const chunks = input.split('丨').map(s=>s.trim()).filter(Boolean)
  if (chunks.length > 10) { const err:any = new Error('投注种类过多'); err.code='TOO_MANY_BETS'; throw err }
  const items: QuickBetItem[] = []
  for (const c of chunks) {
    const m = c.match(/^([\u4e00-\u9fa5A-Za-z]+)\s*(\d+(?:\.\d+)?)$/); if (!m) continue
    const [, zh, amt] = m; const play = aliasMap[zh] || zh.toUpperCase(); const amount = Number(amt)
    if (!Number.isFinite(amount) || amount <= 0) continue; items.push({ play, amount })
  } return items
}

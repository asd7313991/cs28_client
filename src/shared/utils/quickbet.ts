// 改成空格分隔；兼容历史“丨”（会当作空格处理）
// 玩法：大/小/单/双/极大/极小/0..27；金额为正整数
export interface QuickBetItem {
  play: string;   // 原样保留：大/小/单/双/极大/极小/0..27
  amount: number; // 金额
}

/** 解析快投输入（空格分隔；最多10条） */
export function parseQuickBet(input: string): QuickBetItem[] {
  if (!input) return [];
  // 统一空白：把“丨”也当作空格；压缩多空格
  const normalized = input
    .replace(/[|｜丨]+/g, ' ')   // 兼容老符号 → 空格
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return [];

  const parts = normalized.split(' ');
  if (parts.length > 10) {
    throw new Error('投注种类过多（最多10条）');
  }

  const PLAY_RE = /^(大|小|单|双|极大|极小|(?:[0-9]|1[0-9]|2[0-7]))/; // 0..27 或文字
  const AMOUNT_RE = /([1-9]\d*)$/; // 正整数金额，禁止0

  const items: QuickBetItem[] = [];

  for (const token of parts) {
    const t = token.trim();
    if (!t) continue;

    const playMatch = t.match(PLAY_RE);
    const amountMatch = t.match(AMOUNT_RE);
    if (!playMatch || !amountMatch) {
      throw new Error(`格式不正确：${t}（示例：大300 小300）`);
    }

    const play = playMatch[1];
    const amount = Number(amountMatch[1]);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(`金额不合法：${t}`);
    }

    // 0..27 统一成字符串
    const playStr = /^[0-9]+$/.test(play) ? String(Number(play)) : play;

    items.push({ play: playStr, amount });
  }

  return items;
}

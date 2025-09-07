// 快投语法解析：
// ✅ 0~27 点 金额，例如：3点300
// ✅ 大/小/单/双/极大/极小 金额，例如：大300、极小50
// ✅ 大双/小双/大单/小单 金额，例如：大双200
// 多条用空格/逗号/斜杠/竖线/顿号/“丨”分隔，最多 10 条

export interface QuickBetItem {
  play: string;   // 与后端 play_type.name 对应：'0'..'27' 或 '大' '小' '单' '双' '极大' '极小' '大双' '小双' '大单' '小单'
  amount: number; // 正整数
}

const SEP = /[|｜丨,，/、\s]+/g;

// 支持的文字玩法（含复合）
const VALID_PLAYS = ['大', '小', '单', '双', '极大', '极小', '大双', '小双', '大单', '小单'];

// 正则：玩法+金额
const NAMED = new RegExp(`^(${VALID_PLAYS.join('|')})(\\d{1,9})$`);
const ONLY_NAMED = new RegExp(`^(${VALID_PLAYS.join('|')})$`);

// 数字点金额：3点300
const NUMERIC = /^([0-9]|1[0-9]|2[0-7])点(\d{1,9})$/;
const ONLY_NUMBER = /^\d+$/;

export function parseQuickBet(input: string): QuickBetItem[] {
  const s = (input || '').trim();
  if (!s) return [];

  const tokens = s.split(SEP).filter(Boolean);
  const items: QuickBetItem[] = [];

  for (const t of tokens) {
    let m: RegExpMatchArray | null;

    // 1) 数字和值：3点300
    m = t.match(NUMERIC);
    if (m) {
      const n = Number(m[1]);
      const amt = Number(m[2]);
      if (amt <= 0) throw new Error('金额需为正整数');
      items.push({ play: String(n), amount: amt });
      continue;
    }

    // 2) 玩法文字：大300 / 极小50 / 大双200
    m = t.match(NAMED);
    if (m) {
      const play = m[1];
      const amt = Number(m[2]);
      if (amt <= 0) throw new Error('金额需为正整数');
      items.push({ play, amount: amt });
      continue;
    }

    // 3) 报错提示优化
    if (t.match(ONLY_NUMBER)) {
      throw new Error('格式不正确：数字投注请用“数字点金额”，例如 3点300');
    }
    if (t.match(ONLY_NAMED)) {
      throw new Error(`缺少金额：${t} 后需跟金额，例如 ${t}300`);
    }

    throw new Error(`无法识别指令：${t}`);
  }

  if (items.length > 10) {
    throw new Error('投注种类过多（最多10条）');
  }
  return items;
}

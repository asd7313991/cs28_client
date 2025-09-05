// src/composables/useRobotAnnouncer.ts
export type DrawResult = {
  issue: string | number;        // 期号
  nums: number[];                // 原始号码数组，例如 [1,8,0]
  openedAt?: string;             // 开奖时间(可选，ISO或已格式化)
};

export type RobotMessage = {
  id: string;
  type: 'robot_draw';
  payload: {
    issue: string;
    nums: number[];
    sum: number;
    label: string;               // 小单 / 小双 / 大单 / 大双
    openedAt?: string;
  };
  createdAt: number;
};

const SUM_SMALL_MAX = 13; // 0-13 小，14-27 大（28业界通用）
function judgeLabel(sum: number): string {
  const size = sum <= SUM_SMALL_MAX ? '小' : '大';
  const parity = sum % 2 === 0 ? '双' : '单';
  return `${size}${parity}`;
}

function formatIssue(issue: string | number) {
  return String(issue);
}

function makeRobotMessage(draw: DrawResult): RobotMessage {
  const sum = draw.nums.reduce((a, b) => a + b, 0);
  return {
    id: `robot_${draw.issue}_${sum}_${Date.now()}`,
    type: 'robot_draw',
    payload: {
      issue: formatIssue(draw.issue),
      nums: draw.nums,
      sum,
      label: judgeLabel(sum),
      openedAt: draw.openedAt,
    },
    createdAt: Date.now(),
  };
}

let lastIssueSent: string | null = null;

export function useRobotAnnouncer(messagesRef: { value: RobotMessage[] | any[] }) {
  function announce(draw: DrawResult) {
    const issue = formatIssue(draw.issue);
    // 防重复：同一期只播一次
    if (lastIssueSent === issue) return;
    lastIssueSent = issue;

    const msg = makeRobotMessage(draw);
    // 追加到消息列表（按你现有结构可能是 push）
    messagesRef.value.push(msg);
  }

  // 若需要重置（比如切换房间）
  function resetAnnouncer() {
    lastIssueSent = null;
  }

  return { announce, resetAnnouncer };
}

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Toast } from 'tdesign-mobile-vue'
import { placeBet, type BetItemIn } from './api'
import { parseQuickBet } from '@/shared/utils/quickbet'

export const useBetStore = defineStore('bet', () => {
  const code = ref<string>('jnd28')         // 彩种（按需在页面里 setCode）
  const issue = ref<number | null>(null)    // 当前期号（页面进入房间后 setIssue）
  const placing = ref(false)
  const locked = ref(true)                  // 在最新结果未发布前保持封盘；页面定时刷新状态后 setLocked(false)

  const isLocked = computed(() => locked.value)
  function setCode(c: string) { code.value = c }
  function setIssue(i: number | null) { issue.value = i }
  function setLocked(v: boolean) { locked.value = v }

  // 从“快投”文本下注（示例：大300丨小300）
  async function placeQuick(input: string) {
    const items = parseQuickBet(input).map(i => ({ play: i.play, amount: i.amount })) as BetItemIn[]
    return await place(items)
  }

  // 统一下单入口
  async function place(items: BetItemIn[]) {
    if (isLocked.value) { Toast.warning({ content: '封盘中，暂不可下注', duration: 1200 }); return }
    if (!issue.value)   { Toast.warning({ content: '期号未就绪，请稍后', duration: 1200 }); return }
    if (!items?.length) { Toast.warning({ content: '没有可下注的项', duration: 1200 }); return }

    placing.value = true
    try {
      const res = await placeBet({ code: code.value, issue: issue.value!, items })
      // 成功提示由 GM/机器人在聊天室播报，这里不重复 toast
      return res
    } finally {
      placing.value = false
    }
  }

  return { code, issue, placing, isLocked, setCode, setIssue, setLocked, placeQuick, place }
})

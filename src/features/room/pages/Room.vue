<template>
  <!-- 预热用音频节点（隐藏） -->
  <audio ref="dingEl" :src="dingUrl" preload="auto" hidden></audio>

  <div class="page">
    <!-- 顶部导航 -->
    <div class="topbar">
      <t-icon name="chevron-left" size="20" @click="goBack" />
      <div class="title">加拿大28【4.2-4.6】</div>
      <div class="actions">
        <div class="online"><t-icon name="usergroup" size="18" /> {{ onlineCount }}</div>
        <t-icon name="more" size="20" />
      </div>
    </div>

    <!-- 信息行 -->
    <div class="info-row">
      <div class="left">
        <span class="issue">第 {{ currentIssue }} 期开奖</span>
        <span class="dot">|</span>
        <span class="cd"><span class="cd-num">{{ status==='sealed' ? '封盘中' : mmss }}</span></span>
      </div>
      <div class="divider"></div>
      <div class="right">
        <span>账户余额</span>
        <span class="money">{{ balance.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 结果条 + 历史面板 -->
    <div class="history-wrap">
      <div class="result-strip">
        <div class="res">
          <span class="label">第 {{ lastIssue ?? '-' }} 期开奖结果</span>
          <div class="balls">
            <span class="ball">{{ lastA }}</span><span class="plus">+</span>
            <span class="ball">{{ lastB }}</span><span class="plus">+</span>
            <span class="ball gray">{{ lastC }}</span><span class="eq">=</span>
            <span class="sum">{{ lastSum }}</span><span class="txt">{{ lastLabel }}</span>
          </div>
        </div>
        <t-icon name="chevron-down" size="18" class="toggle" :class="{ open: showHistory }" @click="showHistory = !showHistory" />
      </div>

      <transition name="slide">
        <div v-show="showHistory" class="history-panel overlay">
          <div class="thead">
            <div>期号</div><div>开奖时间</div><div class="th-result">开奖结果</div>
          </div>
          <div class="row" v-for="r in history" :key="r.issue">
            <div class="issue-link" @click="goIssue(r.issue)">{{ r.issue }}</div>
            <div class="time">{{ r.time }}</div>
            <div class="result">
              <span class="ball">{{ r.a }}</span><span class="plus">+</span>
              <span class="ball">{{ r.b }}</span><span class="plus">+</span>
              <span class="ball gray">{{ r.c }}</span><span class="eq">=</span>
              <span class="sum">{{ r.sum }}</span><span class="txt">{{ r.label }}</span>
            </div>
          </div>
          <div class="more" @click="onMoreHistory"><t-icon name="search" size="16" /> 查看更多开奖记录</div>
        </div>
      </transition>
    </div>

    <!-- 聊天区 -->
    <div class="section-title">聊天室</div>
    <div class="chat-main">
      <ChatList :messages="chatMessages" :hasMore="hasMore" :selfNick="userNick" @loadMore="loadMore" />
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar safe-area-bottom">
      <button class="bar-item" @click="onCredit"><span class="icon">信</span><span>信用</span></button>
      <button class="bar-item" @click="showDesk = true"><span class="icon">桌</span><span>桌投</span></button>
      <button class="bar-item" @click="showDrawer = true"><span class="icon">快</span><span>快投</span></button>
      <button class="bar-item" @click="onMore"><span class="icon">⋯</span><span>更多</span></button>
    </div>

    <!-- 输入区 -->
    <div class="chat-input" :class="{ sealed: status==='sealed' }">
      <t-input
        v-model="text"
        :placeholder="status==='sealed' ? '封盘中，暂不可下注' : '输入文字指令下注'"
        :disabled="status==='sealed'"
        @keyup.enter="status!=='sealed' && sendChat()"
      />
      <t-button theme="primary" :disabled="status==='sealed'" @click="sendChat">发送</t-button>
      <t-button variant="outline" :disabled="status==='sealed'" @click="showDrawer = true">快投</t-button>
    </div>

    <!-- 快投抽屉 -->
    <QuickBetDrawer v-model="showDrawer">
      <div class="qb">
        <t-textarea v-model="quickText" placeholder="示例：大300丨小300（最多10条）" :maxlength="120" />
        <t-button block theme="primary" :disabled="status==='sealed'" @click="submitQuickBet">确认下单</t-button>
      </div>
    </QuickBetDrawer>

    <!-- 桌投抽屉 -->
    <QuickBetDrawer v-model="showDesk">
      <TableBetPanel v-if="oddsList.length" :items="oddsList" />
      <div v-else class="loading">加载中...</div>
    </QuickBetDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'tdesign-mobile-vue'
import ChatList from '@/shared/components/ChatList.vue'
import QuickBetDrawer from '@/shared/components/QuickBetDrawer.vue'
import TableBetPanel from '@/shared/components/TableBetPanel.vue'
import { parseQuickBet } from '@/shared/utils/quickbet'
import type { QuickBetItem } from '@/shared/utils/quickbet'
import { useAuthStore } from '@/app/store/auth'
import { useChatStore } from '@/stores/chat'
import { getLast, getHistory, type HistoryRow } from '@/features/room/api/lottery'
import { odds } from '@/features/bet/api'
import dingMp3 from '@/assets/mp3/ding.mp3'

/* 展开/收起历史 */
const showHistory = ref(false)

/* 桌投/快投抽屉 */
const showDesk = ref(false)

/* 赔率数据（响应式存储） */
const oddsList = ref<any[]>([])

async function fetchOdds() {
  try {
    const list = await odds('jnd28')
    oddsList.value = list.filter(o => o.status === 1).map(o => ({
      play: o.name, name: o.name, odds: o.odds
    }))
  } catch (e) {
    console.warn('fetchOdds error', e)
  }
}
/* 历史记录 */
const history = ref<HistoryRow[]>([])
function goIssue(issue: number) { Toast.info(`期号 ${issue}（待接入）`) }
function onMoreHistory() { Toast.info('更多历史（待接入）') }
function composeLabel(sum: number) { return `${sum >= 14 ? '大' : '小'}${sum % 2 === 0 ? '双' : '单'}` }
function upsertHistory(issueNum: number, a: number, b: number, c: number, sum: number, timeText?: string) {
  const t = timeText || new Date().toLocaleString()
  if (history.value.some(x => x.issue === issueNum)) return
  history.value.unshift({ issue: issueNum, a, b, c, sum, label: composeLabel(sum), time: t })
  if (history.value.length > 50) history.value.length = 50
}

/* 顶部返回 */
const router = useRouter()
function goBack() { router.back() }

/* 页面状态 */
const onlineCount = ref(1556)
const balance = computed(() => Number(auth.profile?.balance ?? 0))

/* 开奖采集（JND28） */
const CODE = 'jnd28'
const PERIOD_MS = 210_000
const SEAL_MS = 1_000  // 提前封盘 1 秒

const lastIssue = ref<number | null>(null)
const lastA = ref(0); const lastB = ref(0); const lastC = ref(0)
const lastSum = computed(() => lastA.value + lastB.value + lastC.value)
const lastLabel = ref('')

const hasLatestResult = ref(false)   // 是否已拿到至少一条有效开奖结果
const lastAnnouncedIssue = ref<number | null>(null) // 机器人播报去重

const currentIssue = computed(() => (lastIssue.value ?? 0) + 1)

const nextOpenAt = ref<number>(0)
const timeLeft = ref<number>(0)

const status = computed<'open'|'sealed'>(() => {
  if (!hasLatestResult.value) return 'sealed'
  return timeLeft.value <= SEAL_MS ? 'sealed' : 'open'
})

const mmss = computed(() => {
  const t = Math.max(0, timeLeft.value)
  const m = Math.floor(t / 60000)
  const s = Math.floor((t % 60000) / 1000)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
})

/* 音频（解锁 + 播放） */
const dingUrl = dingMp3
const dingEl = ref<HTMLAudioElement | null>(null)
function unlockAudio() {
  const el = dingEl.value
  if (!el) return
  // 静音播放-暂停-归零，建立用户手势内的播放权限
  el.muted = true
  el.currentTime = 0
  el.play()
    .then(() => {
      el.pause()
      el.muted = false
      el.currentTime = 0
    })
    .catch(() => {/* 忽略一次性失败 */})
}
function playDing() {
  const el = dingEl.value
  if (!el) return
  // 允许快速连播：从头开始
  try {
    el.pause()
    el.currentTime = 0
  } catch {}
  el.play().catch((err) => {
    // 如果用户还没触发手势，play 会被拒绝；等手势后再解锁即可
    console.warn('ding play blocked:', err)
  })
}


/* 拉取最新 */
async function fetchLatest() {
  try {
    const data: any = await getLast(CODE)

    // —— 缓存进入函数前的“上一期”数据 —— //
    const prevIssue = lastIssue.value
    const prevA = lastA.value, prevB = lastB.value, prevC = lastC.value
    const prevSum = prevA + prevB + prevC

    // —— 当前最新期 —— //
    const issueNum = Number(data.issue_code || 0)
    lastIssue.value = issueNum

    const ballA = Number(data.n1 ?? 0)
    const ballB = Number(data.n2 ?? 0)
    const ballC = Number(data.n3 ?? 0)
    lastA.value = ballA; lastB.value = ballB; lastC.value = ballC

    const sum = Number(data.sum_value ?? (ballA + ballB + ballC))
    lastLabel.value = composeLabel(sum)

    // 首次拿到任何有效结果 → 解封盘基线
    if (!hasLatestResult.value && issueNum > 0) {
      hasLatestResult.value = true
    }

    // 本期开奖时间（后端 open_time 为字符串），用于推算下一期开奖时间
    const refMs = data.open_time ? new Date(data.open_time).getTime() : Date.now()

    // —— 关键逻辑：仅“首条/新一期”才更新下一次开奖时间 & 播报 —— //
    const isFirstBaseline = !prevIssue && issueNum > 0
    const isNewIssue = !!prevIssue && issueNum !== prevIssue
    if (isFirstBaseline || isNewIssue) {
      // 1) 设置下一次开奖时间并立刻刷新倒计时
      nextOpenAt.value = refMs + PERIOD_MS
      tick()

      // 2) 播报（首屏基线也播报一次；去重防抖）
      if (issueNum && lastAnnouncedIssue.value !== issueNum) {
        announceLatest(issueNum, ballA, ballB, ballC, sum, lastLabel.value)
      }

      // 3) 仅“新一期”时，补上上一期到历史
      if (isNewIssue && prevIssue) {
        upsertHistory(prevIssue, prevA, prevB, prevC, prevSum, data.open_time)
      }

      // 4) 清空快投输入
      quickText.value = ''
    }

    // 非首条/非新期：不动 nextOpenAt，保持封盘显示
  } catch (err) {
    console.warn('fetchLatest error:', err)
  }
}



function announceLatest(issue: number, a: number, b: number, c: number, sum: number, label: string) {
  if (lastAnnouncedIssue.value === issue) return
  lastAnnouncedIssue.value = issue

  // 结构化消息（供 ChatList 渲染“蓝底球”样式），并带文本兜底
  const text = `第 ${issue} 期：${a} + ${b} + ${c} = ${sum} ${label}`
  chat.push({
    id: String(Date.now()),
    type: 'bot',
    nick: 'CS28机器人',
    content: text,                 // 兜底
    kind: 'lottery',               // ✅ 给 ChatList 的“类型提示”
    payload: { issue, a, b, c, sum, label }, // ✅ 结构化数据
    ts: Date.now(),
  } as any)

  playDing()
}

/* 定时心跳/拉取 */
let tickTimer: number | undefined
function tick() { timeLeft.value = Math.max(0, nextOpenAt.value - Date.now()) }
function startTick() { stopTick(); tickTimer = window.setInterval(tick, 1000) as unknown as number }
function stopTick() { if (tickTimer) { clearInterval(tickTimer); tickTimer = undefined } }

let pollTimer: number | undefined
function startPoll() { stopPoll(); pollTimer = window.setInterval(fetchLatest, 3_000) as unknown as number }
function stopPoll() { if (pollTimer) { clearInterval(pollTimer); pollTimer = undefined } }

/** 到点后仍未拿到新结果：继续封盘 & 轮询；不要显示 00:00，因为 status==='sealed' 时顶部文本固定“封盘中” */
watch(timeLeft, (v) => {
  if (v === 0 && hasLatestResult.value) setTimeout(fetchLatest, 1200)
})

/* Store & 聊天 */
const auth = useAuthStore()
const chat = useChatStore()
const isAuthed = computed(() => auth.isLogin) // 是否已登录：看 token
const userNick = computed(() => auth.profile?.nickname || auth.profile?.username || '游客')

// 避免与 UI 库的 $message 混淆，改名为 chatMessages
const chatMessages = computed<any[]>(() => chat.messages as any[])
const hasMore = computed(() => chat.hasMore)

/* 历史加载 / 发送 */
const text = ref('')
function loadMore() {
  const now = Date.now()
  const more = Array.from({ length: 8 }).map((_, i) => ({
    id: 'h' + now + i, type: 'user', nick: '历史', content: '历史消息 ' + (i + 22),
    ts: now - (i + 1) * 60 * 1000, vip: (i % 4) + 1,
  }))
  chat.prepend(more as any)
}
function sendChat() {
  if (status.value === 'sealed') return
  if (!text.value.trim()) return
  chat.push({ id: String(Date.now()), type: 'user', nick: userNick.value, content: text.value, ts: Date.now(), self: true } as any)
  text.value = ''
}

/* 快投 */
const showDrawer = ref(false)
const quickText = ref('')
const PLAY_TEXT_MAP: Record<string, string> = { DA:'大', X:'小', D:'单', S:'双', JDA:'极大', JX:'极小', DXDS:'大小单双' }
function playToLabel(play: string) { return PLAY_TEXT_MAP[play.toUpperCase()] || play }
function submitQuickBet() {
  if (!isAuthed.value) { Toast.warning('游客模式不可下单'); return }
  if (status.value === 'sealed') { Toast.warning('封盘中禁止下注'); return }
  try {
    const raw = parseQuickBet(quickText.value) as QuickBetItem[]
    if (!raw.length) throw new Error('格式不正确')
    Toast.success('已提交下单'); showDrawer.value = false
    const betsForBroadcast = raw.slice(0, 10).map(b => ({ label: playToLabel(b.play), amount: b.amount }))
    const line = betsForBroadcast.map(b => `${b.label}${b.amount}`).join('|')
    if (typeof (chat as any).botAnnounceBet === 'function') {
      ;(chat as any).botAnnounceBet({ nick: userNick.value, bets: betsForBroadcast })
    } else {
      chat.push({ id: String(Date.now()), type: 'bot', nick: 'CS28机器人', content: `${userNick.value}：${line}`, ts: Date.now() } as any)
    }
    quickText.value = ''
  } catch (e: any) {
    Toast.error(e.message || '下单失败')
  }
}

/* 生命周期 */
function addUnlockListeners() {
  window.addEventListener('click', unlockAudio, { passive: true })
  window.addEventListener('touchstart', unlockAudio, { passive: true })
}
function removeUnlockListeners() {
  window.removeEventListener('click', unlockAudio)
  window.removeEventListener('touchstart', unlockAudio)
}

async function fetchHistoryOnce() {
  history.value = await getHistory(CODE, 20)
}

onMounted(() => {
  fetchOdds()
  fetchLatest()            // 首次建立 baseline
  fetchHistoryOnce()
  startPoll()              // 轮询等待“最新结果”出现
  startTick()              // 启动倒计时心跳
  addUnlockListeners()
})
onUnmounted(() => {
  stopTick()
  stopPoll()
  removeUnlockListeners()
})

/* 顶部操作 */
function onCredit(){ Toast.info('信用') }
function onDesk(){ Toast.info('桌投') }
function onMore(){ Toast.info('更多') }
</script>

<style scoped>
/* —— 样式同前，略 —— */
.page { height: 100vh; display: flex; flex-direction: column; overflow: hidden; background: #edf3ff linear-gradient(180deg,#eef7ff,#f8fbff); padding-bottom: 128px; }
.topbar { display:flex; align-items:center; justify-content:space-between; padding: 10px 12px; background: linear-gradient(180deg,#35c0ff,#18a0ff); color: #fff; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,.08); }
.topbar .title { font-weight: 800; letter-spacing:.5px; }
.topbar .actions { display:flex; align-items:center; gap:12px; }
.topbar .online { display:flex; align-items:center; gap:4px; opacity:.95; }

.info-row { display:flex; align-items:center; justify-content:space-between; background:#fff; margin: 8px 12px 10px; padding:10px 12px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.04); }
.info-row .left { display:flex; align-items:center; gap:8px; color:#111827; }
.info-row .issue { font-weight: 700; }
.info-row .dot { opacity:.4; }
.info-row .cd { font-weight: 800; }
.info-row .divider { width:1px; height:22px; background:#e5e7eb; margin:0 10px; }
.info-row .right { color:#374151; }
.info-row .money { color:#ef4444; font-weight:800; margin-left:6px; }

.result-strip { display:flex; align-items:center; gap:8px; background:#fff; margin:0 12px 8px; padding:8px 10px; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,.04); }
.result-strip .res { display:grid; grid-template-columns:1fr auto; column-gap:10px; row-gap:4px; align-items:center; width:100%; min-width:0; }
.result-strip .label { min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#374151; font-weight:600; }
.result-strip .balls { display:flex; align-items:center; gap:6px; justify-self:end; white-space:nowrap; }
.result-strip .ball { width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; background:#19A0FF; color:#fff; font-weight:800; font-size:13px; }
.result-strip .ball.gray { background:#9CA3AF; }
.result-strip .plus, .result-strip .eq { opacity:.6; }
.result-strip .sum { font-weight:900; }
.result-strip .txt { font-weight:800; }
.result-strip .toggle { cursor:pointer; opacity:.8; transition:transform .2s ease; }
.result-strip .toggle.open { transform: rotate(180deg); }

.history-panel{ margin:0 12px 10px; background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,.06); overflow:hidden; }
.history-panel .thead, .history-panel .row{ display:grid; grid-template-columns:80px 120px 1fr; align-items:center; gap:8px; }
.history-panel .thead{ background:#f7f9fc; color:#374151; font-weight:700; font-size:13px; padding:10px 12px; border-bottom:1px solid #eef2f7; }
.history-panel .row{ padding:10px 12px; border-bottom:1px solid #f2f4f8; }
.history-panel .row:last-child{ border-bottom:none; }
.history-panel .issue-link{ color:#2563eb; cursor:pointer; }
.history-panel .time{ color:#6b7280; font-size:12px; }
.history-panel .result{ display:inline-flex; align-items:center; gap:6px; white-space:nowrap; }
.history-panel .result .ball{ width:22px; height:22px; border-radius:50%; background:#19A0FF; color:#fff; font-weight:800; font-size:12px; display:inline-flex; align-items:center; justify-content:center; }
.history-panel .result .ball.gray{ background:#9CA3AF; }
.history-panel .result .plus, .history-panel .result .eq{ opacity:.6; }
.history-panel .result .sum{ font-weight:900; }
.history-panel .result .txt{ font-weight:800; }
.history-panel .more{ text-align:center; color:#2563eb; padding:10px 12px; border-top:1px solid #eef2f7; display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; }

.slide-enter-active, .slide-leave-active { transition: all .2s ease; }
.slide-enter-from, .slide-leave-to { transform: translateY(-6px); opacity: 0; }

@media (max-width: 360px) {
  .history-panel .thead, .history-panel .row { grid-template-columns: 72px 100px 1fr; }
  .result-strip .res { grid-template-columns: 1fr; }
  .result-strip .balls { justify-self: start; }
}

.section-title { margin: 8px 16px 6px; font-weight: 700; color:#111827; }
.chat-main { flex:1; min-height:0; overflow:hidden; padding: 0 4px; }
.bottom-bar{ position: fixed; left: 0; right: 0; bottom: 0; height: 56px; background: rgba(255,255,255,.92); backdrop-filter: saturate(140%) blur(6px); border-top: 1px solid #eef2f7; display: grid; grid-template-columns: repeat(4,1fr); z-index: 8; }
.bar-item{ display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; background:transparent; border:none; font-size:12px; color:#374151; }
.bar-item .icon{ width:20px; height:20px; border-radius:10px; background:#e5f0ff; color:#2563eb; display:flex; align-items:center; justify-content:center; font-weight:800; }
.chat-input{ position: fixed; left: 0; right: 0; bottom: 56px; display: flex; gap: 10px; padding: 8px 12px; background: transparent; z-index: 9; }
.chat-input :deep(.t-input){ background:#ffffff; border-radius: 20px; padding: 4px 12px; box-shadow: 0 2px 10px rgba(17,24,39,.06); }
.chat-input.sealed :deep(.t-input){ opacity:.6; }
.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
.qb { display:grid; gap:8px; }
.cd-num { font-weight: 800; letter-spacing: 1px; }

.history-wrap { position: relative; margin: 0 12px 8px; }
.result-strip { margin: 0; }
.result-strip .txt, .history-panel .result .txt { font-size: 12px; white-space: nowrap; }
.result-strip .balls, .history-panel .result { gap: 4px; }
.history-panel.overlay {
  position: absolute;
  left: 0; right: 0; top: calc(100% + 6px);
  width: 100%;
  margin: 0;
  border-radius: 0;
  border-left: none;
  border-right: none;
  z-index: 30;
  max-height: 50vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
.history-wrap { position: relative; z-index: 30; }

.history-panel .thead, .history-panel .row, .history-panel .more { padding-left: 12px; padding-right: 12px; }
.slide-enter-active, .slide-leave-active { transition: all .18s ease; }
.slide-enter-from, .slide-leave-to { transform: translateY(-6px); opacity: 0; }
</style>

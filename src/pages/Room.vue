<template>
  <div class="page">
    <!-- 顶部导航（渐变蓝） -->
    <div class="topbar">
      <!-- 如需返回按钮，取消下面两行注释
      <t-icon name="chevron-left" size="20" @click="goBack" />
      -->
      <div class="title">加拿大28【4.2-4.6】</div>
      <div class="actions">
        <div class="online"><t-icon name="usergroup" size="18" /> {{ onlineCount }}</div>
        <t-icon name="more" size="20" />
      </div>
    </div>

    <!-- 信息行：倒计时 + 余额 -->
    <div class="info-row">
      <div class="left">
        <span class="issue">第 {{ currentIssue }} 期开奖</span>
        <span class="dot">|</span>
        <span class="cd"><span class="cd-num">{{ mmss }}</span></span>
      </div>
      <div class="divider"></div>
      <div class="right">
        <span>账户余额</span>
        <span class="money">{{ balance.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 结果条 + 悬浮历史面板（覆盖不占位） -->
    <div class="history-wrap">
      <div class="result-strip">
        <div class="res">
          <span class="label">第 {{ lastIssue ?? '-' }} 期开奖结果</span>
          <div class="balls">
            <span class="ball">{{ lastA }}</span>
            <span class="plus">+</span>
            <span class="ball">{{ lastB }}</span>
            <span class="plus">+</span>
            <span class="ball gray">{{ lastC }}</span>
            <span class="eq">=</span>
            <span class="sum">{{ lastSum }}</span>
            <span class="txt">{{ lastLabel }}</span>
          </div>
        </div>
        <t-icon
          name="chevron-down"
          size="18"
          class="toggle"
          :class="{ open: showHistory }"
          @click="showHistory = !showHistory"
        />
      </div>

      <!-- 悬浮覆盖的历史面板 -->
      <transition name="slide">
        <div v-show="showHistory" class="history-panel overlay">
          <div class="thead">
            <div>期号</div>
            <div>开奖时间</div>
            <div class="th-result">开奖结果</div>
          </div>
          <div class="row" v-for="r in history" :key="r.issue">
            <div class="issue-link" @click="goIssue(r.issue)">{{ r.issue }}</div>
            <div class="time">{{ r.time }}</div>
            <div class="result">
              <span class="ball">{{ r.a }}</span>
              <span class="plus">+</span>
              <span class="ball">{{ r.b }}</span>
              <span class="plus">+</span>
              <span class="ball gray">{{ r.c }}</span>
              <span class="eq">=</span>
              <span class="sum">{{ r.sum }}</span>
              <span class="txt">{{ r.label }}</span>
            </div>
          </div>
          <div class="more" @click="onMoreHistory">
            <t-icon name="search" size="16" /> 查看更多开奖记录
          </div>
        </div>
      </transition>
    </div>


    <!-- 聊天区 -->
    <div class="section-title">聊天室</div>
    <div class="chat-main">
      <ChatList
        :messages="messages"
        :hasMore="hasMore"
        :selfNick="userNick"
        @loadMore="loadMore"
      />
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar safe-area-bottom">
      <button class="bar-item" @click="onCredit"><span class="icon">信</span><span>信用</span></button>
      <button class="bar-item" @click="onDesk"><span class="icon">桌</span><span>桌投</span></button>
      <button class="bar-item" @click="showDrawer = true"><span class="icon">快</span><span>快投</span></button>
      <button class="bar-item" @click="onMore"><span class="icon">⋯</span><span>更多</span></button>
    </div>

    <!-- 输入区 -->
    <div class="chat-input" :class="{ sealed: status==='sealed' }">
      <t-input
        v-model="text"
        placeholder="输入文字指令下注"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'tdesign-mobile-vue'
// 如果你的项目里 t-icon 不是全局注册，请在 main 中做全局注册；此处模板继续使用 <t-icon />

import ChatList from '@/components/ChatList.vue'
import QuickBetDrawer from '@/components/QuickBetDrawer.vue'
import { parseQuickBet } from '@/utils/quickbet'
import type { QuickBetItem } from '@/utils/quickbet'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'

// ---------- 展开/收起 ----------
const showHistory = ref(false)

// ---------- 历史记录 ----------
type HistoryRow = {
  issue: number
  time: string
  a: number; b: number; c: number
  sum: number
  label: string
}
const history = ref<HistoryRow[]>([])

// 点击期号/查看更多（现在先占位）
function goIssue(issue: number) {
  // TODO: 接服务端后跳到具体期号详情
  // 例如：router.push({ name: 'issue-detail', params: { issue } })
  Toast.info(`期号 ${issue}（待接入）`)
}

function onMoreHistory() {
  // TODO: 接服务端后打开历史列表页
  // 例如：router.push({ name: 'issue-history' })
  Toast.info('更多历史（待接入）')
}


function composeLabel(sum: number) {
  const size = sum >= 14 ? '大' : '小'
  const parity = sum % 2 === 0 ? '双' : '单'
  return `${size}${parity}`
}
function upsertHistory(issueNum: number, a: number, b: number, c: number, sum: number, timeText?: string) {
  const t = timeText || new Date().toLocaleString()
  if (history.value.some(x => x.issue === issueNum)) return
  history.value.unshift({ issue: issueNum, a, b, c, sum, label: composeLabel(sum), time: t })
  if (history.value.length > 50) history.value.length = 50
}

// ---------- 顶部返回（如不需要可忽略） ----------
const router = useRouter()
function goBack() { router.back() }

// ---------- 页面基础状态（演示） ----------
const onlineCount = ref(1556)
const balance = ref(18888.88)

// ---------- 【开奖采集：JND28】 ----------
// 原：const FEED_URL = '/lotto/data/last/jnd28.json'
const FEED_URL = `${import.meta.env.VITE_LOTTO_PREFIX}/data/last/jnd28.json`

const PERIOD_MS = 210_000 // 3 分半
const SEAL_MS = 15_000    // 封盘 15s

const lastIssue = ref<number | null>(null)
const lastA = ref(0)
const lastB = ref(0)
const lastC = ref(0)
const lastSum = computed(() => lastA.value + lastB.value + lastC.value)
const lastLabel = ref('')
// [新增] 记录已播报的期号，避免重复播报
const lastAnnouncedIssue = ref<number | null>(null)
const currentIssue = computed(() => (lastIssue.value ?? 0) + 1)

const nextOpenAt = ref<number>(Date.now() + PERIOD_MS)
const timeLeft = ref<number>(0)
const mmss = computed(() => {
  const t = Math.max(0, timeLeft.value)
  const m = Math.floor(t / 60000)
  const s = Math.floor((t % 60000) / 1000)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
})
const status = computed<'open'|'sealed'>(() => timeLeft.value <= SEAL_MS ? 'sealed' : 'open')

function parseBalls(v?: string) {
  if (!v) return [0,0,0]
  const s = v.replace(/\+/g, ',').split(',').map(x => Number(x.trim()))
  return [s[0]||0, s[1]||0, s[2]||0]
}

async function fetchLatest() {
  try {
    const res = await fetch(`${FEED_URL}?_=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`http ${res.status}`)
    const data = await res.json() as any

    const issueNum = Number(data.issue || data.qihao || 0)
    lastIssue.value = issueNum

    const [ballA, ballB, ballC] = parseBalls(data.code || data.opennum)
    lastA.value = ballA
    lastB.value = ballB
    lastC.value = ballC

    const sum = Number(data.sum ?? (ballA + ballB + ballC))
    lastLabel.value = composeLabel(sum)

    const refMs =
      (Number(data.draw_time) ? Number(data.draw_time) * 1000 : 0) ||
      new Date(data.opentime || data.time).getTime()

    // 计算下一次开奖时间
    let nextMs: number
    const now = Date.now()
    if (refMs > now - 1000) {
      nextMs = refMs
    } else {
      nextMs = refMs + PERIOD_MS
      if (nextMs <= now) {
        const k = Math.floor((now - refMs) / PERIOD_MS) + 1
        nextMs = refMs + k * PERIOD_MS
      }
    }
    nextOpenAt.value = nextMs
    tick()

    // ✅ 将最新一期加入“开奖记录”
    upsertHistory(issueNum, ballA, ballB, ballC, sum, String(data.time || data.opentime || ''))

    // ✅ 推送“机器人开奖播报”消息（同一期只播一次）
    const timeText = String(data.time || data.opentime || new Date().toLocaleString())
    if (issueNum && lastAnnouncedIssue.value !== issueNum) {
      chat.push({
        id: `robot_${issueNum}_${Date.now()}`,
        type: 'robot_draw',
        nick: 'CS28机器人',
        ts: Date.now(),
        payload: {
          issue: String(issueNum),
          nums: [ballA, ballB, ballC],
          sum: sum,
          label: composeLabel(sum),
          openedAt: timeText,
        }
      } as any)
      lastAnnouncedIssue.value = issueNum
    }

  } catch (err) {
    console.warn('[jnd28] fetch error:', err)
  }
}

// ---------- 定时心跳/拉取 ----------
let tickTimer: number | undefined
function tick() { timeLeft.value = Math.max(0, nextOpenAt.value - Date.now()) }
function startTick() { stopTick(); tickTimer = window.setInterval(tick, 1000) as unknown as number }
function stopTick() { if (tickTimer) { clearInterval(tickTimer); tickTimer = undefined } }

let pollTimer: number | undefined
function startPoll() { stopPoll(); pollTimer = window.setInterval(fetchLatest, 10_000) as unknown as number }
function stopPoll() { if (pollTimer) { clearInterval(pollTimer); pollTimer = undefined } }

watch(timeLeft, (v) => { if (v === 0) setTimeout(fetchLatest, 1500) })

// ---------- Store & 聊天 ----------
const auth = useAuthStore()
const chat = useChatStore()
const isAuthed = computed(() => auth.isAuthed ?? true)
const userNick = computed(() => auth.user?.nick || '测试用户')
const messages = computed(() => chat.messages)
const hasMore = computed(() => chat.hasMore)

const text = ref('')
function loadMore() {
  const now = Date.now()
  const more = Array.from({ length: 8 }).map((_, i) => ({
    id: 'h' + now + i,
    type: 'user',
    nick: '历史',
    content: '历史消息 ' + (i + 22),
    ts: now - (i + 1) * 60 * 1000,
    vip: (i % 4) + 1,
  }))
  chat.prepend(more as any)
}
function sendChat() {
  if (status.value === 'sealed') return
  if (!text.value.trim()) return
  chat.push({ id: String(Date.now()), type: 'user', nick: userNick.value, content: text.value, ts: Date.now(), self: true } as any)
  text.value = ''
}

// ---------- 快投 ----------
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

// ---------- 生命周期 ----------
onMounted(() => { fetchLatest(); startTick(); startPoll() })
onUnmounted(() => { stopTick(); stopPoll() })

// ---------- 顶部操作演示 ----------
function onCredit(){ Toast.info('信用') }
function onDesk(){ Toast.info('桌投') }
function onMore(){ Toast.info('更多') }
</script>

<style scoped>
/* —— 省略（与你现有样式保持一致） —— */
/* 你的原样式块已经是可用的，我只保留类名不变，方便无缝替换 */
.page { height: 100vh; display: flex; flex-direction: column; overflow: hidden; background: #edf3ff linear-gradient(180deg,#eef7ff,#f8fbff); padding-bottom: 128px; }
/* 顶部 */
.topbar { display:flex; align-items:center; justify-content:space-between; padding: 10px 12px; background: linear-gradient(180deg,#35c0ff,#18a0ff); color: #fff; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,.08); }
.topbar .title { font-weight: 800; letter-spacing:.5px; }
.topbar .actions { display:flex; align-items:center; gap:12px; }
.topbar .online { display:flex; align-items:center; gap:4px; opacity:.95; }
/* 信息行 */
.info-row { display:flex; align-items:center; justify-content:space-between; background:#fff; margin: 8px 12px 10px; padding:10px 12px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.04); }
.info-row .left { display:flex; align-items:center; gap:8px; color:#111827; }
.info-row .issue { font-weight: 700; }
.info-row .dot { opacity:.4; }
.info-row .cd { font-weight: 800; }
.info-row .divider { width:1px; height:22px; background:#e5e7eb; margin:0 10px; }
.info-row .right { color:#374151; }
.info-row .money { color:#ef4444; font-weight:800; margin-left:6px; }
/* 结果条 */
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
/* 历史面板 */
.history-panel{ margin:0 12px 10px; background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,.06); overflow:hidden; }
.history-panel .thead, .history-panel .row{ display:grid; grid-template-columns:80px 120px 1fr; align-items:center; gap:8px; }
.history-panel .thead{ background:#f7f9fc; color:#374151; font-weight:700; font-size:13px; padding:10px 12px; border-bottom:1px solid #eef2f7; }
.history-panel .row{ padding:10px 12px; border-bottom:1px solid #f2f4f8; }
.history-panel .row:last-child{ border-bottom:none; }
.history-panel .issue-link{ color:#2563eb; cursor:pointer; }
.history-panel .time{ color:#6b7280; font-size:12px; }
.history-panel .result{ display:inline-flex; align-items:center; gap:6px; white-space:nowrap; }
.history-panel .result .ball{ width:22px; height:22px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; background:#19A0FF; color:#fff; font-weight:800; font-size:12px; }
.history-panel .result .ball.gray{ background:#9CA3AF; }
.history-panel .result .plus, .history-panel .result .eq{ opacity:.6; }
.history-panel .result .sum{ font-weight:900; }
.history-panel .result .txt{ font-weight:800; }
.history-panel .more{ text-align:center; color:#2563eb; padding:10px 12px; border-top:1px solid #eef2f7; display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; }
/* 动效 */
.slide-enter-active, .slide-leave-active { transition: all .2s ease; }
.slide-enter-from, .slide-leave-to { transform: translateY(-6px); opacity: 0; }
/* 自适应 */
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

/* 外层定位容器：占位只留结果条本身 */
.history-wrap {
  position: relative;
  margin: 0 12px 8px;  /* 把原来 result-strip 的外边距提到容器上 */
}

/* 原 result-strip 取消外边距，交给 .history-wrap 控制 */
.result-strip {
  margin: 0; /* 原来是 0 12px 8px；现在由 .history-wrap 负责 */
}

/* 缩小大小单双字体 */
.result-strip .txt,
.history-panel .result .txt {
  font-size: 12px;   /* 默认 14~15px，调小一点 */
  white-space: nowrap;
}

.result-strip .balls,
.history-panel .result {
  gap: 4px;   /* 默认 6px，缩小间距 */
}


/* 悬浮覆盖面板：绝对定位到结果条下方 */
.history-panel.overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 6px);
  width: 100%;             /* 占满整个屏幕宽度 */
  margin: 0;               /* 去掉原来的 margin */
  border-radius: 0;         /* 如果想和两边对齐，圆角也去掉 */
  border-left: none;
  border-right: none;
  z-index: 20;
}

/* 内部内容可保持你原来的 padding */
.history-panel .thead,
.history-panel .row,
.history-panel .more {
  padding-left: 12px;
  padding-right: 12px;
}


/* 如果你想在展开时禁用背后点击，可加一个简易遮罩（可选）
.history-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.08); z-index: 19;
} */

/* 展开/收起动效：覆盖层位移+淡入淡出 */
.slide-enter-active, .slide-leave-active { transition: all .18s ease; }
.slide-enter-from, .slide-leave-to { transform: translateY(-6px); opacity: 0; }

</style>
